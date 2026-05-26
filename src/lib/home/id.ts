import type { HomeDict } from "./types";

/**
 * Bahasa Indonesia (id) — translated from en.ts.
 *
 * Brand and protocol terms (Franklin, BlockRun, USDC, Base, Solana, x402,
 * YOPO, kimi-k2.6, model names, etc.) stay verbatim. Code snippets and
 * slash commands are universal.
 */
export const id: HomeDict = {
  nav: {
    features: "Fitur",
    compare: "Bandingkan",
    blog: "Blog",
    docs: "Docs",
    tryFranklin: "Coba Franklin",
    github: "GitHub",
    getStarted: "Mulai",
  },

  hero: {
    eyebrow: "Agent Ekonomi Otonom",
    titleLine1: "AI agent",
    titleLine2Pre: "dengan",
    titleLine2Em: "dompet",
    titleLine2Post: ".",
    subPre: "Agent lain menulis kode. Franklin menulis kode",
    subEm: "dan membelanjakan uang",
    subPost:
      "untuk menyelesaikannya — model, data, gambar, search. Kamu set anggaran. Dia jalankan.",
    ctaPrimary: "Mulai Gratis",
    ctaSecondary: "Star di GitHub",
    copyInstallAriaLabel: "Salin perintah install",
    pillYopoSuffix: "You Only Pay Outcome",
    pillUsdcBefore: "USDC di",
    pillX402Before: "Native",
    termAbort: "esc untuk batal",
  },

  features: {
    eyebrow: "Empat Bab",
    titleTop: "Apa yang dompet",
    titleEm: "ubah",
    introPre: "Kecerdasan koding sudah jadi standar. Bedanya ada di",
    introEm: "daya beli",
    introPost:
      "— dan disiplin diam yang muncul saat agent harus menyeimbangkan bukunya sendiri.",
    cards: [
      {
        label: "Dompet",
        title: "Software yang bisa belanja.",
        desc: "Franklin memegang USDC di Base atau Solana. Saat butuh model, data feed, atau gambar — dia tanda tangani pembayaran dan ambil. Non-custodial. Kunci tetap di mesinmu. Kamu set batas; dia patuhi.",
      },
      {
        label: "Trading",
        title: "Beli data. Baca tape. Putuskan.",
        desc: "Tanya “BTC bagaimana?” dan Franklin beli harga live, hitung RSI, MACD, Bollinger, dan volatilitas secara lokal, lalu kembalikan sinyal. Satu prompt. Tanpa lima tab browser, tanpa API key kacau.",
      },
      {
        label: "Smart Router",
        title: "55+ model. Dia pilih. Kamu hemat.",
        desc: "Tidak ada satu model yang terbaik untuk semua hal. Router mengklasifikasi setiap request dan rute dalam kurang dari satu milidetik. Dilatih dari 2 juta+ request asli, di-skor terus dengan Elo, beradaptasi dengan override-mu. Hemat hingga 89% vs selalu pakai Opus.",
      },
      {
        label: "Mengenali Kamu",
        title: "Makin pintar tiap sesi.",
        desc: "Claude Code lupa antar sesi. Franklin mengekstrak preferensi — bahasa, gaya, pilihan model, alur kerja — dan menyuntiknya ke sesi berikutnya. Pola yang dikonfirmasi naik confidence. Pola usang luruh dalam 30 hari.",
      },
    ],
  },

  getStarted: {
    eyebrow: "Harga · Install · Isi Saldo",
    titlePre: "Bayar untuk",
    titleEm: "hasil",
    titleAfterEm: ",",
    titlePost: "tidak ada lainnya.",
    yopoLabel: "You Only Pay Outcome · YOPO",
    yopoTitle: "Biaya provider + 5%, ditandatangani per aksi.",
    yopoBody:
      "Tanpa langganan (kamu tidak bayar untuk akses). Tanpa pay-per-call (kamu tidak bayar untuk percobaan gagal). Saldo dompet adalah batas keras. Saat habis, Franklin berhenti. Itu seluruh model harganya.",
    steps: [
      {
        title: "Install",
        body: "Satu perintah npm. Node 20+. macOS, Linux, WSL.",
      },
      {
        title: "Jalan gratis",
        body: "NVIDIA Nemotron & DeepSeek V4 Flash gratis langsung pakai. Tanpa dompet.",
      },
      {
        title: "Isi saldo ($5 sudah cukup)",
        body: "Generate dompet Base atau Solana. Kirim USDC. Buka semua model frontier.",
      },
      {
        title: "Sebutkan hasilnya",
        body: "Kode, trading, riset, generate — Franklin pilih, bayar, lapor, berhenti.",
      },
    ],
    ctaInstall: "Install dari npm",
    ctaGitHub: "Lihat di GitHub",
    slashEyebrow: "Slash Command · 18 bawaan",
    slashDescs: [
      "Picker interaktif atau ganti langsung",
      "Perencanaan read-only, lalu jalankan",
      "Penalaran dalam untuk masalah berat",
      "Kompresi konteks terstruktur",
      "Cari di codebase",
      "Full-text di seluruh sesi lampau",
      "Inspeksi atau pulihkan sesi mana pun",
      "Helper alur kerja Git",
      "Review, perbaiki bug, tes — sekali jalan",
      "Pengeluaran sesi + alamat + saldo",
      "Rincian pengeluaran dan tren",
      "Apa yang sudah Franklin pelajari",
    ],
  },

  compare: {
    eyebrow: "Buku Besar",
    titleTop: "Dalam tabel,",
    titleBottom: "biar jelas.",
    intro:
      "Produk AI menjual akses. Langganan menyodorkan rasa bersalah bulanan dan rate limit. Pay-per-call menagihmu untuk setiap percobaan gagal. Franklin menyelesaikan untuk hasil — sekali, dalam USDC.",
    headers: {
      saas: "Subscription SaaS",
      ppc: "API Pay-per-call",
      franklin: "Franklin — YOPO",
    },
    rows: [
      {
        label: "Yang kamu bayar",
        saas: "Akses, dipakai atau tidak",
        ppc: "Setiap percobaan, termasuk yang buntu",
        franklin: "Hasilnya. Sekali.",
      },
      {
        label: "Biaya bulanan",
        saas: "$20 — $200",
        ppc: "$0, plus pemakaian",
        franklin: "$0. Bayar hanya yang kamu pakai.",
      },
      {
        label: "Rate limit",
        saas: "Ya. Mengetat saat paling kamu butuhkan.",
        ppc: "Kuota per-key, tier",
        franklin: "Tidak ada. Saldo dompet satu-satunya batas.",
      },
      {
        label: "Identitas",
        saas: "Email + kartu kredit",
        ppc: "Akun vendor, API key per model",
        franklin: "Sebuah dompet. Tanpa email, tanpa KYC.",
      },
      {
        label: "Pilihan model",
        saas: "Satu vendor",
        ppc: "Kamu juggling 12 key",
        franklin: "55+ model lewat satu dompet · router yang putuskan.",
      },
      {
        label: "Provider down",
        saas: "Kamu berhenti.",
        ppc: "Kamu berhenti.",
        franklin: "Beralih ke provider berikutnya.",
      },
      {
        label: "Risiko overdraft",
        saas: "Auto-renew diam-diam",
        ppc: "Tagihan tanpa batas akhir bulan",
        franklin: "Tidak ada. Dompet kosong ⇒ Franklin berhenti.",
      },
      {
        label: "Source",
        saas: "Tertutup",
        ppc: "SDK tertutup",
        franklin: "Apache 2.0 · local-first.",
      },
    ],
  },

  openSource: {
    eyebrow: "The Commons · Apache 2.0",
    titleTop: "Kamu memiliki",
    titleEm: "semuanya",
    labels: [
      { k: "Datamu", v: "~/.blockrun/" },
      { k: "Dompetmu", v: "Private key · lokal" },
      { k: "Modelmu", v: "55+ · ganti dengan 1 cmd" },
      { k: "Lisensimu", v: "Apache 2.0" },
      { k: "Uptime-mu", v: "Fork. Self-host." },
    ],
    paragraphs: [
      "Dengan tool AI tertutup, vendor memiliki data pemakaianmu, preferensimu, riwayatmu. Mereka ubah syarat — kamu terima. Mereka naikkan harga — kamu bayar. Mereka down — kamu berhenti.",
      "Franklin adalah Apache 2.0 dan jalan di mesinmu. Kunci dompet, riwayat sesi, learnings — semua duduk di ~/.blockrun/. Nol telemetri. Tidak ada yang dikirim pulang.",
      "Kalau BlockRun lenyap besok, USDC-mu tetap di dompetmu dan agent-mu tetap jalan. Itu intinya.",
    ],
    smallParagraph:
      "Baca tiap baris: seluruh agent loop, 16 tool bawaan, plugin SDK, klien x402, router — semuanya di repo. Audit, fork, kirim vertical-mu sendiri.",
  },

  blog: {
    eyebrow: "Catatan",
    titleTop: "Dari",
    titleEm: "meja kerja",
    intro:
      "Catatan tentang agent koding multi-model, AI native-dompet, dan model frontier untuk developer tanpa kartu kredit global.",
    allPosts: "Semua tulisan →",
  },

  faq: {
    eyebrow: "Pertanyaan",
    titleTop: "Pertanyaan,",
    titleEm: "dijawab",
    intro:
      "Model agent ekonomi otonom, dijelaskan polos. Tanpa basa-basi.",
    items: [
      {
        q: "Apa bedanya ini dengan Claude Code atau Cursor?",
        a: "Mereka menulis kode dengan baik. Mereka tidak bisa belanja. Mereka tidak bisa beli data trading, beli API call, bayar generasi gambar, atau menyelesaikan tagihan web search. Franklin bisa — karena memegang dompet USDC dan membayar per aksi via x402. Kecerdasan koding adalah standar; otonomi ekonomi adalah kategorinya.",
      },
      {
        q: "Apa arti sebenarnya “agent dengan dompet”?",
        a: "Franklin memegang USDC di Base atau Solana. Saat butuh model, data feed, atau service, dia tanda tangani micropayment EIP-712 lalu bayar. Kamu set anggaran; Franklin patuhi. Setiap sen dilacak real-time. Tanpa langganan, tanpa API key, tanpa portal billing.",
      },
      {
        q: "Franklin bisa belanja apa saja?",
        a: "55+ model AI (Claude, GPT, Gemini, Grok, DeepSeek, Kimi, dll.), generasi gambar (DALL·E, Nano Banana, Grok Imagine), generasi video, Exa neural web search, data prediction-market (Polymarket, Kalshi), intelijen X/Twitter, generasi musik. Smart Router pilih model terbaik per tugas — hemat hingga 89% vs selalu pakai Opus.",
      },
      {
        q: "Berapa biayanya?",
        a: "YOPO — You Only Pay Outcome. Biaya provider + 5%, diselesaikan per call dalam USDC. Pertanyaan sederhana: ~$0.001. Sesi koding: $0.02–$0.10. Sesi mendalam 30 menit: $0.10–$0.50. Tanpa langganan, tanpa biaya bulanan, tanpa rate limit. Model NVIDIA gratis selalu tersedia tanpa biaya — tanpa dompet.",
      },
      {
        q: "Apa benar dia belajar cara kerjamu?",
        a: "Ya. Setelah tiap sesi, Franklin mengekstrak preferensi — bahasa, gaya, pilihan model, alur kerja — dan menyuntiknya ke run berikutnya. Preferensi yang dikonfirmasi naik confidence. Yang usang luruh dalam 30 hari. Jalankan /learnings untuk lihat apa yang dia tahu.",
      },
      {
        q: "Apakah dataku privat?",
        a: "Semua tetap lokal di ~/.blockrun/. Riwayat sesi, learnings, kunci dompet — tidak ada yang dikirim pulang. Nol telemetri, nol crash reporting. Private key tidak pernah meninggalkan mesinmu. Kodenya Apache 2.0 — audit tiap baris.",
      },
      {
        q: "Bisa pakai gratis?",
        a: "Bisa. Model NVIDIA gratis (Nemotron, DeepSeek V4 Flash) jalan tanpa dompet, tanpa USDC, tanpa daftar. Isi dompet hanya saat ingin Sonnet, Opus, GPT, Gemini, Grok, atau tool berbayar.",
      },
      {
        q: "Kenapa Base dan Solana?",
        a: "Finalitas cepat, biaya nyaris nol, dukungan USDC matang, dan ekosistem x402 nyata di keduanya. Pilih saat setup dan bisa ganti kapan saja. UX dompet sama, model sama, rel berbeda.",
      },
    ],
  },

  footer: {
    tagline:
      "AI agent dengan dompet. Memegang USDC-mu dan membelanjakannya untuk hasil. Apache 2.0.",
    aboutPre: "Sebuah produk",
    aboutLink: "BlockRun.ai",
    aboutPost: ". Ditenagai protokol micropayment x402.",
    ctaGetStarted: "Mulai",
    colProduct: "Produk",
    colResources: "Sumber Daya",
    colCommunity: "Komunitas",
    linkFeatures: "Fitur",
    linkCompare: "Bandingkan",
    linkGetStarted: "Mulai",
    linkNpm: "npm",
    linkDocs: "Dokumentasi",
    linkBlog: "Blog",
    linkGateway: "BlockRun Gateway",
    linkX402: "Protokol x402",
    linkGitHub: "GitHub",
    linkX: "X / Twitter",
    linkTelegram: "Telegram",
    copyright: "© 2026 BlockRun.ai. Hak cipta dilindungi.",
    bottomRight: "Agent ekonomi otonom oleh BlockRun.ai",
  },

  localeSwitcherLabel: "Baca dalam:",

  meta: {
    title: "Franklin — AI Agent dengan Dompet",
    description:
      "AI agent dengan dompet. Memegang USDC-mu dan membelanjakannya untukmu — 55+ model, data trading, generasi gambar, generasi video, web search. Satu dompet, tanpa API key. Open source.",
    ogTitle: "Franklin — AI Agent dengan Dompet",
    ogDescription:
      "Agent lain menulis kode. Franklin menulis kode dan membelanjakan uang untuk menyelesaikannya. 55+ model, data trading, generasi gambar, web search — satu dompet USDC. Open source.",
    twitterTitle: "Franklin — AI Agent dengan Dompet",
    twitterDescription:
      "AI agent dengan dompet. 55+ model, data trading, generasi gambar — memegang USDC-mu dan membelanjakannya untukmu. Open source.",
  },
};
