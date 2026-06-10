import { isAuthenticated } from '../../../js/services/auth.js';
import { GroupCard, mGroupCard, Hero } from './_cards.js';

export function renderDesktop(data) {
  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <div class="desktop-page">
      ${Hero(data.hero)}
      <div class="grp-grid" id="groups"></div>
    </div>
  `;

  const grid = el.querySelector('.grp-grid');
  grid.innerHTML = data.groups.map((g, i) => GroupCard(g, i)).join('');

  return el;
}

export function renderMobile(data) {
  const el = document.createElement('section');
  el.className = 'mobile-page';

  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.hero.eyebrow}</p>
        <h1>${data.hero.title}</h1>
        <p>${data.hero.description}</p>
        <div class="mobile-page__actions">
          ${data.hero.actions.map(action => {
            if (action.label === 'Buat Grup Baru') {
              return `<a class="mobile-page__action is-${action.variant}" href="#" data-create-group>${action.label}</a>`;
            }
            const label = !isAuthenticated() && action.href === '/signup' ? 'Sign up' : action.label;
            return `<a class="mobile-page__action is-${action.variant}" href="${action.href}" data-link>${label}</a>`;
          }).join('')}
        </div>
      </header>
      <div class="mobile-list">
        ${data.groups.map((g, i) => mGroupCard(g, i)).join('')}
      </div>
    </div>
  `;

  return el;
}
