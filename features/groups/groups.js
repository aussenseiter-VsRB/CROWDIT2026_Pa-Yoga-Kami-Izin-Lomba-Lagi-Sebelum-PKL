import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../js/core/config.js';
import { mergeWithBaseGroups } from '../../js/services/custom-groups.js';
import { getForumStatus } from '../../js/services/forum-access.js';
import { getStatus } from '../groups/js/_utils.js';
import { renderDesktop, renderMobile } from './js/_render.js';
import { initGroupsHandlers } from './js/_handlers.js';

injectStyle('/css/_shared.css');
injectStyle('/css/_shared-profile.css');
injectStyle('/features/groups/css/groups.css');
injectStyle('/features/groups/css/_groups-card.css');
injectStyle('/features/groups/css/_groups-hero.css');
injectStyle('/features/forum/explore/css/explore.css');

export async function Groups() {
  const data = await fetchData(DATA_PATHS.GROUPS);
  const mergedGroups = mergeWithBaseGroups(data.groups);
  const mappedGroups = mergedGroups.map((g, i) => ({
    _type: 'group',
    _realIndex: i,
    title: g.title,
    description: g.description,
    department: g.department,
    topic: g.department,
    status: getStatus(g.members),
    joined: getForumStatus('group', i) === 'joined',
    id: g.id,
    creator: null,
    participants: {
      joined: g.members,
      capacity: g.maxMembers,
    },
  }));

  const pageData = {
    ...data,
    groups: mappedGroups,
  };

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const el = isMobile ? renderMobile(pageData) : renderDesktop(pageData);
  initGroupsHandlers(el, data);
  return el;
}
