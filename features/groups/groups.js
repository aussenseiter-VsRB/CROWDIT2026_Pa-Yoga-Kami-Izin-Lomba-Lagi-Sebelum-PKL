import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../js/core/config.js';
import { mergeWithBaseGroups } from '../../js/services/custom-groups.js';
import { renderDesktop, renderMobile } from './js/_render.js';
import { initGroupsHandlers } from './js/_handlers.js';

injectStyle('/css/_shared.css');
injectStyle('/css/_shared-profile.css');
injectStyle('/features/groups/css/groups.css');
injectStyle('/features/groups/css/_groups-card.css');
injectStyle('/features/groups/css/_groups-hero.css');

export async function Groups() {
  const data = await fetchData(DATA_PATHS.GROUPS);
  const pageData = {
    ...data,
    groups: mergeWithBaseGroups(data.groups),
  };

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const el = isMobile ? renderMobile(pageData) : renderDesktop(pageData);
  initGroupsHandlers(el, data);
  return el;
}
