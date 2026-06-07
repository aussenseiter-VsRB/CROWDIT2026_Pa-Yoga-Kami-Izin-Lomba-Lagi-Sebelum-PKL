const FORUMS_KEY = 'studnow_forums';

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

  const delay = Math.floor(Math.random() * 10000) + 5000;
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
  const existing = JSON.parse(localStorage.getItem('studnow_notifications') || '[]');
  existing.unshift(notif);
  if (existing.length > 100) existing.length = 100;
  localStorage.setItem('studnow_notifications', JSON.stringify(existing));
  window.dispatchEvent(new CustomEvent('notifications-update'));
}

export function getJoinedForums() {
  const forums = getForums();
  return Object.values(forums).filter(f => f.status === 'joined');
}
