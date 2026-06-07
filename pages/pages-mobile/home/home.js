if (!document.querySelector('link[href="/pages/pages-mobile/home/home.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/home/home.css';
  document.head.appendChild(link);
}

function peopleIcon() {
  return '<i class="bi bi-people"></i>';
}

function ForumCard(forum, index) {
  const statusClass = forum.status === 'Online' ? 'is-online' : 'is-offline';

  const actionHref = forum.action === 'Detail' ? `/detail?index=${index}` : `/open?index=${index}`;

  return `
    <article class="m-home-forum-card">
      <div class="m-home-forum-card__header">
        <h2>${forum.title}</h2>
        <span class="m-home-status ${statusClass}">
          <span aria-hidden="true"></span>
          ${forum.status}
        </span>
      </div>
      <p>${forum.description}</p>
      <div class="m-home-forum-card__footer">
        <span class="m-home-joined">
          ${peopleIcon()}
          ${forum.joined}
        </span>
        <a class="m-home-action is-primary" href="${actionHref}" data-link>
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

      <div class="m-home-forum-list">
        ${data.mobile.forums.map((forum, index) => ForumCard(forum, index)).join('')}
      </div>
    </div>
  `;

  return el;
}
