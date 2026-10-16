/**
 * Lightweight Client-Side Authentication Service (Zero-Supabase, 100% Offline / LocalStorage)
 */
const STORAGE_KEY = 'sutadhama_user_session';
const listeners = new Set();

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function notify(user) {
  listeners.forEach(fn => {
    try {
      fn(user);
    } catch (e) {
      console.error(e);
    }
  });
}

export function onAuthStateChange(callback) {
  listeners.add(callback);
  callback(getCurrentUser());
  return () => listeners.delete(callback);
}

export async function login(email, password) {
  if (!email || !password) {
    throw new Error('အီးမေးလ်နှင့် စကားဝှက်ကို ဖြည့်သွင်းပေးပါခင်ဗျာ။');
  }

  const cleanEmail = email.trim().toLowerCase();
  const name = cleanEmail.split('@')[0];
  const user = {
    id: 'local_' + Date.now(),
    email: cleanEmail,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    created_at: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  notify(user);
  return user;
}

export async function signup(email, password) {
  if (!email || !password) {
    throw new Error('အချက်အလက်အားလုံးကို ပြည့်စုံစွာ ဖြည့်သွင်းပေးပါခင်ဗျာ။');
  }

  if (password.length < 6) {
    throw new Error('စကားဝှက်သည် အနည်းဆုံး ၆ လုံး ရှိရပါမည်။');
  }

  return login(email, password);
}

export async function logout() {
  localStorage.removeItem(STORAGE_KEY);
  notify(null);
}
