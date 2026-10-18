/* ===== SEMUA YANG PERLU DIISI ADA DI FILE INI ===== */
window.CFG = {
  // Link menu tambahan (cadangan, saat ini tidak dipakai)
  links: {},

  // Game Evaluasi (menu Game Evaluasi)
  games: [
    { judul: "Literasi Numerasi Tahap Dasar", ket: "Kumpulan latihan literasi dan numerasi untuk tahap dasar.", ikon: "🌱", url: "https://www.educaplay.com/user/15280539-agung/" },
    { judul: "Kuis Literasi Pengetahuan Umum", ket: "Uji pengetahuan umummu lewat kuis.", ikon: "🧠", url: "https://www.educaplay.com/learning-resources/30821308-kuis_literasi_pengetahuan_umum.html" },
    { judul: "Teka-Teki Silang Lingkungan", ket: "Isi kotak-kotaknya dan kenali isu lingkungan.", ikon: "🌿", url: "https://www.educaplay.com/learning-resources/30821363-teka_teki_silang_lingkungan.html" },
    { judul: "Match Numerasi: Jodoh Angka", ket: "Jodohkan angka untuk melatih numerasi.", ikon: "🔢", url: "https://www.educaplay.com/learning-resources/30821517-match_numerasi_jodoh_angka.html" },
    { judul: "Kalibrasi: Sinergi Limbah Residu Menjadi Media Belajar", ket: "Evaluasi pemahamanmu tentang limbah residu sebagai media belajar.", ikon: "♻️", url: "https://www.educaplay.com/learning-resources/31110863-kalibrasi_sinergi_limbah_residu_menjadi_media_belajar.html" },
    { judul: "Litnum SMP: Data dan Pengelolaan Sampah Sekolah", ket: "Latihan membaca data dan mengelola sampah di sekolah.", ikon: "📊", url: "https://www.educaplay.com/learning-resources/31110927-litnum_smp_data_dan_pengelolaan_sampah_sekolah.html" }
  ],

  // Media Pembelajaran: taruh file PDF di folder "materi" lalu tulis namanya di sini.
  // Kalau hanya 1 PDF, klik menu langsung membuka PDF-nya.
  materi: [
    { judul: "Materi Pembelajaran Litnum", ket: "Materi pembelajaran dalam bentuk PDF.", file: "materi-1.pdf" }
  ],

  // Bank Soal Litnum: taruh file PDF di folder "banksoal" lalu tulis namanya di sini.
  // Kalau hanya 1 PDF, klik menu langsung membuka PDF-nya.
  banksoal: [
    { judul: "LKPD Literasi Dan Numerasi Siswa", ket: "Latihan Literasi Dan Numerasi.", file: "LKPD LITNUM1.pdf" }
  ],

  // Data Hasil: taruh 3 file PDF di folder yang sama dengan index.html, lalu ganti judul dan nama filenya.
  datahasil: [
    { judul: "Data Sampel Siswa", ket: "Dokumen data dan hasil kegiatan.", file: "datasampel.pdf" },
    { judul: "Jurnal Pelaksanaan & Instrumen", ket: "Dokumen data dan hasil kegiatan.", file: "jurnalpelaksanaan.pdf" },
    { judul: "Tabel Rubrik Penilaian Instrumen Per Siklus", ket: "Dokumen data dan hasil kegiatan.", file: "tabelrubrik.pdf" }
  ],

  // Ebook (Hasil Karya Siswa): taruh file PDF di folder yang sama dengan index.html,
  // lalu isi judul, penulis, dan nama filenya. "cover" boleh dikosongkan (otomatis dibuatkan sampul warna)
  // atau diisi nama file gambar sampul, misalnya "cover-1.jpg". Tambah ebook dengan menyalin satu baris.
  ebook: [
    { judul: "Komputer Sehari-hari", penulis: "Anak Agung Elvin Aryasuta Moning, Kelas VIII F", file: "ebook-1.pdf", cover: "" },
    { judul: "Judul Ebook 2", penulis: "Nama Penulis, Kelas VIII B", file: "ebook-2.pdf", cover: "" },
    { judul: "Judul Ebook 3", penulis: "Nama Penulis, Kelas IX C", file: "ebook-3.pdf", cover: "" }
  ],

  // Galeri: taruh foto di folder yang sama dengan index.html lalu tulis namanya di sini (tambah baris sesukanya).
  foto: [
    { src: "gambarr1.jpeg", cap: "Dokumentasi Literasi 1" },
    { src: "gambarr2.jpeg", cap: "Dokumentasi Literasi 2" },
    { src: "gambarr3.jpeg", cap: "Dokumentasi Literasi 3" },
    { src: "gambarr4.jpeg", cap: "Dokumentasi Literasi 4" },
    { src: "gambarr5.jpeg", cap: "Dokumentasi Literasi 5" },
    { src: "gambarr6.jpeg", cap: "Dokumentasi Literasi 6" },
    { src: "gambarr7.jpeg", cap: "Dokumentasi Literasi 7" },
    { src: "gambarr8.jpeg", cap: "Dokumentasi Literasi 8" },
    { src: "gambarr9.jpeg", cap: "Dokumentasi Literasi 9" }
  ],

  // Komunitas: email guru/admin yang boleh menghapus kiriman siapa pun (huruf kecil semua)
  admin: ["ekaayuni77@gmail.com", "Balivstore@gmail.com"],

  // Komunitas: salin dari Firebase (Project settings > Your apps > Web)
  firebase: { apiKey: "AIzaSyC6cOGQQMmdAjhbLFYIZ5kod2O11q2ih7o", authDomain: "kalibrasi-4a7a2.firebaseapp.com", projectId: "kalibrasi-4a7a2", storageBucket: "kalibrasi-4a7a2.firebasestorage.app", messagingSenderId: "980414560379", appId: "1:980414560379:web:7c3cc956d76ceb00ffcade" }
};
