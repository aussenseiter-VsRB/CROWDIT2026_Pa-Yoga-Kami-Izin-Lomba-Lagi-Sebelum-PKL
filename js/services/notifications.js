import { STORAGE_KEYS, LIMITS } from '../core/config.js';

const FOLLOWS_KEY = STORAGE_KEYS.FOLLOWS;
const NOTIFICATIONS_KEY = STORAGE_KEYS.NOTIFICATIONS;

let notifIdCounter = Date.now();

function getFollows() {
  const stored = localStorage.getItem(FOLLOWS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveFollows(follows) {
  localStorage.setItem(FOLLOWS_KEY, JSON.stringify(follows));
}

function getNotifications() {
  const stored = localStorage.getItem(NOTIFICATIONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveNotifications(notifs) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
}

export function isFollowing(id, type) {
  return getFollows().some(f => f.id === id && f.type === type);
}

export function follow(id, type, name) {
  const follows = getFollows();
  if (follows.some(f => f.id === id && f.type === type)) return false;
  follows.push({ id, type, name, followedAt: new Date().toISOString() });
  saveFollows(follows);
  return true;
}

export function unfollow(id, type) {
  const follows = getFollows().filter(f => !(f.id === id && f.type === type));
  saveFollows(follows);
  return true;
}

export function toggleFollow(id, type, name) {
  if (isFollowing(id, type)) {
    unfollow(id, type);
    return false;
  }
  follow(id, type, name);
  return true;
}

export function getAllFollows() {
  return getFollows();
}

export function addNotification(type, title, description, link) {
  const notifs = getNotifications();
  const notif = {
    id: ++notifIdCounter,
    type,
    title,
    description,
    link: link || '/',
    time: new Date().toISOString(),
    read: false,
  };
  notifs.unshift(notif);
  if (notifs.length > LIMITS.MAX_NOTIFICATIONS) notifs.length = LIMITS.MAX_NOTIFICATIONS;
  saveNotifications(notifs);
  window.dispatchEvent(new CustomEvent('notifications-update'));
  return notif;
}

export function getUnreadNotifications() {
  return getNotifications().filter(n => !n.read);
}

export function getAllNotifications() {
  return getNotifications();
}

export function getUnreadCount() {
  return getNotifications().filter(n => !n.read).length;
}

export function markAsRead(id) {
  const notifs = getNotifications();
  const found = notifs.find(n => n.id === id);
  if (found) {
    found.read = true;
    saveNotifications(notifs);
    window.dispatchEvent(new CustomEvent('notifications-update'));
  }
}

export function markAllAsRead() {
  const notifs = getNotifications();
  notifs.forEach(n => { n.read = true; });
  saveNotifications(notifs);
  window.dispatchEvent(new CustomEvent('notifications-update'));
}

export function notifyNewMessage(forumId, forumType, forumName, channelName, userName, messageText, link) {
  const follows = getFollows();
  const isFollowed = follows.some(f => f.id === forumId && f.type === forumType);
  if (!isFollowed) return null;

  const title = `Pesan baru di ${forumName}`;
  const desc = `${userName} membalas di #${channelName}: "${messageText.length > 60 ? messageText.slice(0, 60) + '...' : messageText}"`;
  return addNotification('forum', title, desc, link || '/');
}

export function seedSampleNotifications() {
  const existing = getNotifications();
  if (existing.length > 0) return;

  const samples = [
    { type: 'forum', title: 'Balasan baru di Persiapan UTS Kalkulus', description: 'Fatan membalas: "Saya juga masih bingung soal integral lipat dua..."', link: '/groups?index=0', time: new Date(Date.now() - 120000).toISOString() },
    { type: 'mention', title: 'Mention dari All di Struktur Data', description: 'All menyebut Anda dalam diskusi tentang pohon biner', link: '/groups?index=1', time: new Date(Date.now() - 300000).toISOString() },
    { type: 'group', title: 'Anggota baru di grup Fisika', description: 'Manca bergabung ke grup Mekanika Klasik', link: '/groups', time: new Date(Date.now() - 3600000).toISOString() },
    { type: 'forum', title: 'Thread baru di Aljabar Linear', description: 'Diskusi baru: "Pemecahan soal eigenvalues" telah dimulai', link: '/groups?index=4', time: new Date(Date.now() - 7200000).toISOString() },
    { type: 'badge', title: 'Badge "Rajin Belajar" diraih!', description: 'Selesaikan 10 kursus untuk mendapatkan badge ini', link: '/profile', time: new Date(Date.now() - 86400000).toISOString() },
    { type: 'forum', title: 'Pembahasan soal UTS mendatang', description: 'Admin mengumumkan jadwal sesi tambahan untuk persiapan UTS', link: '/groups?index=0', time: new Date(Date.now() - 172800000).toISOString() },
  ];

  notifIdCounter = Date.now() + 100;
  samples.forEach(s => {
    s.id = ++notifIdCounter;
    s.read = false;
  });
  saveNotifications(samples);
  window.dispatchEvent(new CustomEvent('notifications-update'));
}
