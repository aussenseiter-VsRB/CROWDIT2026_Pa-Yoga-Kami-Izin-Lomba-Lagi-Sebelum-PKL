import { escapeHtml, friendColor, formatConversationTime } from './_utils.js';
import { emailToName } from '../../../../js/services/follow.js';
import { getCustomGroups } from '../../../../js/services/custom-groups.js';

function avatarHtml(name, color, square) {
  const cls = square ? 'chat-avatar chat-avatar--square' : 'chat-avatar';
  return `<div class="${cls}" style="background:${color}">${name.charAt(0).toUpperCase()}</div>`;
}

function resolveGroupName(forum) {
  const key = `${forum.type}_${forum.index}`;
  if (window.__forumNames?.[key]) return window.__forumNames[key];
  if (forum.type === 'group') {
    const custom = getCustomGroups().find(g => g.id === forum.index);
    if (custom?.title) return custom.title;
  }
  return forum.type === 'course' ? `Kursus ${forum.index}` : 'Grup';
}

function mAvatarHtml(name, color, square) {
  const cls = square ? 'chatm-avatar chatm-avatar--square' : 'chatm-avatar';
  return `<div class="${cls}" style="background:${color}">${name.charAt(0).toUpperCase()}</div>`;
}

/* --- Desktop Cards --- */

export function ConversationCard(conv) {
  const name = emailToDisplayName(conv.with);

  const color = friendColor(name);
  const fromMe = conv.fromMe ? '<span class="chat-preview__fromMe">Kamu: </span>' : '';
  const unread = conv.unread > 0
    ? `<div class="chat-unread-badge">${conv.unread > 99 ? '99+' : conv.unread}</div>`
    : '';
  return `
    <a class="chat-card" href="/dm?user=${encodeURIComponent(name)}" data-link>
      <div class="chat-avatar-wrap">
        ${avatarHtml(name, color)}
        ${unread}
      </div>
      <div class="chat-card-body">
        <div class="chat-card-row">
          <span class="chat-name">${name}</span>
          <span class="chat-time">${formatConversationTime(conv.lastTime)}</span>
        </div>
        <div class="chat-preview">${fromMe}${escapeHtml(conv.lastMessage)}</div>
      </div>
    </a>
  `;
}

export function FriendCard(name) {
  const color = friendColor(name);
  return `
    <a class="chat-card" href="/dm?user=${encodeURIComponent(name)}" data-link>
      ${avatarHtml(name, color)}
      <div class="chat-card-body">
        <div class="chat-card-row">
          <span class="chat-name">${name}</span>
          <span class="chat-time">Online</span>
        </div>
        <div class="chat-preview">Teman</div>
      </div>
    </a>
  `;
}

export function ForumCard(forum) {
  const name = resolveGroupName(forum);
  const color = friendColor(name);
  const tag = forum.type === 'course' ? 'Kursus' : 'Grup';
  const tooltip = name ? ` title="${escapeHtml(name)}"` : '';


  return `
    <a class="chat-card" href="/groups-interior?${forum.type === 'course' ? 'index' : 'group'}=${forum.index}" data-link>
      ${avatarHtml(name, color, true)}
      <div class="chat-card-body">
        <div class="chat-card-row">
          <span class="chat-name chat-name--forum"${tooltip}>${name}</span>
          <span class="chat-tag">${tag}</span>
        </div>

        <div class="chat-preview">Bergabung</div>
      </div>
    </a>
  `;
}

/* --- Mobile Cards --- */

export function mConversationCard(conv) {
  const name = emailToDisplayName(conv.with);

  const color = friendColor(name);
  const fromMe = conv.fromMe ? '<span class="chatm-preview__fromMe">Kamu: </span>' : '';
  const unread = conv.unread > 0
    ? `<div class="chatm-unread-badge">${conv.unread > 99 ? '99+' : conv.unread}</div>`
    : '';
  return `
    <a class="chatm-card" href="/dm?user=${encodeURIComponent(name)}" data-link>
      <div class="chatm-avatar-wrap">
        ${mAvatarHtml(name, color)}
        ${unread}
      </div>
      <div class="chat-card-body">
        <div class="chat-card-row">
          <span class="chatm-name">${name}</span>
          <span class="chatm-time">${formatConversationTime(conv.lastTime)}</span>
        </div>
        <div class="chatm-preview">${fromMe}${escapeHtml(conv.lastMessage)}</div>
      </div>
    </a>
  `;
}

export function mFriendCard(name) {
  const color = friendColor(name);
  return `
    <a class="chatm-card" href="/dm?user=${encodeURIComponent(name)}" data-link>
      ${mAvatarHtml(name, color)}
      <div class="chat-card-body">
        <div class="chat-card-row">
          <span class="chatm-name">${name}</span>
          <span class="chatm-time">Online</span>
        </div>
        <div class="chatm-preview">Teman</div>
      </div>
    </a>
  `;
}

export function mForumCard(forum) {
  const name = resolveGroupName(forum);
  const color = friendColor(name);
  const tag = forum.type === 'course' ? 'Kursus' : 'Grup';
  const tooltip = name ? ` title="${escapeHtml(name)}"` : '';


  return `
    <a class="chatm-card" href="/groups-interior?${forum.type === 'course' ? 'index' : 'group'}=${forum.index}" data-link>
      ${mAvatarHtml(name, color, true)}
      <div class="chat-card-body">
        <div class="chat-card-row">
          <span class="chatm-name chat-name--forum"${tooltip}>${name}</span>
          <span class="chat-tag">${tag}</span>
        </div>

        <div class="chatm-preview">Bergabung</div>
      </div>
    </a>
  `;
}

export function mDataCard(card) {
  const color = friendColor(card.title);
  return `
    <article class="chatm-data-card">
      <div class="chatm-data-avatar" style="background:${color}">${(card.title || '?').charAt(0).toUpperCase()}</div>
      <div class="chatm-data-body">
        <div class="chatm-data-title">${card.title}</div>
        <div class="chatm-data-meta">
          <span class="chatm-data-tag">${card.tag}</span>
          <span class="chatm-data-desc">${card.description}</span>
        </div>
      </div>
    </article>
  `;
}
