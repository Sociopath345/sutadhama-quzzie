import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, BookOpen } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
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

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <button
                type="button"
                onClick={() => {
                  navigate('/practice');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3.5 bg-[#FFCC00] hover:bg-[#e6b800] active:scale-95 text-[#1a1638] text-2xl md:text-3xl font-black px-10 sm:px-12 py-4 sm:py-5 rounded-full shadow-2xl transition-all cursor-pointer"
              >
                <span>ယခုလေ့ကျင့်ပါ</span>
                <Sparkles className="text-[#1a1638]" />
              </button>

              {/* Mobile Quick Action Pill for About Us */}
              <button
                type="button"
                onClick={() => {
                  navigate('/about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="md:hidden inline-flex items-center gap-2 text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full border border-white/20 text-base font-bold transition-all cursor-pointer"
              >
                <span>ကျွန်ုပ်တို့အကြောင်း (About Us)</span>
                <ChevronRight size={18} />
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
  );
}
