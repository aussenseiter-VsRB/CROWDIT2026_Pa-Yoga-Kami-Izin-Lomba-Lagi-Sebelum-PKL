import { injectStyle } from '/js/utils/styleLoader.js';
import { fetchData } from '/js/utils/api.js';
import { getSession } from '/js/auth.js';
import { nameToEmail, emailToName } from '/js/follow.js';
import { getDMMessages, sendDMMessage } from '/js/dm.js';
import { getHashParams } from '/js/utils/url.js';
import { navigateTo } from '/js/utils/url.js';

injectStyle('/features/dm/dm.css');

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

function renderDesktop(session, otherEmail, otherName) {
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
  el.className = 'container section';
  el.style.maxWidth = '720px';
  el.style.margin = '0 auto';
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.style.height = 'calc(100vh - 4rem - 3rem)';

  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.75rem;padding:1rem 0;border-bottom:1px solid var(--border-color);margin-bottom:1rem">
      <button class="dm-back-btn" type="button" aria-label="Kembali" style="background:none;border:none;font-size:1.2rem;color:var(--accent);cursor:pointer;padding:0.25rem;display:flex"><i class="bi bi-arrow-left"></i></button>
      <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0">${otherName.charAt(0).toUpperCase()}</div>
      <div style="display:flex;flex-direction:column">
        <span style="font-weight:700;font-size:1rem;color:var(--text)">${escapeHtml(otherName)}</span>
        <span style="font-size:0.75rem;color:#34c759">Online</span>
      </div>
    </div>
    <div class="dm-messages" style="flex:1;overflow-y:auto;padding:0.5rem 0;display:flex;flex-direction:column;gap:0.5rem;scroll-behavior:smooth">
      ${renderMessages()}
    </div>
    <div style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 0;border-top:1px solid var(--border-color);margin-top:0.5rem">
      <input class="dm-input" type="text" placeholder="Tulis pesan..." maxlength="500" autocomplete="off" style="flex:1;border:1px solid var(--border-color);background:var(--bg-elevated);color:var(--text);font-size:0.9rem;padding:0.65rem 1rem;border-radius:999px;outline:none;font-family:inherit" />
      <button class="dm-send" type="button" aria-label="Kirim" style="background:var(--accent);border:none;color:#fff;width:2.5rem;height:2.5rem;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;flex-shrink:0;transition:opacity 0.15s"><i class="bi bi-send-fill"></i></button>
    </div>
  `;

  el.querySelector('.dm-back-btn').addEventListener('click', () => navigateTo('/chat'));
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

function renderMobile(session, otherEmail, otherName) {
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

export async function DM() {
  const el = document.createElement('section');
  el.style.padding = '3rem 0';
  el.style.textAlign = 'center';
  el.innerHTML = '<p style="color:var(--muted)"><i class="bi bi-arrow-repeat"></i> Memuat...</p>';

  try {
    const params = getHashParams();
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

    const isMobile = window.innerWidth <= 900;
    const pageEl = isMobile ? renderMobile(session, otherEmail, otherName) : renderDesktop(session, otherEmail, otherName);
    el.replaceWith(pageEl);
    return pageEl;
  } catch (err) {
    el.innerHTML = '<p style="color:var(--muted);font-weight:600">Gagal memuat pesan.</p>';
    return el;
  }
}
