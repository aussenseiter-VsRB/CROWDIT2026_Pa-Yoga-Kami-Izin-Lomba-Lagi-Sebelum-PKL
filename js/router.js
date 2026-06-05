// maps paths → page components
import { Home } from '/pages/pages-desktop/home/home.js';
import { About } from '/pages/pages-desktop/about/about.js';
import { Contact } from '/pages/pages-desktop/contact/contact.js';
import { Groups } from '/pages/pages-desktop/groups/groups.js';
import { Chat } from '/pages/pages-desktop/chat/chat.js';
import { Profile } from '/pages/pages-desktop/profile/profile.js';
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
  '/signup':   Signup,
  '/search':   Search,
  '/notifications': Notifications,
};

export async function router() {
  const path = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
  const Page = routes[path] ?? routes['/'];

  const main = document.querySelector('#main');

  main.style.animation = 'none';
  main.offsetHeight;
  main.style.animation = '';

  main.innerHTML = '';
  main.appendChild(await Page());
}

export function navigateTo(path) {
  history.pushState(null, null, path);
  router();
}

window.addEventListener('popstate', router);
