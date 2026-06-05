export async function Groups() {
  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = `
    <p style="color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; margin-bottom: 0.5rem;">Komunitas</p>
    <h1>Grup Belajar</h1>
    <p style="color: var(--muted); max-width: 60ch;">
      Tempat untuk mengelompokkan diskusi berdasarkan mata pelajaran, topik, atau kelas.
    </p>
  `;
  return el;
}
