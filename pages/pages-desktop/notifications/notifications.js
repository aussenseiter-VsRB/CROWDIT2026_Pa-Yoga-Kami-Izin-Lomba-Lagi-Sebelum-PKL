export async function Notifications() {
  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = `
    <p style="color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; margin-bottom: 0.5rem;">Info</p>
    <h1>Notifikasi</h1>
    <p style="color: var(--muted); max-width: 60ch;">
      Tempat menampilkan update, balasan, mention, atau aktivitas terbaru.
    </p>
  `;
  return el;
}
