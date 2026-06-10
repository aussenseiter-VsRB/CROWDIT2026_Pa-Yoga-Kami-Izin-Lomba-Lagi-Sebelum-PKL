import { injectStyle } from '../../../../js/utils/styleLoader.js';
import { icon, sectionIcons, sectionKey } from '../settings-shared.js';

injectStyle('/features/profile/settings/sidebar/sidebar.css');

export function Sidebar({ sections, activeKey, onSwitch }) {
  const el = document.createElement('div');

  const sidebarLinks = sections.map(s => `
    <a href="#" class="m-settings__sidebar-link${sectionKey(s.title) === activeKey ? ' m-settings__sidebar-link--active' : ''}" data-section="${sectionKey(s.title)}">
      ${icon(sectionIcons[sectionKey(s.title)] || 'gear')}
      ${s.title}
    </a>
  `).join('');

  const tabLinks = sections.map(s => `
    <button class="m-settings__tab${sectionKey(s.title) === activeKey ? ' m-settings__tab--active' : ''}" data-section="${sectionKey(s.title)}">
      ${icon(sectionIcons[sectionKey(s.title)] || 'gear')}
      ${s.title}
    </button>
  `).join('');

  el.innerHTML = `
    <aside class="m-settings__sidebar" id="settings-sidebar">
      ${sidebarLinks}
    </aside>
    <div class="m-settings__tabs" id="settings-tabs">
      ${tabLinks}
    </div>
  `;

  el.querySelectorAll('.m-settings__sidebar-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      onSwitch(link.dataset.section);
    });
  });

  el.querySelectorAll('.m-settings__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      onSwitch(tab.dataset.section);
    });
  });

  function setActive(key) {
    el.querySelectorAll('.m-settings__sidebar-link').forEach(l =>
      l.classList.toggle('m-settings__sidebar-link--active', l.dataset.section === key)
    );
    el.querySelectorAll('.m-settings__tab').forEach(t =>
      t.classList.toggle('m-settings__tab--active', t.dataset.section === key)
    );
  }

  return { element: el, setActive };
}
