if (!document.querySelector('link[href="/pages/pages-mobile/help/help.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/help/help.css';
  document.head.appendChild(link);
}

import { isAuthenticated, navigateAfterAuth } from '/js/auth.js';
import { navigateTo } from '/js/router.js';

function iconArrowLeft() {
  return '<i class="bi bi-arrow-left"></i>';
}

function iconSearch() {
  return '<i class="bi bi-search"></i>';
}

function iconQuestion() {
  return '<i class="bi bi-question-circle"></i>';
}

function iconChat() {
  return '<i class="bi bi-chat-dots"></i>';
}

function iconChevron() {
  return '<i class="bi bi-chevron-right"></i>';
}

const faqs = [
  { q: 'Bagaimana cara mendaftar?', a: 'Klik "Daftar" di halaman login, isi nama, email, dan password, lalu klik "Daftar". Akun Anda akan langsung aktif.' },
  { q: 'Bagaimana cara bergabung ke grup?', a: 'Buka halaman Grup, cari grup yang diinginkan, lalu klik "Gabung". Anda akan langsung menjadi anggota grup tersebut.' },
  { q: 'Bagaimana cara mengedit profil?', a: 'Buka halaman Profil, klik "Edit Profil" untuk mengubah nama, email, dan bio. Jangan lupa klik "Simpan" setelah selesai.' },
  { q: 'Apakah data saya aman?', a: 'Data Anda disimpan secara lokal di perangkat Anda. Kami tidak membagikan data Anda kepada pihak ketiga manapun.' },
  { q: 'Bagaimana cara menghubungi support?', a: 'Gunakan form "Hubungi Kami" di halaman Contact, atau kirim email ke support@studnow.com.' },
];

export async function Help() {
  if (!isAuthenticated()) {
    navigateAfterAuth('/login');
    return document.createElement('section');
  }

  const el = document.createElement('section');
  el.className = 'm-help';

  el.innerHTML = `
    <div class="m-help__header">
      <button class="m-help__back" type="button" aria-label="Kembali">${iconArrowLeft()}</button>
      <h1 class="m-help__title">Bantuan</h1>
    </div>

    <div class="m-help__search">
      <span class="m-help__search-icon">${iconSearch()}</span>
      <input class="m-help__search-input" type="text" placeholder="Cari pertanyaan..." />
    </div>

    <div class="m-help__section">
      <p class="m-help__section-title">Pertanyaan Umum</p>
      <div class="m-help__card" id="help-faqs"></div>
    </div>

    <div class="m-help__section">
      <p class="m-help__section-title">Hubungi Kami</p>
      <div class="m-help__card">
        <a class="m-help__contact" href="mailto:support@studnow.com">
          <span class="m-help__contact-icon">${iconChat()}</span>
          <span class="m-help__contact-body">
            <span class="m-help__contact-label">Email Support</span>
            <span class="m-help__contact-desc">support@studnow.com</span>
          </span>
          <span class="m-help__contact-chevron">${iconChevron()}</span>
        </a>
      </div>
    </div>
  `;

  function renderFaqs(filter = '') {
    const container = el.querySelector('#help-faqs');
    if (!container) return;
    const terms = filter.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = terms.length
      ? faqs.filter(f => terms.some(t => f.q.toLowerCase().includes(t) || f.a.toLowerCase().includes(t)))
      : faqs;
    container.innerHTML = filtered.map((f, i) => `
      <details class="m-help__faq"${i === 0 ? ' open' : ''}>
        <summary class="m-help__faq-summary">
          <span>${f.q}</span>
          <span class="m-help__faq-icon">${iconChevron()}</span>
        </summary>
        <p class="m-help__faq-answer">${f.a}</p>
      </details>
    `).join('');
  }

  renderFaqs();

  const searchInput = el.querySelector('.m-help__search-input');
  searchInput.addEventListener('input', () => renderFaqs(searchInput.value));

  el.querySelector('.m-help__back').addEventListener('click', () => navigateTo('/profile'));

  return el;
}
