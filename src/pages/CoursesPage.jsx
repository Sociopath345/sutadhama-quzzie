import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ChevronLeft } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export default function CoursesPage() {
  const navigate = useNavigate();
  const { setSelectedCourse } = useQuiz();

  const handleSelect = (courseType) => {
    setSelectedCourse(courseType);
    if (courseType === 'diploma') {
      navigate('/practice/diploma');
    } else {
      navigate('/practice/ba');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-[#800000] text-2xl font-bold py-2 px-3 rounded-xl hover:bg-[#800000]/10 transition-colors cursor-pointer"
        >
          <ChevronLeft size={32} />
          <span>ပင်မစာမျက်နှာသို့</span>
        </button>
      </div>

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
          type="button"
          onClick={() => handleSelect('diploma')}
          className="bg-white hover:bg-[#FAF0E6] text-[#800000] border-4 border-gray-200 hover:border-[#800000] rounded-3xl p-10 md:p-14 shadow-lg hover:shadow-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-6 cursor-pointer"
        >
          <div className="w-24 h-24 rounded-3xl bg-[#800000]/10 text-[#800000] flex items-center justify-center">
            <BookOpen size={52} />
          </div>
          <span className="text-3xl md:text-4xl font-black">
            သုတဓမ္မဒီပလိုမာတန်း
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('ba')}
          className="bg-white hover:bg-[#FAF0E6] text-[#800000] border-4 border-gray-200 hover:border-[#800000] rounded-3xl p-10 md:p-14 shadow-lg hover:shadow-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-6 cursor-pointer"
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
  );
}
