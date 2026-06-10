import { TIMING, API, LIMITS, LCG } from '../core/config.js';

const CACHE_KEY = 'studnow_dummy_users';
const CACHE_TIME_KEY = 'studnow_dummy_ts';
const TTL = TIMING.DUMMY_USER_TTL;

function seededShuffle(array, seed) {
  const arr = [...array];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * LCG.A + LCG.C) % LCG.M;
    const j = Math.floor((s / LCG.M) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getSessionDirect() {
  try {
    const raw = localStorage.getItem('studnow_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function getUsersForContext(forumIndex, count = LIMITS.DEFAULT_USER_COUNT) {
  const session = getSessionDirect();

  const cached = localStorage.getItem(CACHE_KEY);
  const ts = localStorage.getItem(CACHE_TIME_KEY);
  let dummyUsers = [];

  if (cached && ts && Date.now() - Number(ts) < TTL) {
    dummyUsers = JSON.parse(cached);
  } else {
    try {
      const res = await fetch(API.DUMMY_USERS);
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