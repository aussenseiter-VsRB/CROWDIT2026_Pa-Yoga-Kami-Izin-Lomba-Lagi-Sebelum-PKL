// maps paths → page components
import { Home } from '/pages/pages-desktop/home/home.js';
import { About } from '/pages/pages-desktop/about/about.js';
import { Contact } from '/pages/pages-desktop/contact/contact.js';
import { Groups } from '/pages/pages-desktop/groups/groups.js';
import { Chat } from '/pages/pages-desktop/chat/chat.js';
import { Profile } from '/pages/pages-desktop/profile/profile.js';
import { Login } from '/pages/pages-desktop/login/login.js';
import { Signup } from '/pages/pages-desktop/signup/signup.js';
import { Search } from '/pages/pages-desktop/search/search.js';
import { Notifications } from '/pages/pages-desktop/notifications/notifications.js';

const routes = {
  '/':         Home,
  '/about':    About,
  '/contact':  Contact,
  '/groups':   Groups,
  '/chat':     Chat,
  '/profile':  Profile,
  '/login':    Login,
  '/signup':   Signup,
  '/search':   Search,
  '/notifications': Notifications,
};

let previousPath = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');

export async function router() {
  const path = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
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

  window.dispatchEvent(new Event('routechange'));
  previousPath = path;
}

export function navigateTo(path) {
  history.pushState(null, null, path);
  router();
}

window.addEventListener('popstate', router);
