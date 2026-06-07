if (!document.querySelector('link[href="/pages/pages-mobile/mobile-page.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-mobile/mobile-page.css';
  document.head.appendChild(link);
}

import { getUnreadNotifications, getAllNotifications, markAsRead, markAllAsRead, getUnreadCount } from '/js/notifications.js';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'kemarin';
  return `${days}h lalu`;
}

function notifIcon(type) {
  const map = { forum: 'bi bi-chat-dots', group: 'bi bi-people', course: 'bi bi-book', badge: 'bi bi-star', mention: 'bi bi-at', like: 'bi bi-heart' };
  return map[type] || 'bi bi-bell';
}

function notifColor(type) {
  const map = { forum: 'blue', group: 'green', course: 'orange', badge: 'purple', mention: 'blue', like: 'orange' };
  return map[type] || 'blue';
}

export async function Notifications() {
  const el = document.createElement('section');
  el.className = 'mobile-page';

  function render() {
    const notifs = getAllNotifications();
    const unread = getUnreadCount();

    el.innerHTML = `
      <div class="mobile-page__inner">
        <header class="mobile-page__hero">
          <p class="mobile-page__eyebrow">Updates</p>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <h1>Notifikasi</h1>
            ${unread > 0 ? '<button class="mobile-mark-all" id="js-mobile-mark-all" style="font-size:0.72rem;background:var(--accent);color:#fff;border:none;border-radius:999px;padding:0.2rem 0.65rem;font-weight:700;cursor:pointer">Tandai semua</button>' : ''}
          </div>
          <p>${unread} notifikasi belum dibaca</p>
        </header>
        <div class="mobile-list">
          ${notifs.length === 0
            ? '<div style="padding:2rem 1.25rem;text-align:center;color:var(--muted-alt);font-size:0.82rem;font-style:italic">Belum ada notifikasi. Ikuti forum untuk menerima notifikasi.</div>'
            : notifs.map((card, i) => {
                const type = card.type || 'forum';
                const isUnread = !card.read;
                return `
                  <article class="mobile-notif ${isUnread ? 'mobile-notif--unread' : ''}" data-id="${card.id}">
                    <span class="mobile-notif__icon mobile-notif__icon--${notifColor(type)}"><i class="${notifIcon(type)}"></i></span>
                    <div class="mobile-notif__body" ${card.link ? `data-link="${card.link}"` : ''}>
                      <span class="mobile-notif__title">${card.title}</span>
                      <span class="mobile-notif__desc">${card.description}</span>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.25rem;flex-shrink:0">
                      <span class="mobile-notif__time">${timeAgo(card.time)}</span>
                      ${isUnread ? '<button class="mobile-notif__mark-read" style="background:none;border:none;color:var(--accent);font-size:0.7rem;cursor:pointer;font-weight:700" title="Tandai dibaca">Baca</button>' : ''}
                    </div>
                  </article>
                `;
              }).join('')
          }
        </div>
      </div>
    `;

    el.querySelectorAll('.mobile-notif__body[data-link]').forEach(body => {
      body.addEventListener('click', () => {
        const id = parseInt(body.closest('.mobile-notif').dataset.id);
        markAsRead(id);
        render();
      });
    });

    el.querySelectorAll('.mobile-notif__mark-read').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.closest('.mobile-notif').dataset.id);
        markAsRead(id);
        render();
      });
    });

    const markAllBtn = el.querySelector('#js-mobile-mark-all');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', () => {
        markAllAsRead();
        render();
      });
    }
  }

  render();
  window.addEventListener('notifications-update', render, { once: false });
  return el;
}
