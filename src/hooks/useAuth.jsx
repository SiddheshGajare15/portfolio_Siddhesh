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
        .select('id, email, is_premium, premium_expires_at, created_at')
        .eq('id', userId)
        .single();

      if (data) {
        const now = new Date();
        let premiumActive = data.is_premium;

        if (data.premium_expires_at) {
          const expiresAt = new Date(data.premium_expires_at);
          if (expiresAt <= now) {
            premiumActive = false;
            await supabase.from('users').update({ is_premium: false }).eq('id', userId);
          }
        }

        setDbUser({ ...data, is_premium: premiumActive });
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

  const signup = async (email, password) => {
    if (!email || !password) {
      return { error: new Error('Email and password are required.') };
    }

    // Check if user already exists in user profile table
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingError) {
      console.error('signup existing user check error:', existingError);
    }

    if (existingUser) {
      return { error: new Error('A user with this email already exists. Please login.') };
    }

    const result = await supabase.auth.signUp({ email, password });
    if (result.error) {
      const msg = result.error.message.toLowerCase();
      if (msg.includes('already registered') || msg.includes('duplicate')) {
        return { error: new Error('A user with this email already exists. Please login.') };
      }
      return { error: result.error };
    }

    // If email confirmation is required, tell user to verify email.
    if (result.data?.user?.email_confirmed_at === null || result.data?.user?.email_confirmed_at === undefined) {
      return { data: result.data, message: 'Signup successful. Please verify your email before login.' };
    }

    return result;
  };

  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, dbUser, isPremium, loading, login, signup, logout, refreshDbUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
