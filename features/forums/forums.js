import { injectStyle } from '../../js/utils/styleLoader.js';
import { fetchData } from '../../js/utils/api.js';
import { asset } from '../../js/utils/url.js';
import { DATA_PATHS, MOBILE_BREAKPOINT } from '../../js/core/config.js';
import { getSession, isAuthenticated } from '../../js/services/auth.js';
import { navigateTo } from '../../js/utils/url.js';
import { mergeCourseData } from '../home/js/_utils.js';
import { ForumCard, mForumCard, SuggestionCard, mSuggestionCard } from '../home/js/_cards.js';
import { renderDesktop, renderMobile, injectSuggestions } from './js/_render.js';
import { bindTopicTabs } from '../home/js/_handlers.js';
import { getCustomForums, deleteCustomForum } from '../../js/services/custom-forums.js';
import { showCreateForumModal } from './create-forum/create-forum.js';

injectStyle('/features/home/css/home.css');
injectStyle('/features/home/css/_home-hero.css');
injectStyle('/features/home/css/_home-topics.css');
injectStyle('/features/home/css/_home-forum.css');
injectStyle('/features/home/css/_home-forum-status.css');
injectStyle('/features/home/css/_home-forum-actions.css');
injectStyle('/features/home/css/_home-mobile.css');
injectStyle('/features/forums/css/forums.css');

function mergeCustomForum(cf, index) {
  return {
    id: cf.id,
    title: cf.title,
    description: cf.description,
    status: cf.status || 'Online',
    topic: cf.topic || '',
    joined: 'none',
    participants: {
      joined: cf.members || 1,
      capacity: cf.maxMembers || 100,
    },
  };
}

export async function Forums() {
  try {
    const [homeData, detailData] = await Promise.all([
      fetchData(DATA_PATHS.HOME),
      fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
    ]);

    const baseForums = homeData.forums.map((f, i) =>
      mergeCourseData(f, detailData[i]?.course, detailData[i]?.participants, i, detailData[i]?.creator)
    );

    const customForums = getCustomForums().map((cf, i) =>
      mergeCustomForum(cf, baseForums.length + i)
    );

    const allForums = [...baseForums, ...customForums];

    const session = getSession();
    const userInterests = session?.interests || [];
    const suggestions = userInterests.length > 0
      ? baseForums
          .map((f, i) => ({ ...f, _originalIndex: i }))
          .filter(forum =>
            forum.joined !== 'joined' &&
            userInterests.some(interest =>
              (forum.topic || '').toLowerCase().includes(interest.toLowerCase()) ||
              (forum.title || '').toLowerCase().includes(interest.toLowerCase())
            )
          ).slice(0, 5)
      : [];

    const categories = [...new Set(detailData.map(d => d.course?.category).filter(Boolean))].sort();
    const topics = ['Semua Topik', ...categories];

    const topForum = allForums.reduce((best, f) =>
      (f.participants?.joined || 0) > ((best && best.participants?.joined) || 0) ? f : best, null);

    const catCount = {};
    detailData.forEach(d => { const c = d.course?.category; if (c) catCount[c] = (catCount[c] || 0) + 1; });
    const topCatEntry = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];

    const drCreator = detailData.find(d => d.creator?.name?.includes('Dr.'))?.creator;
    const credibleCreator = drCreator || detailData.find(d => d.creator)?.creator;

    const heroStats = {
      topForum: topForum ? { title: topForum.title, count: topForum.participants?.joined || 0 } : null,
      topCategory: topCatEntry ? { name: topCatEntry[0], count: topCatEntry[1] } : null,
      topCreator: credibleCreator ? { name: credibleCreator.name, username: credibleCreator.username } : null,
    };

    const data = {
      ...homeData,
      topics,
      forums: allForums,
      suggestions,
      heroStats,
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
      Forums().then(newEl => {
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

      const editBtn = e.target.closest('[data-edit-forum]');
      if (editBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = editBtn.getAttribute('data-edit-forum');
        const forum = getCustomForums().find(f => f.id === id);
        if (!forum) return;
        showCreateForumModal({
          topics: topics.filter(t => t !== 'Semua Topik'),
          editForum: forum,
          onCreated: refresh,
        });
        return;
      }

      const deleteBtn = e.target.closest('[data-delete-forum]');
      if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = deleteBtn.getAttribute('data-delete-forum');
        if (!confirm('Hapus forum ini?')) return;
        deleteCustomForum(id);
        refresh();
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
