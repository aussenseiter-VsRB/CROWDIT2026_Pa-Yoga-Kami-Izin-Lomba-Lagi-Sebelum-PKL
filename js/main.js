// mounts navbar/footer, wires router
import { Navbar }  from '/components/navbar/navbar.js';
import { Footer }  from '/components/footer/footer.js';
import { router }  from './router.js';

async function init() {
  // mount persistent components once
  document.querySelector('#navbar').appendChild(await Navbar());
  document.querySelector('#footer').appendChild(await Footer());

  // intercept all data-link clicks for SPA navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (!link) return;
    e.preventDefault();
    window.location.hash = link.getAttribute('href');
  });

  // render the initial page
  router();
}

init();