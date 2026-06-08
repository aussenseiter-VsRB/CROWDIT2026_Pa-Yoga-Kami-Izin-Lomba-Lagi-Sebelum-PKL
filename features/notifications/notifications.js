import { injectStyle } from '../../js/utils/styleLoader.js';
import { MOBILE_BREAKPOINT } from '../../js/core/config.js';
import { renderDesktop, renderMobile } from './js/_render.js';

injectStyle('/css/_shared.css');
injectStyle('/css/_shared-activity.css');
injectStyle('/features/notifications/css/notifications.css');
injectStyle('/features/notifications/css/_notifications-card.css');

export async function Notifications() {
  const el = document.createElement('section');
  el.className = 'notif-loading';
  el.innerHTML = '<p><i class="bi bi-arrow-repeat"></i> Memuat...</p>';

  try {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const pageEl = isMobile ? renderMobile() : renderDesktop();
    el.replaceWith(pageEl);
    return pageEl;
  } catch (err) {
    el.innerHTML = `<p class="notif-error">Gagal memuat notifikasi: ${err.message}</p>`;
    return el;
  }
}
