import { injectStyle } from '../../../js/utils/styleLoader.js';
import { fetchData } from '../../../js/utils/api.js';
import { getSession } from '../../../js/services/auth.js';
import { nameToEmail, emailToName, isBlocked, blockUser, unblockUser } from '../../../js/services/follow.js';
import { getDMMessages, sendDMMessage, markConversationRead, getConversations, editDMMessage, deleteDMMessage } from '../../../js/services/dm.js';
import { getHashParams, navigateTo } from '../../../js/utils/url.js';
import { MOBILE_BREAKPOINT, LIMITS, TIMING } from '../../../js/core/config.js';

injectStyle('/features/chat/dm/dm.css');
injectStyle('/features/chat/dm/_dm-bubbles.css');
injectStyle('/features/chat/dm/_dm-compose.css');
injectStyle('/features/chat/dm/_dm-desktop.css');
injectStyle('/features/chat/dm/_dm-modals.css');

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

function friendColor(name) {
  const colors = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'];
  return colors[name.length % colors.length];
}

function renderReplyBlock(replyTo, allMessages) {
  if (!replyTo) return '';
  const isDeleted = allMessages && !allMessages.some(m => m.time === replyTo.time);
  const text = isDeleted ? 'Pesan telah dihapus' : replyTo.text;
  const extraClass = isDeleted ? ' dm-reply-block__text--deleted' : '';
  return `
    <div class="dm-reply-block" data-reply-time="${escapeHtml(replyTo.time)}">
      <div class="dm-reply-block__sender">\u21A9 ${escapeHtml(replyTo.name)}</div>
      <div class="dm-reply-block__text${extraClass}">${escapeHtml(text)}</div>
    </div>
  `;
}

function renderReplyBar(replyToMsg) {
  if (!replyToMsg) return '';
  const preview = replyToMsg.text.length > 60 ? replyToMsg.text.slice(0, 60) + '...' : replyToMsg.text;
  return `
    <div class="dm-reply-bar">
      <button class="dm-reply-bar__cancel" type="button" aria-label="Batal balas">&times;</button>
      <div class="dm-reply-bar__info">
        <div class="dm-reply-bar__label">\u21A9 Membalas <span class="dm-reply-bar__name">${escapeHtml(replyToMsg.name)}</span></div>
        <div class="dm-reply-bar__preview">${escapeHtml(preview)}</div>
      </div>
    </div>
  `;
}

function createMobileUI(session, otherEmail, otherName) {
  let pollId = null;
  let replyToMsg = null;
  let editingTime = null;

  function renderMessages() {
    const msgs = getDMMessages(session.email, otherEmail);
    return msgs.length
      ? msgs.map(m => {
          const isMe = m.from === session.email;
          const isEditing = editingTime === m.time;

          if (isEditing) {
            return `
              <div class="dm-row dm-row--me" data-msg-time="${escapeHtml(m.time)}">
                <div class="dm-bubble dm-bubble--me" data-msg-time="${escapeHtml(m.time)}">
                  <div class="dm-edit-wrap">
                    <input class="dm-edit-input" value="${escapeHtml(m.text)}" />
                    <div class="dm-edit-actions">
                      <button class="dm-edit-btn dm-edit-save" type="button">Simpan</button>
                      <button class="dm-edit-btn dm-edit-cancel" type="button">Batal</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }

          return `
            <div class="dm-row ${isMe ? 'dm-row--me' : 'dm-row--them'}" data-msg-time="${escapeHtml(m.time)}">
              <div class="dm-bubble ${isMe ? 'dm-bubble--me' : 'dm-bubble--them'}" data-msg-time="${escapeHtml(m.time)}">
                <div class="dm-bubble__reply" data-reply-name="${escapeHtml(emailToName(m.from))}" data-reply-text="${escapeHtml(m.text)}" data-reply-time="${escapeHtml(m.time)}">&#x21A9;</div>
                ${renderReplyBlock(m.replyTo, msgs)}
                <div class="dm-bubble__text">${escapeHtml(m.text)}</div>
                <div class="dm-bubble__time">${formatTime(m.time)}${m.edited ? '<span class="dm-bubble__edited"> (diedit)</span>' : ''}</div>
              </div>
            </div>
          `;
        }).join('')
      : '<div class="dm-empty">Belum ada pesan. Kirim pesan pertama!</div>';
  }

  function updateReplyBar() {
    const container = el.querySelector('.dm-reply-bar-container');
    if (replyToMsg) {
      container.innerHTML = renderReplyBar(replyToMsg);
      container.style.display = '';
      container.querySelector('.dm-reply-bar__cancel').addEventListener('click', cancelReply);
    } else {
      container.innerHTML = '';
      container.style.display = 'none';
    }
  }

  function cancelReply() {
    replyToMsg = null;
    updateReplyBar();
    el.querySelector('.dm-input').focus();
  }

  function setReply(msgData) {
    replyToMsg = msgData;
    updateReplyBar();
    el.querySelector('.dm-input').focus();
  }

  function bindReplyButtons() {
    el.querySelectorAll('.dm-bubble__reply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setReply({ name: btn.dataset.replyName, text: btn.dataset.replyText, time: btn.dataset.replyTime });
      });
    });
  }

  function bindQuoteClicks(container) {
    container.querySelectorAll('.dm-reply-block').forEach(block => {
      block.addEventListener('click', () => {
        const time = block.dataset.replyTime;
        const target = container.querySelector(`.dm-bubble[data-msg-time="${time}"]`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.style.outline = '2px solid var(--accent)';
          target.style.borderRadius = '14px';
          setTimeout(() => { target.style.outline = ''; }, 1500);
        }
      });
    });
  }

  function initSwipe(container) {
    let startX = 0;
    let startY = 0;
    let swipedEl = null;

    container.addEventListener('touchstart', (e) => {
      const bubble = e.target.closest('.dm-bubble');
      if (!bubble) return;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      swipedEl = bubble;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      if (!swipedEl) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (dx > 50 && Math.abs(dy) < 30) {
        const replyBtn = swipedEl.querySelector('.dm-bubble__reply');
        if (replyBtn) replyBtn.click();
      }
      swipedEl = null;
      startX = 0;
      startY = 0;
    }, { passive: true });
  }

  function initLongPress(container) {
    let pressTimer = null;
    let pressTarget = null;
    container.addEventListener('touchstart', (e) => {
      const bubble = e.target.closest('.dm-bubble');
      if (!bubble) return;
      pressTarget = bubble;
      pressTimer = setTimeout(() => {
        showBottomSheet(bubble);
        pressTimer = null;
      }, 500);
    }, { passive: true });
    container.addEventListener('touchmove', () => {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; pressTarget = null; }
    }, { passive: true });
    container.addEventListener('touchend', () => {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; pressTarget = null; }
    }, { passive: true });
  }

  function startEdit(time, text) {
    editingTime = time;
    updateMessages(false);
    const input = el.querySelector('.dm-edit-input');
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }

  function saveEdit(time) {
    const input = el.querySelector('.dm-edit-input');
    if (!input) return;
    const newText = input.value.trim();
    if (!newText) return;
    editDMMessage(session.email, otherEmail, time, newText);
    editingTime = null;
    updateMessages(false);
  }

  function cancelEdit() {
    editingTime = null;
    updateMessages(false);
  }

  function confirmDelete(time) {
    const overlay = document.createElement('div');
    overlay.className = 'dm-overlay';
    overlay.innerHTML = '<div class="dm-dialog"><h3 class="dm-dialog__title">Hapus pesan ini?</h3><div class="dm-dialog__actions"><button class="dm-dialog-btn dm-dialog-btn--delete" data-action="confirm">Hapus</button><button class="dm-dialog-btn dm-dialog-btn--cancel" data-action="cancel">Batal</button></div></div>';
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      deleteDMMessage(session.email, otherEmail, time);
      overlay.remove();
      editingTime = null;
      updateMessages(false);
    });
    overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  }

  function showBottomSheet(bubbleEl) {
    const msgTime = bubbleEl.dataset.msgTime;
    const msgs = getDMMessages(session.email, otherEmail);
    const msg = msgs.find(m => m.time === msgTime);
    if (!msg) return;
    const isMe = msg.from === session.email;
    const overlay = document.createElement('div');
    overlay.className = 'dm-sheet-overlay';
    overlay.innerHTML = '<div class="dm-bottom-sheet">' +
      (isMe ? '<button class="dm-sheet-item" data-action="edit">\u270F\uFE0F Edit Pesan</button>' : '') +
      (isMe ? '<button class="dm-sheet-item dm-sheet-item--danger" data-action="delete">\uD83D\uDDD1\uFE0F Hapus Pesan</button>' : '') +
      '<button class="dm-sheet-item" data-action="reply">\u21A9 Balas</button>' +
      '<button class="dm-sheet-item dm-sheet-cancel" data-action="close">Tutup</button>' +
      '</div>';
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        overlay.remove();
        if (action === 'edit') startEdit(msgTime, msg.text);
        else if (action === 'delete') confirmDelete(msgTime);
        else if (action === 'reply') setReply({ name: emailToName(msg.from), text: msg.text, time: msg.time });
      });
    });
    document.body.appendChild(overlay);
  }

  function bindActionButtons() {
    el.querySelectorAll('.dm-act-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = btn.closest('.dm-row');
        if (!row) return;
        const time = row.dataset.msgTime;
        const msgs = getDMMessages(session.email, otherEmail);
        const msg = msgs.find(m => m.time === time);
        if (!msg) return;
        if (btn.dataset.action === 'edit') startEdit(time, msg.text);
        else if (btn.dataset.action === 'delete') confirmDelete(time);
      });
    });
    el.querySelectorAll('.dm-edit-save').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = btn.closest('.dm-row');
        if (row) saveEdit(row.dataset.msgTime);
      });
    });
    el.querySelectorAll('.dm-edit-cancel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        cancelEdit();
      });
    });
    el.querySelectorAll('.dm-edit-input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cancelEdit();
        if (e.key === 'Enter') {
          const row = input.closest('.dm-row');
          if (row) saveEdit(row.dataset.msgTime);
        }
      });
    });
  }

  function updateMessages(smooth) {
    const container = el.querySelector('.dm-messages');
    const prevCount = container.children.length;
    container.innerHTML = renderMessages();
    bindReplyButtons();
    bindQuoteClicks(container);
    bindActionButtons();
    if (!editingTime) {
      if (smooth && container.children.length > prevCount) {
        container.scrollTop = container.scrollHeight;
      } else if (!smooth) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }

  function poll() {
    const prevCount = el.querySelector('.dm-messages').children.length;
    const msgs = getDMMessages(session.email, otherEmail);
    if (msgs.length !== prevCount) {
      updateMessages(true);
    }
  }

  function startPolling() {
    markConversationRead(session.email, otherEmail);
    pollId = setInterval(poll, 3000);
  }

  function stopPolling() {
    if (pollId) { clearInterval(pollId); pollId = null; }
  }

  function send() {
    if (isBlocked(session.email, otherEmail) || isBlocked(otherEmail, session.email)) return;
    const input = el.querySelector('.dm-input');
    const text = input.value.trim();
    if (!text) return;
    sendDMMessage(session.email, otherEmail, text, replyToMsg);
    input.value = '';
    replyToMsg = null;
    updateReplyBar();
    updateMessages(false);
    input.focus();
  }

  const iBlockedThem = isBlocked(session.email, otherEmail);
  const theyBlockedMe = isBlocked(otherEmail, session.email);
  const blocked = iBlockedThem || theyBlockedMe;

  function renderBlockedBanner() {
    if (iBlockedThem) {
      return `<div class="dm-blocked-banner">Kamu telah memblokir <strong>${escapeHtml(otherName)}</strong>. <button class="dm-blocked-unblock" type="button">Buka blokir</button></div>`;
    }
    return `<div class="dm-blocked-banner"><strong>${escapeHtml(otherName)}</strong> telah memblokir kamu.</div>`;
  }

  function renderComposeArea() {
    if (blocked) return renderBlockedBanner();
    return `
      <div class="dm-compose">
        <input class="dm-input" type="text" placeholder="Tulis pesan..." maxlength="${LIMITS.MAX_DM_MESSAGE_LENGTH}" autocomplete="off" />
        <button class="dm-send" type="button" aria-label="Kirim"><i class="bi bi-send-fill"></i></button>
      </div>
    `;
  }

  const profileUri = '/profile?user=' + encodeURIComponent(otherName);

  const el = document.createElement('section');
  el.className = 'dm-page';

  el.innerHTML = `
    <div class="dm-header">
      <button class="dm-header__back" type="button" aria-label="Kembali"><i class="bi bi-arrow-left"></i></button>
      <div class="dm-header__avatar" style="cursor:pointer" data-link="${profileUri}">${otherName.charAt(0).toUpperCase()}</div>
      <div class="dm-header__info" style="cursor:pointer" data-link="${profileUri}">
        <span class="dm-header__name">${escapeHtml(otherName)}</span>
        <span class="dm-header__status">Online</span>
      </div>
    </div>
    <div class="dm-messages">
      ${renderMessages()}
    </div>
    <div class="dm-reply-bar-container" style="display:none"></div>
    ${renderComposeArea()}
  `;

  el.querySelector('.dm-header__back').addEventListener('click', () => { stopPolling(); navigateTo('/chat'); });
  el.querySelectorAll('[data-link]').forEach(a => {
    a.addEventListener('click', () => { stopPolling(); navigateTo(a.getAttribute('data-link')); });
  });

  const unblockBtn = el.querySelector('.dm-blocked-unblock');
  if (unblockBtn) {
    unblockBtn.addEventListener('click', () => {
      unblockUser(session.email, otherEmail);
      el.querySelector('.dm-reply-bar-container').replaceWith(document.createElement('div'));
      const banner = el.querySelector('.dm-blocked-banner');
      if (banner) banner.remove();
      const composeHtml = `
        <div class="dm-reply-bar-container" style="display:none"></div>
        <div class="dm-compose">
          <input class="dm-input" type="text" placeholder="Tulis pesan..." maxlength="${LIMITS.MAX_DM_MESSAGE_LENGTH}" autocomplete="off" />
          <button class="dm-send" type="button" aria-label="Kirim"><i class="bi bi-send-fill"></i></button>
        </div>
      `;
      el.querySelector('.dm-messages').insertAdjacentHTML('afterend', composeHtml);
      el.querySelector('.dm-send').addEventListener('click', send);
      el.querySelector('.dm-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
      el.querySelector('.dm-input').focus();
    });
  }

  if (!blocked) {
    el.querySelector('.dm-send').addEventListener('click', send);
    el.querySelector('.dm-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  }

  const messagesContainer = el.querySelector('.dm-messages');
  bindReplyButtons();
  bindQuoteClicks(messagesContainer);
  initSwipe(messagesContainer);
  initLongPress(messagesContainer);

  setTimeout(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, TIMING.DM_SCROLL_DELAY);

  startPolling();

  const observer = new MutationObserver(() => {
    if (!document.body.contains(el)) { stopPolling(); observer.disconnect(); }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return el;
}

function renderSidebar(session, otherEmail) {
  const convos = getConversations(session.email);
  if (!convos.length) {
    return '<div class="dm-sidebar-empty">Belum ada percakapan</div>';
  }
  return convos.map(c => {
    const name = emailToName(c.with);
    const initial = name.charAt(0).toUpperCase();
    const color = friendColor(name);
    const isActive = c.with === otherEmail;
    const preview = c.fromMe ? 'Kamu: ' : '';
    return `
      <a href="/dm?user=${encodeURIComponent(name)}" data-link class="dm-sb-item ${isActive ? 'is-active' : ''}">
        <div class="dm-sb-item__avatar-wrap">
          <div class="dm-sb-item__avatar" style="background:${color}">${initial}</div>
          ${c.unread > 0 ? `<div class="dm-sb-item__badge">${c.unread > 99 ? '99+' : c.unread}</div>` : ''}
        </div>
        <div class="dm-sb-item__info">
          <div class="dm-sb-item__top">
            <span class="dm-sb-item__name">${escapeHtml(name)}</span>
            <span class="dm-sb-item__time">${formatTime(c.lastTime)}</span>
          </div>
          <div class="dm-sb-item__preview">${preview}${escapeHtml(c.lastMessage)}</div>
        </div>
      </a>
    `;
  }).join('');
}

function createDesktopUI(session, otherEmail, otherName) {
  let pollId = null;
  let replyToMsg = null;
  let editingTime = null;

  function renderMessages() {
    const msgs = getDMMessages(session.email, otherEmail);
    return msgs.length
      ? msgs.map(m => {
          const isMe = m.from === session.email;
          const isEditing = editingTime === m.time;

          if (isEditing) {
            return `
              <div class="dm-row dm-row--me" data-msg-time="${escapeHtml(m.time)}">
                <div class="dm-row__actions">
                  <button class="dm-act-btn" data-action="edit">\u270F\uFE0F</button>
                  <button class="dm-act-btn" data-action="delete">\uD83D\uDDD1\uFE0F</button>
                </div>
                <div class="dm-bubble dm-bubble--me" data-msg-time="${escapeHtml(m.time)}">
                  <div class="dm-edit-wrap">
                    <input class="dm-edit-input" value="${escapeHtml(m.text)}" />
                    <div class="dm-edit-actions">
                      <button class="dm-edit-btn dm-edit-save" type="button">Simpan</button>
                      <button class="dm-edit-btn dm-edit-cancel" type="button">Batal</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }

          return `
            <div class="dm-row ${isMe ? 'dm-row--me' : 'dm-row--them'}" data-msg-time="${escapeHtml(m.time)}">
              ${isMe ? '<div class="dm-row__actions"><button class="dm-act-btn" data-action="edit">\u270F\uFE0F</button><button class="dm-act-btn" data-action="delete">\uD83D\uDDD1\uFE0F</button></div>' : ''}
              <div class="dm-bubble ${isMe ? 'dm-bubble--me' : 'dm-bubble--them'}" data-msg-time="${escapeHtml(m.time)}">
                <div class="dm-bubble__reply" data-reply-name="${escapeHtml(emailToName(m.from))}" data-reply-text="${escapeHtml(m.text)}" data-reply-time="${escapeHtml(m.time)}">&#x21A9;</div>
                ${renderReplyBlock(m.replyTo, msgs)}
                <div class="dm-bubble__text">${escapeHtml(m.text)}</div>
                <div class="dm-bubble__time">${formatTime(m.time)}${m.edited ? '<span class="dm-bubble__edited"> (diedit)</span>' : ''}</div>
              </div>
            </div>
          `;
        }).join('')
      : '<div class="dm-empty">Belum ada pesan. Kirim pesan pertama!</div>';
  }

  function updateReplyBar() {
    const container = el.querySelector('.dm-reply-bar-container');
    if (replyToMsg) {
      container.innerHTML = renderReplyBar(replyToMsg);
      container.style.display = '';
      container.querySelector('.dm-reply-bar__cancel').addEventListener('click', cancelReply);
    } else {
      container.innerHTML = '';
      container.style.display = 'none';
    }
  }

  function cancelReply() {
    replyToMsg = null;
    updateReplyBar();
    el.querySelector('.dm-input').focus();
  }

  function setReply(msgData) {
    replyToMsg = msgData;
    updateReplyBar();
    el.querySelector('.dm-input').focus();
  }

  function bindReplyButtons() {
    el.querySelectorAll('.dm-bubble__reply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setReply({ name: btn.dataset.replyName, text: btn.dataset.replyText, time: btn.dataset.replyTime });
      });
    });
  }

  function bindQuoteClicks(container) {
    container.querySelectorAll('.dm-reply-block').forEach(block => {
      block.addEventListener('click', () => {
        const time = block.dataset.replyTime;
        const target = container.querySelector(`.dm-bubble[data-msg-time="${time}"]`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.style.outline = '2px solid var(--accent)';
          target.style.borderRadius = '14px';
          setTimeout(() => { target.style.outline = ''; }, 1500);
        }
      });
    });
  }

  function startEdit(time, text) {
    editingTime = time;
    updateMessages(false);
    const input = el.querySelector('.dm-edit-input');
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }

  function saveEdit(time) {
    const input = el.querySelector('.dm-edit-input');
    if (!input) return;
    const newText = input.value.trim();
    if (!newText) return;
    editDMMessage(session.email, otherEmail, time, newText);
    editingTime = null;
    updateMessages(false);
  }

  function cancelEdit() {
    editingTime = null;
    updateMessages(false);
  }

  function confirmDelete(time) {
    const overlay = document.createElement('div');
    overlay.className = 'dm-overlay';
    overlay.innerHTML = '<div class="dm-dialog"><h3 class="dm-dialog__title">Hapus pesan ini?</h3><div class="dm-dialog__actions"><button class="dm-dialog-btn dm-dialog-btn--delete" data-action="confirm">Hapus</button><button class="dm-dialog-btn dm-dialog-btn--cancel" data-action="cancel">Batal</button></div></div>';
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      deleteDMMessage(session.email, otherEmail, time);
      overlay.remove();
      editingTime = null;
      updateMessages(false);
    });
    overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  }

  function bindActionButtons() {
    el.querySelectorAll('.dm-act-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = btn.closest('.dm-row');
        if (!row) return;
        const time = row.dataset.msgTime;
        const msgs = getDMMessages(session.email, otherEmail);
        const msg = msgs.find(m => m.time === time);
        if (!msg) return;
        if (btn.dataset.action === 'edit') startEdit(time, msg.text);
        else if (btn.dataset.action === 'delete') confirmDelete(time);
      });
    });
    el.querySelectorAll('.dm-edit-save').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = btn.closest('.dm-row');
        if (row) saveEdit(row.dataset.msgTime);
      });
    });
    el.querySelectorAll('.dm-edit-cancel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        cancelEdit();
      });
    });
    el.querySelectorAll('.dm-edit-input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cancelEdit();
        if (e.key === 'Enter') {
          const row = input.closest('.dm-row');
          if (row) saveEdit(row.dataset.msgTime);
        }
      });
    });
  }

  function updateMessages(smooth) {
    const container = el.querySelector('.dm-messages');
    const prevCount = container.children.length;
    container.innerHTML = renderMessages();
    bindReplyButtons();
    bindQuoteClicks(container);
    bindActionButtons();
    if (!editingTime) {
      if (smooth && container.children.length > prevCount) {
        container.scrollTop = container.scrollHeight;
      } else if (!smooth) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }

  function poll() {
    const prevCount = el.querySelector('.dm-messages').children.length;
    const msgs = getDMMessages(session.email, otherEmail);
    if (msgs.length !== prevCount) {
      updateMessages(true);
    }
  }

  function startPolling() {
    markConversationRead(session.email, otherEmail);
    pollId = setInterval(poll, 3000);
  }

  function stopPolling() {
    if (pollId) { clearInterval(pollId); pollId = null; }
  }

  function send() {
    if (isBlocked(session.email, otherEmail) || isBlocked(otherEmail, session.email)) return;
    const input = el.querySelector('.dm-input');
    const text = input.value.trim();
    if (!text) return;
    sendDMMessage(session.email, otherEmail, text, replyToMsg);
    input.value = '';
    replyToMsg = null;
    updateReplyBar();
    updateMessages(false);
    input.focus();
  }

  const iBlockedThem = isBlocked(session.email, otherEmail);
  const theyBlockedMe = isBlocked(otherEmail, session.email);
  const blocked = iBlockedThem || theyBlockedMe;

  function renderBlockedBanner() {
    if (iBlockedThem) {
      return `<div class="dm-blocked-banner">Kamu telah memblokir <strong>${escapeHtml(otherName)}</strong>. <button class="dm-blocked-unblock" type="button">Buka blokir</button></div>`;
    }
    return `<div class="dm-blocked-banner"><strong>${escapeHtml(otherName)}</strong> telah memblokir kamu.</div>`;
  }

  function renderComposeArea() {
    if (blocked) return '';
    return `
      <div class="dm-reply-bar-container" style="display:none"></div>
      <div class="dm-dt-compose">
        <input class="dm-input" type="text" placeholder="Tulis pesan..." maxlength="${LIMITS.MAX_DM_MESSAGE_LENGTH}" autocomplete="off" />
        <button class="dm-send" type="button" aria-label="Kirim"><i class="bi bi-send-fill"></i></button>
      </div>
    `;
  }

  const profileUri = '/profile?user=' + encodeURIComponent(otherName);

  const el = document.createElement('section');
  el.className = 'dm-desktop';

  el.innerHTML = `
    <div class="dm-dt-layout">
      <div class="dm-dt-sidebar">
        <div class="dm-dt-sb-header">Pesan Langsung</div>
        <div class="dm-dt-sb-list">
          ${renderSidebar(session, otherEmail)}
        </div>
      </div>
      <div class="dm-dt-main">
        <div class="dm-dt-main-header">
          <button class="dm-dt-back-btn" type="button" aria-label="Kembali"><i class="bi bi-arrow-left"></i></button>
          <div class="dm-dt-main-header__avatar" style="background:${friendColor(otherName)};cursor:pointer" data-link="${profileUri}">${otherName.charAt(0).toUpperCase()}</div>
          <div class="dm-dt-main-header__info" style="cursor:pointer" data-link="${profileUri}">
            <div class="dm-dt-main-header__name">${escapeHtml(otherName)}</div>
            <div class="dm-dt-main-header__status">Online</div>
          </div>
        </div>
        <div class="dm-messages">
          ${renderMessages()}
        </div>
        ${blocked ? renderBlockedBanner() : ''}
        ${renderComposeArea()}
      </div>
    </div>
  `;

  el.querySelector('.dm-dt-back-btn').addEventListener('click', () => { stopPolling(); navigateTo('/chat'); });
  el.querySelectorAll('[data-link]').forEach(a => {
    a.addEventListener('click', () => { stopPolling(); navigateTo(a.getAttribute('data-link')); });
  });

  const unblockBtn = el.querySelector('.dm-blocked-unblock');
  if (unblockBtn) {
    unblockBtn.addEventListener('click', () => {
      unblockUser(session.email, otherEmail);
      const banner = el.querySelector('.dm-blocked-banner');
      if (banner) banner.remove();
      const composeHtml = `
        <div class="dm-reply-bar-container" style="display:none"></div>
        <div class="dm-dt-compose">
          <input class="dm-input" type="text" placeholder="Tulis pesan..." maxlength="${LIMITS.MAX_DM_MESSAGE_LENGTH}" autocomplete="off" />
          <button class="dm-send" type="button" aria-label="Kirim"><i class="bi bi-send-fill"></i></button>
        </div>
      `;
      el.querySelector('.dm-messages').insertAdjacentHTML('afterend', composeHtml);
      el.querySelector('.dm-send').addEventListener('click', send);
      el.querySelector('.dm-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
      el.querySelector('.dm-input').focus();
    });
  }

  if (!blocked) {
    el.querySelector('.dm-send').addEventListener('click', send);
    el.querySelector('.dm-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  }

  const messagesContainer = el.querySelector('.dm-messages');
  bindReplyButtons();
  bindQuoteClicks(messagesContainer);
  bindActionButtons();

  setTimeout(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, TIMING.DM_SCROLL_DELAY);

  startPolling();

  const observer = new MutationObserver(() => {
    if (!document.body.contains(el)) { stopPolling(); observer.disconnect(); }
  });
  observer.observe(document.body, { childList: true, subtree: true });

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

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const pageEl = isMobile ? createMobileUI(session, otherEmail, otherName) : createDesktopUI(session, otherEmail, otherName);
    el.replaceWith(pageEl);
    return pageEl;
  } catch (err) {
    el.innerHTML = '<p style="color:var(--muted);font-weight:600">Gagal memuat pesan.</p>';
    return el;
  }
}
