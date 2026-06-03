export async function Search() {
  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = `
    <p style="color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; margin-bottom: 0.5rem;">Pencarian</p>
    <h1>Cari Konten</h1>
    <p style="color: var(--muted); max-width: 60ch;">
      Halaman ini disiapkan untuk pencarian thread, kategori, dan materi belajar.
    </p>
  `;
  return el;
}
