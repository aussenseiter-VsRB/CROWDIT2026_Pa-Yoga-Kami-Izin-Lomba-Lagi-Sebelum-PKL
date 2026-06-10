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

export function mergeWithBaseGroups(baseGroups = []) {
  return [...baseGroups, ...getCustomGroups()];
}
