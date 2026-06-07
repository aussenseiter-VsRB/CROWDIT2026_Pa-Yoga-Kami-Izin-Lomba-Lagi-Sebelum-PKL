# StudNow

StudNow adalah **SPA Vanilla JavaScript** tanpa framework, untuk forum belajar dengan halaman responsif desktop dan mobile.

## Ringkasan

- **JavaScript murni** — routing berbasis History API (clean URL tanpa hash)
- **Dua mode tampilan** — desktop (≥901px) dan mobile (≤900px) dengan route table terpisah
- **Data-driven** — semua konten halaman berasal dari file JSON di `data/`
- **Styling** — Tailwind CSS v4 + CSS per komponen
- **Autentikasi** — login/register berbasis localStorage dengan seed users
- **Pencarian fuzzy** — engine n-gram dengan field-weighted scoring, mendukung typos

## Struktur Folder

```txt
studNow/
├── index.html               # Entry point — memuat layout utama + Bootstrap Icons CDN
├── css/
│   └── global.css           # Sumber Tailwind + custom properties
├── dist/
│   └── output.css           # Hasil build Tailwind
├── js/
│   ├── main.js              # Bootstrap: mount komponen tetap, intercept navigasi
│   ├── router.js            # Route table desktop & mobile, render halaman
│   ├── auth.js              # Login, register, logout, session (localStorage)
│   ├── search.js            # Fuzzy search engine (n-gram, field-weighted)
│   └── theme.js             # Inisialisasi tema
├── data/                    # Single source of truth untuk semua halaman
│   ├── home.json
│   ├── detail.json          # Data kursus (dipakai oleh halaman detail & open)
│   ├── groups.json
│   ├── search.json          # Copy untuk halaman search (hero, placeholder, dll)
│   ├── login.json
│   ├── signup.json
│   ├── profile.json
│   ├── chat.json
│   ├── notifications.json
│   ├── about.json
│   ├── contact.json
│   └── users.json           # Seed users (versi-gated)
├── pages/
│   ├── pages-desktop/       # Halaman khusus desktop (≥901px)
│   │   ├── home/
│   │   │   ├── home.js
│   │   │   ├── home.css
│   │   │   └── detail/      # Sub-halaman: detail & open (dari /home)
│   │   │       ├── detail.js
│   │   │       └── open.js
│   │   ├── about/
│   │   ├── chat/
│   │   ├── contact/
│   │   ├── groups/
│   │   ├── login/
│   │   ├── notifications/
│   │   ├── profile/
│   │   ├── search/
│   │   └── signup/
│   └── pages-mobile/        # Halaman khusus mobile (≤900px)
│       ├── home/
│       ├── about/
│       ├── chat/
│       ├── contact/
│       ├── edit-profile/
│       ├── groups/
│       ├── help/
│       ├── login/
│       ├── notifications/
│       ├── profile/
│       ├── search/
│       ├── settings/
│       └── signup/
├── components/
│   ├── desktop/
│   │   ├── navbar/          # Navbar desktop (auth-aware: Login ↔ nama user)
│   │   ├── footer/
│   │   ├── card/
│   │   ├── form-field/
│   │   └── page-header/
│   ├── mobile/
│   │   ├── top-bar/         # Top bar mobile (auth-aware: Create ↔ nama user)
│   │   └── bottom-bar/      # Bottom nav (4 tab, sembunyi di halaman auth)
│   └── shared/              # (cadangan untuk komponen bersama)
├── design.md
├── conclusion.md
└── README.md
```

## Teknologi

- **HTML5 + History API** (SPA routing)
- **CSS3 + Tailwind CSS v4**
- **Vanilla JavaScript (ES Modules)**
- **Bootstrap Icons v1.11.3** (via CDN) — semua ikon aplikasi
- **serve** (static SPA server untuk development)

## Cara Menjalankan

### 1. Install dependensi

```bash
npm install
```

### 2. Development (Tailwind watch + server otomatis)

```bash
npm run dev
```

Menjalankan Tailwind CLI dalam mode watch (compile `css/global.css` → `dist/output.css`) **dan** `serve -s` secara bersamaan via `concurrently`.

### 3. Hanya server lokal

```bash
npm run serve
```

### 4. Build CSS untuk produksi

```bash
npm run build
```

> Server berjalan dalam **mode SPA** (`serve -s`) — semua URL diarahkan ke `index.html` agar routing History API berfungsi tanpa 404.

## Alur Kerja Aplikasi

1. `index.html` memuat layout utama (navbar, top-bar, bottom-bar, footer, `#main`).
2. `js/main.js` menjalankan inisialisasi: mount komponen tetap, intercept klik link `[data-link]`, panggil `router()`.
3. `js/router.js` menentukan route table berdasarkan viewport (≤900px = mobile), memanggil fungsi halaman yang sesuai, dan merendernya ke `#main`.
4. Navigasi menggunakan `history.pushState()` — URL bersih tanpa hash.
5. Tombol back/forward browser tetap berfungsi berkat `popstate` event.
6. Setelah render, router melepas `route-change` custom event — bottom-bar, navbar, dan footer mendengarnya untuk update state.
7. Semua halaman membaca data dari `/data/{page}.json` — konten terpisah dari logika rendering.

## Autentikasi

- Login/register menggunakan `localStorage` (key `studnow_users` + `studnow_session`).
- `data/users.json` berisi 3 seed user (Fatan, All, Manca) — di-seed ulang otomatis saat versi berubah.
- `js/auth.js` menyediakan: `initUsers()`, `login()`, `register()`, `logout()`, `getSession()`, `isAuthenticated()`, `navigateAfterAuth()`.
- Halaman profile membutuhkan sesi valid — redirect ke `/login` jika tidak login.
- Navbar desktop dan top-bar mobile menukar tombol "Login"/"Create" dengan nama user saat terautentikasi.
- Bottom-bar dan navbar otomatis sembunyi di halaman auth (`/login`, `/signup`).

## Pencarian

- Engine fuzzy search di `js/search.js`: tokenisasi, character n-grams (2-4), field-weighted scoring (title > tags/category > description > n-gram overlap).
- Mengindeks forum dari `home.json`, grup dari `groups.json`, dan kursus dari `detail.json`.
- Setiap hasil pencarian memiliki URL yang benar (forum → `/detail?index=N` atau `/open?index=N` tergantung action, grup → `/groups`, kursus → `/detail`).
- Threshold minimum skor (`MIN_SCORE = 30`) dengan coverage-ratio multiplier untuk mencegah false positive.
- Discovery view di halaman search menampilkan trending tags (dari indeks) dan suggested items.

## Data JSON

- Semua konten halaman disimpan di `data/` sebagai file JSON — **single source of truth**.
- `data/detail.json` adalah array 10 kursus yang terhubung dengan forum di `home.json` via indeks array.
- `data/search.json` hanya berisi copy halaman (hero, placeholder, label filter, empty state) — trending dan suggested dihitung runtime dari indeks search engine.
- Desktop dan mobile berbagi file JSON yang sama; data spesifik mobile (mis. `home.json` → `mobile.forums`) diletakkan di properti terpisah dalam file yang sama.

## Pola Pengembangan

### Tambah halaman baru

1. Buat folder di `pages/pages-desktop/nama-halaman/` (dan/atau `pages/pages-mobile/nama-halaman/`).
2. Buat file JS yang mengekspor fungsi async (mengembalikan DOM element).
3. Import fungsi tersebut di `js/router.js` dan daftarkan ke route table yang sesuai.
4. Tambahkan link navigasi dengan `data-link`.

### Tambah komponen baru

- Komponen desktop → `components/desktop/nama-komponen/`
- Komponen mobile → `components/mobile/nama-komponen/`
- Komponen bersama → `components/shared/nama-komponen/`

### CSS

- Style dasar dan utility di `css/global.css`.
- Style spesifik komponen di file `.css` dalam folder komponen tersebut.
- CSS di-inject via JavaScript (cek duplikasi sebelum menambahkan `<link>`).

### Komponen sebagai fungsi

Setiap komponen adalah fungsi yang mengembalikan DOM element — pola ini memudahkan reuse dan testing tanpa framework.

## Catatan Penting

- Jangan menaruh semua logic ke satu file besar.
- Jangan mencampur style global dengan style komponen.
- Jangan re-render komponen tetap (navbar, top-bar, bottom-bar, footer) setiap pindah halaman.
- Jaga konsistensi penamaan folder dan file.
- Ikon menggunakan Bootstrap Icons (`<i class="bi bi-...">`) — jangan gunakan emoji atau inline SVG di luar brand icons (Apple/Google/Facebook) dan logo StudNow.
