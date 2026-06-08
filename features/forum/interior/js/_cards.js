import { LIMITS } from '../../../../js/core/config.js';
import { isFollowing } from '../../../../js/services/notifications.js';
import { avatarColors, timeAgo } from './_utils.js';

export function AvatarStackHtml(memberCount, memberLimit, forumIndex) {
  const n = Math.min(memberCount, LIMITS.MAX_AVATAR_STACK);
  const fallback = 'https://dummyjson.com/icon/user/28';
  let avatars = '';
  for (let i = 0; i < n; i++) {
    avatars += `<img class="forum-member-avatar" src="${fallback}" alt="" loading="lazy" data-avatar-idx="${i}" />`;
  }
  const remainder = memberCount - n;
  const label = remainder > 0 ? `+${remainder} members` : `${memberCount} members`;
  return `
    <div class="forum-member-stack" data-forum-index="${forumIndex}" data-member-count="${memberCount}">
      <div class="forum-member-avatars">${avatars}</div>
      <span class="forum-member-count">${label}</span>
    </div>
  `;
}

export function MsgEl(msg, variant = 'desktop') {
  const isDesktop = variant === 'desktop';
  const c = isDesktop ? 'forum-msg' : 'forum-m-msg';
  const el = document.createElement('div');
  if (isDesktop && msg.system) {
    el.className = 'forum-msg forum-msg--system';
    el.innerHTML = `<div class="forum-msg__text">${msg.text}</div>`;
    return el;
  }
  const initial = msg.user.charAt(0).toUpperCase();
  const colorIdx = msg.user.length % avatarColors.length;
  el.className = c;
  const text = isDesktop ? msg.text.replace(/https?:\/\/[^\s]+/g, '<a href="$&" target="_blank" rel="noopener">$&</a>') : msg.text;
  const headerOpen = isDesktop ? `<div class="${c}__header">` : '<div>';
  el.innerHTML = `
    <div class="${c}__avatar" style="background:${avatarColors[colorIdx]}">${initial}</div>
    <div class="${c}__body">
      ${headerOpen}
        <span class="${c}__user">${msg.user}</span>
        <span class="${c}__time">${timeAgo(msg.time)}</span>
      </div>
      <div class="${c}__text">${text}</div>
    </div>
  `;
  return el;
}

export function ChannelSidebar(serverName, channels, activeId, forumId, forumType, forumIdx) {
  const textCh = channels.filter(c => c.type !== 'voice');
  const voiceCh = channels.filter(c => c.type === 'voice');
  const following = isFollowing(forumId, forumType);
  return `
    <div class="forum-sidebar">
      <div class="forum-sidebar__server">
        <i class="bi bi-collection"></i> ${serverName}
        <button class="forum-follow-btn ${following ? 'forum-follow-btn--active' : ''}" id="js-forum-follow" type="button" title="${following ? 'Berhenti mengikuti' : 'Ikuti forum ini'}">
          <i class="bi ${following ? 'bi-bell-fill' : 'bi-bell'}"></i>
        </button>
      </div>
      <div class="forum-sidebar__scroll">
        <div class="forum-sidebar__cat">Teks</div>
        ${textCh.map(ch => `
          <button class="forum-sidebar__channel ${ch.id === activeId ? 'forum-sidebar__channel--active' : ''}" data-channel="${ch.id}">
            <i class="bi bi-hash"></i> ${ch.name}
          </button>
        `).join('')}
        ${voiceCh.length ? `<div class="forum-sidebar__cat">Suara</div>` : ''}
        ${voiceCh.map(ch => `
          <button class="forum-sidebar__channel forum-sidebar__channel--voice" data-channel="${ch.id}">
            <i class="bi bi-mic"></i> ${ch.name}
          </button>
        `).join('')}
      </div>
      <button class="forum-leave-btn" id="js-leave-forum" type="button" data-forum-type="${forumType}" data-forum-idx="${forumIdx}">
        <i class="bi bi-box-arrow-left"></i> Tinggalkan Forum
      </button>
    </div>
  `;
}

export function ActiveMembersPanel(users) {
  const shown = users.slice(0, LIMITS.MAX_ACTIVE_MEMBERS);
  let html = `<div class="forum-active-members"><div class="forum-active-members__header"><i class="bi bi-people"></i> Anggota Aktif</div><div class="forum-active-members__list">`;
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
    if (isLocal) html += `<span class="forum-active-member__badge">Kamu</span>`;
    html += `</div>`;
  });
  return html + `</div></div>`;
}

export function MessageArea(channel, dateStr) {
  const msgsHtml = channel.messages.length === 0
    ? '<div class="forum-empty" id="js-forum-empty">Belum ada pesan di sini. Mulai diskusi!</div>'
    : channel.messages.map(m => MsgEl(m).outerHTML).join('');
  return `
    <div class="forum-main">
      <div class="forum-header">
        <span class="forum-header__name"><i class="bi bi-hash"></i> ${channel.name}</span>
        <span class="forum-header__divider"></span>
        <span class="forum-header__topic">${channel.topic || ''}</span>
      </div>
      <div class="forum-messages" id="js-forum-msgs">
        <div class="forum-msg forum-msg--system"><div class="forum-msg__text">${dateStr}</div></div>
        ${msgsHtml}
      </div>
      <div class="forum-input-wrap">
        <input class="forum-input" id="js-forum-input" type="text" placeholder="Ketik pesan... / Send a message..." autocomplete="off" />
      </div>
    </div>
  `;
}

export function MobileActiveMembersHtml(activeUsers) {
  const shown = activeUsers.slice(0, LIMITS.MAX_ACTIVE_MEMBERS);
  let html = `<div class="forum-member-list"><p class="forum-member-cat" style="margin-top:0"><i class="bi bi-people"></i> Anggota Aktif (${activeUsers.length})</p>`;
  shown.forEach(u => {
    const isLocal = u.isLocal;
    const name = isLocal ? `${u.firstName} (Kamu)` : `${u.firstName} ${u.lastName}`.trim();
    const initial = u.firstName.charAt(0).toUpperCase();
    const imgSrc = u.image || '';
    html += `<div class="forum-member-item">`;
    if (imgSrc) {
      html += `<img class="forum-member-avatar-sm" src="${imgSrc}" alt="${u.firstName}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><rect width="28" height="28" rx="14" fill="${'#007aff'}"/><text x="14" y="19" text-anchor="middle" fill="white" font-size="13" font-weight="700">${initial}</text></svg>`)}'" />`;
    } else {
      html += `<div class="forum-member-initial">${initial}</div>`;
    }
    html += `<span class="forum-member-item__name">${name}</span>`;
    if (isLocal) html += `<span class="forum-member-item__badge">Kamu</span>`;
    html += `</div>`;
  });
  return html + `</div>`;
}

export function MobileMemberListHtml(members, memberCount, memberLimit, forumIndex) {
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
