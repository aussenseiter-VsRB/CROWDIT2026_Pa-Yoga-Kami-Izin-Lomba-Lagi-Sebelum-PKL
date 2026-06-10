import { navigateTo, asset } from '../utils/url.js';
import { STORAGE_KEYS, USERS_VERSION, DATA_PATHS } from '../core/config.js';
import { normalizeCategory } from '../../features/home/js/_utils.js';

const USERS_KEY = STORAGE_KEYS.USERS;
const USERS_VERSION_KEY = STORAGE_KEYS.USERS_VERSION;
const SESSION_KEY = STORAGE_KEYS.SESSION;

export function getUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(USERS_VERSION_KEY, String(USERS_VERSION));
}

export async function initUsers() {
  const storedVersion = Number(localStorage.getItem(USERS_VERSION_KEY));
  if (storedVersion !== USERS_VERSION) {
    const res = await fetch(asset(DATA_PATHS.USERS));
    const users = await res.json();
    saveUsers(users);
  }
}

export function login(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, error: 'Email atau password salah' };
  }
  const interests = (user.interests || []).map(normalizeCategory);
  const session = { email: user.email, name: user.name, interests };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

export function register(name, email, password, interests) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email sudah terdaftar' };
  }
  interests = (interests || []).map(normalizeCategory);
  const newUser = { name, email, password, interests };
  users.push(newUser);
  saveUsers(users);
  const session = { email, name, interests };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const s = localStorage.getItem(SESSION_KEY);
  if (!s) return null;
  const session = JSON.parse(s);
  if (!session.interests) {
    const users = getUsers();
    const user = users.find(u => u.email === session.email);
    if (user?.interests) session.interests = user.interests;
    else session.interests = [];
  }
  session.interests = session.interests.map(normalizeCategory);
  return session;
}

export function isAuthenticated() {
  return !!getSession();
}

export function navigateAfterAuth(path) {
  navigateTo(path);
}

export function updateInterests(email, interests) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return false;
  interests = interests.map(normalizeCategory);
  user.interests = interests;
  saveUsers(users);
  const ses = getSession();
  if (ses && ses.email === email) {
    ses.interests = interests;
    localStorage.setItem(SESSION_KEY, JSON.stringify(ses));
  }
  return true;
}
