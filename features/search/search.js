import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { searchEngine } from '../../js/search.js';

injectStyle('/css/_shared.css');
injectStyle('/features/search/search.css');

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
      sub: doc.meta ? `${doc.type === 'Forum' ? 'Forum' : doc.type === 'Grup' ? 'Grup' : 'Kursus'} \u00B7 ${doc.meta}` : doc.type,
      description: doc.description,
      tags: doc.tags,
      stat: doc.meta || '',
      url: doc.url,
    });
  }
  return { trendingTags, suggested };
}

function TrendingCard(item, isMobile) {
  if (isMobile) {
    return `
      <article class="mobile-card search-card" data-search="${escape(item.label)}" role="button" tabindex="0" style="cursor:pointer;padding:0.6rem 0.8rem">
        <div style="display:flex;align-items:center;gap:0.55rem">
          <div style="width:1.6rem;height:1.6rem;border-radius:0.45rem;display:flex;align-items:center;justify-content:center;font-size:0.75rem;flex-shrink:0;background:var(--surface-alt)"><i class="bi bi-${item.icon}"></i></div>
          <div style="flex:1;min-width:0">
            <p style="margin:0;font-size:0.82rem;font-weight:700;line-height:1.3">${escape(item.label)}</p>
            <p style="margin:0;color:var(--muted-alt);font-size:0.68rem">${item.count} konten</p>
          </div>
        </div>
      </article>
    `;
  }
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

function SuggestedCard(item, isMobile) {
  if (isMobile) {
    return `
      <a class="mobile-card search-card" href="${item.url}" data-link style="display:block;text-decoration:none;color:inherit">
        <div style="display:flex;align-items:flex-start;gap:0.7rem;margin-bottom:0.5rem">
          <div style="width:2.4rem;height:2.4rem;border-radius:0.7rem;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;background:var(--surface-alt)">
            <i class="bi bi-${item.icon}"></i>
          </div>
          <div style="flex:1;min-width:0">
            <p style="margin:0;font-size:0.95rem;font-weight:700;line-height:1.3">${escape(item.title)}</p>
            <p style="margin:0;color:var(--muted-alt);font-size:0.78rem;font-weight:500">${escape(item.sub)}</p>
          </div>
        </div>
        <p style="margin:0 0 0.5rem;color:var(--muted-alt);font-size:0.88rem;line-height:1.5">${escape(item.description)}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:0.5rem;border-top:0.5px solid var(--surface-hover)">
          <div style="display:flex;gap:0.35rem;flex-wrap:wrap">
            ${item.tags.map(t => `<span style="padding:0.1rem 0.5rem;border-radius:6px;background:var(--surface-alt);color:var(--muted);font-size:0.68rem;font-weight:700">${escape(t)}</span>`).join('')}
          </div>
          <span style="color:var(--muted-alt);font-size:0.72rem;font-weight:600;flex-shrink:0">${escape(item.stat)}</span>
        </div>
      </a>
    `;
  }
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

function ResultCard(item, query, isMobile) {
  if (isMobile) {
    const isOnline = item.stat && item.stat.toLowerCase().includes('online');
    return `
      <a class="mobile-card search-card" href="${item.url}" data-link style="display:block;text-decoration:none;color:inherit">
        <span class="mobile-card__tag">${item.type}</span>
        ${item.meta ? `<p style="color:var(--muted-alt);font-size:0.78rem;margin:0.3rem 0 0.5rem">${escape(item.meta)}</p>` : ''}
        <h2>${highlight(item.title, query)}</h2>
        <p>${highlight(item.description, query)}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:0.5rem;padding-top:0.5rem;border-top:0.5px solid var(--surface-hover)">
          <div style="display:flex;gap:0.35rem;flex-wrap:wrap">
            ${(item.tags || []).map(t => {
              const isMatch = query && t.toLowerCase().includes(query.toLowerCase());
              return `<span style="padding:0.1rem 0.5rem;border-radius:6px;background:var(--surface-alt);color:${isMatch ? 'var(--accent)' : 'var(--muted)'};font-size:0.68rem;font-weight:700">${escape(t)}</span>`;
            }).join('')}
          </div>
          ${item.stat ? `<span style="display:flex;align-items:center;gap:0.25rem;color:var(--muted-alt);font-size:0.72rem;font-weight:600;flex-shrink:0">${isOnline ? '<span style="width:6px;height:6px;border-radius:50%;background:#34c759;display:inline-block"></span>' : ''}${escape(item.stat)}</span>` : ''}
        </div>
      </a>
    `;
  }
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

function renderDesktop(data) {
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

  trendingGrid.innerHTML = trendingTags.map(t => TrendingCard(t, false)).join('');
  suggestedGrid.innerHTML = suggested.map(s => SuggestedCard(s, false)).join('');

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
    resultsList.innerHTML = filtered.map(r => ResultCard(r, currentQuery, false)).join('');
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

function renderMobile(data) {
  if (!document.querySelector('style[data-search-mobile]')) {
    const s = document.createElement('style');
    s.setAttribute('data-search-mobile', '');
    s.textContent = `
      .filter-pill {
        flex-shrink:0; padding:0.4rem 0.85rem; border-radius:999px; border:none;
        background:var(--surface-alt); color:var(--muted); font:inherit;
        font-size:0.8rem; font-weight:700; cursor:pointer;
        transition: background 0.15s, color 0.15s;
      }
      .filter-pill--active { background:var(--accent-alt); color:#fff; }
      .search-page__clear { display:none; align-items:center; justify-content:center; }
      .search-page__filters::-webkit-scrollbar { display:none; }
      .mobile-input:focus { border-color:var(--accent) !important; box-shadow:0 0 0 3px rgba(0,122,255,0.12),0 4px 16px rgba(0,122,255,0.08) !important; outline:none; }
      mark { background: rgba(0,122,255,0.2); color: inherit; border-radius: 2px; padding: 0 2px; }
      .search-card { transition: transform 0.15s ease; }
      .search-card:active { transform: scale(0.985); }
    `;
    document.head.appendChild(s);
  }

  const { trendingTags, suggested } = buildDiscoveryData(searchEngine.index);

  const el = document.createElement('section');
  el.className = 'mobile-page';

  const filtersHtml = data.filters.map((f, i) =>
    `<button class="filter-pill${i === 0 ? ' filter-pill--active' : ''}" data-filter="${f}">${f}</button>`
  ).join('');

  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.header.eyebrow}</p>
        <h1>${data.header.title}</h1>
        <p>${data.header.description}</p>
      </header>

      <div class="mobile-search-box" role="search" style="position:relative">
        <i class="bi bi-search" style="position:absolute;left:0.85rem;top:50%;transform:translateY(-50%);font-size:1.15rem;color:var(--accent);opacity:0.6;pointer-events:none;z-index:1"></i>
        <input class="mobile-input" type="search" placeholder="${data.placeholder}" autocomplete="off" style="padding:0 2.8rem 0 2.6rem;min-height:3.2rem;border:2px solid rgba(0,122,255,0.12);border-radius:999px;background:var(--surface);font-size:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.04),inset 0 1px 2px rgba(0,0,0,0.02)" />
        <button class="search-page__clear" aria-label="Hapus pencarian" style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);width:1.6rem;height:1.6rem;border:none;border-radius:50%;background:var(--surface-dim);color:var(--muted);font-size:0.7rem;font-weight:700;cursor:pointer;opacity:0.8;z-index:1;display:none"><i class="bi bi-x"></i></button>
      </div>

      <div class="search-page__filters" id="js-filters" style="display:flex;gap:0.5rem;margin-bottom:1.2rem;overflow-x:auto;scrollbar-width:none">${filtersHtml}</div>

      <div id="js-discovery">
        <div class="search-page__section" style="margin-bottom:1.2rem">
          <p class="search-page__section-label" style="margin-bottom:0.6rem;color:var(--muted);font-size:0.7rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase">${data.trendingLabel}</p>
          <div class="mobile-list" id="js-trending"></div>
        </div>
        <div class="search-page__section" style="margin-bottom:1.2rem">
          <p class="search-page__section-label" style="margin-bottom:0.6rem;color:var(--muted);font-size:0.7rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase">${data.suggestedLabel}</p>
          <div class="mobile-list" id="js-suggested"></div>
        </div>
      </div>

      <div id="js-results" hidden>
        <p class="mobile-search-hint" id="js-results-label" style="color:var(--muted);font-size:0.85rem;text-align:center;padding:0.5rem 0"></p>
        <div class="mobile-list" id="js-results-list"></div>
        <div class="search-page__empty" hidden id="js-empty" style="text-align:center;padding:3rem 0">
          <p style="font-size:2.5rem;opacity:0.25;margin-bottom:0.5rem"><i class="bi bi-search"></i></p>
          <p style="color:var(--muted);font-size:1rem;font-weight:700;margin-bottom:0.25rem">${data.emptyTitle}</p>
          <p style="color:var(--muted-alt);font-size:0.85rem">${data.emptySub}</p>
        </div>
      </div>
    </div>
  `;

  const input = el.querySelector('.mobile-input');
  const clearBtn = el.querySelector('.search-page__clear');
  const filtersEl = el.querySelector('#js-filters');
  const discovery = el.querySelector('#js-discovery');
  const resultsPanel = el.querySelector('#js-results');
  const resultsList = el.querySelector('#js-results-list');
  const resultsLabel = el.querySelector('#js-results-label');
  const emptyEl = el.querySelector('#js-empty');
  const trendingGrid = el.querySelector('#js-trending');
  const suggestedGrid = el.querySelector('#js-suggested');

  trendingGrid.innerHTML = trendingTags.map(t => TrendingCard(t, true)).join('');
  suggestedGrid.innerHTML = suggested.map(s => SuggestedCard(s, true)).join('');

  let currentFilter = 'Semua';
  let currentQuery = '';

  const renderResults = () => {
    const q = currentQuery.trim().toLowerCase();
    if (!q) {
      discovery.hidden = false;
      resultsPanel.hidden = true;
      clearBtn.style.display = 'none';
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
    resultsList.innerHTML = filtered.map(r => ResultCard(r, currentQuery, true)).join('');
  };

  input.addEventListener('input', () => {
    currentQuery = input.value;
    renderResults();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    currentQuery = '';
    input.focus();
    renderResults();
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

export async function Search() {
  const el = document.createElement('section');
  el.style.padding = '3rem 0';
  el.style.textAlign = 'center';
  el.innerHTML = `<p style="color:var(--muted)"><i class="bi bi-arrow-repeat"></i> Memuat...</p>`;

  try {
    await searchEngine.init();
    const data = await fetchData('/data/search.json');

    const isMobile = window.innerWidth <= 900;
    const pageEl = isMobile ? renderMobile(data) : renderDesktop(data);
    el.replaceWith(pageEl);
    return pageEl;
  } catch (err) {
    el.innerHTML = `<p style="color:var(--accent-2);font-weight:600">Gagal memuat halaman pencarian.</p>`;
    return el;
  }
}
