import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Clock, CheckCircle2, XCircle, Home, RotateCcw, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First try to load from Supabase if user is logged in
    const load = async () => {
      if (user) {
        const { data } = await supabase
          .from('results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (data) {
          setLatestResult(data);
          setLoading(false);
          return;
        }
      }

      // Fallback: localStorage (set by TestEngine after submit)
      const saved = JSON.parse(localStorage.getItem('cdac_results') || '[]');
      if (saved.length > 0) setLatestResult(saved[saved.length - 1]);
      setLoading(false);
    };
    load();
  }, [user]);

  const formatSec = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  if (loading) return (
    <div className="flex justify-center py-24">
      <Loader2 className="animate-spin text-primary" size={36} />
    </div>
  );

  if (!latestResult) {
    return (
      <div className="text-center py-24 px-6 max-w-lg mx-auto space-y-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <Award size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">No Results Yet</h2>
        <p className="text-slate-500 font-medium">Complete your first mock test to see results here.</p>
        <button
          onClick={() => navigate('/cdac-prep/free-tests')}
          className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/25 hover:scale-105 transition-all"
        >
          Start Mock Test
        </button>
      </div>
    );
  }

  // Normalize field names between Supabase result and localStorage result
  const score = latestResult.score ?? latestResult.scorePercent ?? 0;
  const correct = latestResult.correct_answers ?? latestResult.score_count ?? 0;
  const total = latestResult.total_questions ?? latestResult.total ?? 0;
  const accuracy = latestResult.accuracy ?? 0;
  const timeTaken = latestResult.time_taken ?? latestResult.timeTaken ?? 0;
  const createdAt = latestResult.created_at ?? latestResult.timestamp ?? null;

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Test Results</h2>
          {createdAt && (
            <p className="text-slate-400 font-medium text-sm mt-1">
              Completed on {new Date(createdAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard" className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-primary transition-colors shadow-sm">
            <Home size={20} />
          </Link>
          <button
            onClick={() => navigate('/cdac-prep/free-tests')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <RotateCcw size={16} /> Retake
          </button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden p-10 rounded-[2.5rem] bg-primary text-white shadow-2xl shadow-primary/30 text-center"
        >
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-2">Score</p>
          <h3 className="text-6xl font-black tabular-nums">{score}%</h3>
        </motion.div>

        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-center gap-3">
          <div className="flex items-center gap-3 text-emerald-600">
            <CheckCircle2 size={22} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Correct</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{correct}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-red-500">
            <XCircle size={22} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Incorrect</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{total > 0 ? total - correct : '—'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 text-purple-600 mb-2">
              <Target size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accuracy</p>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{accuracy}%</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Clock size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Taken</p>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{formatSec(timeTaken)}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => navigate('/cdac-prep/free-tests')}
          className="flex-1 py-5 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Try Another Test
        </button>
        <Link to="/dashboard" className="flex-1 py-5 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-black rounded-2xl text-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
