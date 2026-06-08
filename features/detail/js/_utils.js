import { asset } from '../../../js/utils/url.js';
import { DATA_PATHS, LIMITS } from '../../../js/core/config.js';
import { getForumStatus, getLiveMemberCount } from '../../../js/services/forum-access.js';
import { getUsersForContext } from '../../../js/data/dummy-users.js';

export async function fetchDetailData(index) {
  const res = await fetch(asset(DATA_PATHS.DETAIL));
  const data = await res.json();
  const item = data[index] ?? data[0];

  const participantsCount = Math.min(item.participants?.joined || 0, LIMITS.MAX_ACTIVE_MEMBERS);
  const users = participantsCount > 0 ? await getUsersForContext(index, participantsCount) : [];

  return { item, users };
}

export function computeLiveData(item, index) {
  const statusClass = item.course.status === 'Online' ? 'is-online' : 'is-offline';
  const status = getForumStatus('course', index);
  const isJoined = status === 'joined' || status === 'pending';

  const liveParticipants = getLiveMemberCount(index, item.participants.joined);
  const liveMemberCount = getLiveMemberCount(index, item.forum.memberCount);

  return {
    participantsLive: { ...item.participants, joined: liveParticipants },
    forumLive: { ...item.forum, memberCount: liveMemberCount },
    status,
    isJoined,
    statusClass,
  };
}
