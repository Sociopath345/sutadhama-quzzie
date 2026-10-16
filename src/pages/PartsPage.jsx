import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export default function PartsPage() {
  const navigate = useNavigate();
  const { setSelectedCourse, setSelectedLevel } = useQuiz();

  const handlePartSelect = async (partNum) => {
    setSelectedCourse('ba');
    await setSelectedLevel(partNum);
    navigate(`/practice/ba/${partNum}/chapters`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => {
            navigate('/practice');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-[#800000] text-2xl font-bold py-2 px-3 rounded-xl hover:bg-[#800000]/10 transition-colors cursor-pointer"
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
          အပိုင်းရွေးချယ်ပါ
        </h2>
      </div>

      <div className="space-y-6">
        {[
          { label: 'အပိုင်း (၁)', num: 1 },
          { label: 'အပိုင်း (၂)', num: 2 },
          { label: 'အပိုင်း (၃)', num: 3 }
        ].map(({ label, num }) => (
          <button
            key={num}
            type="button"
            onClick={() => handlePartSelect(num)}
            className="w-full bg-white hover:bg-[#FAF0E6] text-[#800000] border-4 border-gray-200 hover:border-[#800000] rounded-3xl p-8 shadow-md hover:shadow-2xl active:scale-[0.98] transition-all text-center cursor-pointer"
          >
            <span className="text-3xl md:text-5xl font-black tracking-wide">
              {label}
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
