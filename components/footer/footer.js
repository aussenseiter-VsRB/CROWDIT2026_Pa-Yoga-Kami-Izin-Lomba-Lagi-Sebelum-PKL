import { injectStyle } from '/js/utils/styleLoader.js';

export async function Footer() {
  injectStyle('/components/footer/footer.css');

  const el = document.createElement('footer');
  el.classList.add('footer');
  el.innerHTML = `
    <div class="container footer__inner">
      <div class="footer__grid">
        <div class="footer__brand-col">
          <span class="footer__brand">StudNow</span>
          <p class="footer__description">Empowering students to learn together with fast, easy collaboration and trusted discussion forums.</p>
        </div>

        <div class="footer__links-col">
          <h3 class="footer__heading">Quick links</h3>
          <ul class="footer__nav-list">
            <li><a data-link href="/" class="footer__nav-link">Home</a></li>
            <li><a data-link href="/about" class="footer__nav-link">About</a></li>
            <li><a data-link href="/groups" class="footer__nav-link">Groups</a></li>
            <li><a data-link href="/search" class="footer__nav-link">Search</a></li>
          </ul>
        </div>

        <div class="footer__contact-col">
          <h3 class="footer__heading">Contact</h3>
          <p class="footer__contact-item">support@studnow.com</p>
          <p class="footer__contact-item">+62 812-3456-7890</p>
          <p class="footer__contact-note">Need help? Our support team is available for academic guidance and technical assistance.</p>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">&copy; ${new Date().getFullYear()} StudNow. All rights reserved.</p>
        <div class="footer__legal">
          <a data-link href="/contact" class="footer__legal-link">Contact</a>
          <a href="#" class="footer__legal-link">Privacy</a>
          <a href="#" class="footer__legal-link">Terms</a>
        </div>
      </div>
    </div>
  `;

  const isAuthRoute = () => ['/login', '/signup'].includes(window.location.pathname.replace(/\/$/, '') || '/');

  const syncVisibility = () => {
    el.style.display = isAuthRoute() ? 'none' : '';
  };

  syncVisibility();
  window.addEventListener('routechange', syncVisibility);
  window.addEventListener('popstate', syncVisibility);

  return el;
}
