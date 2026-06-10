import { getLiveMemberCount, getForumStatus } from '../../../js/services/forum-access.js';
import { LIMITS } from '../../../js/core/config.js';

const CATEGORY_EN = {
  matematika: 'Mathematics',
  'ilmu komputer': 'Computer Science',
  filsafat: 'Philosophy',
  sains: 'Science',
  sastra: 'Literature',
  fisika: 'Physics',
};

export function normalizeCategory(cat) {
  if (!cat) return '';
  const key = cat.trim().toLowerCase();
  return CATEGORY_EN[key] || cat;
}

export function mergeCourseData(forum, course, participants, index, creator) {
  const liveJoined = getLiveMemberCount(index, participants?.joined || 0);
  const joined = getForumStatus('course', index);
  const rawTopic = course?.category || forum.topic || '';
  return {
    ...forum,
    title: course?.title || forum.title || 'Forum',
    description: course?.description || forum.description || '',
    status: course?.status || forum.status || 'Online',
    topic: normalizeCategory(rawTopic),
    joined,
    participants: {
      joined: liveJoined,
      capacity: participants?.capacity || LIMITS.DEFAULT_MEMBER_LIMIT,
    },
    creator: creator || null,
  };
}
