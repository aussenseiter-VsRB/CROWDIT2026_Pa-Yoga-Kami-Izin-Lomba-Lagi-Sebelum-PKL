export async function Chat() {
  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = `
    <p style="color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; margin-bottom: 0.5rem;">Percakapan</p>
    <h1>Chat</h1>
    <p style="color: var(--muted); max-width: 60ch;">
      Area chat untuk diskusi singkat, tanya jawab cepat, dan koordinasi antar anggota.
    </p>
  `;
  return el;
}
