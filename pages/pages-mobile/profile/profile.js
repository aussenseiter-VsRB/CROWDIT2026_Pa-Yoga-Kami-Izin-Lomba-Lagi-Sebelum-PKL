if (!document.querySelector('link[href="/pages/pages-mobile/profile/profile.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/profile/profile.css';
  document.head.appendChild(link);
}

import { getSession, isAuthenticated, logout, navigateAfterAuth, getUsers } from '/js/auth.js';
import { navigateTo } from '/js/router.js';
import { isFollowing, toggleFollowUser, getFollowingCount, getFollowersCount, getFriends } from '/js/follow.js';

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
    { icon: 'book', color: 'blue', title: 'Memulai Kursus "Kalkulus Lanjut"', desc: 'Progress: 2 dari 12 materi', time: '2 jam lalu' },
    { icon: 'chat', color: 'green', title: 'Bertanya di Forum "Fisika Dasar"', desc: 'Menunggu jawaban dari mentor', time: '5 jam lalu' },
    { icon: 'check', color: 'orange', title: 'Menyelesaikan "Aljabar Linear"', desc: 'Nilai: 92/100', time: 'Kemarin' },
    { icon: 'star', color: 'purple', title: 'Mendapatkan Badge "Rajin Belajar"', desc: 'Selesaikan 10 kursus dalam sebulan', time: '3 hari lalu' },
  ];
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(defaults));
  return defaults;
}

function iconEdit() { return '<i class="bi bi-pencil"></i>'; }
function iconQr() { return '<i class="bi bi-qr-code"></i>'; }
function iconSettings() { return '<i class="bi bi-gear"></i>'; }
function iconHelp() { return '<i class="bi bi-question-circle"></i>'; }
function iconChevron() { return '<i class="bi bi-chevron-right"></i>'; }
function iconPlus() { return '<i class="bi bi-plus"></i>'; }
function iconX() { return '<i class="bi bi-x"></i>'; }
function iconCamera() { return '<i class="bi bi-camera"></i>'; }
function iconGlobe() { return '<i class="bi bi-globe2"></i>'; }
function iconLock() { return '<i class="bi bi-lock"></i>'; }

function mapIcon(name) {
  const map = { book: 'bi bi-book', chat: 'bi bi-chat-dots', check: 'bi bi-check-circle', star: 'bi bi-star' };
  return map[name] || 'bi bi-circle';
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

function renderAvatarContent(initial) {
  const avatarSrc = getAvatar();
  if (avatarSrc) {
    return `<img class="m-profile__avatar-img" src="${avatarSrc}" alt="Foto profil" />`;
  }
  return initial;
}

export async function Profile() {
  const params = new URLSearchParams(window.location.search);
  const viewedUser = params.get('user') || null;

  const session = getSession();
  const isOwnProfile = !viewedUser || (session && session.name === viewedUser);

  let profileUser;
  if (viewedUser) {
    const users = getUsers();
    profileUser = users.find(u => u.name === viewedUser);
  }

  if (!isOwnProfile && !profileUser) {
    const el = document.createElement('section');
    el.className = 'mobile-page';
    el.innerHTML = '<div class="mobile-page__inner"><p style="text-align:center;color:var(--muted);padding:2rem 0">Pengguna tidak ditemukan</p></div>';
    return el;
  }

  if (!isOwnProfile && !isAuthenticated()) {
    const el = document.createElement('section');
    el.className = 'mobile-page';
    el.innerHTML = `
      <div class="mobile-page__inner">
        <a href="/" data-link style="display:inline-flex;align-items:center;gap:0.35rem;font-size:0.82rem;font-weight:600;color:var(--accent);text-decoration:none;margin-bottom:1rem">
          <i class="bi bi-arrow-left"></i> Kembali
        </a>
        <div style="text-align:center;padding:1rem 0">
          <p style="font-size:2.5rem;margin-bottom:0.5rem;opacity:0.2"><i class="bi bi-person"></i></p>
          <h1 style="font-size:1.4rem;margin:0 0 0.35rem">${profileUser.name}</h1>
          <p style="color:var(--muted-alt);font-size:0.85rem">Login untuk melihat profil lengkap</p>
        </div>
      </div>
    `;
    return el;
  }

  if (!isOwnProfile) {
    const initial = profileUser.name.charAt(0).toUpperCase();
    const avatarColors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de', '#5ac8fa', '#ff9500'];
    const color = avatarColors[profileUser.name.length % avatarColors.length];
    const isFollowed = isFollowing(session?.email, profileUser.email);
    const followingCount = getFollowingCount(profileUser.email);
    const followersCount = getFollowersCount(profileUser.email);

    const el = document.createElement('section');
    el.className = 'm-profile';
    el.innerHTML = `
      <a href="/" data-link style="display:inline-flex;align-items:center;gap:0.35rem;font-size:0.82rem;font-weight:600;color:var(--accent);text-decoration:none;padding:0.75rem 1.25rem">
        <i class="bi bi-arrow-left"></i> Kembali
      </a>
      <div class="m-profile__inner">
        <div style="text-align:center;margin-bottom:1rem">
          <div style="width:5.5rem;height:5.5rem;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:2.25rem;font-weight:700;margin:0 auto 0.75rem">${initial}</div>
          <h1 style="margin:0 0 0.25rem;font-size:1.35rem">${profileUser.name}</h1>
          <p style="color:var(--muted-alt);font-size:0.82rem;margin:0">${profileUser.email}</p>
        </div>
        <div style="display:flex;gap:0.6rem;margin-bottom:1rem">
          <button class="m-profile__follow-btn" id="js-follow-btn" data-following="${isFollowed}" style="flex:1;padding:0.6rem;border-radius:999px;border:none;font-weight:700;font-size:0.85rem;cursor:pointer;background:${isFollowed ? 'var(--border-color)' : 'var(--accent)'};color:${isFollowed ? 'var(--text)' : '#fff'};transition:all 0.15s">${isFollowed ? 'Mengikuti' : 'Ikuti'}</button>
        </div>
        <div class="m-profile__stats" style="margin-bottom:1.5rem">
          <div class="m-profile__stat"><span class="m-profile__stat-value">0</span><span class="m-profile__stat-label">Postingan</span></div>
          <div class="m-profile__stat"><span class="m-profile__stat-value">${followingCount}</span><span class="m-profile__stat-label">Mengikuti</span></div>
          <div class="m-profile__stat"><span class="m-profile__stat-value">${followersCount}</span><span class="m-profile__stat-label">Pengikut</span></div>
        </div>
        <div class="mobile-bio">
          <div class="mobile-bio__header">
            <span class="mobile-bio__label">Tentang Saya</span>
          </div>
          <div class="mobile-bio__text mobile-bio__text--empty">Belum ada bio</div>
        </div>
      </div>
    `;

    if (session) {
      const followBtn = el.querySelector('#js-follow-btn');
      const statEls = el.querySelectorAll('.m-profile__stat-value');
      const followersStat = statEls[2];
      followBtn.addEventListener('click', () => {
        const nowFollowed = toggleFollowUser(session.email, profileUser.email);
        followBtn.textContent = nowFollowed ? 'Mengikuti' : 'Ikuti';
        followBtn.style.background = nowFollowed ? 'var(--border-color)' : 'var(--accent)';
        followBtn.style.color = nowFollowed ? 'var(--text)' : '#fff';
        followBtn.dataset.following = nowFollowed;
        followersStat.textContent = getFollowersCount(profileUser.email);
        window.dispatchEvent(new CustomEvent('follow-update'));
      });
    }

    return el;
  }

  if (!session) {
    navigateAfterAuth('/login');
    return document.createElement('section');
  }

  const initial = session.name.charAt(0).toUpperCase();
  let interests = getInterests();
  const bio = getBio();
  const isPublic = getPrivacy() === 'public';
  const activities = getActivities();
  const ownFollowingCount = getFollowingCount(session.email);
  const ownFollowersCount = getFollowersCount(session.email);

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
        <div class="m-profile__avatar" id="js-profile-avatar">
          ${renderAvatarContent(initial)}
          <div class="m-profile__avatar-overlay" id="js-avatar-overlay">${iconCamera()}</div>
          <button class="m-profile__avatar-delete" id="js-avatar-delete" type="button" aria-label="Hapus foto">${iconX()}</button>
        </div>
        <input type="file" accept="image/*" class="m-profile__avatar-input" id="js-avatar-input" hidden />
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
          <span class="m-profile__stat-value">${ownFollowingCount}</span>
          <span class="m-profile__stat-label">Mengikuti</span>
        </div>
        <div class="m-profile__stat">
          <span class="m-profile__stat-value">${ownFollowersCount}</span>
          <span class="m-profile__stat-label">Pengikut</span>
        </div>
      </div>

      <div class="mobile-bio" id="js-bio-section">
        <div class="mobile-bio__header">
          <span class="mobile-bio__label">Tentang Saya</span>
          <button class="mobile-bio__edit" id="js-bio-edit" type="button">${iconEdit()}</button>
        </div>
        <div class="mobile-bio__text ${bio ? '' : 'mobile-bio__text--empty'}">${bio || 'Tambahkan bio singkat...'}</div>
      </div>

      <div class="m-profile__interests">
        <p class="m-profile__section-title">Learning Interest</p>
        <div class="m-profile__tags-wrap"></div>
        <div class="m-profile__add-interest">
          <input class="m-profile__interest-input" type="text" placeholder="Tambah minat..." maxlength="30" />
          <button class="m-profile__interest-add" type="button" aria-label="Tambah minat">${iconPlus()}</button>
        </div>
      </div>

      <div class="mobile-privacy">
        <span class="mobile-privacy__icon">${isPublic ? iconGlobe() : iconLock()}</span>
        <div class="mobile-privacy__info">
          <span class="mobile-privacy__label" id="js-privacy-label">Profil ${isPublic ? 'Publik' : 'Privat'}</span>
          <span class="mobile-privacy__desc" id="js-privacy-desc">${isPublic ? 'Dilihat oleh semua pengguna' : 'Hanya untuk Anda'}</span>
        </div>
        <label class="mobile-toggle">
          <input type="checkbox" id="js-privacy-toggle" ${isPublic ? 'checked' : ''} />
          <span class="mobile-toggle__slider"></span>
        </label>
      </div>

      <div class="mobile-activity">
        <p class="mobile-section-title">Aktivitas Terbaru</p>
        <div class="mobile-activity-list" id="js-activity-list">
          ${activities.map(a => `
            <div class="mobile-activity-item">
              <span class="mobile-activity-icon mobile-activity-icon--${a.color}"><i class="${mapIcon(a.icon)}"></i></span>
              <div class="mobile-activity-body">
                <span class="mobile-activity-title">${a.title}</span>
                <span class="mobile-activity-desc">${a.desc}</span>
              </div>
              <span class="mobile-activity-time">${a.time}</span>
            </div>
          `).join('')}
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

  const avatarEl = el.querySelector('#js-profile-avatar');
  const avatarOverlay = el.querySelector('#js-avatar-overlay');
  const avatarInput = el.querySelector('#js-avatar-input');
  const avatarDelete = el.querySelector('#js-avatar-delete');

  avatarOverlay.addEventListener('click', () => avatarInput.click());
  avatarEl.addEventListener('click', () => avatarInput.click());

  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      saveAvatar(dataUrl);
      avatarEl.innerHTML = `<img class="m-profile__avatar-img" src="${dataUrl}" alt="Foto profil" />`;
    };
    reader.readAsDataURL(file);
    avatarInput.value = '';
  });

  avatarDelete.addEventListener('click', (e) => {
    e.stopPropagation();
    removeAvatar();
    avatarEl.innerHTML = initial;
  });

  const bioSection = el.querySelector('#js-bio-section');
  const bioEditBtn = el.querySelector('#js-bio-edit');
  let isEditingBio = false;

  function enterBioEdit() {
    if (isEditingBio) return;
    isEditingBio = true;
    const currentText = getBio();
    bioSection.innerHTML = `
      <div class="mobile-bio__header">
        <span class="mobile-bio__label">Tentang Saya</span>
      </div>
      <textarea class="mobile-bio__textarea" id="js-bio-textarea" rows="3">${currentText}</textarea>
      <div class="mobile-bio__actions">
        <button class="mobile-bio__cancel" id="js-bio-cancel" type="button">Batal</button>
        <button class="mobile-bio__save" id="js-bio-save" type="button">Simpan</button>
      </div>
    `;
    const textarea = bioSection.querySelector('#js-bio-textarea');
    textarea.focus();

    bioSection.querySelector('#js-bio-save').addEventListener('click', () => {
      const val = textarea.value.trim();
      saveBio(val);
      exitBioEdit(val);
    });
    bioSection.querySelector('#js-bio-cancel').addEventListener('click', () => exitBioEdit(getBio()));
    textarea.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') exitBioEdit(getBio());
    });
  }

  function exitBioEdit(savedText) {
    isEditingBio = false;
    bioSection.innerHTML = `
      <div class="mobile-bio__header">
        <span class="mobile-bio__label">Tentang Saya</span>
        <button class="mobile-bio__edit" id="js-bio-edit" type="button">${iconEdit()}</button>
      </div>
      <div class="mobile-bio__text ${savedText ? '' : 'mobile-bio__text--empty'}">${savedText || 'Tambahkan bio singkat...'}</div>
    `;
    bioSection.querySelector('#js-bio-edit').addEventListener('click', enterBioEdit);
  }

  bioEditBtn.addEventListener('click', enterBioEdit);

  const privacyToggle = el.querySelector('#js-privacy-toggle');
  const privacyLabel = el.querySelector('#js-privacy-label');
  const privacyDesc = el.querySelector('#js-privacy-desc');
  const privacyIcon = el.querySelector('.mobile-privacy__icon');

  privacyToggle.addEventListener('change', () => {
    const pub = privacyToggle.checked;
    setPrivacy(pub ? 'public' : 'private');
    privacyIcon.innerHTML = pub ? iconGlobe() : iconLock();
    privacyLabel.textContent = pub ? 'Profil Publik' : 'Profil Privat';
    privacyDesc.textContent = pub ? 'Dilihat oleh semua pengguna' : 'Hanya untuk Anda';
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
