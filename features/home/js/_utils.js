import { getLiveMemberCount } from '../../../js/services/forum-access.js';
import { LIMITS } from '../../../js/core/config.js';

export function mergeCourseData(forum, course, participants, index) {
  const liveJoined = getLiveMemberCount(index, participants?.joined || 0);
  return {
    ...forum,
    title: course?.title || forum.title || 'Forum',
    description: course?.description || forum.description || '',
    status: course?.status || forum.status || 'Online',
    participants: {
      joined: liveJoined,
      capacity: participants?.capacity || LIMITS.DEFAULT_MEMBER_LIMIT,
    },
  };
}
