import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Check,
  AlertCircle
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import SubmitConfirmModal from '../components/SubmitConfirmModal';
import { toBurmeseDigits } from '../utils/formatters';

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    selectedCourse,
    selectedLevel,
    quizQuestions,
    currentQuestionIndex,
    userAnswers,
    isQuizLoading,
    quizError,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    skipQuestion,
    jumpToQuestion,
    submitQuiz,
    startQuiz
  } = useQuiz();

  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);

  const courseTitle = selectedCourse === 'diploma' ? 'သုတဓမ္မ ဒီပလိုမာတန်း' : 'သုတဓမ္မ ဝိဇ္ဇာဘွဲ့တန်း';
  const levelTitle = selectedCourse === 'diploma' ? `Level ${selectedLevel}` : `အပိုင်း (${toBurmeseDigits(selectedLevel)})`;

  const currentQ = quizQuestions[currentQuestionIndex] || null;

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

  const executeQuizSubmit = () => {
    setShowSubmitConfirmModal(false);
    submitQuiz();
    navigate('/results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isQuizLoading && quizQuestions.length === 0 && !quizError) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 text-center my-auto space-y-6">
        <AlertCircle size={60} className="text-[#800000] mx-auto" />
        <h3 className="text-3xl font-black text-[#800000]">
          စတင်ထားသော ဉာဏ်စမ်း မရှိသေးပါ
        </h3>
        <p className="text-xl text-gray-600">
          ကျေးဇူးပြု၍ သင်တန်းနှင့် အခန်းများကို ဦးစွာ ရွေးချယ်ပေးပါ။
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

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-start">
      {/* Loading State */}
      {isQuizLoading && (
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
      {quizError && !isQuizLoading && (
        <div className="my-auto bg-white rounded-3xl p-10 shadow-2xl border-2 border-red-200 text-center space-y-6">
          <AlertCircle size={60} className="text-red-500 mx-auto" />
          <h3 className="text-3xl font-black text-red-600">
            မေးခွန်းများ ရယူရာတွင် အဆင်မပြေပါ
          </h3>
          <p className="text-xl text-gray-700">{quizError}</p>
          <div className="pt-4 flex justify-center gap-4">
            <button
              type="button"
              onClick={startQuiz}
              className="bg-[#800000] text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-[#660000] cursor-pointer"
            >
              ထပ်မံကြိုးစားမည်
            </button>
            <button
              type="button"
              onClick={() => navigate(`/practice/${selectedCourse}/${selectedLevel}/count`)}
              className="bg-gray-200 text-gray-800 text-xl font-bold px-8 py-4 rounded-2xl hover:bg-gray-300 cursor-pointer"
            >
              နောက်သို့
            </button>
          </div>
        </div>
      )}

      {/* Loaded Quiz Content */}
      {!isQuizLoading && !quizError && currentQ && (
        <div className="space-y-6">
          {/* Top Status & Sticky Progress Bar */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 text-lg md:text-xl font-bold text-[#800000]">
                <span>{courseTitle}</span>
                <span className="text-[#FF9933]">•</span>
                <span>{levelTitle}</span>
              </div>

              {/* Submit Button Permanent in Header */}
              <button
                type="button"
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

          {/* TOP NAVIGATION BAR: နောက်သို့၊ ကျော်မည်၊ ရှေ့သို့ / အဖြေလွှာတင်မည် (Symmetrical Grid Layout) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center w-full">
            <button
              type="button"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="w-full bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-800 font-bold text-base sm:text-lg md:text-xl py-3 px-2 sm:px-4 rounded-2xl shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6 shrink-0" />
              <span className="truncate">နောက်သို့</span>
            </button>

            <button
              type="button"
              onClick={skipQuestion}
              disabled={currentQuestionIndex === quizQuestions.length - 1}
              className="w-full bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-700 font-bold text-base sm:text-lg md:text-xl py-3 px-2 sm:px-4 rounded-2xl shadow-sm flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              <span className="truncate">ကျော်မည်</span>
            </button>

            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <button
                type="button"
                onClick={nextQuestion}
                className="w-full bg-[#800000] hover:bg-[#660000] text-white font-bold text-base sm:text-lg md:text-xl py-3 px-2 sm:px-4 rounded-2xl shadow-md flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span className="truncate">ရှေ့သို့</span>
                <ChevronRight size={20} className="sm:w-6 sm:h-6 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePreSubmitQuiz}
                className="w-full bg-[#FF9933] hover:bg-[#e68a00] text-white font-extrabold text-xs sm:text-base md:text-lg py-3 px-1 sm:px-3 rounded-2xl shadow-lg flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all animate-pulse active:scale-95"
              >
                <CheckCircle2 size={18} className="sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate">အဖြေလွှာတင်မည်</span>
              </button>
            )}
          </div>

          {/* Main Question Card */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-6 md:p-10 space-y-8">
            {/* Question Header */}
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

            {/* Options List */}
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
                    type="button"
                    onClick={() => selectAnswer(opt.key)}
                    className={`w-full text-left p-5 md:p-6 rounded-2xl border-3 transition-all flex items-center gap-5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF0E6] border-[#800000] shadow-md ring-4 ring-[#800000]/15'
                        : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Option Letter Circle */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#800000] text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {opt.label}
                    </div>

                    {/* Option Text */}
                    <span
                      className={`text-xl md:text-2xl font-bold leading-normal flex-1 ${
                        isSelected ? 'text-[#800000]' : 'text-gray-800'
                      }`}
                    >
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

          {/* BOTTOM NAVIGATION BAR: နောက်သို့၊ ကျော်မည်၊ ရှေ့သို့ / အဖြေလွှာတင်မည် (Symmetrical Grid Layout) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center w-full pt-2">
            <button
              type="button"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="w-full bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-800 font-bold text-base sm:text-xl md:text-2xl py-3 sm:py-4 px-2 sm:px-6 rounded-2xl shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95"
            >
              <ChevronLeft size={20} className="sm:w-7 sm:h-7 shrink-0" />
              <span className="truncate">နောက်သို့</span>
            </button>

            <button
              type="button"
              onClick={skipQuestion}
              disabled={currentQuestionIndex === quizQuestions.length - 1}
              className="w-full bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-700 font-bold text-base sm:text-xl md:text-2xl py-3 sm:py-4 px-2 sm:px-6 rounded-2xl shadow-sm flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              <span className="truncate">ကျော်မည်</span>
            </button>

            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <button
                type="button"
                onClick={nextQuestion}
                className="w-full bg-[#800000] hover:bg-[#660000] text-white font-bold text-base sm:text-xl md:text-2xl py-3 sm:py-4 px-2 sm:px-6 rounded-2xl shadow-md flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span className="truncate">ရှေ့သို့</span>
                <ChevronRight size={20} className="sm:w-7 sm:h-7 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePreSubmitQuiz}
                className="w-full bg-[#FF9933] hover:bg-[#e68a00] text-white font-extrabold text-xs sm:text-lg md:text-xl py-3 sm:py-4 px-1 sm:px-4 rounded-2xl shadow-lg flex items-center justify-center gap-1 sm:gap-2 cursor-pointer transition-all animate-pulse active:scale-95"
              >
                <CheckCircle2 size={18} className="sm:w-6 sm:h-6 shrink-0" />
                <span className="truncate">အဖြေလွှာတင်မည်</span>
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
                    type="button"
                    onClick={() => jumpToQuestion(idx)}
                    className={`w-10 h-10 rounded-xl font-bold text-base transition-all cursor-pointer ${
                      isCurrent
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

      {/* Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={showSubmitConfirmModal}
        unansweredCount={quizQuestions.length - Object.keys(userAnswers).length}
        onConfirm={executeQuizSubmit}
        onCancel={() => setShowSubmitConfirmModal(false)}
      />
    </main>
  );
}
