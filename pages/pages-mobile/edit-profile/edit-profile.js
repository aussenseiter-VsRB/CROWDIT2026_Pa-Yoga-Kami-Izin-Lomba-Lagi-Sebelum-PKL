if (!document.querySelector('link[href="/pages/pages-mobile/edit-profile/edit-profile.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/edit-profile/edit-profile.css';
  document.head.appendChild(link);
}

import { getSession, isAuthenticated, navigateAfterAuth } from '/js/auth.js';
import { navigateTo } from '/js/router.js';

function iconArrowLeft() {
  return '<i class="bi bi-arrow-left"></i>';
}

export async function EditProfile() {
  if (!isAuthenticated()) {
    navigateAfterAuth('/login');
    return document.createElement('section');
  }

  const session = getSession();
  const initial = session.name.charAt(0).toUpperCase();

  const el = document.createElement('section');
  el.className = 'm-edit-profile';

  el.innerHTML = `
    <div class="m-edit-profile__header">
      <button class="m-edit-profile__back" type="button" aria-label="Kembali">${iconArrowLeft()}</button>
      <h1 class="m-edit-profile__title">Edit Profil</h1>
    </div>

    <div class="m-edit-profile__photo">
      <div class="m-edit-profile__avatar">${initial}</div>
      <button class="m-edit-profile__change-photo" type="button">Ubah Foto</button>
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
      <button class="m-edit-profile__save" type="button">Simpan</button>
    </div>
  `;

  el.querySelector('.m-edit-profile__back').addEventListener('click', () => navigateTo('/profile'));

  el.querySelector('.m-edit-profile__save').addEventListener('click', () => {
    const name = el.querySelector('#ep-name').value.trim();
    const email = el.querySelector('#ep-email').value.trim();
    if (!name || !email) return;
    const users = JSON.parse(localStorage.getItem('studnow_users') || '[]');
    const idx = users.findIndex(u => u.email === session.email);
    if (idx !== -1) {
      users[idx].name = name;
      users[idx].email = email;
      localStorage.setItem('studnow_users', JSON.stringify(users));
      const ses = JSON.parse(sessionStorage.getItem('studnow_session') || localStorage.getItem('studnow_session'));
      if (ses) {
        ses.name = name;
        ses.email = email;
        const storage = sessionStorage.getItem('studnow_session') ? 'sessionStorage' : 'localStorage';
        window[storage].setItem('studnow_session', JSON.stringify(ses));
      }
    }
    navigateTo('/profile');
  });

  return el;
}
