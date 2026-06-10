export function icon(name) {
  const map = {
    'arrow-left': 'bi-arrow-left', 'bell': 'bi-bell', 'lock': 'bi-lock',
    'moon': 'bi-moon', 'globe2': 'bi-globe2', 'trash': 'bi-trash',
    'chevron-right': 'bi-chevron-right', 'shield-check': 'bi-shield-check',
    'bell-fill': 'bi-bell-fill', 'moon-fill': 'bi-moon-fill',
    'lock-fill': 'bi-lock-fill',
    'trash-fill': 'bi-trash-fill',
  };
  return `<i class="bi ${map[name] || 'bi-' + name}"></i>`;
}

export function iconColor(style) {
  const map = { blue: '#007aff', orange: '#ff9f0a', purple: '#5856d6', green: '#34c759', gray: '#8e8e93', red: '#ff3b30' };
  return map[style] || '#8e8e93';
}

export const sectionIcons = {
  notifikasi: 'bell-fill',
  tampilan: 'moon-fill',
  akun: 'lock-fill',
  lainnya: 'trash-fill',
};

export function sectionKey(title) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}
