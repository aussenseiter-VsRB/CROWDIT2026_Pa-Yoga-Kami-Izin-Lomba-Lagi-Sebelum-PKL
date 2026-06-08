import { STORAGE_KEYS } from '../core/config.js';

const DM_KEY = STORAGE_KEYS.DM_MESSAGES;

function getAll() {
  const stored = localStorage.getItem(DM_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveAll(msgs) {
  localStorage.setItem(DM_KEY, JSON.stringify(msgs));
}

export function getDMMessages(userEmail, otherEmail) {
  return getAll().filter(m =>
    (m.from === userEmail && m.to === otherEmail) ||
    (m.from === otherEmail && m.to === userEmail)
  ).sort((a, b) => new Date(a.time) - new Date(b.time));
}

export function sendDMMessage(from, to, text) {
  if (!text.trim()) return;
  const all = getAll();
  all.push({ from, to, text: text.trim(), time: new Date().toISOString() });
  saveAll(all);
}

export function getConversations(email) {
  const all = getAll();
  const seen = new Set();
  const convos = [];
  for (let i = all.length - 1; i >= 0; i--) {
    const m = all[i];
    const other = m.from === email ? m.to : m.from;
    if (other === email) continue;
    if (seen.has(other)) continue;
    seen.add(other);
    convos.push({ with: other, lastMessage: m.text, lastTime: m.time, fromMe: m.from === email });
  }
  return convos;
}

export function getUnreadDMCount(email) {
  return getAll().filter(m => m.to === email).length;
}
