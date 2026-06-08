import { injectStyle } from '../../../js/utils/styleLoader.js';
import { MOBILE_BREAKPOINT } from '../../../js/core/config.js';
import { getForumStatus } from '../../../js/services/forum-access.js';
import { initForumUsers, getUsers } from '../interior/forum-interior.js';
import { ForumInterior } from '../interior/forum-interior.js';
import { populateStacks } from '../interior/js/_render.js';
import { resolveLandingData } from './js/_utils.js';
import { renderLandingDesktop, renderLandingMobile } from './js/_render.js';
import { attachCTA, bindForumUpdates } from './js/_handlers.js';

injectStyle('/css/_shared.css');
injectStyle('/features/forum/landing/css/forum.css');
injectStyle('/features/forum/landing/css/_forum-landing.css');
injectStyle('/features/forum/css/_members.css');

export async function Forum() {
  const resolved = await resolveLandingData();
  const status = getForumStatus(resolved.forumType, resolved.index);

  if (status === 'joined') {
    const type = resolved.forumType === 'course' ? 'index' : 'group';
    return ForumInterior(new URLSearchParams(`${type}=${resolved.index}`));
  }

  initForumUsers();

  const data = { ...resolved, status };
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const el = isMobile ? renderLandingMobile(data) : renderLandingDesktop(data);
  el.__forumData = data;

  attachCTA(el, data);
  populateStacks(el, getUsers());
  bindForumUpdates(el, resolved.forumType, resolved.index);

  return el;
}
