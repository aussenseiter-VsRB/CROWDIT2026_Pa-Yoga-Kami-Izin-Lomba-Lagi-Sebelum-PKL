// reusable, no id conflicts
// inject styles once (guard against duplicates)
if (!document.querySelector('link[href="/components/card/card.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/components/card/card.css';
  document.head.appendChild(link);
}

// Card({ tag, title, description })
// Can be mounted multiple times on the same page — no id conflicts
export function Card({ tag = '', title, description }) {
  const el = document.createElement('article');
  el.classList.add('card');

  el.innerHTML = `
    ${tag ? `<span class="card-tag">${tag}</span>` : ''}
    <h3 class="card-title">${title}</h3>
    <p class="card-description">${description}</p>
  `;

  // events scoped to THIS instance via el.querySelector
  el.addEventListener('mouseenter', () => {
    el.querySelector('.card-title').style.color = 'var(--accent)';
  });
  el.addEventListener('mouseleave', () => {
    el.querySelector('.card-title').style.color = '';
  });

  return el;
}