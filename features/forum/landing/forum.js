import { injectStyle } from '../../../js/utils/styleLoader.js';
import { navigateTo } from '../../../js/utils/url.js';
import { MOBILE_BREAKPOINT } from '../../../js/core/config.js';
import { getForumStatus } from '../../../js/services/forum-access.js';
import { initForumUsers, getUsers } from '../interior/forum-interior.js';
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
    navigateTo(`/forum-interior?${resolved.forumType === 'course' ? 'index' : 'group'}=${resolved.index}`);
    const el = document.createElement('section');
    el.className = 'container section';
    el.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--muted)"><i class="bi bi-arrow-repeat"></i> Mengalihkan ke forum...</p>';
    return el;
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
