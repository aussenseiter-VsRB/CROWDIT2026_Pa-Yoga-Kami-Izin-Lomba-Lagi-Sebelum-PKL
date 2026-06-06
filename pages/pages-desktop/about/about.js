import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { Card } from '/components/desktop/card/card.js';

export async function About() {
  const res = await fetch('/data/about.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <div class="desktop-page">
      <div class="desktop-page__header"></div>
      <div class="card-grid desktop-page__grid"></div>
    </div>
  `;

  el.querySelector('.desktop-page__header').appendChild(
    PageHeader(data.header),
  );

  const grid = el.querySelector('.desktop-page__grid');
  data.cards.forEach((card) => {
    grid.appendChild(Card(card));
  });

  return el;
}
