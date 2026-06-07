# StudNow

Forum belajar berbasis web — **Vanilla JavaScript SPA** tanpa framework.

---

## Tentang

StudNow adalah platform forum belajar responsif yang dibangun dengan JavaScript murni. Tidak ada React, Vue, atau framework lainnya — hanya HTML, CSS, dan ES Modules dengan History API untuk routing SPA.

---

## Teknologi

| | |
|---|---|
| **Routing** | History API — clean URL tanpa hash |
| **Styling** | Tailwind CSS v4 + CSS per fitur |
| **Ikon** | Bootstrap Icons v1.11.3 via CDN |
| **Data** | JSON files — single source of truth |
| **Auth** | localStorage (no backend) |
| **Search** | Fuzzy n-gram engine, field-weighted scoring |
| **Server** | `serve -s` (SPA mode) |

---

## Cara Menjalankan

### Prasyarat

- Node.js
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Menjalankan Tailwind CLI dalam mode watch **dan** local server secara bersamaan via `concurrently`.

### Hanya server lokal

```bash
npm run serve
```

### Build CSS untuk produksi

```bash
npm run build
```

> Server berjalan dalam **mode SPA** (`serve -s`) — semua URL diarahkan ke `index.html` agar routing History API tidak menghasilkan 404.

---

## Struktur Singkat

```txt
studNow/
├── js/                 # Core app logic + utilities
├── features/           # Satu folder per fitur (JS + CSS + JSON)
├── components/         # Komponen shared (dipakai 2+ fitur)
├── data/               # Data cross-feature (users.json)
├── css/
│   ├── global.css      # Sumber Tailwind + custom properties
│   └── _shared.css     # Shared mobile layout styles
├── dist/               # Build output (Tailwind)
└── index.html          # Entry point
```

Lihat `conclusion.md` untuk dokumentasi arsitektur lengkap.

---

## Fitur

- **Forum** — buat, baca, dan diskusi topik belajar
- **Grup** — bergabung dan kelola grup belajar
- **Kursus** — telusuri dan buka materi kursus
- **Pencarian** — fuzzy search dengan typo-tolerance di semua konten
- **Profil** — halaman profil dengan autentikasi
- **Chat** — pesan langsung antar pengguna
- **Notifikasi** — notifikasi aktivitas real-time (simulated)
- **Responsif** — satu codebase untuk desktop dan mobile

---

## Akun Demo

| Nama | Username | Password |
|---|---|---|
| Fatan | fatan | password123 |
| All | all | password123 |
| Manca | manca | password123 |

---

## Pengembangan

Lihat `conclusion.md` untuk panduan lengkap menambahkan halaman, komponen, dan aturan CSS.

Alur singkat:

```
buat features/nama/ → buat nama.js + nama.css + nama.json → daftarkan ke router → tambahkan data-link
```