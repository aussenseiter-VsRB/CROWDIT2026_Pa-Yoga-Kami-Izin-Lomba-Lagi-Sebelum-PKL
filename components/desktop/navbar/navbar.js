// persistent, mounts once
// inject styles once
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/components/desktop/navbar/navbar.css';
document.head.appendChild(link);

export function Navbar() {
  const el = document.createElement('header');
  el.classList.add('navbar');

  el.innerHTML = `
    <div class="container">
      <a class="navbar-logo" href="#/" data-link>MyApp<span>.</span></a>
      <nav>
        <ul class="navbar-links">
          <li><a href="#/"        data-link>Home</a></li>
          <li><a href="#/about"   data-link>About</a></li>
          <li><a href="#/contact" data-link>Contact</a></li>
        </ul>
      </nav>
    </div>
  `;

  // highlight active link on navigation
  function setActive() {
    const hash = window.location.hash || '#/';
    el.querySelectorAll('.navbar-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === hash);
    });
  }

  setActive();
  window.addEventListener('hashchange', setActive);

  return el;
}
