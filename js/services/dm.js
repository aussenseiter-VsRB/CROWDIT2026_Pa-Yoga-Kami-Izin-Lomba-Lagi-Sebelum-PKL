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

export function sendDMMessage(from, to, text, replyTo) {
  if (!text.trim()) return;
  const all = getAll();
  const msg = { from, to, text: text.trim(), time: new Date().toISOString(), read: false };
  if (replyTo) {
    msg.replyTo = { name: replyTo.name, text: replyTo.text.slice(0, 200), time: replyTo.time };
  }
  all.push(msg);
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
    const unread = getUnreadCountForConversation(email, other);
    convos.push({ with: other, lastMessage: m.text, lastTime: m.time, fromMe: m.from === email, unread });
  }
  return convos;
}

export function getUnreadDMCount(email) {
  return getAll().filter(m => m.to === email && !m.read).length;
}

export function getUnreadCountForConversation(userEmail, otherEmail) {
  return getAll().filter(m => m.from === otherEmail && m.to === userEmail && !m.read).length;
}

export function editDMMessage(userEmail, otherEmail, time, newText) {
  const all = getAll();
  const msg = all.find(m =>
    m.from === userEmail && m.to === otherEmail && m.time === time
  );
  if (!msg) return;
  msg.text = newText.trim();
  msg.edited = true;
  saveAll(all);
}

export function deleteDMMessage(userEmail, otherEmail, time) {
  const all = getAll();
  const idx = all.findIndex(m =>
    m.from === userEmail && m.to === otherEmail && m.time === time
  );
  if (idx === -1) return;
  all.splice(idx, 1);
  saveAll(all);
}

export function markConversationRead(userEmail, otherEmail) {
  const all = getAll();
  let changed = false;
  all.forEach(m => {
    if (m.from === otherEmail && m.to === userEmail && !m.read) {
      m.read = true;
      changed = true;
    }
  });
  if (changed) saveAll(all);
}
