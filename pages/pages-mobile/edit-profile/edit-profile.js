if (!document.querySelector('link[href="/pages/pages-mobile/edit-profile/edit-profile.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/edit-profile/edit-profile.css';
  document.head.appendChild(link);
}

import { getSession, isAuthenticated, navigateAfterAuth } from '/js/auth.js';
import { navigateTo } from '/js/router.js';

function iconArrowLeft() {
  return '<svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';
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
        <input class="m-edit-profile__input" id="ep-name" type="text" value="${session.name}" maxlength="50" />
      </div>

      <div class="m-edit-profile__field">
        <label class="m-edit-profile__label" for="ep-email">Email</label>
        <input class="m-edit-profile__input" id="ep-email" type="email" value="${session.email}" maxlength="100" />
      </div>

      <div class="m-edit-profile__field">
        <label class="m-edit-profile__label" for="ep-bio">Bio</label>
        <textarea class="m-edit-profile__textarea" id="ep-bio" maxlength="200">${session.bio || ''}</textarea>
      </div>

      <div class="m-edit-profile__actions">
        <button class="m-edit-profile__save" type="button">Simpan</button>
        <button class="m-edit-profile__cancel" type="button">Batal</button>
      </div>
    </div>
  `;

  el.querySelector('.m-edit-profile__back').addEventListener('click', () => navigateTo('/profile'));
  el.querySelector('.m-edit-profile__cancel').addEventListener('click', () => navigateTo('/profile'));

  el.querySelector('.m-edit-profile__save').addEventListener('click', () => {
    const name = el.querySelector('#ep-name').value.trim();
    const email = el.querySelector('#ep-email').value.trim();
    const bio = el.querySelector('#ep-bio').value.trim();
    if (!name || !email) return;

    const users = JSON.parse(localStorage.getItem('studnow_users') || '[]');
    const idx = users.findIndex(u => u.email === session.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name, email, bio };
      localStorage.setItem('studnow_users', JSON.stringify(users));
    }

    const sess = { ...session, name, email, bio };
    localStorage.setItem('studnow_session', JSON.stringify(sess));
    navigateTo('/profile');
  });

  return el;
}
