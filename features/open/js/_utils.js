import { asset } from '../../../js/utils/url.js';
import { DATA_PATHS, LIMITS } from '../../../js/core/config.js';
import { getForumStatus, getLiveMemberCount } from '../../../js/services/forum-access.js';
import { getUsersForContext } from '../../../js/data/dummy-users.js';

export async function fetchOpenData(index) {
  const res = await fetch(asset(DATA_PATHS.DETAIL));
  const data = await res.json();
  const item = data[index] ?? data[0];

  const participantsCount = Math.min(item.participants?.joined || 0, LIMITS.MAX_ACTIVE_MEMBERS);
  const users = participantsCount > 0 ? await getUsersForContext(index, participantsCount) : [];

  return { item, users };
}

export function computeOpenData(item, index) {
  const statusClass = item.course.status === 'Online' ? 'is-online' : 'is-offline';
  const status = getForumStatus('course', index);
  const isJoined = status === 'joined' || status === 'pending';
  const liveParticipants = getLiveMemberCount(index, item.participants.joined);

  return {
    participantsLive: { ...item.participants, joined: liveParticipants },
    status,
    isJoined,
    statusClass,
  };
}
