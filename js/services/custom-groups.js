import { STORAGE_KEYS } from '../core/config.js';

const KEY = STORAGE_KEYS.CUSTOM_GROUPS;

export function getCustomGroups() {
  const stored = localStorage.getItem(KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addCustomGroup(group) {
  const groups = getCustomGroups();
  const entry = {
    id: `cg_${Date.now()}`,
    members: 1,
    ...group,
    createdAt: new Date().toISOString(),
  };
  groups.push(entry);
  localStorage.setItem(KEY, JSON.stringify(groups));
  return entry;
}

export function updateCustomGroup(id, updates) {
  const groups = getCustomGroups();
  const idx = groups.findIndex(g => g.id === id);
  if (idx === -1) return null;
  groups[idx] = { ...groups[idx], ...updates, id };
  localStorage.setItem(KEY, JSON.stringify(groups));
  return groups[idx];
}

export function deleteCustomGroup(id) {
  const groups = getCustomGroups();
  const filtered = groups.filter(g => g.id !== id);
  if (filtered.length === groups.length) return false;
  localStorage.setItem(KEY, JSON.stringify(filtered));
  return true;
}

export function mergeWithBaseGroups(baseGroups = []) {
  return [...baseGroups, ...getCustomGroups()];
}
