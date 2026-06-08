export { timeAgo } from '../../interior/js/_utils.js';

import { getHashParams, asset } from '../../../../js/utils/url.js';
import { DATA_PATHS, LIMITS } from '../../../../js/core/config.js';

export async function resolveLandingData() {
  const params = getHashParams();
  const courseIdx = parseInt(params.get('index'), 10);
  const groupIdx = parseInt(params.get('group'), 10);

  const [forumRes, detailRes, groupsRes] = await Promise.all([
    fetch(asset(DATA_PATHS.FORUM)).then(r => r.json()),
    fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
    fetch(asset(DATA_PATHS.GROUPS)).then(r => r.json()),
  ]);

  let forumData, serverName, forumType, index = 0, description = '';
  if (!isNaN(courseIdx) && forumRes.courses[courseIdx]) {
    forumData = forumRes.courses[courseIdx];
    serverName = detailRes[courseIdx]?.course?.title || 'Forum';
    description = detailRes[courseIdx]?.course?.description || '';
    forumType = 'course';
    index = courseIdx;
  } else if (!isNaN(groupIdx) && forumRes.groups[groupIdx]) {
    forumData = forumRes.groups[groupIdx];
    serverName = groupsRes.groups[groupIdx]?.title || 'Grup';
    description = groupsRes.groups[groupIdx]?.description || '';
    forumType = 'group';
    index = groupIdx;
  } else {
    forumData = forumRes.courses[0];
    serverName = 'Forum';
    description = '';
    forumType = 'course';
    index = 0;
  }

  const gIdx = forumType === 'group' ? index : null;
  return {
    serverName, forumType, index, description,
    channels: forumData.channels,
    members: forumData.members,
    memberCount: forumType === 'group'
      ? (groupsRes.groups[gIdx]?.members || forumData.members.length)
      : (forumData.memberCount || forumData.members.length),
    memberLimit: forumType === 'group'
      ? (groupsRes.groups[gIdx]?.maxMembers || LIMITS.DEFAULT_MEMBER_LIMIT)
      : (forumData.memberLimit || LIMITS.DEFAULT_MEMBER_LIMIT),
    privacy: forumData.privacy || 'public',
    forumIndex: forumType === 'course' ? index : (forumRes.courses.length + index),
    backLink: forumType === 'group' ? '/groups' : '/',
  };
}
