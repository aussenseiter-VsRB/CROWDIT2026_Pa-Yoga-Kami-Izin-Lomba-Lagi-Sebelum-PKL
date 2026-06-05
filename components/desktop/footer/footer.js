export async function Footer() {
  if (!document.querySelector('link[href="/components/desktop/footer/footer.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/components/desktop/footer/footer.css';
    document.head.appendChild(link);
  }

  const el = document.createElement('footer');
  el.classList.add('footer');
  el.innerHTML = `
    <div class="container footer__inner">
      <span class="footer__brand">StudNow</span>
      <p class="footer__copy">&copy; ${new Date().getFullYear()} Minimal study forum for collaborative learning.</p>
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
