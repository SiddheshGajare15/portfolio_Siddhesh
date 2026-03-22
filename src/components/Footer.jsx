import React, { useState, useEffect } from 'react';
import { FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 pt-16 pb-8 border-t border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Siddhesh <span className="text-primary">Gajare</span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
              Building scalable web solutions with a focus on clean code and user experience.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://linkedin.com/in/siddhesh-g-4823a222a" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-colors p-2" aria-label="LinkedIn">
              <FaLinkedin size={22} />
            </a>
            <a href="https://www.instagram.com/siddhesh_gajare_45/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#dc2743] transition-colors p-2" aria-label="Instagram">
              <FaInstagram size={22} />
            </a>
            <a href="https://github.com/SiddheshGajare15" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2" aria-label="GitHub">
              <FaGithub size={22} />
            </a>
            <a href="mailto:siddheshgajare62@gmail.com" className="text-gray-400 hover:text-primary transition-colors p-2" aria-label="Email">
              <FaEnvelope size={22} />
            </a>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-5">
          <p className="text-gray-500 dark:text-gray-500 text-xs font-medium">
            &copy; {new Date().getFullYear()} Siddhesh Gajare. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            {/* Social links or other footer elements can go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
