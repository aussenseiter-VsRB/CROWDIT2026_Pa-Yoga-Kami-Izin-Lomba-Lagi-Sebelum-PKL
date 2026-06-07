if (!document.querySelector('link[href="/pages/pages-mobile/dm/dm.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/dm/dm.css';
  document.head.appendChild(link);
}

import { getSession } from '/js/auth.js';
import { nameToEmail, emailToName } from '/js/follow.js';
import { getDMMessages, sendDMMessage } from '/js/dm.js';
import { navigateTo } from '/js/router.js';

export async function DM() {
  const params = new URLSearchParams(window.location.search);
  const otherParam = params.get('user');

  const session = getSession();
  if (!session || !otherParam) {
    navigateTo('/chat');
    return document.createElement('section');
  }

  const otherEmail = otherParam.includes('@') ? otherParam : nameToEmail(otherParam);
  const otherName = emailToName(otherEmail);
  if (!otherEmail) {
    navigateTo('/chat');
    return document.createElement('section');
  }

  function renderMessages() {
    const msgs = getDMMessages(session.email, otherEmail);
    return msgs.length
      ? msgs.map(m => {
          const isMe = m.from === session.email;
          return `
            <div class="dm-bubble ${isMe ? 'dm-bubble--me' : 'dm-bubble--them'}">
              <div class="dm-bubble__text">${escapeHtml(m.text)}</div>
              <div class="dm-bubble__time">${formatTime(m.time)}</div>
            </div>
          `;
        }).join('')
      : '<div class="dm-empty">Belum ada pesan. Kirim pesan pertama!</div>';
  }

  function updateMessages() {
    const container = el.querySelector('.dm-messages');
    container.innerHTML = renderMessages();
    container.scrollTop = container.scrollHeight;
  }

  function send() {
    const input = el.querySelector('.dm-input');
    const text = input.value.trim();
    if (!text) return;
    sendDMMessage(session.email, otherEmail, text);
    input.value = '';
    updateMessages();
    input.focus();
  }

  const el = document.createElement('section');
  el.className = 'dm-page';
  el.innerHTML = `
    <div class="dm-header">
      <button class="dm-header__back" type="button" aria-label="Kembali"><i class="bi bi-arrow-left"></i></button>
      <div class="dm-header__avatar">${otherName.charAt(0).toUpperCase()}</div>
      <div class="dm-header__info">
        <span class="dm-header__name">${escapeHtml(otherName)}</span>
        <span class="dm-header__status">Online</span>
      </div>
    </div>
    <div class="dm-messages">
      ${renderMessages()}
    </div>
    <div class="dm-compose">
      <input class="dm-input" type="text" placeholder="Tulis pesan..." maxlength="500" autocomplete="off" />
      <button class="dm-send" type="button" aria-label="Kirim"><i class="bi bi-send-fill"></i></button>
    </div>
  `;

  el.querySelector('.dm-header__back').addEventListener('click', () => navigateTo('/chat'));
  el.querySelector('.dm-send').addEventListener('click', send);
  el.querySelector('.dm-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });

  setTimeout(() => {
    const container = el.querySelector('.dm-messages');
    container.scrollTop = container.scrollHeight;
  }, 50);

  return el;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function formatTime(iso) {
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
