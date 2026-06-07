if (!document.querySelector('link[href="/pages/pages-desktop/profile/profile.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/profile/profile.css';
  document.head.appendChild(link);
}

import { getSession, isAuthenticated, logout, navigateAfterAuth } from '/js/auth.js';
import { navigateTo } from '/js/router.js';

const INTERESTS_KEY = 'studnow_interests';
const AVATAR_KEY = 'studnow_avatar';
const BIO_KEY = 'studnow_bio';
const PRIVACY_KEY = 'studnow_privacy';
const ACTIVITIES_KEY = 'studnow_activities';

function getInterests() {
  const stored = localStorage.getItem(INTERESTS_KEY);
  return stored ? JSON.parse(stored) : ['Matematika', 'Ilmu Komputer', 'Fisika'];
}

function saveInterests(interests) {
  localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
}

function getAvatar() {
  return localStorage.getItem(AVATAR_KEY);
}

function saveAvatar(base64) {
  localStorage.setItem(AVATAR_KEY, base64);
}

function removeAvatar() {
  localStorage.removeItem(AVATAR_KEY);
}

function getBio() {
  return localStorage.getItem(BIO_KEY) || '';
}

function saveBio(text) {
  localStorage.setItem(BIO_KEY, text);
}

function getPrivacy() {
  return localStorage.getItem(PRIVACY_KEY) || 'public';
}

function setPrivacy(value) {
  localStorage.setItem(PRIVACY_KEY, value);
}

function getActivities() {
  const stored = localStorage.getItem(ACTIVITIES_KEY);
  if (stored) return JSON.parse(stored);
  const defaults = [
    { icon: 'book',   color: 'blue',   title: 'Memulai Kursus "Kalkulus Lanjut"',    desc: 'Progress: 2 dari 12 materi',     time: '2 jam lalu' },
    { icon: 'chat',   color: 'green',  title: 'Bertanya di Forum "Fisika Dasar"',      desc: 'Menunggu jawaban dari mentor',   time: '5 jam lalu' },
    { icon: 'check',  color: 'orange', title: 'Menyelesaikan "Aljabar Linear"',        desc: 'Nilai: 92/100',                  time: 'Kemarin' },
    { icon: 'star',   color: 'purple', title: 'Mendapatkan Badge "Rajin Belajar"',     desc: 'Selesaikan 10 kursus dalam sebulan', time: '3 hari lalu' },
  ];
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(defaults));
  return defaults;
}

function iconMap(name) {
  const map = {
    camera: '<i class="bi bi-camera"></i>',
    x: '<i class="bi bi-x"></i>',
    plus: '<i class="bi bi-plus"></i>',
    pencil: '<i class="bi bi-pencil"></i>',
    qr: '<i class="bi bi-qr-code"></i>',
    gear: '<i class="bi bi-gear"></i>',
    help: '<i class="bi bi-question-circle"></i>',
    chevron: '<i class="bi bi-chevron-right"></i>',
    book: '<i class="bi bi-book"></i>',
    chat: '<i class="bi bi-chat-dots"></i>',
    check: '<i class="bi bi-check-circle"></i>',
    star: '<i class="bi bi-star"></i>',
    lock: '<i class="bi bi-lock"></i>',
    globe: '<i class="bi bi-globe2"></i>',
  };
  return map[name] || '';
}

function renderInterestTags(interests, onRemove) {
  const container = document.createElement('div');
  container.className = 'd-profile__tags';

  interests.forEach((interest, index) => {
    const tag = document.createElement('span');
    tag.className = 'd-profile__tag';
    tag.innerHTML = `
      ${interest}
      <button class="d-profile__tag-remove" type="button" data-index="${index}" aria-label="Hapus ${interest}">${iconMap('x')}</button>
    `;
    const btn = tag.querySelector('.d-profile__tag-remove');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onRemove(index);
    });
    container.appendChild(tag);
  });

  return container;
}

function renderAvatarContent(initial) {
  const avatarSrc = getAvatar();
  if (avatarSrc) {
    return `<img class="d-profile__avatar-img" src="${avatarSrc}" alt="Foto profil" />`;
  }
  return initial;
}

export async function Profile() {
  if (!isAuthenticated()) {
    navigateAfterAuth('/login');
    return document.createElement('section');
  }

  const session = getSession();
  const initial = session.name.charAt(0).toUpperCase();
  let interests = getInterests();
  const bio = getBio();
  const isPublic = getPrivacy() === 'public';

  const el = document.createElement('section');
  el.className = 'd-profile';

  el.innerHTML = `
    <div class="d-profile__card">
      <div class="d-profile__cover">
        <div class="d-profile__cover-grid"></div>
        <div class="d-profile__cover-ring"></div>
        <div class="d-profile__cover-ring"></div>
        <span class="d-profile__cover-initial">${initial}</span>
      </div>

      <div class="d-profile__body">
        <div class="d-profile__bar">
          <div class="d-profile__avatar-wrap">
            <div class="d-profile__avatar">${renderAvatarContent(initial)}</div>
            <div class="d-profile__avatar-overlay">${iconMap('camera')}</div>
            <div class="d-profile__avatar-actions">
              <button class="d-profile__avatar-delete" type="button" aria-label="Hapus foto" title="Hapus foto">${iconMap('x')}</button>
            </div>
            <input type="file" accept="image/*" class="d-profile__avatar-input" hidden />
          </div>
          <div class="d-profile__bar-info">
            <h1 class="d-profile__name">${session.name}</h1>
            <p class="d-profile__email">${session.email}</p>
          </div>
          <div class="d-profile__bar-stats">
            <div class="d-profile__stat">
              <span class="d-profile__stat-value">12</span>
              <span class="d-profile__stat-label">Postingan</span>
            </div>
            <div class="d-profile__stat">
              <span class="d-profile__stat-value">24</span>
              <span class="d-profile__stat-label">Mengikuti</span>
            </div>
            <div class="d-profile__stat">
              <span class="d-profile__stat-value">8</span>
              <span class="d-profile__stat-label">Badge</span>
            </div>
          </div>
        </div>

        <div class="d-profile__bio" data-editing="false">
          <div class="d-profile__bio-header">
            <span class="d-profile__bio-label">Tentang Saya</span>
            <button class="d-profile__bio-edit" type="button" aria-label="Edit bio">${iconMap('pencil')}</button>
          </div>
          <div class="d-profile__bio-text ${bio ? '' : 'd-profile__bio-text--empty'}">${bio || 'Tambahkan bio singkat...'}</div>
        </div>

        <div class="d-profile__grid">
          <div class="d-profile__interests">
            <p class="d-profile__section-title">Learning Interest</p>
            <div class="d-profile__tags-wrap"></div>
            <div class="d-profile__add-interest">
              <input class="d-profile__interest-input" type="text" placeholder="Tambah minat..." maxlength="30" />
              <button class="d-profile__interest-add" type="button" aria-label="Tambah minat">${iconMap('plus')}</button>
            </div>
          </div>

          <div>
            <p class="d-profile__section-title">Pengaturan</p>
            <div class="d-profile__menu">
              <a class="d-profile__menu-item" href="/edit-profile">
                <span class="d-profile__menu-icon d-profile__menu-icon--blue">${iconMap('pencil')}</span>
                <span class="d-profile__menu-text">
                  <span class="d-profile__menu-label">Edit Profil</span>
                  <span class="d-profile__menu-desc">Ubah nama dan email</span>
                </span>
                <span class="d-profile__menu-chevron">${iconMap('chevron')}</span>
              </a>

              <a class="d-profile__menu-item" href="#">
                <span class="d-profile__menu-icon d-profile__menu-icon--green">${iconMap('qr')}</span>
                <span class="d-profile__menu-text">
                  <span class="d-profile__menu-label">My QR Code</span>
                  <span class="d-profile__menu-desc">Bagikan profil dengan QR</span>
                </span>
                <span class="d-profile__menu-chevron">${iconMap('chevron')}</span>
              </a>

              <a class="d-profile__menu-item" href="/settings">
                <span class="d-profile__menu-icon d-profile__menu-icon--purple">${iconMap('gear')}</span>
                <span class="d-profile__menu-text">
                  <span class="d-profile__menu-label">Pengaturan</span>
                  <span class="d-profile__menu-desc">Preferensi akun dan notifikasi</span>
                </span>
                <span class="d-profile__menu-chevron">${iconMap('chevron')}</span>
              </a>

              <a class="d-profile__menu-item" href="/help">
                <span class="d-profile__menu-icon d-profile__menu-icon--gray">${iconMap('help')}</span>
                <span class="d-profile__menu-text">
                  <span class="d-profile__menu-label">Bantuan</span>
                  <span class="d-profile__menu-desc">Pusat bantuan dan FAQ</span>
                </span>
                <span class="d-profile__menu-chevron">${iconMap('chevron')}</span>
              </a>
            </div>

            <div class="d-profile__privacy">
              <span class="d-profile__privacy-icon">${isPublic ? iconMap('globe') : iconMap('lock')}</span>
              <div class="d-profile__privacy-info">
                <span class="d-profile__privacy-label">Profil ${isPublic ? 'Publik' : 'Privat'}</span>
                <span class="d-profile__privacy-desc">${isPublic ? 'Dilihat oleh semua pengguna' : 'Hanya untuk Anda'}</span>
              </div>
              <label class="d-profile__toggle">
                <input class="d-profile__toggle-input" type="checkbox" ${isPublic ? 'checked' : ''} />
                <span class="d-profile__toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="d-profile__activity">
          <p class="d-profile__section-title">Aktivitas Terbaru</p>
          <div class="d-profile__activity-list"></div>
        </div>

        <div class="d-profile__logout-wrap">
          <button class="d-profile__logout" type="button">Logout</button>
        </div>
      </div>
    </div>
  `;

  const avatarWrap = el.querySelector('.d-profile__avatar-wrap');
  const avatarEl = el.querySelector('.d-profile__avatar');
  const avatarOverlay = el.querySelector('.d-profile__avatar-overlay');
  const avatarDelete = el.querySelector('.d-profile__avatar-delete');
  const avatarInput = el.querySelector('.d-profile__avatar-input');

  avatarOverlay.addEventListener('click', () => avatarInput.click());
  avatarEl.addEventListener('click', () => avatarInput.click());

  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      saveAvatar(dataUrl);
      avatarEl.innerHTML = `<img class="d-profile__avatar-img" src="${dataUrl}" alt="Foto profil" />`;
    };
    reader.readAsDataURL(file);
    avatarInput.value = '';
  });

  avatarDelete.addEventListener('click', (e) => {
    e.stopPropagation();
    removeAvatar();
    avatarEl.innerHTML = initial;
  });

  const bioEl = el.querySelector('.d-profile__bio');
  const bioText = el.querySelector('.d-profile__bio-text');
  const bioEditBtn = el.querySelector('.d-profile__bio-edit');
  let isEditing = false;

  function enterBioEdit() {
    if (isEditing) return;
    isEditing = true;
    bioEl.dataset.editing = 'true';
    const currentText = getBio();
    bioEl.innerHTML = `
      <div class="d-profile__bio-header">
        <span class="d-profile__bio-label">Tentang Saya</span>
      </div>
      <textarea class="d-profile__bio-textarea" rows="3">${currentText}</textarea>
      <div class="d-profile__bio-footer">
        <button class="d-profile__bio-cancel" type="button">Batal</button>
        <button class="d-profile__bio-save" type="button">Simpan</button>
      </div>
    `;
    const textarea = bioEl.querySelector('.d-profile__bio-textarea');
    textarea.focus();

    const saveBtn = bioEl.querySelector('.d-profile__bio-save');
    const cancelBtn = bioEl.querySelector('.d-profile__bio-cancel');

    function saveBioEdit() {
      const val = textarea.value.trim();
      saveBio(val);
      exitBioEdit(val);
    }

    saveBtn.addEventListener('click', saveBioEdit);
    cancelBtn.addEventListener('click', () => exitBioEdit(getBio()));
    textarea.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') exitBioEdit(getBio());
    });
  }

  function exitBioEdit(savedText) {
    isEditing = false;
    bioEl.dataset.editing = 'false';
    bioEl.innerHTML = `
      <div class="d-profile__bio-header">
        <span class="d-profile__bio-label">Tentang Saya</span>
        <button class="d-profile__bio-edit" type="button" aria-label="Edit bio">${iconMap('pencil')}</button>
      </div>
      <div class="d-profile__bio-text ${savedText ? '' : 'd-profile__bio-text--empty'}">${savedText || 'Tambahkan bio singkat...'}</div>
    `;
    bioEl.querySelector('.d-profile__bio-edit').addEventListener('click', enterBioEdit);
  }

  bioEditBtn.addEventListener('click', enterBioEdit);

  const activities = getActivities();
  const activityList = el.querySelector('.d-profile__activity-list');
  activities.forEach((act) => {
    const item = document.createElement('div');
    item.className = 'd-profile__activity-item';
    item.innerHTML = `
      <span class="d-profile__activity-icon d-profile__activity-icon--${act.color}">${iconMap(act.icon)}</span>
      <div class="d-profile__activity-text">
        <span class="d-profile__activity-title">${act.title}</span>
        <span class="d-profile__activity-desc">${act.desc}</span>
      </div>
      <span class="d-profile__activity-time">${act.time}</span>
    `;
    activityList.appendChild(item);
  });

  const privacyToggle = el.querySelector('.d-profile__toggle-input');
  const privacyIcon = el.querySelector('.d-profile__privacy-icon');
  const privacyLabel = el.querySelector('.d-profile__privacy-label');
  const privacyDesc = el.querySelector('.d-profile__privacy-desc');

  privacyToggle.addEventListener('change', () => {
    const pub = privacyToggle.checked;
    setPrivacy(pub ? 'public' : 'private');
    privacyIcon.innerHTML = pub ? iconMap('globe') : iconMap('lock');
    privacyLabel.textContent = pub ? 'Profil Publik' : 'Profil Privat';
    privacyDesc.textContent = pub ? 'Dilihat oleh semua pengguna' : 'Hanya untuk Anda';
  });

  function renderInterests() {
    const wrap = el.querySelector('.d-profile__tags-wrap');
    wrap.innerHTML = '';
    const tags = renderInterestTags(interests, (index) => {
      interests.splice(index, 1);
      saveInterests(interests);
      renderInterests();
    });
    wrap.appendChild(tags);
  }

  renderInterests();

  const input = el.querySelector('.d-profile__interest-input');
  const addBtn = el.querySelector('.d-profile__interest-add');

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

  el.querySelector('.d-profile__logout').addEventListener('click', () => {
    logout();
    navigateAfterAuth('/');
  });

  el.querySelectorAll('.d-profile__menu-item').forEach(link => {
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
