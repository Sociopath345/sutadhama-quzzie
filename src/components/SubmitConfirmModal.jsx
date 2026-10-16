import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function SubmitConfirmModal({
  isOpen,
  unansweredCount,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 text-center space-y-6 border-2 border-gray-100">
        <div className="w-16 h-16 rounded-full bg-[#FF9933]/20 text-[#FF9933] flex items-center justify-center mx-auto">
          <AlertCircle size={40} />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black text-[#800000]">
            အဖြေလွှာ တင်သွင်းရန် အတည်ပြုပါ
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed font-medium">
            သင် မဖြေဆိုရသေးသော မေးခွန်း{' '}
            <span className="font-black text-red-600">
              {unansweredCount}
            </span>{' '}
            ပုဒ် ကျန်ရှိနေပါသေးသည်။ အမှန်တကယ် အဖြေလွှာ တင်သွင်းလိုပါသလား။
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xl font-bold py-4 rounded-xl cursor-pointer transition-colors"
          >
            ဆက်လက်ဖြေဆိုမည်
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-[#800000] hover:bg-[#660000] text-white text-xl font-bold py-4 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            အဖြေလွှာတင်မည်
          </button>
        </div>
      </div>
    </div>
  );
}
