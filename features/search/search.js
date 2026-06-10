import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { asset } from '../../js/utils/url.js';
import { searchEngine } from '../../js/services/search.js';
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../js/core/config.js';
import { getSession } from '../../js/services/auth.js';
import { mergeCourseData } from '../home/js/_utils.js';
import { renderDesktop, renderMobile } from './js/_render.js';

injectStyle('/css/_shared.css');
injectStyle('/features/search/css/search.css');
injectStyle('/features/search/css/_search-bar.css');
injectStyle('/features/search/css/_search-card.css');
injectStyle('/features/search/css/_search-card-extra.css');
injectStyle('/features/home/css/_home-forum.css');
injectStyle('/features/home/css/_home-forum-status.css');
injectStyle('/features/home/css/_home-forum-actions.css');
injectStyle('/features/home/css/_home-mobile.css');

export async function Search() {
  try {
    await searchEngine.init();
    const [searchData, homeData, detailData] = await Promise.all([
      fetchData(DATA_PATHS.SEARCH),
      fetchData(DATA_PATHS.HOME),
      fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
    ]);

    const categories = [...new Set(searchEngine.index.map(d => d.category).filter(Boolean))].sort();

    const session = getSession();
    const userInterests = session?.interests || [];
    const interestForums = userInterests.length > 0
      ? homeData.forums
          .map((f, i) => ({ ...mergeCourseData(f, detailData[i]?.course, detailData[i]?.participants, i, detailData[i]?.creator), _realIndex: i }))
          .filter(forum =>
            forum.joined !== 'joined' &&
            userInterests.some(interest =>
              (forum.topic || '').toLowerCase().includes(interest.toLowerCase()) ||
              (forum.title || '').toLowerCase().includes(interest.toLowerCase())
            )
          ).slice(0, 4)
      : [];

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    return isMobile ? renderMobile(searchData, interestForums, categories) : renderDesktop(searchData, interestForums, categories);
  } catch {
    const el = document.createElement('section');
    el.style.cssText = 'padding:3rem 0;text-align:center';
    el.innerHTML = '<p style="color:var(--accent-2);font-weight:600">Gagal memuat halaman pencarian.</p>';
    return el;
  }
}
