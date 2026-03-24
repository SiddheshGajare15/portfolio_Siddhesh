import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Award, Target, Clock, Zap, Play, FileText, ChevronRight, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const CDACDashboard = () => {
  const navigate = useNavigate();
  const { user, dbUser, loading } = useAuth();
  const [stats, setStats] = useState({
    totalTests: 0,
    lastScore: 0,
  });
  const [recentAttempts, setRecentAttempts] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const { data: results, error } = await supabase
        .from('results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (results && results.length > 0) {
        setStats({
          totalTests: results.length,
          lastScore: results[0].score,
        });
        setRecentAttempts(results.slice(0, 5));
      }
    };

    fetchStats();
  }, [user]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black">Loading Dashboard...</div>;

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 lg:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50">
        <div>
           <h2 className="text-3xl font-black text-slate-900 dark:text-white">Welcome, {user?.email.split('@')[0]}!</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Ready for CCAT 2026?</p>
        </div>
        <Link to="/cdac-prep" className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-center">
           Continue Preparation
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
         <div className="p-8 pb-10 rounded-[3rem] bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
               <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                  <Play size={24} fill="currentColor" />
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Tests Attempted</p>
            <h3 className="text-5xl font-black text-slate-900 dark:text-white">{stats.totalTests}</h3>
         </div>
         
         <div className="p-8 pb-10 rounded-[3rem] bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
               <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
                  <Award size={24} />
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Last Score</p>
            <h3 className="text-5xl font-black text-slate-900 dark:text-white">{stats.lastScore}%</h3>
         </div>
      </div>

      <div className="space-y-6">
         <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <TrendingUp size={28} className="text-primary" />
            Recent Mock Activity
         </h3>
         
         <div className="space-y-4">
            {recentAttempts.length > 0 ? recentAttempts.map((attempt, i) => (
               <div key={attempt.id} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-between">
                  <div>
                     <p className="text-xs font-black text-slate-400 uppercase mb-1 tracking-widest">{new Date(attempt.created_at).toLocaleDateString()}</p>
                     <h4 className="text-lg font-bold text-slate-900 dark:text-white">Mock Test Attempt #{stats.totalTests - i}</h4>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-right sr-only sm:not-sr-only">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Accuracy</p>
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{attempt.accuracy || 0}%</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">Score</p>
                        <p className="text-3xl font-black text-primary">{attempt.score}%</p>
                     </div>
                  </div>
               </div>
            )) : (
              <div className="p-16 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]">
                 <p className="text-slate-400 font-bold text-xl mb-4 italic">No simulations attempted yet.</p>
                 <Link to="/cdac-prep" className="text-primary font-black flex items-center justify-center gap-2">Start First Test <Play size={16} fill="currentColor" /></Link>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default CDACDashboard;
