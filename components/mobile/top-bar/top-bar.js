const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/components/mobile/top-bar/top-bar.css';
document.head.appendChild(link);

export function TopBar() {
  const el = document.createElement('header');
  el.className = 'top-bar';

  el.innerHTML = `
    <div class="top-bar__shell">
      <div class="top-bar__brand">
        <a class="top-bar__create" href="#/signup" data-link aria-label="Buat akun baru">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
          <span>Create Akun</span>
        </a>
        <div class="top-bar__title" aria-label="StudNow">
          <strong>StudNow</strong>
          <span>Forum belajar</span>
        </div>
      </div>
      <div class="top-bar__actions" aria-label="Aksi cepat">
        <a class="top-bar__icon" href="#/search" data-link aria-label="Cari">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="M20 20l-3.5-3.5"></path>
          </svg>
        </a>
        <a class="top-bar__icon" href="#/notifications" data-link aria-label="Notifikasi">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 17H5l1.5-1.5V11a5.5 5.5 0 0 1 11 0v4.5L19 17h-4"></path>
            <path d="M10 17a2 2 0 0 0 4 0"></path>
          </svg>
        </a>
      </div>
    </div>
  `;

  return el;
}
