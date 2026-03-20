import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 py-8 border-t border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Siddhesh Gajare. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
