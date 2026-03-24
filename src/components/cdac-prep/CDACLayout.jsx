import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Rocket, Zap, History } from 'lucide-react';
import { motion } from 'framer-motion';

const CDACLayout = () => {
  const location = useLocation();

  const subLinks = [
    { name: 'Free Tests', path: '/cdac-prep/free-tests', icon: <Rocket size={18} /> },
    { name: 'Premium Tests', path: '/cdac-prep/premium-tests', icon: <Zap size={18} /> },
    { name: 'My Results', path: '/cdac-prep/results', icon: <History size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-10 w-full">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">CDAC Prep</h1>
        <p className="text-slate-500 font-medium mt-1">CCAT 2026 Mock Test Platform</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 mb-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2 rounded-2xl w-fit">
        {subLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-md'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default CDACLayout;
