if (!document.querySelector('link[href="/pages/pages-desktop/login/login.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/login/login.css';
  document.head.appendChild(link);
}

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
  const el = document.createElement('section');
  el.className = 'login-page';

  const transition = window.__routeTransition || {};
  const transitionClass = transition.isAuthTransition ? 'login-shell--auth-transition' : '';
  const directionClass = transition.direction === 'to-login' ? 'login-shell--from-right' : 'login-shell--from-left';

  el.innerHTML = `
    <div class="login-shell ${transitionClass} ${directionClass}">
      <div class="login-panel">
        <div class="login-copy">
          <div class="login-mark" aria-hidden="true">SN</div>
          <h1>Welcome back</h1>
          <p>Sign in with the email tied to your StudNow account.</p>
        </div>

        <form class="login-form" novalidate>
          ${field({
            type: 'email',
            name: 'email',
            placeholder: 'Email',
            icon: '<span>✉</span>',
            autocomplete: 'email',
            inputMode: 'email',
            autocapitalize: 'none',
            spellcheck: false,
          })}
          ${field({
            type: 'password',
            name: 'password',
            placeholder: 'Password',
            icon: '<span>◦</span>',
            autocomplete: 'current-password',
            spellcheck: false,
            minLength: 8,
            hint: 'Use at least 8 characters for a smoother sign-in.',
            toggleable: true,
          })}

          <div class="login-meta">
            <label class="login-remember">
              <input type="checkbox" checked />
              <span>Remember for 30 days</span>
            </label>
            <a href="/contact" data-link>Forgot password?</a>
          </div>

          <button class="login-submit" type="submit" disabled>Login</button>

          <div class="login-divider"><span>or</span></div>

          <div class="login-socials" aria-label="Alternative login methods">
            <button type="button" class="login-social" aria-label="Continue with Apple">
              ${socialIcon('apple')}
            </button>
            <button type="button" class="login-social" aria-label="Continue with Google">
              ${socialIcon('google')}
            </button>
            <button type="button" class="login-social" aria-label="Continue with Facebook">
              ${socialIcon('facebook')}
            </button>
          </div>

          <p class="login-footer">
            New to StudNow?
            <a href="/signup" data-link>Create an account</a>
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

    submit.disabled = true;
    submit.textContent = 'Signing in...';

    window.setTimeout(() => {
      window.history.pushState(null, '', '/profile');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 180);
  });

  syncSubmitState();
  window.requestAnimationFrame(syncSubmitState);
  window.setTimeout(syncSubmitState, 250);

  return el;
}
