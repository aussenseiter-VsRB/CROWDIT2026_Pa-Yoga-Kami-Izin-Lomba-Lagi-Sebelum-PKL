import { ForumCard, mForumCard, SuggestionCard, mSuggestionCard } from './_cards.js';

function injectSuggestions(cards, suggestions, suggestionCardFn, interval = 4) {
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

function renderDesktop(data) {
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
      <section class="home-hero" aria-label="Hero section">
        <div class="home-hero__copy">
          <p class="home-hero__eyebrow">${data.hero.eyebrow}</p>
          <h1 class="home-hero__title">${data.hero.title}</h1>
          <p class="home-hero__text">${data.hero.text}</p>

          <div class="home-hero__actions">
            <a class="home-button home-button--primary" href="${data.hero.actions[0].href}" data-link>${data.hero.actions[0].label}</a>
          </div>
        </div>

        <div class="home-hero__aside">
          <p class="home-hero__aside-title">${data.aside.title}</p>
          <ul class="home-hero__aside-list">
            ${data.aside.stats.map(s => `<li><strong>${s.value}</strong><span>${s.label}</span></li>`).join('')}
          </ul>
        </div>
      </section>

      ${data.interestForums && data.interestForums.length ? `
        <section class="home-interest-section">
          <h2 class="home-interest-title">Mungkin Anda Tertarik</h2>
          <p class="home-interest-desc">Berdasarkan minat belajar Anda</p>
          <div class="home-interest-grid">
            ${data.interestForums.map((f, i) => InterestCard(f, f._originalIndex)).join('')}
          </div>
        </section>
      ` : ''}

      ${data.topGroup ? `
        <section class="home-top-group-section">
          <h2 class="home-top-group-title">Grup Teramai</h2>
          <p class="home-top-group-desc">Komunitas dengan anggota terbanyak</p>
          <div class="home-top-group-card">
            <div class="home-top-group-card__body">
              <div class="home-top-group-card__header">
                <span class="home-top-group-card__dept">${data.topGroup.department}</span>
                <span class="home-top-group-card__trophy">&starf; Terpopuler</span>
              </div>
              <h3 class="home-top-group-card__title">${data.topGroup.title}</h3>
              <p class="home-top-group-card__desc">${data.topGroup.description}</p>
              <a class="home-action is-primary home-top-group-card__action" href="/groups?group=0" data-link>Lihat Grup</a>
              <div class="home-top-group-card__footer">
                <span class="home-top-group-card__members">${peopleIcon()} ${memberLabel(data.topGroup.members, data.topGroup.maxMembers)}</span>
              </div>
            </div>
            <div class="home-top-group-card__badge">
              <div class="home-top-group-card__badge-inner">
                <span class="home-top-group-card__badge-icon">&starf;</span>
                <span class="home-top-group-card__badge-label">Grup Teramai</span>
                <span class="home-top-group-card__badge-sub">Dinobatkan pada ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </section>
      ` : ''}

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

function renderMobile(data) {
  const el = document.createElement('section');
  el.className = 'm-home-page';

  el.innerHTML = `
    <div class="m-home-page__inner">
      <header class="m-home-hero">
        <h1>${data.mobile.title}</h1>
        <p>${data.mobile.description}</p>
      </header>

      ${isAuthenticated() ? renderFab() : ''}

      ${data.interestForums && data.interestForums.length ? `
        <section class="m-home-interest-section">
          <h2 class="m-home-interest-title">Mungkin Anda Tertarik</h2>
          <p class="m-home-interest-desc">Berdasarkan minat belajar Anda</p>
          <div class="m-home-interest-grid">
            ${data.interestForums.map((f, i) => mInterestCard(f, f._originalIndex)).join('')}
          </div>
        </section>
      ` : ''}

      ${data.topGroup ? `
        <section class="m-home-top-group-section">
          <h2 class="m-home-top-group-title">Grup Teramai</h2>
          <p class="m-home-top-group-desc">Komunitas dengan anggota terbanyak</p>
          <div class="m-home-top-group-card">
            <div class="m-home-top-group-card__header">
              <span class="m-home-top-group-card__dept">${data.topGroup.department}</span>
              <span class="m-home-top-group-card__trophy">&starf; Terpopuler</span>
            </div>
            <h3 class="m-home-top-group-card__title">${data.topGroup.title}</h3>
            <p class="m-home-top-group-card__desc">${data.topGroup.description}</p>
            <a class="m-home-action is-primary m-home-top-group-card__action" href="/groups?group=0" data-link>Lihat Grup</a>
            <div class="m-home-top-group-card__footer">
              <span class="m-home-top-group-card__members">${peopleIcon()} ${memberLabel(data.topGroup.members, data.topGroup.maxMembers)}</span>
            </div>
            <div class="m-home-top-group-card__award">Dinobatkan pada ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </section>
      ` : ''}

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

      ${data.stats ? `
        <div class="mobile-stats-grid">
          ${data.stats.map(s => `
            <div class="mobile-stat-card">
              <span class="mobile-stat-card__value">${s.value}</span>
              <span class="mobile-stat-card__label">${s.label}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

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

export { renderDesktop, renderMobile };
