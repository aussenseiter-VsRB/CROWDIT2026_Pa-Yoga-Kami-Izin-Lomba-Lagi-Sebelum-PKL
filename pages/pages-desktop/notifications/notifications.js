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
  const map = { forum: '#007aff', group: '#34c759', course: '#d97706', badge: '#7c3aed', mention: '#007aff', like: '#d97706' };
  return map[type] || '#007aff';
}

function NotifCard(notif) {
  return `
    <article class="d-notif-card ${notif.read ? '' : 'd-notif-card--unread'}" data-id="${notif.id}">
      <div class="d-notif-card__icon" style="background:${notifColor(notif.type)}">
        <i class="${notifIcon(notif.type)}"></i>
      </div>
      <div class="d-notif-card__body">
        <div class="d-notif-card__header">
          <span class="d-notif-card__title">${notif.title}</span>
          <span class="d-notif-card__time">${timeAgo(notif.time)}</span>
        </div>
        <p class="d-notif-card__desc">${notif.description}</p>
      </div>
      <div class="d-notif-card__actions">
        <a class="d-notif-card__link" href="${notif.link}" data-link>Lihat</a>
        ${notif.read ? '' : '<button class="d-notif-card__mark-read" type="button" title="Tandai sudah dibaca"><i class="bi bi-check2"></i></button>'}
      </div>
    </article>
  `;
}

export async function Notifications() {
  const el = document.createElement('section');
  el.className = 'container section';

  function render() {
    const notifs = getAllNotifications();
    const unread = getUnreadCount();
    const unreadList = getUnreadNotifications();

    el.innerHTML = `
      <div class="d-notif-page">
        <header class="d-notif-header">
          <div>
            <p class="d-notif-eyebrow">Updates</p>
            <h1>Notifikasi</h1>
            <p class="d-notif-desc">${unread} notifikasi belum dibaca</p>
          </div>
          ${unread > 0 ? '<button class="d-notif-mark-all" id="js-mark-all-read" type="button">Tandai semua sudah dibaca</button>' : ''}
        </header>
        <div class="d-notif-list">
          ${notifs.length === 0
            ? '<div class="d-notif-empty"><p style="font-size:2.5rem;opacity:0.25;margin-bottom:0.5rem"><i class="bi bi-bell"></i></p><p style="font-weight:700">Belum ada notifikasi</p><p style="color:var(--muted-alt)">Ikuti forum untuk mulai menerima notifikasi</p></div>'
            : notifs.map(NotifCard).join('')
          }
        </div>
      </div>
    `;

    el.querySelectorAll('.d-notif-card__mark-read').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.d-notif-card');
        const id = parseInt(card.dataset.id);
        markAsRead(id);
        card.classList.remove('d-notif-card--unread');
        btn.remove();
        const header = el.querySelector('.d-notif-header');
        const unreadCount = getUnreadCount();
        header.querySelector('.d-notif-desc').textContent = unreadCount + ' notifikasi belum dibaca';
        const markAll = header.querySelector('#js-mark-all-read');
        if (unreadCount === 0 && markAll) markAll.remove();
      });
    });

    const markAllBtn = el.querySelector('#js-mark-all-read');
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
