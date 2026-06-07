import { injectStyle } from '../../js/utils/styleLoader.js';
import { getHashParams, asset, navigateTo } from '../../js/utils/url.js';
import { getForumStatus } from '../../js/forum-access.js';
import { getUsersForContext } from '../../js/dummy-users.js';
import { isFollowing, toggleFollow, notifyNewMessage } from '../../js/notifications.js';

injectStyle('/css/_shared.css');
injectStyle('/features/forum/forum.css');
injectStyle('/features/forum/_members.css');
injectStyle('/features/forum-interior/forum-interior.css');

let users = [];
let usersPromise = null;

function initForumUsers() {
  if (usersPromise) return usersPromise;
  usersPromise = fetch('https://dummyjson.com/users?limit=100&select=id,firstName,lastName,image')
    .then(r => { if (!r.ok) throw new Error('DummyJSON fetch failed'); return r.json(); })
    .then(data => { users = data.users || []; })
    .catch(() => { users = []; });
  return usersPromise;
}

function seededShuffle(array, seed) {
  const arr = [...array];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function AvatarStackHtml(memberCount, memberLimit, forumIndex) {
  const n = Math.min(memberCount, 5);
  const fallback = 'https://dummyjson.com/icon/user/28';
  let avatars = '';
  for (let i = 0; i < n; i++) {
    avatars += `<img class="forum-member-avatar" src="${fallback}" alt="" loading="lazy" data-avatar-idx="${i}" />`;
  }
  const remainder = memberCount - n;
  const label = remainder > 0 ? `+${remainder} members` : `${memberCount} members`;
  return `
    <div class="forum-member-stack" data-forum-index="${forumIndex}" data-member-count="${memberCount}">
      <div class="forum-member-avatars">
        ${avatars}
      </div>
      <span class="forum-member-count">${label}</span>
    </div>
  `;
}

function populateStacks(root) {
  if (users.length === 0) return;
  const stacks = root.querySelectorAll('.forum-member-stack');
  stacks.forEach(stack => {
    const idx = parseInt(stack.dataset.forumIndex, 10);
    const memberCount = parseInt(stack.dataset.memberCount, 10);
    const n = Math.min(memberCount, 5);
    const shuffled = seededShuffle(users, idx);
    const items = shuffled.slice(0, n);
    const imgs = stack.querySelectorAll('.forum-member-avatar');
    imgs.forEach((img, i) => {
      if (items[i]) {
        img.src = items[i].image;
        img.alt = items[i].firstName;
        img.onerror = function () { this.src = 'https://dummyjson.com/icon/user/28'; };
      }
    });
  });
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'kemarin';
  return `${days}h lalu`;
}

const avatarColors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de', '#5ac8fa', '#ff9500'];

function createMsgEl(msg) {
  const el = document.createElement('div');
  el.className = 'forum-msg';
  if (msg.system) {
    el.classList.add('forum-msg--system');
    el.innerHTML = `<div class="forum-msg__text">${msg.text}</div>`;
    return el;
  }
  const initial = msg.user.charAt(0).toUpperCase();
  const colorIdx = msg.user.length % avatarColors.length;
  el.innerHTML = `
    <div class="forum-msg__avatar" style="background:${avatarColors[colorIdx]}">${initial}</div>
    <div class="forum-msg__body">
      <div class="forum-msg__header">
        <span class="forum-msg__user">${msg.user}</span>
        <span class="forum-msg__time">${timeAgo(msg.time)}</span>
      </div>
      <div class="forum-msg__text">${msg.text.replace(/https?:\/\/[^\s]+/g, '<a href="$&" target="_blank" rel="noopener">$&</a>')}</div>
    </div>
  `;
  return el;
}

function ChannelSidebar(serverName, channels, activeId, forumId, forumType) {
  const textCh = channels.filter(c => c.type !== 'voice');
  const voiceCh = channels.filter(c => c.type === 'voice');
  const following = isFollowing(forumId, forumType);
  return `
    <div class="forum-sidebar">
      <div class="forum-sidebar__server">
        <i class="bi bi-collection"></i>
        ${serverName}
        <button class="forum-follow-btn ${following ? 'forum-follow-btn--active' : ''}" id="js-forum-follow" type="button" title="${following ? 'Berhenti mengikuti' : 'Ikuti forum ini'}">
          <i class="bi ${following ? 'bi-bell-fill' : 'bi-bell'}"></i>
        </button>
      </div>
      <div class="forum-sidebar__scroll">
        <div class="forum-sidebar__cat">Teks</div>
        ${textCh.map(ch => `
          <button class="forum-sidebar__channel ${ch.id === activeId ? 'forum-sidebar__channel--active' : ''}" data-channel="${ch.id}">
            <i class="bi bi-hash"></i>
            ${ch.name}
          </button>
        `).join('')}
        ${voiceCh.length ? `<div class="forum-sidebar__cat">Suara</div>` : ''}
        ${voiceCh.map(ch => `
          <button class="forum-sidebar__channel forum-sidebar__channel--voice" data-channel="${ch.id}">
            <i class="bi bi-mic"></i>
            ${ch.name}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function ActiveMembersPanel(users, serverName) {
  const maxShow = 25;
  const shown = users.slice(0, maxShow);

  let html = `<div class="forum-active-members">`;
  html += `<div class="forum-active-members__header"><i class="bi bi-people"></i> Anggota Aktif</div>`;
  html += `<div class="forum-active-members__list">`;

  shown.forEach(u => {
    const isLocal = u.isLocal;
    const name = isLocal ? `${u.firstName} (Kamu)` : `${u.firstName} ${u.lastName}`.trim();
    const initial = u.firstName.charAt(0).toUpperCase();
    const imgSrc = u.image || '';

    html += `<div class="forum-active-member ${isLocal ? 'forum-active-member--local' : ''}">`;
    if (imgSrc) {
      html += `<img class="forum-active-member__avatar" src="${imgSrc}" alt="${u.firstName}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect width="36" height="36" rx="18" fill="${'#007aff'}"/><text x="18" y="23" text-anchor="middle" fill="white" font-size="16" font-weight="700">${initial}</text></svg>`)}'" />`;
    } else {
      html += `<div class="forum-active-member__avatar forum-active-member__avatar--fallback">${initial}</div>`;
    }
    html += `<span class="forum-active-member__name">${name}</span>`;
    if (isLocal) {
      html += `<span class="forum-active-member__badge">Kamu</span>`;
    }
    html += `</div>`;
  });

  html += `</div></div>`;
  return html;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function MessageArea(channel, dateStr) {
  return `
    <div class="forum-main">
      <div class="forum-header">
        <span class="forum-header__name"><i class="bi bi-hash" style="font-size:0.9rem;margin-right:0.2rem"></i>${channel.name}</span>
        <span class="forum-header__divider"></span>
        <span class="forum-header__topic">${channel.topic || ''}</span>
      </div>
      <div class="forum-messages" id="js-forum-msgs">
        <div class="forum-msg forum-msg--system">
          <div class="forum-msg__text">${dateStr}</div>
        </div>
        ${channel.messages.length === 0
          ? '<div class="forum-empty" id="js-forum-empty">Belum ada pesan di sini. Mulai diskusi!</div>'
          : channel.messages.map(m => createMsgEl(m).outerHTML).join('')
        }
      </div>
      <div class="forum-input-wrap">
        <input class="forum-input" id="js-forum-input" type="text" placeholder="Ketik pesan... / Send a message..." autocomplete="off" />
      </div>
    </div>
  `;
}

function renderDesktop(el, opts) {
  let { serverName, channels, members, memberCount, memberLimit, forumIndex, backLink, forumId, forumType, activeChannel, activeUsers } = opts;

  function appendMessage(msg) {
    const msgs = el.querySelector('#js-forum-msgs');
    if (!msgs) return;
    const empty = msgs.querySelector('#js-forum-empty');
    if (empty) empty.remove();
    msgs.appendChild(createMsgEl(msg));
    msgs.scrollTop = msgs.scrollHeight;
  }

  function render() {
    const dateStr = formatDate(activeChannel.messages.length > 0 ? activeChannel.messages[0].time : new Date().toISOString());
    el.innerHTML = `
      <a class="forum-back" href="${backLink}" data-link><i class="bi bi-arrow-left"></i> Kembali</a>
      <div class="forum-layout">
        ${ChannelSidebar(serverName, channels, activeChannel.id, forumId, forumType)}
        ${MessageArea(activeChannel, dateStr)}
        ${ActiveMembersPanel(activeUsers, serverName)}
      </div>
    `;

    el.querySelectorAll('.forum-sidebar__channel').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.channel;
        const found = channels.find(c => c.id === id);
        if (found && found.type !== 'voice') {
          activeChannel = found;
          render();
        }
      });
    });

    const followBtn = el.querySelector('#js-forum-follow');
    if (followBtn) {
      followBtn.addEventListener('click', () => {
        const nowFollowing = toggleFollow(forumId, forumType, serverName);
        followBtn.classList.toggle('forum-follow-btn--active', nowFollowing);
        followBtn.querySelector('i').className = `bi ${nowFollowing ? 'bi-bell-fill' : 'bi-bell'}`;
        followBtn.title = nowFollowing ? 'Berhenti mengikuti' : 'Ikuti forum ini';
      });
    }

    const input = el.querySelector('#js-forum-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
          const msg = {
            user: 'Saya',
            text: input.value.trim(),
            time: new Date().toISOString(),
          };
          activeChannel.messages.push(msg);

          const link = getHashPath() + (getHashParams().toString() ? '?' + getHashParams().toString() : '');
          notifyNewMessage(forumId, forumType, serverName, activeChannel.name, 'Saya', msg.text, link);

          input.value = '';
          appendMessage(msg);
        }
      });
    }

    const msgs = el.querySelector('.forum-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  render();
}

function forumStyles() {
  return `
    .forum-channels { margin-bottom: 1rem; }
    .forum-channel-item {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.7rem 0.85rem; margin-bottom: 0.25rem;
      border-radius: 0.6rem; cursor: pointer;
      background: var(--surface, #fff);
      border: 1px solid var(--border-color, #e5e5ea);
      transition: background 0.15s;
      text-decoration: none; color: inherit;
      width: 100%; text-align: left; font: inherit;
    }
    .forum-channel-item:active { background: var(--surface-alt, #f5f5f7); transform: scale(0.99); }
    .forum-channel-item i { font-size: 1rem; color: var(--muted-alt, #8e8e93); width: 1.2rem; text-align: center; }
    .forum-channel-item__name { font-size: 0.9rem; font-weight: 700; }
    .forum-channel-item__count {
      font-size: 0.72rem; color: var(--muted-alt, #8e8e93);
      margin-left: auto; background: var(--surface-alt, #f2f2f7);
      padding: 0.1rem 0.45rem; border-radius: 999px; font-weight: 700;
    }

    .forum-mobile-msgs { padding: 0; flex: 1; overflow-y: auto; min-height: 0; overscroll-behavior: contain; }
    .forum-m-msg {
      display: flex; gap: 0.6rem; padding: 0.5rem 0.85rem;
      animation: fadeInUp 0.2s ease;
    }
    .forum-m-msg__avatar {
      width: 1.8rem; height: 1.8rem; border-radius: 50%;
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 0.65rem; font-weight: 700; flex-shrink: 0; margin-top: 0.1rem;
    }
    .forum-m-msg__body { flex: 1; min-width: 0; }
    .forum-m-msg__user { font-size: 0.82rem; font-weight: 700; }
    .forum-m-msg__time { font-size: 0.6rem; color: var(--muted-alt, #8e8e93); margin-left: 0.4rem; }
    .forum-m-msg__text { font-size: 0.82rem; line-height: 1.5; word-break: break-word; margin-top: 0.05rem; }

    .forum-m-input-wrap {
      display: flex; gap: 0.5rem; padding: 0.6rem 0.85rem;
      border-top: 1px solid var(--border-color);
      background: var(--surface, #fff);
      flex-shrink: 0;
    }
    .forum-m-input {
      flex: 1; padding: 0.55rem 0.85rem;
      border: 1.5px solid var(--border-color, #e5e5ea);
      border-radius: 0.6rem; font: inherit; font-size: 0.85rem;
      outline: none; background: var(--bg, #fafafe);
      transition: border-color 0.15s;
    }
    .forum-m-input:focus { border-color: var(--accent, #007aff); }
    .forum-m-send {
      width: 2.4rem; height: 2.4rem; border-radius: 50%;
      border: none; background: var(--accent, #007aff); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; cursor: pointer; flex-shrink: 0;
      transition: transform 0.15s, opacity 0.15s;
    }
    .forum-m-send:active { transform: scale(0.9); opacity: 0.8; }
    .forum-m-empty {
      padding: 2rem 0.85rem; text-align: center;
      color: var(--muted-alt, #8e8e93); font-size: 0.82rem; font-style: italic;
    }

    .forum-follow-btn {
      background: none; border: 1px solid var(--border-color);
      border-radius: 999px; padding: 0.2rem 0.6rem;
      font-size: 0.75rem; cursor: pointer; color: var(--muted);
      display: inline-flex; align-items: center; gap: 0.3rem;
      transition: all 0.15s;
    }
    .forum-follow-btn--active {
      background: var(--accent-soft); border-color: var(--accent);
      color: var(--accent);
    }

    .forum-active-panel {
      border-top: 1px solid var(--border-color);
      margin-top: 0.75rem;
      padding-top: 0.5rem;
    }
    .forum-active-panel__header {
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--muted-alt);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
  `;
}

function renderMobile(el, opts) {
  const { serverName, channels, members, memberCount, memberLimit, forumIndex, backLink, forumId, forumType, activeUsers } = opts;
  let activeChannel = channels[0];

  if (!document.querySelector('style[data-forum-mobile]')) {
    const s = document.createElement('style');
    s.setAttribute('data-forum-mobile', '');
    s.textContent = forumStyles();
    document.head.appendChild(s);
  }

  function renderActiveMembers() {
    const maxShow = 25;
    const shown = activeUsers.slice(0, maxShow);

    let html = `<div class="forum-member-list">`;
    html += `<p class="forum-member-cat" style="margin-top:0"><i class="bi bi-people"></i> Anggota Aktif (${activeUsers.length})</p>`;

    shown.forEach(u => {
      const isLocal = u.isLocal;
      const name = isLocal ? `${u.firstName} (Kamu)` : `${u.firstName} ${u.lastName}`.trim();
      const initial = u.firstName.charAt(0).toUpperCase();
      const imgSrc = u.image || '';

      html += `<div class="forum-member-item" style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;font-size:0.82rem;">`;
      if (imgSrc) {
        html += `<img src="${imgSrc}" alt="${u.firstName}" style="width:1.8rem;height:1.8rem;border-radius:50%;object-fit:cover;flex-shrink:0" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><rect width="28" height="28" rx="14" fill="${'#007aff'}"/><text x="14" y="19" text-anchor="middle" fill="white" font-size="13" font-weight="700">${initial}</text></svg>`)}'" />`;
      } else {
        html += `<div style="width:1.8rem;height:1.8rem;border-radius:50%;background:var(--accent,#007aff);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;flex-shrink:0">${initial}</div>`;
      }
      html += `<span style="font-weight:600">${name}</span>`;
      if (isLocal) {
        html += `<span style="font-size:0.65rem;color:var(--accent,#007aff);font-weight:700;margin-left:auto">Kamu</span>`;
      }
      html += `</div>`;
    });

    html += `</div>`;
    return html;
  }

  function renderMemberList() {
    const groups = { online: [], idle: [], offline: [] };
    members.forEach(m => { (groups[m.status] || groups.offline).push(m); });
    const labels = { online: 'Online', idle: 'Idle', offline: 'Offline' };
    const dots = { online: 'online', idle: 'idle', offline: 'offline' };

    return `
      ${AvatarStackHtml(memberCount, memberLimit, forumIndex)}
      ${['online', 'idle', 'offline'].filter(g => groups[g].length).map(g => `
        <p class="forum-member-cat">${labels[g]} \u2014 ${groups[g].length}</p>
        ${groups[g].map(m => `
          <a class="forum-member-item" href="/profile?user=${encodeURIComponent(m.name)}" data-link>
            <span class="forum-member-item__dot forum-member-item__dot--${dots[g]}"></span>
            <span class="forum-member-item__name">${m.name}</span>
          </a>
        `).join('')}
      `).join('')}
    `;
  }

  function renderChannelList() {
    const following = isFollowing(forumId, forumType);
    el.innerHTML = `
      <div class="mobile-page__inner">
        <header class="mobile-page__hero" style="padding-bottom:0.5rem">
          <a class="forum-back" href="${backLink}" data-link style="display:inline-flex;align-items:center;gap:0.35rem;font-size:0.82rem;font-weight:600;color:var(--muted,#6b7280);text-decoration:none;margin-bottom:0.5rem">
            <i class="bi bi-arrow-left"></i> Kembali
          </a>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem">
            <div>
              <p class="mobile-page__eyebrow" style="margin-bottom:0.15rem">${serverName}</p>
              <h1 style="margin:0;font-size:1.4rem">Saluran</h1>
            </div>
            <button class="forum-follow-btn ${following ? 'forum-follow-btn--active' : ''}" id="js-forum-follow" type="button">
              <i class="bi ${following ? 'bi-bell-fill' : 'bi-bell'}"></i>
              ${following ? 'Mengikuti' : 'Ikuti'}
            </button>
          </div>
        </header>
        <div class="forum-channels">
          ${channels.filter(c => c.type !== 'voice').map(ch => `
            <button class="forum-channel-item" data-channel="${ch.id}">
              <i class="bi bi-hash"></i>
              <span class="forum-channel-item__name">${ch.name}</span>
              <span class="forum-channel-item__count">${ch.messages.length}</span>
            </button>
          `).join('')}
          ${channels.filter(c => c.type === 'voice').length ? `
            <p style="font-size:0.65rem;font-weight:800;color:var(--muted-alt,#8e8e93);letter-spacing:0.06em;text-transform:uppercase;margin:0.75rem 0 0.25rem 0.25rem">Suara</p>
            ${channels.filter(c => c.type === 'voice').map(ch => `
              <button class="forum-channel-item" data-channel="${ch.id}">
                <i class="bi bi-mic"></i>
                <span class="forum-channel-item__name">${ch.name}</span>
              </button>
            `).join('')}
          ` : ''}
        </div>
        ${members.length ? `
          <p class="mobile-section-title">Anggota (${members.length})</p>
          <div class="forum-member-list">${renderMemberList()}</div>
        ` : ''}
        <div class="forum-active-panel">
          ${renderActiveMembers()}
        </div>
      </div>
    `;

    const followBtn = el.querySelector('#js-forum-follow');
    if (followBtn) {
      followBtn.addEventListener('click', () => {
        const nowFollowing = toggleFollow(forumId, forumType, serverName);
        followBtn.classList.toggle('forum-follow-btn--active', nowFollowing);
        followBtn.innerHTML = `<i class="bi ${nowFollowing ? 'bi-bell-fill' : 'bi-bell'}"></i> ${nowFollowing ? 'Mengikuti' : 'Ikuti'}`;
      });
    }

    el.querySelectorAll('.forum-channel-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.channel;
        const found = channels.find(c => c.id === id);
        if (found) {
          activeChannel = found;
          renderMessages();
        }
      });
    });
  }

  function createMsgEl(msg) {
    const initial = msg.user.charAt(0).toUpperCase();
    const colorIdx = msg.user.length % avatarColors.length;
    const el = document.createElement('div');
    el.className = 'forum-m-msg';
    el.innerHTML = `
      <div class="forum-m-msg__avatar" style="background:${avatarColors[colorIdx]}">${initial}</div>
      <div class="forum-m-msg__body">
        <div>
          <span class="forum-m-msg__user">${msg.user}</span>
          <span class="forum-m-msg__time">${timeAgo(msg.time)}</span>
        </div>
        <div class="forum-m-msg__text">${msg.text}</div>
      </div>
    `;
    return el;
  }

  function appendMessage(msg) {
    const msgs = el.querySelector('#js-m-msgs');
    if (!msgs) return;
    const empty = msgs.querySelector('.forum-m-empty');
    if (empty) empty.remove();
    msgs.appendChild(createMsgEl(msg));
    msgs.scrollTop = msgs.scrollHeight;
  }

  function renderMessages() {
    el.innerHTML = `
      <div style="position:fixed;inset:4.1rem 0 4rem;z-index:110;background:var(--bg,#fafafe);display:flex;flex-direction:column">
        <header style="padding:0.5rem 0.85rem;border-bottom:1px solid var(--border-color);display:flex;align-items:center;gap:0.5rem;flex-shrink:0;background:var(--surface,#fff)">
          <button class="forum-back" id="js-m-back" style="background:none;border:none;font-size:1.1rem;color:var(--accent,#007aff);cursor:pointer;padding:0.25rem">
            <i class="bi bi-chevron-left"></i>
          </button>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.85rem;font-weight:700"># ${activeChannel.name}</div>
            <div style="font-size:0.68rem;color:var(--muted-alt,#8e8e93)">${activeChannel.topic || ''}</div>
          </div>
          ${activeUsers.length ? `
            <button id="js-members-toggle" style="background:none;border:none;font-size:1rem;color:var(--muted-alt);cursor:pointer;padding:0.25rem" aria-label="Anggota">
              <i class="bi bi-people"></i>
            </button>
          ` : ''}
        </header>
        <div class="forum-mobile-msgs" id="js-m-msgs">
          ${activeChannel.messages.length === 0
            ? '<div class="forum-m-empty">Belum ada pesan di sini.</div>'
            : activeChannel.messages.map(m => createMsgEl(m).outerHTML).join('')
          }
        </div>
        <div class="forum-m-input-wrap" style="flex-shrink:0">
          <input class="forum-m-input" id="js-m-input" type="text" placeholder="Ketik pesan..." autocomplete="off" />
          <button class="forum-m-send" id="js-m-send"><i class="bi bi-arrow-up"></i></button>
        </div>
      </div>
    `;

    el.querySelector('#js-m-back').addEventListener('click', renderChannelList);

    if (activeUsers.length) {
      let showingMembers = false;
      const membersToggle = el.querySelector('#js-members-toggle');
      const msgsContainer = el.querySelector('#js-m-msgs');

      membersToggle.addEventListener('click', () => {
        showingMembers = !showingMembers;
        if (showingMembers) {
          const maxShow = 25;
          const shown = activeUsers.slice(0, maxShow);
          let html = `<div class="forum-member-list">`;
          html += `<p class="forum-member-cat" style="margin-top:0"><i class="bi bi-people"></i> Anggota Aktif (${activeUsers.length})</p>`;

          shown.forEach(u => {
            const isLocal = u.isLocal;
            const name = isLocal ? `${u.firstName} (Kamu)` : `${u.firstName} ${u.lastName}`.trim();
            const initial = u.firstName.charAt(0).toUpperCase();
            const imgSrc = u.image || '';

            html += `<div class="forum-member-item" style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;font-size:0.82rem;">`;
            if (imgSrc) {
              html += `<img src="${imgSrc}" alt="${u.firstName}" style="width:1.8rem;height:1.8rem;border-radius:50%;object-fit:cover;flex-shrink:0" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><rect width="28" height="28" rx="14" fill="${'#007aff'}"/><text x="14" y="19" text-anchor="middle" fill="white" font-size="13" font-weight="700">${initial}</text></svg>`)}'" />`;
            } else {
              html += `<div style="width:1.8rem;height:1.8rem;border-radius:50%;background:var(--accent,#007aff);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;flex-shrink:0">${initial}</div>`;
            }
            html += `<span style="font-weight:600">${name}</span>`;
            if (isLocal) {
              html += `<span style="font-size:0.65rem;color:var(--accent,#007aff);font-weight:700;margin-left:auto">Kamu</span>`;
            }
            html += `</div>`;
          });

          html += `</div>`;
          msgsContainer.innerHTML = html;
        } else {
          msgsContainer.innerHTML = activeChannel.messages.length === 0
            ? '<div class="forum-m-empty">Belum ada pesan di sini.</div>'
            : activeChannel.messages.map(m => createMsgEl(m).outerHTML).join('');
          setTimeout(() => {
            const msgs = el.querySelector('#js-m-msgs');
            if (msgs) msgs.scrollTop = msgs.scrollHeight;
          }, 10);
        }
      });
    }

    const input = el.querySelector('#js-m-input');
    const sendBtn = el.querySelector('#js-m-send');
    function sendMsg() {
      if (input.value.trim()) {
        const msg = {
          user: 'Saya',
          text: input.value.trim(),
          time: new Date().toISOString(),
        };
        activeChannel.messages.push(msg);

        const link = getHashPath() + (getHashParams().toString() ? '?' + getHashParams().toString() : '');
        notifyNewMessage(forumId, forumType, serverName, activeChannel.name, 'Saya', msg.text, link);

        input.value = '';
        appendMessage(msg);
        input.focus();
      }
    }
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
    sendBtn.addEventListener('click', sendMsg);

    const msgs = el.querySelector('#js-m-msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
    input.focus();
  }

  renderChannelList();
}

export async function ForumInterior() {
  const params = getHashParams();
  const courseIdx = parseInt(params.get('index'), 10);
  const groupIdx = parseInt(params.get('group'), 10);

  if (isNaN(courseIdx) && isNaN(groupIdx)) {
    const el = document.createElement('section');
    el.className = 'container section';
    el.innerHTML = `<p style="color:var(--muted);text-align:center;padding:3rem 1rem">Forum tidak ditemukan.</p>`;
    return el;
  }

  const isCourse = !isNaN(courseIdx);
  const type = isCourse ? 'course' : 'group';
  const idx = isCourse ? courseIdx : groupIdx;

  const status = getForumStatus(type, idx);
  if (status !== 'joined') {
    navigateTo(`/forum?${isCourse ? 'index' : 'group'}=${idx}`);
    const el = document.createElement('section');
    el.className = 'container section';
    el.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--muted)"><i class="bi bi-arrow-repeat"></i> Mengalihkan...</p>`;
    return el;
  }

  const [forumRes, detailRes, groupsRes] = await Promise.all([
    fetch(asset('/data/forum.json')).then(r => r.json()),
    fetch(asset('/data/detail.json')).then(r => r.json()),
    fetch(asset('/data/groups.json')).then(r => r.json()),
  ]);

  let forumData, serverName, forumId, forumType, forumIndex = 0;
  if (isCourse && forumRes.courses[courseIdx]) {
    forumData = forumRes.courses[courseIdx];
    serverName = detailRes[courseIdx]?.course?.title || 'Forum';
    forumId = 'course-' + courseIdx;
    forumType = 'course';
    forumIndex = courseIdx;
  } else if (!isCourse && forumRes.groups[groupIdx]) {
    forumData = forumRes.groups[groupIdx];
    serverName = groupsRes.groups[groupIdx]?.title || 'Grup';
    forumId = 'group-' + groupIdx;
    forumType = 'group';
    forumIndex = forumRes.courses.length + groupIdx;
  } else {
    navigateTo('/');
    const el = document.createElement('section');
    el.innerHTML = '';
    return el;
  }

  const backLink = forumType === 'group' ? '/groups' : '/';
  const channels = forumData.channels;
  const members = forumData.members;
  const memberCount = forumType === 'group'
    ? (groupsRes.groups[groupIdx]?.members || members.length)
    : (forumData.memberCount || members.length);
  const memberLimit = forumType === 'group'
    ? (groupsRes.groups[groupIdx]?.maxMembers || 100)
    : (forumData.memberLimit || 100);
  const activeChannel = channels[0];

  const activeUsers = await getUsersForContext(forumIndex, 25);

  document.querySelector('#footer').style.display = 'none';
  document.querySelector('#main').style.paddingBottom = '0';

  if (window.innerWidth <= 900) {
    const el = document.createElement('section');
    el.className = 'mobile-page';
    renderMobile(el, { serverName, channels, members, memberCount, memberLimit, forumIndex, activeChannel, backLink, forumId, forumType, activeUsers });
    return el;
  }

  const el = document.createElement('section');
  el.className = 'container';
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.style.minHeight = '0';
  el.style.flex = '1';
  el.style.padding = '0 1.5rem';
  el.style.margin = '0.75rem 0 0';
  renderDesktop(el, { serverName, channels, members, memberCount, memberLimit, forumIndex, activeChannel, backLink, forumId, forumType, activeUsers });
  return el;
}

export { initForumUsers, AvatarStackHtml, populateStacks };
