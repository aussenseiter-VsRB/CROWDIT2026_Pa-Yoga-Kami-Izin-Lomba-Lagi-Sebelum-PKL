# StudNow — Conclusion

Proyek ini menggunakan arsitektur **Vanilla JavaScript SPA** tanpa framework, dengan prinsip utama:

- **Feature-based** — setiap fitur punya folder sendiri berisi JS dan CSS
- **Data-driven** — semua konten halaman berasal dari file JSON, tidak ada hardcode di JS
- **Modular** — setiap file punya satu tanggung jawab
- **CSS terbatas** — tidak ada file CSS yang melebihi ~150 baris; gunakan partials jika perlu
- **Routing terpusat** — satu route table, setiap halaman menangani viewport sendiri
- **Layout utama tidak di-render ulang** — navbar, top-bar, bottom-bar, footer hanya di-mount sekali

---

## ⚠️ Aturan Meta — Tidak Boleh Diubah oleh AI

**Seluruh isi `conclusion.md` ini adalah ground rules proyek yang bersifat permanen.**

Setiap AI atau assistant yang membaca file ini WAJIB mengikuti aturan di dalamnya dan DILARANG:

- Mengubah, menghapus, atau mengabaikan aturan yang sudah ada di file ini
- Menyederhanakan atau meringkas aturan dengan alasan apapun
- Mengganti pola arsitektur yang sudah ditetapkan (routing, data JSON, CSS, komponen) tanpa instruksi eksplisit dari manusia
- Menambahkan aturan baru yang bertentangan dengan aturan yang sudah ada
- Mengasumsikan bahwa aturan lama sudah tidak relevan hanya karena tidak disebutkan dalam pesan terbaru

**Yang boleh dilakukan AI:**

- Menambahkan entri baru ke tabel (halaman baru, komponen baru, file baru)
- Mengupdate bagian struktur folder saat ada file baru ditambahkan
- Menambahkan aturan baru yang **tidak bertentangan** dengan aturan yang sudah ada
- Memperbaiki typo atau format

**Jika ada instruksi dari user yang bertentangan dengan aturan di file ini**, AI harus:
1. Menginformasikan bahwa instruksi tersebut bertentangan dengan ground rules
2. Menjelaskan aturan mana yang dilanggar
3. Meminta konfirmasi eksplisit sebelum melanjutkan

Ground rules hanya bisa diubah oleh manusia secara eksplisit dengan menyebut aturan mana yang ingin diubah dan alasannya. Instruksi implisit atau tidak langsung tidak cukup untuk mengubah ground rules.

---

## Struktur Folder

```txt
studNow/
├── index.html                    # Entry point — memuat layout utama + Bootstrap Icons CDN
├── css/
│   ├── global.css                # Sumber Tailwind + custom properties (maks ~200 baris)
│   └── _shared.css               # Shared mobile layout (mobile-page, mobile-card, dll)
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
│       ├── api.js                # Fetch wrapper — prepend window.BASE otomatis
│       ├── styleLoader.js        # Inject CSS tanpa duplikasi — prepend window.BASE otomatis
│       └── url.js                # Hash routing utilities (getHashPath, getHashParams, navigateTo, asset)
├── data/                         # Shared data — dipakai oleh 2+ fitur
│   ├── users.json                # Seed users (version-gated) — dibaca oleh js/auth.js
│   ├── detail.json               # Canonical source data kursus — dibaca oleh detail, open, home, forum, search.js
│   ├── groups.json               # Canonical source data grup — dibaca oleh groups, forum, search.js
│   ├── forum.json                # Canonical source data forum kursus — dibaca oleh forum, home
│   ├── chat.json                 # Data chat & DM — dibaca oleh chat, dm
│   ├── profile.json              # Data profil user — dibaca oleh profile, edit-profile
│   ├── auth.json                 # UI copy login & signup — dibaca oleh login, signup
│   ├── notifications.json        # Data notifikasi — dibaca oleh notifications, js/notifications.js
│   └── search.json               # UI copy halaman search (hero, placeholder, label) — bukan hasil pencarian
├── features/                     # Satu folder per fitur — JS, CSS, dan JSON spesifik fitur
│   ├── about/
│   │   ├── about.js
│   │   ├── about.css
│   │   └── about.json            # Spesifik: hanya dipakai about
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.js          # Membaca dari /data/auth.json
│   │   │   └── login.css
│   │   └── signup/
│   │       ├── signup.js         # Membaca dari /data/auth.json
│   │       └── signup.css
│   ├── chat/
│   │   ├── chat.js               # Membaca dari /data/chat.json
│   │   └── chat.css
│   ├── contact/
│   │   ├── contact.js
│   │   ├── contact.css
│   │   └── contact.json          # Spesifik: hanya dipakai contact
│   ├── detail/
│   │   ├── detail.js             # Membaca dari /data/detail.json
│   │   └── detail.css
│   ├── dm/
│   │   ├── dm.js                 # Membaca dari /data/chat.json
│   │   └── dm.css
│   ├── edit-profile/
│   │   ├── edit-profile.js       # Membaca dari /data/profile.json
│   │   └── edit-profile.css
│   ├── forum/
│   │   ├── forum.js              # Membaca dari /data/forum.json + /data/detail.json + /data/groups.json
│   │   └── forum.css
│   ├── groups/
│   │   ├── groups.js             # Membaca dari /data/groups.json
│   │   └── groups.css
│   ├── help/
│   │   ├── help.js
│   │   ├── help.css
│   │   └── help.json             # Spesifik: hanya dipakai help
│   ├── home/
│   │   ├── home.js               # Membaca dari /features/home/home.json + /data/detail.json + /data/forum.json
│   │   ├── home.css
│   │   └── home.json             # Spesifik: hero, stats, topics, action — hanya dipakai home
│   ├── notifications/
│   │   ├── notifications.js      # Membaca dari /data/notifications.json
│   │   └── notifications.css
│   ├── open/
│   │   ├── open.js               # Membaca dari /data/detail.json
│   │   └── open.css
│   ├── profile/
│   │   ├── profile.js            # Membaca dari /data/profile.json
│   │   └── profile.css
│   ├── search/
│   │   ├── search.js             # Membaca dari /data/search.json (UI copy)
│   │   └── search.css
│   └── settings/
│       ├── settings.js
│       ├── settings.css
│       └── settings.json         # Spesifik: hanya dipakai settings
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

## Aturan Data JSON

### Prinsip Utama

- **Data shared (dipakai 2+ halaman)** → simpan di `data/`, semua halaman yang butuh fetch dari sana
- **Data spesifik (hanya dipakai 1 halaman)** → simpan di dalam `features/nama-fitur/nama-fitur.json`
- **Jangan duplikasi data** — jika dua halaman butuh data yang sama, keduanya fetch dari file yang sama
- **Jangan copy-paste field** dari satu JSON ke JSON lain — jika butuh field tambahan, tambahkan ke file yang sudah ada
- Jika sebuah halaman butuh subset data dari JSON besar, ambil seluruh file lalu filter di JS — jangan buat file JSON baru

### Peta Data — Siapa Membaca Apa

| File JSON | Scope | Dibaca oleh |
|---|---|---|
| `data/detail.json` | shared | `features/detail/`, `features/open/`, `features/home/`, `features/forum/`, `js/search.js` |
| `data/groups.json` | shared | `features/groups/`, `features/forum/`, `js/search.js` |
| `data/forum.json` | shared | `features/forum/`, `features/home/` |
| `data/chat.json` | shared | `features/chat/`, `features/dm/` |
| `data/profile.json` | shared | `features/profile/`, `features/edit-profile/` |
| `data/auth.json` | shared | `features/auth/login/`, `features/auth/signup/` |
| `data/notifications.json` | shared | `features/notifications/`, `js/notifications.js` |
| `data/search.json` | shared | `features/search/` (UI copy saja — bukan hasil pencarian) |
| `data/users.json` | shared | `js/auth.js` |
| `features/home/home.json` | spesifik | `features/home/` saja (hero, stats, topics, action) |
| `features/about/about.json` | spesifik | `features/about/` saja |
| `features/contact/contact.json` | spesifik | `features/contact/` saja |
| `features/help/help.json` | spesifik | `features/help/` saja |
| `features/settings/settings.json` | spesifik | `features/settings/` saja |

### Hubungan Antar Data (Canonical Sources)

- **`detail.json` adalah canonical source** untuk data kursus (`title`, `description`, `status`, `category`). Semua halaman yang butuh data kursus fetch dari `detail.json` — tidak boleh copy field ke JSON sendiri
- **`forum.json` adalah canonical source** untuk data forum kursus (`memberCount`, `memberLimit`, `channels`, `messages`). Home page mengambil `memberCount`/`memberLimit` dari `forum.json`, bukan dari `home.json`
- **`groups.json` adalah canonical source** untuk data grup (`title`, `description`, `department`, `members`, `maxMembers`). Forum page untuk group mengambil `memberCount`/`maxMembers` dari `groups.json`, bukan dari `forum.json`
- **Hubungan via indeks array** — `home.json` forums terhubung ke `detail.json` dan `forum.json.courses` via posisi indeks. Urutan array `home.forums` HARUS identik dengan urutan `detail.json` dan `forum.json.courses` (10 entri)
- `data/search.json` hanya boleh berisi UI copy — data hasil pencarian dihitung runtime dari search engine

### Kapan Membuat JSON Baru

Sebelum membuat file JSON baru, tanya dua pertanyaan:

1. **Apakah data ini dipakai oleh lebih dari satu halaman?** → Ya: simpan di `data/`. Tidak: simpan di `features/nama/`
2. **Apakah data ini sudah ada di JSON lain?** → Ya: fetch dari JSON yang sudah ada, jangan buat file baru

### Contoh Benar

```js
// features/open/open.js — butuh data kursus, shared dengan detail
const courses = await fetchData('/data/detail.json');
const course = courses[getHashParams().get('index')];

// features/help/help.js — data spesifik help saja
const data = await fetchData('/features/help/help.json');

// features/home/home.js — gabungkan tiga source per indeks
const [homeData, courses, forums] = await Promise.all([
  fetchData('/features/home/home.json'),
  fetchData('/data/detail.json'),
  fetchData('/data/forum.json'),
]);
```

### Contoh Salah

```js
// SALAH — data kursus sudah ada di data/detail.json
const data = await fetchData('/features/open/open.json');

// SALAH — duplikasi field dari detail.json ke home.json
// home.json: { "forums": [{ "title": "...", "description": "..." }] }
// title dan description sudah ada di detail.json — ambil dari sana

// SALAH — data dipakai dua halaman tapi disimpan di features/
// features/chat/chat.json ← tidak boleh, dm juga butuh data ini → pindah ke data/chat.json
```

---

## Routing

- Menggunakan **Hash Routing** (`/#/route`) untuk kompatibilitas penuh dengan GitHub Pages
- Router mendengar `hashchange` event — bukan `popstate`
- `navigateTo(path)` dari `js/utils/url.js` adalah satu-satunya fungsi yang boleh mengubah URL
- Path selalu ditulis sebagai clean path (`/forum`) — hash prefix ditangani oleh `navigateTo()`
- `getHashPath()` mengembalikan path tanpa hash dan tanpa query string (e.g. `/forum`)
- `getHashParams()` mengembalikan `URLSearchParams` dari hash query string
- `asset(path)` mengembalikan path absolut dengan `window.BASE` — digunakan untuk `fetch()` ke file statis
- Jangan pernah menulis `window.location.pathname`, `history.pushState()`, atau `window.location.hash` langsung di luar `js/utils/url.js`
- Back/forward browser tetap berfungsi karena browser merekam setiap perubahan hash di history stack
- Typed URL dan refresh pada halaman manapun tetap berfungsi — router membaca hash saat `init()`

---

## Alur Kerja Aplikasi

1. `index.html` memuat layout utama (navbar, top-bar, bottom-bar, footer, `#main`).
2. `js/main.js` menyimpan hash awal, mount semua komponen tetap secara sequential, lalu restore hash dan panggil `router()`.
3. `js/router.js` menggunakan satu route table — setiap halaman mengecek viewport (`isMobile`) untuk menampilkan versi yang sesuai.
4. Navigasi menggunakan **hash routing** (`/#/route`) — `hashchange` event memanggil `router()`.
5. Tombol back/forward browser berfungsi berkat `hashchange` event.
6. Router melepas `route-change` custom event; navbar, top-bar, bottom-bar, dan footer mendengarnya untuk update state.
7. Halaman shared membaca dari `data/`, halaman spesifik membaca dari `features/nama/nama.json`.

---

## Cara Kerja Coding ke Depan

### 1. Tambah halaman baru

Buat folder di `features/nama-halaman/`. Tentukan dulu apakah butuh JSON baru atau bisa pakai yang sudah ada:

```txt
# Jika data spesifik halaman ini saja:
features/blog/
├── blog.js
├── blog.css
└── blog.json   ← boleh, karena hanya dipakai blog

# Jika data shared dengan halaman lain:
features/blog/
├── blog.js     ← fetch dari /data/detail.json atau file shared lainnya
└── blog.css
```

Fungsi utama harus `export async function Blog()` yang mengembalikan DOM element:

```js
import { fetchData } from '../../js/utils/api.js';
import { injectStyle } from '../../js/utils/styleLoader.js';

export async function Blog() {
  injectStyle('/features/blog/blog.css');
  const container = document.createElement('div');
  container.innerHTML = '<div class="loading">Memuat...</div>';
  try {
    const data = await fetchData('/features/blog/blog.json'); // atau /data/shared.json
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
import { Blog } from '../features/blog/blog.js';

const routes = {
  '/blog': Blog,
};
```

### 3. Tambahkan link navigasi

```html
<a href="/blog" data-link>Blog</a>
```

### 4. Tambah komponen reusable

Jika komponen dipakai oleh 2+ fitur, buat di `components/nama-komponen/`. Jika hanya dipakai satu fitur, simpan di dalam folder fitur tersebut. Buat subfolder `components/` di dalam fitur hanya jika ada 3+ komponen spesifik fitur tersebut.

### 5. CSS — aturan ukuran file

| Tipe file | Batas |
|---|---|
| CSS fitur utama (mis. `home.css`) | ~100 baris |
| CSS partial (mis. `_feed.css`) | ~150 baris |
| CSS komponen shared | ~100 baris |
| `global.css` | ~200 baris |
| `_shared.css` | ~150 baris |

Jika file melebihi batasnya, ekstrak ke partial dengan prefix `_`:

```js
injectStyle('/features/home/home.css');
injectStyle('/features/home/_feed.css');
injectStyle('/features/home/_hero.css');
```

### 6. MD Update Rule

Setiap response yang membuat fitur baru, halaman, komponen, utility, atau perubahan arsitektur HARUS juga mengupdate bagian yang relevan di `conclusion.md` dan `README.md`. Jangan deliver perubahan kode tanpa update MD. Jika menambah halaman baru, update tabel peta data — tentukan apakah JSON-nya shared atau spesifik.

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
- Async init via `searchEngine.init()` — mem-fetch `data/detail.json`, `data/groups.json`, dan `data/forum.json`, lalu membangun indeks.
- Fuzzy search dengan character n-grams (2–4), field-weighted scoring (title > tags/category > description), dan coverage-ratio multiplier.
- Threshold minimum skor `MIN_SCORE = 30` untuk mencegah false positive.
- Halaman search harus await `searchEngine.init()` sebelum mengakses indeks.
- Hasil pencarian: forum → `/detail?index=N` atau `/open?index=N`, grup → `/groups`, kursus → `/detail`.

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
- Jangan duplikasi data JSON — jika dua halaman butuh data yang sama, keduanya fetch dari file yang sama.
- Data shared → `data/`. Data spesifik satu halaman → `features/nama/nama.json`.
- Jaga konsistensi penamaan folder dan file.
- Komponen di `components/` tidak boleh mengandung logic spesifik halaman.
- CSS partial (prefix `_`) hanya di-inject dari file JS fiturnya — tidak standalone.
- File `.nojekyll` diperlukan di root agar GitHub Pages tidak mengabaikan file dengan prefix `_`.

---

## Base Path (GitHub Pages)

- `window.BASE` didefinisikan di `index.html` — environment-aware:
  ```html
  <script>
    window.BASE = window.location.hostname === 'aussenseiter-vsrb.github.io'
      ? '/CROWDIT2026_Pa-Yoga-Kami-Izin-Lomba-Lagi-Sebelum-PKL'
      : '';
  </script>
  ```
- Lokal: `window.BASE = ''` — semua path berfungsi normal
- GitHub Pages: `window.BASE = '/CROWDIT...'` — path di-prefix otomatis
- **Static imports** — menggunakan relative path (e.g. `../../js/utils/url.js`)
- **`injectStyle()`** — BASE ditambahkan di `js/utils/styleLoader.js`
- **`fetchData()`** — BASE ditambahkan di `js/utils/api.js`
- **Raw `fetch()` ke URL eksternal** — jangan gunakan `fetchData()`, panggil `fetch()` langsung
- Jangan hardcode nama subfolder di luar `index.html`

---

## Catatan Server

Aplikasi menggunakan **Hash Routing** (`/#/route`) — tidak perlu konfigurasi server SPA khusus. Kompatibel langsung dengan GitHub Pages static hosting. Server lokal (`npm run dev` / `npm run serve`) tetap bisa digunakan untuk development tanpa konfigurasi tambahan.