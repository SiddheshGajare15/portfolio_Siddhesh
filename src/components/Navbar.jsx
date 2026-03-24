import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, dbUser, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Interview Prep', path: '/interview-prep' },
    { name: 'CDAC Prep', path: '/cdac-prep' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/10' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center h-12">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group">
          <div className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-6 transition-transform font-black">S</div>
          <span className="ml-3 font-black text-xl text-slate-900 dark:text-white hidden sm:block tracking-tight">Siddhesh<span className="text-primary italic">.</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.filter(l => l.path !== '/').map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `relative px-4 py-2 text-sm font-bold transition-all rounded-full ${isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.span layoutId="nav-underline" className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full -z-10" />
              )}
            </NavLink>
          ))}
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-4" />

          {user ? (
            <div className="flex items-center gap-2">
               <NavLink 
                 to="/dashboard" 
                 className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-black rounded-xl shadow-xl shadow-slate-900/10 hover:scale-105 transition-all"
               >
                 <LayoutDashboard size={16} /> Dashboard
               </NavLink>
               <button 
                 onClick={handleLogout}
                 className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"
                 title="Logout"
               >
                 <LogOut size={18} />
               </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
               <Link to="/login" className="px-5 py-2.5 text-slate-600 dark:text-slate-300 text-sm font-bold hover:text-primary transition-colors">Login</Link>
               <Link to="/signup" className="px-6 py-2.5 bg-primary text-white text-sm font-black rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 hover:scale-105 transition-all">Sign Up</Link>
            </div>
          )}

          <button onClick={toggleDarkMode} className="ml-4 p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-all">
            {darkMode ? <FaSun size={18} className="text-yellow-400" /> : <FaMoon size={18} />}
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-500">
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
          <button onClick={() => setIsOpen(true)} className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <FaBars size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-0 h-screen bg-white dark:bg-slate-900 z-[200] lg:hidden flex flex-col p-6 pt-10 overflow-y-auto">
            <div className="flex justify-between items-center mb-12">
               <div className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center font-black">S</div>
               <button onClick={() => setIsOpen(false)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800"><FaTimes size={24} /></button>
            </div>

            <div className="flex flex-col gap-2">
               {navLinks.map((link) => (
                  <NavLink key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={({ isActive }) => `px-6 py-4 text-2xl font-black rounded-2xl ${isActive ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    {link.name}
                  </NavLink>
               ))}
               
               <div className="my-6 h-px bg-slate-100 dark:bg-slate-800" />
               
               {user ? (
                 <div className="space-y-3">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-center block rounded-2xl text-xl">Dashboard</Link>
                    <button onClick={handleLogout} className="w-full py-5 bg-red-50 dark:bg-red-900/10 text-red-600 font-black rounded-2xl text-xl">Logout</button>
                 </div>
               ) : (
                 <div className="space-y-3">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-center block rounded-2xl text-xl">Login</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full py-5 bg-primary text-white font-black text-center block rounded-2xl text-xl shadow-xl shadow-primary/20">Sign Up</Link>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
