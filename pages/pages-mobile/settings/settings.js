if (!document.querySelector('link[href="/pages/pages-mobile/settings/settings.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/settings/settings.css';
  document.head.appendChild(link);
}

import { isAuthenticated, navigateAfterAuth } from '/js/auth.js';
import { navigateTo } from '/js/router.js';
import { getTheme, toggleTheme } from '/js/theme.js';

function iconArrowLeft() {
  return '<svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';
}

function iconBell() {
  return '<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
}

function iconLock() {
  return '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
}

function iconMoon() {
  return '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

function iconGlobe() {
  return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
}

function iconTrash() {
  return '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
}

function iconChevron() {
  return '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>';
}

export async function Settings() {
  if (!isAuthenticated()) {
    navigateAfterAuth('/login');
    return document.createElement('section');
  }

  const el = document.createElement('section');
  el.className = 'm-settings';

  el.innerHTML = `
    <div class="m-settings__header">
      <button class="m-settings__back" type="button" aria-label="Kembali">${iconArrowLeft()}</button>
      <h1 class="m-settings__title">Pengaturan</h1>
    </div>

    <div class="m-settings__section">
      <p class="m-settings__section-title">Notifikasi</p>
      <div class="m-settings__card">
        <label class="m-settings__item">
          <span class="m-settings__item-icon m-settings__item-icon--blue">${iconBell()}</span>
          <span class="m-settings__item-body">
            <span class="m-settings__item-label">Push Notifikasi</span>
            <span class="m-settings__item-desc">Terima notifikasi kegiatan</span>
          </span>
          <span class="m-settings__toggle">
            <input type="checkbox" checked />
            <span class="m-settings__toggle-slider"></span>
          </span>
        </label>
      </div>
    </div>

    <div class="m-settings__section">
      <p class="m-settings__section-title">Tampilan</p>
      <div class="m-settings__card">
        <label class="m-settings__item">
          <span class="m-settings__item-icon m-settings__item-icon--orange">${iconMoon()}</span>
          <span class="m-settings__item-body">
            <span class="m-settings__item-label">Mode Gelap</span>
            <span class="m-settings__item-desc">Tampilan dengan tema gelap</span>
          </span>
          <span class="m-settings__toggle">
            <input type="checkbox" id="settings-dark-mode" />
            <span class="m-settings__toggle-slider"></span>
          </span>
        </label>
      </div>
    </div>

    <div class="m-settings__section">
      <p class="m-settings__section-title">Akun</p>
      <div class="m-settings__card">
        <button class="m-settings__item" type="button">
          <span class="m-settings__item-icon m-settings__item-icon--green">${iconLock()}</span>
          <span class="m-settings__item-body">
            <span class="m-settings__item-label">Privasi</span>
            <span class="m-settings__item-desc">Kontrol data dan privasi</span>
          </span>
          <span class="m-settings__item-chevron">${iconChevron()}</span>
        </button>
        <button class="m-settings__item" type="button">
          <span class="m-settings__item-icon m-settings__item-icon--gray">${iconGlobe()}</span>
          <span class="m-settings__item-body">
            <span class="m-settings__item-label">Bahasa</span>
            <span class="m-settings__item-desc">Indonesia</span>
          </span>
          <span class="m-settings__item-chevron">${iconChevron()}</span>
        </button>
      </div>
    </div>

    <div class="m-settings__section">
      <p class="m-settings__section-title">Lainnya</p>
      <div class="m-settings__card">
        <button class="m-settings__item" type="button">
          <span class="m-settings__item-icon m-settings__item-icon--red">${iconTrash()}</span>
          <span class="m-settings__item-body">
            <span class="m-settings__item-label">Hapus Akun</span>
            <span class="m-settings__item-desc">Hapus akun dan semua data</span>
          </span>
          <span class="m-settings__item-chevron">${iconChevron()}</span>
        </button>
      </div>
    </div>
  `;

  el.querySelector('.m-settings__back').addEventListener('click', () => navigateTo('/profile'));

  const darkToggle = el.querySelector('#settings-dark-mode');
  darkToggle.checked = getTheme() === 'dark';
  darkToggle.addEventListener('change', toggleTheme);

  return el;
}
