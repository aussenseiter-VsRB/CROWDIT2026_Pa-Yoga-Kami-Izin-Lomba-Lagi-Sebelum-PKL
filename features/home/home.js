import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { asset, navigateTo } from '../../js/utils/url.js';
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../js/core/config.js';
import { getSession, isAuthenticated } from '../../js/services/auth.js';
import { mergeCourseData } from './js/_utils.js';
import { renderDesktop, renderMobile } from './js/_render.js';
import { bindTopicTabs } from './js/_handlers.js';
import { showCreateForumModal } from '../forum/create-forum/create-forum.js';

injectStyle('/features/home/css/home.css');
injectStyle('/features/home/css/_home-hero.css');
injectStyle('/features/home/css/_home-topics.css');
injectStyle('/features/home/css/_home-forum.css');
injectStyle('/features/home/css/_home-forum-status.css');
injectStyle('/features/home/css/_home-forum-actions.css');
injectStyle('/features/home/css/_home-mobile.css');
injectStyle('/features/home/css/_home-top-group.css');
injectStyle('/features/groups/css/_groups-card.css');

export async function Home() {
  try {
    const [homeData, detailData, groupsData] = await Promise.all([
      fetchData(DATA_PATHS.HOME),
      fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
      fetchData(DATA_PATHS.GROUPS),
    ]);

    const categories = [...new Set(detailData.map(d => d.course?.category).filter(Boolean))].sort();
    const topics = ['Semua Topik', ...categories];

    const forums = homeData.forums.map((f, i) =>
      mergeCourseData(f, detailData[i]?.course, detailData[i]?.participants, i, detailData[i]?.creator)
    );

    const session = getSession();
    const userInterests = session?.interests || [];
    const allInterestMatches = userInterests.length > 0
      ? forums
          .map((f, i) => ({ ...f, _originalIndex: i }))
          .filter(forum =>
            forum.joined !== 'joined' &&
            userInterests.some(interest =>
              (forum.topic || '').toLowerCase().includes(interest.toLowerCase()) ||
              (forum.title || '').toLowerCase().includes(interest.toLowerCase())
            )
          )
      : [];
    const interestForums = allInterestMatches.slice(0, 2);
    const suggestions = allInterestMatches.slice(2, 7);

    const allGroups = [...(groupsData.groups || [])].sort((a, b) => b.members - a.members);
    const topGroup = allGroups.length ? allGroups[0] : null;

    const data = {
      ...homeData,
      topics,
      forums,
      suggestions,
      interestForums,
      topGroup,
      mobile: {
        ...homeData.mobile,
        forums: homeData.mobile.forums.map((f, i) =>
          mergeCourseData(f, detailData[i]?.course, detailData[i]?.participants, i, detailData[i]?.creator)
        ),
      },
    };

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const el = isMobile ? renderMobile(data) : renderDesktop(data);

    bindTopicTabs(el);

    function refresh() {
      Home().then(newEl => {
        el.replaceWith(newEl);
      });
    }

    el.addEventListener('click', (e) => {
      const createBtn = e.target.closest('[data-create-forum]');
      if (createBtn) {
        e.preventDefault();
        if (!isAuthenticated()) {
          navigateTo('/signup');
          return;
        }
        showCreateForumModal({
          topics: topics.filter(t => t !== 'Semua Topik'),
          onCreated: refresh,
        });
        return;
      }
    });

    return el;
  } catch (err) {
    const el = document.createElement('section');
    el.className = 'home-page container section';
    el.innerHTML = `<p class="home-error">Gagal memuat halaman: ${err.message}</p>`;
    return el;
  }
}
