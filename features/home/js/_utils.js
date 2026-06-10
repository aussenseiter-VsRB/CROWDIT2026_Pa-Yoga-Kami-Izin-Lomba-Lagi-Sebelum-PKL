import { getLiveMemberCount, getForumStatus } from '../../../js/services/forum-access.js';
import { LIMITS } from '../../../js/core/config.js';

export function mergeCourseData(forum, course, participants, index, creator) {
  const liveJoined = getLiveMemberCount(index, participants?.joined || 0);
  const joined = getForumStatus('course', index);
  return {
    ...forum,
    title: course?.title || forum.title || 'Forum',
    description: course?.description || forum.description || '',
    status: course?.status || forum.status || 'Online',
    topic: course?.category || forum.topic || '',
    joined,
    participants: {
      joined: liveJoined,
      capacity: participants?.capacity || LIMITS.DEFAULT_MEMBER_LIMIT,
    },
    creator: creator || null,
  };
}
