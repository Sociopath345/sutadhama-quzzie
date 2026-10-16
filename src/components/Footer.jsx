import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-500 py-4 px-6 text-center text-xs md:text-sm border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2.5">
        <img src="/Suta Logo.png" alt="Suta Logo" className="w-5 h-5 object-contain inline-block opacity-80" />
        <p className="text-gray-500">
          © 2026 သုတဓမ္မ ဉာဏ်စမ်း (Suta Dhama Quizzes), developed by{' '}
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
  );
}
