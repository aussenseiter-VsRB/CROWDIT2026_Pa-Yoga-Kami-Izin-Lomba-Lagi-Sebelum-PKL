const KEY = 'studnow_custom_forums';

export function getCustomForums() {
  const stored = localStorage.getItem(KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addCustomForum(forum) {
  const forums = getCustomForums();
  const entry = {
    id: `cf_${Date.now()}`,
    members: 1,
    ...forum,
    createdAt: new Date().toISOString(),
  };
  forums.push(entry);
  localStorage.setItem(KEY, JSON.stringify(forums));
  return entry;
}

export function updateCustomForum(id, updates) {
  const forums = getCustomForums();
  const idx = forums.findIndex(f => f.id === id);
  if (idx === -1) return null;
  forums[idx] = { ...forums[idx], ...updates, id };
  localStorage.setItem(KEY, JSON.stringify(forums));
  return forums[idx];
}

export function deleteCustomForum(id) {
  const forums = getCustomForums();
  const filtered = forums.filter(f => f.id !== id);
  if (filtered.length === forums.length) return false;
  localStorage.setItem(KEY, JSON.stringify(filtered));
  return true;
}

export function mergeWithBaseForums(baseForums = []) {
  return [...baseForums, ...getCustomForums()];
}
