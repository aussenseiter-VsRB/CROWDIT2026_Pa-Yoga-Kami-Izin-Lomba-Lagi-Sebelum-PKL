import { markAsRead, markAllAsRead, getUnreadCount } from '../../../js/services/notifications.js';
import { notifColorClass, notifIcon, timeAgo } from './_utils.js';

export function bindDesktopNotifEvents(el, renderFn) {
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
      renderFn();
    });
  }
}

export function bindMobileNotifEvents(el, renderFn) {
  el.querySelectorAll('.mobile-notif__body[data-link]').forEach(body => {
    body.addEventListener('click', () => {
      const id = parseInt(body.closest('.mobile-notif').dataset.id);
      markAsRead(id);
      renderFn();
    });
  });

  el.querySelectorAll('.mobile-notif__mark-read').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.closest('.mobile-notif').dataset.id);
      markAsRead(id);
      renderFn();
    });
  });

  const markAllBtn = el.querySelector('#js-mobile-mark-all');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      markAllAsRead();
      renderFn();
    });
  }
}
