const COLORS = ['#007aff', '#5856d6', '#34c759', '#ff9f0a', '#ff3b30', '#af52de'];

function getColor(name) {
  return COLORS[name.length % COLORS.length];
}

function getInitial(name) {
  return (name || 'U').charAt(0).toUpperCase();
}

function fallbackSvg(initial, color) {
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35"><rect width="35" height="35" rx="17.5" fill="${color}"/><text x="17.5" y="22" text-anchor="middle" fill="white" font-size="15" font-weight="700">${initial}</text></svg>`
  );
}

export function renderAvatar(user, size = 'md') {
  const name = user.firstName || user.name || 'User';
  const initial = getInitial(name);
  const color = getColor(name);
  const imgSrc = user.image || '';
  const sizeClass = size !== 'md' ? ` avatar--${size}` : '';

  if (imgSrc) {
    const svg = fallbackSvg(initial, color);
    return `<img class="avatar${sizeClass}" src="${imgSrc}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,${svg}'" />`;
  }
  return `<div class="avatar${sizeClass}" style="background:${color}">${initial}</div>`;
}

export function renderAvatarList(users, count) {
  const list = (users || []).slice(0, count || users.length);
  return list.map(u => renderAvatar(u)).join('');
}
