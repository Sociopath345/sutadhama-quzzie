import emailjs from '@emailjs/browser';

/**
 * Service to generate and send 6-digit verification OTP codes via EmailJS.
 */

// EmailJS credentials from Vite environment variables (or placeholders)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

/**
 * Generates a random 6-digit numeric OTP code.
 * @returns {string} 6-digit OTP string (e.g. "492817")
 */
export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Sends a 6-digit OTP code to the recipient's email address via EmailJS.
 * @param {string} email Recipient email
 * @param {string} otp 6-digit OTP code
 * @param {string} userName Optional user name
 * @returns {Promise<{ success: boolean, simulated: boolean, message?: string }>}
 */
export async function sendOtpEmail(email, otp, userName = '') {
  const cleanEmail = email.trim();
  const recipientName = userName || cleanEmail.split('@')[0];

  const templateParams = {
    to_email: cleanEmail,
    email: cleanEmail,
    to_name: recipientName,
    otp_code: otp,
    passcode: otp,
    app_name: 'သုတဓမ္မ ဉာဏ်စမ်း (Suta Dhama Quizzes)',
    message: `သင်၏ သုတဓမ္မ ဉာဏ်စမ်း အကောင့်အတည်ပြုကုဒ်မှာ ${otp} ဖြစ်ပါသည်။ ဤကုဒ်ကို မည်သူ့ကိုမျှ မမျှဝေပါနှင့်။`
  };

  // If EmailJS credentials are configured, attempt real email transmission
  if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
    try {
      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      if (response.status === 200 || response.text === 'OK') {
        return { success: true, simulated: false };
      }
    } catch (err) {
      console.warn('EmailJS transmission failed, falling back to simulated mode:', err);
    }
  }

  // Fallback / Development mode when API keys are not yet configured
  console.info(
    `[EmailJS Dev Mode] OTP for ${cleanEmail}: ${otp}\n(To send real emails, set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in .env)`
  );

  return {
    success: true,
    simulated: true,
    message: `(စမ်းသပ်မှုမုဒ်: အတည်ပြုကုဒ်မှာ ${otp} ဖြစ်ပါသည်)`
  };
}
