import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    // Increment and fetch genuine visitor count from CounterAPI
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch("https://api.counterapi.dev/v1/siddhesh-portfolio-visits/visit/up");
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch visitor count", error);
      }
    };
    
    fetchVisitorCount();
  }, []);

  return (
    <footer className="bg-white dark:bg-slate-900 py-8 border-t border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {visitorCount !== null && (
          <div className="mb-6 flex items-center gap-2 bg-gray-50 dark:bg-slate-800 px-5 py-2.5 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:-translate-y-1 transition-transform duration-300">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>Genuine Profile Views: <span className="text-primary font-bold text-base ml-1">{visitorCount}</span></span>
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Siddhesh Gajare. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
