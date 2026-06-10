import { asset } from '../../../js/utils/url.js';
import { DATA_PATHS, LIMITS } from '../../../js/core/config.js';
import { getForumStatus, getLiveMemberCount } from '../../../js/services/forum-access.js';
import { getUsersForContext } from '../../../js/data/dummy-users.js';
import { getCustomForums } from '../../../js/services/custom-forums.js';
import { getSession } from '../../../js/services/auth.js';

function buildDetailFromCustomForum(cf) {
  const session = getSession();
  return {
    course: {
      title: cf.title || '',
      description: cf.description || '',
      status: cf.forumStatus || 'Online',
      category: cf.topic || '',
    },
    schedule: {
      day: cf.scheduleDay || '',
      time: cf.scheduleTime || '',
      startDate: cf.startDate || '',
      endDate: cf.endDate || '',
      meetingCount: 'Pertemuan ke-1 dari 1',
    },
    meeting: {
      type: cf.meetingType || 'Online',
      platform: cf.platform || '',
      link: cf.meetingLink || '',
      location: cf.location || '',
    },
    participants: {
      joined: cf.members || 1,
      capacity: cf.maxMembers || 100,
      dummies: [],
    },
    forum: {
      joinLink: '/groups',
      memberCount: cf.members || 1,
      postCount: 0,
    },
    chats: [],
    creator: {
      name: cf.creatorName || session?.name || 'Anonymous',
      username: cf.creatorEmail ? `@${cf.creatorEmail.split('@')[0]}` : session?.email ? `@${session.email.split('@')[0]}` : '@user',
      bio: 'Anggota forum',
    },
  };
}

export async function fetchDetailData(index) {
  const res = await fetch(asset(DATA_PATHS.DETAIL));
  const data = await res.json();

  let item;
  if (index < data.length) {
    item = data[index];
  } else {
    const customIdx = index - data.length;
    const customForums = getCustomForums();
    const cf = customForums[customIdx];
    if (!cf) {
      item = data[0];
    } else {
      item = buildDetailFromCustomForum(cf);
    }
  }

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
