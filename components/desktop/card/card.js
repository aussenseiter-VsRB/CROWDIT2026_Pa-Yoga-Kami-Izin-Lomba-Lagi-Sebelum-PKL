if (!document.querySelector('link[href="/components/desktop/card/card.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/components/desktop/card/card.css';
  document.head.appendChild(link);
}

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
