import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';

injectStyle('/css/_shared.css');
injectStyle('/features/about/about.css');
import { PageHeader } from '../../components/page-header/page-header.js';
import { Card } from '../../components/card/card.js';

function renderDesktop(data) {
  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = `
    <div class="desktop-page">
      <div class="desktop-page__header"></div>
      <div class="card-grid desktop-page__grid"></div>
    </div>
  `;
  el.querySelector('.desktop-page__header').appendChild(PageHeader(data.header));
  const grid = el.querySelector('.desktop-page__grid');
  data.cards.forEach((card) => { grid.appendChild(Card(card)); });
  return el;
}

function renderMobile(data) {
  const el = document.createElement('section');
  el.className = 'mobile-page';
  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.header.eyebrow}</p>
        <h1>${data.header.title}</h1>
        <p>${data.header.description}</p>
        <div class="mobile-page__actions">
          ${(data.header.actions || []).map(action => `
            <a class="mobile-page__action is-${action.variant}" href="${action.href}" data-link>${action.label}</a>
          `).join('')}
        </div>
      </header>
      <div class="mobile-list">
        ${data.cards.map((card) => `
          <article class="mobile-card" style="display:flex;align-items:flex-start;gap:0.75rem">
            <span style="flex:0 0 auto;width:2.2rem;height:2.2rem;border-radius:0.55rem;background:var(--surface-alt);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.05rem">${card.title.charAt(0)}</span>
            <div style="flex:1;min-width:0">
              <span class="mobile-card__tag" style="margin-bottom:0.4rem">${card.tag}</span>
              <h2 style="font-size:1rem">${card.title}</h2>
              <p>${card.description}</p>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
  return el;
}

export async function About() {
  const isMobile = window.innerWidth <= 900;
  const data = await fetchData('/features/about/about.json');
  return isMobile ? renderMobile(data) : renderDesktop(data);
}
