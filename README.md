# StudNow

StudNow adalah starter project **SPA Vanilla JavaScript** yang ringan, tanpa framework, dan cocok untuk forum belajar atau aplikasi web sederhana yang ingin tetap rapi serta mudah dikembangkan.

## Ringkasan

- Menggunakan **JavaScript murni**
- Routing berbasis **History API** (clean URL tanpa hash)
- Komponen dipisah per folder
- Styling global memakai **Tailwind CSS**
- Mudah dikembangkan untuk mode **desktop** dan **mobile**

## Struktur Folder

```txt
studNow/
├── index.html              # Entry point aplikasi
├── css/
│   └── global.css          # File sumber untuk Tailwind dan style dasar
├── dist/
│   └── output.css          # Hasil build CSS yang dipakai aplikasi
├── js/
│   ├── main.js             # Bootstrap aplikasi
│   └── router.js           # Pengatur halaman berdasarkan path URL
├── components/
│   ├── desktop/            # Komponen khusus tampilan desktop
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── card/
│   │   └── form-field/
│   ├── mobile/             # Komponen khusus tampilan mobile
│   │   ├── top-bar/
│   │   └── bottom-bar/
│   └── pages/              # Halaman aplikasi
│       ├── home/
│       ├── about/
│       ├── contact/
│       ├── groups/
│       ├── chat/
│       ├── profile/
│       ├── signup/
│       ├── search/
│       └── notifications/
```

## Teknologi yang Dipakai

- **HTML**
- **CSS**
- **Tailwind CSS v4**
- **Vanilla JavaScript**

## Cara Menjalankan

### 1. Install dependensi dan approve builds

```bash
pnpm install
```
```bash
pnpm approve-builds
```

### 2. Development (Tailwind + server otomatis)

```bash
pnpm run dev
```

Perintah ini menjalankan Tailwind CLI dalam mode watch (memperbarui `dist/output.css` saat `css/global.css` berubah) **dan** server lokal secara bersamaan.

Buka `http://localhost:3000` di browser.

### 3. Hanya server lokal

```bash
pnpm run serve
```

Menjalankan server lokal saja di `http://localhost:3000`.

### 4. Build untuk produksi

```bash
npm run build
```

Menghasilkan file CSS final di `dist/output.css`.

> **Catatan:** Server menggunakan mode SPA — semua route diarahkan ke `index.html`.  
> Ini diperlukan agar URL bersih (mis. `/about`) bisa diakses langsung tanpa 404.

## Alur Kerja Aplikasi

1. `index.html` memuat layout utama.
2. `js/main.js` menjalankan aplikasi dan memasang komponen permanen (navbar, top-bar, bottom-bar, footer).
3. `js/router.js` memilih halaman berdasarkan path URL (mis. `/about`) menggunakan History API.
4. Navigasi antar halaman dilakukan lewat `history.pushState()` tanpa reload.
5. Tombol **back/forward** browser tetap berfungsi berkat event `popstate`.
6. Folder `components/pages/` menyimpan semua halaman (home, about, contact, groups, chat, profile, signup, search, notifications).
7. Folder `components/desktop/` dan `components/mobile/` dipakai untuk komponen sesuai kebutuhan tampilan.

## Pola Pengembangan

### 1. Tambah halaman baru

Kalau ingin membuat halaman baru, buat folder baru di:

```txt
components/pages/nama-halaman/
```

Contoh:

```txt
components/pages/blog/blog.js
```

Lalu daftarkan halaman itu ke `js/router.js`.

### 2. Tambah komponen baru

Kalau fiturnya berupa komponen reusable, simpan di folder yang sesuai:

- `components/desktop/` untuk komponen desktop
- `components/mobile/` untuk komponen mobile
- `components/shared/` untuk komponen yang dipakai di semua tampilan

### 3. Pisahkan style dengan rapi

Style dasar dan utility umum disimpan di `css/global.css`.

Kalau komponen punya style khusus, letakkan CSS-nya di folder komponen tersebut agar lebih mudah dirawat.

### 4. Gunakan komponen sebagai fungsi

Setiap komponen dibuat sebagai fungsi yang mengembalikan elemen DOM.  
Pola ini membuat kode lebih mudah dibaca, dipakai ulang, dan diuji.

## Contoh Penambahan Halaman

Misalnya ingin menambah halaman `blog`:

1. Buat folder `components/pages/blog/`
2. Buat file `blog.js`
3. Import komponen itu di `js/router.js`
4. Tambahkan route baru ke map router
5. Tambahkan link navigasi ke halaman tersebut

Contoh route di `js/router.js`:

```js
import { Blog } from '/components/pages/blog/blog.js';

const routes = {
  '/': Home,
  '/about': About,
  '/contact': Contact,
  '/blog': Blog,
};
```

Contoh link navigasi:

```html
<a href="/blog" data-link>Blog</a>
```

`data-link` akan di-intercept oleh `main.js` yang memanggil `navigateTo()` dengan `history.pushState()`.

## Catatan Penting

- Jangan menaruh semua logic ke satu file besar.
- Jangan mencampur style global dengan style komponen kalau bisa dihindari.
- Jangan re-render komponen permanen seperti navbar dan footer setiap pindah halaman.
- Jaga penamaan folder dan file supaya konsisten.

## Kesimpulan

Struktur project ini dibuat supaya:

- mudah dipahami developer baru
- mudah ditambah fitur baru
- tetap rapi walau jumlah komponen bertambah
- cocok untuk pengembangan bertahap

Kalau kamu mengikuti pola folder dan routing yang sudah ada, project ini akan tetap sederhana tetapi tetap siap berkembang.
