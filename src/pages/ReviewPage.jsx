import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, X, HelpCircle, AlertCircle } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export default function ReviewPage() {
  const navigate = useNavigate();
  const {
    quizQuestions,
    userAnswers,
    resetQuiz
  } = useQuiz();

  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);

  if (quizQuestions.length === 0) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 text-center my-auto space-y-6">
        <AlertCircle size={60} className="text-[#800000] mx-auto" />
        <h3 className="text-3xl font-black text-[#800000]">
          စစ်ဆေးရန် အဖြေလွှာ မရှိသေးပါ
        </h3>
        <p className="text-xl text-gray-600">
          ကျေးဇူးပြု၍ ဉာဏ်စမ်းမေးခွန်းများကို ဦးစွာ ဖြေဆိုပြီးမှ ပြန်လည်စစ်ဆေးပါ။
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

  const reviewQ = quizQuestions[reviewQuestionIndex];

  const handleExit = () => {
    resetQuiz();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
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
            type="button"
            onClick={() => {
              navigate('/results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-base md:text-lg px-5 py-2 rounded-xl transition-all cursor-pointer"
          >
            ရလဒ်သို့
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="bg-[#800000] hover:bg-[#660000] text-white font-bold text-base md:text-lg px-5 py-2 rounded-xl transition-all cursor-pointer"
          >
            ထွက်မည်
          </button>
        </div>
      </div>

      {/* TOP REVIEW NAVIGATION BUTTONS: ရှေ့မေးခွန်းသို့ & နောက်မေးခွန်းသို့ */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            if (reviewQuestionIndex > 0) {
              setReviewQuestionIndex((prev) => prev - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={reviewQuestionIndex === 0}
          className="bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 text-gray-800 font-bold text-lg md:text-xl px-6 py-3.5 rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <ChevronLeft size={24} />
          <span>ရှေ့မေးခွန်းသို့</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (reviewQuestionIndex < quizQuestions.length - 1) {
              setReviewQuestionIndex((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={reviewQuestionIndex === quizQuestions.length - 1}
          className="bg-[#800000] hover:bg-[#660000] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg md:text-xl px-6 py-3.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <span>နောက်မေးခွန်းသို့</span>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Question Review Card */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-6 md:p-10 space-y-8">
        <div className="flex items-center justify-between">
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

        {/* Stepper buttons for review (Bottom buttons) */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => {
              if (reviewQuestionIndex > 0) {
                setReviewQuestionIndex((prev) => prev - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={reviewQuestionIndex === 0}
            className="bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-gray-300 font-bold text-xl px-6 py-3.5 rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <ChevronLeft size={24} />
            <span>ရှေ့မေးခွန်းသို့</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (reviewQuestionIndex < quizQuestions.length - 1) {
                setReviewQuestionIndex((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={reviewQuestionIndex === quizQuestions.length - 1}
            className="bg-[#800000] hover:bg-[#660000] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xl px-6 py-3.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
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
                type="button"
                onClick={() => {
                  setReviewQuestionIndex(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-10 h-10 rounded-xl font-bold text-base transition-all cursor-pointer ${pillColor} ${
                  isCurrent ? 'ring-4 ring-offset-2 ring-[#800000] scale-110 font-black' : ''
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
