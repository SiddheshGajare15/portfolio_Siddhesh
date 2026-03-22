import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import InterviewPrep from './components/InterviewPrep';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check initial user preference or system theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-500 selection:bg-primary/20">
      <header>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </header>
      
      <main className="relative z-10">
        {/* Each component already handles its own section padding/ID inside */}
        <Hero />
        
        <div className="flex flex-col gap-12 md:gap-20 lg:gap-32 bg-gray-200/5 dark:bg-slate-800/10">
           <About />
           <Skills />
           <Projects />
           <InterviewPrep />
           <Services />
           <Contact />
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
