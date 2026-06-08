import { injectStyle } from '../../../js/utils/styleLoader.js';
import { fetchData } from '../../../js/utils/api.js';
import { isAuthenticated, navigateAfterAuth } from '../../../js/services/auth.js';
import { navigateTo } from '../../../js/utils/url.js';
import { getTheme, toggleTheme } from '../../../js/core/theme.js';
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../../js/core/config.js';

injectStyle('/features/profile/settings/css/settings.css');
injectStyle('/features/profile/settings/css/_settings-toggle.css');

function icon(name) {
  const map = {
    'arrow-left': 'bi-arrow-left', 'bell': 'bi-bell', 'lock': 'bi-lock',
    'moon': 'bi-moon', 'globe2': 'bi-globe2', 'trash': 'bi-trash',
    'chevron-right': 'bi-chevron-right', 'shield-check': 'bi-shield-check',
  };
  return `<i class="bi ${map[name] || 'bi-' + name}"></i>`;
}

function iconColor(style) {
  const map = { blue: '#007aff', orange: '#ff9f0a', purple: '#5856d6', green: '#34c759', gray: '#8e8e93', red: '#ff3b30' };
  return map[style] || '#8e8e93';
}

export async function Settings() {
  if (!isAuthenticated()) {
    navigateAfterAuth('/login');
    return document.createElement('section');
  }

  const data = await fetchData(DATA_PATHS.SETTINGS);
  const el = document.createElement('section');
  el.className = 'm-settings';

  el.innerHTML = `
    <div class="m-settings__header">
      <button class="m-settings__back" type="button" aria-label="Kembali">${icon('arrow-left')}</button>
      <h1 class="m-settings__title">${data.header.title}</h1>
    </div>

    ${data.sections.map(section => `
      <div class="m-settings__section">
        <p class="m-settings__section-title">${section.title}</p>
        <div class="m-settings__card">
          ${section.items.map(item => {
            const bg = iconColor(item.iconStyle);
            if (item.type === 'toggle') {
              return `
                <label class="m-settings__item">
                  <span class="m-settings__item-icon" style="background:${bg}">${icon(item.icon)}</span>
                  <span class="m-settings__item-body">
                    <span class="m-settings__item-label">${item.label}</span>
                    <span class="m-settings__item-desc">${item.desc}</span>
                  </span>
                  <span class="m-settings__toggle">
                    <input type="checkbox" ${item.defaultChecked ? 'checked' : ''} />
                    <span class="m-settings__toggle-slider"></span>
                  </span>
                </label>
              `;
            }
            if (item.type === 'toggle-theme') {
              return `
                <label class="m-settings__item">
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
                <button class="m-settings__item" type="button" id="js-delete-account">
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
              <button class="m-settings__item" type="button">
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
    `).join('')}

    <p style="text-align:center;font-size:0.75rem;color:var(--muted-alt);margin-top:2rem">${data.version}</p>
  `;

  el.querySelector('.m-settings__back').addEventListener('click', () => navigateTo('/profile'));

  const darkToggle = el.querySelector('#settings-dark-mode');
  if (darkToggle) {
    darkToggle.checked = getTheme() === 'dark';
    darkToggle.addEventListener('change', toggleTheme);
  }

  const deleteBtn = el.querySelector('#js-delete-account');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm(data.confirmDelete)) {
        localStorage.clear();
        sessionStorage.clear();
        navigateTo('/');
      }
    });
  }

  return el;
}
