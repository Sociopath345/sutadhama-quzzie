/**
 * Lightweight Client-Side Authentication Service with Email Verification Support
 */
const SESSION_KEY = 'sutadhama_user_session';
const ACCOUNTS_KEY = 'sutadhama_registered_accounts';
const listeners = new Set();

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStoredAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
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
  const accounts = getStoredAccounts();
  const existing = accounts[cleanEmail];

  if (existing && existing.password && existing.password !== password) {
    throw new Error('စကားဝှက် မှားယွင်းနေပါသည်။ ပြန်လည်စစ်ဆေးပေးပါ။');
  }

  const name = cleanEmail.split('@')[0];
  const user = {
    id: existing?.id || 'user_' + Date.now(),
    email: cleanEmail,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    emailVerified: existing?.emailVerified ?? true,
    created_at: existing?.created_at || new Date().toISOString()
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  notify(user);
  return user;
}

export async function createVerifiedUser(email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const name = cleanEmail.split('@')[0];
  const accounts = getStoredAccounts();

  const user = {
    id: 'user_' + Date.now(),
    email: cleanEmail,
    password: password,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    emailVerified: true,
    created_at: new Date().toISOString()
  };

  accounts[cleanEmail] = user;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  notify(user);
  return user;
}

export async function logout() {
  localStorage.removeItem(SESSION_KEY);
  notify(null);
}
