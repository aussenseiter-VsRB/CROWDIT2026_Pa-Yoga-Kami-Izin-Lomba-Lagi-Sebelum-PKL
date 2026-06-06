import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { searchEngine } from '/js/search.js';

if (!document.querySelector('link[href="/pages/pages-desktop/search/search.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/search/search.css';
  document.head.appendChild(link);
}

function ResultCard(item) {
  const tagClass = item.type === 'Forum' ? '' : item.type === 'Grup' ? 'result-card__tag--group' : 'result-card__tag--course';

  return `
    <a class="result-card" href="${item.url}" data-link>
      <div class="result-card__top">
        <span class="result-card__tag ${tagClass}">${item.type}</span>
        ${item.meta ? `<span class="result-card__meta">${item.meta}</span>` : ''}
      </div>
      <h3 class="result-card__title">${item.title}</h3>
      <p class="result-card__desc">${item.description}</p>
    </a>
  `;
}

export async function Search() {
  const res = await fetch('/data/search.json');
  const data = await res.json();

  await searchEngine.init();

  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <div class="desktop-page">
      <div class="desktop-page__header"></div>
      <div class="search-page">
        <div class="search-page__bar">
          <svg class="search-page__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input class="search-page__input" type="search" placeholder="${data.placeholder}" autocomplete="off" />
        </div>
        <div class="search-page__hint">Mulai mengetik untuk mencari konten...</div>
        <div class="search-page__results"></div>
      </div>
    </div>
  `;

  el.querySelector('.desktop-page__header').appendChild(
    PageHeader(data.header),
  );

  const input = el.querySelector('.search-page__input');
  const resultsEl = el.querySelector('.search-page__results');
  const hintEl = el.querySelector('.search-page__hint');

  const render = (query) => {
    if (!query.trim()) {
      resultsEl.innerHTML = '';
      hintEl.textContent = 'Mulai mengetik untuk mencari konten...';
      return;
    }

    const results = searchEngine.search(query);

    if (results.length === 0) {
      resultsEl.innerHTML = '<div class="search-page__empty">Tidak ditemukan hasil untuk pencarian ini.</div>';
      hintEl.textContent = '';
      return;
    }

    hintEl.textContent = `${results.length} hasil ditemukan`;
    resultsEl.innerHTML = results.map(ResultCard).join('');
  };

  input.addEventListener('input', () => render(input.value));

  return el;
}
