import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import InterviewPrep from './components/InterviewPrep';
import AICodeExplainer from './components/AICodeExplainer';

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
    <div className="min-h-screen">
      <header>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </header>
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <InterviewPrep />
        <AICodeExplainer />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
