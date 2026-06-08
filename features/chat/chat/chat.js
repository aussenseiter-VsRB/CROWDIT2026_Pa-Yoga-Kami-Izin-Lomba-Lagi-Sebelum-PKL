import { injectStyle } from '../../../js/utils/styleLoader.js';
import { fetchData } from '../../../js/utils/api.js';
import { asset } from '../../../js/utils/url.js';
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../../js/core/config.js';
import { renderDesktop, renderMobile } from './js/_render.js';

injectStyle('/css/_shared.css');
injectStyle('/css/_shared-chat.css');
injectStyle('/features/chat/chat/css/chat.css');

export async function Chat() {
  try {
    const [data, detailRes, groupsRes] = await Promise.all([
      fetchData(DATA_PATHS.CHAT),
      fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
      fetch(asset(DATA_PATHS.GROUPS)).then(r => r.json()),
    ]);

    window.__forumNames = {};
    detailRes.forEach((item, i) => {
      if (item?.course?.title) window.__forumNames[`course_${i}`] = item.course.title;
    });
    (groupsRes.groups || []).forEach((item, i) => {
      if (item?.title) window.__forumNames[`group_${i}`] = item.title;
    });

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    return isMobile ? renderMobile(data) : renderDesktop(data);
  } catch (err) {
    const el = document.createElement('section');
    el.className = 'container section';
    el.innerHTML = `<p class="chat-error">Gagal memuat halaman: ${err.message}</p>`;
    return el;
  }
}
