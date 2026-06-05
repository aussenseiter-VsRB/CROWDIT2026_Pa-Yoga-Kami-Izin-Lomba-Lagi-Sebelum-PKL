export async function Profile() {
  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = `
    <p style="color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; margin-bottom: 0.5rem;">Akun</p>
    <h1>Profil</h1>
    <p style="color: var(--muted); max-width: 60ch;">
      Ringkasan profil pengguna, kontribusi, badge, dan pengaturan akun.
    </p>
  `;
  return el;
}
