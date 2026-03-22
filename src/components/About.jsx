import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="section-padding bg-gray-50/50 dark:bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-indigo-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-indigo-500/20 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-slate-800 relative z-10">
              <div className="flex gap-4 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="font-mono text-sm text-gray-600 dark:text-gray-400 space-y-4">
                <p><span className="text-primary">{'>'}</span> const engineer = {'{'}</p>
                <p className="pl-6">name: <span className="text-green-600 dark:text-green-400">'Siddhesh Gajare'</span>,</p>
                <p className="pl-6">role: <span className="text-green-600 dark:text-green-400">'Full Stack Developer'</span>,</p>
                <p className="pl-6">education: <span className="text-green-600 dark:text-green-400">'CDAC Certified'</span>,</p>
                <p className="pl-6">passion: <span className="text-green-600 dark:text-green-400">'Building scalable backends'</span></p>
                <p>{'};'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            <p>
              I am a <strong className="text-gray-900 dark:text-white">CDAC-certified Full Stack Developer</strong> with a strong foundation in modern web technologies and backend systems.
            </p>
            <p>
              My technical expertise spans across <strong className="text-gray-900 dark:text-white">Java, Spring Boot, .NET, React, and MySQL</strong>. I have a solid understanding of the Software Development Life Cycle (SDLC), Agile methodologies, and building robust REST APIs.
            </p>
            <p>
               I am passionate about creating clean, intuitive user interfaces and architecting scalable backend solutions that solve real-world problems.
            </p>

            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-primary text-2xl">🎓</span> Education & Training
              </h3>
              <div className="relative pl-6 border-l-2 border-primary/30 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-white dark:ring-slate-900"></div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">PG-DAC (CDAC)</h4>
                  <p className="text-primary font-medium mb-1">SunBeam Institute of Information Technology, Pune</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Intensive training focused on Full Stack Development and core Software Engineering concepts.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
