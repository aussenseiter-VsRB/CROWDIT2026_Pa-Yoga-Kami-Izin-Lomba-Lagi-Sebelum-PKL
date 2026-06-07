import { navigateTo, asset } from './utils/url.js';

const USERS_KEY = 'studnow_users';
const USERS_VERSION_KEY = 'studnow_users_version';
const SESSION_KEY = 'studnow_session';
const CURRENT_VERSION = 2;

export function getUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(USERS_VERSION_KEY, String(CURRENT_VERSION));
}

export async function initUsers() {
  const storedVersion = Number(localStorage.getItem(USERS_VERSION_KEY));
  if (storedVersion !== CURRENT_VERSION) {
    const res = await fetch(asset('/data/users.json'));
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
  const session = { email: user.email, name: user.name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

export function register(name, email, password) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email sudah terdaftar' };
  }
  const newUser = { name, email, password };
  users.push(newUser);
  saveUsers(users);
  const session = { email, name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const s = localStorage.getItem(SESSION_KEY);
  return s ? JSON.parse(s) : null;
}

export function isAuthenticated() {
  return !!getSession();
}

export function navigateAfterAuth(path) {
  navigateTo(path);
}
