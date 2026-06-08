import { getAllNotifications, getUnreadCount } from '../../../js/services/notifications.js';
import { notifColorClass, notifIcon, timeAgo } from './_utils.js';
import { NotifCard } from './_cards.js';
import { bindDesktopNotifEvents, bindMobileNotifEvents } from './_handlers.js';

export function renderDesktop() {
  const el = document.createElement('section');
  el.className = 'container section';

  function render() {
    const notifs = getAllNotifications();
    const unread = getUnreadCount();

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
            ? '<div class="d-notif-empty"><p class="notif-empty-icon"><i class="bi bi-bell"></i></p><p class="notif-empty-title">Belum ada notifikasi</p><p class="notif-empty-desc">Ikuti forum untuk mulai menerima notifikasi</p></div>'
            : notifs.map(NotifCard).join('')
          }
        </div>
      </div>
    `;

    bindDesktopNotifEvents(el, render);
  }

  render();
  window.addEventListener('notifications-update', render, { once: false });
  return el;
}

export function renderMobile() {
  const el = document.createElement('section');
  el.className = 'mobile-page';

  function render() {
    const notifs = getAllNotifications();
    const unread = getUnreadCount();

    el.innerHTML = `
      <div class="mobile-page__inner">
        <header class="mobile-page__hero">
          <p class="mobile-page__eyebrow">Updates</p>
          <div class="notif-mobile-header">
            <h1>Notifikasi</h1>
            ${unread > 0 ? '<button class="mobile-mark-all" id="js-mobile-mark-all" type="button">Tandai semua</button>' : ''}
          </div>
          <p>${unread} notifikasi belum dibaca</p>
        </header>
        <div class="mobile-list">
          ${notifs.length === 0
            ? '<div class="notif-mobile-empty">Belum ada notifikasi. Ikuti forum untuk menerima notifikasi.</div>'
            : notifs.map(card => {
                const type = card.type || 'forum';
                const isUnread = !card.read;
                return `
                  <article class="mobile-notif ${isUnread ? 'mobile-notif--unread' : ''}" data-id="${card.id}">
                    <span class="mobile-notif__icon mobile-notif__icon--${notifColorClass(type)}"><i class="${notifIcon(type)}"></i></span>
                    <div class="mobile-notif__body" ${card.link ? `data-link="${card.link}"` : ''}>
                      <span class="mobile-notif__title">${card.title}</span>
                      <span class="mobile-notif__desc">${card.description}</span>
                    </div>
                    <div class="mobile-notif__actions">
                      <span class="mobile-notif__time">${timeAgo(card.time)}</span>
                      ${isUnread ? '<button class="mobile-notif__mark-read" type="button">Baca</button>' : ''}
                    </div>
                  </article>
                `;
              }).join('')
          }
        </div>
      </div>
    `;

    bindMobileNotifEvents(el, render);
  }

  render();
  window.addEventListener('notifications-update', render, { once: false });
  return el;
}
