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

/* Klik kartu menu */
document.querySelectorAll("[data-menu]").forEach((a) => a.addEventListener("click", (e) => {
  const k = a.dataset.menu;
  if (k === "komunitas") return;
  e.preventDefault();
  if (k === "gim") {
    buka("Game Evaluasi", daftar((C.games || []).map((g) => ({ ...g, aksi: "Play" }))));
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
