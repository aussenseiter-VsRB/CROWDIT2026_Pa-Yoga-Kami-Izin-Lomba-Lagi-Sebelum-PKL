import { injectStyle } from '../../../js/utils/styleLoader.js';
import { fetchData } from '../../../js/utils/api.js';
import { isAuthenticated, navigateAfterAuth } from '../../../js/services/auth.js';
import { navigateTo } from '../../../js/utils/url.js';
import { DATA_PATHS } from '../../../js/core/config.js';
import { sectionKey } from './settings-shared.js';
import { Sidebar } from './sidebar/sidebar.js';
import { ContentPanel } from './content-area/content.js';

injectStyle('/features/profile/settings/css/settings.css');
injectStyle('/features/profile/settings/css/_settings-toggle.css');

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
      <button class="m-settings__back" type="button" aria-label="Kembali"><i class="bi bi-arrow-left"></i></button>
      <h1 class="m-settings__title">${data.header.title}</h1>
    </div>
    <div class="m-settings__layout" id="settings-layout"></div>
    <div class="m-settings__version">${data.version}</div>
  `;

  el.querySelector('.m-settings__back').addEventListener('click', () => navigateTo('/profile'));

  const layout = el.querySelector('#settings-layout');

  const firstKey = sectionKey(data.sections[0].title);

  const sidebar = Sidebar({ sections: data.sections, activeKey: firstKey, onSwitch });
  layout.appendChild(sidebar.element);

  const panel = document.createElement('div');
  panel.className = 'm-settings__panel';
  const contentPanel = ContentPanel();
  panel.appendChild(contentPanel.element);
  layout.appendChild(panel);

  window.addEventListener('theme-change', (e) => {
    const cb = el.querySelector('#settings-dark-mode');
    if (cb) cb.checked = e.detail === 'dark';
  });

  function onSwitch(key) {
    const section = data.sections.find(s => sectionKey(s.title) === key);
    if (!section) return;
    sidebar.setActive(key);
    contentPanel.render(section);
  }

  contentPanel.render(data.sections[0]);

  return el;
}
