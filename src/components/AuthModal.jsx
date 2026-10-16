import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { login, signup } from '../services/authService';

export default function AuthModal({ isOpen, initialMode = 'login', onClose }) {
  const [authMode, setAuthMode] = useState(initialMode);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!loginEmail.trim() || !loginPassword) {
      setAuthError('အီးမေးလ်နှင့် စကားဝှက်ကို ဖြည့်သွင်းပေးပါခင်ဗျာ။');
      return;
    }

    setAuthLoading(true);
    try {
      await login(loginEmail, loginPassword);
      setAuthSuccess('အောင်မြင်စွာ အကောင့်ဝင်ရောက်ပြီးပါပြီ။');
      setTimeout(() => {
        onClose();
        setLoginEmail('');
        setLoginPassword('');
      }, 800);
    } catch (err) {
      setAuthError(err.message || 'အကောင့်ဝင်ရောက်မှု မအောင်မြင်ပါ။');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!signupEmail.trim() || !signupPassword || !signupConfirmPassword) {
      setAuthError('အချက်အလက်အားလုံးကို ပြည့်စုံစွာ ဖြည့်သွင်းပေးပါခင်ဗျာ။');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setAuthError('စကားဝှက်များ တူညီမှု မရှိပါ။ ပြန်လည်စစ်ဆေးပေးပါ။');
      return;
    }

    if (signupPassword.length < 6) {
      setAuthError('စကားဝှက်သည် အနည်းဆုံး ၆ လုံး ရှိရပါမည်။');
      return;
    }

    setAuthLoading(true);
    try {
      await signup(signupEmail, signupPassword);
      setAuthSuccess('အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်');
      setTimeout(() => {
        onClose();
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
      }, 1000);
    } catch (err) {
      setAuthError(err.message || 'အကောင့်ဖွင့်ခြင်း မအောင်မြင်ပါ။');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF9F6] rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-10 relative border-2 border-gray-200 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            setAuthError('');
            setAuthSuccess('');
          }}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 cursor-pointer"
          aria-label="Close"
        >
          <X size={28} />
        </button>

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <img
            src="/Suta Logo.png"
            alt="သုတဓမ္မ ဉာဏ်စမ်း Logo"
            className="w-20 h-20 mx-auto mb-3 object-contain drop-shadow"
          />
          <h2 className="text-3xl sm:text-4xl font-black text-[#800000]">
            {authMode === 'login' ? 'အကောင့်ဝင်ရန်' : 'အကောင့်အသစ်ဖွင့်ရန်'}
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-1 font-medium">
            (မှတ်စု: ဉာဏ်စမ်းလေ့ကျင့်ရန် အကောင့်ဝင်ရန် မလိုအပ်ပါ)
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex bg-gray-200/80 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setAuthError('');
              setAuthSuccess('');
            }}
            className={`flex-1 py-3 text-lg sm:text-xl font-bold rounded-xl transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-[#800000] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ဝင်မည် (Log In)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setAuthError('');
              setAuthSuccess('');
            }}
            className={`flex-1 py-3 text-lg sm:text-xl font-bold rounded-xl transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-[#800000] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            အကောင့်ဖွင့်မည် (Sign Up)
          </button>
        </div>

        {/* Error & Success Messages */}
        {authError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-800 text-lg flex items-center gap-3">
            <AlertCircle size={24} className="shrink-0 text-red-600" />
            <span>{authError}</span>
          </div>
        )}
        {authSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border-2 border-green-300 text-green-800 text-lg flex items-center gap-3">
            <CheckCircle2 size={24} className="shrink-0 text-green-600" />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* 1. Log In Form */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xl font-bold text-gray-800 mb-2">
                အီးမေးလ် (Email)
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full p-4 sm:p-5 text-xl bg-white border-2 border-gray-300 rounded-2xl outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-gray-800 mb-2">
                စကားဝှက် (Password)
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 sm:p-5 text-xl bg-white border-2 border-gray-300 rounded-2xl outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#800000] hover:bg-[#660000] active:scale-[0.99] text-white py-5 px-6 rounded-2xl text-2xl font-black shadow-xl transition-all cursor-pointer mt-2 disabled:opacity-50"
            >
              {authLoading ? 'စစ်ဆေးနေပါသည်...' : 'ဝင်မည်'}
            </button>

            <p className="text-center text-lg text-gray-600 pt-2">
              အကောင့်မရှိသေးပါက{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="text-[#800000] font-bold underline hover:text-[#660000] cursor-pointer"
              >
                အကောင့်ဖွင့်မည်
              </button>
            </p>
          </form>
        ) : (
          /* 2. Sign Up Form */
          <form onSubmit={handleSignUpSubmit} className="space-y-5">
            <div>
              <label className="block text-xl font-bold text-gray-800 mb-2">
                အီးမေးလ် (Email)
              </label>
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full p-4 sm:p-5 text-xl bg-white border-2 border-gray-300 rounded-2xl outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-gray-800 mb-2">
                စကားဝှက် (Password)
              </label>
              <input
                type="password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="အနည်းဆုံး ၆ လုံး"
                className="w-full p-4 sm:p-5 text-xl bg-white border-2 border-gray-300 rounded-2xl outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-gray-800 mb-2">
                စကားဝှက် အတည်ပြုရန် (Confirm Password)
              </label>
              <input
                type="password"
                required
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                placeholder="စကားဝှက်ကို ထပ်မံရိုက်ထည့်ပါ"
                className="w-full p-4 sm:p-5 text-xl bg-white border-2 border-gray-300 rounded-2xl outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#800000] hover:bg-[#660000] active:scale-[0.99] text-white py-5 px-6 rounded-2xl text-2xl font-black shadow-xl transition-all cursor-pointer mt-2 disabled:opacity-50"
            >
              {authLoading ? 'လုပ်ဆောင်နေပါသည်...' : 'အကောင့်ဖွင့်မည်'}
            </button>

            <p className="text-center text-lg text-gray-600 pt-2">
              အကောင့်ရှိပြီးသားဖြစ်ပါက{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="text-[#800000] font-bold underline hover:text-[#660000] cursor-pointer"
              >
                ဝင်မည်
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
