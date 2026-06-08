import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { searchEngine } from '../../js/services/search.js';
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../js/core/config.js';
import { renderDesktop, renderMobile } from './js/_render.js';

injectStyle('/css/_shared.css');
injectStyle('/features/search/css/search.css');
injectStyle('/features/search/css/_search-bar.css');
injectStyle('/features/search/css/_search-card.css');
injectStyle('/features/search/css/_search-card-extra.css');

export async function Search() {
  try {
    await searchEngine.init();
    const data = await fetchData(DATA_PATHS.SEARCH);
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    return isMobile ? renderMobile(data) : renderDesktop(data);
  } catch {
    const el = document.createElement('section');
    el.style.cssText = 'padding:3rem 0;text-align:center';
    el.innerHTML = '<p style="color:var(--accent-2);font-weight:600">Gagal memuat halaman pencarian.</p>';
    return el;
  }
}
