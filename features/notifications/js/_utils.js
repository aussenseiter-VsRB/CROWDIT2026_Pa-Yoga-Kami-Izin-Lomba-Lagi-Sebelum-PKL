export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'kemarin';
  return `${days}h lalu`;
}

export function notifIcon(type) {
  const map = { forum: 'bi bi-chat-dots', group: 'bi bi-people', course: 'bi bi-book', badge: 'bi bi-star', mention: 'bi bi-at', like: 'bi bi-heart' };
  return map[type] || 'bi bi-bell';
}

export function notifColor(type) {
  const map = { forum: '#007aff', group: '#34c759', course: '#d97706', badge: '#7c3aed', mention: '#007aff', like: '#d97706' };
  return map[type] || '#007aff';
}

export function notifColorClass(type) {
  const map = { forum: 'blue', group: 'green', course: 'orange', badge: 'purple', mention: 'blue', like: 'orange' };
  return map[type] || 'blue';
}
