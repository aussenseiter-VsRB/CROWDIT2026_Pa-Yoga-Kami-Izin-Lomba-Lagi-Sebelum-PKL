if (!document.querySelector('link[href="/components/mobile/top-bar/top-bar.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/components/mobile/top-bar/top-bar.css';
  document.head.appendChild(link);
}

export function TopBar() {
  const el = document.createElement('header');
  el.className = 'top-bar';

  el.innerHTML = `
    <div class="top-bar__inner">
      <a class="top-bar__brand" href="/" data-link aria-label="StudNow home">
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 5 2.5 12.1 16 19.2l13.5-7.1L16 5z"></path>
          <path d="M8.2 15.2v5.1c0 2 3.5 4.2 7.8 4.2s7.8-2.2 7.8-4.2v-5.1L16 19.2l-7.8-4z"></path>
        </svg>
        <span>StudNow</span>
      </a>
      <a class="top-bar__create" href="/signup" data-link>Create</a>
    </div>
  `;

  return el;
}
