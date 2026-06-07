import { isAuthenticated, getSession } from '../../js/auth.js';
import { getUnreadCount } from '../../js/notifications.js';

import { injectStyle } from '../../js/utils/styleLoader.js';
injectStyle('/components/top-bar/top-bar.css');

function getBadgeCount() {
  try { return getUnreadCount(); } catch { return 0; }
}

export function TopBar() {
  const el = document.createElement('header');
  el.className = 'top-bar';

  function render() {
    const unread = getBadgeCount();
    el.innerHTML = `
      <div class="top-bar__inner">
        <a class="top-bar__brand" href="/" data-link aria-label="StudNow home">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 5 2.5 12.1 16 19.2l13.5-7.1L16 5z"></path>
            <path d="M8.2 15.2v5.1c0 2 3.5 4.2 7.8 4.2s7.8-2.2 7.8-4.2v-5.1L16 19.2l-7.8-4z"></path>
          </svg>
          <span>StudNow</span>
        </a>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <a class="top-bar__icon-btn" href="/search" data-link aria-label="Search">
            <i class="bi bi-search" style="font-size:1.1rem;color:var(--text)"></i>
          </a>
          <a class="top-bar__icon-btn" id="js-topbar-notif" href="/notifications" data-link aria-label="Notifications" style="position:relative">
            <i class="bi bi-bell" style="font-size:1.1rem;color:var(--text)"></i>
            ${unread > 0 ? `<span class="top-bar__notif-dot"></span>` : ''}
          </a>
          <a class="top-bar__create" href="/signup" data-link>
            <span id="js-topbar-label">Create</span>
          </a>
        </div>
      </div>
    `;
  }

  function syncAuth() {
    const label = el.querySelector('#js-topbar-label');
    if (!label) return;

    if (isAuthenticated()) {
      const session = getSession();
      label.textContent = session.name;
      el.querySelector('.top-bar__create:last-child').href = '/profile';
    } else {
      label.textContent = 'Create';
      el.querySelector('.top-bar__create:last-child').href = '/signup';
    }
  }

  render();
  syncAuth();

  window.addEventListener('route-change', () => { render(); syncAuth(); });
  window.addEventListener('notifications-update', render);

  return el;
}
