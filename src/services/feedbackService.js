/**
 * Service to deliver user feedback directly to sutadhamaquizzes@gmail.com
 */
const RECIPIENT_EMAIL = 'sutadhamaquizzes@gmail.com';

export async function sendFeedback({ firstName, lastName, email, message }) {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Anonymous Learner';

  const payload = {
    name: fullName,
    email: email.trim(),
    message: message.trim(),
    _subject: `သုတဓမ္မ ဉာဏ်စမ်း Feedback မှ ပေးပို့လွှာ: ${fullName}`,
    _template: 'table',
    _captcha: 'false',
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok || result.success === 'true' || result.success === true) {
      return { success: true };
    }
  } catch (err) {
    console.warn('Direct API submission error, falling back to mailto:', err);
  }

  // Fallback: build mailto link if API cannot be reached
  const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(
    `သုတဓမ္မ ဉာဏ်စမ်း Feedback: ${fullName}`
  )}&body=${encodeURIComponent(
    `အမည်: ${fullName}\nအီးမေးလ်: ${email}\n\nမက်ဆေ့ခ်ျ:\n${message}`
  )}`;

  // Attempt to open mail client as graceful fallback
  window.open(mailtoUrl, '_blank');

  return { success: true, viaMailto: true };
}
