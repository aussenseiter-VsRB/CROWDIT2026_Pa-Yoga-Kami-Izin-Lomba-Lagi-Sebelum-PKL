import { isAuthenticated } from '../../../../js/services/auth.js';
import { joinForum, requestJoin, getForumStatus } from '../../../../js/services/forum-access.js';
import { navigateTo } from '../../../../js/utils/url.js';
import { renderCTA } from './_cards.js';

export function attachCTA(el, data) {
  const btn = el.querySelector('#js-forum-cta');
  if (!btn) return;

  const { forumType, index, privacy, serverName, status } = data;

  btn.addEventListener('click', () => {
    if (!isAuthenticated()) {
      navigateTo('/login');
      return;
    }
    if (status === 'joined') {
      navigateTo(`/forum-interior?${forumType === 'course' ? 'index' : 'group'}=${index}`);
      return;
    }
    if (privacy === 'public') {
      joinForum(forumType, index);
      updateCTA(el, 'joined');
      navigateTo(`/forum-interior?${forumType === 'course' ? 'index' : 'group'}=${index}`);
    } else {
      requestJoin(forumType, index, serverName);
      updateCTA(el, 'pending');
    }
  });
}

export function updateCTA(el, newStatus) {
  const cta = el.querySelector('.forum-landing__cta');
  if (!cta) return;
  if (newStatus === 'joined') {
    cta.innerHTML = renderCTA('joined', 'public');
  } else if (newStatus === 'pending') {
    cta.innerHTML = renderCTA('pending', 'private');
  }
  attachCTA(el, { ...el.__forumData, status: newStatus });
}

export function bindForumUpdates(el, forumType, index) {
  const onUpdate = () => {
    const current = getForumStatus(forumType, index);
    if (current === 'joined' && el.__forumData.status !== 'joined') {
      el.__forumData.status = 'joined';
      updateCTA(el, 'joined');
    }
  };
  window.addEventListener('forum-join-update', onUpdate, { once: false });
  el._cleanup = () => window.removeEventListener('forum-join-update', onUpdate);
}
