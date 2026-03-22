import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden">
      {/* Background decorations - Fixed to prevent overflow */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 mb-8 rounded-full bg-blue-50/80 dark:bg-blue-900/40 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest border border-blue-100/50 dark:border-blue-800/50 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Full Stack Developer | Building Scalable Web Apps
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
