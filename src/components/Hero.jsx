import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="min-h-[90vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[10%] -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[10%] -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center z-10 px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center px-4 py-2 mb-8 rounded-full bg-blue-50/80 dark:bg-blue-900/40 text-primary font-bold text-[10px] uppercase tracking-widest border border-blue-100/50 dark:border-blue-800/50 backdrop-blur-md"
          >
            <span className="shrink-0 relative flex h-2 w-2 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for New Projects
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
            Architecture for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-600">Digital Solutions</span>
          </h1>
          
          <p className="max-w-xl text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
            I am <strong className="text-gray-900 dark:text-white font-bold">Siddhesh Gajare</strong>, a Full Stack Developer dedicated to building robust, scalable applications that solve complex business challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              to="/projects"
              className="px-10 py-4 rounded-2xl bg-primary text-white font-black hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-xl shadow-primary/30 text-center"
            >
              Explore My Work
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 rounded-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 font-bold hover:bg-gray-50 dark:hover:bg-slate-700 hover:-translate-y-1 transition-all shadow-lg text-center"
            >
              Get In Touch
            </Link>
          </div>
        </motion.div>

        {/* Floating Visual Asset */}
        <motion.div
           initial={{ opacity: 0, scale: 0.8, x: 50 }}
           animate={{ opacity: 1, scale: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="hidden lg:flex justify-center relative"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
          <div className="relative p-4 rounded-[3rem] bg-white/5 dark:bg-slate-900/5 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden group">
            <motion.img 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               src="C:/Users/Shubham/.gemini/antigravity/brain/b8d116ba-68e2-4fc8-8809-a602ae959ffd/hero_tech_illustration_1774154870768.png" 
               alt="Modern Tech Illustration"
               className="w-full max-w-md rounded-[2.5rem] shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
