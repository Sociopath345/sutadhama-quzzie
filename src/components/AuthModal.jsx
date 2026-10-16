import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, CheckCircle2, Mail, RotateCcw, ArrowLeft, ShieldCheck } from 'lucide-react';
import { login, createVerifiedUser } from '../services/authService';
import { generateOtp, sendOtpEmail } from '../services/emailService';

export default function AuthModal({ isOpen, initialMode = 'login', onClose }) {
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'signup' | 'verify_otp'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up fields
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // OTP Verification state
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Status feedback
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const otpInputRefs = useRef([]);

  useEffect(() => {
    setAuthMode(initialMode);
    setAuthError('');
    setAuthSuccess('');
  }, [initialMode, isOpen]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

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

    const cleanEmail = signupEmail.trim();

    if (!cleanEmail || !signupPassword || !signupConfirmPassword) {
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
      const otp = generateOtp();
      setPendingEmail(cleanEmail);
      setPendingPassword(signupPassword);
      setExpectedOtp(otp);
      setOtpDigits(['', '', '', '', '', '']);

      const res = await sendOtpEmail(cleanEmail, otp);
      if (res.simulated && res.message) {
        setDevOtpHint(res.message);
      } else {
        setDevOtpHint('');
      }

      setAuthMode('verify_otp');
      setResendCooldown(30);
      setAuthSuccess('အတည်ပြုကုဒ် ၆ လုံးကို သင့်အီးမေးလ်သို့ ပေးပို့ထားပါသည်။');

      setTimeout(() => {
        setAuthSuccess('');
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 1500);
    } catch (err) {
      setAuthError(err.message || 'အတည်ပြုကုဒ် ပေးပို့ရာတွင် အဆင်မပြေဖြစ်သွားပါသည်။');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste of full 6-digit code
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const nextDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          nextDigits[i] = pasted[i] || '';
        }
        setOtpDigits(nextDigits);
        const nextIndex = Math.min(pasted.length, 5);
        if (otpInputRefs.current[nextIndex]) {
          otpInputRefs.current[nextIndex].focus();
        }
      }
      return;
    }

    const clean = value.replace(/\D/g, '');
    const nextDigits = [...otpDigits];
    nextDigits[index] = clean;
    setOtpDigits(nextDigits);

    // Auto-advance to next input box
    if (clean && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (otpInputRefs.current[index - 1]) {
        otpInputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length !== 6) {
      setAuthError('ဂဏန်း ၆ လုံးပြည့်အောင် ဖြည့်သွင်းပေးပါခင်ဗျာ။');
      return;
    }

    if (enteredOtp !== expectedOtp) {
      setAuthError('အတည်ပြုကုဒ် မှားယွင်းနေပါသည်။ ပြန်လည်စစ်ဆေးပေးပါ။');
      return;
    }

    setAuthLoading(true);
    try {
      await createVerifiedUser(pendingEmail, pendingPassword);
      setAuthSuccess('အကောင့်ဖွင့်ခြင်းနှင့် အီးမေးလ်အတည်ပြုခြင်း အောင်မြင်ပါသည်!');

      setTimeout(() => {
        onClose();
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        setPendingEmail('');
        setPendingPassword('');
        setExpectedOtp('');
        setOtpDigits(['', '', '', '', '', '']);
      }, 1200);
    } catch (err) {
      setAuthError(err.message || 'အကောင့်အတည်ပြုခြင်း မအောင်မြင်ပါ။');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    try {
      const otp = generateOtp();
      setExpectedOtp(otp);
      setOtpDigits(['', '', '', '', '', '']);

      const res = await sendOtpEmail(pendingEmail, otp);
      if (res.simulated && res.message) {
        setDevOtpHint(res.message);
      }

      setResendCooldown(30);
      setAuthSuccess('အတည်ပြုကုဒ်အသစ်ကို ထပ်မံပေးပို့ပြီးပါပြီ။');
      setTimeout(() => setAuthSuccess(''), 2500);

      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    } catch (err) {
      setAuthError('အတည်ပြုကုဒ် ပြန်လည်ပေးပို့ရာတွင် အဆင်မပြေဖြစ်သွားပါသည်။');
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
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
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
            {authMode === 'login'
              ? 'အကောင့်ဝင်ရန်'
              : authMode === 'signup'
              ? 'အကောင့်အသစ်ဖွင့်ရန်'
              : 'အီးမေးလ် အတည်ပြုရန်'}
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-1 font-medium">
            {authMode === 'verify_otp'
              ? 'EmailJS မှတစ်ဆင့် ပေးပို့ထားသော ကုဒ် ၆ လုံးကို ရိုက်ထည့်ပါ'
              : '(မှတ်စု: ဉာဏ်စမ်းလေ့ကျင့်ရန် အကောင့်ဝင်ရန် မလိုအပ်ပါ)'}
          </p>
        </div>

        {/* Mode Switch Tabs (Only shown for login / signup) */}
        {authMode !== 'verify_otp' && (
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
        )}

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
        {authMode === 'login' && (
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
        )}

        {/* 2. Sign Up Form */}
        {authMode === 'signup' && (
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
              className="w-full bg-[#800000] hover:bg-[#660000] active:scale-[0.99] text-white py-5 px-6 rounded-2xl text-2xl font-black shadow-xl transition-all cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Mail size={24} />
              <span>{authLoading ? 'ကုဒ်ပေးပို့နေပါသည်...' : 'အတည်ပြုကုဒ် ရယူမည်'}</span>
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

        {/* 3. OTP Verification Step */}
        {authMode === 'verify_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 text-center">
              <p className="text-gray-700 text-base font-semibold">
                အတည်ပြုကုဒ် ပေးပို့ထားသော အီးမေးလ်:
              </p>
              <p className="text-[#800000] font-black text-xl truncate mt-0.5">
                {pendingEmail}
              </p>
              {devOtpHint && (
                <p className="text-xs text-amber-800 font-bold mt-2 bg-amber-100/70 p-2 rounded-xl">
                  {devOtpHint}
                </p>
              )}
            </div>

            {/* 6 Digit Input Boxes */}
            <div>
              <label className="block text-center text-lg font-bold text-gray-800 mb-3">
                အတည်ပြုကုဒ် ၆ လုံး ရိုက်ထည့်ပါ
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-black bg-white border-2 border-gray-300 rounded-2xl outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/15 transition-all text-[#800000]"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading || otpDigits.join('').length !== 6}
              className="w-full bg-[#800000] hover:bg-[#660000] active:scale-[0.99] text-white py-5 px-6 rounded-2xl text-2xl font-black shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={26} />
              <span>{authLoading ? 'အတည်ပြုနေပါသည်...' : 'အတည်ပြုပြီး အကောင့်ဖွင့်မည်'}</span>
            </button>

            {/* Resend & Back actions */}
            <div className="flex items-center justify-between text-base font-bold text-gray-600 pt-2 px-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <ArrowLeft size={18} />
                <span>နောက်သို့</span>
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || authLoading}
                className="inline-flex items-center gap-1.5 text-[#800000] hover:text-[#660000] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>
                  {resendCooldown > 0
                    ? `ကုဒ်ပြန်ပို့ရန် (${resendCooldown}s)`
                    : 'ကုဒ် ထပ်မံပေးပို့မည်'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
