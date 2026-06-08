import { injectStyle } from '../../../js/utils/styleLoader.js';
import { fetchData } from '../../../js/utils/api.js';
import { getSession, isAuthenticated, logout, navigateAfterAuth, getUsers } from '../../../js/services/auth.js';
import { getHashParams, navigateTo } from '../../../js/utils/url.js';
import { TambahMinat } from '../../../components/shared/tambah-minat/tambah-minat.js';
import { showQrModal } from '../../../components/ui/qr-modal/qr-modal.js';
import { isFollowing, toggleFollowUser, getFollowingCount, getFollowersCount, getFriends, isBlocked, blockUser, unblockUser } from '../../../js/services/follow.js';
import { STORAGE_KEYS, DEFAULTS, MOBILE_BREAKPOINT } from '../../../js/core/config.js';

injectStyle('/css/_shared.css');
injectStyle('/features/profile/profile/profile.css');

const INTERESTS_KEY = STORAGE_KEYS.INTERESTS;
const AVATAR_KEY = STORAGE_KEYS.AVATAR;
const BIO_KEY = STORAGE_KEYS.BIO;
const PRIVACY_KEY = STORAGE_KEYS.PRIVACY;
const ACTIVITIES_KEY = STORAGE_KEYS.ACTIVITIES;

function getInterests() {
  const stored = localStorage.getItem(INTERESTS_KEY);
  return stored ? JSON.parse(stored) : [...DEFAULTS.INTERESTS];
}

function saveInterests(interests) {
  localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
  const s = getSession();
  if (s?.email) localStorage.setItem(INTERESTS_KEY + '_' + s.email, JSON.stringify(interests));
}

function getOtherUserBio(email) {
  return localStorage.getItem(BIO_KEY + '_' + email) || '';
}

function getOtherUserInterests(email) {
  const stored = localStorage.getItem(INTERESTS_KEY + '_' + email);
  return stored ? JSON.parse(stored) : [];
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
  const s = getSession();
  if (s?.email) localStorage.setItem(BIO_KEY + '_' + s.email, text);
}

function getPrivacy() {
  return localStorage.getItem(PRIVACY_KEY) || DEFAULTS.PRIVACY;
}

function setPrivacy(value) {
  localStorage.setItem(PRIVACY_KEY, value);
}

function getActivities() {
  const stored = localStorage.getItem(ACTIVITIES_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(DEFAULTS.ACTIVITIES));
  return [...DEFAULTS.ACTIVITIES];
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

function renderAvatarContent(initial) {
  const avatarSrc = getAvatar();
  if (avatarSrc) {
    return `<img class="d-profile__avatar-img" src="${avatarSrc}" alt="Foto profil" />`;
  }
  return initial;
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

function renderMobileAvatarContent(initial) {
  const avatarSrc = getAvatar();
  if (avatarSrc) {
    return `<img class="m-profile__avatar-img" src="${avatarSrc}" alt="Foto profil" />`;
  }
  return initial;
}

function renderDesktop() {
  const params = getHashParams();
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
    el.className = 'd-profile';
    el.innerHTML = `
      <div class="d-profile__card" style="max-width:480px;margin:0 auto;padding:2rem;text-align:center">
        <p style="font-size:3rem;margin-bottom:0.5rem;opacity:0.15"><i class="bi bi-person"></i></p>
        <p style="color:var(--muted-alt)">Pengguna tidak ditemukan</p>
      </div>
    `;
    return el;
  }

  if (!isOwnProfile) {
    const avatarColors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de', '#5ac8fa', '#ff9500'];
    const color = avatarColors[profileUser.name.length % avatarColors.length];
    const initial = profileUser.name.charAt(0).toUpperCase();
    const storedAvatar = localStorage.getItem(AVATAR_KEY + '_' + profileUser.email);
    const isFollowed = isFollowing(session?.email, profileUser.email);
    const isUserBlocked = isBlocked(session?.email, profileUser.email);
    const followingCount = getFollowingCount(profileUser.email);
    const followersCount = getFollowersCount(profileUser.email);
    const otherBio = getOtherUserBio(profileUser.email);
    const otherInterests = getOtherUserInterests(profileUser.email);

    const el = document.createElement('section');
    el.className = 'd-profile';
    el.innerHTML = `
      <div class="d-profile__card" style="max-width:600px;margin:0 auto">
        <div class="d-profile__cover" style="height:5rem">
          <div class="d-profile__cover-grid"></div>
          <div class="d-profile__cover-ring"></div>
          <div class="d-profile__cover-ring"></div>
        </div>
        <div class="d-profile__body">
          <div class="d-profile__bar">
            <div class="d-profile__avatar-wrap">
              <div style="width:4.5rem;height:4.5rem;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;flex-shrink:0">${initial}</div>
            </div>
            <div class="d-profile__bar-info">
              <h1 class="d-profile__name">${profileUser.name}</h1>
              <p class="d-profile__email">${profileUser.email}</p>
              <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-top:0.5rem">
                <button class="d-profile__follow-btn" id="js-follow-btn" data-following="${isFollowed}" style="padding:0.5rem 1.25rem;border-radius:999px;border:none;font-weight:700;font-size:0.85rem;cursor:pointer;background:${isFollowed ? 'var(--border-color)' : 'var(--accent)'};color:${isFollowed ? 'var(--text)' : '#fff'};transition:all 0.15s">${isFollowed ? 'Mengikuti' : 'Ikuti'}</button>
                <button class="d-profile__block-btn" id="js-block-btn" data-blocked="${isUserBlocked}" style="padding:0.5rem 1.25rem;border-radius:999px;border:1px solid var(--border-color);font-weight:600;font-size:0.85rem;cursor:pointer;background:transparent;color:${isUserBlocked ? 'var(--accent)' : '#ff3b30'};transition:all 0.15s">${isUserBlocked ? 'Buka blokir' : 'Blokir'}</button>
              </div>
            </div>
            <div class="d-profile__bar-stats">
              <div class="d-profile__stat"><span class="d-profile__stat-value">0</span><span class="d-profile__stat-label">Postingan</span></div>
              <div class="d-profile__stat"><span class="d-profile__stat-value">${followingCount}</span><span class="d-profile__stat-label">Mengikuti</span></div>
              <div class="d-profile__stat"><span class="d-profile__stat-value">${followersCount}</span><span class="d-profile__stat-label">Pengikut</span></div>
            </div>
          </div>

          <div class="d-profile__bio">
            <div class="d-profile__bio-header">
              <span class="d-profile__bio-label">Tentang Saya</span>
            </div>
            <div class="d-profile__bio-text ${otherBio ? '' : 'd-profile__bio-text--empty'}">${otherBio || 'Belum ada bio'}</div>
          </div>
          ${otherInterests.length ? `
          <div class="tm" style="margin-top:1rem">
            <p class="tm__section-title">Learning Interest</p>
            <div class="tm__tags">
              ${otherInterests.map(i => `<span class="tm__tag">${i}</span>`).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    `;

    if (session) {
      const followBtn = el.querySelector('#js-follow-btn');
      const blockBtn = el.querySelector('#js-block-btn');
      const statEls = el.querySelectorAll('.d-profile__stat-value');
      const followersStat = statEls[2];
      const followingStat = statEls[1];
      followBtn.addEventListener('click', () => {
        const nowFollowed = toggleFollowUser(session.email, profileUser.email);
        followBtn.textContent = nowFollowed ? 'Mengikuti' : 'Ikuti';
        followBtn.style.background = nowFollowed ? 'var(--border-color)' : 'var(--accent)';
        followBtn.style.color = nowFollowed ? 'var(--text)' : '#fff';
        followBtn.dataset.following = nowFollowed;
        followersStat.textContent = getFollowersCount(profileUser.email);
        followingStat.textContent = getFollowingCount(profileUser.email);
        window.dispatchEvent(new CustomEvent('follow-update'));
      });
      if (blockBtn) {
        blockBtn.addEventListener('click', () => {
          const nowBlocked = blockBtn.dataset.blocked === 'true';
          if (nowBlocked) {
            unblockUser(session.email, profileUser.email);
            blockBtn.textContent = 'Blokir';
            blockBtn.style.color = '#ff3b30';
            blockBtn.dataset.blocked = 'false';
          } else {
            blockUser(session.email, profileUser.email);
            blockBtn.textContent = 'Buka blokir';
            blockBtn.style.color = 'var(--accent)';
            blockBtn.dataset.blocked = 'true';
          }
        });
      }
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
  const ownFollowingCount = getFollowingCount(session.email);
  const ownFollowersCount = getFollowersCount(session.email);

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
              <span class="d-profile__stat-value">${ownFollowingCount}</span>
              <span class="d-profile__stat-label">Mengikuti</span>
            </div>
            <div class="d-profile__stat">
              <span class="d-profile__stat-value">${ownFollowersCount}</span>
              <span class="d-profile__stat-label">Pengikut</span>
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
          <div class="d-profile__tambah-minat"></div>

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

              <a class="d-profile__menu-item" href="#" data-qr>
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
    bioEl.querySelector('.d-profile__bio-text').addEventListener('click', enterBioEdit);
  }

  bioEditBtn.addEventListener('click', enterBioEdit);
  bioText.addEventListener('click', enterBioEdit);

  const tmContainer = el.querySelector('.d-profile__tambah-minat');
  const tmComponent = TambahMinat({
    interests,
    onChange: (newInterests) => {
      interests = newInterests;
      saveInterests(interests);
    },
  });
  tmContainer.appendChild(tmComponent);

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

  el.querySelector('[data-qr]').addEventListener('click', (e) => {
    e.preventDefault();
    showQrModal({ name: session.name, email: session.email });
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

function renderMobile() {
  const params = getHashParams();
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
    const isUserBlocked = isBlocked(session?.email, profileUser.email);
    const followingCount = getFollowingCount(profileUser.email);
    const followersCount = getFollowersCount(profileUser.email);
    const otherBio = getOtherUserBio(profileUser.email);
    const otherInterests = getOtherUserInterests(profileUser.email);

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
          <button class="m-profile__block-btn" id="js-mobile-block-btn" data-blocked="${isUserBlocked}" style="padding:0.6rem 1rem;border-radius:999px;border:1px solid var(--border-color);font-weight:600;font-size:0.85rem;cursor:pointer;background:transparent;color:${isUserBlocked ? 'var(--accent)' : '#ff3b30'};transition:all 0.15s;white-space:nowrap">${isUserBlocked ? 'Buka blokir' : 'Blokir'}</button>
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
          <div class="mobile-bio__text ${otherBio ? '' : 'mobile-bio__text--empty'}">${otherBio || 'Belum ada bio'}</div>
        </div>
        ${otherInterests.length ? `
        <div class="m-profile__interests" style="margin-top:1rem">
          <p class="m-profile__section-title">Learning Interest</p>
          <div class="m-profile__tags">
            ${otherInterests.map(i => `<span class="m-profile__tag">${i}</span>`).join('')}
          </div>
        </div>
        ` : ''}
      </div>
    `;

    if (session) {
      const followBtn = el.querySelector('#js-follow-btn');
      const blockBtn = el.querySelector('#js-mobile-block-btn');
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
      if (blockBtn) {
        blockBtn.addEventListener('click', () => {
          const nowBlocked = blockBtn.dataset.blocked === 'true';
          if (nowBlocked) {
            unblockUser(session.email, profileUser.email);
            blockBtn.textContent = 'Blokir';
            blockBtn.style.color = '#ff3b30';
            blockBtn.dataset.blocked = 'false';
          } else {
            blockUser(session.email, profileUser.email);
            blockBtn.textContent = 'Buka blokir';
            blockBtn.style.color = 'var(--accent)';
            blockBtn.dataset.blocked = 'true';
          }
        });
      }
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
          ${renderMobileAvatarContent(initial)}
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
    bioSection.querySelector('.mobile-bio__text').addEventListener('click', enterBioEdit);
  }

  bioEditBtn.addEventListener('click', enterBioEdit);
  const bioTextEl = bioSection.querySelector('.mobile-bio__text');
  if (bioTextEl) bioTextEl.addEventListener('click', enterBioEdit);

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

export async function Profile() {
  try {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    return isMobile ? renderMobile() : renderDesktop();
  } catch (err) {
    const el = document.createElement('section');
    el.className = 'd-profile';
    el.innerHTML = `<p style="color:var(--muted);padding:2rem;text-align:center">Gagal memuat halaman: ${err.message}</p>`;
    return el;
  }
}
