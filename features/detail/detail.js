import { injectStyle } from '../../js/utils/styleLoader.js';
import { getHashParams } from '../../js/utils/url.js';
import { initCourseChat } from '../../components/ui/course-chat/course-chat.js';
import { fetchDetailData, computeLiveData } from './js/_utils.js';
import { renderDetail } from './js/_render.js';
import { attachJoinHandler } from './js/_handlers.js';

injectStyle('/components/ui/avatar/avatar.css');

injectStyle('/features/detail/css/detail.css');
injectStyle('/features/detail/css/_detail-hero.css');
injectStyle('/features/detail/css/_detail-creator.css');
injectStyle('/features/detail/css/_detail-meeting.css');
injectStyle('/features/detail/css/_detail-forum.css');

export async function Detail() {
  const params = getHashParams();
  const index = parseInt(params.get('index'), 10) || 0;
  const simple = params.get('view') === 'simple';

  const { item, users } = await fetchDetailData(index);
  const liveData = computeLiveData(item, index);
  const { participantsLive, forumLive, isJoined, status, statusClass } = liveData;

  const el = renderDetail(item, { participantsLive, forumLive, users, index, isJoined, status, statusClass, simple });

  initCourseChat(el, index, item.chats);
  attachJoinHandler(el, item, index);

  return el;
}
