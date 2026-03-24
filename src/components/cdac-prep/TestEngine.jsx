import React, { useState, useEffect, useRef, useCallback } from 'react';
import { shuffle } from './questions'; // Fisher-Yates shuffle
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronLeft, ChevronRight, Bookmark, Menu, Loader2, AlertCircle, Lock, ArrowRightCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';


const SECTION_DURATION = 3600; // 60 min in seconds per section


const TestEngine = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();

  // ── state ──────────────────────────────────────────────────────────────
  const [loading, setLoading]               = useState(true);
  const [accessDenied, setAccessDenied]     = useState(false);
  const [testTitle, setTestTitle]           = useState('Mock Test');
  const [testType, setTestType]             = useState('free');
  const [sections, setSections]             = useState({ A: [], B: [] });   // split questions
  const [isTwoSection, setIsTwoSection]     = useState(false);              // true for premium 100q tests

  // Current section: 'A' or 'B'
  const [currentSection, setCurrentSection] = useState('A');
  // Section A done flag (to lock section A after submission)
  const [sectionADone, setSectionADone]     = useState(false);
  const [showSectionTransition, setShowSectionTransition] = useState(false);

  // Within section
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [answers, setAnswers]               = useState({ A: {}, B: {} });  // keyed by section
  const [marked, setMarked]                 = useState({ A: {}, B: {} });

  const [timeLeft, setTimeLeft]             = useState(SECTION_DURATION);
  const [isSidebarOpen, setIsSidebarOpen]   = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting]     = useState(false);

  const timerRef   = useRef(null);
  const stateRef   = useRef({});
  stateRef.current = { answers, sections, currentSection, sectionADone };

  // ── fetch test (Supabase only — no local fallback) ─────────────────────
  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);

      // Double-check premium client-side before even calling DB
      const isPremiumId = !/^[0-9a-f]{8}-[0-9a-f]{4}/.test(testId)
        ? parseInt(testId, 10) >= 3          // Numeric demo ID heuristic
        : null;                               // UUIDs — determined by DB type field

      const { data, error } = await supabase
        .from('mock_tests')
        .select('id, title, type, duration, questions')
        .eq('id', testId)
        .single();

      if (error || !data) {
        // Could not load — either no row or RLS blocked it
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      // ── Security gate: client-side check BEFORE rendering any question ──
      if (data.type === 'premium' && !isPremium) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setTestTitle(data.title);
      setTestType(data.type);

      // ── Parse questions from { sectionA: [...], sectionB: [...] } ────────
      const raw = data.questions ?? {};
      const secA = Array.isArray(raw.sectionA) ? raw.sectionA : [];
      const secB = Array.isArray(raw.sectionB) ? raw.sectionB : [];
      const is2Sec = secA.length > 0 && secB.length > 0;

      setIsTwoSection(is2Sec);
      setSections({
        A: shuffle(secA),          // shuffle each section independently
        B: shuffle(secB),
      });

      // Single-section free test timer from DB duration
      if (!is2Sec) setTimeLeft((data.duration || 60) * 60);

      setLoading(false);
    };

    fetchTest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId, isPremium]);


  // ── timer ───────────────────────────────────────────────────────────────
  const handleSectionATimeout = useCallback(() => {
    clearInterval(timerRef.current);
    if (stateRef.current.isTwoSection) {
      // Force move to section B
      setSectionADone(true);
      setShowSectionTransition(true);
    } else {
      finishTest(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSectionBTimeout = useCallback(() => {
    clearInterval(timerRef.current);
    finishTest(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading || accessDenied) return;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (stateRef.current.currentSection === 'A' && isTwoSection) {
            handleSectionATimeout();
          } else {
            handleSectionBTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, accessDenied, currentSection]);

  // ── move to section B ────────────────────────────────────────────────────
  const proceedToSectionB = useCallback(() => {
    setShowSectionTransition(false);
    setCurrentSection('B');
    setCurrentIndex(0);
    setTimeLeft(SECTION_DURATION);
  }, []);

  // ── submit section A manually ─────────────────────────────────────────────
  const submitSectionA = useCallback(() => {
    clearInterval(timerRef.current);
    setSectionADone(true);
    setShowSectionTransition(true);
    setShowSubmitModal(false);
  }, []);

  // ── finalize test ────────────────────────────────────────────────────────
  const finishTest = useCallback(async (_auto = false) => {
    clearInterval(timerRef.current);
    setIsSubmitting(true);

    const { answers: ans, sections: secs } = stateRef.current;
    const allQs = [...(secs.A || []), ...(secs.B || [])];
    const allAns = { ...ans.A, ...ans.B };

    let correct = 0;
    allQs.forEach(q => { if (allAns[q.id] === q.correct) correct++; });

    const total = allQs.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const answeredCount = Object.keys(allAns).length;
    const accuracy = answeredCount > 0 ? Math.round((correct / answeredCount) * 100) : 0;
    // time_taken = total possible - time remaining (rough; both sections)
    const timeTaken = (isTwoSection ? SECTION_DURATION * 2 : SECTION_DURATION) - (stateRef.current.timeLeft ?? 0);

    // LocalStorage backup
    const localResult = { testId, scorePercent: score, score_count: correct, total, accuracy, timeTaken: Math.abs(timeTaken), timestamp: new Date().toISOString() };
    const saved = JSON.parse(localStorage.getItem('cdac_results') || '[]');
    saved.push(localResult);
    localStorage.setItem('cdac_results', JSON.stringify(saved));

    // Supabase insert
    if (user) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testId);
      await supabase.from('results').insert({
        user_id: user.id,
        test_id: isUuid ? testId : '00000000-0000-0000-0000-000000000001',
        score,
        total_questions: total,
        correct_answers: correct,
        accuracy,
        time_taken: Math.abs(timeTaken),
      });
    }

    navigate('/cdac-prep/results');
  }, [user, testId, isTwoSection, navigate]);

  // ── helpers ──────────────────────────────────────────────────────────────
  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const currentSectionQs = sections[currentSection] || [];
  const currentQuestion   = currentSectionQs[currentIndex];
  const currentAnswers    = answers[currentSection];
  const currentMarked     = marked[currentSection];

  const setAnswer = (qId, optIdx) =>
    setAnswers(prev => ({ ...prev, [currentSection]: { ...prev[currentSection], [qId]: optIdx } }));
  const toggleMark = (qId) =>
    setMarked(prev => ({ ...prev, [currentSection]: { ...prev[currentSection], [qId]: !prev[currentSection][qId] } }));

  const totalAnswered = Object.keys(answers.A).length + Object.keys(answers.B).length;

  // Keep stateRef updated with latest values
  stateRef.current.timeLeft = timeLeft;
  stateRef.current.isTwoSection = isTwoSection;

  // ── ACCESS DENIED ────────────────────────────────────────────────────────
  if (accessDenied) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6">
        <div className="text-center max-w-sm space-y-6">
          <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto"><Lock size={36} /></div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Premium Required</h1>
          <p className="text-slate-500 font-medium">This test is part of the premium series. Unlock all 5 tests for ₹299.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/cdac-prep/premium-tests')} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-lg transition-all">
              View Premium Plans
            </button>
            <button onClick={() => navigate('/cdac-prep/free-tests')} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-2xl">
              Try Free Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading || currentSectionQs.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="font-bold text-slate-500 text-lg">Preparing your test…</p>
      </div>
    );
  }

  // ── SECTION TRANSITION SCREEN ─────────────────────────────────────────────
  if (showSectionTransition) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md space-y-6"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <ArrowRightCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Section A Complete!</h2>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">
            Section A has been submitted. You answered{' '}
            <strong className="text-slate-800 dark:text-slate-200">{Object.keys(answers.A).length}</strong> of {sections.A.length} questions.
          </p>
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-left space-y-2">
            <p className="font-black text-slate-900 dark:text-white text-sm">Section B – Computer Science Topics</p>
            <p className="text-slate-500 text-sm font-medium">{sections.B.length} Questions · 60 Minutes</p>
          </div>
          <button
            onClick={proceedToSectionB}
            className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/25 flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            Start Section B <ArrowRightCircle size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  // ── MAIN TEST UI ──────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[1500] bg-white dark:bg-slate-950 flex flex-col">

      {/* HEADER */}
      <header className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 px-5 sm:px-8 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setIsSidebarOpen(v => !v)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex-shrink-0">
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                Section {currentSection}
              </span>
              {isTwoSection && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full">
                  {currentSection === 'A' ? '50Q · Aptitude' : '50Q · CS Topics'}
                </span>
              )}
            </div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white truncate">{testTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Timer */}
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {isTwoSection ? `Section ${currentSection}` : ''} Time
            </p>
            <p className={`text-xl sm:text-2xl font-black tabular-nums font-mono leading-none ${
              timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-900 dark:text-white'
            }`}>
              {formatTime(timeLeft)}
            </p>
          </div>

          {/* Submit / Next Section button */}
          {isTwoSection && currentSection === 'A' ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-sm flex items-center gap-1.5 transition-all"
            >
              <ArrowRightCircle size={15} /> Section B
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-sm flex items-center gap-1.5 transition-all"
            >
              <Send size={15} /> Submit
            </button>
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="flex-grow flex overflow-hidden">

        {/* Question area */}
        <div className="flex-grow overflow-y-auto p-5 sm:p-8 lg:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Q row */}
            <div className="flex justify-between items-center">
              <span className="px-4 py-2 bg-primary/10 text-primary font-black rounded-xl text-sm">
                Q {currentIndex + 1} / {currentSectionQs.length}
              </span>
              <button
                onClick={() => toggleMark(currentQuestion.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-sm transition-all ${
                  currentMarked[currentQuestion.id]
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Bookmark size={14} fill={currentMarked[currentQuestion.id] ? 'currentColor' : 'none'} />
                {currentMarked[currentQuestion.id] ? 'Marked' : 'Mark'}
              </button>
            </div>

            {/* Question */}
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
              {currentQuestion.question}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => {
                const sel = currentAnswers[currentQuestion.id] === i;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswer(currentQuestion.id, i)}
                    className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 font-bold text-left transition-all ${
                      sel
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${
                      sel ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Palette sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:block flex-shrink-0 border-l border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-y-auto"
            >
              <div className="p-5 space-y-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Section {currentSection} Palette
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {currentSectionQs.map((q, i) => {
                    const isAns = currentAnswers[q.id] !== undefined;
                    const isMkd = currentMarked[q.id];
                    const isCur = currentIndex === i;
                    let cls = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400';
                    if (isCur)           cls = 'bg-primary text-white border-primary shadow-md shadow-primary/25';
                    else if (isAns && isMkd) cls = 'bg-purple-500 text-white border-purple-600';
                    else if (isMkd)     cls = 'bg-amber-400 text-white border-amber-500';
                    else if (isAns)     cls = 'bg-emerald-500 text-white border-emerald-600';
                    return (
                      <button key={q.id} onClick={() => setCurrentIndex(i)} className={`w-10 h-10 rounded-xl font-bold text-xs border-2 flex items-center justify-center transition-all ${cls}`}>
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2.5">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Legend</p>
                  {[
                    { c: 'bg-emerald-500', l: 'Answered' },
                    { c: 'bg-amber-400',   l: 'Marked' },
                    { c: 'bg-purple-500',  l: 'Ans & Marked' },
                    { c: 'bg-slate-200 dark:bg-slate-700', l: 'Not Visited' },
                  ].map(({ c, l }) => (
                    <div key={l} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <div className={`w-4 h-4 rounded flex-shrink-0 ${c}`} /> {l}
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Answered</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {Object.keys(currentAnswers).length}
                    <span className="text-slate-400 font-bold text-sm"> / {currentSectionQs.length}</span>
                  </p>
                  <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${(Object.keys(currentAnswers).length / currentSectionQs.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Section progress (two-section only) */}
                {isTwoSection && (
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sections</p>
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 text-xs font-bold ${currentSection === 'A' ? 'text-primary' : 'text-emerald-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${currentSection === 'A' ? 'bg-primary animate-pulse' : 'bg-emerald-500'}`} />
                        Section A {sectionADone ? '— Done' : '— Active'}
                      </div>
                      <div className={`flex items-center gap-2 text-xs font-bold ${currentSection === 'B' ? 'text-primary' : 'text-slate-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${currentSection === 'B' ? 'bg-primary animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                        Section B {currentSection === 'B' ? '— Active' : '— Locked'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <footer className="flex-shrink-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-5 sm:px-8 py-3.5 flex justify-between items-center">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(p => p - 1)}
          className="flex items-center gap-2 px-5 py-3 font-black text-slate-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <ChevronLeft size={18} /> Prev
        </button>

        <span className="text-xs font-bold text-slate-400 hidden sm:block">
          {Object.keys(currentAnswers).length} / {currentSectionQs.length} answered
        </span>

        {currentIndex === currentSectionQs.length - 1 ? (
          <button
            onClick={() => setShowSubmitModal(true)}
            className={`flex items-center gap-2 px-6 py-3 font-black rounded-xl shadow-lg text-sm transition-all text-white ${
              isTwoSection && currentSection === 'A' ? 'bg-indigo-600' : 'bg-primary'
            }`}
          >
            {isTwoSection && currentSection === 'A' ? 'Finish Section A' : 'Review & Submit'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(p => p + 1)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-xl shadow-lg transition-all text-sm"
          >
            Next <ChevronRight size={18} />
          </button>
        )}
      </footer>

      {/* Submit / Section transition modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center space-y-6"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                isTwoSection && currentSection === 'A' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {isTwoSection && currentSection === 'A' ? <ArrowRightCircle size={32} /> : <AlertCircle size={32} />}
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {isTwoSection && currentSection === 'A' ? 'Finish Section A?' : 'Submit Final Test?'}
              </h2>

              <p className="text-slate-500 font-medium">
                {isTwoSection && currentSection === 'A'
                  ? `You answered ${Object.keys(answers.A).length} of ${sections.A.length} questions in Section A. This action is permanent — you cannot return to Section A.`
                  : `You answered ${totalAnswered} questions across both sections.`
                }
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={isTwoSection && currentSection === 'A' ? submitSectionA : () => finishTest(false)}
                  disabled={isSubmitting}
                  className={`w-full py-4 font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 text-white ${
                    isTwoSection && currentSection === 'A' ? 'bg-indigo-600' : 'bg-primary shadow-primary/25'
                  }`}
                >
                  {isSubmitting
                    ? <Loader2 className="animate-spin" />
                    : (isTwoSection && currentSection === 'A' ? 'Confirm & Go to Section B' : 'Finish & View Results')
                  }
                </button>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="w-full py-4 bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-white rounded-2xl"
                >
                  {isTwoSection && currentSection === 'A' ? 'Continue Section A' : 'Continue Test'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestEngine;
