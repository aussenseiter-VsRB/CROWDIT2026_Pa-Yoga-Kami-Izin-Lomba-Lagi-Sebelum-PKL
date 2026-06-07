import { injectStyle } from '../../js/utils/styleLoader.js';
injectStyle('/features/help/help.css');

import { asset, navigateTo } from '../../js/utils/url.js';
import { isAuthenticated, navigateAfterAuth } from '../../js/auth.js';

function iconArrowLeft() { return '<i class="bi bi-arrow-left"></i>'; }
function iconSearch() { return '<i class="bi bi-search"></i>'; }
function iconChat() { return '<i class="bi bi-chat-dots"></i>'; }
function iconChevron() { return '<i class="bi bi-chevron-right"></i>'; }

export async function Help() {
  if (!isAuthenticated()) {
    navigateAfterAuth('/login');
    return document.createElement('section');
  }

  const data = await (await fetch(asset('/features/help/help.json'))).json();

  const el = document.createElement('section');
  el.className = 'm-help';

  el.innerHTML = `
    <div class="m-help__header">
      <button class="m-help__back" type="button" aria-label="Kembali">${iconArrowLeft()}</button>
      <h1 class="m-help__title">${data.header.title}</h1>
    </div>

    <div class="m-help__search">
      <span class="m-help__search-icon">${iconSearch()}</span>
      <input class="m-help__search-input" type="text" placeholder="${data.searchPlaceholder}" />
    </div>

    <div class="m-help__section">
      <p class="m-help__section-title">${data.faqSectionTitle}</p>
      <div class="m-help__card" id="help-faqs"></div>
    </div>

    <div class="m-help__section">
      <p class="m-help__section-title">${data.contactSectionTitle}</p>
      <div class="m-help__card">
        ${data.contacts.map((c, i) => {
          const tag = c.isRoute ? ' data-link' : '';
          const style = i > 0 ? ' style="border-top:1px solid var(--border-color);padding-top:0.75rem;margin-top:0.5rem"' : '';
          return `<a class="m-help__contact" href="${c.href}"${tag}${style}>
            <span class="m-help__contact-icon${i > 0 ? ' style="background:var(--accent-alt)"' : ''}">${iconChat()}</span>
            <span class="m-help__contact-body">
              <span class="m-help__contact-label">${c.label}</span>
              <span class="m-help__contact-desc">${c.description}</span>
            </span>
            <span class="m-help__contact-chevron">${iconChevron()}</span>
          </a>`;
        }).join('')}
      </div>
    </div>
  `;

  const faqs = data.faqs;

  function renderFaqs(filter = '') {
    const container = el.querySelector('#help-faqs');
    if (!container) return;
    const terms = filter.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = terms.length
      ? faqs.filter(f => terms.some(t => f.q.toLowerCase().includes(t) || f.a.toLowerCase().includes(t)))
      : faqs;
    container.innerHTML = filtered.map((f, i) => `
      <details class="m-help__faq"${i === 0 ? ' open' : ''}>
        <summary class="m-help__faq-summary">
          <span>${f.q}</span>
          <span class="m-help__faq-icon">${iconChevron()}</span>
        </summary>
        <p class="m-help__faq-answer">${f.a}</p>
      </details>
    `).join('');
  }

  renderFaqs();

  const searchInput = el.querySelector('.m-help__search-input');
  searchInput.addEventListener('input', () => renderFaqs(searchInput.value));

  el.querySelector('.m-help__back').addEventListener('click', () => navigateTo('/profile'));

  return el;
}
