import { isAuthenticated, getSession } from '../../../js/services/auth.js';
import { getUnreadCount } from '../../../js/services/notifications.js';

import { injectStyle } from '../../../js/utils/styleLoader.js';
injectStyle('/components/layout/top-bar/top-bar.css');

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
        <a class="top-bar__brand" href="/" data-link aria-label="Beranda StudNow">
          <img class="top-bar__logo-img" src="/assets/StudNowLogo.png" alt="StudNow" />
        </a>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <a class="top-bar__icon-btn" href="/search" data-link aria-label="Cari">
            <i class="bi bi-search" style="font-size:1.1rem;color:var(--text)"></i>
          </a>
          <a class="top-bar__icon-btn" id="js-topbar-notif" href="/notifications" data-link aria-label="Notifikasi" style="position:relative">
            <i class="bi bi-bell" style="font-size:1.1rem;color:var(--text)"></i>
            ${unread > 0 ? `<span class="top-bar__notif-dot"></span>` : ''}
          </a>
          <a class="top-bar__create" href="/signup" data-link>
            <span id="js-topbar-label">Masuk</span>
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
      label.textContent = 'Daftar';
      el.querySelector('.top-bar__create:last-child').href = '/signup';
    }
  }

  render();
  syncAuth();

  window.addEventListener('route-change', () => { render(); syncAuth(); });
  window.addEventListener('notifications-update', render);

  return el;
}

