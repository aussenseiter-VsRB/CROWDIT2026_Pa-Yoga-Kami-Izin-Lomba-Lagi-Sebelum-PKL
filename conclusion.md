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
│   ├── core/                     # Bootstrap & infrastruktur inti aplikasi
│   │   ├── main.js               # Bootstrap: mount komponen tetap, intercept navigasi
│   │   ├── router.js             # Route table tunggal, render halaman ke #main
│   │   └── theme.js              # Inisialisasi tema
│   ├── services/                 # Singleton stateful — mengelola state & business logic
│   │   ├── auth.js               # Login, register, logout, session (localStorage)
│   │   ├── search.js             # Fuzzy search engine (n-gram, field-weighted)
│   │   ├── notifications.js      # Manajemen notifikasi
│   │   └── forum-access.js       # Join/request/approve forum — localStorage state
│   ├── data/                     # Data-access layer — fetch & cache eksternal
│   │   └── dummy-users.js        # DummyJSON cache (24h TTL), seeded shuffle, getUsersForContext
│   └── utils/                    # Pure functions — tidak ada state, tidak ada side effect
│       ├── dom.js                # Helper DOM (createElement, query shortcuts)
│       ├── format.js             # Format tanggal, angka, string
│       ├── api.js                # Fetch wrapper — prepend window.BASE otomatis
│       ├── styleLoader.js        # Inject CSS tanpa duplikasi — prepend window.BASE otomatis
│       └── url.js                # Hash routing utilities (getHashPath, getHashParams, navigateTo, asset)
├── data/                         # Shared data — dipakai oleh 2+ fitur
│   ├── users.json                # Seed users (version-gated) — dibaca oleh js/services/auth.js
│   ├── detail.json               # Canonical source data kursus — dibaca oleh detail, open, home, forum, search.js
│   ├── groups.json               # Canonical source data grup — dibaca oleh groups, forum, search.js
│   ├── forum.json                # Canonical source data forum kursus — dibaca oleh forum, home
│   ├── chat.json                 # Data chat & DM — dibaca oleh chat, dm
│   ├── profile.json              # Data profil user — dibaca oleh profile, edit-profile
│   ├── auth.json                 # UI copy login & signup — dibaca oleh login, signup
│   ├── notifications.json        # Data notifikasi — dibaca oleh notifications, js/services/notifications.js
│   └── search.json               # UI copy halaman search (hero, placeholder, label) — bukan hasil pencarian
├── features/                     # Satu folder per fitur — JS, CSS, dan JSON spesifik fitur
│   │                             # Entry point (.js) di root, helper (_*.js) di js/, CSS di css/
│   ├── about/
│   │   ├── js/
│   │   ├── css/
│   │   │   └── about.css
│   │   ├── about.js
│   │   └── about.json            # Spesifik: hanya dipakai about
│   ├── auth/                     # Fitur terkait autentikasi — dikelompokkan bersama
│   │   ├── login/
│   │   │   ├── js/
│   │   │   ├── css/
│   │   │   │   ├── login.css
│   │   │   │   ├── _auth-form.css
│   │   │   │   └── _auth-visual.css
│   │   │   └── login.js          # Membaca dari /data/auth.json
│   │   └── signup/
│   │       ├── js/
│   │       ├── css/
│   │       │   ├── signup.css
│   │       │   ├── _auth-form.css
│   │       │   └── _auth-visual.css
│   │       └── signup.js         # Membaca dari /data/auth.json
│   ├── chat/                     # Fitur terkait pesan — dikelompokkan bersama
│   │   ├── chat/
│   │   │   ├── js/
│   │   │   │   ├── _cards.js
│   │   │   │   ├── _render.js
│   │   │   │   └── _utils.js
│   │   │   ├── css/
│   │   │   │   └── chat.css
│   │   │   └── chat.js           # Membaca dari /data/chat.json
│   │   └── dm/
│   │       ├── js/
│   │       ├── css/
│   │       │   ├── dm.css
│   │       │   ├── _dm-bubbles.css
│   │       │   ├── _dm-compose.css
│   │       │   ├── _dm-desktop.css
│   │       │   └── _dm-modals.css
│   │       └── dm.js             # Membaca dari /data/chat.json
│   ├── contact/
│   │   ├── js/
│   │   ├── css/
│   │   │   └── contact.css
│   │   ├── contact.js
│   │   └── contact.json          # Spesifik: hanya dipakai contact
│   ├── detail/
│   │   ├── js/
│   │   │   ├── _cards.js
│   │   │   ├── _handlers.js
│   │   │   ├── _render.js
│   │   │   └── _utils.js
│   │   ├── css/
│   │   │   ├── detail.css
│   │   │   ├── _detail-creator.css
│   │   │   ├── _detail-forum.css
│   │   │   ├── _detail-hero.css
│   │   │   └── _detail-meeting.css
│   │   └── detail.js             # Membaca dari /data/detail.json
│   ├── forum/                    # Fitur terkait forum — dikelompokkan bersama
│   │   ├── css/
│   │   │   └── _members.css      # Partial shared: avatar stack + member list
│   │   ├── landing/              # Forum landing: join gate, privacy badge, CTA
│   │   │   ├── js/
│   │   │   │   ├── _cards.js
│   │   │   │   ├── _handlers.js
│   │   │   │   ├── _render.js
│   │   │   │   └── _utils.js
│   │   │   ├── css/
│   │   │   │   ├── forum.css
│   │   │   │   ├── _forum-landing.css
│   │   │   │   ├── _forum-members.css
│   │   │   │   ├── _forum-messages.css
│   │   │   │   └── _forum-sidebar.css
│   │   │   └── forum.js
│   │   └── interior/             # Forum interior: channels, messages, members
│   │       ├── js/
│   │       │   ├── _cards.js
│   │       │   ├── _handlers.js
│   │       │   ├── _render.js
│   │       │   └── _utils.js
│   │       ├── css/
│   │       │   └── forum-interior.css
│   │       └── forum-interior.js
│   ├── groups/
│   │   ├── js/
│   │   │   ├── _cards.js
│   │   │   ├── _render.js
│   │   │   └── _utils.js
│   │   ├── css/
│   │   │   ├── groups.css
│   │   │   ├── _groups-card.css
│   │   │   └── _groups-hero.css
│   │   └── groups.js             # Membaca dari /data/groups.json
│   ├── help/
│   │   ├── js/
│   │   ├── css/
│   │   │   ├── help.css
│   │   │   └── _help-faq.css
│   │   ├── help.js
│   │   └── help.json             # Spesifik: hanya dipakai help
│   ├── home/
│   │   ├── js/
│   │   │   ├── _cards.js
│   │   │   ├── _handlers.js
│   │   │   ├── _render.js
│   │   │   └── _utils.js
│   │   ├── css/
│   │   │   ├── home.css
│   │   │   ├── _home-forum.css
│   │   │   ├── _home-hero.css
│   │   │   ├── _home-mobile.css
│   │   │   └── _home-topics.css
│   │   ├── home.js               # Membaca dari /features/home/home.json + /data/detail.json + /data/forum.json
│   │   └── home.json             # Spesifik: hero, stats, topics, action — hanya dipakai home
│   ├── notifications/
│   │   ├── js/
│   │   │   ├── _cards.js
│   │   │   ├── _handlers.js
│   │   │   ├── _render.js
│   │   │   └── _utils.js
│   │   ├── css/
│   │   │   ├── notifications.css
│   │   │   └── _notifications-card.css
│   │   └── notifications.js      # Membaca dari /data/notifications.json
│   ├── profile/                  # Fitur terkait profil — dikelompokkan bersama
│   │   ├── profile/
│   │   │   ├── js/
│   │   │   ├── css/
│   │   │   │   ├── profile.css
│   │   │   │   ├── _profile-header.css
│   │   │   │   └── _profile-panels.css
│   │   │   └── profile.js        # Membaca dari /data/profile.json
│   │   ├── edit-profile/
│   │   │   ├── js/
│   │   │   ├── css/
│   │   │   │   ├── edit-profile.css
│   │   │   │   └── _edit-profile-form.css
│   │   │   └── edit-profile.js   # Membaca dari /data/profile.json
│   │   └── settings/
│   │       ├── js/
│   │       ├── css/
│   │       │   ├── settings.css
│   │       │   └── _settings-toggle.css
│   │       ├── settings.js
│   │       └── settings.json     # Spesifik: hanya dipakai settings
│   ├── search/
│   │   ├── js/
│   │   │   ├── _utils.js
│   │   │   ├── _cards.js
│   │   │   ├── _handlers.js
│   │   │   └── _render.js
│   │   ├── css/
│   │   │   ├── search.css
│   │   │   ├── _search-bar.css
│   │   │   └── _search-card.css
│   │   └── search.js             # Membaca dari /data/search.json (UI copy)
└── components/                   # Komponen yang dipakai oleh 2+ fitur
    ├── layout/                   # Komponen struktur halaman (di-mount sekali, tidak di-render ulang)
    │   ├── navbar/navbar.js + .css
    │   ├── top-bar/top-bar.js + .css
    │   ├── bottom-bar/bottom-bar.js + .css
    │   └── footer/footer.js + .css
    ├── ui/                       # Komponen UI reusable (stateless, data-driven)
    │   ├── card/card.js + .css
    │   ├── form-field/form-field.js + .css
    │   └── qr-modal/qr-modal.js + .css
    └── shared/                   # Komponen shared dengan logic ringan
        ├── page-header/page-header.js + .css
        └── tambah-minat/tambah-minat.js + .css
```

---

## Konvensi Pengelompokan Fitur

### Prinsip Pengelompokan

Fitur yang **erat secara domain** (berbagi data, flow, atau UX) dikelompokkan dalam satu parent folder. Fitur yang **berdiri sendiri** tetap flat di `features/`.

| Kondisi | Pola |
|---|---|
| Fitur memiliki sub-halaman (e.g. landing + interior) | Buat subfolder di dalam folder fitur |
| Dua fitur berbagi canonical data yang sama dan UX-nya terkait | Kelompokkan dalam parent folder |
| Fitur berdiri sendiri tanpa relasi erat ke fitur lain | Tetap flat di `features/` |

### Contoh Pengelompokan yang Benar

```txt
# BENAR — forum landing dan interior dikelompokkan karena satu domain
features/forum/
├── css/_members.css   ← partial shared antar keduanya
├── landing/
│   ├── js/_cards.js + _handlers.js + _render.js + _utils.js
│   ├── css/forum.css + _forum-landing.css + _forum-members.css + _forum-messages.css + _forum-sidebar.css
│   └── forum.js
└── interior/
    ├── js/_cards.js + _handlers.js + _render.js + _utils.js
    ├── css/forum-interior.css
    └── forum-interior.js

# BENAR — chat dan dm dikelompokkan karena berbagi data/chat.json dan domain pesan
features/chat/
├── chat/
│   ├── js/_cards.js + _render.js + _utils.js
│   ├── css/chat.css
│   └── chat.js
└── dm/
    ├── js/
    ├── css/dm.css + _dm-bubbles.css + _dm-compose.css + _dm-desktop.css + _dm-modals.css
    └── dm.js

# BENAR — profile, edit-profile, dan settings dikelompokkan karena domain profil
features/profile/
├── profile/
│   ├── js/
│   ├── css/profile.css + _profile-header.css + _profile-panels.css
│   └── profile.js
├── edit-profile/
│   ├── js/
│   ├── css/edit-profile.css + _edit-profile-form.css
│   └── edit-profile.js
└── settings/
    ├── js/
    ├── css/settings.css + _settings-toggle.css
    └── settings.js + .json

# BENAR — fitur standalone tetap flat
features/about/
├── js/
├── css/about.css
├── about.js
└── about.json
```

### Contoh yang Salah

```txt
# SALAH — sub-halaman forum tidak dikelompokkan, jadi polusi di root features/
features/forum/forum.js
features/forum-interior/forum-interior.js   ← seharusnya di dalam features/forum/interior/

# SALAH — chat dan dm terpisah padahal berbagi domain dan data
features/chat/chat.js
features/dm/dm.js   ← seharusnya di dalam features/chat/dm/

# SALAH — profile, edit-profile, settings terpisah padahal domain profil
features/profile/profile.js
features/edit-profile/edit-profile.js
features/settings/settings.js   ← seharusnya di dalam features/profile/
```

---

## Organisasi `js/`

### Empat Lapisan

| Folder | Isi | Boleh import dari |
|---|---|---|
| `js/core/` | Bootstrap & infrastruktur (main, router, theme) | utils, services |
| `js/services/` | Singleton stateful — auth, search, notifications, forum-access | utils, data |
| `js/data/` | Data-access layer — fetch & cache ke sumber eksternal | utils |
| `js/utils/` | Pure functions — tidak ada state, tidak ada side effect | — (tidak boleh import dari layer lain) |

### Aturan Dependency

- `utils/` tidak boleh mengimport dari `services/`, `data/`, atau `core/`
- `data/` hanya boleh mengimport dari `utils/`
- `services/` boleh mengimport dari `utils/` dan `data/`
- `core/` boleh mengimport dari semua layer
- `features/` boleh mengimport dari semua layer di `js/`

### Cara Referensi Setelah Refactor

```js
// Sebelum (flat)
import { searchEngine } from '../../js/search.js';
import { getSession } from '../../js/auth.js';

// Sesudah (terorganisir)
import { searchEngine } from '../../js/services/search.js';
import { getSession } from '../../js/services/auth.js';
```

---

## Organisasi `components/`

### Tiga Kategori

| Folder | Isi | Ciri khas |
|---|---|---|
| `components/layout/` | navbar, top-bar, bottom-bar, footer | Di-mount sekali di `main.js`, tidak pernah di-render ulang |
| `components/ui/` | card, form-field, qr-modal, avatar | Stateless, menerima data sebagai parameter |
| `components/shared/` | page-header, tambah-minat | Boleh punya state ringan, dipakai 2+ fitur |

### Kapan Membuat Komponen Baru

- Dipakai oleh **2+ fitur yang berbeda** → buat di `components/` (kategori yang sesuai)
- Hanya dipakai **1 fitur** → simpan di dalam folder fitur tersebut
- Ada **3+ komponen spesifik fitur** → buat subfolder `components/` di dalam folder fitur

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
| `data/detail.json` | shared | `features/detail/`, `features/home/`, `features/forum/`, `js/services/search.js` |
| `data/groups.json` | shared | `features/groups/`, `features/forum/`, `js/services/search.js` |
| `data/forum.json` | shared | `features/forum/`, `features/home/`, `features/chat/` |
| `data/chat.json` | shared | `features/chat/chat/`, `features/chat/dm/` |
| `data/profile.json` | shared | `features/profile/`, `features/edit-profile/` |
| `data/auth.json` | shared | `features/auth/login/`, `features/auth/signup/` |
| `data/notifications.json` | shared | `features/notifications/`, `js/services/notifications.js` |
| `data/search.json` | shared | `features/search/` (UI copy saja — bukan hasil pencarian) |
| `data/users.json` | shared | `js/services/auth.js` |
| `js/data/dummy-users.js` | utility | `features/forum/landing/`, `features/forum/interior/`, `features/home/` |
| `features/home/home.json` | spesifik | `features/home/` saja (hero, stats, topics, action) |
| `features/about/about.json` | spesifik | `features/about/` saja |
| `features/contact/contact.json` | spesifik | `features/contact/` saja |
| `features/help/help.json` | spesifik | `features/help/` saja |
| `features/profile/settings/settings.json` | spesifik | `features/profile/settings/` saja |

### Data Tambahan — Forum Join Flow

Data join forum disimpan di `localStorage` (key: `STORAGE_KEYS.FORUMS` dari `js/core/config.js`):

```json
{
  "course_3": { "type": "course", "index": 3, "status": "joined", "joinedAt": 1700000000000 },
  "group_1":  { "type": "group", "index": 1, "status": "pending", "requestedAt": 1700000000000 }
}
```

Status: `joined` | `pending` | `none` (none = tidak ada di localStorage). Private forum auto-approve setelah 5-15 detik (simulasi).

### Hubungan Antar Data (Canonical Sources)

- **`detail.json` adalah canonical source** untuk data kursus (`title`, `description`, `status`, `category`). Semua halaman yang butuh data kursus fetch dari `detail.json` — tidak boleh copy field ke JSON sendiri
- **`forum.json` adalah canonical source** untuk data forum kursus (`memberCount`, `memberLimit`, `channels`, `messages`, `privacy`). Home page mengambil `memberCount`/`memberLimit` dari `forum.json`, bukan dari `home.json`
- **`groups.json` adalah canonical source** untuk data grup (`title`, `description`, `department`, `members`, `maxMembers`). Forum page untuk group mengambil `memberCount`/`maxMembers` dari `groups.json`, bukan dari `forum.json`
- **Hubungan via indeks array** — `home.json` forums terhubung ke `detail.json` dan `forum.json.courses` via posisi indeks. Urutan array `home.forums` HARUS identik dengan urutan `detail.json` dan `forum.json.courses` (10 entri)
- `data/search.json` hanya boleh berisi UI copy — data hasil pencarian dihitung runtime dari search engine

### Kapan Membuat JSON Baru

Sebelum membuat file JSON baru, tanya dua pertanyaan:

1. **Apakah data ini dipakai oleh lebih dari satu halaman?** → Ya: simpan di `data/`. Tidak: simpan di `features/nama/`
2. **Apakah data ini sudah ada di JSON lain?** → Ya: fetch dari JSON yang sudah ada, jangan buat file baru

### Contoh Benar

```js
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
const data = await fetchData('/features/help/help.json');

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
2. `js/core/main.js` menyimpan hash awal, mount semua komponen tetap secara sequential, lalu restore hash dan panggil `router()`.
3. `js/core/router.js` menggunakan satu route table — setiap halaman mengecek viewport (`isMobile`) untuk menampilkan versi yang sesuai.
4. Navigasi menggunakan **hash routing** (`/#/route`) — `hashchange` event memanggil `router()`.
5. Tombol back/forward browser berfungsi berkat `hashchange` event.
6. Router melepas `route-change` custom event; navbar, top-bar, bottom-bar, dan footer mendengarnya untuk update state.
7. Halaman shared membaca dari `data/`, halaman spesifik membaca dari `features/nama/nama.json`.
8. **Forum Join Flow** — `/#/forum` menampilkan card-list forum (daftar semua course + group forum). Join public langsung masuk ke interior (`/#/forum-interior`). Private forum butuh approval (auto-approve simulasi 5-15 detik). `js/services/forum-access.js` mengelola semua state join.
9. **DummyJSON Integrasi** — `js/data/dummy-users.js` menyediakan `getUsersForContext(forumIndex, count)` yang mengembalikan array user dengan logged-in user di posisi 0. Cache 24 jam dengan `seededShuffle()` untuk konsistensi avatar per forum index. Fetch eksternal via raw `fetch()` (bukan `fetchData()`). `Promise.allSettled` dipakai di forum page untuk paralel fetch lokal + DummyJSON tanpa crash saat DummyJSON unreachable. Graceful fallback: user tanpa gambar ditampilkan sebagai inisial SVG.

---

## Cara Kerja Coding ke Depan

### 1. Tambah halaman baru

Buat folder di `features/nama-halaman/`. Jika halaman ini erat dengan fitur yang sudah ada, kelompokkan di bawah parent folder fitur tersebut. Tentukan dulu apakah butuh JSON baru atau bisa pakai yang sudah ada:

```txt
# Jika fitur standalone dengan data spesifik:
features/blog/
├── js/
├── css/blog.css
├── blog.js
└── blog.json   ← boleh, karena hanya dipakai blog

# Jika fitur standalone yang fetch data shared:
features/blog/
├── js/_cards.js + _handlers.js + _render.js + _utils.js
├── css/blog.css + _blog-card.css + _blog-hero.css
└── blog.js     ← fetch dari /data/detail.json atau file shared lainnya

# Jika sub-halaman dari fitur yang sudah ada:
features/forum/
├── landing/
│   ├── js/ + css/
│   └── forum.js                 ← sudah ada
└── moderation/                  ← sub-halaman baru
    ├── js/
    ├── css/moderation.css
    └── moderation.js
```

Fungsi utama harus `export async function NamaHalaman()` yang mengembalikan DOM element:

```js
import { fetchData } from '../../js/utils/api.js';
import { injectStyle } from '../../js/utils/styleLoader.js';

export async function Blog() {
  injectStyle('/features/blog/css/blog.css');
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
// js/core/router.js
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

Jika komponen dipakai oleh 2+ fitur, buat di `components/` di bawah kategori yang sesuai (`layout/`, `ui/`, atau `shared/`). Jika hanya dipakai satu fitur, simpan di dalam folder fitur tersebut. Buat subfolder `components/` di dalam fitur hanya jika ada 3+ komponen spesifik fitur tersebut.

### 5. CSS — aturan ukuran file & format

- CSS must use expanded format — one property per line, one blank line between rules

| Tipe file | Batas |
|---|---|
| CSS fitur utama (mis. `home.css`) | ~100 baris |
| CSS partial (mis. `_feed.css`) | ~150 baris |
| CSS komponen shared | ~100 baris |
| `global.css` | ~200 baris |
| `_shared.css` | ~150 baris |

Jika file melebihi batasnya, ekstrak ke partial dengan prefix `_`:

```js
injectStyle('/features/home/css/home.css');
injectStyle('/features/home/css/_feed.css');
injectStyle('/features/home/css/_hero.css');
```

### 6. MD Update Rule

Setiap response yang membuat fitur baru, halaman, komponen, utility, atau perubahan arsitektur HARUS juga mengupdate bagian yang relevan di `conclusion.md` dan `README.md`. Jangan deliver perubahan kode tanpa update MD. Jika menambah halaman baru, update tabel peta data — tentukan apakah JSON-nya shared atau spesifik.

---

## Autentikasi

- State disimpan di `localStorage` — semua key didefinisikan di `js/core/config.js` (`STORAGE_KEYS.USERS`, `STORAGE_KEYS.SESSION`, dll).
- `data/users.json` berisi 3 seed users (Fatan, All, Manca) — di-seed ulang otomatis saat versi berubah.
- `js/services/auth.js` menyediakan: `initUsers()`, `login()`, `register()`, `logout()`, `getSession()`, `isAuthenticated()`, `navigateAfterAuth()`.
- Halaman yang membutuhkan login harus redirect ke `/login` jika tidak ada session.
- Navbar dan top-bar menukar tombol "Login"/"Create" dengan nama user saat terautentikasi.
- Bottom-bar dan navbar otomatis sembunyi di halaman auth (`/login`, `/signup`).

---

## Search Engine

- `js/services/search.js` mengekspor singleton `searchEngine`.
- Async init via `searchEngine.init()` — mem-fetch `data/detail.json`, `data/groups.json`, dan `data/forum.json`, lalu membangun indeks.
- Fuzzy search dengan character n-grams (2–4), field-weighted scoring (title > tags/category > description), dan coverage-ratio multiplier.
- Threshold minimum skor `MIN_SCORE = 30` untuk mencegah false positive.
- Halaman search harus await `searchEngine.init()` sebelum mengakses indeks.
- Hasil pencarian: forum/kursus → `/detail?index=N`, grup → `/groups`.

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
- `js/utils/` adalah pure functions — tidak boleh mengimport dari `js/services/`, `js/data/`, atau `js/core/`.
- Fitur yang erat secara domain (berbagi data & flow) dikelompokkan dalam satu parent folder di `features/`.

---

## Centralized Configuration

Semua konstanta environment (storage keys, API URLs, data paths, limits, timing, search scores, dll) didefinisikan di `js/core/config.js`. Import dari config untuk mengakses nilai-nilai tersebut — jangan hardcode.

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