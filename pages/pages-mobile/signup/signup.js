export async function Signup() {
  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = `
    <p style="color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; margin-bottom: 0.5rem;">Akun</p>
    <h1>Buat Akun</h1>
    <p style="color: var(--muted); max-width: 60ch;">
      Halaman ini bisa dipakai nanti untuk proses pendaftaran pengguna baru.
    </p>
  `;
  return el;
}
