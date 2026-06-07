import { injectStyle } from '../../js/utils/styleLoader.js';
injectStyle('/components/page-header/page-header.css');

function renderAction(action) {
  const { label, href, variant = 'secondary' } = action;
  const className = variant === 'primary' ? 'page-header__action page-header__action--primary' : 'page-header__action';

  return `<a class="${className}" href="${href}" data-link>${label}</a>`;
}

export function PageHeader({ eyebrow = '', title, description = '', actions = [] }) {
  const el = document.createElement('section');
  el.className = 'page-header';

  el.innerHTML = `
    <div class="page-header__copy">
      ${eyebrow ? `<p class="page-header__eyebrow">${eyebrow}</p>` : ''}
      <h1>${title}</h1>
      ${description ? `<p class="page-header__description">${description}</p>` : ''}
    </div>
    ${actions.length ? `<div class="page-header__actions">${actions.map(renderAction).join('')}</div>` : ''}
  `;

  return el;
}
