import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { asset } from '../../js/utils/url.js';
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../js/core/config.js';
import { mergeCourseData } from './js/_utils.js';
import { renderDesktop, renderMobile } from './js/_render.js';
import { bindTopicTabs } from './js/_handlers.js';

injectStyle('/features/home/css/home.css');
injectStyle('/features/home/css/_home-hero.css');
injectStyle('/features/home/css/_home-topics.css');
injectStyle('/features/home/css/_home-forum.css');
injectStyle('/features/home/css/_home-forum-status.css');
injectStyle('/features/home/css/_home-forum-actions.css');
injectStyle('/features/home/css/_home-mobile.css');

export async function Home() {
  try {
    const [homeData, detailData] = await Promise.all([
      fetchData(DATA_PATHS.HOME),
      fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
    ]);

    const data = {
      ...homeData,
      forums: homeData.forums.map((f, i) =>
        mergeCourseData(f, detailData[i]?.course, detailData[i]?.participants, i)
      ),
      mobile: {
        ...homeData.mobile,
        forums: homeData.mobile.forums.map((f, i) =>
          mergeCourseData(f, detailData[i]?.course, detailData[i]?.participants, i)
        ),
      },
    };

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const el = isMobile ? renderMobile(data) : renderDesktop(data);

    bindTopicTabs(el);

    return el;
  } catch (err) {
    const el = document.createElement('section');
    el.className = 'home-page container section';
    el.innerHTML = `<p class="home-error">Gagal memuat halaman: ${err.message}</p>`;
    return el;
  }
}
