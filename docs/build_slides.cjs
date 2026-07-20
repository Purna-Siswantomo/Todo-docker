const pptxgen = require("pptxgenjs");
const path = require("path");

const NAVY = "0B2545";
const NAVY2 = "13315C";
const BLUE = "1D63ED";
const MINT = "00D3AB";
const INK = "1A2333";
const MUTE = "5B6B82";
const WHITE = "FFFFFF";
const CARD = "F3F6FB";

const DIAGRAM = path.join(__dirname, "architecture-diagram.png");

function newDeck() {
  const p = new pptxgen();
  p.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  p.layout = "WIDE";
  return p;
}

function darkBg(slide) {
  slide.background = { color: NAVY };
}
function lightBg(slide) {
  slide.background = { color: WHITE };
}

function kicker(slide, text, opts = {}) {
  slide.addText(text.toUpperCase(), {
    x: opts.x ?? 0.6, y: opts.y ?? 0.35, w: opts.w ?? 8, h: 0.35,
    fontFace: "Calibri", fontSize: 13, bold: true, color: opts.color ?? MINT,
    charSpacing: 2,
  });
}

function title(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.6, y: opts.y ?? 0.68, w: opts.w ?? 12.1, h: opts.h ?? 0.7,
    fontFace: "Cambria", fontSize: opts.size ?? 30, bold: true,
    color: opts.color ?? INK,
  });
}

function pageNum(slide, n) {
  slide.addText(String(n), {
    x: 12.7, y: 7.05, w: 0.5, h: 0.35, fontFace: "Calibri", fontSize: 11,
    color: MUTE, align: "right",
  });
}

function iconCircle(slide, x, y, d, glyph, fill, glyphColor) {
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
  slide.addText(glyph, {
    x, y: y - 0.02, w: d, h: d, align: "center", valign: "middle",
    fontFace: "Calibri", fontSize: d * 27, bold: true, color: glyphColor,
  });
}

const pres = newDeck();

// ============================================================
// SLIDE 1 — TITLE
// ============================================================
{
  const s = pres.addSlide();
  darkBg(s);

  s.addText("UJIAN AKHIR SEMESTER · CLOUD COMPUTING", {
    x: 0.9, y: 1.35, w: 11.5, h: 0.4, fontFace: "Calibri", fontSize: 14,
    bold: true, color: MINT, charSpacing: 2,
  });
  s.addText("Implementasi Aplikasi Multi-Container\ndengan Docker, Orkestrasi, dan CI/CD", {
    x: 0.9, y: 1.85, w: 11.5, h: 1.9, fontFace: "Cambria", fontSize: 40, bold: true,
    color: WHITE, lineSpacingMultiple: 1.08,
  });
  s.addText("Studi kasus: Todo List Application — Laravel + MariaDB, dikemas penuh dalam\nDocker Compose dan diverifikasi otomatis lewat GitHub Actions.", {
    x: 0.9, y: 3.75, w: 10.6, h: 0.9, fontFace: "Calibri", fontSize: 16, italic: true,
    color: "C7D3E8", lineSpacingMultiple: 1.25,
  });

  // divider dots motif (three service nodes: user / app / db)
  const nodes = [
    { label: "Pengguna", glyph: "U" },
    { label: "App + DB", glyph: "C" },
    { label: "CI/CD", glyph: "G" },
  ];
  let nx = 0.9;
  nodes.forEach((n, i) => {
    iconCircle(s, nx, 5.05, 0.55, n.glyph, i === 1 ? MINT : "1C3B6B", i === 1 ? NAVY : WHITE);
    s.addText(n.label, { x: nx - 0.35, y: 5.65, w: 1.25, h: 0.35, align: "center", fontFace: "Calibri", fontSize: 11, color: "C7D3E8" });
    nx += 1.35;
  });

  s.addText("Purna Siswantomo (C2C023160)  •  Erifa Dwi Astuti (C2C023161)  •  Kelas [Kelas Anda]", {
    x: 0.9, y: 6.55, w: 11.5, h: 0.35, fontFace: "Calibri", fontSize: 13, color: WHITE, bold: true,
  });
  s.addText("Komputasi Awan (Cloud Computing) — Tahun Akademik 2025/2026", {
    x: 0.9, y: 6.9, w: 11.5, h: 0.35, fontFace: "Calibri", fontSize: 12, color: "8FA3C4",
  });
}

// ============================================================
// SLIDE 2 — LATAR BELAKANG & TUJUAN
// ============================================================
{
  const s = pres.addSlide();
  lightBg(s);
  kicker(s, "Bab 1 · Pendahuluan");
  title(s, "Dari Masalah Environment Menuju Container yang Konsisten");

  const colW = 5.7;
  const y0 = 1.75;

  // left card: masalah
  s.addShape("roundRect", { x: 0.6, y: y0, w: colW, h: 4.9, rectRadius: 0.12, fill: { color: CARD }, line: { type: "none" } });
  iconCircle(s, 0.95, y0 + 0.4, 0.5, "!", "D64550", WHITE);
  s.addText("Permasalahan", { x: 1.65, y: y0 + 0.42, w: 4, h: 0.5, fontFace: "Calibri", fontSize: 18, bold: true, color: INK });
  const masalah = [
    "Environment berbeda antara mesin developer, tester, dan production",
    "Instalasi dependency manual rawan error dan sulit direproduksi",
    "Data database hilang jika container dihentikan tanpa volume",
    "Tidak ada validasi otomatis sebelum perubahan kode diterapkan",
  ];
  s.addText(masalah.map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 12 } })), {
    x: 0.95, y: y0 + 1.05, w: colW - 0.7, h: 3.6, fontFace: "Calibri", fontSize: 14, color: INK, valign: "top",
  });

  // right card: tujuan/solusi
  const x2 = 0.6 + colW + 0.45;
  s.addShape("roundRect", { x: x2, y: y0, w: colW, h: 4.9, rectRadius: 0.12, fill: { color: NAVY }, line: { type: "none" } });
  iconCircle(s, x2 + 0.35, y0 + 0.4, 0.5, "✓", MINT, NAVY);
  s.addText("Tujuan & Solusi", { x: x2 + 1.05, y: y0 + 0.42, w: 4, h: 0.5, fontFace: "Calibri", fontSize: 18, bold: true, color: WHITE });
  const tujuan = [
    "Arsitektur multi-container: container aplikasi + container database",
    "Persistent volume agar data database tetap aman antar restart",
    "Health check & restart policy untuk ketahanan layanan",
    "Automated testing + GitHub Actions sebagai quality gate CI/CD",
  ];
  s.addText(tujuan.map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 12 } })), {
    x: x2 + 0.35, y: y0 + 1.05, w: colW - 0.7, h: 3.6, fontFace: "Calibri", fontSize: 14, color: "E8EEFB", valign: "top",
  });

  pageNum(s, 2);
}

// ============================================================
// SLIDE 3 — ARSITEKTUR
// ============================================================
{
  const s = pres.addSlide();
  lightBg(s);
  kicker(s, "Bab 2 · Analisis dan Arsitektur");
  title(s, "Arsitektur: Pengguna → Container App → Container Database");

  // diagram is 1000x660 px; keep aspect ratio, fit within remaining slide height (y0=1.85 to ~7.2)
  { const dh = 5.25, dw = dh * (1000 / 660); s.addImage({ path: DIAGRAM, x: (13.333 - dw) / 2, y: 1.85, w: dw, h: dh }); }

  pageNum(s, 3);
}

// ============================================================
// SLIDE 4 — FITUR & TEKNOLOGI
// ============================================================
{
  const s = pres.addSlide();
  lightBg(s);
  kicker(s, "Bab 3 · Implementasi Aplikasi");
  title(s, "Todo List API: CRUD Lengkap di Atas Stack yang Ringan");

  const feats = [
    ["List & Detail", "GET /api/todos, GET /api/todos/{id}"],
    ["Create & Update", "POST / PUT dengan validasi title wajib diisi"],
    ["Delete", "DELETE /api/todos/{id}"],
    ["Health Check", "GET /api/health — cek koneksi database"],
  ];
  const cardW = 2.75, gap = 0.25, x0 = 0.6, y0 = 1.85;
  feats.forEach((f, i) => {
    const x = x0 + i * (cardW + gap);
    s.addShape("roundRect", { x, y: y0, w: cardW, h: 2.05, rectRadius: 0.1, fill: { color: CARD }, line: { type: "none" } });
    iconCircle(s, x + 0.25, y0 + 0.25, 0.45, String(i + 1), BLUE, WHITE);
    s.addText(f[0], { x: x + 0.2, y: y0 + 0.85, w: cardW - 0.4, h: 0.4, fontFace: "Calibri", fontSize: 14, bold: true, color: INK });
    s.addText(f[1], { x: x + 0.2, y: y0 + 1.25, w: cardW - 0.4, h: 0.7, fontFace: "Calibri", fontSize: 10.5, color: MUTE, valign: "top" });
  });

  s.addText("Teknologi", { x: 0.6, y: 4.25, w: 4, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: true, color: INK });
  const stack = ["PHP 8.3", "Laravel 13", "MariaDB 11.4", "Docker", "Docker Compose", "PHPUnit", "GitHub Actions"];
  let sx = 0.6, sy = 4.75;
  stack.forEach((t) => {
    const w = 0.28 + t.length * 0.105;
    if (sx + w > 12.6) { sx = 0.6; sy += 0.62; }
    s.addShape("roundRect", { x: sx, y: sy, w, h: 0.48, rectRadius: 0.24, fill: { color: NAVY2 }, line: { type: "none" } });
    s.addText(t, { x: sx, y: sy, w, h: 0.48, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 12, color: WHITE, bold: true });
    sx += w + 0.2;
  });

  s.addText("Kredensial database diambil dari environment variable (.env), tidak dituliskan langsung di repository.", {
    x: 0.6, y: 6.65, w: 11.8, h: 0.4, fontFace: "Calibri", fontSize: 11.5, italic: true, color: MUTE,
  });

  pageNum(s, 4);
}

// ============================================================
// SLIDE 5 — DOCKER & DOCKER COMPOSE
// ============================================================
{
  const s = pres.addSlide();
  lightBg(s);
  kicker(s, "Bab 4 · Implementasi Container");
  title(s, "Dua Service, Satu Perintah: docker compose up -d");

  const colW = 5.7, y0 = 1.85;

  s.addShape("roundRect", { x: 0.6, y: y0, w: colW, h: 4.85, rectRadius: 0.12, fill: { color: CARD }, line: { type: "none" } });
  s.addText("Dockerfile — image app", { x: 0.95, y: y0 + 0.3, w: colW - 0.7, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: INK });
  const dockerfile = [
    "Base image php:8.3-cli-alpine",
    "Install ekstensi PDO, pdo_mysql, dll.",
    "composer install + php artisan key:generate",
    "EXPOSE 8000, entrypoint tunggu DB lalu migrate",
  ];
  s.addText(dockerfile.map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 10 } })), {
    x: 0.95, y: y0 + 0.85, w: colW - 0.7, h: 3.8, fontFace: "Calibri", fontSize: 13.5, color: INK, valign: "top",
  });

  const x2 = 0.6 + colW + 0.45;
  s.addShape("roundRect", { x: x2, y: y0, w: colW, h: 4.85, rectRadius: 0.12, fill: { color: CARD }, line: { type: "none" } });
  s.addText("docker-compose.yml — app + db", { x: x2 + 0.35, y: y0 + 0.3, w: colW - 0.7, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: INK });
  const compose = [
    "Network todo-network menghubungkan app ↔ db",
    "Volume db_data → persistent storage MariaDB",
    "depends_on: condition service_healthy",
    "healthcheck app (/api/health) & db (SELECT 1)",
    "restart: unless-stopped pada kedua service",
  ];
  s.addText(compose.map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 10 } })), {
    x: x2 + 0.35, y: y0 + 0.85, w: colW - 0.7, h: 3.8, fontFace: "Calibri", fontSize: 13.5, color: INK, valign: "top",
  });

  pageNum(s, 5);
}

// ============================================================
// SLIDE 6 — CI/CD PIPELINE
// ============================================================
{
  const s = pres.addSlide();
  lightBg(s);
  kicker(s, "Bab 5 · Implementasi CI/CD");
  title(s, "GitHub Actions: Quality Gate Sebelum Image Dianggap Layak");

  const steps = ["Checkout", "Install\nDependency", "PHPUnit\nTest", "Docker\nBuild", "Compose Up +\nHealth Check"];
  const n = steps.length, gap = 0.35;
  const boxW = (12.1 - gap * (n - 1)) / n, y0 = 1.95, boxH = 1.0;
  steps.forEach((t, i) => {
    const x = 0.6 + i * (boxW + gap);
    s.addShape("roundRect", { x, y: y0, w: boxW, h: boxH, rectRadius: 0.1, fill: { color: i === n - 1 ? MINT : NAVY2 }, line: { type: "none" } });
    s.addText(t, { x, y: y0, w: boxW, h: boxH, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 13, bold: true, color: i === n - 1 ? NAVY : WHITE });
    if (i < n - 1) {
      s.addText("→", { x: x + boxW, y: y0, w: gap, h: boxH, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 18, bold: true, color: MUTE });
    }
  });

  const y1 = 3.55;
  s.addShape("roundRect", { x: 0.6, y: y1, w: 5.7, h: 2.75, rectRadius: 0.12, fill: { color: "FBEAEA" }, line: { type: "none" } });
  iconCircle(s, 0.95, y1 + 0.35, 0.5, "✕", "D64550", WHITE);
  s.addText("Pipeline Gagal (terkontrol)", { x: 1.65, y: y1 + 0.37, w: 4.3, h: 0.45, fontFace: "Calibri", fontSize: 15, bold: true, color: "8A2A2A" });
  s.addText("Commit “Simulasi pipeline gagal” mengubah test hingga PHPUnit gagal. GitHub Actions menampilkan status merah beserta log error yang jelas.", {
    x: 0.95, y: y1 + 1.0, w: 5.0, h: 1.6, fontFace: "Calibri", fontSize: 12.5, color: INK, valign: "top",
  });

  const x2 = 0.6 + 5.7 + 0.45;
  s.addShape("roundRect", { x: x2, y: y1, w: 5.7, h: 2.75, rectRadius: 0.12, fill: { color: "E7F9F3" }, line: { type: "none" } });
  iconCircle(s, x2 + 0.35, y1 + 0.35, 0.5, "✓", "1F9D6B", WHITE);
  s.addText("Pipeline Berhasil (setelah perbaikan)", { x: x2 + 1.05, y: y1 + 0.37, w: 4.3, h: 0.45, fontFace: "Calibri", fontSize: 15, bold: true, color: "1F6B4D" });
  s.addText("Commit “Memperbaiki test pipeline” mengembalikan test ke kondisi benar. Pipeline berjalan hijau: test, build image, dan compose up seluruhnya lolos.", {
    x: x2 + 0.35, y: y1 + 1.0, w: 5.0, h: 1.6, fontFace: "Calibri", fontSize: 12.5, color: INK, valign: "top",
  });

  pageNum(s, 6);
}

// ============================================================
// SLIDE 7 — PENGUJIAN & KETAHANAN
// ============================================================
{
  const s = pres.addSlide();
  lightBg(s);
  kicker(s, "Bab 6 · Pengujian");
  title(s, "Terverifikasi: Test, Volume, dan Health Check Bekerja Nyata");

  const stats = [
    ["8/8", "Automated test\nlulus (isolated SQLite)"],
    ["100%", "Data bertahan setelah\ndown → up kembali"],
    ["503 → 200", "Health check turun saat\nDB mati, pulih otomatis"],
  ];
  const cw = 3.85, gap = 0.3, x0 = 0.6, y0 = 1.9;
  stats.forEach((st, i) => {
    const x = x0 + i * (cw + gap);
    s.addShape("roundRect", { x, y: y0, w: cw, h: 2.15, rectRadius: 0.12, fill: { color: NAVY }, line: { type: "none" } });
    s.addText(st[0], { x, y: y0 + 0.2, w: cw, h: 0.95, align: "center", fontFace: "Cambria", fontSize: 40, bold: true, color: MINT });
    s.addText(st[1], { x: x + 0.2, y: y0 + 1.2, w: cw - 0.4, h: 0.85, align: "center", fontFace: "Calibri", fontSize: 12.5, color: "E8EEFB", valign: "top" });
  });

  const y1 = 4.4;
  s.addShape("roundRect", { x: 0.6, y: y1, w: 12.1, h: 2.2, rectRadius: 0.12, fill: { color: CARD }, line: { type: "none" } });
  s.addText("Simulasi ketahanan layanan", { x: 0.95, y: y1 + 0.25, w: 8, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: INK });
  const resil = [
    "docker stop todo-db → endpoint /api/health merespons 503 \"unhealthy\" (bukan error tak terkendali)",
    "docker start todo-db → /api/health kembali 200 \"healthy\" tanpa rebuild container atau kehilangan data",
    "docker compose down (tanpa -v) lalu up -d → seluruh data todo yang dibuat sebelumnya tetap ada",
  ];
  s.addText(resil.map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 10 } })), {
    x: 0.95, y: y1 + 0.75, w: 11.4, h: 1.35, fontFace: "Calibri", fontSize: 13, color: INK, valign: "top",
  });

  pageNum(s, 7);
}

// ============================================================
// SLIDE 8 — KESIMPULAN
// ============================================================
{
  const s = pres.addSlide();
  darkBg(s);
  kicker(s, "Bab 7 · Kesimpulan", { color: MINT });
  title(s, "Container, Orkestrasi, dan CI/CD Bekerja sebagai Satu Sistem", { color: WHITE, size: 28 });

  const colW = 5.7, y0 = 1.85;
  s.addText("Kesimpulan", { x: 0.6, y: y0, w: colW, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: true, color: MINT });
  const kesimpulan = [
    "Multi-container (app + db) lebih mudah dikelola daripada satu lingkungan monolitik",
    "Persistent volume terbukti menjaga data tetap ada lintas siklus container",
    "Automated testing + CI/CD berhasil berperan sebagai quality gate nyata",
  ];
  s.addText(kesimpulan.map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 10 } })), {
    x: 0.6, y: y0 + 0.5, w: colW, h: 2.2, fontFace: "Calibri", fontSize: 13, color: "E8EEFB", valign: "top",
  });

  const x2 = 0.6 + colW + 0.45;
  s.addText("Rencana Pengembangan", { x: x2, y: y0, w: colW, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: true, color: MINT });
  const rencana = [
    "Tambah service: Redis, Nginx reverse proxy, atau phpMyAdmin",
    "Publikasi image ke Docker Hub / GitHub Container Registry",
    "Backup database terjadwal dan logging terpusat",
    "Migrasi ke VPS/cloud dengan managed storage & secret manager",
  ];
  s.addText(rencana.map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 10 } })), {
    x: x2, y: y0 + 0.5, w: colW, h: 2.2, fontFace: "Calibri", fontSize: 13, color: "E8EEFB", valign: "top",
  });

  const y1 = 4.55;
  s.addShape("roundRect", { x: 0.6, y: y1, w: 12.1, h: 1.85, rectRadius: 0.12, fill: { color: "13315C" }, line: { type: "none" } });
  s.addText("Tautan Bukti", { x: 0.95, y: y1 + 0.22, w: 6, h: 0.4, fontFace: "Calibri", fontSize: 14, bold: true, color: WHITE });
  const links = [
    "Repository: github.com/Purna-Siswantomo/Todo-docker",
    "Pipeline gagal: .../actions/runs/28741426116",
    "Pipeline berhasil: .../actions/runs/28741450472",
  ];
  s.addText(links.map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 6 } })), {
    x: 0.95, y: y1 + 0.65, w: 11.4, h: 1.1, fontFace: "Calibri", fontSize: 12.5, color: "C7D3E8", valign: "top",
  });

  pageNum(s, 8);
}

const OUT = path.join(path.dirname(__dirname), "C2C023160_PurnaSiswantomo_UAS_Presentasi.pptx");
pres.writeFile({ fileName: OUT }).then(() => console.log("Saved:", OUT));
