// DompetKeluarga — entry program/v1 (Node 22, standard library only).
// Menyalin app/ dan screenshots/ dari samping file ini ke /output
// (atau ke MAKEFUN_OUTPUT_DIR di luar grader) lalu menulis
// /output/dossier.json dengan library make.fun yang divendor.
// Tidak ada network, tidak ada timestamp, tidak ada angka acak:
// dua run menulis byte yang sama persis.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Mulai dari output kosong supaya run kedua tidak mewarisi file lama.
// Hapus ISI output saja, bukan direktorinya: grader memberi /output
// yang sudah ada dan menghapusnya sendiri akan gagal (EPERM).
mkdirSync(out, { recursive: true });
for (const entry of readdirSync(out)) {
  rmSync(join(out, entry), { recursive: true, force: true });
}
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Batas yang sama dengan yang dipakai scorer (lihat RULES.txt):
// teks dossier maks 160 KiB, maks 4 screenshot @ 256 KiB, app maks
// 993 file/direktori dan 16 MiB. buildDossier menolak entry yang
// melewati batas ini, persis seperti gate.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
