export async function Notifications() {
  const res = await fetch('/data/notifications.json');
  const data = await res.json();

  const el = document.createElement('section');
  el.className = 'container section';
  el.innerHTML = `
    <p style="color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; margin-bottom: 0.5rem;">${data.header.eyebrow}</p>
    <h1>${data.header.title}</h1>
    <p style="color: var(--muted); max-width: 60ch;">
      ${data.header.description}
    </p>
  `;
  return el;
}
