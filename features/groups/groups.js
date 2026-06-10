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
injectStyle('/features/home/css/home.css');
injectStyle('/features/home/css/_home-mobile.css');
injectStyle('/features/groups/css/groups.css');
injectStyle('/features/groups/css/_groups-card.css');
injectStyle('/features/groups/css/_groups-hero.css');
injectStyle('/features/forum/explore/css/explore.css');
injectStyle('/components/ui/fab/fab.css');

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

  const topGroup = mappedGroups.reduce((best, g) =>
    (g.participants?.joined || 0) > ((best && best.participants?.joined) || 0) ? g : best, null);

  const totalMembers = mappedGroups.reduce((s, g) => s + (g.participants?.joined || 0), 0);

  const pageData = {
    ...data,
    groups: mappedGroups,
    stats: {
      totalGroups: mappedGroups.length,
      totalMembers,
      topGroup: topGroup ? { title: topGroup.title, count: topGroup.participants?.joined || 0 } : null,
    },
  };

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const el = isMobile ? renderMobile(pageData) : renderDesktop(pageData);
  initGroupsHandlers(el, data);
  return el;
}
