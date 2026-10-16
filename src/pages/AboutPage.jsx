import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import { aboutContent } from '../utils/formatters';

export default function AboutPage() {
  const navigate = useNavigate();
  const [aboutLang, setAboutLang] = useState('my'); // 'my' | 'en'

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-10 space-y-8">
      {/* Top Bar: Back to Home + Language Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-[#800000] hover:text-[#660000] font-bold text-lg md:text-xl py-2 px-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronLeft size={24} />
          <span>{aboutLang === 'my' ? 'မူလစာမျက်နှာသို့' : 'Back to Home'}</span>
        </button>

        {/* Language Toggle Pill Switcher */}
        <div className="inline-flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
          <button
            type="button"
            onClick={() => setAboutLang('my')}
            className={`px-4 py-2 rounded-xl text-base md:text-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
              aboutLang === 'my'
                ? 'bg-[#800000] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>🇲🇲</span>
            <span>မြန်မာ</span>
          </button>
          <button
            type="button"
            onClick={() => setAboutLang('en')}
            className={`px-4 py-2 rounded-xl text-base md:text-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
              aboutLang === 'en'
                ? 'bg-[#800000] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      </div>

      {/* 1. Hero Card */}
      <div className="bg-gradient-to-br from-[#1a1638] via-[#2a1335] to-[#800000] rounded-3xl p-8 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF9933]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#800000]/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src="/Suta Logo.png"
              alt="သုတဓမ္မ ဉာဏ်စမ်း Logo"
              className="w-24 h-24 object-contain rounded-2xl shadow-xl border-2 border-amber-300/40 bg-[#FAF9F6] p-1 shrink-0"
            />
            <div className="space-y-2">
              <span className="inline-block bg-[#FFCC00]/20 text-[#FFCC00] text-sm md:text-base font-bold px-4 py-1.5 rounded-full border border-[#FFCC00]/30">
                {aboutContent[aboutLang].heroTag}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {aboutContent[aboutLang].heroTitle}
              </h1>
            </div>
          </div>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 font-normal leading-relaxed text-justify sm:text-left">
            {aboutContent[aboutLang].heroSubtitle}
          </p>
        </div>
      </div>

      {/* 2. Our Objective Card */}
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border-2 border-gray-100 relative overflow-hidden">
        <div className="w-2 h-full bg-[#800000] absolute left-0 top-0"></div>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FF9933]/15 text-[#800000] flex items-center justify-center shrink-0">
            <Sparkles size={30} className="text-[#800000]" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#800000]">
              {aboutContent[aboutLang].objectiveTitle}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
              {aboutContent[aboutLang].objectiveDesc}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Features Grid (4 Cards) */}
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <span className="inline-block bg-[#800000]/10 text-[#800000] text-base md:text-lg font-bold px-4 py-1.5 rounded-full mb-2">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#800000]">
            {aboutContent[aboutLang].featuresTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aboutContent[aboutLang].features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 shadow-md border-2 border-gray-100 hover:border-[#FF9933]/60 transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#800000]/10 text-[#800000] flex items-center justify-center mb-4 group-hover:bg-[#800000] group-hover:text-white transition-colors">
                {idx === 0 && <Award size={26} />}
                {idx === 1 && <CheckCircle2 size={26} />}
                {idx === 2 && <BookOpen size={26} />}
                {idx === 3 && <GraduationCap size={26} />}
              </div>
              <h3 className="text-2xl font-black text-[#800000] mb-2">
                {feat.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Created with Goodwill Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/80 rounded-3xl p-8 md:p-10 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-[#800000] flex items-center justify-center shrink-0">
            <GraduationCap size={32} className="text-[#800000]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-[#800000]">
              {aboutContent[aboutLang].goodwillTitle}
            </h3>
            <p className="text-lg sm:text-xl text-gray-800 leading-relaxed font-medium">
              {aboutContent[aboutLang].goodwillDesc}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Disclaimer Card */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-3 text-gray-700">
          <AlertCircle size={24} className="text-[#800000] shrink-0" />
          <h4 className="text-xl font-bold uppercase tracking-wider text-gray-800">
            {aboutContent[aboutLang].disclaimerTitle}
          </h4>
        </div>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          {aboutContent[aboutLang].disclaimerDesc}
        </p>
      </div>

      {/* 6. Blessing & Start Practice CTA */}
      <div className="bg-[#1a1638] rounded-3xl p-8 md:p-12 text-center text-white shadow-xl space-y-6">
        <p className="text-xl sm:text-2xl text-amber-200 font-medium italic max-w-3xl mx-auto leading-relaxed">
          "{aboutContent[aboutLang].blessingText}"
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              navigate('/practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-3 bg-[#FFCC00] hover:bg-[#e6b800] active:scale-95 text-[#1a1638] text-2xl font-black px-10 py-5 rounded-full shadow-2xl transition-all cursor-pointer"
          >
            <span>{aboutContent[aboutLang].startPracticeBtn}</span>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </main>
  );
}
