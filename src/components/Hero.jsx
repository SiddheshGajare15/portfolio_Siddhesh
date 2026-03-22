import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorations - Using fixed max-width constraints to prevent any possible overflow */}
      <div className="absolute top-[10%] -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[10%] -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10 px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full max-w-[100vw] flex flex-col items-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center px-3 py-1.5 mb-8 rounded-full bg-blue-50/80 dark:bg-blue-900/40 text-primary font-bold text-[8px] sm:text-[10px] uppercase tracking-wider border border-blue-100/50 dark:border-blue-800/50 backdrop-blur-md max-w-[90vw] text-center"
          >
            <span className="shrink-0 relative flex h-1.5 w-1.5 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
            </span>
            <span className="truncate">Full Stack Dev | Scaling Web Solutions</span>
          </motion.div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Siddhesh Gajare</span>
            <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400 mt-6 mt-4">
              Full Stack Developer
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-12 leading-relaxed px-2">
            Building scalable web applications with clean and efficient code. Turning complex problems into elegant, user-friendly solutions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#projects"
            className="px-8 py-3.5 rounded-full bg-primary text-white font-medium hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-lg shadow-blue-500/30 text-center"
          >
            View Projects
          </a>
          <a
            href="#services"
            className="px-8 py-3.5 rounded-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 hover:-translate-y-1 transition-all shadow-sm text-center"
          >
            Hire Me
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
