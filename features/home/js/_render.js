import { ForumCard, mForumCard } from './_cards.js';

function renderDesktop(data) {
  const el = document.createElement('section');
  el.className = 'home-page container section';

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

      <nav class="home-topics" aria-label="Forum topics">
        ${data.topics.map((topic, index) => `
          <button class="home-topic ${index === 0 ? 'is-active' : ''}" type="button">
            ${topic}
          </button>
        `).join('')}
      </nav>

      <section class="home-stats" aria-label="Community stats">
        ${data.stats.map(s => `
          <div class="home-stat">
            <span class="home-stat__value">${s.value}</span>
            <span class="home-stat__label">${s.label}</span>
          </div>
        `).join('')}
      </section>

      <div class="home-forum-list">
        ${data.forums.map((forum, index) => ForumCard(forum, index)).join('')}
      </div>
    </div>
  `;

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

      <nav class="m-home-topics" aria-label="Forum topics">
        ${data.topics.map((topic, index) => `
          <button class="m-home-topic ${index === 0 ? 'is-active' : ''}" type="button">
            ${topic}
          </button>
        `).join('')}
      </nav>

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
        ${data.mobile.forums.map((forum, index) => mForumCard(forum, index)).join('')}
      </div>
    </div>
  `;

  return el;
}

export { renderDesktop, renderMobile };
