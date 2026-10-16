import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, RotateCcw, Home, AlertCircle } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { toBurmeseDigits } from '../utils/formatters';

export default function ResultsPage() {
  const navigate = useNavigate();
  const {
    selectedCourse,
    selectedLevel,
    quizScore,
    startQuiz,
    resetQuiz
  } = useQuiz();

  const courseTitle = selectedCourse === 'diploma' ? 'သုတဓမ္မ ဒီပလိုမာတန်း' : 'သုတဓမ္မ ဝိဇ္ဇာဘွဲ့တန်း';
  const levelTitle = selectedCourse === 'diploma' ? `Level ${selectedLevel}` : `အပိုင်း (${toBurmeseDigits(selectedLevel)})`;

  if (!quizScore) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 text-center my-auto space-y-6">
        <AlertCircle size={60} className="text-[#800000] mx-auto" />
        <h3 className="text-3xl font-black text-[#800000]">
          ရလဒ် အချက်အလက် မရှိသေးပါ
        </h3>
        <p className="text-xl text-gray-600">
          ကျေးဇူးပြု၍ ဉာဏ်စမ်းမေးခွန်းများကို ဦးစွာ ဖြေဆိုပေးပါ။
        </p>
        <button
          type="button"
          onClick={() => navigate('/practice')}
          className="bg-[#800000] text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-[#660000] cursor-pointer"
        >
          လေ့ကျင့်ခန်း စတင်ရန်
        </button>
      </main>
    );
  }

  const handleReview = () => {
    navigate('/review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryAgain = async () => {
    const success = await startQuiz();
    if (success) {
      navigate('/quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExit = () => {
    resetQuiz();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center items-center">
      <div className="w-full bg-white rounded-3xl shadow-2xl border-4 border-gray-100 p-8 md:p-14 text-center space-y-8">
        {/* Header info */}
        <div>
          <img
            src="/Suta Logo.png"
            alt="သုတဓမ္မ ဉာဏ်စမ်း Logo"
            className="w-20 h-20 mx-auto mb-3 object-contain drop-shadow"
          />
          <span className="inline-block bg-[#FF9933]/20 text-[#800000] text-lg font-bold px-5 py-2 rounded-full mb-2">
            {courseTitle} • {levelTitle}
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
                  : '#800000' // Maroon
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
        <div
          className={`p-5 md:p-6 rounded-2xl border-2 text-center transition-all ${
            quizScore.percentage >= 80
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : quizScore.percentage >= 50
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <p className="text-xl md:text-2xl font-bold leading-relaxed">
            {quizScore.percentage >= 80
              ? 'ဂုဏ်ယူပါသည်၊ အလွန်ကောင်းမွန်သော ရလဒ်ဖြစ်ပါသည်။ ဆက်လက် ကြိုးစားပါ။'
              : quizScore.percentage >= 50
              ? 'ကောင်းမွန်ပါသည်။ လိုအပ်သည်များကို ထပ်မံလေ့လာနိုင်ပါသည်။'
              : 'အားမလျှော့ပါနှင့်။ အဖြေများကိုပြန်စစ်ပြီး ထပ်မံကြိုးစားကြည့်ပါ။'}
          </p>
        </div>

        {/* Three Massive Action Buttons */}
        <div className="space-y-4 pt-4">
          {/* 1. Review Quiz */}
          <button
            type="button"
            onClick={handleReview}
            className="w-full bg-[#800000] hover:bg-[#660000] active:scale-[0.98] text-white text-2xl md:text-3xl font-black py-6 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 cursor-pointer"
          >
            <BookOpen size={32} className="text-[#FF9933]" />
            <span>အဖြေများပြန်စစ်ရန်</span>
          </button>

          {/* 2. Try Again */}
          <button
            type="button"
            onClick={handleTryAgain}
            className="w-full bg-[#FF9933] hover:bg-[#e68a00] active:scale-[0.98] text-white text-2xl md:text-3xl font-black py-6 px-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 cursor-pointer"
          >
            <RotateCcw size={32} />
            <span>ထပ်မံဖြေဆိုမည်</span>
          </button>

          {/* 3. Exit */}
          <button
            type="button"
            onClick={handleExit}
            className="w-full bg-white hover:bg-gray-100 active:scale-[0.98] text-gray-800 border-2 border-gray-300 text-2xl md:text-3xl font-bold py-5 px-8 rounded-2xl shadow-md transition-all flex items-center justify-center gap-4 cursor-pointer"
          >
            <Home size={30} className="text-gray-500" />
            <span>ထွက်မည်</span>
          </button>
        </div>
      </div>
    </main>
  );
}
