import { PageHeader } from '/components/desktop/page-header/page-header.js';
import { Card } from '/components/desktop/card/card.js';

export async function Chat() {
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
      eyebrow: 'Conversation',
      title: 'Chat',
      description: 'Area diskusi cepat untuk koordinasi, tanya jawab singkat, dan update real-time antar anggota.',
      actions: [
        { label: 'Start thread', href: '/groups', variant: 'secondary' },
        { label: 'Open inbox', href: '/notifications', variant: 'primary' },
      ],
    }),
  );

  const grid = el.querySelector('.desktop-page__grid');
  grid.appendChild(Card({
    tag: 'Online',
    title: 'Balasan cepat',
    description: 'Percakapan dirancang supaya pertanyaan singkat bisa dijawab tanpa harus pindah konteks terlalu jauh.',
  }));
  grid.appendChild(Card({
    tag: 'Pinned',
    title: 'Topik penting',
    description: 'Thread yang perlu perhatian khusus dapat diposisikan lebih tinggi dengan tampilan yang tetap tenang dan rapi.',
  }));
  grid.appendChild(Card({
    tag: 'Focus',
    title: 'Tanpa distraksi',
    description: 'Komponen dan spacing dibuat lapang agar chat tetap mudah dibaca di layar desktop yang lebar.',
  }));

  return el;
}
