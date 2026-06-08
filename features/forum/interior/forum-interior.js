import { injectStyle } from '../../../js/utils/styleLoader.js';
import { getHashParams, navigateTo } from '../../../js/utils/url.js';
import { getForumStatus } from '../../../js/services/forum-access.js';
import { getUsersForContext } from '../../../js/data/dummy-users.js';
import { LIMITS, MOBILE_BREAKPOINT } from '../../../js/core/config.js';
import { initForumUsers, getUsers, resolveForumData } from './js/_utils.js';
import { renderDesktop, renderMobile } from './js/_render.js';

injectStyle('/css/_shared.css');
injectStyle('/features/forum/landing/css/forum.css');
injectStyle('/features/forum/landing/css/_forum-sidebar.css');
injectStyle('/features/forum/landing/css/_forum-messages.css');
injectStyle('/features/forum/landing/css/_forum-members.css');
injectStyle('/features/forum/css/_members.css');
injectStyle('/features/forum/interior/css/forum-interior.css');

export { initForumUsers, getUsers };

function errEl(msg) {
  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = msg;
  return el;
}

export async function ForumInterior(externalParams) {
  const params = externalParams || getHashParams();
  const courseIdx = parseInt(params.get('index'), 10);
  const groupIdx = parseInt(params.get('group'), 10);
  if (isNaN(courseIdx) && isNaN(groupIdx)) {
    return errEl('<p style="color:var(--muted);text-align:center;padding:3rem 1rem">Forum tidak ditemukan.</p>');
  }

  const isCourse = !isNaN(courseIdx);
  const type = isCourse ? 'course' : 'group';
  const idx = isCourse ? courseIdx : groupIdx;

  if (getForumStatus(type, idx) !== 'joined') {
    navigateTo(`/forum?${isCourse ? 'index' : 'group'}=${idx}`);
    return errEl('<p style="text-align:center;padding:2rem;color:var(--muted)"><i class="bi bi-arrow-repeat"></i> Mengalihkan...</p>');
  }

  const resolved = await resolveForumData(isCourse, idx);
  if (!resolved) {
    navigateTo('/');
    return errEl('');
  }

  const { channels, memberCount, memberLimit, forumIndex, backLink, forumId, forumType, serverName, members } = resolved;
  const activeUsers = await getUsersForContext(forumIndex, LIMITS.MAX_ACTIVE_MEMBERS);
  const activeChannel = channels[0];

  const footer = document.querySelector('#footer');
  if (footer) footer.style.display = 'none';
  const main = document.querySelector('#main');
  if (main) main.style.paddingBottom = '0';

  const opts = { serverName, channels, members, memberCount, memberLimit, forumIndex, backLink, forumId, forumType, activeChannel, activeUsers };
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  if (isMobile) {
    const el = document.createElement('section');
    el.className = 'mobile-page';
    renderMobile(el, opts);
    return el;
  }

  const el = document.createElement('section');
  el.style.cssText = 'display:flex;flex-direction:column;height:calc(100vh - 4.75rem);overflow:hidden;padding:0 1.5rem;margin:0.75rem 0 0';
  renderDesktop(el, opts);
  return el;
}
