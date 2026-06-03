export async function About() {
  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = `
    <h1>Tentang Forum</h1>
    <p style="color: var(--muted); max-width: 60ch;">
      Ini adalah ruang belajar bersama untuk saling bantu, berbagi referensi, dan menjaga diskusi tetap rapi.
    </p>
  `;
  return el;
}
