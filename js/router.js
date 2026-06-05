// maps paths → page components
import { Home }    from '/components/pages/home/home.js';
import { About }   from '/components/pages/about/about.js';
import { Contact } from '/components/pages/contact/contact.js';
import { Groups }  from '/components/pages/groups/groups.js';
import { Chat }    from '/components/pages/chat/chat.js';
import { Profile } from '/components/pages/profile/profile.js';
import { Signup }  from '/components/pages/signup/signup.js';
import { Search }  from '/components/pages/search/search.js';
import { Notifications } from '/components/pages/notifications/notifications.js';

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
