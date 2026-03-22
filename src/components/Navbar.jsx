import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaBars, FaTimes, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSectionNavigation } from '../hooks/useSectionNavigation';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Interview Prep', href: '#interview-prep', id: 'interview-prep' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const sectionIds = navLinks.map(link => link.id);
  const { activeSection, scrollToSection } = useSectionNavigation(sectionIds);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    // Smooth scroll with a small delay for menu exit
    setTimeout(() => {
      scrollToSection(id);
    }, 150);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/10 dark:border-slate-800/10' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-10">
        <div className="flex justify-between items-center h-12">
          {/* Brand Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <a 
              href="#home" 
              onClick={(e) => handleLinkClick(e, 'home')}
              className="text-xl sm:text-2xl font-black tracking-tighter text-gray-900 dark:text-white flex items-center group cursor-pointer"
            >
              <div className="bg-primary text-white w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mr-1.5 sm:mr-2 shadow-lg shadow-primary/30 group-hover:rotate-6 transition-transform">S</div>
              <span className="group-hover:text-primary transition-colors">SG.</span>
            </a>
          </motion.div>

          {/* Desktop Navigation skipped for brevity - unchanged logic but ensuring flex spacing */}
          <div className="hidden lg:flex items-center space-x-1 lg:space-x-2">
            {navLinks.filter(l => l.id !== 'home').map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-full
                  ${activeSection === link.id 
                    ? 'text-primary' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50'}`}
              >
                {link.name}
                {activeSection === link.id && (
                  <motion.span
                    layoutId="desktopActive"
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
            
            <div className="h-6 w-px bg-gray-200 dark:bg-slate-800 mx-4" />
            
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-primary transition-all shadow-inner"
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun size={18} className="text-yellow-400" /> : <FaMoon size={18} />}
            </button>
          </div>

          {/* Mobile Buttons - Improved Spacing to prevent cutoff */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-3">
             <button
              onClick={toggleDarkMode}
              className="min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 active:scale-95 transition-all border border-gray-100 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun size={18} className="text-yellow-400" /> : <FaMoon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center rounded-xl bg-primary/10 text-primary active:scale-95 transition-all border border-primary/20"
              aria-label="Open Menu"
            >
              <FaBars size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-white dark:bg-slate-900 z-[200] lg:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex justify-between items-center h-24 px-6 sm:px-10 border-b border-gray-100 dark:border-slate-800">
               <div className="flex items-center">
                 <div className="bg-primary text-white w-9 h-9 rounded-xl flex items-center justify-center mr-2 shadow-lg shadow-primary/30">S</div>
                 <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">SG.</span>
               </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3.5 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white active:rotate-90 transition-transform duration-300"
              >
                <FaTimes size={26} />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex-1 flex flex-col justify-center items-center px-10">
              <div className="w-full max-w-sm flex flex-col items-center space-y-4">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={`group w-full py-5 text-center text-2xl font-black rounded-3xl transition-all relative overflow-hidden
                      ${activeSection === link.id 
                        ? 'bg-primary text-white shadow-2xl shadow-primary/30' 
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {activeSection === link.id && (
                       <motion.div 
                          layoutId="mobileActiveIndicator"
                          className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600" 
                       />
                    )}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-10 border-t border-gray-100 dark:border-slate-800 flex flex-col items-center gap-8">
               <div className="flex gap-10">
                  <a href="https://linkedin.com/in/siddhesh-g-4823a222a" target="_blank" className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 text-gray-500 hover:text-[#0077b5] transition-all transform hover:-translate-y-1">
                     <FaLinkedin size={28} />
                  </a>
                  <a href="https://github.com/SiddheshGajare15" target="_blank" className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all transform hover:-translate-y-1">
                     <FaGithub size={28} />
                  </a>
                  <a href="https://www.instagram.com/siddhesh_gajare_45/" target="_blank" className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 text-gray-500 hover:text-[#dc2743] transition-all transform hover:-translate-y-1">
                     <FaInstagram size={28} />
                  </a>
               </div>
               <p className="text-gray-400 dark:text-gray-600 text-xs font-bold uppercase tracking-[0.3em]">
                  Let's Build Something Great
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
