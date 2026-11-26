// charts.js — grafik SVG yang digambar dari data, tanpa library luar.
// Satu pekerjaan per fungsi: bar chart tren bulanan dan donat kategori.

import { formatRupiah } from "./data.js";

function niceMax(value) {
  const step = 1000000;
  return Math.ceil(value / step) * step;
}

// Grafik batang: penghasilan vs belanja per bulan, dengan label angka.
export function monthlyBarChart(months, width = 640, height = 260) {
  const padLeft = 64;
  const padBottom = 30;
  const padTop = 18;
  const plotW = width - padLeft - 16;
  const plotH = height - padTop - padBottom;
  const max = niceMax(Math.max(...months.map((m) => Math.max(m.income, m.spent))));
  const groupW = plotW / months.length;
  const barW = Math.min(26, (groupW - 18) / 2);
  const y = (v) => padTop + plotH - (v / max) * plotH;

  let bars = "";
  months.forEach((m, i) => {
    const cx = padLeft + i * groupW + groupW / 2;
    bars += `<rect x="${cx - barW - 3}" y="${y(m.income)}" width="${barW}" height="${padTop + plotH - y(m.income)}" rx="3" fill="#2e7d5b"><title>Penghasilan ${m.month}: ${formatRupiah(m.income)}</title></rect>`;
    bars += `<rect x="${cx + 3}" y="${y(m.spent)}" width="${barW}" height="${padTop + plotH - y(m.spent)}" rx="3" fill="#c98a2b"><title>Belanja ${m.month}: ${formatRupiah(m.spent)}</title></rect>`;
    bars += `<text x="${cx}" y="${height - 10}" text-anchor="middle" font-size="12" fill="#475569">${m.month}</text>`;
    bars += `<text x="${cx}" y="${y(Math.max(m.income, m.spent)) - 6}" text-anchor="middle" font-size="11" fill="#92400e">${(m.spent / 1000000).toFixed(2).replace(".", ",")} jt</text>`;
  });

  let grid = "";
  for (let v = 0; v <= max; v += 2000000) {
    grid += `<line x1="${padLeft}" y1="${y(v)}" x2="${width - 16}" y2="${y(v)}" stroke="#e2e8f0" stroke-width="1" />`;
    grid += `<text x="${padLeft - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#64748b">${(v / 1000000).toFixed(0)} jt</text>`;
  }

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafik batang penghasilan dan belanja enam bulan terakhir" xmlns="http://www.w3.org/2000/svg">${grid}${bars}</svg>`;
}

// Grafik donat: pembagian belanja per kategori, dengan legenda di bawah.
export function categoryDonut(categories, size = 240) {
  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 34;
  let offset = 0;
  let slices = "";

  for (const c of categories) {
    const frac = c.amount / total;
    const a0 = offset * Math.PI * 2 - Math.PI / 2;
    const a1 = (offset + frac) * Math.PI * 2 - Math.PI / 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    slices += `<path d="M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi0} ${yi0} Z" fill="${c.color}"><title>${c.name}: ${formatRupiah(c.amount)}</title></path>`;
    offset += frac;
  }

  const pct = Math.round((total / 8500000) * 100);
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Grafik donat belanja per kategori" xmlns="http://www.w3.org/2000/svg">${slices}<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="19" font-weight="700" fill="#1e293b">${formatRupiah(total)}</text><text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="12" fill="#64748b">belanja / bulan</text><text x="${cx}" y="${cy + 30}" text-anchor="middle" font-size="11" fill="#64748b">${pct}% dari penghasilan</text></svg>`;
}

// Batang progres sederhana untuk tujuan tabungan.
export function progressBar(frac, color) {
  const pct = Math.min(100, Math.round(frac * 100));
  return `<div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%;background:${color}"></span></div>`;
}
