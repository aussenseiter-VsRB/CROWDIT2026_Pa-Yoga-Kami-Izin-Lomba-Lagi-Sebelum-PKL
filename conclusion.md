# StudNow — Conclusion

Proyek ini menggunakan arsitektur **Vanilla JavaScript SPA** tanpa framework, dengan prinsip utama:

- **Feature-based** — setiap fitur punya folder sendiri berisi JS, CSS, dan JSON
- **Data-driven** — semua konten halaman berasal dari file JSON, tidak ada hardcode di JS
- **Modular** — setiap file punya satu tanggung jawab
- **CSS terbatas** — tidak ada file CSS yang melebihi ~150 baris; gunakan partials jika perlu
- **Routing terpusat** — satu route table, setiap halaman menangani viewport sendiri
- **Layout utama tidak di-render ulang** — navbar, top-bar, bottom-bar, footer hanya di-mount sekali

---

## Struktur Folder

```txt
studNow/
├── index.html                    # Entry point — memuat layout utama + Bootstrap Icons CDN
├── css/
│   └── global.css                # Sumber Tailwind + custom properties (maks ~200 baris)
├── dist/
│   └── output.css                # Hasil build Tailwind (jangan diedit manual)
├── js/
│   ├── main.js                   # Bootstrap: mount komponen tetap, intercept navigasi
│   ├── router.js                 # Route table tunggal, render halaman ke #main
│   ├── auth.js                   # Login, register, logout, session (localStorage)
│   ├── search.js                 # Fuzzy search engine (n-gram, field-weighted)
│   ├── theme.js                  # Inisialisasi tema
│   ├── notifications.js          # Manajemen notifikasi
│   └── utils/
│       ├── dom.js                # Helper DOM (createElement, query shortcuts)
│       ├── format.js             # Format tanggal, angka, string
│       ├── api.js                # Fetch wrapper dengan loading/error state
│       ├── styleLoader.js        # Inject CSS tanpa duplikasi
│       └── url.js                # Hash routing utilities (getHashPath, getHashParams, navigateTo)
├── css/
│   └── _shared.css               # Shared mobile layout (mobile-page, mobile-card, dll)
├── data/                         # Data cross-feature / shared
│   └── users.json                # Seed users (version-gated)
├── features/                     # Satu folder per fitur — berisi JS, CSS, dan JSON
│   ├── about/
│   │   ├── about.js
│   │   ├── about.css
│   │   └── about.json
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.js
│   │   │   ├── login.css
│   │   │   └── login.json
│   │   └── signup/
│   │       ├── signup.js
│   │       ├── signup.css
│   │       └── signup.json
│   ├── chat/
│   │   ├── chat.js
│   │   ├── chat.css
│   │   └── chat.json
│   ├── contact/
│   │   ├── contact.js
│   │   ├── contact.css
│   │   └── contact.json
│   ├── detail/
│   │   ├── detail.js
│   │   ├── detail.css
│   │   └── detail.json           # Array 10 kursus — terhubung ke forum di home.json via indeks
│   ├── dm/
│   │   ├── dm.js
│   │   └── dm.css
│   ├── edit-profile/
│   │   ├── edit-profile.js
│   │   └── edit-profile.css
│   ├── forum/
│   │   ├── forum.js
│   │   ├── forum.css
│   │   └── forum.json
│   ├── groups/
│   │   ├── groups.js
│   │   ├── groups.css
│   │   └── groups.json
│   ├── help/
│   │   ├── help.js
│   │   └── help.css
│   ├── home/
│   │   ├── home.js
│   │   ├── home.css              # Layout/komposisi saja (~100 baris)
│   │   └── home.json
│   ├── notifications/
│   │   ├── notifications.js
│   │   ├── notifications.css
│   │   └── notifications.json
│   ├── open/
│   │   └── open.js
│   ├── profile/
│   │   ├── profile.js
│   │   ├── profile.css
│   │   └── profile.json
│   ├── search/
│   │   ├── search.js
│   │   ├── search.css
│   │   └── search.json
│   └── settings/
│       ├── settings.js
│       └── settings.css
└── components/                   # Komponen yang dipakai oleh 2+ fitur
    ├── navbar/navbar.js + .css
    ├── top-bar/top-bar.js + .css
    ├── bottom-bar/bottom-bar.js + .css
    ├── footer/footer.js + .css
    ├── card/card.js + .css
    ├── form-field/form-field.js + .css
    ├── page-header/page-header.js + .css
    ├── tambah-minat/tambah-minat.js + .css
    └── qr-modal/qr-modal.js + .css
```

---

## Routing

- Menggunakan **Hash Routing** (`/#/route`) untuk kompatibilitas penuh dengan GitHub Pages
- Router mendengar `hashchange` event — bukan `popstate`
- `navigateTo(path)` dari `js/utils/url.js` adalah satu-satunya fungsi yang boleh mengubah URL
- Path selalu ditulis sebagai clean path (`/forum`) — hash prefix ditangani oleh `navigateTo()`
- `getHashPath()` mengembalikan path tanpa hash dan tanpa query string (e.g. `/forum`)
- `getHashParams()` mengembalikan `URLSearchParams` dari hash query string
- Jangan pernah menulis `window.location.pathname`, `history.pushState()`, atau `window.location.hash` langsung di luar `js/utils/url.js`
- Back/forward browser tetap berfungsi karena browser merekam setiap perubahan hash di history stack

## Alur Kerja Aplikasi

1. `index.html` memuat layout utama (navbar, top-bar, bottom-bar, footer, `#main`).
2. `js/main.js` menginisialisasi app: mount komponen tetap, intercept klik `[data-link]`, panggil `router()`.
3. `js/router.js` menggunakan satu route table — setiap halaman mengecek viewport (`isMobile`) untuk menampilkan versi yang sesuai.
4. Navigasi menggunakan **hash routing** (`/#/route`) — URL bersih tanpa query string di pathname.
5. Tombol back/forward browser berfungsi berkat `hashchange` event.
6. Router melepas `route-change` custom event; navbar, top-bar, bottom-bar, dan footer mendengarnya untuk update state.
7. Semua halaman membaca data dari file JSON miliknya sendiri di folder `features/`.

---

## Cara Kerja Coding ke Depan

### 1. Tambah halaman baru

Buat folder di `features/nama-halaman/`:

```txt
features/blog/
├── blog.js
├── blog.css
└── blog.json
```

Fungsi utama harus `export async function Blog()` yang mengembalikan DOM element dan menangani desktop + mobile:

```js
import { fetchData } from '/js/utils/api.js';
import { injectStyle } from '/js/utils/styleLoader.js';

export async function Blog() {
  injectStyle('/features/blog/blog.css');
  const container = document.createElement('div');
  container.innerHTML = '<div class="loading">Memuat...</div>';
  try {
    const data = await fetchData('/features/blog/blog.json');
    const isMobile = window.innerWidth <= 900;
    container.replaceChildren(isMobile ? renderMobile(data) : renderDesktop(data));
  } catch {
    container.innerHTML = '<div class="error">Gagal memuat halaman.</div>';
  }
  return container;
}
```

### 2. Daftarkan ke router

```js
// js/router.js
import { Blog } from '/features/blog/blog.js';

const routes = {
  '/blog': Blog,
};
```

### 3. Tambahkan link navigasi

```html
<a href="/blog" data-link>Blog</a>
```

### 4. Tambah komponen reusable

Jika komponen dipakai oleh 2+ fitur, buat di `components/nama-komponen/`. Jika hanya dipakai satu fitur, simpan di dalam folder fitur tersebut:

```txt
features/home/components/FeedCard.js    ← hanya dipakai home
components/card/card.js                 ← dipakai banyak halaman
```

Buat subfolder `components/` di dalam fitur hanya jika ada 3+ komponen spesifik fitur tersebut.

### 5. CSS — aturan ukuran file

| Tipe file | Batas |
|---|---|---|
| CSS fitur utama (mis. `home.css`) | ~100 baris |
| CSS partial (mis. `_feed.css`) | ~150 baris |
| CSS komponen shared | ~100 baris |
| `global.css` | ~200 baris |
| `_shared.css` (layout mobile) | ~150 baris — partialkan jika lebih |

Jika file melebihi batasnya, ekstrak ke partial dengan prefix `_`:

```js
// home.js
injectStyle('/features/home/home.css');
injectStyle('/features/home/_feed.css');
injectStyle('/features/home/_hero.css');
```

  ### 6. MD Update Rule
  Every response that creates a new feature, page, component, utility, or architectural change MUST also output the updated sections of conclusion.md and README.md that are affected. Never deliver code changes without the corresponding MD updates. The MD files are the single source of truth for the project architecture.
  
---

## Autentikasi

- State disimpan di `localStorage` (`studnow_users` + `studnow_session`).
- `data/users.json` berisi 3 seed users (Fatan, All, Manca) — di-seed ulang otomatis saat versi berubah.
- `js/auth.js` menyediakan: `initUsers()`, `login()`, `register()`, `logout()`, `getSession()`, `isAuthenticated()`, `navigateAfterAuth()`.
- Halaman yang membutuhkan login harus redirect ke `/login` jika tidak ada session.
- Navbar dan top-bar menukar tombol "Login"/"Create" dengan nama user saat terautentikasi.
- Bottom-bar dan navbar otomatis sembunyi di halaman auth (`/login`, `/signup`).

---

## Search Engine

- `js/search.js` mengekspor singleton `searchEngine`.
- Async init via `searchEngine.init()` — mem-fetch home, groups, dan detail, lalu membangun indeks.
- Fuzzy search dengan character n-grams (2–4), field-weighted scoring (title > tags/category > description), dan coverage-ratio multiplier.
- Threshold minimum skor `MIN_SCORE = 30` untuk mencegah false positive.
- Halaman search harus await `searchEngine.init()` sebelum mengakses indeks.
- Hasil pencarian memiliki URL yang benar: forum → `/detail?index=N` atau `/open?index=N`, grup → `/groups`, kursus → `/detail`.

---

## Data JSON

- Setiap fitur menyimpan data JSON-nya sendiri di dalam folder fiturnya (`features/nama/nama.json`).
- Data cross-feature (users) tetap di `data/`.
- `features/detail/detail.json` adalah array 10 kursus yang terhubung dengan forum di `home.json` via indeks array — jaga urutan tetap konsisten.
- Desktop dan mobile berbagi file JSON yang sama.

---

## Aturan Ikon

- Semua ikon menggunakan **Bootstrap Icons** (`<i class="bi bi-{nama}">`) — di-load via CDN di `index.html`.
- Jangan gunakan emoji atau inline SVG untuk ikon.
- Pengecualian: social brand icons (Apple/Google/Facebook) di halaman auth, dan logo StudNow di navbar/top-bar — tetap inline SVG.

---

## Aturan Penting

- Jangan menaruh semua logic di satu file besar.
- Jangan mencampur style global dengan style komponen.
- Jangan re-render navbar, top-bar, bottom-bar, dan footer setiap pindah halaman.
- Jangan hardcode konten halaman di JS — selalu baca dari JSON.
- Jaga konsistensi penamaan folder dan file.
- Komponen di `components/` tidak boleh mengandung logic spesifik halaman.
- CSS partial (prefix `_`) hanya di-inject dari file JS fiturnya — tidak standalone.

---

## Catatan Server

Aplikasi menggunakan **Hash Routing** (`/#/route`) — tidak perlu konfigurasi server SPA. Kompatibel dengan GitHub Pages tanpa file `.nojekyll` atau fallback 404. Server lokal (`npm run dev` / `npm run serve`) tetap bisa digunakan untuk development.