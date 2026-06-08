import { injectStyle } from '../../../js/utils/styleLoader.js';
import { getCourseMessages, sendCourseMessage, seedCourseMessages } from '../../../js/services/course-chat.js';
import { getSession } from '../../../js/services/auth.js';
import { LIMITS } from '../../../js/core/config.js';

injectStyle('/components/ui/course-chat/course-chat.css');

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

function renderMessages(courseIndex, sessionName) {
  const msgs = getCourseMessages(courseIndex);
  if (!msgs.length) {
    return '<div class="course-chat-empty">Belum ada pesan. Jadilah yang pertama!</div>';
  }
  return msgs.map(m => {
    const isMe = m.name === sessionName;
    return `
      <div class="course-chat-bubble ${isMe ? 'course-chat-bubble--me' : 'course-chat-bubble--them'}">
        <div class="course-chat-bubble__name">${escapeHtml(m.name)}</div>
        <div class="course-chat-bubble__text">${escapeHtml(m.text)}</div>
        <div class="course-chat-bubble__time">${formatTime(m.time)}</div>
      </div>
    `;
  }).join('');
}

export function CourseChatBlock(courseIndex, chatData) {
  const session = getSession();
  const sessionName = session ? session.name : 'Anonymous';
  const chatMessages = chatData || [];
  seedCourseMessages(courseIndex, chatMessages);
  const msgsHtml = renderMessages(courseIndex, sessionName);

  return `
    <div class="course-chat" data-course-index="${courseIndex}">
      <div class="course-chat-messages" data-role="messages">
        ${msgsHtml}
      </div>
      <div class="course-chat-compose">
        <input class="course-chat-input" type="text" placeholder="Tulis pesan..." maxlength="${LIMITS.MAX_DM_MESSAGE_LENGTH || 500}" autocomplete="off" />
        <button class="course-chat-send" type="button" aria-label="Kirim"><i class="bi bi-send-fill"></i></button>
      </div>
    </div>
  `;
}

export function initCourseChat(containerEl, courseIndex, chatData) {
  const session = getSession();
  const sessionName = session ? session.name : 'Anonymous';
  seedCourseMessages(courseIndex, chatData || []);

  const chatEl = containerEl.querySelector('.course-chat');
  if (!chatEl) return;

  const messagesEl = chatEl.querySelector('[data-role="messages"]');
  const inputEl = chatEl.querySelector('.course-chat-input');
  const sendBtn = chatEl.querySelector('.course-chat-send');

  function updateMessages() {
    const newHtml = renderMessages(courseIndex, sessionName);
    if (messagesEl) {
      messagesEl.innerHTML = newHtml;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  function send() {
    if (!inputEl) return;
    const text = inputEl.value.trim();
    if (!text) return;
    sendCourseMessage(courseIndex, sessionName, text);
    inputEl.value = '';
    updateMessages();
    inputEl.focus();
  }

  if (sendBtn) sendBtn.addEventListener('click', send);
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') send();
    });
  }

  // Poll for new messages every 3 seconds
  const pollInterval = setInterval(() => {
    updateMessages();
  }, 3000);

  // Cleanup on page navigation
  const observer = new MutationObserver(() => {
    if (!document.body.contains(chatEl)) {
      clearInterval(pollInterval);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Scroll to bottom after render
  setTimeout(() => {
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
  }, 100);
}
