import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { formatChapterLabel, toBurmeseDigits } from '../utils/formatters';

export default function ChaptersPage() {
  const { course, level } = useParams();
  const navigate = useNavigate();
  const {
    selectedCourse,
    selectedLevel,
    setSelectedCourse,
    setSelectedLevel,
    availableChapters,
    selectedChapters,
    toggleChapter,
    selectAllChapters,
    isLoadingChapters,
    loadChaptersForSelection
  } = useQuiz();

  const levelNum = parseInt(level, 10) || 1;
  const courseType = course?.toLowerCase() === 'ba' ? 'ba' : 'diploma';
  const courseTitle = courseType === 'diploma' ? 'သုတဓမ္မ ဒီပလိုမာတန်း' : 'သုတဓမ္မ ဝိဇ္ဇာဘွဲ့တန်း';
  const levelTitle = courseType === 'diploma' ? `Level ${levelNum}` : `အပိုင်း (${toBurmeseDigits(levelNum)})`;

  useEffect(() => {
    if (selectedCourse !== courseType || selectedLevel !== levelNum || availableChapters.length === 0) {
      setSelectedCourse(courseType);
      setSelectedLevel(levelNum);
      loadChaptersForSelection(courseType, levelNum);
    }
  }, [courseType, levelNum]);

  const handleBack = () => {
    navigate(`/practice/${courseType}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (selectedChapters.length > 0) {
      navigate(`/practice/${courseType}/${levelNum}/count`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-start">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
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
          <span>{courseTitle}</span>
          <span className="text-[#FF9933]">•</span>
          <span>{levelTitle}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-[#800000]">
          {courseType === 'ba' ? 'လေ့ကျင့်မည့် အပိုင်းများ ရွေးချယ်ပါ' : 'လေ့ကျင့်မည့် အခန်းများ ရွေးချယ်ပါ'}
        </h2>
        <p className="text-base md:text-lg text-gray-500 mt-2 font-medium">
          မိမိ လေ့ကျင့်လိုသော အခန်းများကို အမှန်ခြစ်၍ ရွေးချယ်နိုင်ပါသည်
        </p>
      </div>

      {/* Loading State */}
      {isLoadingChapters && (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#800000]/20 border-t-[#800000] rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-bold text-[#800000]">
            အခန်းများကို စာရင်းရယူနေပါသည်...
          </p>
        </div>
      )}

      {/* Loaded Chapters List */}
      {!isLoadingChapters && availableChapters.length > 0 && (
        <div className="space-y-6">
          {/* Select All ("အကုန်ဖြေမည်။") Card */}
          <div
            onClick={selectAllChapters}
            className={`p-5 md:p-6 rounded-3xl border-3 shadow-md flex items-center justify-between cursor-pointer transition-all ${
              selectedChapters.length === availableChapters.length
                ? 'bg-[#FAF0E6] border-[#800000] ring-4 ring-[#800000]/15'
                : 'bg-white border-gray-300 hover:border-[#800000]/60'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all shrink-0 ${
                  selectedChapters.length === availableChapters.length
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
              const label = formatChapterLabel(ch, courseType);
              return (
                <div
                  key={ch}
                  onClick={() => toggleChapter(ch)}
                  className={`p-4 md:p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer select-none ${
                    isChecked
                      ? 'bg-[#FAF0E6] border-[#800000] text-[#800000] shadow-sm ring-2 ring-[#800000]/20'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl md:text-2xl font-bold flex-1 pr-3 leading-snug">
                    {label}
                  </span>

                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 ${
                      isChecked
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
              type="button"
              onClick={handleNext}
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
  );
}
