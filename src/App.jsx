import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import InterviewPrep from './components/InterviewPrep';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopOnNavigate from './components/ScrollToTopOnNavigate';

// ✅ ADD THIS IMPORT
import AITest from './components/AITest';

// Auth
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// CDAC Prep
import CDACLayout from './components/cdac-prep/CDACLayout';
import MockTestSection from './components/cdac-prep/MockTestSection';
import TestEngine from './components/cdac-prep/TestEngine';
import ResultsPage from './components/cdac-prep/ResultsPage';
import CDACDashboard from './components/cdac-prep/CDACDashboard';

// Route guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    className="w-full flex-grow flex flex-col"
  >
    {children}
  </motion.div>
);

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isDark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.theme = next ? 'dark' : 'light';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 flex flex-col">
      <ScrollToTopOnNavigate />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-grow pt-20 sm:pt-24 flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* Public */}
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/skills" element={<PageWrapper><Skills /></PageWrapper>} />
            <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />

            {/* ✅ NEW AI TEST ROUTE */}
            <Route path="/ai-test" element={<PageWrapper><AITest /></PageWrapper>} />

            <Route path="/interview-prep" element={<PageWrapper><InterviewPrep /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected: Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PageWrapper>
                  <div className="py-10 px-4 sm:px-8 lg:px-16">
                    <CDACDashboard />
                  </div>
                </PageWrapper>
              </ProtectedRoute>
            } />

            {/* Protected: CDAC Prep */}
            <Route path="/cdac-prep" element={
              <ProtectedRoute>
                <PageWrapper>
                  <CDACLayout />
                </PageWrapper>
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="free-tests" replace />} />
              <Route path="free-tests" element={<MockTestSection type="free" />} />
              <Route path="premium-tests" element={<MockTestSection type="premium" />} />
              <Route path="results" element={<ResultsPage />} />
            </Route>

            {/* Protected: Results */}
            <Route path="/my-results" element={
              <ProtectedRoute>
                <PageWrapper>
                  <div className="py-10 px-4 sm:px-8 lg:px-16">
                    <ResultsPage />
                  </div>
                </PageWrapper>
              </ProtectedRoute>
            } />

            {/* Test Engine */}
            <Route path="/cdac-prep/test-engine/:testId" element={
              <ProtectedRoute>
                <TestEngine />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;