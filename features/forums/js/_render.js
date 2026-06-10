import { ForumCard, mForumCard, SuggestionCard, mSuggestionCard } from '../../home/js/_cards.js';
import { renderFab } from '../../../components/ui/fab/fab.js';

export function injectSuggestions(cards, suggestions, suggestionCardFn, interval = 4) {
  if (suggestions.length === 0) return cards;
  const result = [];
  let sIdx = 0;
  for (let i = 0; i < cards.length; i++) {
    result.push(cards[i]);
    if ((i + 1) % interval === 0 && sIdx < suggestions.length) {
      result.push(suggestionCardFn(suggestions[sIdx], suggestions[sIdx]._originalIndex));
      sIdx++;
    }
  }
  return result;
}

export function renderDesktop(data) {
  const el = document.createElement('section');
  el.className = 'home-page container section';

  el.innerHTML = `
    <div class="home-page__inner">
      <section class="forums-hero">
        <div>
          <h1 class="forums-hero__title"><i class="bi bi-book"></i> Forum Diskusi</h1>
          <p class="forums-hero__desc">Temukan forum sesuai mata kuliah dan minat belajarmu</p>
        </div>
        <button class="forums-create-btn" data-create-forum type="button"><i class="bi bi-plus-lg"></i> Buat Forum</button>
      </section>

      <nav class="home-topics" aria-label="Forum topics">
        ${data.topics.map((topic, index) => `
          <button class="home-topic ${index === 0 ? 'is-active' : ''}" type="button">
            ${topic}
          </button>
        `).join('')}
      </nav>

      <div class="home-forum-list">
        ${injectSuggestions(
          data.forums.map((forum, index) => ForumCard(forum, index)),
          data.suggestions || [],
          SuggestionCard
        ).join('')}
      </div>
    </div>
  `;

  return el;
}

export function renderMobile(data) {
  const el = document.createElement('section');
  el.className = 'm-home-page';

  el.innerHTML = `
    <div class="m-home-page__inner">
      <header class="m-home-hero">
        <h1>Forum Diskusi</h1>
        <p>Temukan forum sesuai mata kuliah dan minat belajarmu</p>
      </header>

      ${renderFab()}

      <nav class="m-home-topics" aria-label="Forum topics">
        ${data.topics.map((topic, index) => `
          <button class="m-home-topic ${index === 0 ? 'is-active' : ''}" type="button">
            ${topic}
          </button>
        `).join('')}
      </nav>

      <div class="m-home-forum-list">
        ${injectSuggestions(
          data.mobile.forums.map((forum, index) => mForumCard(forum, index)),
          data.suggestions || [],
          mSuggestionCard
        ).join('')}
      </div>
    </div>
  `;

  return el;
}
