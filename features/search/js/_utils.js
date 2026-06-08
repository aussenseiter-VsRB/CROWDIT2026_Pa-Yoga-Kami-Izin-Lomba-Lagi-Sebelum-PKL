import { LIMITS } from '../../../js/core/config.js';

const ICON_MAP = { Forum: 'chat-dots', Grup: 'people', Kursus: 'book' };
const COLOR_MAP = { Forum: 'blue', Grup: 'purple', Kursus: 'green' };

export function escape(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export function highlight(text, query) {
  if (!query) return escape(text);
  const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return escape(text).replace(re, '<mark>$1</mark>');
}

export function buildDiscoveryData(index) {
  const tagCounts = {};
  const tagIcons = {};
  index.forEach(doc => {
    const allTags = [doc.category, ...doc.tags].filter(Boolean);
    allTags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
      if (!tagIcons[t]) tagIcons[t] = ICON_MAP[doc.type] || 'file-text';
    });
  });

  const trendingTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, LIMITS.MAX_TRENDING_TAGS)
    .map(([label, count]) => ({ label, count, icon: tagIcons[label] || 'fire' }));

  const seen = new Set();
  const suggested = [];
  for (const doc of index) {
    if (suggested.length >= LIMITS.MAX_SUGGESTED_ITEMS) break;
    if (seen.has(doc.title)) continue;
    seen.add(doc.title);
    suggested.push({
      type: doc.type,
      icon: ICON_MAP[doc.type] || 'file-text',
      color: COLOR_MAP[doc.type] || 'blue',
      title: doc.title,
      sub: doc.meta ? `${doc.type === 'Forum' ? 'Forum' : doc.type === 'Grup' ? 'Grup' : 'Kursus'} \u00B7 ${doc.meta}` : doc.type,
      description: doc.description,
      tags: doc.tags,
      stat: doc.meta || '',
      url: doc.url,
    });
  }
  return { trendingTags, suggested };
}
