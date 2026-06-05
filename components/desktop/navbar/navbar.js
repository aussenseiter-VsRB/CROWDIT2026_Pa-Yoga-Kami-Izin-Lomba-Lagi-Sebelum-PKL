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
        <span class="navbar-logo__mark">S</span>
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
        <a class="navbar-action navbar-action--primary" href="/signup" data-link>Create</a>
      </div>
    </div>
  `;

  function setActive() {
    const path = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
    el.querySelectorAll('.navbar-nav a, .navbar-actions a').forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === path);
    });
  }

  setActive();
  window.addEventListener('popstate', setActive);

  return el;
}
