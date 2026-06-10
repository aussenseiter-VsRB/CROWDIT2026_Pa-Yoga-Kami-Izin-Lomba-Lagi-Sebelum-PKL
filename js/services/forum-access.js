import { STORAGE_KEYS, LIMITS, TIMING } from '../core/config.js';

const FORUMS_KEY = STORAGE_KEYS.FORUMS;

function getForums() {
  try {
    const stored = localStorage.getItem(FORUMS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveForums(forums) {
  localStorage.setItem(FORUMS_KEY, JSON.stringify(forums));
}

function buildKey(type, index) {
  return type === 'course' ? `course_${index}` : `group_${index}`;
}

export function getForumStatus(type, index) {
  const forums = getForums();
  const key = buildKey(type, index);
  return forums[key]?.status || 'none';
}

export function joinForum(type, index) {
  const forums = getForums();
  const key = buildKey(type, index);
  forums[key] = { type, index, status: 'joined', joinedAt: Date.now() };
  saveForums(forums);
  window.dispatchEvent(new CustomEvent('forum-join-update'));
}

export function leaveForum(type, index) {
  const forums = getForums();
  const key = buildKey(type, index);
  delete forums[key];
  saveForums(forums);
  window.dispatchEvent(new CustomEvent('forum-join-update'));
}

export function requestJoin(type, index, forumName) {
  const forums = getForums();
  const key = buildKey(type, index);
  forums[key] = { type, index, status: 'pending', requestedAt: Date.now() };
  saveForums(forums);
  window.dispatchEvent(new CustomEvent('forum-join-update'));

  const delay = Math.floor(Math.random() * TIMING.APPROVAL_DELAY_MAX) + TIMING.APPROVAL_DELAY_MIN;
  setTimeout(() => {
    approveForum(type, index, forumName);
  }, delay);
}

export function approveForum(type, index, forumName) {
  const forums = getForums();
  const key = buildKey(type, index);
  if (forums[key]?.status !== 'pending') return;
  forums[key].status = 'joined';
  forums[key].approvedAt = Date.now();
  saveForums(forums);
  window.dispatchEvent(new CustomEvent('forum-join-update'));

  const notif = {
    id: Date.now(),
    type: 'forum_approved',
    title: 'Permintaan disetujui',
    description: `Permintaan bergabung ke "${forumName}" disetujui`,
    link: `/forum-interior?${type}=${index}`,
    time: new Date().toISOString(),
    read: false,
  };
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  existing.unshift(notif);
  if (existing.length > LIMITS.MAX_NOTIFICATIONS) existing.length = LIMITS.MAX_NOTIFICATIONS;
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(existing));
  window.dispatchEvent(new CustomEvent('notifications-update'));
}

export function getJoinedForums() {
  const forums = getForums();
  return Object.values(forums).filter(f => f.status === 'joined');
}

const MEMBER_COUNTS_KEY = 'studnow_member_counts';

function getMemberCounts() {
  try {
    return JSON.parse(localStorage.getItem(MEMBER_COUNTS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveMemberCounts(counts) {
  localStorage.setItem(MEMBER_COUNTS_KEY, JSON.stringify(counts));
}

export function getLiveMemberCount(index, fallback) {
  const counts = getMemberCounts();
  return typeof counts[index] === 'number' ? counts[index] : fallback;
}

export function incrementMemberCount(index, initialCount) {
  const counts = getMemberCounts();
  if (typeof counts[index] === 'number') {
    counts[index] += 1;
  } else {
    counts[index] = (initialCount || 0) + 1;
  }
  saveMemberCounts(counts);
  window.dispatchEvent(new CustomEvent('member-count-update'));
}

export function decrementMemberCount(index, initialCount) {
  const counts = getMemberCounts();
  if (typeof counts[index] === 'number') {
    counts[index] = Math.max(0, counts[index] - 1);
  } else {
    counts[index] = Math.max(0, (initialCount || 0) - 1);
  }
  saveMemberCounts(counts);
  window.dispatchEvent(new CustomEvent('member-count-update'));
}
