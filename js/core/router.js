// maps paths → page components (viewport adaptation handled inside each page)
import { getHashPath, getHashParams, navigateTo } from '../utils/url.js';
import { isAuthenticated } from '../services/auth.js';
import { Home } from '../../features/home/home.js';
import { Forums } from '../../features/forums/forums.js';
import { About } from '../../features/about/about.js';
import { Contact } from '../../features/contact/contact.js';
import { Groups } from '../../features/groups/groups.js';
import { Chat } from '../../features/chat/chat/chat.js';
import { Profile } from '../../features/profile/profile/profile.js';
import { Login } from '../../features/auth/login/login.js';
import { Signup } from '../../features/auth/signup/signup.js';
import { Search } from '../../features/search/search.js';
import { Notifications } from '../../features/notifications/notifications.js';
import { Detail } from '../../features/detail/detail.js';
import { Forum } from '../../features/forum/landing/forum.js';
import { ForumInterior } from '../../features/forum/interior/forum-interior.js';
import { DM } from '../../features/chat/dm/dm.js';
import { EditProfile } from '../../features/profile/edit-profile/edit-profile.js';
import { Settings } from '../../features/profile/settings/settings.js';
import { Help } from '../../features/help/help.js';

const protectedRoutes = new Set([
  '/chat',
  '/dm',
  '/profile',
  '/edit-profile',
  '/notifications',
  '/groups-interior',
]);

const routes = {
  '/':              Home,
  '/forums':        Forums,
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
  '/groups-interior': ForumInterior,
  '/dm':            DM,
  '/edit-profile':  EditProfile,
  '/settings':      Settings,
  '/help':          Help,
};

function resolvePage(path) {
  const params = getHashParams();
  if (path === '/groups' && (params.has('group') || params.has('index'))) {
    return Forum;
  }
  return routes[path] ?? routes['/'];
}

function redirectLegacyForumPaths(path) {
  if (path !== '/forum' && path !== '/forum-interior') return false;

  const params = getHashParams();
  const target = path === '/forum' ? '/groups' : '/groups-interior';
  const qs = params.toString();
  navigateTo(`${target}${qs ? `?${qs}` : ''}`);
  return true;
}

let previousPath = getHashPath();
let isRouting = false; // Guard variable to prevent concurrent renders

export async function router() {
  // If the router is already actively processing a page change, ignore duplicate calls
  if (isRouting) return;
  isRouting = true;

  try {
    const path = getHashPath();
    if (redirectLegacyForumPaths(path)) return;

    const Page = resolvePage(path);

    const authRoutes = new Set(['/login', '/signup']);
    const isAuthTransition = authRoutes.has(previousPath) && authRoutes.has(path);
    const direction = previousPath === '/login' && path === '/signup'
      ? 'to-signup'
      : previousPath === '/signup' && path === '/login'
      ? 'to-login'
      : '';

    // Wait for #main to exist safely
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
    
    // Auth guard — protected routes redirect to login
    if (protectedRoutes.has(path) && !isAuthenticated()) {
      main.innerHTML = '';
      const el = document.createElement('section');
      el.className = 'container section';
      el.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--muted)"><i class="bi bi-arrow-repeat"></i> Mengalihkan...</p>`;
      main.appendChild(el);
      previousPath = path;
      window.location.hash = '#/login';
      return;
    }

    // Reset and trigger CSS animations cleanly
    main.style.animation = 'none';
    main.offsetHeight; // Force layout reflow
    main.style.animation = '';
    
    // Render page content
    main.innerHTML = '';
    main.appendChild(await Page());
    
    previousPath = path;
    window.dispatchEvent(new CustomEvent('route-change'));
  } finally {
    isRouting = false; // Release guard when completely finished
  }
}
