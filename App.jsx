import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Minus,
  Plus,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Mail,
  Send,
  HelpCircle,
  X,
  Award,
  Home,
  Check
} from 'lucide-react';

// =========================================================================
// Supabase Client Configuration
// =========================================================================
const SUPABASE_URL = 'https://vprxbhosrqvdduogdkih.supabase.co';
const SUPABASE_KEY = 'sb_publishable__dzDXSZczMtXy7RRdNp1lQ_C77Pba32';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper function to convert English digits to Burmese digits
const toBurmeseDigits = (numStr) => {
  const burmeseDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
  return String(numStr).replace(/[0-9]/g, (d) => burmeseDigits[parseInt(d, 10)]);
};

// Helper function to format chapter label naturally
const formatChapterLabel = (chapterStr, courseType) => {
  if (!chapterStr) return '';
  const str = String(chapterStr).trim();
  if (str.includes('အခန်း') || str.includes('အပိုင်း')) {
    return str;
  }
  const prefix = courseType === 'ba' || courseType === 'BA' ? 'အပိုင်း' : 'အခန်း';
  if (str.includes('-')) {
    const parts = str.split('-');
    return `${prefix} ${toBurmeseDigits(parts[0])} မှ ${toBurmeseDigits(parts[1])}`;
  }
  return `${prefix} ${toBurmeseDigits(str)}`;
};

// Helper function to sort chapter strings numerically
const sortChapters = (a, b) => {
  const numA = parseInt(String(a).match(/\d+/)?.[0] || '999', 10);
  const numB = parseInt(String(b).match(/\d+/)?.[0] || '999', 10);
  if (numA !== numB) return numA - numB;
  return String(a).localeCompare(String(b));
};

export default function App() {
  // Navigation State Machine: 
  // 'home' | 'practice' | 'levels' | 'parts' | 'chapters' | 'count' | 'contact' | 'quiz' | 'results' | 'review'
  const [currentScreen, setCurrentScreen] = useState('home');

  // Dropdown & Modal State
  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  // Quiz Configuration State
  const [selectedCourse, setSelectedCourse] = useState(null); // 'diploma' | 'ba'
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(''); // 'Level 1' | 'Part 2', etc.
  const [questionCount, setQuestionCount] = useState(20);

  // Chapter Selection State
  const [availableChapters, setAvailableChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [isChaptersLoading, setIsChaptersLoading] = useState(false);
  const [chaptersError, setChaptersError] = useState(null);

  // Quiz Execution State (Delayed Grading)
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: 'option_a' | ... }
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState(null);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);

  // Results & Review State
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0, percentage: 0, unanswered: 0 });
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);

  // Contact Form State
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState(null);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  // =========================================================================
  // Part 1: Contact Form Submission to Supabase
  // =========================================================================
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError(null);
    setContactSuccess(false);

    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert([
          {
            first_name: contactForm.firstName.trim(),
            last_name: contactForm.lastName.trim(),
            email: contactForm.email.trim(),
            message: contactForm.message.trim()
          }
        ]);

      if (error) throw error;

      setContactSuccess(true);
      setContactForm({ firstName: '', lastName: '', email: '', message: '' });
      setTimeout(() => {
        setContactSuccess(false);
      }, 6000);
    } catch (err) {
      console.error('Contact submit error:', err);
      setContactError(
        'မက်ဆေ့ခ်ျ ပေးပို့ရာတွင် အဆင်မပြေဖြစ်သွားပါသည်။ (Supabase တွင် feedbacks table တည်ဆောက်ထားခြင်း ရှိမရှိ စစ်ဆေးပေးပါ)'
      );
    } finally {
      setContactSubmitting(false);
    }
  };

  // =========================================================================
  // Part 2: Proportional Quiz Data Fetching (With Dynamic Chapter Filter & Cap Logic)
  // =========================================================================
  const fetchProportionalQuestions = async (courseType, levelNum, targetCount, chaptersToInclude) => {
    // 1. Fetch questions filtered by selectedChapters
    let query = supabase
      .from('questions')
      .select('*')
      .eq('course_type', courseType)
      .eq('level', levelNum);

    // Expand query for BA Level 1 to include legacy range strings if corresponding chapter is selected
    let chaptersQuery = chaptersToInclude ? [...chaptersToInclude] : [];
    if (courseType === 'BA' && levelNum === 1 && chaptersQuery.length > 0) {
      if (chaptersQuery.includes('4') && !chaptersQuery.includes('4-7')) chaptersQuery.push('4-7');
      if (chaptersQuery.includes('8') && !chaptersQuery.includes('8-13')) chaptersQuery.push('8-13');
      if (chaptersQuery.includes('14') && !chaptersQuery.includes('14-20')) chaptersQuery.push('14-20');
      if (chaptersQuery.includes('1') && !chaptersQuery.includes('21-27')) chaptersQuery.push('21-27');
    }

    if (chaptersQuery.length > 0) {
      query = query.in('chapter', chaptersQuery);
    }

    const { data, error } = await query.limit(3000);

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(`ရွေးချယ်ထားသော အခန်းများအတွက် မေးခွန်းများ ရှာမတွေ့ပါ။ အခြားအခန်းများကို ရွေးချယ်ပေးပါ။`);
    }

    // Normalize any legacy range chapters in data for BA Level 1
    if (courseType === 'BA' && levelNum === 1) {
      data.forEach((q) => {
        if (q.chapter === '4-7') q.chapter = '4';
        if (q.chapter === '8-13') q.chapter = '8';
        if (q.chapter === '14-20') q.chapter = '14';
        if (q.chapter === '21-27') q.chapter = '1';
      });
    }

    // 2. Count the total number of questions returned for these selected chapters
    const totalAvailable = data.length;

    // 3. The Cap Logic: If requested count > totalAvailable, cap quiz to totalAvailable
    const effectiveTarget = Math.min(targetCount, totalAvailable);

    // If effectiveTarget >= totalAvailable, return all questions shuffled (do NOT duplicate or make up questions)
    if (effectiveTarget >= totalAvailable) {
      const allShuffled = [...data];
      for (let i = allShuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allShuffled[i], allShuffled[j]] = [allShuffled[j], allShuffled[i]];
      }
      return allShuffled;
    }

    // 4. Proportional distribution logic across selected chapters
    const grouped = {};
    data.forEach((q) => {
      const ch = q.chapter || '1';
      if (!grouped[ch]) grouped[ch] = [];
      grouped[ch].push(q);
    });

    const chapters = Object.keys(grouped);
    const allocation = {};
    let allocatedSum = 0;
    let largestChapter = chapters[0];
    let largestSize = 0;

    chapters.forEach((ch) => {
      const chSize = grouped[ch].length;
      if (chSize > largestSize) {
        largestSize = chSize;
        largestChapter = ch;
      }
      const quota = Math.round((chSize / totalAvailable) * effectiveTarget);
      allocation[ch] = Math.min(quota, chSize);
      allocatedSum += allocation[ch];
    });

    // Handle rounding remainders by adjusting largest chapter
    let diff = effectiveTarget - allocatedSum;
    if (diff !== 0 && largestChapter) {
      const cur = allocation[largestChapter];
      const maxAvail = grouped[largestChapter].length;
      const newCnt = Math.max(0, Math.min(maxAvail, cur + diff));
      diff -= (newCnt - cur);
      allocation[largestChapter] = newCnt;

      if (diff !== 0) {
        for (const ch of chapters) {
          if (diff === 0) break;
          if (diff > 0 && allocation[ch] < grouped[ch].length) {
            allocation[ch]++;
            diff--;
          } else if (diff < 0 && allocation[ch] > 0) {
            allocation[ch]--;
            diff++;
          }
        }
      }
    }

    // 5. Randomly sample allocated questions from each chapter
    const sampledQuestions = [];
    chapters.forEach((ch) => {
      const count = allocation[ch] || 0;
      if (count > 0) {
        const pool = [...grouped[ch]];
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        sampledQuestions.push(...pool.slice(0, count));
      }
    });

    // 6. Final shuffle of the aggregated quiz questions
    for (let i = sampledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sampledQuestions[i], sampledQuestions[j]] = [sampledQuestions[j], sampledQuestions[i]];
    }

    return sampledQuestions;
  };

  // Start / Load Quiz
  const handleStartQuiz = async () => {
    setQuizLoading(true);
    setQuizError(null);
    setCurrentScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const courseType = selectedCourse === 'diploma' ? 'Diploma' : 'BA';
      const levelNum = parseInt(selectedLevel.replace(/\D/g, ''), 10) || 1;
      const questions = await fetchProportionalQuestions(
        courseType,
        levelNum,
        questionCount,
        selectedChapters
      );

      setQuizQuestions(questions);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
    } catch (err) {
      console.error('Quiz fetch error:', err);
      setQuizError(err.message || 'မေးခွန်းများ ရယူရာတွင် အမှားအယွင်း ဖြစ်ပေါ်ခဲ့ပါသည်။');
    } finally {
      setQuizLoading(false);
    }
  };

  // Course & Level Selection Handlers
  const handleCourseSelect = (courseType) => {
    setIsPracticeDropdownOpen(false);
    if (courseType === 'diploma') {
      setSelectedCourse('diploma');
      setSelectedCourseTitle('သုတဓမ္မ ဒီပလိုမာတန်း');
      setCurrentScreen('levels');
    } else {
      setSelectedCourse('ba');
      setSelectedCourseTitle('သုတဓမ္မ ဝိဇ္ဇာဘွဲ့တန်း');
      setCurrentScreen('parts');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Level & Immediately Fetch Unique Chapters from Supabase
  const handleLevelSelect = async (levelName) => {
    setSelectedLevel(levelName);
    setCurrentScreen('chapters');
    setIsChaptersLoading(true);
    setChaptersError(null);
    setAvailableChapters([]);
    setSelectedChapters([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const courseType = selectedCourse === 'diploma' ? 'Diploma' : 'BA';
      const levelNum = parseInt(levelName.replace(/\D/g, ''), 10) || 1;

      // Query Supabase questions table for unique/distinct chapter strings
      const { data, error } = await supabase
        .from('questions')
        .select('chapter')
        .eq('course_type', courseType)
        .eq('level', levelNum)
        .limit(3000);

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('အခန်းများ ရှာမတွေ့ပါ။');
      }

      // Extract unique chapters and filter out empty
      // Clean and normalize legacy range chapters for BA Level 1
      const normalizedChapters = data.map((item) => {
        const ch = String(item.chapter).trim();
        if (courseType === 'BA' && levelNum === 1) {
          if (ch === '4-7') return '4';
          if (ch === '8-13') return '8';
          if (ch === '14-20') return '14';
          if (ch === '21-27') return '1';
        }
        return ch;
      }).filter(Boolean);

      const unique = Array.from(new Set(normalizedChapters));
      unique.sort(sortChapters);

      setAvailableChapters(unique);
      setSelectedChapters(unique); // Default state: all checked
    } catch (err) {
      console.error('Error fetching chapters:', err);
      setChaptersError(err.message || 'အခန်းများ ရယူရာတွင် အဆင်မပြေဖြစ်သွားပါသည်။');
    } finally {
      setIsChaptersLoading(false);
    }
  };

  const handleStepperChange = (delta) => {
    setQuestionCount((prev) => {
      const next = prev + delta;
      if (next >= 10 && next <= 80) return next;
      return prev;
    });
  };

  // Back Button Navigation
  const handleBack = () => {
    if (currentScreen === 'levels' || currentScreen === 'parts') {
      setCurrentScreen('practice');
    } else if (currentScreen === 'chapters') {
      setCurrentScreen(selectedCourse === 'diploma' ? 'levels' : 'parts');
    } else if (currentScreen === 'count') {
      setCurrentScreen('chapters');
    } else if (currentScreen === 'quiz') {
      if (confirm('ဉာဏ်စမ်းဖြေဆိုမှုကို လက်စသတ်ပြီး နောက်သို့ ပြန်သွားလိုပါသလား။')) {
        setCurrentScreen('count');
      }
    } else if (currentScreen === 'results' || currentScreen === 'review') {
      setCurrentScreen('count');
    } else if (currentScreen === 'practice' || currentScreen === 'contact') {
      setCurrentScreen('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // Part 3: Delayed Grading Navigation & Answer Selection
  // =========================================================================
  const handleSelectOption = (optionKey) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionKey
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger submission confirmation or direct submit
  const handlePreSubmitQuiz = () => {
    const answeredCount = Object.keys(userAnswers).length;
    const unansweredCount = quizQuestions.length - answeredCount;

    if (unansweredCount > 0) {
      setShowSubmitConfirmModal(true);
    } else {
      executeQuizSubmit();
    }
  };

  // Part 4: Grade and Transition to Results
  const executeQuizSubmit = () => {
    setShowSubmitConfirmModal(false);
    let correctCount = 0;

    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_option) {
        correctCount++;
      }
    });

    const total = quizQuestions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const answered = Object.keys(userAnswers).length;
    const unanswered = total - answered;

    setQuizScore({
      correct: correctCount,
      total,
      percentage,
      unanswered
    });

    setCurrentScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Review & Reset Actions
  const handleReviewQuiz = () => {
    setReviewQuestionIndex(0);
    setCurrentScreen('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitQuiz = () => {
    setCurrentScreen('home');
    setQuizQuestions([]);
    setUserAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Current Question Object
  const currentQ = quizQuestions[currentQuestionIndex] || null;
  const reviewQ = quizQuestions[reviewQuestionIndex] || null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 flex flex-col font-['Pyidaungsu','Padauk','Noto_Sans_Myanmar',sans-serif] antialiased selection:bg-[#FF9933]/30">

      {/* ========================================================================= */}
      {/* 1. NAVIGATION BAR (TOP)                                                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-150 px-4 md:px-10 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Left: Sutadhama Text Logo */}
          <button
            onClick={() => { setCurrentScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 group text-left cursor-pointer"
            aria-label="Home"
          >
            <img 
              src="Suta Logo.png" 
              alt="သုတဓမ္မ ဉာဏ်စမ်း Logo" 
              className="w-12 h-12 object-contain rounded-2xl shadow-md border border-amber-500/20 bg-[#FAF9F6] p-0.5 group-hover:scale-105 transition-transform" 
            />
            <div>
              <span className="text-2xl md:text-3xl font-black text-[#800000] tracking-tight block leading-none">
                သုတဓမ္မ ဉာဏ်စမ်း
              </span>
              <span className="text-xs md:text-sm font-semibold text-gray-500 tracking-wider">
                SUTADHAMA QUIZ
              </span>
            </div>
          </button>

          {/* Center: Main Links Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xl font-bold text-gray-700">
            <button
              onClick={() => { setCurrentScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-[#800000] transition-colors py-1 ${currentScreen === 'home' ? 'text-[#800000] border-b-2 border-[#800000]' : ''}`}
            >
              Home
            </button>

            <button
              onClick={() => {
                alert("သုတဓမ္မ ဉာဏ်စမ်းစနစ်သည် ဓမ္မမိတ်ဆွေများအတွက် သုတဓမ္မစာမေးပွဲ အောင်မြင်စွာ ဖြေဆိုနိုင်စေရန် ရည်ရွယ်ထုတ်လုပ်ထားသော အထောက်အကူပြု လေ့ကျင့်ရေးစနစ် ဖြစ်ပါသည်။");
              }}
              className="hover:text-[#800000] transition-colors py-1"
            >
              About Us
            </button>

            {/* Practice Dropdown (Non-clickable button, reveals choices with dropdown sign) */}
            <div
              className="relative group"
              onMouseEnter={() => setIsPracticeDropdownOpen(true)}
              onMouseLeave={() => setIsPracticeDropdownOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-2 py-1 cursor-default transition-colors ${['practice', 'levels', 'parts', 'count', 'quiz', 'results', 'review'].includes(currentScreen) ? 'text-[#800000] border-b-2 border-[#800000]' : 'hover:text-[#800000]'}`}
                aria-haspopup="true"
              >
                <span>Practice</span>
                <ChevronDown size={20} className={`transition-transform duration-200 ${isPracticeDropdownOpen ? 'rotate-180 text-[#800000]' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 top-full pt-2 w-72 transition-all duration-150 ${isPracticeDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}`}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2.5 space-y-1">
                  <button
                    onClick={() => handleCourseSelect('diploma')}
                    className="w-full text-left px-5 py-4 rounded-xl hover:bg-[#FAF9F6] text-gray-800 hover:text-[#800000] font-bold text-lg flex items-center gap-3 transition-colors"
                  >
                    <BookOpen size={22} className="text-[#800000]" />
                    <span>သုတဓမ္မဒီပလိုမာတန်း</span>
                  </button>
                  <button
                    onClick={() => handleCourseSelect('ba')}
                    className="w-full text-left px-5 py-4 rounded-xl hover:bg-[#FAF9F6] text-gray-800 hover:text-[#800000] font-bold text-lg flex items-center gap-3 transition-colors"
                  >
                    <GraduationCap size={22} className="text-[#800000]" />
                    <span>သုတဓမ္မဝိဇ္ဇာတန်း</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setCurrentScreen('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-[#800000] transition-colors py-1 ${currentScreen === 'contact' ? 'text-[#800000] border-b-2 border-[#800000]' : ''}`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right: Secondary Login & Sign Up Links */}
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="text-gray-600 hover:text-[#800000] font-semibold text-lg md:text-xl px-2 py-1 transition-colors"
            >
              Login
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
              className="text-gray-600 hover:text-[#800000] font-semibold text-lg md:text-xl px-2 py-1 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* VIEW: HOMEPAGE (HERO SECTION + DISCLAIMER)                                */}
      {/* ========================================================================= */}
      {currentScreen === 'home' && (
        <main className="flex-1 flex flex-col">
          {/* Hero Section */}
          <section className="bg-[#1a1638] text-white py-16 md:py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#800000]/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FF9933]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
              {/* Left Column: Headline + Pill Yellow CTA */}
              <div className="space-y-8 text-center md:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white flex flex-col gap-2 md:gap-3.5 tracking-normal">
                  <span>သုတဓမ္မစာမေးပွဲအတွက်</span>
                  <span className="text-[#FFCC00]">ပြင်ဆင်ကြပါစို့</span>
                </h1>

                <p className="text-xl sm:text-2xl text-gray-300 font-normal leading-relaxed">
                  သုတဓမ္မ ဒီပလိုမာတန်းနှင့် ဝိဇ္ဇာဘွဲ့တန်း မေးခွန်းများကို စိတ်ကြိုက်အရေအတွက်ဖြင့် လွယ်ကူရှင်းလင်းစွာ အချိန်မရွေး လေ့ကျင့်လိုက်ပါ။
                </p>

                {/* Primary CTA Button: Yellow pill-shaped */}
                <div className="pt-2 flex justify-center md:justify-start">
                  <button
                    onClick={() => { setCurrentScreen('practice'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-3.5 bg-[#FFCC00] hover:bg-[#e6b800] active:scale-95 text-[#1a1638] text-2xl md:text-3xl font-black px-12 py-5 rounded-full shadow-2xl transition-all"
                  >
                    <span>ယခုလေ့ကျင့်ပါ</span>
                    <Sparkles className="text-[#1a1638]" />
                  </button>
                </div>
              </div>

              {/* Right Column: Dhamma Library Resource Card connecting to dhammadownload.com */}
              <div className="flex justify-center md:justify-end">
                <a
                  href="https://dhammadownload.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-md aspect-square bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-2 border-white/20 hover:border-[#FFCC00] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group transition-all cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#800000]/25 via-transparent to-[#FF9933]/20 group-hover:opacity-80 transition-opacity"></div>
                  
                  <div className="w-24 h-24 rounded-3xl bg-[#FFCC00] text-[#1a1638] flex items-center justify-center mb-5 shadow-xl relative z-10 group-hover:scale-110 transition-transform">
                    <BookOpen size={48} />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 relative z-10 group-hover:text-[#FFCC00] transition-colors">
                    ဓမ္မစာကြည့်တိုက်
                  </h3>

                  <p className="text-gray-300 text-base md:text-lg font-medium relative z-10 leading-relaxed mb-4 max-w-xs">
                    သုတဓမ္မ ဒီပလိုမာနှင့် ဝိဇ္ဇာဘွဲ့ သင်ရိုးစာအုပ်များ၊ တရားတော်များကို dhammadownload.com တွင် ရယူဖတ်ရှုနိုင်ပါသည်။
                  </p>

                  <div className="inline-flex items-center gap-2 bg-[#FFCC00]/20 text-[#FFCC00] text-sm md:text-base font-bold px-4 py-1.5 rounded-full border border-[#FFCC00]/40 group-hover:bg-[#FFCC00] group-hover:text-[#1a1638] transition-all relative z-10">
                    <span>စာအုပ်များ ရယူရန်</span>
                    <ChevronRight size={18} />
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* Disclaimer Section */}
          <section className="bg-[#FAF9F6] py-8 px-6 border-t border-gray-200">
            <div className="max-w-4xl mx-auto text-center space-y-2 text-xs md:text-sm text-gray-500">
              <p className="font-bold text-gray-700 uppercase tracking-wider text-sm md:text-base">
                ရှင်းလင်းချက် (Disclaimer)
              </p>
              <p className="leading-relaxed">
                ဤဝက်ဘ်ဆိုက်သည် သက်ဆိုင်ရာ သုတဓမ္မစာမေးပွဲ ကျင်းပရေးကော်မတီ (သို့မဟုတ်) တရားဝင်အဖွဲ့အစည်းများနှင့် တိုက်ရိုက်ပတ်သက်မှု၊ ထောက်ခံမှု သို့မဟုတ် အသိအမှတ်ပြုမှု ရယူထားခြင်း မရှိပါ။ ဤဝက်ဘ်ဆိုက်ပါ အချက်အလက်များနှင့် မေးခွန်းများအားလုံးသည် သုတဓမ္မ ဒီပလိုမာတန်းနှင့် ဝိဇ္ဇာဘွဲ့တန်း ဖြေဆိုမည့်သူများ စာမေးပွဲအတွက် ကြိုတင်လေ့ကျင့်နိုင်ရန်နှင့် ဓမ္မဗဟုသုတ မျှဝေရန် ရည်ရွယ်ချက်သက်သက်ဖြင့်သာ ဖန်တီးထားခြင်းဖြစ်ပြီး တရားဝင်စာမေးပွဲ ကျင်းပခြင်း ကိစ္စရပ်များနှင့် လုံးဝသက်ဆိုင်ခြင်း မရှိပါ။
              </p>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW: PRACTICE SCREEN                                                     */}
      {/* ========================================================================= */}
      {currentScreen === 'practice' && (
        <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#FF9933]/20 text-[#800000] text-lg font-bold px-4 py-1.5 rounded-full mb-3">
              လေ့ကျင့်ခန်းများ
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#800000]">
              လေ့ကျင့်မည့် သင်တန်းကို ရွေးချယ်ပါ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <button
              onClick={() => handleCourseSelect('diploma')}
              className="bg-white hover:bg-[#FAF0E6] text-[#800000] border-4 border-gray-200 hover:border-[#800000] rounded-3xl p-10 md:p-14 shadow-lg hover:shadow-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="w-24 h-24 rounded-3xl bg-[#800000]/10 text-[#800000] flex items-center justify-center">
                <BookOpen size={52} />
              </div>
              <span className="text-3xl md:text-4xl font-black">
                သုတဓမ္မဒီပလိုမာတန်း
              </span>
            </button>

            <button
              onClick={() => handleCourseSelect('ba')}
              className="bg-white hover:bg-[#FAF0E6] text-[#800000] border-4 border-gray-200 hover:border-[#800000] rounded-3xl p-10 md:p-14 shadow-lg hover:shadow-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="w-24 h-24 rounded-3xl bg-[#800000]/10 text-[#800000] flex items-center justify-center">
                <GraduationCap size={56} />
              </div>
              <span className="text-3xl md:text-4xl font-black">
                သုတဓမ္မဝိဇ္ဇာဘွဲ့တန်း
              </span>
            </button>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW: CONTACT US (SUPABASE INTEGRATED)                                     */}
      {/* ========================================================================= */}
      {currentScreen === 'contact' && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <button
              onClick={() => { setCurrentScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 text-[#800000] text-2xl font-bold py-2 px-3 rounded-xl hover:bg-[#800000]/10 transition-colors"
            >
              <ChevronLeft size={32} />
              <span>ပင်မစာမျက်နှာသို့</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8 md:p-12">
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-[#800000]">
                  Contact Us
                </h2>
                <p className="text-gray-500 text-lg mt-1 font-medium">
                  သင့်မေးမြန်းလိုသည်များနှင့် အကြံပြုချက်များကို ပေးပို့နိုင်ပါသည်။
                </p>
              </div>

              {contactSuccess ? (
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-3">
                  <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
                  <h4 className="text-2xl font-bold text-emerald-800">
                    ပေးပို့မှုအောင်မြင်ပါသည်
                  </h4>
                  <p className="text-emerald-700 text-lg">
                    သင့်မက်ဆေ့ခ်ျကို လက်ခံရရှိပြီး မကြာမီ အကြောင်းပြန်ပေးပါမည်။
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {contactError && (
                    <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-red-700 text-base flex items-center gap-3">
                      <AlertCircle size={24} className="shrink-0" />
                      <span>{contactError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.firstName}
                        onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                        className="w-full p-3.5 text-base border border-gray-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:border-[#800000] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.lastName}
                        onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                        className="w-full p-3.5 text-base border border-gray-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:border-[#800000] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full p-3.5 text-base border border-gray-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:border-[#800000] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">What can we help you with?</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full p-3.5 text-base border border-gray-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:border-[#800000] outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2 text-left">
                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full sm:w-auto bg-[#800000] hover:bg-[#660000] active:scale-95 text-white font-bold text-lg px-8 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send size={18} />
                      <span>{contactSubmitting ? 'ပေးပို့နေပါသည်...' : 'ပေးပို့မည်'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW: LEVEL SELECTION (DIPLOMA)                                           */}
      {/* ========================================================================= */}
      {currentScreen === 'levels' && (
        <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-[#800000] text-2xl font-bold py-2 px-3 rounded-xl hover:bg-[#800000]/10 transition-colors"
            >
              <ChevronLeft size={32} />
              <span>နောက်သို့</span>
            </button>
          </div>

          <div className="text-center mb-10">
            <span className="inline-block bg-[#FF9933]/20 text-[#800000] text-lg font-bold px-4 py-1.5 rounded-full mb-3">
              သုတဓမ္မ ဒီပလိုမာတန်း
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#800000]">
              Level ရွေးချယ်ပါ
            </h2>
          </div>

          <div className="space-y-6">
            {['Level 1', 'Level 2', 'Level 3'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelSelect(lvl)}
                className="w-full bg-white hover:bg-[#FAF0E6] text-[#800000] border-4 border-gray-200 hover:border-[#800000] rounded-3xl p-8 shadow-md hover:shadow-2xl active:scale-[0.98] transition-all text-center"
              >
                <span className="text-3xl md:text-5xl font-black tracking-wide">
                  {lvl}
                </span>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW: PART SELECTION (BA)                                                 */}
      {/* ========================================================================= */}
      {currentScreen === 'parts' && (
        <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-[#800000] text-2xl font-bold py-2 px-3 rounded-xl hover:bg-[#800000]/10 transition-colors"
            >
              <ChevronLeft size={32} />
              <span>နောက်သို့</span>
            </button>
          </div>

          <div className="text-center mb-10">
            <span className="inline-block bg-[#FF9933]/20 text-[#800000] text-lg font-bold px-4 py-1.5 rounded-full mb-3">
              သုတဓမ္မ ဝိဇ္ဇာဘွဲ့တန်း
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#800000]">
              Part ရွေးချယ်ပါ
            </h2>
          </div>

          <div className="space-y-6">
            {['Part 1', 'Part 2', 'Part 3'].map((prt) => (
              <button
                key={prt}
                onClick={() => handleLevelSelect(prt)}
                className="w-full bg-white hover:bg-[#FAF0E6] text-[#800000] border-4 border-gray-200 hover:border-[#800000] rounded-3xl p-8 shadow-md hover:shadow-2xl active:scale-[0.98] transition-all text-center"
              >
                <span className="text-3xl md:text-5xl font-black tracking-wide">
                  {prt}
                </span>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW: CHAPTER SELECTION SCREEN                                            */}
      {/* ========================================================================= */}
      {currentScreen === 'chapters' && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-start">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-[#800000] text-xl md:text-2xl font-bold py-2 px-3 rounded-xl hover:bg-[#800000]/10 transition-colors cursor-pointer"
            >
              <ChevronLeft size={28} />
              <span>နောက်သို့</span>
            </button>
          </div>

          {/* Header Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-[#800000]/20 rounded-full px-5 py-1.5 shadow-sm text-lg md:text-xl font-bold text-[#800000] mb-3">
              <span>{selectedCourseTitle}</span>
              <span className="text-[#FF9933]">•</span>
              <span>{selectedLevel}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#800000]">
              {selectedCourse === 'ba' ? 'လေ့ကျင့်မည့် အပိုင်းများ ရွေးချယ်ပါ' : 'လေ့ကျင့်မည့် အခန်းများ ရွေးချယ်ပါ'}
            </h2>
            <p className="text-base md:text-lg text-gray-500 mt-2 font-medium">
              မိမိ လေ့ကျင့်လိုသော အခန်းများကို အမှန်ခြစ်၍ ရွေးချယ်နိုင်ပါသည်
            </p>
          </div>

          {/* Loading State */}
          {isChaptersLoading && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-[#800000]/20 border-t-[#800000] rounded-full animate-spin mx-auto"></div>
              <p className="text-xl font-bold text-[#800000]">
                အခန်းများကို စာရင်းရယူနေပါသည်...
              </p>
            </div>
          )}

          {/* Error State */}
          {chaptersError && !isChaptersLoading && (
            <div className="bg-white rounded-3xl p-8 border-2 border-red-200 text-center space-y-4 shadow-lg my-6">
              <AlertCircle size={48} className="text-red-500 mx-auto" />
              <p className="text-xl font-bold text-red-600">{chaptersError}</p>
              <button
                onClick={() => handleLevelSelect(selectedLevel)}
                className="bg-[#800000] text-white font-bold text-lg px-6 py-2.5 rounded-xl hover:bg-[#660000] cursor-pointer"
              >
                ပြန်လည်ရယူမည်
              </button>
            </div>
          )}

          {/* Loaded Chapters List */}
          {!isChaptersLoading && !chaptersError && availableChapters.length > 0 && (
            <div className="space-y-6">
              {/* Select All ("အကုန်ဖြေမည်။") Card */}
              <div
                onClick={() => {
                  const allSelected = selectedChapters.length === availableChapters.length;
                  if (allSelected) {
                    setSelectedChapters([]);
                  } else {
                    setSelectedChapters([...availableChapters]);
                  }
                }}
                className={`p-5 md:p-6 rounded-3xl border-3 shadow-md flex items-center justify-between cursor-pointer transition-all ${selectedChapters.length === availableChapters.length
                    ? 'bg-[#FAF0E6] border-[#800000] ring-4 ring-[#800000]/15'
                    : 'bg-white border-gray-300 hover:border-[#800000]/60'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all shrink-0 ${selectedChapters.length === availableChapters.length
                        ? 'bg-[#800000] border-[#800000] text-white shadow-sm'
                        : 'border-gray-400 bg-white'
                      }`}
                  >
                    {selectedChapters.length === availableChapters.length && (
                      <Check size={22} className="stroke-[3]" />
                    )}
                  </div>
                  <div>
                    <span className="text-2xl md:text-3xl font-black text-[#800000] block">
                      အကုန်ဖြေမည်။
                    </span>
                    <span className="text-sm md:text-base font-bold text-gray-500">
                      အခန်းအားလုံးကို တစ်ပြိုင်နက် ရွေးချယ်ပါမည်
                    </span>
                  </div>
                </div>

                <span className="text-base md:text-lg font-black text-[#800000] bg-[#800000]/10 px-4 py-1.5 rounded-xl">
                  {selectedChapters.length} / {availableChapters.length} ခန်း
                </span>
              </div>

              {/* Individual Chapter Checkboxes Grid (Large, tap-friendly) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableChapters.map((ch) => {
                  const isChecked = selectedChapters.includes(ch);
                  const label = formatChapterLabel(ch, selectedCourse);
                  return (
                    <div
                      key={ch}
                      onClick={() => {
                        setSelectedChapters((prev) =>
                          prev.includes(ch)
                            ? prev.filter((item) => item !== ch)
                            : [...prev, ch]
                        );
                      }}
                      className={`p-4 md:p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer select-none ${isChecked
                          ? 'bg-[#FAF0E6] border-[#800000] text-[#800000] shadow-sm ring-2 ring-[#800000]/20'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-xl md:text-2xl font-bold flex-1 pr-3 leading-snug">
                        {label}
                      </span>

                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 ${isChecked
                            ? 'bg-[#800000] border-[#800000] text-white shadow-sm'
                            : 'border-gray-400 bg-white'
                          }`}
                      >
                        {isChecked && <Check size={18} className="stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Warning if None Selected */}
              {selectedChapters.length === 0 && (
                <p className="text-center text-red-600 font-bold text-lg md:text-xl py-2">
                  ကျေးဇူးပြု၍ အနည်းဆုံး အခန်း (၁) ခန်း ရွေးချယ်ပေးပါ။
                </p>
              )}

              {/* "ရှေ့ဆက်မည်" (Next) Button */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    if (selectedChapters.length > 0) {
                      setCurrentScreen('count');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={selectedChapters.length === 0}
                  className="w-full bg-[#800000] hover:bg-[#660000] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white text-2xl md:text-3xl font-extrabold py-5 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>ရှေ့ဆက်မည်</span>
                  <ChevronRight size={32} />
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW: QUESTION COUNT SETUP                                                */}
      {/* ========================================================================= */}
      {currentScreen === 'count' && (
        <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-[#800000] text-2xl font-bold py-2 px-3 rounded-xl hover:bg-[#800000]/10 transition-colors"
            >
              <ChevronLeft size={32} />
              <span>နောက်သို့</span>
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-[#800000]/20 rounded-full px-6 py-2 shadow-sm text-xl md:text-2xl font-bold text-[#800000]">
              <span>{selectedCourseTitle}</span>
              <span className="text-[#FF9933]">•</span>
              <span>{selectedLevel}</span>
            </div>
          </div>

          {/* Stepper Card */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8 md:p-12 mb-10 flex flex-col items-center text-center">
            <label className="text-2xl md:text-4xl font-black text-[#800000] mb-8 leading-snug">
              မေးခွန်းအရေအတွက်ကို ရွေးချယ်ပါ။
            </label>

            {/* Pill-shaped Stepper UI */}
            <div className="inline-flex items-center justify-between gap-6 md:gap-12 bg-[#FAF9F6] border-3 border-[#800000]/25 rounded-full px-6 py-3 md:px-10 md:py-5 shadow-inner">
              <button
                type="button"
                onClick={() => handleStepperChange(-5)}
                disabled={questionCount <= 10}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white hover:bg-gray-100 active:scale-90 text-[#800000] shadow-md border-2 border-gray-200 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease"
              >
                <Minus size={36} className="stroke-[3]" />
              </button>

              <div className="min-w-[120px] text-center select-none">
                <span className="text-5xl md:text-7xl font-black text-[#800000]">
                  {questionCount}
                </span>
                <span className="block text-xl font-bold text-gray-500 mt-1">
                  ပုဒ်
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleStepperChange(5)}
                disabled={questionCount >= 80}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white hover:bg-gray-100 active:scale-90 text-[#800000] shadow-md border-2 border-gray-200 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase"
              >
                <Plus size={36} className="stroke-[3]" />
              </button>
            </div>

            <p className="text-lg md:text-xl text-gray-500 mt-6 font-medium">
              (အနည်းဆုံး ၁၀ ပုဒ် မှ အများဆုံး ၈၀ ပုဒ် အထိ ရွေးချယ်နိုင်ပါသည်)
            </p>
          </div>

          {/* Massive Start Button */}
          <button
            onClick={handleStartQuiz}
            className="w-full bg-[#800000] hover:bg-[#660000] active:scale-[0.98] text-white text-3xl md:text-4xl font-extrabold py-7 px-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 cursor-pointer"
          >
            <CheckCircle2 size={38} className="text-[#FF9933]" />
            <span>မေးခွန်းစတင်မည်</span>
          </button>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW: QUIZ SCREEN (DELAYED GRADING ENGINE)                                */}
      {/* ========================================================================= */}
      {currentScreen === 'quiz' && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-start">

          {/* Loading State */}
          {quizLoading && (
            <div className="my-auto py-24 text-center space-y-6">
              <div className="w-20 h-20 border-6 border-[#800000]/20 border-t-[#800000] rounded-full animate-spin mx-auto"></div>
              <h3 className="text-3xl font-extrabold text-[#800000]">
                မေးခွန်းများ စီစဉ်ရယူနေပါသည်...
              </h3>
              <p className="text-xl text-gray-600">
                အခန်းလိုက် မျှတစွာ ရွေးချယ်တွက်ချက်နေပါသည်၊ ကျေးဇူးပြု၍ ခေတ္တစောင့်ဆိုင်းပေးပါ။
              </p>
            </div>
          )}

          {/* Error State */}
          {quizError && !quizLoading && (
            <div className="my-auto bg-white rounded-3xl p-10 shadow-2xl border-2 border-red-200 text-center space-y-6">
              <AlertCircle size={60} className="text-red-500 mx-auto" />
              <h3 className="text-3xl font-black text-red-600">
                မေးခွန်းများ ရယူရာတွင် အဆင်မပြေပါ
              </h3>
              <p className="text-xl text-gray-700">{quizError}</p>
              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={handleStartQuiz}
                  className="bg-[#800000] text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-[#660000]"
                >
                  ထပ်မံကြိုးစားမည်
                </button>
                <button
                  onClick={() => setCurrentScreen('count')}
                  className="bg-gray-200 text-gray-800 text-xl font-bold px-8 py-4 rounded-2xl hover:bg-gray-300"
                >
                  နောက်သို့
                </button>
              </div>
            </div>
          )}

          {/* Loaded Quiz Content */}
          {!quizLoading && !quizError && currentQ && (
            <div className="space-y-6">

              {/* Top Status & Sticky Progress Bar */}
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 text-lg md:text-xl font-bold text-[#800000]">
                    <span>{selectedCourseTitle}</span>
                    <span className="text-[#FF9933]">•</span>
                    <span>{selectedLevel}</span>
                  </div>

                  {/* Submit Button Permanent in Header */}
                  <button
                    onClick={handlePreSubmitQuiz}
                    className="bg-[#800000] hover:bg-[#660000] text-white font-bold text-base md:text-lg px-6 py-2.5 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 size={20} className="text-[#FF9933]" />
                    <span>အဖြေလွှာတင်မည်</span>
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-base md:text-lg font-bold">
                    <span className="text-[#800000]">
                      မေးခွန်း {currentQuestionIndex + 1} / {quizQuestions.length}
                    </span>
                    <span className="text-gray-500 text-sm md:text-base">
                      ဖြေဆိုပြီး: {Object.keys(userAnswers).length} ပုဒ် | ကျန်: {quizQuestions.length - Object.keys(userAnswers).length} ပုဒ်
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#800000] to-[#FF9933] h-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* TOP NAVIGATION BAR: နောက်သို့၊ ကျော်မည်၊ ရှေ့သို့ / အဖြေလွှာတင်မည် */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-800 font-bold text-lg md:text-xl px-5 md:px-7 py-3 rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <ChevronLeft size={24} />
                  <span>နောက်သို့</span>
                </button>

                <button
                  onClick={handleSkipQuestion}
                  disabled={currentQuestionIndex === quizQuestions.length - 1}
                  className="bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-600 font-bold text-base md:text-lg px-4 md:px-5 py-3 rounded-2xl shadow-sm cursor-pointer transition-all"
                >
                  <span>ကျော်မည်</span>
                </button>

                {currentQuestionIndex < quizQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-[#800000] hover:bg-[#660000] text-white font-bold text-lg md:text-xl px-6 md:px-8 py-3 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>ရှေ့သို့</span>
                    <ChevronRight size={24} />
                  </button>
                ) : (
                  <button
                    onClick={handlePreSubmitQuiz}
                    className="bg-[#FF9933] hover:bg-[#e68a00] text-white font-extrabold text-lg md:text-xl px-6 md:px-8 py-3 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all animate-pulse"
                  >
                    <CheckCircle2 size={24} />
                    <span>အဖြေလွှာတင်မည်</span>
                  </button>
                )}
              </div>

              {/* Main Question Card */}
              <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-6 md:p-10 space-y-8">

                {/* Question Header (Excluded အပိုင်း / အခန်း description) */}
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-[#800000]/10 text-[#800000] text-lg font-black px-4 py-1.5 rounded-xl">
                    မေးခွန်း #{currentQuestionIndex + 1}
                  </span>
                  <span className="text-gray-400 font-bold text-base">
                    {currentQuestionIndex + 1} / {quizQuestions.length}
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#800000] leading-relaxed">
                  {currentQ.question_text}
                </h3>

                {/* Options List (Delayed Grading - No right/wrong answers shown yet) */}
                <div className="space-y-4 pt-2">
                  {[
                    { key: 'option_a', text: currentQ.option_a, label: 'A' },
                    { key: 'option_b', text: currentQ.option_b, label: 'B' },
                    { key: 'option_c', text: currentQ.option_c, label: 'C' },
                    { key: 'option_d', text: currentQ.option_d, label: 'D' }
                  ].map((opt) => {
                    const isSelected = userAnswers[currentQuestionIndex] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectOption(opt.key)}
                        className={`w-full text-left p-5 md:p-6 rounded-2xl border-3 transition-all flex items-center gap-5 cursor-pointer ${isSelected
                            ? 'bg-[#FAF0E6] border-[#800000] shadow-md ring-4 ring-[#800000]/15'
                            : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        {/* Option Letter Circle */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shrink-0 transition-colors ${isSelected
                              ? 'bg-[#800000] text-white'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {opt.label}
                        </div>

                        {/* Option Text */}
                        <span className={`text-xl md:text-2xl font-bold leading-normal flex-1 ${isSelected ? 'text-[#800000]' : 'text-gray-800'
                          }`}>
                          {opt.text}
                        </span>

                        {/* Check Indicator */}
                        {isSelected && (
                          <div className="w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center shrink-0">
                            <Check size={20} className="stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Bar (Next, Previous, Skip) */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-800 font-bold text-xl md:text-2xl px-6 md:px-8 py-4 rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <ChevronLeft size={28} />
                  <span>နောက်သို့</span>
                </button>

                <button
                  onClick={handleSkipQuestion}
                  disabled={currentQuestionIndex === quizQuestions.length - 1}
                  className="bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-600 font-bold text-lg md:text-xl px-5 md:px-6 py-4 rounded-2xl shadow-sm cursor-pointer transition-all"
                >
                  <span>ကျော်မည်</span>
                </button>

                {currentQuestionIndex < quizQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-[#800000] hover:bg-[#660000] text-white font-bold text-xl md:text-2xl px-8 md:px-10 py-4 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>ရှေ့သို့</span>
                    <ChevronRight size={28} />
                  </button>
                ) : (
                  <button
                    onClick={handlePreSubmitQuiz}
                    className="bg-[#FF9933] hover:bg-[#e68a00] text-white font-extrabold text-xl md:text-2xl px-8 md:px-10 py-4 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all animate-pulse"
                  >
                    <CheckCircle2 size={28} />
                    <span>အဖြေလွှာတင်မည်</span>
                  </button>
                )}
              </div>

              {/* Question Navigator Drawer / Jump Grid */}
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200">
                <p className="text-sm md:text-base font-bold text-gray-600 mb-3">
                  မေးခွန်းများသို့ တိုက်ရိုက်သွားရန်:
                </p>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                  {quizQuestions.map((_, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined;
                    const isCurrent = idx === currentQuestionIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleJumpToQuestion(idx)}
                        className={`w-10 h-10 rounded-xl font-bold text-base transition-all cursor-pointer ${isCurrent
                            ? 'ring-4 ring-[#800000] bg-[#800000] text-white font-black'
                            : isAnswered
                              ? 'bg-[#800000]/15 text-[#800000] border-2 border-[#800000]/30 font-bold'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* SUBMISSION CONFIRMATION MODAL                                             */}
      {/* ========================================================================= */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 text-center space-y-6 border-2 border-gray-100">
            <div className="w-16 h-16 rounded-full bg-[#FF9933]/20 text-[#FF9933] flex items-center justify-center mx-auto">
              <AlertCircle size={40} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-black text-[#800000]">
                အဖြေလွှာ တင်သွင်းရန် အတည်ပြုပါ
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                သင် မဖြေဆိုရသေးသော မေးခွန်း{' '}
                <span className="font-black text-red-600">
                  {quizQuestions.length - Object.keys(userAnswers).length}
                </span>{' '}
                ပုဒ် ကျန်ရှိနေပါသေးသည်။ အမှန်တကယ် အဖြေလွှာ တင်သွင်းလိုပါသလား။
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowSubmitConfirmModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xl font-bold py-4 rounded-xl cursor-pointer"
              >
                ဆက်လက်ဖြေဆိုမည်
              </button>
              <button
                onClick={executeQuizSubmit}
                className="flex-1 bg-[#800000] hover:bg-[#660000] text-white text-xl font-bold py-4 rounded-xl shadow-md cursor-pointer"
              >
                အဖြေလွှာတင်မည်
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: RESULTS SCREEN (CIRCULAR CHART + STATS + 3 MASSIVE BUTTONS)          */}
      {/* ========================================================================= */}
      {currentScreen === 'results' && (
        <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center items-center">
          <div className="w-full bg-white rounded-3xl shadow-2xl border-4 border-gray-100 p-8 md:p-14 text-center space-y-8">

            {/* Header info */}
            <div>
              <img 
                src="Suta Logo.png" 
                alt="သုတဓမ္မ ဉာဏ်စမ်း Logo" 
                className="w-20 h-20 mx-auto mb-3 object-contain drop-shadow" 
              />
              <span className="inline-block bg-[#FF9933]/20 text-[#800000] text-lg font-bold px-5 py-2 rounded-full mb-2">
                {selectedCourseTitle} • {selectedLevel}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-[#800000]">
                ဉာဏ်စမ်း ရလဒ်အဖြေလွှာ
              </h2>
            </div>

            {/* Circular Percentage Progress Chart (Pure SVG) */}
            <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Track Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  className="text-gray-100"
                  strokeWidth="16"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Dynamic Colored Progress Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke={
                    quizScore.percentage >= 80
                      ? '#10B981' // Green
                      : quizScore.percentage >= 50
                        ? '#FF9933' // Saffron
                        : '#800000'  // Maroon
                  }
                  strokeWidth="16"
                  strokeDasharray={502.65}
                  strokeDashoffset={502.65 - (quizScore.percentage / 100) * 502.65}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Percentage Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl md:text-6xl font-black text-[#800000] tracking-tight">
                  {quizScore.percentage}%
                </span>
                <span className="text-sm font-bold text-gray-500 mt-1">
                  {quizScore.percentage >= 80
                    ? 'ထူးချွန်စွာ အောင်မြင်ပါသည်'
                    : quizScore.percentage >= 50
                      ? 'အောင်မြင်ပါသည်'
                      : 'ထပ်မံကြိုးစားပါ'}
                </span>
              </div>
            </div>

            {/* Exact Fraction of Correct Answers */}
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-black text-[#800000]">
                {quizScore.correct} / {quizScore.total} ပုဒ် မှန်ကန်ပါသည်
              </p>
              <p className="text-lg text-gray-500 font-medium">
                (မှန်ကန်သော အမှတ်ပေါင်း {quizScore.correct} ပုဒ်၊ မှားယွင်းမှု {quizScore.total - quizScore.correct - quizScore.unanswered} ပုဒ်၊ မဖြေဆိုခဲ့မှု {quizScore.unanswered} ပုဒ်)
              </p>
            </div>

            {/* Dynamic Polite Post-Quiz Feedback Message */}
            <div className={`p-5 md:p-6 rounded-2xl border-2 text-center transition-all ${
              quizScore.percentage >= 80
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : quizScore.percentage >= 50
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <p className="text-xl md:text-2xl font-bold leading-relaxed">
                {quizScore.percentage >= 80
                  ? 'ဂုဏ်ယူပါသည်၊ အလွန်ကောင်းမွန်သော ရလဒ်ဖြစ်ပါသည်။ ဆက်လက် ကြိုးစားပါ။'
                  : quizScore.percentage >= 50
                  ? 'ကောင်းမွန်ပါသည်။ လိုအပ်သည်များကို ထပ်မံလေ့လာနိုင်ပါသည်။'
                  : 'အားမလျှော့ပါနှင့်။ အဖြေများကိုပြန်စစ်ပြီး ထပ်မံကြိုးစားကြည့်ပါ။'}
              </p>
            </div>

            {/* Three Massive Action Buttons (Mobile-friendly, large padding) */}
            <div className="space-y-4 pt-4">
              {/* 1. Review Quiz */}
              <button
                onClick={handleReviewQuiz}
                className="w-full bg-[#800000] hover:bg-[#660000] active:scale-[0.98] text-white text-2xl md:text-3xl font-black py-6 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 cursor-pointer"
              >
                <BookOpen size={32} className="text-[#FF9933]" />
                <span>အဖြေများပြန်စစ်ရန်</span>
              </button>

              {/* 2. Try Again */}
              <button
                onClick={handleStartQuiz}
                className="w-full bg-[#FF9933] hover:bg-[#e68a00] active:scale-[0.98] text-white text-2xl md:text-3xl font-black py-6 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 cursor-pointer"
              >
                <RotateCcw size={32} />
                <span>ထပ်မံဖြေဆိုမည်</span>
              </button>

              {/* 3. Exit */}
              <button
                onClick={handleExitQuiz}
                className="w-full bg-white hover:bg-gray-100 active:scale-[0.98] text-gray-800 border-2 border-gray-300 text-2xl md:text-3xl font-bold py-5 px-8 rounded-2xl shadow-md transition-all flex items-center justify-center gap-4 cursor-pointer"
              >
                <Home size={30} className="text-gray-500" />
                <span>ထွက်မည်</span>
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW: REVIEW SCREEN (CHECK ANSWERS & EXPLANATIONS)                        */}
      {/* ========================================================================= */}
      {currentScreen === 'review' && reviewQ && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-start space-y-6">

          {/* Top Bar */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-lg md:text-xl font-bold text-[#800000] block">
                အဖြေများ ပြန်လည်စစ်ဆေးခြင်း
              </span>
              <span className="text-sm font-semibold text-gray-500">
                မေးခွန်း {reviewQuestionIndex + 1} / {quizQuestions.length}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentScreen('results')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-base md:text-lg px-5 py-2 rounded-xl transition-all cursor-pointer"
              >
                ရလဒ်သို့
              </button>
              <button
                onClick={handleExitQuiz}
                className="bg-[#800000] hover:bg-[#660000] text-white font-bold text-base md:text-lg px-5 py-2 rounded-xl transition-all cursor-pointer"
              >
                ထွက်မည်
              </button>
            </div>
          </div>

          {/* TOP REVIEW NAVIGATION BUTTONS: ရှေ့မေးခွန်းသို့ & နောက်မေးခွန်းသို့ */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                if (reviewQuestionIndex > 0) {
                  setReviewQuestionIndex((prev) => prev - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={reviewQuestionIndex === 0}
              className="bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-800 font-bold text-lg md:text-xl px-6 py-3.5 rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <ChevronLeft size={24} />
              <span>ရှေ့မေးခွန်းသို့</span>
            </button>

            <button
              onClick={() => {
                if (reviewQuestionIndex < quizQuestions.length - 1) {
                  setReviewQuestionIndex((prev) => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              disabled={reviewQuestionIndex === quizQuestions.length - 1}
              className="bg-[#800000] hover:bg-[#660000] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg md:text-xl px-6 py-3.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>နောက်မေးခွန်းသို့</span>
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Question Review Card */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-6 md:p-10 space-y-8">
            <div className="flex items-center justify-between">
              {/* Question Index Badge (Excluded အပိုင်း / အခန်း description) */}
              <span className="inline-block bg-[#800000]/10 text-[#800000] text-lg font-black px-4 py-1.5 rounded-xl">
                မေးခွန်း #{reviewQuestionIndex + 1}
              </span>

              {/* Answer Status Badge */}
              {userAnswers[reviewQuestionIndex] === reviewQ.correct_option ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-base md:text-lg font-bold px-4 py-1.5 rounded-xl">
                  <Check size={20} className="stroke-[3]" />
                  <span>မှန်ကန်ပါသည်</span>
                </span>
              ) : userAnswers[reviewQuestionIndex] ? (
                <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-base md:text-lg font-bold px-4 py-1.5 rounded-xl">
                  <X size={20} className="stroke-[3]" />
                  <span>မှားယွင်းပါသည်</span>
                </span>
              ) : (
                <span className="inline-block bg-gray-100 text-gray-600 text-base md:text-lg font-bold px-4 py-1.5 rounded-xl">
                  မဖြေဆိုခဲ့ပါ
                </span>
              )}
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-[#800000] leading-relaxed">
              {reviewQ.question_text}
            </h3>

            {/* Options with Detailed Right/Wrong Highlighting */}
            <div className="space-y-4">
              {[
                { key: 'option_a', text: reviewQ.option_a, label: 'A' },
                { key: 'option_b', text: reviewQ.option_b, label: 'B' },
                { key: 'option_c', text: reviewQ.option_c, label: 'C' },
                { key: 'option_d', text: reviewQ.option_d, label: 'D' }
              ].map((opt) => {
                const isCorrect = reviewQ.correct_option === opt.key;
                const isUserChoice = userAnswers[reviewQuestionIndex] === opt.key;

                let cardStyle = 'bg-white border-gray-200 text-gray-700';
                let badgeStyle = 'bg-gray-100 text-gray-700';

                if (isCorrect) {
                  cardStyle = 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-200';
                  badgeStyle = 'bg-emerald-600 text-white';
                } else if (isUserChoice && !isCorrect) {
                  cardStyle = 'bg-red-50 border-red-500 shadow-sm ring-2 ring-red-200';
                  badgeStyle = 'bg-red-600 text-white';
                }

                return (
                  <div
                    key={opt.key}
                    className={`p-5 md:p-6 rounded-2xl border-3 flex items-center justify-between gap-4 transition-all ${cardStyle}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shrink-0 ${badgeStyle}`}>
                        {opt.label}
                      </div>
                      <span className="text-xl md:text-2xl font-bold leading-normal">
                        {opt.text}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isCorrect && (
                        <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-sm md:text-base font-bold px-3 py-1.5 rounded-lg">
                          <Check size={16} />
                          <span>မှန်ကန်သော အဖြေ</span>
                        </span>
                      )}
                      {isUserChoice && !isCorrect && (
                        <span className="inline-flex items-center gap-1 bg-red-600 text-white text-sm md:text-base font-bold px-3 py-1.5 rounded-lg">
                          <X size={16} />
                          <span>သင်ရွေးချယ်ခဲ့သော အဖြေ</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation Section */}
            {reviewQ.explanation && (
              <div className="bg-[#FAF0E6] border-2 border-[#800000]/20 rounded-2xl p-6 md:p-8 space-y-2">
                <span className="text-lg md:text-xl font-bold text-[#800000] flex items-center gap-2">
                  <HelpCircle size={22} className="text-[#FF9933]" />
                  <span>ရှင်းလင်းချက်:</span>
                </span>
                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium">
                  {reviewQ.explanation}
                </p>
              </div>
            )}

            {/* Stepper buttons for review (Bottom buttons preserved) */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => {
                  if (reviewQuestionIndex > 0) {
                    setReviewQuestionIndex((prev) => prev - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                disabled={reviewQuestionIndex === 0}
                className="bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 font-bold text-xl px-6 py-3.5 rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <ChevronLeft size={24} />
                <span>ရှေ့မေးခွန်းသို့</span>
              </button>

              <button
                onClick={() => {
                  if (reviewQuestionIndex < quizQuestions.length - 1) {
                    setReviewQuestionIndex((prev) => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                disabled={reviewQuestionIndex === quizQuestions.length - 1}
                className="bg-[#800000] hover:bg-[#660000] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xl px-6 py-3.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>နောက်မေးခွန်းသို့</span>
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Quick Jump Bar in Review Mode */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200">
            <p className="text-sm md:text-base font-bold text-gray-600 mb-3">
              မေးခွန်းများသို့ တိုက်ရိုက်ရွေးချယ်ရန် (အစိမ်းရောင်: မှန်၊ အနီရောင်: မှား၊ မီးခိုးရောင်: မဖြေ):
            </p>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
              {quizQuestions.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.correct_option;
                const isAnswered = userAnswers[idx] !== undefined;
                const isCurrent = idx === reviewQuestionIndex;

                let pillColor = 'bg-gray-200 text-gray-700';
                if (isAnswered) {
                  pillColor = isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setReviewQuestionIndex(idx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-xl font-bold text-base transition-all cursor-pointer ${pillColor} ${isCurrent ? 'ring-4 ring-offset-2 ring-[#800000] scale-110 font-black' : ''
                      }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* AUTH MODAL (LOGIN / SIGN UP SECONDARY POPUP)                              */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative border-2 border-gray-100">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <X size={26} />
            </button>

            <img 
              src="Suta Logo.png" 
              alt="သုတဓမ္မ ဉာဏ်စမ်း Logo" 
              className="w-16 h-16 mx-auto mb-3 object-contain drop-shadow" 
            />
            <h3 className="text-3xl font-extrabold text-[#800000] text-center mb-2">
              {authMode === 'login' ? 'အကောင့်ဝင်ရန်' : 'အကောင့်အသစ်ဖွင့်ရန်'}
            </h3>
            <p className="text-gray-500 text-center mb-6 text-lg">
              (မှတ်စု: ဉာဏ်စမ်းလေ့ကျင့်ရန် အကောင့်ဝင်ရန် မလိုအပ်ပါ)
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setShowAuthModal(false); }} className="space-y-4">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-1">အီးမေးလ် / ဖုန်း</label>
                <input
                  type="text"
                  placeholder="email@example.com"
                  className="w-full p-4 text-lg border border-gray-300 rounded-xl outline-none focus:border-[#800000]"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-1">စကားဝှက်</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-4 text-lg border border-gray-300 rounded-xl outline-none focus:border-[#800000]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#800000] text-white py-4 rounded-xl text-xl font-bold hover:bg-[#660000] mt-4 shadow-md transition-all cursor-pointer"
              >
                {authMode === 'login' ? 'ဝင်မည်' : 'အကောင့်ဖွင့်မည်'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FOOTER (DISPLAYED ON EVERY PAGE)                                          */}
      {/* ========================================================================= */}
      <footer className="bg-white text-gray-500 py-4 px-6 text-center text-xs md:text-sm border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2.5">
          <img src="Suta Logo.png" alt="Suta Logo" className="w-5 h-5 object-contain inline-block opacity-80" />
          <p className="text-gray-500">
            © 2026 သုတဓမ္မ ဉာဏ်စမ်း (Sutadhama Quizzie), developed by{' '}
            <a 
              href="https://github.com/Sociopath345/sutadhama-quzzie" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-[#800000] hover:underline"
            >
              Sociopath345
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}
