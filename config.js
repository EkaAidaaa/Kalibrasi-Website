/* ===== SEMUA YANG PERLU DIISI ADA DI FILE INI ===== */
window.CFG = {
  // Link menu lain (isi dengan link asli; "#" = tampil "Segera hadir")
  links: { tahap: "#", ebook: "#", banksoal: "#", refleksi: "#" },

  // Gim Digital (menu Gim Digital)
  games: [
    { judul: "Literasi Numerasi Tahap Dasar", ket: "Kumpulan latihan literasi dan numerasi untuk tahap dasar.", ikon: "🌱", url: "https://www.educaplay.com/user/15280539-agung/" },
    { judul: "Kuis Literasi Pengetahuan Umum", ket: "Uji pengetahuan umummu lewat kuis.", ikon: "🧠", url: "https://www.educaplay.com/learning-resources/30821308-kuis_literasi_pengetahuan_umum.html" },
    { judul: "Teka-Teki Silang Lingkungan", ket: "Isi kotak-kotaknya dan kenali isu lingkungan.", ikon: "🌿", url: "https://www.educaplay.com/learning-resources/30821363-teka_teki_silang_lingkungan.html" },
    { judul: "Match Numerasi: Jodoh Angka", ket: "Jodohkan angka untuk melatih numerasi.", ikon: "🔢", url: "https://www.educaplay.com/learning-resources/30821517-match_numerasi_jodoh_angka.html" }
  ],

  // Media Pembelajaran: taruh file PDF di folder "materi" lalu tulis namanya di sini.
  // Kalau hanya 1 PDF, klik menu langsung membuka PDF-nya.
  materi: [
    { judul: "Materi Pembelajaran Litnum", ket: "Materi pembelajaran dalam bentuk PDF.", file: "materi/materi-1.pdf" }
  ],

  // Galeri: taruh foto di folder "foto" lalu tulis namanya di sini (tambah baris sesukanya).
  foto: [
    { src: "gambarr1.jpeg", cap: "Dokumentasi Literasi 1" },
    { src: "gambarr2.jpeg", cap: "Dokumentasi Literasi 2" },
    { src: "gambarr3.jpeg", cap: "Dokumentasi Literasi 3" },
    { src: "gambarr4.jpeg", cap: "Dokumentasi Literasi 4" },
    { src: "gambarr5.jpeg", cap: "Dokumentasi Literasi 5" },
    { src: "gambarr6.jpeg", cap: "Dokumentasi Literasi 6" },
    { src: "gambarr7.jpeg", cap: "Dokumentasi Literasi 7" },
    { src: "gambarr8.jpeg", cap: "Dokumentasi Literasi 8" }
  ],

  // Komunitas: email guru/admin yang boleh menghapus kiriman siapa pun (huruf kecil semua)
  admin: [],

  // Komunitas: salin dari Firebase (Project settings > Your apps > Web)
  firebase: { apiKey: "AIzaSyC6cOGQQMmdAjhbLFYIZ5kod2O11q2ih7o", authDomain: "kalibrasi-4a7a2.firebaseapp.com", projectId: "kalibrasi-4a7a2", storageBucket: "kalibrasi-4a7a2.firebasestorage.app", messagingSenderId: "980414560379", appId: "1:980414560379:web:7c3cc956d76ceb00ffcade" }
};
