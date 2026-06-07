// maps paths → page components (viewport adaptation handled inside each page)
import { getHashPath } from './utils/url.js';
import { Home } from '../features/home/home.js';
import { About } from '../features/about/about.js';
import { Contact } from '../features/contact/contact.js';
import { Groups } from '../features/groups/groups.js';
import { Chat } from '../features/chat/chat.js';
import { Profile } from '../features/profile/profile.js';
import { Login } from '../features/auth/login/login.js';
import { Signup } from '../features/auth/signup/signup.js';
import { Search } from '../features/search/search.js';
import { Notifications } from '../features/notifications/notifications.js';
import { Detail } from '../features/detail/detail.js';
import { Open } from '../features/open/open.js';
import { Forum } from '../features/forum/forum.js';
import { ForumInterior } from '../features/forum-interior/forum-interior.js';
import { DM } from '../features/dm/dm.js';
import { EditProfile } from '../features/edit-profile/edit-profile.js';
import { Settings } from '../features/settings/settings.js';
import { Help } from '../features/help/help.js';

const routes = {
  '/':              Home,
  '/about':         About,
  '/contact':       Contact,
  '/groups':        Groups,
  '/chat':          Chat,
  '/profile':       Profile,
  '/login':         Login,
  '/signup':        Signup,
  '/search':        Search,
  '/notifications': Notifications,
  '/detail':        Detail,
  '/open':          Open,
  '/forum':         Forum,
  '/forum-interior': ForumInterior,
  '/dm':            DM,
  '/edit-profile':  EditProfile,
  '/settings':      Settings,
  '/help':          Help,
};

let previousPath = getHashPath();

export async function router() {
  const path = getHashPath();
  const Page = routes[path] ?? routes['/'];

  const authRoutes = new Set(['/login', '/signup']);
  const isAuthTransition = authRoutes.has(previousPath) && authRoutes.has(path);
  const direction = previousPath === '/login' && path === '/signup'
    ? 'to-signup'
    : previousPath === '/signup' && path === '/login'
    ? 'to-login'
    : '';

  // wait for #main to exist instead of silently bailing
  let main = document.querySelector('#main');
  if (!main) {
    await new Promise(resolve => {
      const observer = new MutationObserver(() => {
        main = document.querySelector('#main');
        if (main) { observer.disconnect(); resolve(); }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  window.__routeTransition = { from: previousPath, to: path, isAuthTransition, direction };
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