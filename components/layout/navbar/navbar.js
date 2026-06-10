import { isAuthenticated, getSession } from '../../../js/services/auth.js';
import { getUnreadCount } from '../../../js/services/notifications.js';
import { injectStyle } from '../../../js/utils/styleLoader.js';
import { getHashPath } from '../../../js/utils/url.js';
import { STORAGE_KEYS } from '../../../js/core/config.js';

function getBadgeCount() {
  try { return getUnreadCount(); } catch { return 0; }
}

export function Navbar() {
  injectStyle('/components/layout/navbar/navbar.css');

  const el = document.createElement('header');
  el.classList.add('navbar');

  function render() {
    const unread = getBadgeCount();
    el.innerHTML = `
      <div class="container navbar__inner">
        <a class="navbar-logo" href="/" data-link aria-label="Beranda StudNow">
          <img class="navbar-logo__img" src="assets/StudNowLogo.png" alt="StudNow" />
        </a>

        <nav class="navbar-nav" aria-label="Navigasi desktop">
          <a href="/" data-link>Jelajahi</a>
          <a href="/forum" data-link>Forum</a>
          <a href="/groups" data-link>Grup</a>
          ${isAuthenticated() ? '<a href="/chat" data-link>Pesan</a>' : ''}
        </nav>

        <div class="navbar-actions">
          <a class="navbar-action" href="/search" data-link><i class="bi bi-search"></i> Cari</a>
          <a class="navbar-action navbar-action--notif" href="/notifications" data-link aria-label="Notifikasi">
            <i class="bi bi-bell"></i>
            ${unread > 0 ? `<span class="navbar-notif-badge">${unread > 99 ? '99+' : unread}</span>` : ''}
          </a>
          <a class="navbar-action navbar-action--primary navbar-action--auth" href="/login" data-link>Masuk</a>
        </div>
      </div>
    `;
  }

  const isAuthRoute = () => ['/login', '/signup'].includes(getHashPath());

  function syncAuth() {
    const authEl = el.querySelector('.navbar-action--auth');
    if (!authEl) return;

    if (isAuthenticated()) {
      const session = getSession();
      const avatarSrc = localStorage.getItem(STORAGE_KEYS.AVATAR);
      const initial = session.name.charAt(0).toUpperCase();
      authEl.innerHTML = avatarSrc
        ? `<img src="${avatarSrc}" alt="${session.name}" class="navbar-avatar" />`
        : `<span class="navbar-avatar">${initial}</span>`;
      authEl.href = '/profile';
      authEl.classList.remove('navbar-action--primary');
    } else {
      authEl.textContent = 'Masuk';
      authEl.href = '/login';
      authEl.classList.add('navbar-action--primary');
    }
  }

  function setActive() {
    const path = getHashPath();
    const profileSubPages = ['/profile', '/settings', '/edit-profile'];
    el.querySelectorAll('.navbar-nav a, .navbar-actions a').forEach((a) => {
      const href = a.getAttribute('href');
      const isMatch = href === path || (profileSubPages.includes(href) && profileSubPages.includes(path));
      a.classList.toggle('active', isMatch);
    });
    el.style.display = isAuthRoute() ? 'none' : '';
    syncAuth();
  }

  render();
  syncAuth();
  setActive();

  window.addEventListener('route-change', () => { render(); setActive(); });
  window.addEventListener('notifications-update', render);

  return el;
}
