import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, AlertCircle, Send, Mail } from 'lucide-react';
import { sendFeedback } from '../services/feedbackService';

export default function ContactPage() {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError(null);
    setContactSuccess(false);

    try {
      await sendFeedback(contactForm);
      setContactSuccess(true);
      setContactForm({ firstName: '', lastName: '', email: '', message: '' });
      setTimeout(() => {
        setContactSuccess(false);
      }, 7000);
    } catch (err) {
      console.error('Contact submit error:', err);
      setContactError('မက်ဆေ့ခ်ျ ပေးပို့ရာတွင် အဆင်မပြေဖြစ်သွားပါသည်။ ကျေးဇူးပြု၍ တိုက်ရိုက် sutadhamaquizzes@gmail.com သို့ ဆက်သွယ်ပေးပို့နိုင်ပါသည်။');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
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

      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8 md:p-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#800000]">
                Contact Us
              </h2>
              <p className="text-gray-500 text-lg mt-1 font-medium">
                သင့်မေးမြန်းလိုသည်များနှင့် အကြံပြုချက်များကို ပေးပို့နိုင်ပါသည်။
              </p>
            </div>
            <a
              href="mailto:sutadhamaquizzes@gmail.com"
              className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-[#800000] border border-amber-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors w-fit"
            >
              <Mail size={16} />
              <span>sutadhamaquizzes@gmail.com</span>
            </a>
          </div>

          {contactSuccess ? (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-3">
              <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
              <h4 className="text-2xl font-bold text-emerald-800">
                ပေးပို့မှုအောင်မြင်ပါသည်
              </h4>
              <p className="text-emerald-700 text-lg">
                သင့်မက်ဆေ့ခ်ျကို sutadhamaquizzes@gmail.com သို့ လက်ခံရရှိပြီး မကြာမီ အကြောင်းပြန်ပေးပါမည်။
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {contactError && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-red-700 text-base flex items-center gap-3">
                  <AlertCircle size={24} className="shrink-0" />
                  <span>{contactError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                    className="w-full p-3.5 text-base border border-gray-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:border-[#800000] outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                    className="w-full p-3.5 text-base border border-gray-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:border-[#800000] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full p-3.5 text-base border border-gray-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:border-[#800000] outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">What can we help you with?</label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full p-3.5 text-base border border-gray-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:border-[#800000] outline-none transition-all resize-none font-medium"
                ></textarea>
              </div>

              <div className="pt-2 text-left">
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full sm:w-auto bg-[#800000] hover:bg-[#660000] active:scale-95 text-white font-bold text-lg px-8 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send size={18} />
                  <span>{contactSubmitting ? 'ပေးပို့နေပါသည်...' : 'ပေးပို့မည်'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
