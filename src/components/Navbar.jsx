import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  ChevronDown,
  User,
  Menu,
  X,
  Home,
  Sparkles,
  Send
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { getCurrentUser, onAuthStateChange, logout } from '../services/authService';

export default function Navbar({ onOpenAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedCourse } = useQuiz();

  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleCourseSelect = (courseType) => {
    setIsPracticeDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setSelectedCourse(courseType);
    if (courseType === 'diploma') {
      navigate('/practice/diploma');
    } else {
      navigate('/practice/ba');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-150 px-3 sm:px-6 md:px-10 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left: Suta Dhama Text Logo */}
        <Link
          to="/"
          onClick={() => {
            setIsMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer min-w-0"
          aria-label="Home"
        >
          <img
            src="/Suta Logo.png"
            alt="သုတဓမ္မ ဉာဏ်စမ်း Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-2xl shadow-md border border-amber-500/20 bg-[#FAF9F6] p-0.5 group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="truncate">
            <span className="text-xl sm:text-2xl md:text-3xl font-black text-[#800000] tracking-tight block leading-tight truncate">
              သုတဓမ္မ ဉာဏ်စမ်း
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-500 tracking-wider block">
              SUTA DHAMA QUIZZES
            </span>
          </div>
        </Link>

        {/* Center: Main Links Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xl font-bold text-gray-700">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`hover:text-[#800000] transition-colors py-1 ${
              isActive('/') ? 'text-[#800000] border-b-2 border-[#800000]' : ''
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`hover:text-[#800000] transition-colors py-1 cursor-pointer ${
              isActive('/about') ? 'text-[#800000] border-b-2 border-[#800000]' : ''
            }`}
          >
            About Us
          </Link>

          {/* Practice Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsPracticeDropdownOpen(true)}
            onMouseLeave={() => setIsPracticeDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => navigate('/practice')}
              className={`flex items-center gap-2 py-1 cursor-pointer transition-colors ${
                isActive('/practice') || isActive('/quiz') || isActive('/results') || isActive('/review')
                  ? 'text-[#800000] border-b-2 border-[#800000]'
                  : 'hover:text-[#800000]'
              }`}
              aria-haspopup="true"
            >
              <span>Practice</span>
              <ChevronDown
                size={20}
                className={`transition-transform duration-200 ${
                  isPracticeDropdownOpen ? 'rotate-180 text-[#800000]' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute left-0 top-full pt-2 w-72 transition-all duration-150 ${
                isPracticeDropdownOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2.5 space-y-1">
                <button
                  type="button"
                  onClick={() => handleCourseSelect('diploma')}
                  className="w-full text-left px-5 py-4 rounded-xl hover:bg-[#FAF9F6] text-gray-800 hover:text-[#800000] font-bold text-lg flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <BookOpen size={22} className="text-[#800000]" />
                  <span>သုတဓမ္မဒီပလိုမာတန်း</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCourseSelect('ba')}
                  className="w-full text-left px-5 py-4 rounded-xl hover:bg-[#FAF9F6] text-gray-800 hover:text-[#800000] font-bold text-lg flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <GraduationCap size={22} className="text-[#800000]" />
                  <span>သုတဓမ္မဝိဇ္ဇာတန်း</span>
                </button>
              </div>
            </div>
          </div>

          <Link
            to="/contact"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`hover:text-[#800000] transition-colors py-1 ${
              isActive('/contact') ? 'text-[#800000] border-b-2 border-[#800000]' : ''
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Right: Authentication Status & Actions + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 md:gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="User Profile"
              >
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#800000] text-white flex items-center justify-center shadow-md border-2 border-amber-300/40"
                  title={currentUser.email || 'အကောင့်ဝင်ထားသည်'}
                >
                  <User size={20} className="stroke-[2.5]" />
                </div>
                <span className="hidden lg:inline text-sm font-bold text-gray-700 max-w-[120px] truncate">
                  {currentUser.name || currentUser.email}
                </span>
                <ChevronDown size={16} className="text-gray-500 hidden sm:inline" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-150 p-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 text-xs text-gray-500 font-semibold truncate">
                    {currentUser.email}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left mt-1 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  >
                    ထွက်မည် (Log Out)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 md:gap-4">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="text-gray-700 hover:text-[#800000] font-bold text-base md:text-xl px-2 py-1 transition-colors cursor-pointer"
              >
                ဝင်မည်
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="bg-[#800000] hover:bg-[#660000] text-white font-bold text-base md:text-xl px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                အကောင့်ဖွင့်မည်
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#800000] hover:bg-amber-500/10 active:scale-95 transition-all cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={26} className="stroke-[2.5]" /> : <Menu size={26} className="stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gray-150 bg-white rounded-2xl shadow-xl p-4 space-y-2.5 animate-fadeIn">
          <Link
            to="/"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-lg text-left transition-colors cursor-pointer ${
              isActive('/') ? 'bg-[#800000]/10 text-[#800000]' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home size={22} className="text-[#800000]" />
            <span>Home (ပင်မစာမျက်နှာ)</span>
          </Link>

          <Link
            to="/about"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-lg text-left transition-colors cursor-pointer ${
              isActive('/about') ? 'bg-[#800000]/10 text-[#800000]' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Sparkles size={20} className="text-[#FF9933]" />
            <span>About Us (ကျွန်ုပ်တို့အကြောင်း)</span>
          </Link>

          {/* Practice Submenu in Mobile */}
          <div className="bg-[#FAF9F6] border border-[#800000]/15 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 px-1 text-sm font-black text-[#800000]">
              <BookOpen size={18} className="text-[#800000]" />
              <span>Practice (လေ့ကျင့်ရန် မေးခွန်းများ)</span>
            </div>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCourseSelect('diploma')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-amber-50 border border-gray-200 text-gray-800 font-bold text-base text-left shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <BookOpen size={20} className="text-[#800000]" />
                <span>သုတဓမ္မ ဒီပလိုမာတန်း</span>
              </button>
              <button
                type="button"
                onClick={() => handleCourseSelect('ba')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-amber-50 border border-gray-200 text-gray-800 font-bold text-base text-left shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <GraduationCap size={20} className="text-[#800000]" />
                <span>သုတဓမ္မ ဝိဇ္ဇာဘွဲ့တန်း</span>
              </button>
            </div>
          </div>

          <Link
            to="/contact"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-lg text-left transition-colors cursor-pointer ${
              isActive('/contact') ? 'bg-[#800000]/10 text-[#800000]' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Send size={20} className="text-[#800000]" />
            <span>Contact Us (ဆက်သွယ်ရန်)</span>
          </Link>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-gray-150">
            {currentUser ? (
              <div className="flex items-center justify-between bg-amber-50/70 p-3 rounded-xl">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center shrink-0">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 truncate">{currentUser.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="shrink-0 text-red-700 hover:bg-red-50 font-bold text-sm px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
                >
                  ထွက်မည်
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border-2 border-[#800000] text-[#800000] font-bold text-base text-center hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
                >
                  ဝင်မည်
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth('signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#800000] hover:bg-[#660000] text-white font-bold text-base text-center shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  အကောင့်ဖွင့်မည်
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
