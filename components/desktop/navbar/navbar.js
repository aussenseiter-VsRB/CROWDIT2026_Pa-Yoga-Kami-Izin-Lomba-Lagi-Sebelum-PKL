export function Navbar() {
  if (!document.querySelector('link[href="/components/desktop/navbar/navbar.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/components/desktop/navbar/navbar.css';
    document.head.appendChild(link);
  }

  const el = document.createElement('header');
  el.classList.add('navbar');

  el.innerHTML = `
    <div class="container navbar__inner">
      <a class="navbar-logo" href="/" data-link aria-label="StudNow home">
        <span class="navbar-logo__mark">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="18" height="18">
            <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/>
            <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/>
          </svg>
        </span>
        <span class="navbar-logo__text">StudNow</span>
      </a>

      <nav class="navbar-nav" aria-label="Desktop navigation">
        <a href="/" data-link>Explore</a>
        <a href="/groups" data-link>Groups</a>
        <a href="/chat" data-link>Chat</a>
        <a href="/profile" data-link>Profile</a>
      </nav>

      <div class="navbar-actions">
        <a class="navbar-action" href="/search" data-link>Search</a>
        <a class="navbar-action navbar-action--primary" href="/login" data-link>Login</a>
      </div>
    </div>
  `;

  const isAuthRoute = () => ['/login', '/signup'].includes(window.location.pathname.replace(/\/$/, '') || '/');

  function setActive() {
    const path = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
    el.querySelectorAll('.navbar-nav a, .navbar-actions a').forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === path);
    });
    el.style.display = isAuthRoute() ? 'none' : '';
  }

  setActive();
  window.addEventListener('route-change', setActive);

  return el;
}
