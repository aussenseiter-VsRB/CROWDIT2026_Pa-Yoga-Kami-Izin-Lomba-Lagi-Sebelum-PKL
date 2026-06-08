import { injectStyle } from '../../../js/utils/styleLoader.js';
injectStyle('/components/ui/card/card.css');

export function Card({ tag = '', title, description, footer = '' }) {
  const el = document.createElement('article');
  el.classList.add('card');

  el.innerHTML = `
    ${tag ? `<span class="card-tag">${tag}</span>` : ''}
    <h3 class="card-title">${title}</h3>
    <p class="card-description">${description}</p>
    ${footer ? `<div class="card-footer">${footer}</div>` : ''}
  `;

  return el;
}
