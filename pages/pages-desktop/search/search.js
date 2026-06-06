import { searchEngine } from '/js/search.js';

if (!document.querySelector('link[href="/pages/pages-desktop/search/search.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/search/search.css';
  document.head.appendChild(link);
}

function escape(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function highlight(text, query) {
  if (!query) return escape(text);
  const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return escape(text).replace(re, '<mark>$1</mark>');
}

const ICON_MAP = { Forum: 'chat-dots', Grup: 'people', Kursus: 'book' };
const COLOR_MAP = { Forum: 'blue', Grup: 'purple', Kursus: 'green' };

function buildDiscoveryData(index) {
  const tagCounts = {};
  const tagIcons = {};
  index.forEach(doc => {
    const allTags = [doc.category, ...doc.tags].filter(Boolean);
    allTags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
      if (!tagIcons[t]) tagIcons[t] = ICON_MAP[doc.type] || 'file-text';
    });
  });

  const trendingTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label, count, icon: tagIcons[label] || 'fire' }));

  const seen = new Set();
  const suggested = [];
  for (const doc of index) {
    if (suggested.length >= 6) break;
    if (seen.has(doc.title)) continue;
    seen.add(doc.title);
    suggested.push({
      type: doc.type,
      icon: ICON_MAP[doc.type] || 'file-text',
      color: COLOR_MAP[doc.type] || 'blue',
      title: doc.title,
      sub: doc.meta ? `${doc.type === 'Forum' ? 'Forum' : doc.type === 'Grup' ? 'Grup' : 'Kursus'} · ${doc.meta}` : doc.type,
      description: doc.description,
      tags: doc.tags,
      stat: doc.meta || '',
      url: doc.url,
    });
  }
  return { trendingTags, suggested };
}

function TrendingCard(item) {
  return `
    <article class="result-card" data-search="${escape(item.label)}" role="button" tabindex="0">
      <div class="result-card__body" style="display:flex;align-items:center;gap:0.6rem;padding:0.7rem 1rem">
        <div class="result-card__avatar result-card__avatar--blue" style="border-radius:0.5rem;width:1.7rem;height:1.7rem;font-size:0.8rem"><i class="bi bi-${item.icon}"></i></div>
        <div style="flex:1;min-width:0">
          <p class="result-card__title" style="font-size:0.82rem;margin-bottom:0.05rem">${escape(item.label)}</p>
          <p class="result-card__subtitle" style="font-size:0.7rem">${item.count} konten</p>
        </div>
      </div>
    </article>
  `;
}

function SuggestedCard(item) {
  return `
    <a class="result-card" href="${item.url}" data-link>
      <div class="result-card__body">
        <div class="result-card__header">
          <div class="result-card__avatar result-card__avatar--${item.color}"><i class="bi bi-${item.icon}"></i></div>
          <div class="result-card__meta">
            <p class="result-card__title">${escape(item.title)}</p>
            <p class="result-card__subtitle">${escape(item.sub)}</p>
          </div>
        </div>
        <p class="result-card__desc">${escape(item.description)}</p>
        <div class="result-card__footer">
          <div class="result-card__tags">
            ${item.tags.map(t => `<span class="badge">${escape(t)}</span>`).join('')}
          </div>
          <div class="result-card__stat">${escape(item.stat)}</div>
        </div>
      </div>
    </a>
  `;
}

function ResultCard(item, query) {
  const tagClass = item.type === 'Forum' ? '' : item.type === 'Grup' ? 'result-card__tag--group' : 'result-card__tag--course';
  const isOnline = item.stat && item.stat.toLowerCase().includes('online');

  return `
    <a class="result-card" href="${item.url}" data-link>
      <div class="result-card__body">
        <div class="result-card__top">
          <span class="result-card__tag ${tagClass}">${item.type}</span>
          ${item.meta ? `<span class="result-card__meta">${escape(item.meta)}</span>` : ''}
        </div>
        <p class="result-card__title">${highlight(item.title, query)}</p>
        <p class="result-card__desc">${highlight(item.description, query)}</p>
        <div class="result-card__footer">
          <div class="result-card__tags">
            ${(item.tags || []).map(t => {
              const isMatch = query && t.toLowerCase().includes(query.toLowerCase());
              return `<span class="badge${isMatch ? ' badge--match' : ''}">${escape(t)}</span>`;
            }).join('')}
          </div>
          ${item.stat ? `<div class="result-card__stat">${isOnline ? '<span class="status-dot"></span>' : ''}${escape(item.stat)}</div>` : ''}
        </div>
      </div>
    </a>
  `;
}

export async function Search() {
  const [res, _] = await Promise.all([
    fetch('/data/search.json').then(r => r.json()),
    searchEngine.init(),
  ]);
  const data = res;
  const { trendingTags, suggested } = buildDiscoveryData(searchEngine.index);

  const el = document.createElement('section');
  el.className = 'container section';

  const filtersHtml = data.filters.map((f, i) =>
    `<button class="filter-pill${i === 0 ? ' filter-pill--active' : ''}" data-filter="${f}">${f}</button>`
  ).join('');

  el.innerHTML = `
    <div class="search-page">
      <div class="search-page__hero">
        <div class="search-page__hero-copy">
          <p class="search-page__eyebrow">${data.header.eyebrow}</p>
          <h1>${data.header.title}</h1>
          <p class="search-page__desc">${data.header.description}</p>
        </div>
        <div class="search-page__bar">
          <i class="bi bi-search search-page__icon"></i>
          <input class="search-page__input" type="search" placeholder="${data.placeholder}" autocomplete="off" />
          <button class="search-page__clear" aria-label="Hapus pencarian"><i class="bi bi-x"></i></button>
        </div>
      </div>

      <div class="search-page__filters" id="js-filters">${filtersHtml}</div>

      <div id="js-discovery">
        <div class="search-page__section">
          <p class="search-page__section-label">${data.trendingLabel}</p>
          <div class="suggested-grid" id="js-trending"></div>
        </div>
        <div class="search-page__section">
          <p class="search-page__section-label">${data.suggestedLabel}</p>
          <div class="suggested-grid" id="js-suggested"></div>
        </div>
      </div>

      <div id="js-results" hidden>
        <p class="search-page__hint" id="js-results-label"></p>
        <div class="search-page__results" id="js-results-list"></div>
        <div class="search-page__empty" hidden id="js-empty">
          <p class="search-page__empty-icon"><i class="bi bi-search"></i></p>
          <p class="search-page__empty-title">${data.emptyTitle}</p>
          <p class="search-page__empty-sub">${data.emptySub}</p>
        </div>
      </div>
    </div>
  `;

  const input = el.querySelector('.search-page__input');
  const clearBtn = el.querySelector('.search-page__clear');
  const filtersEl = el.querySelector('#js-filters');
  const discovery = el.querySelector('#js-discovery');
  const resultsPanel = el.querySelector('#js-results');
  const resultsList = el.querySelector('#js-results-list');
  const resultsLabel = el.querySelector('#js-results-label');
  const emptyEl = el.querySelector('#js-empty');
  const trendingGrid = el.querySelector('#js-trending');
  const suggestedGrid = el.querySelector('#js-suggested');

  trendingGrid.innerHTML = trendingTags.map(TrendingCard).join('');
  suggestedGrid.innerHTML = suggested.map(SuggestedCard).join('');

  let currentFilter = 'Semua';
  let currentQuery = '';

  const renderResults = () => {
    const q = currentQuery.trim().toLowerCase();
    if (!q) {
      discovery.hidden = false;
      resultsPanel.hidden = true;
      clearBtn.style.display = '';
      return;
    }

    discovery.hidden = true;
    resultsPanel.hidden = false;
    clearBtn.style.display = 'flex';

    const allResults = searchEngine.search(q);
    const filtered = currentFilter === 'Semua'
      ? allResults
      : allResults.filter(r => r.type === currentFilter);

    emptyEl.hidden = filtered.length > 0;
    resultsLabel.textContent = filtered.length
      ? `${filtered.length} hasil untuk "${currentQuery}"`
      : '';
    resultsList.innerHTML = filtered.map(r => ResultCard(r, currentQuery)).join('');
  };

  input.addEventListener('input', () => {
    currentQuery = input.value;
    renderResults();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    currentQuery = '';
    renderResults();
    input.focus();
  });

  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    filtersEl.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('filter-pill--active'));
    btn.classList.add('filter-pill--active');
    currentFilter = btn.dataset.filter;
    if (currentQuery.trim()) renderResults();
  });

  trendingGrid.addEventListener('click', e => {
    const card = e.target.closest('[data-search]');
    if (!card) return;
    input.value = card.dataset.search;
    currentQuery = card.dataset.search;
    renderResults();
    input.focus();
  });

  return el;
}
