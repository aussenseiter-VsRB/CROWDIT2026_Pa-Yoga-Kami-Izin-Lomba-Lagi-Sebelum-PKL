if (!document.querySelector('link[href="/pages/pages-mobile/home/home.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/home/home.css';
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
        <h2>${forum.title}</h2>
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
  el.className = 'home-page';

  el.innerHTML = `
    <div class="home-page__inner">
      <header class="home-hero">
        <h1>${data.mobile.title}</h1>
        <p>${data.mobile.description}</p>
      </header>

      <nav class="home-topics" aria-label="Forum topics">
        ${data.topics.map((topic, index) => `
          <button class="home-topic ${index === 0 ? 'is-active' : ''}" type="button">
            ${topic}
          </button>
        `).join('')}
      </nav>

      <div class="home-forum-list">
        ${data.mobile.forums.map(ForumCard).join('')}
      </div>
    </div>
  `;

  return el;
}
