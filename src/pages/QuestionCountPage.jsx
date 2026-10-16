import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { toBurmeseDigits } from '../utils/formatters';

export default function QuestionCountPage() {
  const { course, level } = useParams();
  const navigate = useNavigate();
  const {
    questionCount,
    setQuestionCount,
    startQuiz,
    isQuizLoading,
    quizError
  } = useQuiz();

  const levelNum = parseInt(level, 10) || 1;
  const courseType = course?.toLowerCase() === 'ba' ? 'ba' : 'diploma';
  const courseTitle = courseType === 'diploma' ? 'သုတဓမ္မ ဒီပလိုမာတန်း' : 'သုတဓမ္မ ဝိဇ္ဇာဘွဲ့တန်း';
  const levelTitle = courseType === 'diploma' ? `Level ${levelNum}` : `အပိုင်း (${toBurmeseDigits(levelNum)})`;

  const handleStepperChange = (delta) => {
    setQuestionCount((prev) => {
      const next = prev + delta;
      if (next >= 10 && next <= 80) return next;
      return prev;
    });
  };

  const handleStart = async () => {
    const success = await startQuiz();
    if (success) {
      navigate('/quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    navigate(`/practice/${courseType}/${levelNum}/chapters`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-[#800000] text-2xl font-bold py-2 px-3 rounded-xl hover:bg-[#800000]/10 transition-colors cursor-pointer"
        >
          <ChevronLeft size={32} />
          <span>နောက်သို့</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-white border-2 border-[#800000]/20 rounded-full px-6 py-2 shadow-sm text-xl md:text-2xl font-bold text-[#800000]">
          <span>{courseTitle}</span>
          <span className="text-[#FF9933]">•</span>
          <span>{levelTitle}</span>
        </div>
      </div>

      {quizError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-800 text-lg text-center font-bold">
          {quizError}
        </div>
      )}

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
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white hover:bg-gray-100 active:scale-90 text-[#800000] shadow-md border-2 border-gray-200 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white hover:bg-gray-100 active:scale-90 text-[#800000] shadow-md border-2 border-gray-200 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
        type="button"
        onClick={handleStart}
        disabled={isQuizLoading}
        className="w-full bg-[#800000] hover:bg-[#660000] active:scale-[0.98] text-white text-3xl md:text-4xl font-extrabold py-7 px-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 cursor-pointer disabled:opacity-50"
      >
        <CheckCircle2 size={38} className="text-[#FF9933]" />
        <span>{isQuizLoading ? 'မေးခွန်းများ စီစဉ်နေပါသည်...' : 'မေးခွန်းစတင်မည်'}</span>
      </button>
    </main>
  );
}
