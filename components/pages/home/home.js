import { Card } from '/components/card/card.js';

export async function Home() {
  const section = document.createElement('section');
  section.classList.add('section', 'home');

  const heading = document.createElement('h1');
  heading.textContent = 'Welcome';
  section.appendChild(heading);

  const intro = document.createElement('p');
  intro.style.cssText = 'font-size:1.1rem;max-width:640px;margin-bottom:var(--space-lg)';
  intro.textContent = 'A vanilla JavaScript SPA starter pack with component-based architecture, hash routing, and zero dependencies.';
  section.appendChild(intro);

  const items = [
    { tag: 'Architecture', title: 'Component-Based', description: 'Self-contained JS + CSS components with no framework overhead.' },
    { tag: 'Pattern', title: 'Hash Routing', description: 'Lightweight SPA router with smooth page transitions.' },
    { tag: 'Design', title: 'Dark Theme', description: 'CSS custom properties for consistent theming across the app.' },
    { tag: 'DX', title: 'Hot Reload Ready', description: 'Works with any static file server for instant feedback.' },
  ];

  const grid = document.createElement('div');
  grid.classList.add('card-grid');
  items.forEach(p => grid.appendChild(Card(p)));
  section.appendChild(grid);

  return section;
}
