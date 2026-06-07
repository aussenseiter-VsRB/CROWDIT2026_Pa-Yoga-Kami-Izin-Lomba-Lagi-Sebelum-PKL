# Conclusion

Proyek ini memakai arsitektur **Vanilla JavaScript SPA** yang sederhana, rapi, dan mudah dikembangkan.
Prinsip utamanya adalah:

- **Data-driven** — konten dari file JSON, rendering terpisah di JS
- **Satu file untuk satu tanggung jawab**
- **Komponen dibuat modular**
- **CSS dipisah per komponen**
- **Routing diatur terpusat** (dua route table: desktop + mobile)
- **Layout utama tidak di-render ulang**

## Struktur Kerja Utama

1. `index.html` menjadi entry point — memuat layout tetap (navbar, top-bar, bottom-bar, footer, `#main`).
2. `js/main.js` menjalankan aplikasi: mount komponen tetap, intercept `[data-link]`, panggil `router()`.
3. `js/router.js` memilih route table berdasarkan viewport (≤900px mobile) dan merender halaman ke `#main`.
4. Navigasi menggunakan `history.pushState()` — URL bersih tanpa `#`.
5. Back/forward browser berfungsi berkat event `popstate`.
6. Router melepas `route-change` custom event; komponen tetap mendengarnya untuk update state.
7. Semua halaman membaca data dari `/data/{page}.json`.

## Struktur File

```txt
studNow/
├── index.html
├── README.md
├── design.md
├── conclusion.md
├── package.json
├── css/
│   └── global.css
├── dist/
│   └── output.css
├── js/
│   ├── main.js             # Bootstrap aplikasi
│   ├── router.js           # Router desktop + mobile
│   ├── auth.js             # Login/register/session (localStorage)
│   ├── search.js           # Fuzzy search engine
│   └── theme.js            # Inisialisasi tema
├── data/                   # Single source of truth — semua konten halaman
│   ├── home.json
│   ├── detail.json
│   ├── groups.json
│   ├── search.json
│   ├── login.json
│   ├── signup.json
│   ├── profile.json
│   ├── chat.json
│   ├── notifications.json
│   ├── about.json
│   ├── contact.json
│   └── users.json
├── pages/
│   ├── pages-desktop/      # Halaman untuk viewport ≥901px
│   │   ├── home/
│   │   │   ├── home.js
│   │   │   ├── home.css
│   │   │   └── detail/
│   │   │       ├── detail.js
│   │   │       └── open.js
│   │   ├── about/about.js
│   │   ├── chat/chat.js
│   │   ├── contact/contact.js
│   │   ├── groups/groups.js + .css
│   │   ├── login/login.js + .css
│   │   ├── notifications/notifications.js
│   │   ├── profile/profile.js
│   │   ├── search/search.js + .css
│   │   └── signup/signup.js + .css
│   └── pages-mobile/       # Halaman untuk viewport ≤900px
│       ├── home/home.js
│       ├── about/about.js
│       ├── chat/chat.js
│       ├── contact/contact.js
│       ├── edit-profile/edit-profile.js
│       ├── groups/groups.js
│       ├── help/help.js
│       ├── login/login.js
│       ├── notifications/notifications.js
│       ├── profile/profile.js
│       ├── search/search.js
│       ├── settings/settings.js
│       └── signup/signup.js
├── components/
│   ├── desktop/
│   │   ├── navbar/navbar.js + .css
│   │   ├── footer/footer.js + .css
│   │   ├── card/card.js + .css
│   │   ├── form-field/form-field.js + .css
│   │   └── page-header/page-header.js + .css
│   ├── mobile/
│   │   ├── top-bar/top-bar.js + .css
│   │   └── bottom-bar/bottom-bar.js + .css
│   └── shared/             # (cadangan)
└── node_modules/
```

## Cara Kerja Coding Ke Depan

### 1. Buat halaman baru

Buat folder di `pages/pages-desktop/nama-halaman/` (dan/atau `pages/pages-mobile/nama-halaman/`).

```txt
pages/pages-desktop/blog/blog.js
pages/pages-desktop/blog/blog.css    # opsional
```

Fungsi utama harus `export async function Blog()` yang mengembalikan DOM element.

### 2. Daftarkan ke router

Update `js/router.js`:

```js
import { Blog as DesktopBlog } from '/pages/pages-desktop/blog/blog.js';
// atau untuk mobile:
import { Blog as MobileBlog } from '/pages/pages-mobile/blog/blog.js';

const desktopRoutes = {
  // ...
  '/blog': DesktopBlog,
};
```

### 3. Buat data JSON

Buat file `/data/blog.json` dengan konten halaman. Halaman akan fetch data tersebut saat di-render.

### 4. Tambahkan link navigasi

```html
<a href="/blog" data-link>Blog</a>
```

`data-link` di-intercept oleh `main.js` yang memanggil `navigateTo()` dengan `history.pushState()`.

### 5. Buat komponen reusable

Kalau fiturnya reusable, simpan di:

```txt
components/desktop/button/
components/mobile/bottom-sheet/
components/shared/modal/
```

Setiap komponen dibuat sebagai fungsi yang mengembalikan DOM element.

### 6. Pisahkan CSS

Setiap komponen idealnya punya file CSS sendiri. Inject via JavaScript dengan pola cek duplikasi:

```js
if (!document.querySelector('link[href="/path/ke/file.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/path/ke/file.css';
  document.head.appendChild(link);
}
```

## Autentikasi

- State disimpan di `localStorage` (`studnow_users` + `studnow_session`).
- `auth.js` menyediakan `initUsers()`, `login()`, `register()`, `logout()`, `getSession()`, `isAuthenticated()`.
- Seed users di `data/users.json` dengan version-gated re-seeding.
- Halaman profile dan halaman yang membutuhkan login harus redirect ke `/login` jika tidak ada session.

## Data JSON

- Semua konten halaman berasal dari file JSON — **bukan hardcoded di JS**.
- Format data konsisten antar halaman.
- Desktop dan mobile berbagi file JSON yang sama; konten spesifik mobile diletakkan di properti `mobile`.
- `data/detail.json` berisi array yang di-link dengan forum di `home.json` via indeks — pastikan urutan konsisten.

## Search Engine

- `js/search.js` mengekspor singleton `searchEngine`.
- Inisialisasi async (`searchEngine.init()`) — mem-fetch home, groups, dan detail, lalu membangun indeks.
- Fuzzy search dengan character n-grams (2-4), field-weighted scoring, dan coverage-ratio multiplier.
- Halaman search menunggu `searchEngine.init()` sebelum mengakses indeks.

## Aturan Ikon

- Semua ikon menggunakan **Bootstrap Icons** (`<i class="bi bi-{nama}">`) — di-load via CDN di `index.html`.
- **Jangan gunakan emoji characters** atau inline SVG untuk ikon.
- Pengecualian: social brand icons (Apple/Google/Facebook) di halaman auth, dan logo StudNow di navbar/top-bar — tetap inline SVG.

## Catatan Server

Karena aplikasi menggunakan History API (URL bersih), server harus berjalan dalam **mode SPA** — semua route diarahkan ke `index.html`.

Sudah otomatis saat pakai `npm run dev` atau `npm run serve` (via `serve -s`).

## Aturan Penting

- Jangan menaruh semua logic di satu file besar.
- Jangan mencampur style global dengan style komponen.
- Jangan menduplikasi code yang bisa dijadikan komponen reusable.
- Jangan re-render navbar, top-bar, bottom-bar, dan footer setiap pindah halaman.
- Jaga nama file tetap konsisten dengan nama foldernya.
- Jangan gunakan emoji characters untuk ikon — gunakan Bootstrap Icons.

## Kesimpulan Akhir

Struktur proyek ini cocok untuk dikembangkan bertahap karena:

- sederhana dan zero-framework
- data-driven (JSON sebagai single source of truth)
- mudah dibaca dan dipisah per fitur
- responsif dengan dua route table terpisah
- gampang di-maintain

**buat halaman -> buat data JSON -> daftarkan ke router -> hubungkan ke layout**
