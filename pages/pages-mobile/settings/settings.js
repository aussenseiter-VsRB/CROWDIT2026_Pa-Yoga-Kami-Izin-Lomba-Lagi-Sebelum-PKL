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
  return '<i class="bi bi-arrow-left"></i>';
}

function iconBell() {
  return '<i class="bi bi-bell"></i>';
}

function iconLock() {
  return '<i class="bi bi-lock"></i>';
}

function iconMoon() {
  return '<i class="bi bi-moon"></i>';
}

function iconGlobe() {
  return '<i class="bi bi-globe"></i>';
}

function iconTrash() {
  return '<i class="bi bi-trash"></i>';
}

function iconChevron() {
  return '<i class="bi bi-chevron-right"></i>';
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
