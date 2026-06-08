import { timeAgo, notifIcon, notifColor } from './_utils.js';

export function NotifCard(notif) {
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
