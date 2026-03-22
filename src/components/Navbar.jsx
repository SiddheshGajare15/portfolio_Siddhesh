import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    scrollToSection(id);
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200/20 dark:border-slate-800/20' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        <div className="flex justify-between items-center h-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={(e) => handleLinkClick(e, 'home')}
            className="flex-shrink-0 font-extrabold text-2xl tracking-tighter text-primary cursor-pointer drop-shadow-sm select-none"
          >
            SG<span className="text-indigo-500">.</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-1 lg:space-x-2 mr-6 px-2 py-1.5 bg-gray-100/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-gray-200/20 dark:border-slate-700/20 shadow-sm">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeSection === link.id ? 'text-white' : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'}`}
                >
                  {activeSection === link.id && (
                    <motion.span
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/40 z-[-1]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {link.name}
                </a>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-3.5 rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-md border border-gray-200/50 dark:border-slate-700/50 ml-2"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </motion.button>
          </div>

          {/* Mobile Menu Button - Improved for Visibility & Touch Area */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-slate-700 transition-transform active:scale-95"
              aria-label="Toggle Theme"
            >
              {darkMode ? <FaSun className="text-yellow-400" size={18} /> : <FaMoon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-primary bg-primary/10 dark:bg-slate-800 dark:text-blue-400 shadow-sm border border-primary/20 dark:border-slate-700 transition-transform active:scale-95 focus:outline-none"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={isOpen}
              role="button"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[-1] md:hidden"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="md:hidden absolute top-full left-4 right-4 mt-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-6 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={`block px-6 py-5 rounded-2xl text-lg font-bold transition-all duration-300 ${activeSection === link.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{link.name}</span>
                      {activeSection === link.id && (
                        <motion.div 
                           layoutId="activeDot"
                           className="w-2.5 h-2.5 rounded-full bg-white shadow-sm ring-2 ring-white/20" 
                        />
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>


  );
};

export default Navbar;
