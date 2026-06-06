if (!document.querySelector('link[href="/pages/pages-desktop/login/login.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/login/login.css';
  document.head.appendChild(link);
}

import { initUsers, login, navigateAfterAuth } from '/js/auth.js';

function field({ type, name, placeholder, icon, autocomplete, inputMode, autocapitalize, spellcheck, hint, toggleable = false, minLength }) {
  const inputId = `login-${name}`;
  const fieldClass = toggleable ? 'login-field login-field--toggleable' : 'login-field';

  return `
    <div class="${fieldClass}">
      <label class="login-field__label" for="${inputId}">${placeholder}</label>
      <span class="login-field__control">
        <input
          id="${inputId}"
          type="${type}"
          name="${name}"
          placeholder="${placeholder}"
          autocomplete="${autocomplete || 'off'}"
          ${inputMode ? `inputmode="${inputMode}"` : ''}
          ${autocapitalize ? `autocapitalize="${autocapitalize}"` : ''}
          ${spellcheck !== undefined ? `spellcheck="${spellcheck}"` : ''}
          ${minLength ? `minlength="${minLength}"` : ''}
          required
        />
        <span class="login-field__icon" aria-hidden="true">${icon}</span>
        ${toggleable ? '<button type="button" class="login-field__toggle" aria-pressed="false" aria-label="Show password">Show</button>' : ''}
      </span>
      ${hint ? `<span class="login-field__hint">${hint}</span>` : ''}
    </div>
  `;
}

function socialIcon(type) {
  if (type === 'apple') {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16.8 12.8c0-2 1.6-3 1.7-3.1-0.9-1.3-2.4-1.5-2.9-1.5-1.3-0.1-2.5 0.8-3.2 0.8-0.7 0-1.7-0.8-2.8-0.8-1.5 0-2.9 0.9-3.7 2.3-1.6 2.7-0.4 6.8 1.1 9 0.8 1.1 1.6 2.4 2.8 2.3 1.1 0 1.5-0.7 2.9-0.7 1.4 0 1.8 0.7 3 0.7 1.2 0 2-1.1 2.8-2.2 0.9-1.3 1.2-2.6 1.2-2.7-0.1 0-2.9-1.1-2.9-3.8z"></path>
        <path d="M15.2 4.7c0.6-0.7 1.1-1.7 1-2.7-0.9 0-1.9 0.6-2.6 1.4-0.6 0.7-1.2 1.7-1.1 2.7 1 0.1 1.9-0.5 2.7-1.4z"></path>
      </svg>
    `;
  }

  if (type === 'google') {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-1.7 2.9v2.4h2.8c1.7-1.6 2.7-4 2.7-6.8 0-.7-.1-1.4-.2-2H12z"></path>
        <path fill="#34A853" d="M12 20c2.4 0 4.5-.8 6-2.1l-2.8-2.4c-.8.5-1.7.8-3.2.8-2.4 0-4.4-1.6-5.1-3.8H4.1v2.4C5.5 18 8.5 20 12 20z"></path>
        <path fill="#FBBC05" d="M6.9 12.5c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V5.9H4.1c-.7 1.4-1.1 2.9-1.1 4.5s.4 3.1 1.1 4.5l2.8-2.4z"></path>
        <path fill="#4285F4" d="M12 7.5c1.3 0 2.4.5 3.3 1.3l2.5-2.5C16.5 4.9 14.4 4 12 4 8.5 4 5.5 6 4.1 9.1l2.8 2.4c.7-2.2 2.7-4 5.1-4z"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-10.4-8.9v6.4h2.5V3.1A9 9 0 0 1 21 12z"></path>
    </svg>
  `;
}

export async function Login() {
  const res = await fetch('/data/login.json');
  const data = await res.json();

  await initUsers();

  const el = document.createElement('section');
  el.className = 'login-page';

  const transition = window.__routeTransition || {};
  const transitionClass = transition.isAuthTransition ? 'login-shell--auth-transition' : '';
  const directionClass = transition.direction === 'to-login' ? 'login-shell--from-right' : 'login-shell--from-left';

  el.innerHTML = `
    <div class="login-shell ${transitionClass} ${directionClass}">
      <div class="login-panel">
        <div class="login-copy">
          <div class="login-mark" aria-hidden="true">${data.copy.mark}</div>
          <h1>${data.copy.title}</h1>
          <p>${data.copy.description}</p>
        </div>

        <form class="login-form" novalidate>
          <div class="login-error" aria-live="polite" hidden></div>
          ${data.fields.map(f => field(f)).join('')}

          <div class="login-meta">
            <label class="login-remember">
              <input type="checkbox" checked />
              <span>${data.meta.rememberLabel}</span>
            </label>
            <a href="${data.meta.forgotHref}" data-link>${data.meta.forgotLabel}</a>
          </div>

          <button class="login-submit" type="submit" disabled>${data.submitText}</button>

          <div class="login-divider"><span>or</span></div>

          <div class="login-socials" aria-label="Alternative login methods">
            ${data.socialButtons.map(type => `
              <button type="button" class="login-social" aria-label="Continue with ${type.charAt(0).toUpperCase() + type.slice(1)}">
                ${socialIcon(type)}
              </button>
            `).join('')}
          </div>

          <p class="login-footer">
            ${data.footer.text}
            <a href="${data.footer.linkHref}" data-link>${data.footer.linkLabel}</a>
          </p>
        </form>
      </div>

      <div class="login-visual" aria-hidden="true">
        <div class="login-visual__glow login-visual__glow--one"></div>
        <div class="login-visual__glow login-visual__glow--two"></div>
        <div class="login-visual__orb login-visual__orb--top"></div>
        <div class="login-visual__orb login-visual__orb--bottom"></div>
      </div>
    </div>
  `;

  const form = el.querySelector('.login-form');
  const submit = el.querySelector('.login-submit');
  const emailInput = el.querySelector('input[name="email"]');
  const passwordInput = el.querySelector('input[name="password"]');
  const passwordToggle = el.querySelector('.login-field__toggle');
  const errorEl = el.querySelector('.login-error');

  const syncSubmitState = () => {
    const isReady = emailInput.validity.valid && passwordInput.validity.valid;
    submit.disabled = !isReady;
  };

  passwordToggle.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    passwordToggle.textContent = isHidden ? 'Hide' : 'Show';
    passwordToggle.setAttribute('aria-pressed', String(isHidden));
    passwordToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    passwordInput.focus({ preventScroll: true });
  });

  form.addEventListener('input', syncSubmitState);
  form.addEventListener('change', syncSubmitState);
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const result = login(emailInput.value, passwordInput.value);

    if (!result.success) {
      errorEl.textContent = result.error;
      errorEl.hidden = false;
      submit.disabled = false;
      submit.textContent = data.submitText;
      return;
    }

    errorEl.hidden = true;
    submit.disabled = true;
    submit.textContent = 'Signing in...';

    window.setTimeout(() => {
      navigateAfterAuth('/profile');
    }, 180);
  });

  syncSubmitState();
  window.requestAnimationFrame(syncSubmitState);
  window.setTimeout(syncSubmitState, 250);

  return el;
}
