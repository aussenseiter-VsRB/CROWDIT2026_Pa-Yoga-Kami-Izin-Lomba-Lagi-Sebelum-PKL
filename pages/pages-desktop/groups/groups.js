import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { Card } from '/components/desktop/card/card.js';

export async function Groups() {
  const el = document.createElement('section');
  el.className = 'container section';

  el.innerHTML = `
    <div class="desktop-page">
      <div class="desktop-page__header"></div>
      <div class="card-grid desktop-page__grid"></div>
    </div>
  `;

  el.querySelector('.desktop-page__header').appendChild(
    PageHeader({
      eyebrow: 'Community',
      title: 'Grup Belajar',
      description: 'Kelompokkan diskusi berdasarkan mata pelajaran, topik, atau kelas supaya ruang belajar terasa lebih terarah.',
      actions: [
        { label: 'Browse topics', href: '/search', variant: 'secondary' },
        { label: 'Create group', href: '/signup', variant: 'primary' },
      ],
    }),
  );

  const grid = el.querySelector('.desktop-page__grid');
  grid.appendChild(Card({
    tag: 'Science',
    title: 'STEM Study Rooms',
    description: 'Forum yang padat informasi untuk kelas-kelas teknis, dengan fokus pada materi dan latihan soal.',
  }));
  grid.appendChild(Card({
    tag: 'Arts',
    title: 'Humanities Circle',
    description: 'Ruang diskusi untuk membaca, menyusun argumen, dan berbagi referensi dengan ritme yang santai.',
  }));
  grid.appendChild(Card({
    tag: 'Live',
    title: 'Open Study Sessions',
    description: 'Grup aktif yang bisa dipakai untuk sesi belajar bersama, review tugas, atau persiapan ujian.',
  }));

  return el;
}
