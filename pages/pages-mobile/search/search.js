if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

import { searchEngine } from '/js/search.js';

function ResultCard(item) {
  return `
    <a class="mobile-card" href="${item.url}" data-link style="display:block;text-decoration:none;color:inherit">
      <span class="mobile-card__tag">${item.type}</span>
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      ${item.meta ? `<p style="color:var(--muted);font-size:0.82rem;margin-top:0.4rem">${item.meta}</p>` : ''}
    </a>
  `;
}

export async function Search() {
  const res = await fetch('/data/search.json');
  const data = await res.json();

  await searchEngine.init();

  const el = document.createElement('section');
  el.className = 'mobile-page';
  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.header.eyebrow}</p>
        <h1>${data.header.title}</h1>
        <p>${data.header.description}</p>
      </header>
      <div class="mobile-search-box" role="search">
        <input class="mobile-input" type="search" placeholder="${data.placeholder}" autocomplete="off" />
      </div>
      <div class="mobile-search-hint" style="color:var(--muted);font-size:0.85rem;text-align:center;padding:2rem 0">Mulai mengetik untuk mencari konten...</div>
      <div class="mobile-list search-results"></div>
    </div>
  `;

  const input = el.querySelector('.mobile-input');
  const resultsEl = el.querySelector('.search-results');
  const hintEl = el.querySelector('.mobile-search-hint');

  const render = (query) => {
    if (!query.trim()) {
      resultsEl.innerHTML = '';
      hintEl.textContent = 'Mulai mengetik untuk mencari konten...';
      return;
    }

    const results = searchEngine.search(query);

    if (results.length === 0) {
      resultsEl.innerHTML = '';
      hintEl.textContent = 'Tidak ditemukan hasil untuk pencarian ini.';
      return;
    }

    hintEl.textContent = `${results.length} hasil ditemukan`;
    resultsEl.innerHTML = results.map(ResultCard).join('');
  };

  input.addEventListener('input', () => render(input.value));

  return el;
}
