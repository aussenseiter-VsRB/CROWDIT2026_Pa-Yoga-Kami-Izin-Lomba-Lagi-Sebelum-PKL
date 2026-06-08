import { injectStyle } from '../../js/utils/styleLoader.js';
import { getHashParams } from '../../js/utils/url.js';
import { initCourseChat } from '../../components/ui/course-chat/course-chat.js';
import { fetchOpenData, computeOpenData } from './js/_utils.js';
import { renderOpen } from './js/_render.js';
import { attachJoinHandler } from './js/_handlers.js';

injectStyle('/features/detail/css/detail.css');

export async function Open() {
  const params = getHashParams();
  const index = parseInt(params.get('index'), 10) || 0;

  const { item, users } = await fetchOpenData(index);
  const openData = computeOpenData(item, index);
  const { participantsLive, status, isJoined, statusClass } = openData;

  const el = renderOpen(item, { participantsLive, users, index, isJoined, status, statusClass });

  initCourseChat(el, index, item.chats);
  attachJoinHandler(el, item, index, users, participantsLive);

  return el;
}
