import { ForumCard, mForumCard, SuggestionCard, mSuggestionCard } from '../../../../components/shared/forum-card/forum-card.js';
import { renderFab } from '../../../../components/ui/fab/fab.js';

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

  const allCards = injectSuggestions(
    data.forums.map((forum, index) => ForumCard(forum, index)),
    data.suggestions || [],
    SuggestionCard
  );
  const visibleCards = allCards.slice(0, 9);
  const hiddenCards = allCards.slice(9);
  const hasMore = hiddenCards.length > 0;

  el.innerHTML = `
    <div class="home-page__inner">
      <section class="forums-hero">
        <div class="forums-hero__left">
          <h1 class="forums-hero__title"><i class="bi bi-book"></i> Forum Diskusi</h1>
          <p class="forums-hero__text">${data.hero.text}</p>
          <button class="forums-create-btn" data-create-forum type="button"><i class="bi bi-plus-lg"></i> Buat Forum</button>
        </div>
        <div class="forums-hero__right">
          <div class="forums-hero-stats">
            ${data.heroStats?.topForum ? `
              <div class="forums-hero-stat">
                <i class="bi bi-trophy"></i>
                <div>
                  <strong>${data.heroStats.topForum.title}</strong>
                  <span>${data.heroStats.topForum.count} peserta</span>
                </div>
              </div>
            ` : ''}
            ${data.heroStats?.topCategory ? `
              <div class="forums-hero-stat">
                <i class="bi bi-bar-chart"></i>
                <div>
                  <strong>${data.heroStats.topCategory.name}</strong>
                  <span>${data.heroStats.topCategory.count} forum</span>
                </div>
              </div>
            ` : ''}
            ${data.heroStats?.topCreator ? `
              <div class="forums-hero-stat">
                <i class="bi bi-person-badge"></i>
                <div>
                  <strong>${data.heroStats.topCreator.name}</strong>
                  <span>${data.heroStats.topCreator.username}</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </section>

      <nav class="home-topics" aria-label="Forum topics">
        ${data.topics.map((topic, index) => `
          <button class="home-topic ${index === 0 ? 'is-active' : ''}" type="button">
            ${topic}
          </button>
        `).join('')}
      </nav>

      <div class="home-status-chips">
        <button class="home-status-chip is-active" type="button" data-status="">Semua</button>
        <button class="home-status-chip" type="button" data-status="Online">Online</button>
        <button class="home-status-chip" type="button" data-status="Offline">Offline</button>
      </div>

      <div class="home-forum-list">
        ${visibleCards.join('')}
        ${hiddenCards.map(h => h.replace('<article', '<article data-hidden="true"')).join('')}
      </div>

      ${hasMore ? '<button class="home-show-more" type="button">Lihat Selengkapnya</button>' : ''}
    </div>
  `;

  const showMore = el.querySelector('.home-show-more');
  if (showMore) {
    showMore.addEventListener('click', () => {
      const hidden = el.querySelectorAll('[data-hidden="true"]');
      if (hidden.length > 0) {
        hidden.forEach(c => c.removeAttribute('data-hidden'));
        el.querySelector('.home-forum-empty')?.remove();
        showMore.textContent = 'Tutup';
      } else {
        const cards = el.querySelectorAll('.home-forum-list > article');
        cards.forEach((c, i) => { if (i >= 9) c.setAttribute('data-hidden', 'true'); });
        showMore.textContent = 'Lihat Selengkapnya';
      }
    });
  }

  return el;
}

export function renderMobile(data) {
  const el = document.createElement('section');
  el.className = 'm-home-page';

  el.innerHTML = `
    <div class="m-home-page__inner">
      <header class="m-home-hero">
        <h1>Forum Diskusi</h1>
        <p>${data.mobile.description || data.hero.text}</p>
      </header>

      <div class="m-forums-stats">
        ${data.heroStats?.topForum ? `
          <div class="m-forums-stat">
            <i class="bi bi-trophy"></i>
            <span><strong>${data.heroStats.topForum.title}</strong> — ${data.heroStats.topForum.count} peserta</span>
          </div>
        ` : ''}
        ${data.heroStats?.topCategory ? `
          <div class="m-forums-stat">
            <i class="bi bi-bar-chart"></i>
            <span><strong>${data.heroStats.topCategory.name}</strong> — ${data.heroStats.topCategory.count} forum</span>
          </div>
        ` : ''}
        ${data.heroStats?.topCreator ? `
          <div class="m-forums-stat">
            <i class="bi bi-person-badge"></i>
            <span><strong>${data.heroStats.topCreator.name}</strong> — ${data.heroStats.topCreator.username}</span>
          </div>
        ` : ''}
      </div>

      ${renderFab()}

      <nav class="m-home-topics" aria-label="Forum topics">
        ${data.topics.map((topic, index) => `
          <button class="m-home-topic ${index === 0 ? 'is-active' : ''}" type="button">
            ${topic}
          </button>
        `).join('')}
      </nav>

      <div class="m-home-status-chips">
        <button class="m-home-status-chip is-active" type="button" data-status="">Semua</button>
        <button class="m-home-status-chip" type="button" data-status="Online">Online</button>
        <button class="m-home-status-chip" type="button" data-status="Offline">Offline</button>
      </div>

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
