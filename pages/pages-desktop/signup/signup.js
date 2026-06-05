if (!document.querySelector('link[href="/pages/pages-desktop/signup/signup.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/pages/pages-desktop/signup/signup.css';
  document.head.appendChild(link);
}

function field({ type, name, placeholder, icon }) {
  return `
    <label class="signup-field">
      <span class="signup-field__label">${placeholder}</span>
      <span class="signup-field__control">
        <input type="${type}" name="${name}" placeholder="${placeholder}" />
        <span class="signup-field__icon" aria-hidden="true">${icon}</span>
      </span>
    </label>
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

export async function Signup() {
  const el = document.createElement('section');
  el.className = 'signup-page';

  const transition = window.__routeTransition || {};
  const transitionClass = transition.isAuthTransition ? 'signup-shell--auth-transition' : '';
  const directionClass = transition.direction === 'to-signup' ? 'signup-shell--from-right' : 'signup-shell--from-left';

  el.innerHTML = `
    <div class="signup-shell ${transitionClass} ${directionClass}">
      <div class="signup-visual" aria-hidden="true">
        <div class="signup-visual__glow signup-visual__glow--one"></div>
        <div class="signup-visual__glow signup-visual__glow--two"></div>
        <div class="signup-visual__orb signup-visual__orb--top"></div>
        <div class="signup-visual__orb signup-visual__orb--bottom"></div>
      </div>

      <div class="signup-panel">
        <div class="signup-copy">
          <div class="signup-mark" aria-hidden="true">SN</div>
          <h1>Create account</h1>
          <p>Join StudNow and start learning with a calmer, cleaner desktop experience.</p>
        </div>

        <form class="signup-form">
          ${field({
            type: 'text',
            name: 'name',
            placeholder: 'Full name',
            icon: '<span>◌</span>',
          })}
          ${field({
            type: 'email',
            name: 'email',
            placeholder: 'Email',
            icon: '<span>✉</span>',
          })}
          ${field({
            type: 'password',
            name: 'password',
            placeholder: 'Password',
            icon: '<span>◦</span>',
          })}
          ${field({
            type: 'password',
            name: 'confirm_password',
            placeholder: 'Confirm password',
            icon: '<span>◦</span>',
          })}

          <label class="signup-terms">
            <input type="checkbox" checked />
            <span>I agree to the terms and privacy policy</span>
          </label>

          <button class="signup-submit" type="submit">Create account</button>

          <div class="signup-divider"><span>or</span></div>

          <div class="signup-socials" aria-label="Alternative sign up methods">
            <button type="button" class="signup-social" aria-label="Continue with Apple">
              ${socialIcon('apple')}
            </button>
            <button type="button" class="signup-social" aria-label="Continue with Google">
              ${socialIcon('google')}
            </button>
            <button type="button" class="signup-social" aria-label="Continue with Facebook">
              ${socialIcon('facebook')}
            </button>
          </div>

          <p class="signup-footer">
            Already have an account?
            <a href="/login" data-link>Login</a>
          </p>
        </form>
      </div>
    </div>
  `;

  return el;
}
