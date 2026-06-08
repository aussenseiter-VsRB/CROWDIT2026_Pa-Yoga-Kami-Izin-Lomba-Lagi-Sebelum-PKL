import { injectStyle } from '../../../../js/utils/styleLoader.js';
import { icon, iconColor, sectionKey } from '../settings-shared.js';
import { getTheme, setTheme } from '../../../../js/core/theme.js';
import { STORAGE_KEYS } from '../../../../js/core/config.js';
import { getSession, logout } from '../../../../js/services/auth.js';
import { navigateTo } from '../../../../js/utils/url.js';
import { showConfirmModal } from '../../../../components/ui/confirm-modal/confirm-modal.js';

injectStyle('/features/profile/settings/content-area/content.css');

const NOTIF_PREFIX = 'studnow_setting_notif_';

function getNotifSetting(key, defaultVal) {
  const v = localStorage.getItem(NOTIF_PREFIX + key);
  return v !== null ? v === 'true' : defaultVal;
}

function setNotifSetting(key, val) {
  localStorage.setItem(NOTIF_PREFIX + key, String(val));
}

function showToast(message) {
  const existing = document.querySelector('.m-settings__toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'm-settings__toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('m-settings__toast--visible'));
  setTimeout(() => {
    toast.classList.remove('m-settings__toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function showSettingsModal(title, bodyHtml) {
  const existing = document.querySelector('.m-settings__modal-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'm-settings__modal-overlay';
  overlay.innerHTML = `
    <div class="m-settings__modal">
      <div class="m-settings__modal-header">
        <h3 class="m-settings__modal-title">${title}</h3>
        <button class="m-settings__modal-close" type="button" aria-label="Tutup"><i class="bi bi-x"></i></button>
      </div>
      <div class="m-settings__modal-body">${bodyHtml}</div>
    </div>
  `;
  const close = () => overlay.remove();
  overlay.querySelector('.m-settings__modal-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.body.appendChild(overlay);
}

function renderSectionHTML(section) {
  return `
    <div class="m-settings__section" data-section="${sectionKey(section.title)}">
      <p class="m-settings__section-title">${section.title}</p>
      <div class="m-settings__card">
        ${section.items.map(item => {
          const bg = iconColor(item.iconStyle);
          const isDanger = item.type === 'delete';
          const itemClass = `m-settings__item${isDanger ? ' m-settings__item--danger' : ''}`;
          if (item.type === 'toggle') {
            const sk = item.label.toLowerCase().replace(/\s+/g, '_');
            const stored = getNotifSetting(sk, item.defaultChecked);
            return `
              <label class="${itemClass}">
                <span class="m-settings__item-icon" style="background:${bg}">${icon(item.icon)}</span>
                <span class="m-settings__item-body">
                  <span class="m-settings__item-label">${item.label}</span>
                  <span class="m-settings__item-desc">${item.desc}</span>
                </span>
                <span class="m-settings__toggle">
                  <input type="checkbox" data-setting-key="${sk}" ${stored ? 'checked' : ''} />
                  <span class="m-settings__toggle-slider"></span>
                </span>
              </label>
            `;
          }
          if (item.type === 'toggle-theme') {
            return `
              <label class="${itemClass}">
                <span class="m-settings__item-icon" style="background:${bg}">${icon(item.icon)}</span>
                <span class="m-settings__item-body">
                  <span class="m-settings__item-label">${item.label}</span>
                  <span class="m-settings__item-desc">${item.desc}</span>
                </span>
                <span class="m-settings__toggle">
                  <input type="checkbox" id="settings-dark-mode" />
                  <span class="m-settings__toggle-slider"></span>
                </span>
              </label>
            `;
          }
          if (item.type === 'delete') {
            return `
              <button class="${itemClass}" type="button" id="js-delete-account">
                <span class="m-settings__item-icon" style="background:${bg}">${icon(item.icon)}</span>
                <span class="m-settings__item-body">
                  <span class="m-settings__item-label">${item.label}</span>
                  <span class="m-settings__item-desc">${item.desc}</span>
                </span>
                <span class="m-settings__item-chevron">${icon('chevron-right')}</span>
              </button>
            `;
          }
          return `
            <button class="${itemClass}" type="button" data-action="link" data-label="${item.label}">
              <span class="m-settings__item-icon" style="background:${bg}">${icon(item.icon)}</span>
              <span class="m-settings__item-body">
                <span class="m-settings__item-label">${item.label}</span>
                <span class="m-settings__item-desc">${item.desc}</span>
              </span>
              <span class="m-settings__item-chevron">${icon('chevron-right')}</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function attachItemListeners(container) {
  const darkToggle = container.querySelector('#settings-dark-mode');
  if (darkToggle) {
    darkToggle.checked = getTheme() === 'dark';
    darkToggle.addEventListener('change', () => {
      setTheme(darkToggle.checked ? 'dark' : 'light');
      showToast(darkToggle.checked ? 'Mode gelap diaktifkan' : 'Mode terang diaktifkan');
    });
  }

  container.querySelectorAll('[data-setting-key]').forEach(input => {
    input.addEventListener('change', () => {
      setNotifSetting(input.dataset.settingKey, input.checked);
      showToast(input.checked ? 'Notifikasi diaktifkan' : 'Notifikasi dinonaktifkan');
    });
  });

  container.querySelectorAll('[data-action="link"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.dataset.label;
      if (label === 'Privasi') {
        const current = localStorage.getItem(STORAGE_KEYS.PRIVACY) || 'public';
        const isPublic = current === 'public';
        showSettingsModal('Privasi', `
          <p style="margin:0 0 1rem;color:var(--muted);font-size:0.9rem;line-height:1.5">
            Kontrol visibilitas dan data privasi akun Anda.
          </p>
          <label class="m-settings__modal-item">
            <span class="m-settings__modal-item-body">
              <span class="m-settings__modal-item-label">Profil Publik</span>
              <span class="m-settings__modal-item-desc">Semua pengguna dapat melihat profil Anda</span>
            </span>
            <span class="m-settings__toggle">
              <input type="checkbox" id="privacy-toggle" ${isPublic ? 'checked' : ''} />
              <span class="m-settings__toggle-slider"></span>
            </span>
          </label>
          <label class="m-settings__modal-item">
            <span class="m-settings__modal-item-body">
              <span class="m-settings__modal-item-label">Tampilkan Status Online</span>
              <span class="m-settings__modal-item-desc">Perlihatkan saat Anda sedang aktif</span>
            </span>
            <span class="m-settings__toggle">
              <input type="checkbox" id="online-toggle" checked />
              <span class="m-settings__toggle-slider"></span>
            </span>
          </label>
        `);
        setTimeout(() => {
          const privacyInput = document.getElementById('privacy-toggle');
          if (privacyInput) {
            privacyInput.addEventListener('change', () => {
              localStorage.setItem(STORAGE_KEYS.PRIVACY, privacyInput.checked ? 'public' : 'private');
              showToast(privacyInput.checked ? 'Profil menjadi publik' : 'Profil menjadi pribadi');
            });
          }
        }, 0);
      } else if (label === 'Bahasa') {
        showSettingsModal('Bahasa', `
          <p style="margin:0 0 1rem;color:var(--muted);font-size:0.9rem;line-height:1.5">
            Pilih bahasa tampilan aplikasi.
          </p>
          <div class="m-settings__modal-list">
            <button class="m-settings__modal-option m-settings__modal-option--active" data-lang="id" type="button">
              <span class="m-settings__modal-option-label">Bahasa Indonesia</span>
              <span class="m-settings__modal-option-check"><i class="bi bi-check-lg"></i></span>
            </button>
            <button class="m-settings__modal-option" data-lang="en" type="button">
              <span class="m-settings__modal-option-label">English</span>
              <span class="m-settings__modal-option-check"></span>
            </button>
          </div>
        `);
        setTimeout(() => {
          const modalOverlay = document.querySelector('.m-settings__modal-overlay');
          if (!modalOverlay) return;
          modalOverlay.querySelectorAll('.m-settings__modal-option').forEach(opt => {
            opt.addEventListener('click', () => {
              modalOverlay.querySelectorAll('.m-settings__modal-option').forEach(o => o.classList.remove('m-settings__modal-option--active'));
              opt.classList.add('m-settings__modal-option--active');
              opt.querySelector('.m-settings__modal-option-check').innerHTML = '<i class="bi bi-check-lg"></i>';
              const lang = opt.dataset.lang === 'id' ? 'Indonesia' : 'English';
              showToast('Bahasa: ' + lang);
            });
          });
        }, 0);
      }
    });
  });

  const deleteBtn = container.querySelector('#js-delete-account');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      showConfirmModal({
        title: 'Hapus Akun',
        message: 'Apakah Anda yakin ingin menghapus akun? Semua data Anda akan dihapus permanen dan tidak dapat dikembalikan.',
        confirmText: 'Hapus Akun',
        cancelText: 'Batal',
        onConfirm: () => {
          const session = getSession();
          if (session) {
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
            const filtered = users.filter(u => u.email !== session.email);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
          }
          logout();
          navigateTo('/');
        }
      });
    });
  }
}

export function ContentPanel() {
  const el = document.createElement('div');
  el.className = 'm-settings__content';
  el.id = 'settings-content';

  function render(section) {
    el.innerHTML = renderSectionHTML(section);
    attachItemListeners(el);
  }

  return { element: el, render };
}
