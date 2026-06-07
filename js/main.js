// mounts navbar/footer, wires router
import { Navbar }  from '../components/navbar/navbar.js';
import { Footer }  from '../components/footer/footer.js';
import { TopBar }  from '../components/top-bar/top-bar.js';
import { BottomBar } from '../components/bottom-bar/bottom-bar.js';
import { router } from './router.js';
import { navigateTo, getHashPath } from './utils/url.js';
import { initTheme } from './theme.js';
import { seedSampleNotifications } from './notifications.js';

async function init() {
  // save the intended route BEFORE any component can clobber it
  const intendedHash = window.location.hash;

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
  window.addEventListener('hashchange', () => router());
  toggleFooter();

  // restore intended hash if something clobbered it during component mount
  if (!intendedHash || intendedHash === '#') {
    history.replaceState(null, '', '#/');
  } else {
    history.replaceState(null, '', intendedHash);
  }

  router();
}

init();