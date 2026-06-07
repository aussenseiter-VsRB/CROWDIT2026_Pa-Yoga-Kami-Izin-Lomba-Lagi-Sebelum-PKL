import { getSession } from './auth.js';

const CACHE_KEY = 'studnow_dummy_users';
const CACHE_TIME_KEY = 'studnow_dummy_ts';
const TTL = 24 * 60 * 60 * 1000;

function seededShuffle(array, seed) {
  const arr = [...array];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function getUsersForContext(forumIndex, count = 25) {
  const session = getSession();

  const cached = localStorage.getItem(CACHE_KEY);
  const ts = localStorage.getItem(CACHE_TIME_KEY);
  let dummyUsers = [];

  if (cached && ts && Date.now() - Number(ts) < TTL) {
    dummyUsers = JSON.parse(cached);
  } else {
    try {
      const res = await fetch('https://dummyjson.com/users?limit=100&select=id,firstName,lastName,image,username');
      if (!res.ok) throw new Error('DummyJSON fetch failed');
      const data = await res.json();
      dummyUsers = data.users || [];
      localStorage.setItem(CACHE_KEY, JSON.stringify(dummyUsers));
      localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
    } catch {
      dummyUsers = [];
    }
  }

  const shuffled = seededShuffle(dummyUsers, forumIndex);
  const top = shuffled.slice(0, count);

  if (session) {
    top.unshift({
      id: 'local',
      firstName: session.name || 'User',
      lastName: '',
      image: '',
      username: session.email || '',
      isLocal: true,
    });
  }

  return top;
}
