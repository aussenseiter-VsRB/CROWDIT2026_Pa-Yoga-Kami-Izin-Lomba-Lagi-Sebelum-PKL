export const STORAGE_KEYS = {
  USERS: 'studnow_users',
  USERS_VERSION: 'studnow_users_version',
  SESSION: 'studnow_session',
  DM_MESSAGES: 'studnow_dm_messages',
  USER_FOLLOWS: 'studnow_user_follows',
  FORUMS: 'studnow_forums',
  FOLLOWS: 'studnow_follows',
  NOTIFICATIONS: 'studnow_notifications',
  THEME: 'studnow_theme',
  DUMMY_USERS: 'studnow_dummy_users',
  DUMMY_TS: 'studnow_dummy_ts',
  INTERESTS: 'studnow_interests',
  AVATAR: 'studnow_avatar',
  BIO: 'studnow_bio',
  PRIVACY: 'studnow_privacy',
  ACTIVITIES: 'studnow_activities',
  BLOCKED_USERS: 'studnow_blocked_users',
  CUSTOM_GROUPS: 'studnow_custom_groups',
};

export const API = {
  DUMMY_USERS: 'https://dummyjson.com/users?limit=100&select=id,firstName,lastName,image,username',
  DUMMY_USERS_FORUM: 'https://dummyjson.com/users?limit=100&select=id,firstName,lastName,image',
  DUMMY_AVATAR_FALLBACK: 'https://dummyjson.com/icon/user/28',
};

export const DATA_PATHS = {
  USERS: '/data/users.json',
  DETAIL: '/data/detail.json',
  FORUM: '/data/forum.json',
  GROUPS: '/data/groups.json',
  SEARCH: '/data/search.json',
  AUTH: '/data/auth.json',
  CHAT: '/data/chat.json',
  HOME: '/features/home/home.json',
  ABOUT: '/features/about/about.json',
  CONTACT: '/features/contact/contact.json',
  HELP: '/features/help/help.json',
  SETTINGS: '/features/profile/settings/settings.json',
};

export const CSS_PATHS = {
  SHARED: '/css/_shared.css',
};

export const USERS_VERSION = 200;

export const LIMITS = {
  MAX_NOTIFICATIONS: 100,
  MAX_SEARCH_RESULTS: 20,
  MAX_TRENDING_TAGS: 5,
  MAX_SUGGESTED_ITEMS: 6,
  MAX_ACTIVE_MEMBERS: 25,
  MAX_AVATAR_STACK: 5,
  MAX_INTEREST_LENGTH: 30,
  MAX_DM_MESSAGE_LENGTH: 500,
  MIN_PASSWORD_LENGTH: 8,
  DEFAULT_MEMBER_LIMIT: 100,
  DEFAULT_USER_COUNT: 25,
  POPULAR_THRESHOLD: 50,
  ACTIVE_THRESHOLD: 10,
};

export const TIMING = {
  DUMMY_USER_TTL: 24 * 60 * 60 * 1000,
  APPROVAL_DELAY_MIN: 5000,
  APPROVAL_DELAY_MAX: 10000,
  AUTH_NAV_DELAY: 180,
  CONTACT_SEND_DELAY: 500,
  CONTACT_SUCCESS_DURATION: 2000,
  DM_SCROLL_DELAY: 50,
};

export const SEARCH_SCORES = {
  MIN_SCORE: 30,
  EXACT_TITLE_MATCH: 100,
  TITLE_PREFIX_MATCH: 80,
  TITLE_SUBSTRING_MATCH: 60,
  DESCRIPTION_MATCH: 30,
  TAG_MATCH: 40,
  CATEGORY_MATCH: 35,
  ALL_TERMS_BONUS: 20,
  NGRAM_OVERLAP_MULTIPLIER: 25,
};

export const LCG = {
  A: 9301,
  C: 49297,
  M: 233280,
};

export const MOBILE_BREAKPOINT = 900;

export const CONTACT = {
  EMAIL: 'support@studnow.com',
  PHONE: '+62 812-3456-7890',
};

export const DEFAULTS = {
  THEME: 'light',
  PRIVACY: 'public',
  INTERESTS: ['Matematika', 'Ilmu Komputer', 'Fisika'],
  FORUM_PRIVACY: 'public',
  ACTIVITIES: [
    { icon: 'book',   color: 'blue',   title: 'Memulai Kursus "Kalkulus Lanjut"',    desc: 'Progress: 2 dari 12 materi',     time: '2 jam lalu' },
    { icon: 'chat',   color: 'green',  title: 'Bertanya di Forum "Fisika Dasar"',      desc: 'Menunggu jawaban dari mentor',   time: '5 jam lalu' },
    { icon: 'check',  color: 'orange', title: 'Menyelesaikan "Aljabar Linear"',        desc: 'Nilai: 92/100',                  time: 'Kemarin' },
    { icon: 'star',   color: 'purple', title: 'Mendapatkan Badge "Rajin Belajar"',     desc: 'Selesaikan 10 kursus dalam sebulan', time: '3 hari lalu' },
  ],
};
