if (!document.querySelector('link[href="/pages/pages-mobile/profile/profile.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/profile/profile.css';
  document.head.appendChild(link);
}

import { getSession, isAuthenticated, logout, navigateAfterAuth } from '/js/auth.js';
import { navigateTo } from '/js/router.js';

const INTERESTS_KEY = 'studnow_interests';

function getInterests() {
  const stored = localStorage.getItem(INTERESTS_KEY);
  return stored ? JSON.parse(stored) : ['Matematika', 'Ilmu Komputer', 'Fisika'];
}

function saveInterests(interests) {
  localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
}

function iconEdit() {
  return '<svg viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>';
}

function iconQr() {
  return '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3" rx="0.5"/><rect x="18" y="14" width="3" height="3" rx="0.5"/><rect x="18" y="18" width="3" height="3" rx="0.5"/></svg>';
}

function iconSettings() {
  return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
}

function iconHelp() {
  return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
}

function iconChevron() {
  return '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>';
}

function iconPlus() {
  return '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
}

function iconX() {
  return '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
}

function renderInterestTags(interests, onRemove) {
  const container = document.createElement('div');
  container.className = 'm-profile__tags';

  interests.forEach((interest, index) => {
    const tag = document.createElement('span');
    tag.className = 'm-profile__tag';
    tag.innerHTML = `
      ${interest}
      <button class="m-profile__tag-remove" type="button" data-index="${index}" aria-label="Hapus ${interest}">${iconX()}</button>
    `;
    const btn = tag.querySelector('.m-profile__tag-remove');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onRemove(index);
    });
    container.appendChild(tag);
  });

  return container;
}

export async function Profile() {
  if (!isAuthenticated()) {
    navigateAfterAuth('/login');
    return document.createElement('section');
  }

  const session = getSession();
  const initial = session.name.charAt(0).toUpperCase();
  let interests = getInterests();

  const el = document.createElement('section');
  el.className = 'm-profile';

  el.innerHTML = `
    <div class="m-profile__cover">
      <div class="m-profile__cover-grid"></div>
      <div class="m-profile__cover-ring"></div>
      <div class="m-profile__cover-ring"></div>
    </div>

    <div class="m-profile__inner">
      <div class="m-profile__avatar-wrap">
        <div class="m-profile__avatar">${initial}</div>
      </div>

      <div class="m-profile__info">
        <h1 class="m-profile__name">${session.name}</h1>
        <p class="m-profile__email">${session.email}</p>
      </div>

      <div class="m-profile__stats">
        <div class="m-profile__stat">
          <span class="m-profile__stat-value">12</span>
          <span class="m-profile__stat-label">Postingan</span>
        </div>
        <div class="m-profile__stat">
          <span class="m-profile__stat-value">24</span>
          <span class="m-profile__stat-label">Mengikuti</span>
        </div>
        <div class="m-profile__stat">
          <span class="m-profile__stat-value">8</span>
          <span class="m-profile__stat-label">Badge</span>
        </div>
      </div>

      <div class="m-profile__interests">
        <p class="m-profile__section-title">Learning Interest</p>
        <div class="m-profile__tags-wrap"></div>
        <div class="m-profile__add-interest">
          <input class="m-profile__interest-input" type="text" placeholder="Tambah minat..." maxlength="30" />
          <button class="m-profile__interest-add" type="button" aria-label="Tambah minat">${iconPlus()}</button>
        </div>
      </div>

      <p class="m-profile__section-title">Pengaturan</p>

      <div class="m-profile__menu">
        <a class="m-profile__menu-item" href="/edit-profile">
          <span class="m-profile__menu-icon m-profile__menu-icon--blue">${iconEdit()}</span>
          <span class="m-profile__menu-text">
            <span class="m-profile__menu-label">Edit Profil</span>
            <span class="m-profile__menu-desc">Ubah nama dan foto profil</span>
          </span>
          <span class="m-profile__menu-chevron">${iconChevron()}</span>
        </a>

        <a class="m-profile__menu-item" href="#">
          <span class="m-profile__menu-icon m-profile__menu-icon--green">${iconQr()}</span>
          <span class="m-profile__menu-text">
            <span class="m-profile__menu-label">My QR Code</span>
            <span class="m-profile__menu-desc">Bagikan profil dengan QR</span>
          </span>
          <span class="m-profile__menu-chevron">${iconChevron()}</span>
        </a>

        <a class="m-profile__menu-item" href="/settings">
          <span class="m-profile__menu-icon m-profile__menu-icon--purple">${iconSettings()}</span>
          <span class="m-profile__menu-text">
            <span class="m-profile__menu-label">Pengaturan</span>
            <span class="m-profile__menu-desc">Preferensi akun dan notifikasi</span>
          </span>
          <span class="m-profile__menu-chevron">${iconChevron()}</span>
        </a>

        <a class="m-profile__menu-item" href="/help">
          <span class="m-profile__menu-icon m-profile__menu-icon--gray">${iconHelp()}</span>
          <span class="m-profile__menu-text">
            <span class="m-profile__menu-label">Bantuan</span>
            <span class="m-profile__menu-desc">Pusat bantuan dan FAQ</span>
          </span>
          <span class="m-profile__menu-chevron">${iconChevron()}</span>
        </a>
      </div>

      <button class="m-profile__logout" type="button">Logout</button>
    </div>
  `;

  function renderInterests() {
    const wrap = el.querySelector('.m-profile__tags-wrap');
    wrap.innerHTML = '';
    const tags = renderInterestTags(interests, (index) => {
      interests.splice(index, 1);
      saveInterests(interests);
      renderInterests();
    });
    wrap.appendChild(tags);
  }

  renderInterests();

  const input = el.querySelector('.m-profile__interest-input');
  const addBtn = el.querySelector('.m-profile__interest-add');

  function addInterest() {
    const val = input.value.trim();
    if (!val) return;
    if (interests.includes(val)) {
      input.value = '';
      return;
    }
    interests.push(val);
    saveInterests(interests);
    renderInterests();
    input.value = '';
    input.focus();
  }

  addBtn.addEventListener('click', addInterest);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addInterest();
  });

  el.querySelector('.m-profile__logout').addEventListener('click', () => {
    logout();
    navigateAfterAuth('/');
  });

  el.querySelectorAll('.m-profile__menu-item').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        navigateTo(href);
      }
    });
  });

  return el;
}
