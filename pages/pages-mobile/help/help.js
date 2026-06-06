if (!document.querySelector('link[href="/pages/pages-mobile/help/help.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/help/help.css';
  document.head.appendChild(link);
}

import { isAuthenticated, navigateAfterAuth } from '/js/auth.js';
import { navigateTo } from '/js/router.js';

function iconArrowLeft() {
  return '<svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';
}

function iconSearch() {
  return '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
}

function iconQuestion() {
  return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
}

function iconChat() {
  return '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
}

function iconChevron() {
  return '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>';
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
    container.innerHTML = '';
    const lower = filter.toLowerCase();

    faqs.forEach((faq, i) => {
      if (filter && !faq.q.toLowerCase().includes(lower) && !faq.a.toLowerCase().includes(lower)) return;

      const btn = document.createElement('button');
      btn.className = 'm-help__faq';
      btn.type = 'button';
      btn.innerHTML = `
        <span class="m-help__faq-icon">${iconQuestion()}</span>
        <span class="m-help__faq-body">
          <span class="m-help__faq-question">${faq.q}</span>
          <span class="m-help__faq-answer">${faq.a}</span>
        </span>
        <span class="m-help__faq-chevron">${iconChevron()}</span>
      `;
      btn.addEventListener('click', () => btn.classList.toggle('m-help__faq--open'));
      container.appendChild(btn);
    });
  }

  renderFaqs();

  el.querySelector('.m-help__back').addEventListener('click', () => navigateTo('/profile'));

  const searchInput = el.querySelector('.m-help__search-input');
  searchInput.addEventListener('input', () => renderFaqs(searchInput.value));

  return el;
}
