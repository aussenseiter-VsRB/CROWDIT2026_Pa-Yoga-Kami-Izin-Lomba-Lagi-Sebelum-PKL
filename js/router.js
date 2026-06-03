// maps paths → page components
import { Home }    from '/components/pages/home/home.js';
import { About }   from '/components/pages/about/about.js';
import { Contact } from '/components/pages/contact/contact.js';
import { Groups }  from '/components/pages/groups/groups.js';
import { Chat }    from '/components/pages/chat/chat.js';
import { Profile } from '/components/pages/profile/profile.js';

const routes = {
  '/':         Home,
  '/about':    About,
  '/contact':  Contact,
  '/groups':   Groups,
  '/chat':     Chat,
  '/profile':  Profile,
};

export async function router() {
  const path = window.location.hash.slice(1) || '/';
  const Page = routes[path] ?? routes['/'];

  const main = document.querySelector('#main');

  // trigger re-animation on page swap
  main.style.animation = 'none';
  main.offsetHeight; // reflow
  main.style.animation = '';

  main.innerHTML = '';
  main.appendChild(await Page());
}

window.addEventListener('hashchange', router);
