document.documentElement.classList.add("js");
const C = window.CFG || {};
const $ = (s) => document.querySelector(s);
const h = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
function toast(t) { const e = h("div", "toast", t); document.body.append(e); setTimeout(() => e.remove(), 2600); }

/* Kartu muncul bergantian */
const kartu = document.querySelectorAll(".card");
kartu.forEach((k, i) => k.style.setProperty("--n", i % 4));
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
  kartu.forEach((k) => io.observe(k));
} else kartu.forEach((k) => k.classList.add("in"));

/* Slide banner */
const slides = document.querySelectorAll(".slide"), dots = document.querySelectorAll("#cdots button");
let si = 0, timer;
function tampil(n) { si = (n + slides.length) % slides.length; slides.forEach((s, i) => s.classList.toggle("on", i === si)); dots.forEach((d, i) => d.classList.toggle("on", i === si)); }
function mulai() { clearInterval(timer); timer = setInterval(() => tampil(si + 1), 6000); }
dots.forEach((d, i) => d.addEventListener("click", () => { tampil(i); mulai(); }));
mulai();

/* Jendela (dialog) umum */
const dlg = $("#dlg");
function buka(judul, node) { $("#dt").textContent = judul; $("#db").replaceChildren(node); dlg.showModal(); }
$("#dx").onclick = () => dlg.close();
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
function daftar(items) {
  const w = h("div", "gl");
  items.forEach((it) => {
    const a = h("a", "gitem"); a.href = it.url; a.target = "_blank"; a.rel = "noopener";
    const t = h("div"); t.append(h("strong", "", it.judul), h("span", "", it.ket));
    a.append(h("i", "", it.ikon), t, h("b", "", it.aksi));
    w.append(a);
  });
  return w;
}


/* ===== Ebook: rak buku ===== */
const SAMPUL = ["linear-gradient(150deg,#1b6bb5,#0f3a66)", "linear-gradient(150deg,#f58220,#d9480f)", "linear-gradient(150deg,#2fb36b,#0b7a43)", "linear-gradient(150deg,#8e5bd6,#5b2fa3)", "linear-gradient(150deg,#0aa5a5,#06706f)", "linear-gradient(150deg,#e0457b,#a3224f)"];
function rak(items) {
  const w = h("div", "rak");
  items.forEach((b, i) => {
    const bk = h("a", "bk"); bk.href = b.file; bk.target = "_blank"; bk.rel = "noopener";
    const cv = h("div", "cover"); cv.style.background = SAMPUL[i % SAMPUL.length];
    if (b.cover) { const im = new Image(); im.src = b.cover; im.alt = b.judul; im.onerror = () => im.remove(); cv.classList.add("img"); cv.append(im); }
    cv.append(h("strong", "", b.judul), h("small", "", "GLE KALIBRASI"));
    bk.append(cv, h("h3", "", b.judul), h("p", "", "Oleh " + b.penulis), h("span", "baca", "Baca ebook →"));
    w.append(bk);
  });
  return w;
}

/* ===== Ruang Refleksi: jurnal belajar + grafik progres (tersimpan di perangkat) ===== */
const RJ_KEY = "gle_refleksi_v1", SKOR = ["Belum paham", "Sedikit paham", "Cukup paham", "Paham", "Sangat paham"], SKOR_C = ["#ff7a7a", "#ffb066", "#ffd75e", "#7be3a8", "#2fb36b"];
const rjLoad = () => { try { return JSON.parse(localStorage.getItem(RJ_KEY)) || []; } catch { return []; } };
const rjSave = (a) => { try { localStorage.setItem(RJ_KEY, JSON.stringify(a)); return true; } catch { toast("Penyimpanan di perangkat tidak tersedia."); return false; } };
const tgl = (iso, pendek) => new Date(iso).toLocaleDateString("id-ID", pendek ? { day: "numeric", month: "short" } : { day: "numeric", month: "long", year: "numeric" });

function refleksi() {
  const root = h("div", "rj");
  root.append(h("p", "rj-note", "Tulis refleksi belajarmu. Catatan ini hanya tersimpan di perangkat yang kamu pakai dan tidak dikirim ke mana pun."));
  const tabs = h("div", "seg rj-tabs"), bTulis = h("button", "on", "Tulis refleksi"), bJurnal = h("button", "", "Jurnal dan progres");
  tabs.append(bTulis, bJurnal);
  const pTulis = h("div"), pJurnal = h("div", "hidden");
  root.append(tabs, pTulis, pJurnal);
  const pindah = (t) => { bTulis.classList.toggle("on", t); bJurnal.classList.toggle("on", !t); pTulis.classList.toggle("hidden", !t); pJurnal.classList.toggle("hidden", t); if (!t) jurnal(); };
  bTulis.onclick = () => pindah(true); bJurnal.onclick = () => pindah(false);

  /* Form */
  let skor = 0;
  const topik = h("select"); ["Literasi", "Numerasi", "Residu dan Daur Ulang", "Lainnya"].forEach((t) => topik.append(new Option(t, t)));
  const skala = h("div", "rj-skala");
  SKOR.forEach((s, i) => {
    const b = h("button"); b.type = "button"; b.style.setProperty("--c", SKOR_C[i]);
    b.append(h("b", "", i + 1), h("span", "", s));
    b.onclick = () => { skor = i + 1; [...skala.children].forEach((x, n) => x.classList.toggle("on", n === i)); };
    skala.append(b);
  });
  const tanya = [["belajar", "Hari ini aku belajar..."], ["sulit", "Bagian yang masih sulit bagiku..."], ["rencana", "Langkahku selanjutnya..."]], isian = {};
  const f = h("form", "rj-form");
  const lab = (t, el) => { const l = h("label"); l.append(h("span", "", t), el); return l; };
  f.append(lab("Topik yang kamu pelajari", topik), lab("Seberapa paham kamu hari ini?", skala));
  tanya.forEach(([k, t]) => { const ta = h("textarea"); ta.rows = 2; ta.maxLength = 400; ta.placeholder = "Tulis dengan kata-katamu sendiri"; isian[k] = ta; f.append(lab(t, ta)); });
  const kirim = h("button", "btn", "Simpan refleksi"); kirim.type = "submit"; f.append(kirim);
  f.onsubmit = (e) => {
    e.preventDefault();
    if (!skor) return toast("Pilih dulu seberapa paham kamu.");
    if (!isian.belajar.value.trim()) return toast("Tulis dulu apa yang kamu pelajari.");
    const a = rjLoad(); a.push({ t: new Date().toISOString(), topik: topik.value, skor, belajar: isian.belajar.value.trim(), sulit: isian.sulit.value.trim(), rencana: isian.rencana.value.trim() });
    if (!rjSave(a)) return;
    toast("Refleksi tersimpan. Hebat!"); f.reset(); skor = 0; [...skala.children].forEach((x) => x.classList.remove("on")); pindah(false);
  };
  pTulis.append(f);

  /* Jurnal dan grafik */
  function jurnal() {
    const a = rjLoad(); pJurnal.replaceChildren();
    if (!a.length) { pJurnal.append(h("p", "rj-kosong", "Belum ada refleksi. Tulis refleksi pertamamu di tab sebelah.")); return; }
    const rata = (a.reduce((s, x) => s + x.skor, 0) / a.length).toFixed(1);
    const st = h("div", "rj-stat");
    [["Refleksi", a.length], ["Rata-rata paham", rata + " / 5"], ["Terakhir", SKOR[a[a.length - 1].skor - 1]]].forEach(([k, v]) => { const d = h("div"); d.append(h("b", "", v), h("span", "", k)); st.append(d); });
    const grafik = h("div", "rj-bars");
    a.slice(-10).forEach((x) => { const b = h("div", "rj-bar"); b.style.setProperty("--s", x.skor); b.style.setProperty("--c", SKOR_C[x.skor - 1]); b.title = tgl(x.t) + ": " + SKOR[x.skor - 1]; b.append(h("i"), h("span", "", tgl(x.t, true))); grafik.append(b); });
    pJurnal.append(st, h("h4", "", "Perkembangan pemahamanmu (10 terakhir)"), grafik);
    const aksi = h("div", "rj-aksi"), unduh = h("button", "btn alt", "Unduh jurnal (.txt)");
    unduh.onclick = () => {
      const teks = a.map((x) => `${tgl(x.t)} | ${x.topik} | ${SKOR[x.skor - 1]}\nBelajar: ${x.belajar}\nMasih sulit: ${x.sulit || "-"}\nLangkah selanjutnya: ${x.rencana || "-"}\n`).join("\n");
      const l = document.createElement("a"); l.href = URL.createObjectURL(new Blob([teks], { type: "text/plain" })); l.download = "jurnal-refleksi.txt"; l.click(); URL.revokeObjectURL(l.href);
    };
    aksi.append(unduh); pJurnal.append(aksi, h("h4", "", "Catatan refleksimu"));
    [...a].reverse().forEach((x) => {
      const it = h("div", "rj-item"), hd = h("div", "rj-hd"), pill = h("span", "rj-pill", SKOR[x.skor - 1]); pill.style.background = SKOR_C[x.skor - 1];
      const del = h("button", "rj-del", "Hapus"); del.onclick = () => { if (confirm("Hapus catatan ini?")) { rjSave(rjLoad().filter((y) => y.t !== x.t)); jurnal(); } };
      hd.append(h("strong", "", x.topik), h("small", "", tgl(x.t)), pill, del);
      it.append(hd, h("p", "", "Belajar: " + x.belajar));
      if (x.sulit) it.append(h("p", "", "Masih sulit: " + x.sulit));
      if (x.rencana) it.append(h("p", "", "Selanjutnya: " + x.rencana));
      pJurnal.append(it);
    });
  }
  return root;
}

/* Klik kartu menu */
document.querySelectorAll("[data-menu]").forEach((a) => a.addEventListener("click", (e) => {
  const k = a.dataset.menu;
  if (k === "komunitas") return;
  e.preventDefault();
  if (k === "gim") {
    buka("Game Evaluasi", daftar((C.games || []).map((g) => ({ ...g, aksi: "Play" }))));
  } else if (k === "ebook") {
    const e = C.ebook || [];
    if (!e.length) return toast("Ebook segera hadir");
    buka("Ebook Hasil Karya Siswa", rak(e));
  } else if (k === "refleksi") {
    buka("Ruang Refleksi", refleksi());
  } else if (k === "media" || k === "banksoal") {
    const cfg = k === "media" ? ["materi", "Media Pembelajaran", "Materi segera hadir"] : ["banksoal", "Bank Soal Litnum", "Bank soal segera hadir"];
    const m = C[cfg[0]] || [];
    if (!m.length) return toast(cfg[2]);
    if (m.length === 1) return window.open(m[0].file, "_blank", "noopener");
    buka(cfg[1], daftar(m.map((x) => ({ judul: x.judul, ket: x.ket, ikon: "📄", url: x.file, aksi: "Baca" }))));
  } else {
    const u = (C.links || {})[k];
    if (!u || u === "#") return toast("Segera hadir");
    window.open(u, "_blank", "noopener");
  }
}));

/* Galeri + lightbox */
const grid = $("#ggrid"), lb = $("#lb"), lbi = $("#lbi"), foto = C.foto || [], tiles = [];
let li = 0;
foto.forEach((f, i) => {
  const b = h("button", "gt"), im = new Image();
  im.loading = "lazy"; im.alt = f.cap; im.src = f.src;
  im.onerror = () => { b.classList.add("kosong"); im.remove(); };
  b.append(im, h("span", "", f.cap));
  b.onclick = () => { if (!b.classList.contains("kosong")) lihat(i); else toast("Foto belum diunggah"); };
  tiles.push(b); grid.append(b);
});
function lihat(i) { li = i; lbi.src = foto[i].src; lbi.alt = foto[i].cap; $("#lbc").textContent = foto[i].cap; if (!lb.open) lb.showModal(); }
function geser(d) { for (let n = 1; n <= foto.length; n++) { const j = (li + d * n + foto.length * n) % foto.length; if (!tiles[j].classList.contains("kosong")) return lihat(j); } }
$("#lbp").onclick = () => geser(-1); $("#lbn").onclick = () => geser(1); $("#lbx").onclick = () => lb.close();
lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") geser(-1); if (e.key === "ArrowRight") geser(1); });


/* Berita dan bacaan */
const news = $("#news");
function baca(b) {
  const w = h("div", "bacaan");
  if (b.foto) { const im = new Image(); im.src = b.foto; im.alt = b.judul; im.onerror = () => im.remove(); w.append(im); }
  w.append(h("small", "", b.kategori));
  (b.isi || []).forEach((p) => w.append(h("p", "", p)));
  if ((b.tanya || []).length) { w.append(h("h4", "", "Uji pemahaman")); const ol = h("ol"); b.tanya.forEach((q) => ol.append(h("li", "", q))); w.append(ol); }
  buka(b.judul, w);
}
(window.BERITA || []).forEach((b) => {
  const a = h("a", "nw"), th = h("i", "th"), d = h("div");
  a.href = "#";
  if (b.foto) { const im = new Image(); im.src = b.foto; im.alt = b.judul; im.loading = "lazy"; im.onerror = () => im.remove(); th.append(im); }
  d.append(h("small", "", b.kategori), h("h3", "", b.judul), h("p", "", b.ringkas), h("span", "arr", "Baca →"));
  a.append(th, d);
  a.onclick = (e) => { e.preventDefault(); baca(b); };
  news.append(a);
});

/* Bar progres + menu aktif */
const bar = $("#bar"), menu = [...document.querySelectorAll(".top nav a")], target = menu.map((a) => document.querySelector(a.getAttribute("href")));
addEventListener("scroll", () => {
  const d = document.documentElement;
  bar.style.width = (scrollY / Math.max(1, d.scrollHeight - innerHeight)) * 100 + "%";
  let aktif = 0;
  target.forEach((t, i) => { if (t && t.getBoundingClientRect().top < innerHeight * 0.4) aktif = i; });
  menu.forEach((a, i) => a.classList.toggle("on", i === aktif));
}, { passive: true });

/* Percikan saat disentuh */
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addEventListener("pointerdown", (e) => {
    for (let i = 0; i < 7; i++) {
      const s = h("span", "pop", ["♻️", "⭐", "✨"][i % 3]), a = (Math.PI * 2 * i) / 7, d = 40 + Math.random() * 30;
      s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
      s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d + "px");
      document.body.append(s); setTimeout(() => s.remove(), 800);
    }
  });
}
