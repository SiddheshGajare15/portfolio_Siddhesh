import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, Zap, Clock, BookOpen, Layers, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './PaymentModal';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

/** CCAT test structure displayed in UI (may come from DB or fallback) */
const FALLBACK_FREE = [
  { id: '1', title: 'Section A: General Aptitude & Logical Reasoning', duration: 60, questions_count: 50, badge: 'Free' },
  { id: '2', title: 'Section B: C Programming & Data Structures',       duration: 60, questions_count: 50, badge: 'Free' },
];

const FALLBACK_PREMIUM = [
  { id: '3', title: 'Full Length Mock Test 1 – CCAT 2026 Pattern',       duration: 120, questions_count: 100 },
  { id: '4', title: 'Full Length Mock Test 2 – Advanced Topics',          duration: 120, questions_count: 100 },
  { id: '5', title: 'Full Length Mock Test 3 – Previous Year Simulation', duration: 120, questions_count: 100 },
  { id: '6', title: 'Full Length Mock Test 4 – Mixed Difficulty',         duration: 120, questions_count: 100 },
  { id: '7', title: 'Full Length Mock Test 5 – Final Full Simulation',    duration: 120, questions_count: 100 },
];

const MockTestSection = ({ type }) => {
  const navigate = useNavigate();
  const { isPremium } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('mock_tests')
        .select('id, title, type, duration, questions')
        .eq('type', type)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setTests(data.map(t => ({
          ...t,
          questions_count: Array.isArray(t.questions) ? t.questions.length : (type === 'premium' ? 100 : 50),
        })));
      } else {
        setTests(type === 'free' ? FALLBACK_FREE : FALLBACK_PREMIUM);
      }
      setLoading(false);
    };
    fetchTests();
  }, [type]);

  const handleStart = (testId) => {
    if (type === 'premium' && !isPremium) {
      setShowPayment(true);
    } else {
      navigate(`/cdac-prep/test-engine/${testId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  /* ─────────────────────────── PREMIUM VIEW ─────────────────────────── */
  if (type === 'premium') {
    return (
      <div className="space-y-10">
        {/* Pricing card — single CTA */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden p-8 sm:p-10 rounded-[2.5rem] bg-slate-900 text-white"
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/30">
                  <Zap size={13} fill="currentColor" /> Premium Test Series
                </div>
                <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                  Unlock All 5 Mock Tests<br />
                  <span className="text-primary">for just ₹299</span>
                </h2>
                <div className="flex flex-wrap gap-4 pt-2">
                  {[
                    { icon: <BookOpen size={16} />, text: '5 Full-Length Tests' },
                    { icon: <Layers size={16} />,   text: '2 Sections per Test' },
                    { icon: <Clock size={16} />,    text: '120 min Each Test' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-slate-300 text-sm font-bold">
                      <span className="text-primary">{icon}</span> {text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full md:w-auto px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:bg-primary/95 hover:scale-105 transition-all text-base"
                >
                  <Zap size={20} fill="currentColor" />
                  Unlock All Tests — ₹299
                </button>
                <p className="text-slate-400 text-xs font-bold text-center mt-3">One-time payment · Lifetime access</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Premium active banner */}
        {isPremium && (
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-black text-emerald-800 dark:text-emerald-300">Premium Active</p>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">You have full access to all 5 mock tests.</p>
            </div>
          </div>
        )}

        {/* Test cards */}
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
            {isPremium ? 'Your Tests' : 'What\'s included'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tests.map((test, i) => {
              const locked = !isPremium;
              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`relative p-7 rounded-[2rem] border-2 transition-all ${
                    locked
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl hover:border-primary/40 hover:scale-[1.01]'
                  }`}
                >
                  {/* Lock */}
                  {locked && (
                    <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <Lock size={14} className="text-slate-400" />
                    </div>
                  )}

                  <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Mock Test {i + 1}</p>
                  <h4 className={`text-base font-bold leading-snug mb-5 pr-8 ${locked ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {test.title}
                  </h4>

                  {/* Metadata chips */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { label: '2 Sections' },
                      { label: `${test.questions_count} Questions` },
                      { label: `${test.duration} min` },
                    ].map(({ label }) => (
                      <span key={label} className={`px-3 py-1 rounded-full text-xs font-bold ${
                        locked
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {label}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleStart(test.id)}
                    className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                      locked
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-amber-500 hover:text-white'
                        : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/95'
                    }`}
                  >
                    {locked ? <><Lock size={14} /> Unlock to Start</> : <>Start Test <span className="opacity-70">→</span></>}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CCAT Structure info box */}
        <div className="p-6 sm:p-8 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
          <h4 className="font-black text-indigo-900 dark:text-indigo-300 mb-4 flex items-center gap-2">
            <Layers size={18} /> CCAT Exam Pattern
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold text-indigo-800 dark:text-indigo-400">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Section A</p>
              <p>50 Questions · 60 Minutes</p>
              <p className="text-indigo-500 text-xs mt-0.5">Quantitative Aptitude, Reasoning</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Section B</p>
              <p>50 Questions · 60 Minutes</p>
              <p className="text-indigo-500 text-xs mt-0.5">C, DS, OS, Networks, DBMS</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-indigo-500 font-bold italic">
            ⚡ Section A must be completed before Section B is unlocked — exactly like the real exam.
          </p>
        </div>

        <AnimatePresence>
          {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  /* ─────────────────────────── FREE VIEW ────────────────────────────── */
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Free Mock Tests</h2>
        <p className="text-slate-500 font-medium text-sm mt-1">2 section-level practice tests · No payment needed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test, i) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl hover:border-primary/40 hover:scale-[1.005] transition-all"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">
              Free
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5 leading-snug">{test.title}</h3>

            <div className="flex gap-4 mb-7">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Questions</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{test.questions_count}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Duration</p>
                <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock size={13} /> {test.duration} min
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/cdac-prep/test-engine/${test.id}`)}
              className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 flex items-center justify-center gap-2 transition-all"
            >
              Start Test <span className="opacity-70">→</span>
            </button>
          </motion.div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-black text-slate-900 dark:text-white">Want full-length simulations?</p>
          <p className="text-slate-500 text-sm font-medium">Get 5 complete CCAT mock tests for ₹299.</p>
        </div>
        <button
          onClick={() => navigate('/cdac-prep/premium-tests')}
          className="px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-xl flex items-center gap-2 text-sm hover:scale-105 transition-all flex-shrink-0"
        >
          <Zap size={16} fill="currentColor" className="text-amber-400" /> View Premium Plans
        </button>
      </div>
    </div>
  );
};

export default MockTestSection;
