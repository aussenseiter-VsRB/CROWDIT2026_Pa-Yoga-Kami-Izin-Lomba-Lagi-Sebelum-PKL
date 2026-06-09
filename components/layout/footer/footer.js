import { injectStyle } from '../../../js/utils/styleLoader.js';
import { getHashPath } from '../../../js/utils/url.js';
import { CONTACT } from '../../../js/core/config.js';

export async function Footer() {
  injectStyle('/components/layout/footer/footer.css');

  const el = document.createElement('footer');
  el.classList.add('footer');
  el.innerHTML = `
    <div class="container footer__inner">
      <div class="footer__grid">
        <div class="footer__brand-col">
          <span class="footer__brand">StudNow</span>
          <p class="footer__description">Wadah bagi mahasiswa untuk belajar bersama secara cepat, mudah, dan terpercaya melalui forum diskusi.</p>
        </div>

        <div class="footer__links-col">
          <h3 class="footer__heading">Tautan Cepat</h3>
          <ul class="footer__nav-list">
            <li><a data-link href="/" class="footer__nav-link">Beranda</a></li>
            <li><a data-link href="/about" class="footer__nav-link">Tentang</a></li>
            <li><a data-link href="/groups" class="footer__nav-link">Grup</a></li>
            <li><a data-link href="/search" class="footer__nav-link">Cari</a></li>
          </ul>
        </div>

        <div class="footer__contact-col">
          <h3 class="footer__heading">Kontak</h3>
          <p class="footer__contact-item">${CONTACT.EMAIL}</p>
          <p class="footer__contact-item">${CONTACT.PHONE}</p>
          <p class="footer__contact-note">Butuh bantuan? Tim dukungan kami tersedia untuk bimbingan akademis dan bantuan teknis.</p>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">&copy; ${new Date().getFullYear()} StudNow. Hak cipta dilindungi.</p>
        <div class="footer__legal">
          <a data-link href="/contact" class="footer__legal-link">Kontak</a>
          <a href="#" class="footer__legal-link">Privasi</a>
          <a href="#" class="footer__legal-link">Ketentuan</a>
        </div>
      </div>
    </div>
  `;

  const isAuthRoute = () => ['/login', '/signup', '/dm'].includes(getHashPath());

  const syncVisibility = () => {
    el.style.display = isAuthRoute() ? 'none' : '';
  };

  syncVisibility();
  window.addEventListener('route-change', syncVisibility);

  return el;
}
