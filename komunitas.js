const C = window.CFG || {}, $ = (s) => document.querySelector(s);
const h = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
const KELAS = [..."ABCDEFGHIJ"].map((x) => "VII " + x).concat([..."ABCDEFGHI"].map((x) => "VIII " + x), [..."ABCDEFGHIJ"].map((x) => "IX " + x));
const TOPIK = ["Umum", "Literasi", "Numerasi", "Residu & Daur Ulang", "Tanya Jawab"];
const TC = { "Umum": "#1b6bb5", "Literasi": "#f58220", "Numerasi": "#2fb36b", "Residu & Daur Ulang": "#0aa5a5", "Tanya Jawab": "#8e5bd6" };
const IC = {
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  flag: '<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>'
};
const ib = (cls, ic, txt) => { const b = h("button", "ib " + cls); b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[ic]}</svg><span>${txt}</span>`; return b; };
const warnaKelas = (k) => (k || "").startsWith("VIII") ? "#1b6bb5" : (k || "").startsWith("VII") ? "#2fb36b" : "#f58220";
const avatar = (nama, kelas, cls = "") => { const a = h("div", "av " + cls, (nama || "?")[0].toUpperCase()); a.style.setProperty("--c", warnaKelas(kelas)); return a; };
function tampil(id) { ["warn", "gate", "profil", "forum"].forEach((k) => $("#" + k).classList.toggle("hidden", k !== id)); }
function toast(t, ms = 2800) { const e = h("div", "toast", t); document.body.append(e); setTimeout(() => e.remove(), ms); }
function waktu(d) {
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return "baru saja"; if (s < 3600) return Math.floor(s / 60) + " mnt lalu";
  if (s < 86400) return Math.floor(s / 3600) + " jam lalu";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/* Isi pilihan kelas */
[["Kelas VII", 0, 10], ["Kelas VIII", 10, 19], ["Kelas IX", 19, 29]].forEach(([l, a, b]) => { const og = h("optgroup"); og.label = l; KELAS.slice(a, b).forEach((k) => og.append(new Option(k, k))); $("#pkelas").append(og); });
function pratinjau() { const n = $("#pnama").value.trim(), k = $("#pkelas").value; $("#pav").textContent = (n || "?")[0].toUpperCase(); $("#pav").style.setProperty("--c", warnaKelas(k)); $("#ppn").textContent = n || "Namamu"; $("#ppk").textContent = k || "Kelas"; }
$("#pnama").oninput = pratinjau; $("#pkelas").onchange = pratinjau;

if (!window.CFG) { $("#wmsg").textContent = "Diagnosis: config.js tidak terbaca atau ada salah ketik di dalamnya (kurang tanda kutip, koma, atau kurung)."; tampil("warn"); }
else if (!C.firebase || !C.firebase.apiKey) { $("#wmsg").textContent = "Diagnosis: config.js terbaca, tetapi apiKey di bagian firebase masih kosong. Pastikan file yang terunggah ke GitHub sudah yang terisi."; tampil("warn"); }
else main();

async function main() {
  const B = "https://www.gstatic.com/firebasejs/10.12.2/";
  const [A, Au, F] = await Promise.all([import(B + "firebase-app.js"), import(B + "firebase-auth.js"), import(B + "firebase-firestore.js")]);
  const app = A.initializeApp(C.firebase), auth = Au.getAuth(app), db = F.getFirestore(app);
  const admin = (C.admin || []).map((e) => e.toLowerCase());
  let me = null, unsubFeed = null, filter = "Semua", cari = "", mode = "baru", topikKirim = "Umum", cooldown = 0;
  const nodes = new Map(), subs = new Map();
  const jadiAdmin = () => !!auth.currentUser && admin.includes((auth.currentUser.email || "").toLowerCase());

  const PESAN = {
    "auth/unauthorized-domain": "Domain website belum diizinkan. Tambahkan di Firebase: Authentication > Settings > Authorized domains.",
    "auth/operation-not-allowed": "Login Google belum diaktifkan di Firebase (Authentication > Sign-in method).",
    "auth/popup-blocked": "Pop-up diblokir browser. Izinkan pop-up untuk situs ini, lalu coba lagi.",
    "auth/popup-closed-by-user": "Jendela login ditutup sebelum selesai.", "auth/cancelled-popup-request": "Jendela login ditutup sebelum selesai.",
    "auth/invalid-api-key": "apiKey di config.js tidak valid. Salin ulang dari Firebase.",
    "auth/network-request-failed": "Koneksi internet bermasalah. Coba lagi."
  };
  $("#login").onclick = () => Au.signInWithPopup(auth, new Au.GoogleAuthProvider()).catch((e) => { console.error("Login gagal:", e); toast(PESAN[e.code] || "Gagal masuk. Kode: " + (e.code || e.message), 9000); });
  $("#keluar").onclick = () => Au.signOut(auth);
  $("#ubah").onclick = () => { $("#pnama").value = me.nama; $("#pkelas").value = me.kelas; pratinjau(); tampil("profil"); };

  Au.onAuthStateChanged(auth, async (u) => {
    if (!u) { me = null; berhenti(); return tampil("gate"); }
    try {
      const s = await F.getDoc(F.doc(db, "users", u.uid));
      if (s.exists()) { me = s.data(); mulai(); } else { $("#pnama").value = u.displayName || ""; pratinjau(); tampil("profil"); }
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

  /* Menu topik, pilihan topik kiriman, urutan, pencarian */
  function siapkanUI() {
    const tl = $("#topiklist"); tl.replaceChildren();
    ["Semua", ...TOPIK].forEach((t) => {
      const b = h("button", t === filter ? "tm on" : "tm"); b.dataset.t = t;
      const dot = h("i"); dot.style.background = TC[t] || "#0f3a66";
      b.append(dot, h("span", "", t), h("b", "", "0"));
      b.onclick = () => { filter = t; tl.querySelectorAll(".tm").forEach((x) => x.classList.toggle("on", x === b)); segarkan(); };
      tl.append(b);
    });
    const tc = $("#ctopik"); tc.replaceChildren();
    TOPIK.forEach((t) => {
      const b = h("button", t === topikKirim ? "on" : "", t); b.type = "button"; b.style.setProperty("--tc", TC[t]);
      b.onclick = () => { topikKirim = t; tc.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); };
      tc.append(b);
    });
  }
  $("#cari").oninput = (e) => { cari = e.target.value.trim().toLowerCase(); segarkan(); };
  $("#urut").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; mode = b.dataset.u; [...$("#urut").children].forEach((x) => x.classList.toggle("on", x === b)); segarkan(); };

  function mulai() {
    $("#mnama").textContent = me.nama; $("#mkelas").textContent = me.kelas;
    const av = avatar(me.nama, me.kelas, "big"); av.id = "mav"; $("#mav").replaceWith(av);
    const av2 = avatar(me.nama, me.kelas); av2.id = "cav"; $("#cav").replaceWith(av2);
    siapkanUI(); tampil("forum");
    if (unsubFeed) return segarkan();
    unsubFeed = F.onSnapshot(F.query(F.collection(db, "posts"), F.orderBy("createdAt", "desc"), F.limit(60)), (snap) => {
      snap.docChanges().forEach((ch) => {
        const id = ch.doc.id;
        if (ch.type === "removed") { nodes.get(id)?.remove(); nodes.delete(id); subs.get(id)?.(); subs.delete(id); return; }
        let n = nodes.get(id);
        if (!n) { n = buatPost(id); nodes.set(id, n); $("#feed").append(n); }
        isi(n, ch.doc.data());
      });
      segarkan();
    }, () => toast("Gagal memuat diskusi."));
  }

  const ms = (d) => (d.createdAt?.toMillis ? d.createdAt.toMillis() : Date.now());
  function segarkan() {
    const arr = [...nodes.values()];
    arr.sort((a, b) => mode === "populer" ? ((b._d.likedBy || []).length - (a._d.likedBy || []).length) || (ms(b._d) - ms(a._d)) : ms(b._d) - ms(a._d));
    arr.forEach((n, i) => {
      n.style.order = i; const d = n._d;
      const ok = (filter === "Semua" || d.topik === filter) && (!cari || (d.text + " " + d.nama).toLowerCase().includes(cari));
      n.classList.toggle("hidden", !ok);
    });
    $("#kosong").classList.toggle("hidden", arr.some((n) => !n.classList.contains("hidden")));
    const cnt = { Semua: arr.length }; arr.forEach((n) => (cnt[n._d.topik] = (cnt[n._d.topik] || 0) + 1));
    document.querySelectorAll("#topiklist .tm").forEach((b) => (b.lastChild.textContent = cnt[b.dataset.t] || 0));
    $("#stD").textContent = arr.length; $("#stA").textContent = new Set(arr.map((n) => n._d.uid)).size;
    $("#stS").textContent = arr.reduce((s, n) => s + (n._d.likedBy || []).length, 0);
  }

  /* Kirim diskusi */
  $("#ctext").oninput = (e) => ($("#ccount").textContent = e.target.value.length + "/500");
  $("#cform").onsubmit = async (e) => {
    e.preventDefault();
    const text = $("#ctext").value.trim(); if (!text) return;
    if (Date.now() < cooldown) return toast("Tunggu beberapa detik sebelum kirim lagi.");
    cooldown = Date.now() + 5000;
    try {
      await F.addDoc(F.collection(db, "posts"), { uid: auth.currentUser.uid, nama: me.nama, kelas: me.kelas, topik: topikKirim, text, likedBy: [], createdAt: F.serverTimestamp() });
      $("#ctext").value = ""; $("#ccount").textContent = "0/500";
    } catch { toast("Gagal mengirim. Pastikan profilmu sudah tersimpan."); }
  };

  /* Kartu diskusi */
  function buatPost(id) {
    const n = h("article", "kpost"), r = {};
    r.ph = h("div", "kph"); r.pt = h("p", "pt");
    const pa = h("div", "pa");
    r.like = ib("like", "heart", "0"); r.balas = ib("", "chat", "Balas"); r.lapor = ib("", "flag", "Laporkan"); r.hapus = ib("del", "trash", "Hapus");
    pa.append(r.like, r.balas, r.lapor, r.hapus);
    r.th = h("div", "thread hidden"); r.rl = h("div", "thread-list"); r.th.append(r.rl);
    const f = h("form", "rf"), inp = h("input"); inp.placeholder = "Tulis balasan..."; inp.maxLength = 300; inp.required = true;
    f.append(inp, h("button", "", "Kirim")); r.th.append(f);
    n.append(r.ph, r.pt, pa, r.th); n._r = r;

    r.balas.onclick = () => {
      const buka = r.th.classList.toggle("hidden") === false;
      if (buka) subs.set(id, F.onSnapshot(F.query(F.collection(db, "posts", id, "replies"), F.orderBy("createdAt", "asc"), F.limit(100)), (s) => {
        r.rl.replaceChildren(); s.forEach((x) => r.rl.append(buatBalasan(id, x.id, x.data())));
      }, () => toast("Gagal memuat balasan.")));
      else { subs.get(id)?.(); subs.delete(id); }
    };
    f.onsubmit = async (e) => {
      e.preventDefault(); const text = inp.value.trim(); if (!text) return;
      try { await F.addDoc(F.collection(db, "posts", id, "replies"), { uid: auth.currentUser.uid, nama: me.nama, kelas: me.kelas, text, createdAt: F.serverTimestamp() }); inp.value = ""; }
      catch { toast("Gagal mengirim balasan."); }
    };
    r.like.onclick = () => { const s = n._d.likedBy || [], uid = auth.currentUser.uid; F.updateDoc(F.doc(db, "posts", id), { likedBy: s.includes(uid) ? F.arrayRemove(uid) : F.arrayUnion(uid) }).catch(() => toast("Gagal.")); };
    r.lapor.onclick = () => { if (confirm("Laporkan kiriman ini ke guru?")) F.addDoc(F.collection(db, "reports"), { postId: id, reporter: auth.currentUser.uid, createdAt: F.serverTimestamp() }).then(() => toast("Laporan terkirim. Terima kasih!")).catch(() => toast("Gagal melapor.")); };
    r.hapus.onclick = () => { if (confirm("Hapus kiriman ini?")) F.deleteDoc(F.doc(db, "posts", id)).catch(() => toast("Gagal menghapus.")); };
    return n;
  }
  function isi(n, d) {
    n._d = d; const r = n._r, uid = auth.currentUser.uid;
    n.style.setProperty("--tc", TC[d.topik] || "#1b6bb5");
    const meta = h("div", "meta"), nm = h("strong", "", d.nama), kl = h("span", "kls", d.kelas);
    kl.style.setProperty("--c", warnaKelas(d.kelas));
    meta.append(nm, kl, h("small", "", d.createdAt?.toDate ? waktu(d.createdAt.toDate()) : "baru saja"));
    r.ph.replaceChildren(avatar(d.nama, d.kelas), meta, h("span", "tp", d.topik));
    r.pt.textContent = d.text;
    const lk = d.likedBy || []; r.like.lastChild.textContent = lk.length; r.like.classList.toggle("on", lk.includes(uid));
    r.hapus.classList.toggle("hidden", !(d.uid === uid || jadiAdmin()));
    r.lapor.classList.toggle("hidden", d.uid === uid);
  }
  function buatBalasan(pid, rid, d) {
    const x = h("div", "rep"), b = h("div", "rb"), kl = h("span", "kls", d.kelas); kl.style.setProperty("--c", warnaKelas(d.kelas));
    b.append(h("strong", "", d.nama), kl, h("p", "", d.text));
    x.append(avatar(d.nama, d.kelas, "sm"), b);
    if (d.uid === auth.currentUser.uid || jadiAdmin()) { const del = ib("del x", "trash", ""); del.title = "Hapus"; del.onclick = () => confirm("Hapus balasan ini?") && F.deleteDoc(F.doc(db, "posts", pid, "replies", rid)).catch(() => toast("Gagal menghapus.")); x.append(del); }
    return x;
  }
}
