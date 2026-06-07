// mounts navbar/footer, wires router
import { Navbar }  from '/components/desktop/navbar/navbar.js';
import { Footer }  from '/components/desktop/footer/footer.js';
import { TopBar }  from '/components/mobile/top-bar/top-bar.js';
import { BottomBar } from '/components/mobile/bottom-bar/bottom-bar.js';
import { router, navigateTo } from './router.js';
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
    const hide = ['/login', '/signup'].includes(window.location.pathname.replace(/\/$/, '') || '/');
    document.querySelector('#footer').classList.toggle('is-hidden', hide);
  }

  window.addEventListener('route-change', toggleFooter);
  toggleFooter();

  router();
}

init();
