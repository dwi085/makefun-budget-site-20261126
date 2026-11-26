// DompetKeluarga — data contoh untuk satu keluarga di Jakarta.
// Semua angka di sini adalah CONTOH yang diberi label jelas di situs,
// bukan data resmi. Satu sumber kebenaran: semua halaman menghitung
// dari angka-angka di bawah ini, jadi ringkasan "sisa uang" konsisten.

export const HOUSEHOLD = {
  name: "Keluarga Contoh",
  city: "Jakarta",
  members: "2 dewasa + 2 anak",
  monthLabel: "November 2026",
  note: "Semua angka di situs ini adalah contoh untuk satu keluarga di Jakarta. Bukan data resmi dan bukan data pengguna nyata.",
};

export const INCOME = [
  { source: "Gaji pokok (ayah)", amount: 7000000 },
  { source: "Usaha sampingan (ibu)", amount: 1500000 },
];

export const CATEGORIES = [
  { id: "makan", name: "Makan & dapur", amount: 2200000, color: "#2e7d5b", need: true },
  { id: "rumah", name: "Tempat tinggal", amount: 1800000, color: "#3a6ea5", need: true },
  { id: "transport", name: "Transport", amount: 900000, color: "#c98a2b", need: true },
  { id: "pendidikan", name: "Pendidikan anak", amount: 800000, color: "#7a5fa8", need: true },
  { id: "kesehatan", name: "Kesehatan", amount: 350000, color: "#b0483e", need: true },
  { id: "hiburan", name: "Hiburan & langganan", amount: 300000, color: "#4a9e8f", need: false },
  { id: "pakaian", name: "Pakaian & keperluan rumah", amount: 400000, color: "#8a6d3b", need: false },
  { id: "lain", name: "Lain-lain", amount: 200000, color: "#6b7280", need: false },
];

export const SAVINGS = [
  { id: "darurat", name: "Dana darurat", target: 25500000, saved: 12750000, monthly: 800000, note: "Target = 3x belanja bulanan" },
  { id: "liburan", name: "Liburan keluarga", target: 6000000, saved: 4200000, monthly: 350000, note: "Liburan akhir tahun ke Yogyakarta" },
  { id: "pendidikan", name: "Dana pendidikan", target: 10000000, saved: 3400000, monthly: 200000, note: "Tabungan masuk sekolah anak" },
];

// Tren 6 bulan: penghasilan tetap, belanja berubah. "Sisa" = penghasilan -
// belanja; dari sisa itu Rp 1.350.000 masuk tabungan dan Rp 200.000 mengendap.
export const MONTHS = [
  { month: "Jun 2026", income: 8500000, spent: 6700000 },
  { month: "Jul 2026", income: 8500000, spent: 7050000 },
  { month: "Agu 2026", income: 8500000, spent: 6800000 },
  { month: "Sep 2026", income: 8500000, spent: 7200000 },
  { month: "Okt 2026", income: 8500000, spent: 6950000 },
  { month: "Nov 2026", income: 8500000, spent: 6950000 },
];

// Tagihan & cicilan bulan ini. Jumlah di bawah SUDAH termasuk dalam
// kategori belanja di atas (bukan tambahan): listrik+air di "Tempat
// tinggal", cicilan motor di "Transport", SPP di "Pendidikan anak",
// BPJS di "Kesehatan". Ditampilkan terpisah supaya jatuh temponya jelas.
export const BILLS = [
  { name: "Listrik PLN", amount: 450000, due: "20 Nov", status: "Lunas", category: "Tempat tinggal" },
  { name: "Air PAM", amount: 180000, due: "15 Nov", status: "Lunas", category: "Tempat tinggal" },
  { name: "Internet rumah", amount: 350000, due: "1 Nov", status: "Lunas", category: "Tempat tinggal" },
  { name: "BPJS Kesehatan", amount: 280000, due: "10 Nov", status: "Lunas", category: "Kesehatan" },
  { name: "Cicilan motor", amount: 750000, due: "5 Nov", status: "Lunas", category: "Transport", note: "Sisa 8x cicilan" },
  { name: "SPP anak", amount: 600000, due: "7 Nov", status: "Lunas", category: "Pendidikan anak" },
];

export const RULE_50_30_20 = { needs: 0.5, wants: 0.3, savings: 0.2 };

export function totalIncome() {
  return INCOME.reduce((sum, item) => sum + item.amount, 0);
}

export function totalSpent() {
  return CATEGORIES.reduce((sum, item) => sum + item.amount, 0);
}

export function totalSavingsMonthly() {
  return SAVINGS.reduce((sum, item) => sum + item.monthly, 0);
}

// Sisa uang = penghasilan - belanja - tabungan bulanan.
export function moneyLeft() {
  return totalIncome() - totalSpent() - totalSavingsMonthly();
}

export function formatRupiah(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}
