import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, ShieldCheck, Zap, ArrowRight, Star, Clock, CheckCircle2 } from 'lucide-react';

const CDACLanding = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "CDAC Mock Test 2026 | Free & Premium CCAT Preparation";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Practice CDAC CCAT mock tests online with real exam pattern. Free tests and premium test series available.");
    }
  }, []);

  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Real Exam Experience",
      description: "Timed tests designed to match the actual CCAT pattern and difficulty."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      title: "Instant Analysis",
      description: "Get detailed insights into your performance, accuracy, and weak areas."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
      title: "Trusted Content",
      description: "Questions curated by top performers and based on previous year trends."
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 py-20 px-6 sm:px-10 rounded-3xl mb-12 border border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold border border-blue-200 dark:border-blue-800"
          >
            <Star size={16} fill="currentColor" />
            <span>Success Rate: 92% for serious aspirants</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight"
          >
            Crack CDAC CCAT with <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent italic">Real Exam-Level</span> Mock Tests
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Practice timed tests, analyze performance, and improve accuracy with structured mock exams designed for the 2026 pattern.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={() => navigate('/cdac-prep/free-tests')}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2 group"
            >
              Start Free Mock Test
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/cdac-prep/premium-tests')}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              View Premium Plan
              <Zap size={20} className="text-yellow-500" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 pt-8 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <ShieldCheck size={18} className="text-green-500" />
              Based on previous exam patterns
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <Rocket size={18} className="text-purple-500" />
              Designed for serious aspirants
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (i * 0.1) }}
            className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary/30 transition-colors"
          >
            <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 w-fit">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default CDACLanding;
