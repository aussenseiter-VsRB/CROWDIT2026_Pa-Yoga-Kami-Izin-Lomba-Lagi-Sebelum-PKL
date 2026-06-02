# Vanilla JS SPA Starter

A minimal, zero-dependency starter for building single-page applications with pure JavaScript.

## Structure

```
├── index.html              # Entry point — mounts persistent components
├── css/
│   └── global.css          # Reset, variables, base styles, utilities
├── js/
│   ├── main.js             # App bootstrap (mounts navbar/footer, starts router)
│   └── router.js           # Hash-based SPA router
└── components/
    ├── navbar/             # Persistent top navigation
    ├── footer/             # Persistent footer
    ├── card/               # Reusable card component
    ├── form-field/         # Reusable form input/textarea
    └── pages/
        ├── home/           # Home page
        ├── about/          # About page
        └── contact/        # Contact page with form
```

## Getting Started

```bash
npm start       # serves on http://localhost:3000
```

Or with any static file server:

```bash
npx serve . -l 3000
python -m http.server 8000
```

## Architecture

- **No frameworks, no build step** — ES modules loaded directly in the browser.
- **Component pattern** — each component is a function that returns a DOM node. Styles are self-injected via `<link>`.
- **Hash routing** — the router listens for `hashchange` events and swaps content in `#main`.
- **Persistent layout** — `#navbar` and `#footer` are mounted once in `main.js` and never re-rendered.

## Creating a New Page

1. Create a directory in `components/pages/` (e.g. `components/pages/blog/`).
2. Add a `blog.js` that exports an async function returning a DOM element.
3. Import it in `js/router.js` and add it to the `routes` map:
   ```js
   import { Blog } from '/components/pages/blog/blog.js';
   const routes = { '/': Home, '/about': About, '/contact': Contact, '/blog': Blog };
   ```
4. Link to it with `<a href="#/blog" data-link>Blog</a>`.
