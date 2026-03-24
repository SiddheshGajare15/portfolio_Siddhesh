import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, is_premium, created_at')
        .eq('id', userId)
        .single();

      if (data) {
        setDbUser(data);
        return;
      }

      // If user row doesn't exist (406 PGRST116), try to create it
      if (error?.code === 'PGRST116') {
        const session = await supabase.auth.getSession();
        if (session?.data?.session?.user?.email) {
          const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert({
              id: userId,
              email: session.data.session.user.email,
            })
            .select()
            .single();

          if (insertData) {
            setDbUser(insertData);
          } else if (insertError) {
            // If insert also fails (e.g., RLS issue), wait for trigger to create it
            console.warn('useAuth: Could not insert user row, waiting for trigger:', insertError.message);
            // Retry fetch after a short delay
            setTimeout(() => {
              supabase
                .from('users')
                .select('id, email, is_premium, created_at')
                .eq('id', userId)
                .single()
                .then(({ data: retryData }) => {
                  if (retryData) setDbUser(retryData);
                });
            }, 1000);
          }
        }
      } else if (error) {
        console.error('useAuth: Error fetching user row:', error.message);
      }
    } catch (err) {
      console.error('useAuth: Unexpected error in fetchUserData:', err);
    }
  }, []);

  useEffect(() => {
    // Check initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
      else setLoading(false);
    });

    // Listen for auth state changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) {
        fetchUserData(authUser.id).finally(() => setLoading(false));
      } else {
        setDbUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  // Expose so UI can manually re-fetch premium status after payment
  const refreshDbUser = useCallback(() => {
    if (user) fetchUserData(user.id);
  }, [user, fetchUserData]);

  const isPremium = dbUser?.is_premium === true;

  const login = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signup = (email, password) =>
    supabase.auth.signUp({ email, password });

  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, dbUser, isPremium, loading, login, signup, logout, refreshDbUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
