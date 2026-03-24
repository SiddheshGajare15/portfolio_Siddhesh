import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import { FaRocket, FaCode, FaCheckCircle, FaLaptopCode, FaArrowRight, FaGraduationCap } from 'react-icons/fa';
import { Rocket } from 'lucide-react';

const HighLightCard = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl hover:-translate-y-2 transition-transform duration-300"
  >
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 text-2xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const Home = () => {
  return (
    <div className="w-full flex flex-col pt-4 sm:pt-6">
      {/* Top Announcement Banner */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-4"
      >
        <Link 
          to="/cdac-prep"
          className="group block p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-indigo-500/10 to-primary/10 border border-primary/20 hover:border-primary/40 transition-all text-center relative overflow-hidden"
        >
          <div className="flex items-center justify-center gap-3 font-bold text-primary dark:text-blue-400">
             <Rocket size={20} className="animate-bounce" />
             <span>🚀 CDAC Mock Test Platform Live – <span className="underline decoration-2 underline-offset-4">Start Free</span></span>
             <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </motion.div>

      <Hero />
      
      {/* Highlights Section */}
      <section className="py-32 bg-gray-50/50 dark:bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Practical <span className="text-primary italic">Web</span> Solutions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              I focus on building clean, functional applications using modern tech stacks like React, Java, and MySQL.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HighLightCard 
              icon={<FaRocket />}
              title="Fast & Responsive"
              desc="Websites that load quickly and look great on all devices, from mobile phones to desktops."
              delay={0.1}
            />
            <HighLightCard 
              icon={<FaCode />}
              title="Quality Code"
              desc="Writing clean, organized code that is easy to manage and update in the future."
              delay={0.2}
            />
            <HighLightCard 
              icon={<FaCheckCircle />}
              title="Full Development"
              desc="Handling everything from the initial design and database setup to the final live website."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CDAC Prep Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative p-10 md:p-16 rounded-[3rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden group"
           >
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <div className="p-3 bg-primary text-white w-fit rounded-2xl shadow-lg shadow-primary/20">
                       <FaGraduationCap size={32} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                       CDAC <span className="text-primary italic">Preparation</span> Hub
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-gray-400 font-medium leading-relaxed">
                       Crack the CCAT 2026 with our professional mock test platform. Designed for serious aspirants to simulate the real exam experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                       <Link 
                         to="/cdac-prep" 
                         className="flex items-center justify-center gap-2 group px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-primary/30"
                       >
                         Start Preparation <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Free Tests", val: "2", color: "text-blue-500" },
                      { label: "Premium SIMS", val: "5", color: "text-amber-500" },
                      { label: "Accuracy", val: "Analytics", color: "text-emerald-500" },
                      { label: "Updates", val: "2026", color: "text-purple-500" }
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none bg-gradient-to-br from-transparent to-slate-50 dark:to-slate-900/50">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                         <h4 className={`text-2xl font-black ${item.color}`}>{item.val}</h4>
                      </div>
                    ))}
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Modern Preview Section */}
      <section className="py-32 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10"></div>
              <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="flex gap-3 mb-12">
                   <div className="w-3 h-3 rounded-full bg-red-500" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500" />
                   <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-2/3 bg-slate-800 rounded-full" />
                  <div className="h-4 w-full bg-slate-800 rounded-full" />
                  <div className="h-4 w-4/5 bg-slate-800 rounded-full" />
                  <div className="h-40 w-full bg-slate-800 rounded-3xl mt-8 flex items-center justify-center text-slate-700">
                    <FaLaptopCode size={60} />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                Want to see my <span className="text-primary">Best Projects</span>?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                I've worked on various projects, from simple landing pages to complex academic and business tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                 <Link 
                   to="/projects"
                   className="flex items-center justify-center gap-2 group px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-primary/30"
                 >
                   View Portfolio <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Connect Today Banner */}
      <section className="py-20 px-4">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-primary to-indigo-600 text-white text-center relative overflow-hidden shadow-2xl shadow-primary/20"
         >
            <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-black mb-8 leading-[1.2]">
                 Have a project in mind?
               </h2>
               <Link 
                 to="/contact"
                 className="inline-block px-12 py-5 bg-white text-primary font-black rounded-2xl hover:bg-slate-50 transition-all transform hover:-translate-y-1 shadow-2xl"
               >
                 Contact Me Today
               </Link>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
         </motion.div>
      </section>
    </div>
  );
};

export default Home;
