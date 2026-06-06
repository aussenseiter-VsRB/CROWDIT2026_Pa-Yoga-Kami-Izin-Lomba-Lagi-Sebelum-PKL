if (!document.querySelector('link[href="/pages/pages-desktop/home/home.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/home/home.css';
  document.head.appendChild(link);
}

function peopleIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
      <path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"></path>
    </svg>
  `;
}

function ForumCard(forum) {
  const statusClass = forum.status === 'Online' ? 'is-online' : 'is-offline';

  return `
    <article class="home-forum-card">
      <div class="home-forum-card__header">
        <div>
          <span class="home-forum-card__eyebrow">${forum.status}</span>
          <h2>${forum.title}</h2>
        </div>
        <span class="home-status ${statusClass}">
          <span aria-hidden="true"></span>
          ${forum.status}
        </span>
      </div>

      <p>${forum.description}</p>

      <div class="home-forum-card__footer">
        <span class="home-joined">
          ${peopleIcon()}
          ${forum.joined}
        </span>
        <a class="home-action ${forum.action === 'Open' ? 'is-primary' : 'is-secondary'}" href="/groups" data-link>
          ${forum.action}
        </a>
      </div>
    </article>
  `;
}

export async function Home() {
  const res = await fetch('/data/home.json');
  const data = await res.json();

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
            <a class="home-button home-button--secondary" href="${data.hero.actions[1].href}" data-link>${data.hero.actions[1].label}</a>
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
        ${data.forums.map(ForumCard).join('')}
      </div>
    </div>
  `;

  return el;
}
