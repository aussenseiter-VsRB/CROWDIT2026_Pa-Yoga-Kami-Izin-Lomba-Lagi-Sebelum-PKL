export async function About() {
  const section = document.createElement('section');
  section.classList.add('section', 'about');

  section.innerHTML = `
    <h1>About</h1>
    <p style="font-size:1.1rem;max-width:640px">
      This starter pack provides a clean, minimal foundation for building
      single-page applications with nothing but vanilla JavaScript.
      No frameworks, no build tools — just your code and a browser.
    </p>
  `;

  return section;
}
