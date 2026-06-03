export async function Footer() {
  const el = document.createElement('footer');
  el.classList.add('footer');
  el.style.cssText = 'text-align:center;padding:var(--space-md);border-top:1px solid var(--border);color:var(--muted);font-size:0.85rem;margin-top:auto';
  el.innerHTML = `&copy; ${new Date().getFullYear()} MyApp`;
  return el;
}
