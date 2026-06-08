import { injectStyle } from '../../../js/utils/styleLoader.js';
import { fetchData } from '../../../js/utils/api.js';
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../../js/core/config.js';

injectStyle('/css/_shared.css');
injectStyle('/features/chat/chat/chat.css');
import { PageHeader } from '../../../components/shared/page-header/page-header.js';
import { Card } from '../../../components/ui/card/card.js';
import { getSession } from '../../../js/services/auth.js';
import { getFriendNames, emailToName } from '../../../js/services/follow.js';
import { navigateTo, asset } from '../../../js/utils/url.js';
import { getJoinedForums } from '../../../js/services/forum-access.js';
import { getConversations } from '../../../js/services/dm.js';


function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function friendColor(name) {
  const colors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'];
  return colors[name.length % colors.length];
}

function formatConversationTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  if (d.toDateString() === now.toDateString()) {
    return pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + String(d.getFullYear()).slice(2);
}

function renderDesktop(data) {
  const el = document.createElement('section');
  el.className = 'container section';

  const session = getSession();
  let conversationsHtml = '';
  let friendsHtml = '';
  if (session) {
    const convos = getConversations(session.email);
    if (convos.length > 0) {
      conversationsHtml = `
        <div style="margin-bottom:2rem">
          <h3 style="font-size:1rem;font-weight:700;margin:0 0 1rem;display:flex;align-items:center;gap:0.4rem">
            <i class="bi bi-chat-dots" style="color:var(--accent)"></i> Pesan Langsung
          </h3>
          <div style="display:flex;flex-direction:column;gap:0.35rem">
            ${convos.map(c => {
              const name = emailToName(c.with);
              const initial = name.charAt(0).toUpperCase();
              const color = friendColor(name);
              const preview = c.fromMe ? '<span style="opacity:0.6">Kamu: </span>' : '';
              return `
                <a class="card" href="/dm?user=${encodeURIComponent(name)}" data-link style="display:flex;align-items:center;gap:0.75rem;padding:0.7rem 1rem;cursor:pointer;text-decoration:none;color:inherit;border-radius:12px;border:1px solid var(--border-color);transition:box-shadow 0.15s;background:var(--card-bg)">
                  <div style="position:relative;flex-shrink:0">
                    <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700">${initial}</div>
                    ${c.unread > 0 ? `<div style="position:absolute;top:-4px;right:-4px;background:#ff3b30;color:#fff;font-size:0.62rem;font-weight:700;min-width:1.1rem;height:1.1rem;border-radius:999px;display:flex;align-items:center;justify-content:center;padding:0 0.2rem;box-shadow:0 0 0 2px var(--card-bg, var(--bg))">${c.unread > 99 ? '99+' : c.unread}</div>` : ''}
                  </div>
                  <div style="flex:1;min-width:0">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem">
                      <span style="font-weight:600;font-size:0.9rem;color:var(--text)">${name}</span>
                      <span style="font-size:0.68rem;color:var(--muted-alt);white-space:nowrap">${formatConversationTime(c.lastTime)}</span>
                    </div>
                    <div style="font-size:0.78rem;color:var(--muted-alt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${preview}${escapeHtml(c.lastMessage)}</div>
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    const friendNames = getFriendNames(session.email);
    if (friendNames.length > 0) {
      friendsHtml = `
        <div style="margin-bottom:2rem">
          <h3 style="font-size:1rem;font-weight:700;margin:0 0 1rem;display:flex;align-items:center;gap:0.4rem">
            <i class="bi bi-person-plus" style="color:var(--accent)"></i> Teman
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

  let forumsHtml = '';
  const joinedForums = getJoinedForums();
  if (joinedForums.length > 0) {
    forumsHtml = `
      <div style="margin-bottom:2rem">
        <h3 style="font-size:1rem;font-weight:700;margin:0 0 1rem;display:flex;align-items:center;gap:0.4rem">
          <i class="bi bi-collection" style="color:var(--accent)"></i> Forum Saya
        </h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0.75rem">
          ${joinedForums.map(f => {
            const name = window.__forumNames?.[`${f.type}_${f.index}`] || (f.type === 'course' ? `Kursus ${f.index}` : `Grup ${f.index}`);
            const initial = name.charAt(0).toUpperCase();
            const color = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'][name.length % 6];
            return `
              <a class="card" href="/forum-interior?${f.type === 'course' ? 'index' : 'group'}=${f.index}" data-link style="display:flex;align-items:center;gap:0.75rem;padding:0.85rem 1rem;cursor:pointer;text-decoration:none;color:inherit;border-radius:12px;border:1px solid var(--border-color);transition:box-shadow 0.15s;background:var(--card-bg)">
                <div style="width:2.5rem;height:2.5rem;border-radius:0.65rem;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;flex-shrink:0">${initial}</div>
                <div style="flex:1;min-width:0">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem">
                    <span style="font-weight:600;font-size:0.9rem;color:var(--text)">${name}</span>
                    <span style="font-size:0.68rem;color:var(--accent);white-space:nowrap">${f.type === 'course' ? 'Kursus' : 'Grup'}</span>
                  </div>
                  <div style="font-size:0.78rem;color:var(--muted-alt)">${f.status === 'joined' ? 'Bergabung' : ''}</div>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  el.innerHTML = `
    <div class="desktop-page">
      <div class="desktop-page__header"></div>
      ${conversationsHtml}
      ${friendsHtml}
      ${forumsHtml}
      <div class="card-grid desktop-page__grid"></div>
    </div>
  `;

  el.querySelector('.desktop-page__header').appendChild(
    PageHeader(data.header),
  );

  const grid = el.querySelector('.desktop-page__grid');
  if (data.cards) {
    data.cards.forEach((card) => {
      grid.appendChild(Card(card));
    });
  }

  return el;
}

function renderMobile(data) {
  const session = getSession();
  let conversationsHtml = '';
  let friendCards = '';
  if (session) {
    const convos = getConversations(session.email);
    if (convos.length > 0) {
      conversationsHtml = `
        <div class="mobile-page__inner" style="padding-bottom:0.5rem">
          <p style="font-weight:700;font-size:0.9rem;color:var(--text);margin:0 0 0.5rem;display:flex;align-items:center;gap:0.4rem">
            <i class="bi bi-chat-dots" style="color:var(--accent)"></i> Pesan Langsung
          </p>
          <div class="mobile-list">
            ${convos.map(c => {
              const name = emailToName(c.with);
              const initial = name.charAt(0).toUpperCase();
              const color = friendColor(name);
              const preview = c.fromMe ? '<span style="opacity:0.6">Kamu: </span>' : '';
              return `
                <a class="mobile-card" href="/dm?user=${encodeURIComponent(name)}" data-link style="display:flex;align-items:center;gap:0.75rem;padding:0.9rem 1rem;cursor:pointer;text-decoration:none;color:inherit">
                  <div style="position:relative;flex-shrink:0">
                    <div style="width:2.6rem;height:2.6rem;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700">${initial}</div>
                    ${c.unread > 0 ? `<div style="position:absolute;top:-2px;right:-2px;background:#ff3b30;color:#fff;font-size:0.6rem;font-weight:700;min-width:1rem;height:1rem;border-radius:999px;display:flex;align-items:center;justify-content:center;padding:0 0.15rem;box-shadow:0 0 0 2px var(--bg)">${c.unread > 99 ? '99+' : c.unread}</div>` : ''}
                  </div>
                  <div style="flex:1;min-width:0">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem">
                      <span style="font-weight:700;font-size:0.92rem;color:var(--text)">${name}</span>
                      <span style="font-size:0.68rem;color:var(--muted-alt);white-space:nowrap">${formatConversationTime(c.lastTime)}</span>
                    </div>
                    <div style="font-size:0.82rem;color:var(--muted-alt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:0.1rem">${preview}${escapeHtml(c.lastMessage)}</div>
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        </div>
        <div style="height:1px;background:var(--border-color);margin:0.5rem 1.25rem"></div>
      `;
    }

    const friendNames = getFriendNames(session.email);
    if (friendNames.length > 0) {
      friendCards = `
        <div class="mobile-page__inner" style="padding-bottom:0.5rem">
          <p style="font-weight:700;font-size:0.9rem;color:var(--text);margin:0 0 0.5rem;display:flex;align-items:center;gap:0.4rem">
            <i class="bi bi-person-plus" style="color:var(--accent)"></i> Teman
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

  let forumsHtml = '';
  const joinedForums = getJoinedForums();
  if (joinedForums.length > 0) {
    forumsHtml = `
      <div class="mobile-page__inner" style="padding-bottom:0.5rem">
        <p style="font-weight:700;font-size:0.9rem;color:var(--text);margin:0 0 0.5rem;display:flex;align-items:center;gap:0.4rem">
          <i class="bi bi-collection" style="color:var(--accent)"></i> Forum Saya
        </p>
        <div class="mobile-list">
          ${joinedForums.map(f => {
            const name = window.__forumNames?.[`${f.type}_${f.index}`] || (f.type === 'course' ? `Kursus ${f.index}` : `Grup ${f.index}`);
            const initial = name.charAt(0).toUpperCase();
            const color = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'][name.length % 6];
            return `
              <a class="mobile-card" href="/forum-interior?${f.type === 'course' ? 'index' : 'group'}=${f.index}" data-link style="display:flex;align-items:center;gap:0.75rem;padding:0.9rem 1rem;cursor:pointer;text-decoration:none;color:inherit">
                <div style="width:2.6rem;height:2.6rem;border-radius:0.65rem;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;flex-shrink:0">${initial}</div>
                <div style="flex:1;min-width:0">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem">
                    <span style="font-weight:700;font-size:0.92rem;color:var(--text)">${name}</span>
                    <span style="font-size:0.68rem;color:var(--accent);white-space:nowrap">${f.type === 'course' ? 'Kursus' : 'Grup'}</span>
                  </div>
                  <div style="font-size:0.82rem;color:var(--muted-alt);margin-top:0.1rem">Bergabung</div>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </div>
      <div style="height:1px;background:var(--border-color);margin:0.5rem 1.25rem"></div>
    `;
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
    ${conversationsHtml}
    ${forumsHtml}
    ${friendCards}
    <div class="mobile-page__inner">
      <div class="mobile-list">
        ${data.cards ? data.cards.map((card) => {
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
        }).join('') : ''}
      </div>
    </div>
  `;
  return el;
}

export async function Chat() {
  try {
    const [data, detailRes, groupsRes] = await Promise.all([
      fetchData(DATA_PATHS.CHAT),
      fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
      fetch(asset(DATA_PATHS.GROUPS)).then(r => r.json()),
    ]);

    window.__forumNames = {};
    detailRes.forEach((item, i) => {
      if (item?.course?.title) window.__forumNames[`course_${i}`] = item.course.title;
    });
    (groupsRes.groups || []).forEach((item, i) => {
      if (item?.title) window.__forumNames[`group_${i}`] = item.title;
    });

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    return isMobile ? renderMobile(data) : renderDesktop(data);
  } catch (err) {
    const el = document.createElement('section');
    el.className = 'container section';
    el.innerHTML = `<p style="color:var(--muted);padding:2rem;text-align:center">Gagal memuat halaman: ${err.message}</p>`;
    return el;
  }
}
