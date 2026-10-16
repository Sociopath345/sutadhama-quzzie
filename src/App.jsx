import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CoursesPage from './pages/CoursesPage';
import LevelsPage from './pages/LevelsPage';
import PartsPage from './pages/PartsPage';
import ChaptersPage from './pages/ChaptersPage';
import QuestionCountPage from './pages/QuestionCountPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import ReviewPage from './pages/ReviewPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 flex flex-col font-['Pyidaungsu','Padauk','Noto_Sans_Myanmar',sans-serif] antialiased selection:bg-[#FF9933]/30">
      <ScrollToTop />

      {/* Navigation Header */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Main Page Routing */}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Practice & Quiz Flow */}
          <Route path="/practice" element={<CoursesPage />} />
          <Route path="/practice/diploma" element={<LevelsPage />} />
          <Route path="/practice/ba" element={<PartsPage />} />
          <Route path="/practice/:course/:level/chapters" element={<ChaptersPage />} />
          <Route path="/practice/:course/:level/count" element={<QuestionCountPage />} />

          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/review" element={<ReviewPage />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      {/* Global Buddhist App Footer */}
      <Footer />

      {/* Auth Modal (Zero-Supabase client-side authentication) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
