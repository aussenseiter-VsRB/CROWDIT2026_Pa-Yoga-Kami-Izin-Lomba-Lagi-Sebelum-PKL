import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { Card } from '/components/desktop/card/card.js';
import { getSession, isAuthenticated, logout, navigateAfterAuth } from '/js/auth.js';

export async function Profile() {
  if (!isAuthenticated()) {
    navigateAfterAuth('/login');
    return document.createElement('section');
  }

  const session = getSession();
  const initial = session.name.charAt(0).toUpperCase();

  const res = await fetch('/data/profile.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <div class="desktop-page">
      <div class="desktop-page__header"></div>
      <div class="desktop-page__user"></div>
      <div class="card-grid desktop-page__grid"></div>
    </div>
  `;

  el.querySelector('.desktop-page__header').appendChild(
    PageHeader(data.header),
  );

  const userEl = document.createElement('div');
  userEl.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.4rem;border:1px solid rgba(26,26,26,0.08);border-radius:var(--radius-lg);background:rgba(255,255,255,0.85);box-shadow:var(--shadow-sm);margin-bottom:1.5rem';
  userEl.innerHTML = `
    <div style="display:flex;align-items:center;gap:1rem">
      <div style="width:3.5rem;height:3.5rem;border-radius:999px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:800;flex-shrink:0">${initial}</div>
      <div>
        <div style="font-weight:700;font-size:1.1rem">${session.name}</div>
        <div style="color:var(--muted);font-size:0.9rem">${session.email}</div>
      </div>
    </div>
    <button class="profile-logout" style="min-height:2.8rem;padding:0 1.1rem;border-radius:999px;border:1px solid rgba(26,26,26,0.08);background:rgba(255,255,255,0.88);color:var(--text);font:inherit;font-size:0.92rem;font-weight:700;cursor:pointer">Logout</button>
  `;
  el.querySelector('.desktop-page__user').appendChild(userEl);

  userEl.querySelector('.profile-logout').addEventListener('click', () => {
    logout();
    navigateAfterAuth('/');
  });

  const grid = el.querySelector('.desktop-page__grid');
  data.cards.forEach((card) => {
    grid.appendChild(Card(card));
  });

  return el;
}
