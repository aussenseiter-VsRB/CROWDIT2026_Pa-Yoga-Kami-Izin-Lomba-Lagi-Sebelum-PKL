import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { Card } from '/components/desktop/card/card.js';
import { getSession } from '/js/auth.js';
import { getFriendNames } from '/js/follow.js';
import { navigateTo } from '/js/router.js';

function friendColor(name) {
  const colors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'];
  return colors[name.length % colors.length];
}

export async function Chat() {
  const res = await fetch('/data/chat.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'container section';

  const session = getSession();
  let friendsHtml = '';
  if (session) {
    const friendNames = getFriendNames(session.email);
    if (friendNames.length > 0) {
      friendsHtml = `
        <div style="margin-bottom:2rem">
          <h3 style="font-size:1rem;font-weight:700;margin:0 0 1rem;display:flex;align-items:center;gap:0.4rem">
            <i class="bi bi-chat-dots" style="color:var(--accent)"></i> Pesan Langsung
          </h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0.75rem">
            ${friendNames.map(name => {
              const initial = name.charAt(0).toUpperCase();
              const color = friendColor(name);
              return `
                <a class="card" href="/dm?user=${encodeURIComponent(name)}" data-link style="display:flex;align-items:center;gap:0.75rem;padding:0.85rem 1rem;cursor:pointer;text-decoration:none;color:inherit;border-radius:12px;border:1px solid var(--border-color);transition:box-shadow 0.15s;background:var(--card-bg)">
                  <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;flex-shrink:0">${initial}</div>
                  <div style="flex:1;min-width:0">
                    <div style="font-weight:600;font-size:0.9rem;color:var(--text)">${name}</div>
                    <div style="font-size:0.78rem;color:var(--muted-alt)">Teman</div>
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
  }

  el.innerHTML = `
    <div class="desktop-page">
      <div class="desktop-page__header"></div>
      ${friendsHtml}
      <div class="card-grid desktop-page__grid"></div>
    </div>
  `;

  el.querySelector('.desktop-page__header').appendChild(
    PageHeader(data.header),
  );

  const grid = el.querySelector('.desktop-page__grid');
  data.cards.forEach((card) => {
    grid.appendChild(Card(card));
  });

  return el;
}
