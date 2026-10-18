/* ===== SEMUA YANG PERLU DIISI ADA DI FILE INI ===== */
window.CFG = {
  // Link menu lain (isi dengan link asli; "#" = tampil "Segera hadir")
  links: { tahap: "#", ebook: "#", refleksi: "#" },

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
    { judul: "Materi Pembelajaran Litnum", ket: "Materi pembelajaran dalam bentuk PDF.", file: "materi/materi-1.pdf" }
  ],

  // Bank Soal Litnum: taruh file PDF di folder "banksoal" lalu tulis namanya di sini.
  // Kalau hanya 1 PDF, klik menu langsung membuka PDF-nya.
  banksoal: [
    { judul: "Bank Soal Litnum", ket: "Latihan soal literasi dan numerasi dalam bentuk PDF.", file: "banksoal/banksoal-1.pdf" }
  ],

  // Galeri: taruh foto di folder "foto" lalu tulis namanya di sini (tambah baris sesukanya).
  foto: [
    { src: "foto/literasi-1.jpg", cap: "Dokumentasi Literasi 1" },
    { src: "foto/literasi-2.jpg", cap: "Dokumentasi Literasi 2" },
    { src: "foto/literasi-3.jpg", cap: "Dokumentasi Literasi 3" },
    { src: "foto/literasi-4.jpg", cap: "Dokumentasi Literasi 4" },
    { src: "foto/literasi-5.jpg", cap: "Dokumentasi Literasi 5" },
    { src: "foto/literasi-6.jpg", cap: "Dokumentasi Literasi 6" }
  ],

  // Komunitas: email guru/admin yang boleh menghapus kiriman siapa pun (huruf kecil semua)
  admin: [],

  // Komunitas: salin dari Firebase (Project settings > Your apps > Web)
  firebase: { apiKey: "", authDomain: "", projectId: "", storageBucket: "", messagingSenderId: "", appId: "" }
};
