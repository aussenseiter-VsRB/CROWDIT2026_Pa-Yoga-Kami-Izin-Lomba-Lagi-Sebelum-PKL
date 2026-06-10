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
          <span class="navbar-logo__mark">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="18" height="18">
              <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/>
              <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/>
            </svg>
          </span>
          <span class="navbar-logo__text">StudNow</span>
        </a>

        <nav class="navbar-nav" aria-label="Navigasi desktop">
          <a href="/" data-link>Jelajahi</a>
          <a href="/groups" data-link>Grup</a>
          ${isAuthenticated() ? '<a href="/chat" data-link>Pesan</a><a href="/profile" data-link>Profil</a>' : ''}
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
        ? `<img src="${avatarSrc}" alt="" style="width:1.6rem;height:1.6rem;border-radius:50%;object-fit:cover;flex-shrink:0"> ${session.name}`
        : `<span style="display:inline-flex;align-items:center;justify-content:center;width:1.6rem;height:1.6rem;border-radius:50%;background:var(--accent);color:#fff;font-size:0.7rem;font-weight:700;flex-shrink:0">${initial}</span> ${session.name}`;
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
    const profileSubPages = ['/settings', '/edit-profile'];
    el.querySelectorAll('.navbar-nav a, .navbar-actions a').forEach((a) => {
      const href = a.getAttribute('href');
      const isMatch = href === path || (href === '/profile' && profileSubPages.includes(path));
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
