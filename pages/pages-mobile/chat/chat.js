if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

import { getSession, getUsers } from '/js/auth.js';
import { getFriendNames } from '/js/follow.js';
import { getDMMessages } from '/js/dm.js';

function recentColor(name) {
  const colors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'];
  return colors[name.length % colors.length];
}

function renderFriend(name) {
  const initial = name.charAt(0).toUpperCase();
  const color = recentColor(name);
  return `
    <a class="mobile-card" href="/dm?user=${encodeURIComponent(name)}" data-link style="display:flex;align-items:center;gap:0.75rem;padding:0.9rem 1rem;cursor:pointer;text-decoration:none;color:inherit">
      <div style="width:2.6rem;height:2.6rem;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;flex-shrink:0">${initial}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem">
          <span style="font-weight:700;font-size:0.92rem;color:var(--text)">${name}</span>
          <span style="font-size:0.68rem;color:var(--muted-alt);white-space:nowrap">Online</span>
        </div>
        <div style="font-size:0.82rem;color:var(--muted-alt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:0.1rem">Teman</div>
      </div>
    </a>
  `;
}

export async function Chat() {
  const res = await fetch('/data/chat.json');
  const data = await res.json();

  const session = getSession();
  let friendCards = '';
  if (session) {
    const friendNames = getFriendNames(session.email);
    if (friendNames.length > 0) {
      friendCards = `
        <div class="mobile-page__inner" style="padding-bottom:0.5rem">
          <p style="font-weight:700;font-size:0.9rem;color:var(--text);margin:0 0 0.5rem;display:flex;align-items:center;gap:0.4rem">
            <i class="bi bi-chat-dots" style="color:var(--accent)"></i> Pesan Langsung
          </p>
          <div class="mobile-list">
            ${friendNames.map(renderFriend).join('')}
          </div>
        </div>
        <div style="height:1px;background:var(--border-color);margin:0.5rem 1.25rem"></div>
      `;
    }
  }

  const el = document.createElement('section');
  el.className = 'mobile-page';
  el.innerHTML = `
    <div class="mobile-page__inner">
      <header class="mobile-page__hero">
        <p class="mobile-page__eyebrow">${data.header.eyebrow}</p>
        <h1>${data.header.title}</h1>
        <p>${data.header.description}</p>
        <div class="mobile-page__actions">
          ${data.header.actions.map((action) => `
            <a class="mobile-page__action is-${action.variant}" href="${action.href}" data-link>${action.label}</a>
          `).join('')}
        </div>
      </header>
    </div>
    ${friendCards}
    <div class="mobile-page__inner">
      <div class="mobile-list">
        ${data.cards.map((card, i) => {
          const initial = (card.title || '?').charAt(0).toUpperCase();
          const msgCount = Math.floor(Math.random() * 12) + 1;
          const hasUnread = i < 2;
          return `
            <article class="mobile-card" style="display:flex;align-items:center;gap:0.75rem;padding:0.9rem 1rem;cursor:pointer;${hasUnread ? 'border-left:3px solid var(--accent)' : ''}">
              <div style="width:2.6rem;height:2.6rem;border-radius:50%;background:${recentColor(card.title)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;flex-shrink:0">${initial}</div>
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem">
                  <span style="font-weight:700;font-size:0.92rem;color:var(--text)">${card.title}</span>
                  <span style="font-size:0.68rem;color:var(--muted-alt);white-space:nowrap">${i === 0 ? '2m lalu' : i === 1 ? '1j lalu' : '3j lalu'}</span>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin-top:0.1rem">
                  <span style="font-size:0.82rem;color:var(--muted-alt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${card.description}</span>
                  ${hasUnread ? `<span style="background:var(--accent);color:#fff;font-size:0.6rem;font-weight:800;padding:0.1rem 0.4rem;border-radius:999px;line-height:1.3">${msgCount}</span>` : ''}
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;
  return el;
}
