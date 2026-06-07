// mounts navbar/footer, wires router
import { Navbar }  from '/components/navbar/navbar.js';
import { Footer }  from '/components/footer/footer.js';
import { TopBar }  from '/components/top-bar/top-bar.js';
import { BottomBar } from '/components/bottom-bar/bottom-bar.js';
import { router } from './router.js';
import { navigateTo, getHashPath } from '/js/utils/url.js';
import { initTheme } from './theme.js';
import { seedSampleNotifications } from './notifications.js';

async function init() {
  seedSampleNotifications();

  initTheme();
  document.querySelector('#navbar').appendChild(await Navbar());
  document.querySelector('#top-bar').appendChild(await TopBar());
  document.querySelector('#bottom-bar').appendChild(await BottomBar());
  document.querySelector('#footer').appendChild(await Footer());

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (!link) return;
    e.preventDefault();
    navigateTo(link.getAttribute('href'));
  });

  function toggleFooter() {
    const path = getHashPath();
    const hide = ['/login', '/signup'].includes(path);
    document.querySelector('#footer').classList.toggle('is-hidden', hide);
  }

  window.addEventListener('route-change', toggleFooter);
  toggleFooter();

  if (!window.location.hash) {
    navigateTo('/');
  }
  router();
}

window.addEventListener('hashchange', () => router());

init();
