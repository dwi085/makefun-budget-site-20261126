// main.js — router hash dan pengkabelan kontrol interaktif.
// Satu pekerjaan: membaca hash, merender halaman, menghidupkan kontrolnya.

import { VIEWS, setSort } from "./views.js";
import { CATEGORIES, totalSavingsMonthly, formatRupiah } from "./data.js";

const NAV = [
  ["/", "Ringkasan"],
  ["/belanja", "Belanja"],
  ["/tagihan", "Tagihan"],
  ["/tabungan", "Tabungan"],
  ["/kalkulator", "Kalkulator"],
  ["/tren", "Tren"],
];

function navHtml(active) {
  return NAV.map(
    ([path, label]) => `<a href="#${path}"${path === active ? ' aria-current="page"' : ""}>${label}</a>`,
  ).join("");
}

function readNumber(input, fallback) {
  const value = Number(input.value);
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : fallback;
}

function wireCalculator() {
  const incomeInput = document.getElementById("calc-income");
  const reset = document.getElementById("calc-reset");
  if (!incomeInput) return;
  const catInputs = [...document.querySelectorAll("[data-cat]")];
  const spentEl = document.getElementById("calc-spent");
  const leftEl = document.getElementById("calc-left");
  const verdictEl = document.getElementById("calc-verdict");

  function recalc() {
    const income = readNumber(incomeInput, 8500000);
    const spent = catInputs.reduce((sum, input) => {
      const cat = CATEGORIES.find((c) => c.id === input.dataset.cat);
      return sum + readNumber(input, cat ? cat.amount : 0);
    }, 0);
    const saved = totalSavingsMonthly();
    const left = income - spent - saved;
    spentEl.textContent = formatRupiah(spent);
    leftEl.textContent = formatRupiah(left);
    if (left < 0) {
      verdictEl.textContent = `Belanja melebihi penghasilan sebesar ${formatRupiah(-left)} — kurangi salah satu pos di atas.`;
      verdictEl.className = "warn";
    } else if (left === 0) {
      verdictEl.textContent = "Pas — tidak ada sisa. Sisihkan sedikit untuk jaga-jaga.";
      verdictEl.className = "warn";
    } else {
      verdictEl.textContent = "Sisa uang positif — anggaran bulan ini aman.";
      verdictEl.className = "ok-text";
    }
  }

  incomeInput.addEventListener("input", recalc);
  catInputs.forEach((input) => input.addEventListener("input", recalc));
  reset.addEventListener("click", () => {
    incomeInput.value = "8500000";
    catInputs.forEach((input) => {
      const cat = CATEGORIES.find((c) => c.id === input.dataset.cat);
      if (cat) input.value = String(cat.amount);
    });
    recalc();
  });
}

function wireSorting() {
  document.querySelectorAll("button.sort").forEach((button) => {
    button.addEventListener("click", () => {
      setSort(button.dataset.sort);
      render();
    });
  });
}

function render() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1).split("?")[0] || "/";
  const view = VIEWS[path] || VIEWS["/"];
  const main = document.getElementById("view");
  main.innerHTML = view();
  document.querySelectorAll("nav a").forEach((a) => {
    const target = a.getAttribute("href").slice(1) || "/";
    if (target === path) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  wireSorting();
  wireCalculator();
  window.scrollTo(0, 0);
}

document.getElementById("nav").innerHTML = navHtml("/");
window.addEventListener("hashchange", render);
render();
