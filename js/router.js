// maps paths → page components (desktop / mobile based on viewport)
import { Home as DesktopHome } from '/pages/pages-desktop/home/home.js';
import { About as DesktopAbout } from '/pages/pages-desktop/about/about.js';
import { Contact as DesktopContact } from '/pages/pages-desktop/contact/contact.js';
import { Groups as DesktopGroups } from '/pages/pages-desktop/groups/groups.js';
import { Chat as DesktopChat } from '/pages/pages-desktop/chat/chat.js';
import { Profile as DesktopProfile } from '/pages/pages-desktop/profile/profile.js';
import { Login as DesktopLogin } from '/pages/pages-desktop/login/login.js';
import { Signup as DesktopSignup } from '/pages/pages-desktop/signup/signup.js';
import { Search as DesktopSearch } from '/pages/pages-desktop/search/search.js';
import { Notifications as DesktopNotifications } from '/pages/pages-desktop/notifications/notifications.js';
import { Detail as DesktopDetail } from '/pages/pages-desktop/home/detail/detail.js';
import { Open as DesktopOpen } from '/pages/pages-desktop/home/detail/open.js';

import { Home as MobileHome } from '/pages/pages-mobile/home/home.js';
import { About as MobileAbout } from '/pages/pages-mobile/about/about.js';
import { Contact as MobileContact } from '/pages/pages-mobile/contact/contact.js';
import { Groups as MobileGroups } from '/pages/pages-mobile/groups/groups.js';
import { Chat as MobileChat } from '/pages/pages-mobile/chat/chat.js';
import { Profile as MobileProfile } from '/pages/pages-mobile/profile/profile.js';
import { Signup as MobileSignup } from '/pages/pages-mobile/signup/signup.js';
import { Login as MobileLogin } from '/pages/pages-mobile/login/login.js';
import { Search as MobileSearch } from '/pages/pages-mobile/search/search.js';
import { Notifications as MobileNotifications } from '/pages/pages-mobile/notifications/notifications.js';

const desktopRoutes = {
  '/':         DesktopHome,
  '/about':    DesktopAbout,
  '/contact':  DesktopContact,
  '/groups':   DesktopGroups,
  '/chat':     DesktopChat,
  '/profile':  DesktopProfile,
  '/login':    DesktopLogin,
  '/signup':   DesktopSignup,
  '/search':   DesktopSearch,
  '/notifications': DesktopNotifications,
  '/detail':   DesktopDetail,
  '/open':     DesktopOpen,
};

const mobileRoutes = {
  '/':         MobileHome,
  '/about':    MobileAbout,
  '/contact':  MobileContact,
  '/groups':   MobileGroups,
  '/chat':     MobileChat,
  '/profile':  MobileProfile,
  '/login':    MobileLogin,
  '/signup':   MobileSignup,
  '/search':   MobileSearch,
  '/notifications': MobileNotifications,
};

function getRoutes() {
  // mobile overrides desktop; desktop fills missing mobile routes (e.g. /login)
  return window.innerWidth <= 900
    ? { ...desktopRoutes, ...mobileRoutes }
    : desktopRoutes;
}

let previousPath = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
let lastViewport = window.innerWidth <= 900 ? 'mobile' : 'desktop';

export async function router() {
  const path = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
  const routes = getRoutes();
  const Page = routes[path] ?? routes['/'];
  const authRoutes = new Set(['/login', '/signup']);
  const isAuthTransition = authRoutes.has(previousPath) && authRoutes.has(path);
  const direction = previousPath === '/login' && path === '/signup'
    ? 'to-signup'
    : previousPath === '/signup' && path === '/login'
      ? 'to-login'
      : '';

  const main = document.querySelector('#main');
  window.__routeTransition = {
    from: previousPath,
    to: path,
    isAuthTransition,
    direction,
  };

  main.classList.toggle('is-auth-transition', isAuthTransition);
  main.dataset.routeFrom = previousPath;
  main.dataset.routeTo = path;
  main.dataset.routeDirection = direction;

  main.style.animation = 'none';
  main.offsetHeight;
  main.style.animation = '';

  main.innerHTML = '';
  main.appendChild(await Page());

  previousPath = path;
  window.dispatchEvent(new CustomEvent('route-change'));
}

export function navigateTo(path) {
  history.pushState(null, null, path);
  router();
}

window.addEventListener('popstate', router);

window.addEventListener('resize', () => {
  const currentViewport = window.innerWidth <= 900 ? 'mobile' : 'desktop';
  if (currentViewport !== lastViewport) {
    lastViewport = currentViewport;
    router();
  }
});
