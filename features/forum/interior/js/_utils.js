import { LCG, DATA_PATHS, LIMITS } from '../../../../js/core/config.js';
import { asset } from '../../../../js/utils/url.js';

export const avatarColors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de', '#5ac8fa', '#ff9500'];

let users = [];
let usersPromise = null;

export function getUsers() { return users; }

export function initForumUsers() {
  if (usersPromise) return usersPromise;
  usersPromise = fetch('https://dummyjson.com/users?limit=100&select=id,firstName,lastName,image')
    .then(r => { if (!r.ok) throw new Error('DummyJSON fetch failed'); return r.json(); })
    .then(data => { users = data.users || []; })
    .catch(() => { users = []; });
  return usersPromise;
}

export function seededShuffle(array, seed) {
  const arr = [...array];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * LCG.A + LCG.C) % LCG.M;
    const j = Math.floor((s / LCG.M) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'kemarin';
  return `${days}h lalu`;
}

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export async function resolveForumData(isCourse, idx) {
  const [forumRes, detailRes, groupsRes] = await Promise.all([
    fetch(asset(DATA_PATHS.FORUM)).then(r => r.json()),
    fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
    fetch(asset(DATA_PATHS.GROUPS)).then(r => r.json()),
  ]);

  if (isCourse && forumRes.courses[idx]) {
    const forumData = forumRes.courses[idx];
    return {
      forumData, channels: forumData.channels, members: forumData.members,
      serverName: detailRes[idx]?.course?.title || 'Forum',
      forumId: 'course-' + idx, forumType: 'course', forumIndex: idx,
      memberCount: forumData.memberCount || forumData.members.length,
      memberLimit: forumData.memberLimit || LIMITS.DEFAULT_MEMBER_LIMIT,
      backLink: '/',
    };
  }
  if (!isCourse && forumRes.groups[idx]) {
    const forumData = forumRes.groups[idx];
    return {
      forumData, channels: forumData.channels, members: forumData.members,
      serverName: groupsRes.groups[idx]?.title || 'Grup',
      forumId: 'group-' + idx, forumType: 'group',
      forumIndex: forumRes.courses.length + idx,
      memberCount: groupsRes.groups[idx]?.members || forumData.members.length,
      memberLimit: groupsRes.groups[idx]?.maxMembers || LIMITS.DEFAULT_MEMBER_LIMIT,
      backLink: '/groups',
    };
  }
  return null;
}
