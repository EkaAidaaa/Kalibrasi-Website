const C = window.CFG, $ = (s) => document.querySelector(s);
const h = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
const KELAS = [..."ABCDEFGHIJ"].map((x) => "VII " + x).concat([..."ABCDEFGHI"].map((x) => "VIII " + x), [..."ABCDEFGHIJ"].map((x) => "IX " + x));
const TOPIK = ["Umum", "Literasi", "Numerasi", "Residu & Daur Ulang", "Tanya Jawab"];
const WARNA = ["#1b6bb5", "#2fb36b", "#f58220", "#8e5bd6", "#e0457b", "#0aa5a5"];
function tampil(id) { ["warn", "gate", "profil", "forum"].forEach((k) => $("#" + k).classList.toggle("hidden", k !== id)); }
function toast(t) { const e = h("div", "toast", t); document.body.append(e); setTimeout(() => e.remove(), 2800); }
const warna = (s) => WARNA[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % WARNA.length];
function waktu(d) {
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return "baru saja"; if (s < 3600) return Math.floor(s / 60) + " mnt lalu";
  if (s < 86400) return Math.floor(s / 3600) + " jam lalu";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
function avatar(nama, uid, kecil) { const a = h("div", "av", (nama || "?")[0].toUpperCase()); a.style.setProperty("--c", warna(uid || nama)); return a; }

/* Isi pilihan kelas & topik */
const g = [["Kelas VII", 0, 10], ["Kelas VIII", 10, 19], ["Kelas IX", 19, 29]];
g.forEach(([l, a, b]) => { const og = h("optgroup"); og.label = l; KELAS.slice(a, b).forEach((k) => og.append(new Option(k, k))); $("#pkelas").append(og); });
TOPIK.forEach((t) => $("#ctopik").append(new Option(t, t)));

if (!C.firebase || !C.firebase.apiKey) { tampil("warn"); }
else main();

async function main() {
  const V = "10.12.2", B = `https://www.gstatic.com/firebasejs/${V}/`;
  const [A, Au, F] = await Promise.all([import(B + "firebase-app.js"), import(B + "firebase-auth.js"), import(B + "firebase-firestore.js")]);
  const app = A.initializeApp(C.firebase), auth = Au.getAuth(app), db = F.getFirestore(app);
  const admin = (C.admin || []).map((e) => e.toLowerCase());
  let me = null, unsubFeed = null, filter = "Semua", cooldown = 0;
  const nodes = new Map(), subs = new Map();
  const jadiAdmin = () => !!auth.currentUser && admin.includes((auth.currentUser.email || "").toLowerCase());

  $("#login").onclick = () => Au.signInWithPopup(auth, new Au.GoogleAuthProvider()).catch(() => toast("Gagal masuk. Coba buka di Chrome atau Safari."));
  $("#keluar").onclick = () => Au.signOut(auth);
  $("#ubah").onclick = () => { $("#pnama").value = me.nama; $("#pkelas").value = me.kelas; tampil("profil"); };

  Au.onAuthStateChanged(auth, async (u) => {
    if (!u) { me = null; berhenti(); return tampil("gate"); }
    try {
      const s = await F.getDoc(F.doc(db, "users", u.uid));
      if (s.exists()) { me = s.data(); mulai(); } else { $("#pnama").value = u.displayName || ""; tampil("profil"); }
    } catch { toast("Gagal memuat profil."); tampil("gate"); }
  });

  $("#pform").onsubmit = async (e) => {
    e.preventDefault();
    const nama = $("#pnama").value.trim(), kelas = $("#pkelas").value;
    if (nama.length < 2 || !KELAS.includes(kelas)) return toast("Isi nama dan pilih kelas dulu.");
    try { await F.setDoc(F.doc(db, "users", auth.currentUser.uid), { nama, kelas, updatedAt: F.serverTimestamp() }); me = { nama, kelas }; mulai(); }
    catch { toast("Gagal menyimpan profil."); }
  };

  function berhenti() { if (unsubFeed) unsubFeed(); unsubFeed = null; subs.forEach((f) => f()); subs.clear(); nodes.clear(); $("#feed").replaceChildren(); }

  function mulai() {
    $("#mnama").textContent = me.nama; $("#mkelas").textContent = me.kelas; tampil("forum");
    if (!$("#chips").children.length) ["Semua", ...TOPIK].forEach((t) => {
      const b = h("button", t === "Semua" ? "on" : "", t);
      b.onclick = () => { filter = t; [...$("#chips").children].forEach((c) => c.classList.toggle("on", c === b)); nodes.forEach(terapkan); cekKosong(); };
      $("#chips").append(b);
    });
    if (unsubFeed) return;
    unsubFeed = F.onSnapshot(F.query(F.collection(db, "posts"), F.orderBy("createdAt", "desc"), F.limit(60)), (snap) => {
      const feed = $("#feed");
      snap.docChanges().forEach((ch) => {
        const id = ch.doc.id, d = ch.doc.data();
        if (ch.type === "removed") { nodes.get(id)?.remove(); nodes.delete(id); subs.get(id)?.(); subs.delete(id); return; }
        let n = nodes.get(id);
        if (!n) { n = buatPost(id); nodes.set(id, n); } else n.remove();
        isi(n, id, d);
        feed.insertBefore(n, feed.children[ch.newIndex] || null);
        terapkan(n);
      });
      cekKosong();
    }, () => toast("Gagal memuat diskusi."));
  }
  const terapkan = (n) => n.classList.toggle("hidden", filter !== "Semua" && n.dataset.topik !== filter);
  const cekKosong = () => $("#kosong").classList.toggle("hidden", [...nodes.values()].some((n) => !n.classList.contains("hidden")));

  /* Kirim diskusi */
  $("#ctext").oninput = (e) => ($("#ccount").textContent = e.target.value.length + "/500");
  $("#cform").onsubmit = async (e) => {
    e.preventDefault();
    const text = $("#ctext").value.trim();
    if (!text) return;
    if (Date.now() < cooldown) return toast("Tunggu beberapa detik sebelum kirim lagi.");
    cooldown = Date.now() + 5000;
    try {
      await F.addDoc(F.collection(db, "posts"), { uid: auth.currentUser.uid, nama: me.nama, kelas: me.kelas, topik: $("#ctopik").value, text, likedBy: [], createdAt: F.serverTimestamp() });
      $("#ctext").value = ""; $("#ccount").textContent = "0/500";
    } catch { toast("Gagal mengirim. Pastikan profilmu sudah tersimpan."); }
  };

  /* Kartu diskusi */
  function buatPost(id) {
    const n = h("article", "post"), r = {};
    r.ph = h("div", "ph"); r.meta = h("div", "meta"); r.tp = h("span", "tp");
    r.pt = h("p", "pt");
    const pa = h("div", "pa");
    r.like = h("button"); r.balas = h("button", "", "💬 Balas"); r.lapor = h("button", "", "🚩 Laporkan"); r.hapus = h("button", "", "🗑 Hapus");
    pa.append(r.like, r.balas, r.lapor, r.hapus);
    r.th = h("div", "thread hidden"); r.rl = h("div"); r.th.append(r.rl);
    const f = h("form", "rf"), inp = h("input"); inp.placeholder = "Tulis balasan..."; inp.maxLength = 300; inp.required = true;
    f.append(inp, h("button", "", "Kirim")); r.th.append(f);
    n.append(r.ph, r.pt, pa, r.th); n._r = r;

    r.balas.onclick = () => {
      const buka = r.th.classList.toggle("hidden") === false;
      if (buka) subs.set(id, F.onSnapshot(F.query(F.collection(db, "posts", id, "replies"), F.orderBy("createdAt", "asc"), F.limit(100)), (s) => {
        r.rl.replaceChildren(); r.rl.className = "thread-list";
        s.forEach((x) => r.rl.append(buatBalasan(id, x.id, x.data())));
      }, () => toast("Gagal memuat balasan.")));
      else { subs.get(id)?.(); subs.delete(id); }
    };
    f.onsubmit = async (e) => {
      e.preventDefault();
      const text = inp.value.trim(); if (!text) return;
      try { await F.addDoc(F.collection(db, "posts", id, "replies"), { uid: auth.currentUser.uid, nama: me.nama, kelas: me.kelas, text, createdAt: F.serverTimestamp() }); inp.value = ""; }
      catch { toast("Gagal mengirim balasan."); }
    };
    r.like.onclick = () => { const s = n._d.likedBy || [], uid = auth.currentUser.uid; F.updateDoc(F.doc(db, "posts", id), { likedBy: s.includes(uid) ? F.arrayRemove(uid) : F.arrayUnion(uid) }).catch(() => toast("Gagal.")); };
    r.lapor.onclick = () => { if (confirm("Laporkan kiriman ini ke guru?")) F.addDoc(F.collection(db, "reports"), { postId: id, reporter: auth.currentUser.uid, createdAt: F.serverTimestamp() }).then(() => toast("Laporan terkirim. Terima kasih!")).catch(() => toast("Gagal melapor.")); };
    r.hapus.onclick = () => { if (confirm("Hapus kiriman ini?")) F.deleteDoc(F.doc(db, "posts", id)).catch(() => toast("Gagal menghapus.")); };
    return n;
  }
  function isi(n, id, d) {
    n._d = d; n.dataset.topik = d.topik; const r = n._r, uid = auth.currentUser.uid;
    r.ph.replaceChildren(avatar(d.nama, d.uid));
    const nm = h("strong", "", d.nama), kl = h("span", "kls", d.kelas);
    r.meta.replaceChildren(nm, kl, h("small", "", d.createdAt?.toDate ? waktu(d.createdAt.toDate()) : "baru saja"));
    r.tp.textContent = d.topik; r.ph.append(r.meta, r.tp);
    r.pt.textContent = d.text;
    const lk = d.likedBy || []; r.like.textContent = `❤️ ${lk.length}`; r.like.classList.toggle("on", lk.includes(uid));
    r.hapus.classList.toggle("hidden", !(d.uid === uid || jadiAdmin()));
    r.lapor.classList.toggle("hidden", d.uid === uid);
  }
  function buatBalasan(pid, rid, d) {
    const x = h("div", "rep"), b = h("div");
    b.append(h("strong", "", d.nama), h("span", "kls", d.kelas), h("p", "", d.text));
    x.append(avatar(d.nama, d.uid), b);
    if (d.uid === auth.currentUser.uid || jadiAdmin()) { const del = h("button", "", "🗑"); del.title = "Hapus"; del.onclick = () => confirm("Hapus balasan ini?") && F.deleteDoc(F.doc(db, "posts", pid, "replies", rid)).catch(() => toast("Gagal menghapus.")); x.append(del); }
    return x;
  }
}