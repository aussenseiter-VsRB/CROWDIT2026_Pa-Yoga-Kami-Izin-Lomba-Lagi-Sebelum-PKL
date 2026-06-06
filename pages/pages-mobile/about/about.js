export async function About() {
  const res = await fetch('/data/about.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = `
    <h1>${data.header.title}</h1>
    <p style="color: var(--muted); max-width: 60ch;">
      ${data.header.description}
    </p>
  `;
  return el;
}
