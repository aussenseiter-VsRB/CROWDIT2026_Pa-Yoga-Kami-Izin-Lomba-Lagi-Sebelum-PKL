export function getCourseChatKey(courseIndex) {
  return 'studnow_course_chat_' + courseIndex;
}

function getSeededKey(courseIndex) {
  return 'studnow_course_chat_seeded_' + courseIndex;
}

export function getCourseMessages(courseIndex) {
  try {
    const raw = localStorage.getItem(getCourseChatKey(courseIndex));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCourseMessages(courseIndex, messages) {
  localStorage.setItem(getCourseChatKey(courseIndex), JSON.stringify(messages));
}

export function sendCourseMessage(courseIndex, name, text) {
  if (!text.trim()) return;
  const messages = getCourseMessages(courseIndex);
  messages.push({
    name: name,
    text: text.trim(),
    time: new Date().toISOString(),
  });
  saveCourseMessages(courseIndex, messages);
  return messages;
}

export function seedCourseMessages(courseIndex, initialMessages) {
  const seeded = localStorage.getItem(getSeededKey(courseIndex));
  if (seeded) return;
  const existing = getCourseMessages(courseIndex);
  if (existing.length > 0) return;
  if (initialMessages && initialMessages.length > 0) {
    saveCourseMessages(courseIndex, initialMessages);
  }
  localStorage.setItem(getSeededKey(courseIndex), '1');
}
