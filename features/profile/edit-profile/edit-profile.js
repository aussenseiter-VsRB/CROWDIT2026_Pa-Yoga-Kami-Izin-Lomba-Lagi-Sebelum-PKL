import { injectStyle } from '../../../js/utils/styleLoader.js';
injectStyle('/features/profile/edit-profile/edit-profile.css');

import { getSession, isAuthenticated, navigateAfterAuth } from '../../../js/services/auth.js';
import { navigateTo } from '../../../js/utils/url.js';
import { STORAGE_KEYS, MOBILE_BREAKPOINT } from '../../../js/core/config.js';

const AVATAR_KEY = STORAGE_KEYS.AVATAR;

function iconArrowLeft() { return '<i class="bi bi-arrow-left"></i>'; }
function iconCamera() { return '<i class="bi bi-camera"></i>'; }

function getAvatar() {
  return localStorage.getItem(AVATAR_KEY);
}

function saveAvatar(base64) {
  localStorage.setItem(AVATAR_KEY, base64);
}

export async function EditProfile() {
  if (!isAuthenticated()) {
    navigateAfterAuth('/login');
    return document.createElement('section');
  }

  const session = getSession();
  const initial = session.name.charAt(0).toUpperCase();
  const avatarSrc = getAvatar();

  const el = document.createElement('section');
  el.className = 'm-edit-profile';

  el.innerHTML = `
    <div class="m-edit-profile__header">
      <button class="m-edit-profile__back" type="button" aria-label="Kembali">${iconArrowLeft()}</button>
      <h1 class="m-edit-profile__title">Edit Profil</h1>
    </div>

    <div class="m-edit-profile__photo">
      <div class="m-edit-profile__avatar" id="js-ep-avatar">
        ${avatarSrc ? `<img class="m-edit-profile__avatar-img" src="${avatarSrc}" alt="Foto profil" />` : initial}
      </div>
      <div class="m-edit-profile__photo-actions">
        <button class="m-edit-profile__change-photo" id="js-ep-change" type="button">${iconCamera()} Ubah Foto</button>
        <button class="m-edit-profile__change-photo m-edit-profile__change-photo--danger" id="js-ep-remove" type="button">Hapus</button>
      </div>
      <input type="file" accept="image/*" class="m-edit-profile__avatar-input" id="js-ep-input" hidden />
    </div>

    <div class="m-edit-profile__form">
      <div class="m-edit-profile__field">
        <label class="m-edit-profile__label" for="ep-name">Nama Lengkap</label>
        <input class="m-edit-profile__input" id="ep-name" type="text" value="${session.name}" />
      </div>
      <div class="m-edit-profile__field">
        <label class="m-edit-profile__label" for="ep-email">Email</label>
        <input class="m-edit-profile__input" id="ep-email" type="email" value="${session.email}" />
      </div>
      <div class="m-edit-profile__field">
        <label class="m-edit-profile__label" for="ep-bio">Bio</label>
        <textarea class="m-edit-profile__input m-edit-profile__textarea" id="ep-bio" rows="3" placeholder="Tulis bio singkat..."></textarea>
      </div>
      <div class="m-edit-profile__actions">
        <button class="m-edit-profile__cancel" id="js-ep-cancel" type="button">Batal</button>
        <button class="m-edit-profile__save" id="js-ep-save" type="button">Simpan</button>
      </div>
    </div>
  `;

  el.querySelector('.m-edit-profile__back').addEventListener('click', () => navigateTo('/profile'));
  el.querySelector('#js-ep-cancel').addEventListener('click', () => navigateTo('/profile'));

  const avatarEl = el.querySelector('#js-ep-avatar');
  const changeBtn = el.querySelector('#js-ep-change');
  const removeBtn = el.querySelector('#js-ep-remove');
  const input = el.querySelector('#js-ep-input');

  changeBtn.addEventListener('click', () => input.click());
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      saveAvatar(dataUrl);
      avatarEl.innerHTML = `<img class="m-edit-profile__avatar-img" src="${dataUrl}" alt="Foto profil" />`;
    };
    reader.readAsDataURL(file);
    input.value = '';
  });

  removeBtn.addEventListener('click', () => {
    localStorage.removeItem(AVATAR_KEY);
    avatarEl.innerHTML = initial;
  });

  el.querySelector('#js-ep-save').addEventListener('click', () => {
    const name = el.querySelector('#ep-name').value.trim();
    const email = el.querySelector('#ep-email').value.trim();
    const bio = el.querySelector('#ep-bio').value.trim();
    if (!name || !email) return;
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const idx = users.findIndex(u => u.email === session.email);
    if (idx !== -1) {
      users[idx].name = name;
      users[idx].email = email;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      const ses = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION) || localStorage.getItem(STORAGE_KEYS.SESSION));
      if (ses) {
        ses.name = name;
        ses.email = email;
        const storage = sessionStorage.getItem(STORAGE_KEYS.SESSION) ? 'sessionStorage' : 'localStorage';
        window[storage].setItem(STORAGE_KEYS.SESSION, JSON.stringify(ses));
      }
    }
    if (bio) localStorage.setItem(STORAGE_KEYS.BIO, bio);
    navigateTo('/profile');
  });

  return el;
}
