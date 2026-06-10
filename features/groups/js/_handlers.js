import { isAuthenticated } from '../../../js/services/auth.js';
import { navigateTo } from '../../../js/utils/url.js';
import { mergeWithBaseGroups } from '../../../js/services/custom-groups.js';

function getCategoriesFromGroups(groups = []) {
  return [...new Set(groups.map((group) => group.department).filter(Boolean))].sort();
}
import { MOBILE_BREAKPOINT } from '../../../js/core/config.js';
import { showCreateGroupModal } from '../create-group/create-group.js';
import { GroupCard, mGroupCard } from './_cards.js';

function refreshGroups(root, baseGroups) {
  const merged = mergeWithBaseGroups(baseGroups);
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  const grid = root.querySelector('.grp-grid');
  const list = root.querySelector('.mobile-list');

  if (grid) {
    grid.innerHTML = merged.map((group, index) => GroupCard(group, index)).join('');
  }
  if (list) {
    list.innerHTML = merged.map((group, index) => mGroupCard(group, index)).join('');
  }

  if (!isMobile && merged.length) {
    const anchor = root.querySelector('#groups');
    anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function initGroupsHandlers(root, baseData) {
  root.querySelectorAll('[data-create-group]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isAuthenticated()) {
        navigateTo('/signup');
        return;
      }
      showCreateGroupModal({
        categories: getCategoriesFromGroups(mergeWithBaseGroups(baseData.groups)),
        onCreated: () => refreshGroups(root, baseData.groups),
      });
    });
  });
}
