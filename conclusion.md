# Conclusion

Proyek ini memakai arsitektur **Vanilla JavaScript SPA** yang sederhana, rapi, dan mudah dikembangkan.  
Prinsip utamanya adalah:

- **Satu file untuk satu tanggung jawab**
- **Komponen dibuat modular**
- **CSS dipisah per komponen**
- **Routing diatur terpusat**
- **Layout utama tidak di-render ulang**

Dengan pola ini, alur coding ke depan jadi lebih gampang dipelihara karena setiap fitur punya tempat yang jelas.

## Struktur Kerja Utama

Berikut alur kerja aplikasi ini:

1. `index.html` menjadi entry point.
2. `js/main.js` menjalankan aplikasi.
3. `js/router.js` memilih halaman berdasarkan hash URL.
4. Folder `components/` berisi komponen yang dipakai di halaman.
5. `css/global.css` menyimpan style dasar, variabel, dan utility umum.

## Struktur File

```txt
studNow/
├── index.html
├── conclusion.md
├── design.md
├── README.md
├── css/
│   └── global.css
├── js/
│   ├── main.js
│   └── router.js
└── components/
    ├── desktop/
    │   ├── navbar/
    │   │   ├── navbar.js
    │   │   └── navbar.css
    │   ├── footer/
    │   │   └── footer.js
    │   ├── card/
    │   │   ├── card.js
    │   │   └── card.css
    │   └── form-field/
    │       ├── form-field.js
    │       └── form-field.css
    ├── mobile/
    ├── shared/
    └── pages/
        ├── home/
        │   └── home.js
        ├── about/
        │   └── about.js
        └── contact/
            └── contact.js
```

## Cara Kerja Coding Ke Depan

Kalau mau menambah fitur baru, ikuti pola ini:

### 1. Buat halaman atau komponen baru

Kalau fiturnya berupa halaman baru, buat folder baru di:

```txt
components/pages/nama-page/
```

Lalu buat file JS utama untuk halaman tersebut, misalnya:

```txt
components/pages/blog/blog.js
```

Kalau fiturnya berupa komponen reusable, buat folder di:

```txt
components/nama-komponen/
```

Contoh:

```txt
components/button/
components/modal/
components/feature-card/
```

### 2. Pisahkan style per komponen

Setiap komponen idealnya punya file CSS sendiri.  
Contohnya:

```txt
components/card/card.js
components/card/card.css
```

Cara ini membuat style lebih aman dan tidak cepat bercampur dengan komponen lain.

### 3. Inject CSS hanya sekali

Untuk komponen yang punya CSS sendiri, pola yang dipakai adalah:

- cek dulu apakah `<link>` sudah ada di `document.head`
- kalau belum ada, baru tambahkan

Ini mencegah CSS dimuat dua kali saat komponen dipakai berulang.

### 4. Buat komponen sebagai fungsi

Semua komponen dibuat sebagai fungsi yang mengembalikan DOM element.  
Contohnya:

```js
export function Card(props) {
  const el = document.createElement('article');
  return el;
}
```

Keuntungan pola ini:

- mudah dipakai ulang
- mudah dites
- tidak bergantung pada framework
- event bisa diikat langsung ke instance komponen

### 5. Daftarkan halaman baru ke router

Kalau menambah halaman baru, update `js/router.js`:

```js
import { Blog } from '/components/pages/blog/blog.js';

const routes = {
  '/': Home,
  '/about': About,
  '/contact': Contact,
  '/blog': Blog,
};
```

Lalu buat link navigasinya:

```html
<a href="#/blog" data-link>Blog</a>
```

### 6. Gunakan layout utama yang tetap

Elemen berikut tidak perlu di-render ulang saat pindah halaman:

- `#navbar`
- `#footer`

Yang berubah hanya isi `#main`.  
Ini bikin perpindahan halaman lebih ringan dan lebih cepat.

## Alur Pikir Saat Coding

Saat ingin menambah fitur, urutan berpikir yang paling aman adalah:

1. Tentukan apakah ini **halaman** atau **komponen reusable**.
2. Tentukan folder yang sesuai.
3. Buat file JS untuk struktur DOM.
4. Buat file CSS terpisah bila perlu.
5. Hubungkan ke router jika itu halaman baru.
6. Cek lagi apakah styling dan event hanya mempengaruhi komponen tersebut.

## Aturan Penting

- Jangan menaruh semua logic di satu file besar.
- Jangan mencampur style global dengan style komponen kalau bisa dihindari.
- Jangan menduplikasi code yang bisa dijadikan komponen reusable.
- Jangan re-render navbar dan footer setiap pindah halaman.
- Jaga nama file tetap konsisten dengan nama foldernya.

## Kesimpulan Akhir

Struktur proyek ini cocok untuk dikembangkan bertahap karena:

- sederhana
- mudah dibaca
- mudah dipisah per fitur
- gampang di-maintain

Jadi, kalau ke depan ingin menambah halaman, komponen, atau interaksi baru, cukup ikuti pola:

**buat file komponen -> pisahkan CSS -> daftarkan ke router -> hubungkan ke layout utama**

Dengan begitu, kode tetap rapi dan alur development tetap konsisten.
