import { searchEngine } from '../../../js/services/search.js';
import { buildDiscoveryData } from './_utils.js';
import { TrendingCard, SuggestedCard } from './_cards.js';
import { bindSearchHandlers } from './_handlers.js';

export function renderDesktop(data) {
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

  bindSearchHandlers({
    input: el.querySelector('.search-page__input'),
    clearBtn: el.querySelector('.search-page__clear'),
    filtersEl: el.querySelector('#js-filters'),
    discovery: el.querySelector('#js-discovery'),
    resultsPanel: el.querySelector('#js-results'),
    resultsList: el.querySelector('#js-results-list'),
    resultsLabel: el.querySelector('#js-results-label'),
    emptyEl: el.querySelector('#js-empty'),
    trendingGrid: el.querySelector('#js-trending'),
    suggestedGrid: el.querySelector('#js-suggested'),
    trendingTags: trendingTags.map(t => TrendingCard(t)),
    suggested: suggested.map(s => SuggestedCard(s)),
  });

  return el;
}

export function renderMobile(data) {
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

      <div class="mobile-search-box" role="search">
        <i class="bi bi-search search-page__icon"></i>
        <input class="mobile-input" type="search" placeholder="${data.placeholder}" autocomplete="off" />
        <button class="search-page__clear" aria-label="Hapus pencarian"><i class="bi bi-x"></i></button>
      </div>

      <div class="search-page__filters" id="js-filters">${filtersHtml}</div>

      <div id="js-discovery">
        <div class="search-page__section">
          <p class="search-page__section-label">${data.trendingLabel}</p>
          <div class="mobile-list" id="js-trending"></div>
        </div>
        <div class="search-page__section">
          <p class="search-page__section-label">${data.suggestedLabel}</p>
          <div class="mobile-list" id="js-suggested"></div>
        </div>
      </div>

      <div id="js-results" hidden>
        <p class="search-page__hint" id="js-results-label"></p>
        <div class="mobile-list" id="js-results-list"></div>
        <div class="search-page__empty" hidden id="js-empty">
          <p class="search-page__empty-icon"><i class="bi bi-search"></i></p>
          <p class="search-page__empty-title">${data.emptyTitle}</p>
          <p class="search-page__empty-sub">${data.emptySub}</p>
        </div>
      </div>
    </div>
  `;

  bindSearchHandlers({
    input: el.querySelector('.mobile-input'),
    clearBtn: el.querySelector('.search-page__clear'),
    filtersEl: el.querySelector('#js-filters'),
    discovery: el.querySelector('#js-discovery'),
    resultsPanel: el.querySelector('#js-results'),
    resultsList: el.querySelector('#js-results-list'),
    resultsLabel: el.querySelector('#js-results-label'),
    emptyEl: el.querySelector('#js-empty'),
    trendingGrid: el.querySelector('#js-trending'),
    suggestedGrid: el.querySelector('#js-suggested'),
    trendingTags: trendingTags.map(t => TrendingCard(t)),
    suggested: suggested.map(s => SuggestedCard(s)),
  });

  return el;
}
