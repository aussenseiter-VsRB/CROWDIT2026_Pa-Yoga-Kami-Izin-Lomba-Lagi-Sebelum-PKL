import { LIMITS } from '../../../js/core/config.js';

export function peopleIcon() {
  return '<i class="bi bi-people"></i>';
}

export function getStatus(members) {
  if (members >= LIMITS.POPULAR_THRESHOLD) return 'popular';
  if (members >= LIMITS.ACTIVE_THRESHOLD) return 'active';
  return 'inactive';
}

export function statusLabel(status) {
  if (status === 'popular') return 'Populer';
  if (status === 'active') return 'Aktif';
  return 'Kurang Aktif';
}

export function memberLabel(members, maxMembers) {
  return members === 0
    ? 'Belum ada anggota'
    : `${members}/${maxMembers} anggota`;
}
