// mounts navbar/footer, wires router
import { Navbar } from '../components/navbar/navbar.js';
import { Footer } from '../components/footer/footer.js';
import { TopBar } from '../components/top-bar/top-bar.js';
import { BottomBar } from '../components/bottom-bar/bottom-bar.js';
import { router } from './router.js';
import { navigateTo, getHashPath } from './utils/url.js';
import { initTheme } from './theme.js';
import { seedSampleNotifications } from './notifications.js';

async function init() {
  const intendedHash = window.location.hash;

  seedSampleNotifications();
  initTheme();

  // 1. Mount layout components
  document.querySelector('#navbar').appendChild(await Navbar());
  document.querySelector('#top-bar').appendChild(await TopBar());
  document.querySelector('#bottom-bar').appendChild(await BottomBar());
  document.querySelector('#footer').appendChild(await Footer());

  // 2. Global event delegation for links
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

  // 3. Listeners for subsequent navigation
  window.addEventListener('route-change', toggleFooter);
  window.addEventListener('hashchange', router); // Direct reference, no extra anonymous wrapper needed
  
  toggleFooter();

  // 4. Normalize the URL without triggering side effects before initial render
  if (!intendedHash || intendedHash === '#') {
    history.replaceState(null, '', '#/');
  } else {
    history.replaceState(null, '', intendedHash);
  }

  // 5. Single, definitive initial render
  router();
}

init();