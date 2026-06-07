import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';

injectStyle('/css/_shared.css');
injectStyle('/features/chat/chat.css');
import { PageHeader } from '../../components/page-header/page-header.js';
import { Card } from '../../components/card/card.js';
import { getSession } from '../../js/auth.js';
import { getFriendNames } from '../../js/follow.js';
import { navigateTo } from '../../js/utils/url.js';


function friendColor(name) {
  const colors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'];
  return colors[name.length % colors.length];
}

function renderDesktop(data) {
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
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem">
                      <span style="font-weight:600;font-size:0.9rem;color:var(--text)">${name}</span>
                      <span style="font-size:0.68rem;color:var(--muted-alt);white-space:nowrap">Online</span>
                    </div>
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

function renderMobile(data) {
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
            ${friendNames.map(name => {
              const initial = name.charAt(0).toUpperCase();
              const color = friendColor(name);
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
            }).join('')}
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
        ${data.cards.map((card) => {
          const initial = (card.title || '?').charAt(0).toUpperCase();
          return `
            <article class="mobile-card" style="display:flex;align-items:center;gap:0.75rem;padding:0.9rem 1rem">
              <div style="width:2.6rem;height:2.6rem;border-radius:50%;background:${friendColor(card.title)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;flex-shrink:0">${initial}</div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:0.92rem;color:var(--text)">${card.title}</div>
                <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.1rem">
                  <span style="font-size:0.68rem;font-weight:600;color:var(--accent)">${card.tag}</span>
                  <span style="font-size:0.82rem;color:var(--muted-alt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${card.description}</span>
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

export async function Chat() {
  try {
    const data = await fetchData('/data/chat.json');
    const isMobile = window.innerWidth <= 900;
    return isMobile ? renderMobile(data) : renderDesktop(data);
  } catch (err) {
    const el = document.createElement('section');
    el.className = 'container section';
    el.innerHTML = `<p style="color:var(--muted);padding:2rem;text-align:center">Gagal memuat halaman: ${err.message}</p>`;
    return el;
  }
}
