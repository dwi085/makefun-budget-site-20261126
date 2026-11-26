// views.js — satu fungsi render per halaman. Semua angka dihitung dari
// data.js, jadi "sisa uang" sama di setiap halaman.

import {
  HOUSEHOLD, INCOME, CATEGORIES, SAVINGS, MONTHS, BILLS, RULE_50_30_20,
  totalIncome, totalSpent, totalSavingsMonthly, moneyLeft, formatRupiah,
} from "./data.js";
import { monthlyBarChart, categoryDonut, progressBar } from "./charts.js";

function summaryCards() {
  const income = totalIncome();
  const spent = totalSpent();
  const saved = totalSavingsMonthly();
  const left = moneyLeft();
  return `<section class="cards" aria-label="Ringkasan bulan ini">
    <article class="card income"><p class="label">Penghasilan</p><p class="big">${formatRupiah(income)}</p><p class="sub">Gaji + usaha sampingan</p></article>
    <article class="card spent"><p class="label">Belanja</p><p class="big">${formatRupiah(spent)}</p><p class="sub">${Math.round((spent / income) * 100)}% dari penghasilan</p></article>
    <article class="card saved"><p class="label">Tabungan</p><p class="big">${formatRupiah(saved)}</p><p class="sub">3 tujuan tabungan</p></article>
    <article class="card left"><p class="label">Sisa uang</p><p class="big">${formatRupiah(left)}</p><p class="sub">Penghasilan − belanja − tabungan</p></article>
  </section>`;
}

function dashboardView() {
  const top = [...CATEGORIES].sort((a, b) => b.amount - a.amount).slice(0, 3);
  const legend = CATEGORIES.map(
    (c) => `<li><span class="dot" style="background:${c.color}"></span>${c.name}<strong>${formatRupiah(c.amount)}</strong></li>`,
  ).join("");
  return `
  <h1>Ringkasan Anggaran — ${HOUSEHOLD.monthLabel}</h1>
  <p class="lede">${HOUSEHOLD.name} — ${HOUSEHOLD.city}, ${HOUSEHOLD.members}, penghasilan ${formatRupiah(totalIncome())}/bulan. ${HOUSEHOLD.note}</p>
  ${summaryCards()}
  <div class="grid2">
    <section class="panel"><h2>Tren 6 bulan terakhir</h2>
      <p class="hint"><span class="swatch" style="background:#2e7d5b"></span> Penghasilan &nbsp; <span class="swatch" style="background:#c98a2b"></span> Belanja</p>
      ${monthlyBarChart(MONTHS)}
      <p class="hint">Belanja tertinggi September 2026 (${formatRupiah(7200000)}) karena biaya masuk sekolah anak. <a href="#/tren">Lihat tren lengkap</a></p>
    </section>
    <section class="panel"><h2>Belanja per kategori</h2>
      ${categoryDonut(CATEGORIES)}
      <ul class="legend">${legend}</ul>
      <p><a href="#/belanja">Lihat tabel belanja yang bisa diurutkan</a></p>
    </section>
  </div>
  <section class="panel"><h2>Tiga pengeluaran terbesar bulan ini</h2>
    <ol class="toplist">${top.map((c) => `<li><strong>${c.name}</strong> — ${formatRupiah(c.amount)} (${Math.round((c.amount / totalSpent()) * 100)}% dari belanja)</li>`).join("")}</ol>
    <p>Makan &amp; dapur selalu yang terbesar. Tips: belanja mingguan di pasar bisa memangkas sekitar Rp 200.000/bulan dari pos ini — coba di <a href="#/kalkulator">kalkulator anggaran</a>.</p>
  </section>`;
}

let sortKey = "amount";
let sortDir = -1;

function spendingView() {
  const income = totalIncome();
  const rows = [...CATEGORIES].sort((a, b) => {
    const av = sortKey === "name" ? a.name : sortKey === "pct" ? a.amount / income : a.amount;
    const bv = sortKey === "name" ? b.name : sortKey === "pct" ? b.amount / income : b.amount;
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return cmp * sortDir;
  });
  const body = rows.map((c) => `<tr><td><span class="dot" style="background:${c.color}"></span>${c.name}</td><td class="num">${formatRupiah(c.amount)}</td><td class="num">${Math.round((c.amount / income) * 100)}%</td><td>${c.need ? "Kebutuhan" : "Keinginan"}</td></tr>`).join("");
  const arrow = (k) => (sortKey === k ? (sortDir === 1 ? " ▲" : " ▼") : "");
  return `
  <h1>Belanja per Kategori</h1>
  <p class="lede">Total belanja ${formatRupiah(totalSpent())} dari penghasilan ${formatRupiah(income)}. Klik judul kolom untuk mengurutkan tabel.</p>
  <section class="panel"><table class="data" id="spending-table">
    <thead><tr>
      <th><button class="sort" data-sort="name">Kategori${arrow("name")}</button></th>
      <th><button class="sort" data-sort="amount">Jumlah / bulan${arrow("amount")}</button></th>
      <th><button class="sort" data-sort="pct">% dari penghasilan${arrow("pct")}</button></th>
      <th>Jenis</th>
    </tr></thead>
    <tbody>${body}</tbody>
    <tfoot><tr><td><strong>Total</strong></td><td class="num"><strong>${formatRupiah(totalSpent())}</strong></td><td class="num"><strong>${Math.round((totalSpent() / income) * 100)}%</strong></td><td></td></tr></tfoot>
  </table></section>
  <p class="hint">Kebutuhan (makan, rumah, transport, pendidikan, kesehatan) = ${formatRupiah(CATEGORIES.filter((c) => c.need).reduce((s, c) => s + c.amount, 0))} atau ${Math.round((CATEGORIES.filter((c) => c.need).reduce((s, c) => s + c.amount, 0) / income) * 100)}% dari penghasilan — masih dalam patokan 50% aturan 50/30/20.</p>`;
}

function billsView() {
  const total = BILLS.reduce((s, b) => s + b.amount, 0);
  const rows = BILLS.map(
    (b) => `<tr><td>${b.name}${b.note ? ` <span class="hint">(${b.note})</span>` : ""}</td><td class="num">${formatRupiah(b.amount)}</td><td>${b.due}</td><td>${b.category}</td><td><span class="badge ok">${b.status}</span></td></tr>`,
  ).join("");
  return `
  <h1>Tagihan &amp; Cicilan</h1>
  <p class="lede">Total tagihan bulan ini ${formatRupiah(total)}. Semua tagihan November 2026 sudah lunas. Jumlah di bawah <strong>sudah termasuk</strong> dalam kategori belanja — bukan tambahan.</p>
  <section class="panel"><table class="data">
    <thead><tr><th>Tagihan</th><th>Jumlah</th><th>Jatuh tempo</th><th>Kategori</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr><td><strong>Total</strong></td><td class="num"><strong>${formatRupiah(total)}</strong></td><td></td><td></td><td></td></tr></tfoot>
  </table></section>
  <section class="panel"><h2>Jadwal bayar</h2><p>Bayar paling awal: internet (tgl 1), cicilan motor (tgl 5), SPP anak (tgl 7), BPJS (tgl 10), air (tgl 15), listrik (tgl 20). Tips: pasang pengingat 2 hari sebelum jatuh tempo supaya tidak kena denda.</p></section>`;
}

function savingsView() {
  const cards = SAVINGS.map((g) => {
    const frac = g.saved / g.target;
    const monthsLeft = Math.ceil((g.target - g.saved) / g.monthly);
    return `<article class="panel goal"><h2>${g.name}</h2>
      <p class="big">${formatRupiah(g.saved)} <span class="hint">dari ${formatRupiah(g.target)}</span></p>
      ${progressBar(frac, "#2e7d5b")}
      <p>${Math.round(frac * 100)}% tercapai — ${g.note}. Setoran ${formatRupiah(g.monthly)}/bulan, lunas sekitar ${monthsLeft} bulan lagi.</p></article>`;
  }).join("");
  return `
  <h1>Tabungan &amp; Tujuan</h1>
  <p class="lede">Total setoran tabungan ${formatRupiah(totalSavingsMonthly())}/bulan. Dana darurat dipatok 3x belanja bulanan (${formatRupiah(totalSpent() * 3)}) — patokan umum perencana keuangan, bukan aturan resmi.</p>
  <div class="grid2">${cards}</div>
  <p class="hint">Sisa uang bulan ini ${formatRupiah(moneyLeft())} mengendap di rekening — bisa ditambahkan ke dana darurat supaya lunas lebih cepat.</p>`;
}

function calculatorView() {
  const needs = CATEGORIES.filter((c) => c.need).reduce((s, c) => s + c.amount, 0);
  const wants = CATEGORIES.filter((c) => !c.need).reduce((s, c) => s + c.amount, 0);
  const inputs = CATEGORIES.map(
    (c) => `<label class="calc-row"><span>${c.name}</span><input type="number" min="0" step="50000" value="${c.amount}" data-cat="${c.id}" inputmode="numeric"> </label>`,
  ).join("");
  return `
  <h1>Kalkulator Anggaran</h1>
  <p class="lede">Ubah angka di bawah — hasilnya langsung berubah. Mulai dari angka contoh keluarga, lalu sesuaikan dengan keluargamu sendiri.</p>
  <div class="grid2">
    <section class="panel"><h2>Penghasilan &amp; belanja</h2>
      <label class="calc-row"><span>Penghasilan / bulan</span><input type="number" min="0" step="100000" value="${totalIncome()}" id="calc-income" inputmode="numeric"></label>
      ${inputs}
      <p><button id="calc-reset" type="button">Kembalikan angka contoh</button></p>
    </section>
    <section class="panel"><h2>Hasil</h2>
      <dl class="result">
        <div><dt>Total belanja</dt><dd id="calc-spent">${formatRupiah(totalSpent())}</dd></div>
        <div><dt>Tabungan (${formatRupiah(totalSavingsMonthly())}/bln)</dt><dd id="calc-saved">${formatRupiah(totalSavingsMonthly())}</dd></div>
        <div><dt>Sisa uang</dt><dd id="calc-left" class="big">${formatRupiah(moneyLeft())}</dd></div>
      </dl>
      <p id="calc-verdict">Sisa uang positif — anggaran bulan ini aman.</p>
      <h3>Aturan 50/30/20</h3>
      <p>Patokan umum: kebutuhan ${Math.round(RULE_50_30_20.needs * 100)}%, keinginan ${Math.round(RULE_50_30_20.wants * 100)}%, tabungan ${Math.round(RULE_50_30_20.savings * 100)}% dari penghasilan. Keluarga contoh: kebutuhan ${formatRupiah(needs)} (${Math.round((needs / totalIncome()) * 100)}%), keinginan ${formatRupiah(wants)} (${Math.round((wants / totalIncome()) * 100)}%), tabungan ${formatRupiah(totalSavingsMonthly())} (${Math.round((totalSavingsMonthly() / totalIncome()) * 100)}%).</p>
    </section>
  </div>`;
}

function trendView() {
  const rows = MONTHS.map((m) => {
    const left = m.income - m.spent;
    return `<tr><td>${m.month}</td><td class="num">${formatRupiah(m.income)}</td><td class="num">${formatRupiah(m.spent)}</td><td class="num">${formatRupiah(left)}</td></tr>`;
  }).join("");
  const best = MONTHS.reduce((a, b) => (a.income - a.spent > b.income - b.spent ? a : b));
  return `
  <h1>Tren Bulanan</h1>
  <p class="lede">Enam bulan terakhir: penghasilan stabil ${formatRupiah(8500000)}/bulan, belanja naik-turun antara ${formatRupiah(6700000)} dan ${formatRupiah(7200000)}.</p>
  <section class="panel"><h2>Penghasilan vs belanja</h2>
    <p class="hint"><span class="swatch" style="background:#2e7d5b"></span> Penghasilan &nbsp; <span class="swatch" style="background:#c98a2b"></span> Belanja</p>
    ${monthlyBarChart(MONTHS, 680, 280)}
  </section>
  <section class="panel"><table class="data">
    <thead><tr><th>Bulan</th><th>Penghasilan</th><th>Belanja</th><th>Sisa</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></section>
  <p>Bulan paling hemat: ${best.month} (sisa ${formatRupiah(best.income - best.spent)}). Bulan paling boros: September 2026 — biaya masuk sekolah anak. <a href="#/">Kembali ke ringkasan</a></p>`;
}

export const VIEWS = {
  "/": dashboardView,
  "/belanja": spendingView,
  "/tagihan": billsView,
  "/tabungan": savingsView,
  "/kalkulator": calculatorView,
  "/tren": trendView,
};

export function setSort(key) {
  if (sortKey === key) sortDir = -sortDir;
  else { sortKey = key; sortDir = key === "name" ? 1 : -1; }
}
