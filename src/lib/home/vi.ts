import type { HomeDict } from "./types";

export const vi: HomeDict = {
  nav: {
    features: "Tính năng",
    compare: "So sánh",
    blog: "Blog",
    gallery: "Thư viện",
    docs: "Tài liệu",
    tryFranklin: "Dùng thử Franklin",
    downloadDesktop: "Tải bản Desktop",
    github: "GitHub",
    getStarted: "Bắt đầu",
  },

  hero: {
    eyebrow: "Tác nhân kinh tế tự trị",
    titleLine1: "AI agent",
    titleLine2Pre: "có",
    titleLine2Em: "ví",
    titleLine2Post: ".",
    subPre: "Các agent khác viết code. Franklin viết code",
    subEm: "và tiêu tiền",
    subPost:
      "để hoàn thành — models, dữ liệu, hình ảnh, search. Bạn đặt ngân sách. Nó tự chạy.",
    ctaPrimary: "Bắt đầu miễn phí",
    ctaSecondary: "Star trên GitHub",
    copyInstallAriaLabel: "Sao chép lệnh cài đặt",
    pillYopoSuffix: "You Only Pay Outcome",
    pillUsdcBefore: "USDC trên",
    pillX402Before: "Native",
    termAbort: "esc để hủy",
  },

  trustBar: {
    builtOn: "Xây dựng trên",
    routesPrefix: "định tuyến qua",
    routesModels: "60+ frontier models",
    providersPrefix: "từ",
  },

  terminalDemo: {
    eyebrow: "Xem chạy thật",
    titlePre: "Năm tác vụ.",
    titleEm: "Năm lần chạy. Năm biên lai.",
    sub:
      "Một phiên Franklin Agent thật. Mỗi command gọi model đã được định tuyến, trả phí từng call bằng USDC, rồi in chi phí.",
  },

  features: {
    eyebrow: "Bốn chương",
    titleTop: "Một chiếc ví",
    titleEm: "thay đổi",
    introPre: "Trí tuệ lập trình là điều kiện cần. Khác biệt nằm ở",
    introEm: "sức mua",
    introPost:
      "— và kỷ luật âm thầm đi kèm với một agent phải tự cân đối sổ sách của mình.",
    cards: [
      {
        label: "Chiếc ví",
        title: "Phần mềm biết tiêu tiền.",
        desc: "Franklin giữ USDC trên Base hoặc Solana. Khi cần một model, một nguồn dữ liệu, hay một bức ảnh — nó ký giao dịch và thanh toán. Non-custodial. Khóa của bạn nằm trên máy bạn. Bạn đặt hạn mức; Franklin tuân thủ.",
      },
      {
        label: "Trading",
        title: "Mua dữ liệu. Đọc tape. Quyết định.",
        desc: "Hỏi “BTC đang trông thế nào?” và Franklin mua giá live, tính RSI, MACD, Bollinger, volatility ngay tại máy, rồi trả về tín hiệu. Một prompt. Không năm tab trình duyệt, không mớ API key.",
      },
      {
        label: "Smart Router",
        title: "60+ models. Nó chọn. Bạn tiết kiệm.",
        desc: "Không model nào giỏi mọi thứ. Router phân loại từng request và định tuyến trong dưới một mili-giây. Huấn luyện trên 2M+ request thật, xếp hạng liên tục bằng Elo, thích ứng với override của bạn. Tiết kiệm tới 89% so với luôn-Opus.",
      },
      {
        label: "Học bạn",
        title: "Mỗi phiên thông minh hơn.",
        desc: "Claude Code quên giữa các lần chạy. Franklin trích xuất sở thích — ngôn ngữ, phong cách, lựa chọn model, workflow — rồi tiêm vào phiên kế tiếp. Pattern được xác nhận tăng độ tin cậy. Pattern cũ phai sau 30 ngày.",
      },
    ],
  },

  getStarted: {
    eyebrow: "Giá · Cài đặt · Nạp",
    titlePre: "Trả cho",
    titleEm: "kết quả",
    titleAfterEm: ",",
    titlePost: "không gì khác.",
    yopoLabel: "You Only Pay Outcome · YOPO",
    yopoTitle: "Chi phí nhà cung cấp + 5%, ký theo từng hành động.",
    yopoBody:
      "Không subscription (bạn không trả cho quyền truy cập). Không pay-per-call (bạn không trả cho lần gọi thất bại). Số dư ví là hạn mức cứng. Khi về 0, Franklin dừng. Toàn bộ mô hình giá là vậy.",
    steps: [
      {
        title: "Cài đặt",
        body: "Một lệnh npm. Node 20+. macOS, Linux, WSL.",
      },
      {
        title: "Chạy miễn phí",
        body: "NVIDIA Nemotron và DeepSeek V4 Flash miễn phí có sẵn. Không cần ví.",
      },
      {
        title: "Nạp ($5 là đủ)",
        body: "Tạo ví Base hoặc Solana. Gửi USDC. Mở khóa mọi frontier model.",
      },
      {
        title: "Nêu một kết quả",
        body: "Code, trade, research, generate — Franklin chọn, trả, báo cáo, dừng.",
      },
    ],
    ctaInstall: "Cài từ npm",
    ctaGitHub: "Xem trên GitHub",
    slashEyebrow: "Slash Commands · 18 lệnh tích hợp",
    slashDescs: [
      "Chọn tương tác hoặc đổi trực tiếp",
      "Lập kế hoạch read-only, rồi chạy",
      "Suy luận sâu cho bài toán khó",
      "Nén ngữ cảnh có cấu trúc",
      "Search trong codebase",
      "Full-text qua các phiên cũ",
      "Xem lại hoặc khôi phục mọi phiên",
      "Trợ giúp Git workflow",
      "Review, fix bug, test một phát",
      "Chi tiêu phiên + địa chỉ + số dư",
      "Phân tích chi tiêu và xu hướng",
      "Những gì Franklin đã học được",
    ],
  },

  compare: {
    eyebrow: "Sổ cái",
    titleTop: "Trong một bảng,",
    titleBottom: "cho minh bạch.",
    intro:
      "Sản phẩm AI bán quyền truy cập. Subscription đưa bạn cảm giác tội lỗi hàng tháng kèm rate limit. Pay-per-call tính tiền cho mọi lần thử thất bại. Franklin thanh toán cho kết quả — một lần, bằng USDC.",
    headers: {
      saas: "Subscription SaaS",
      ppc: "API pay-per-call",
      franklin: "Franklin — YOPO",
    },
    rows: [
      {
        label: "Bạn trả cho",
        saas: "Quyền truy cập, dùng hay không",
        ppc: "Mọi lần thử, kể cả ngõ cụt",
        franklin: "Kết quả. Một lần.",
      },
      {
        label: "Phí hàng tháng",
        saas: "$20 — $200",
        ppc: "$0, cộng dùng bao nhiêu trả bấy nhiêu",
        franklin: "$0. Chỉ trả cho phần bạn tiêu.",
      },
      {
        label: "Rate limit",
        saas: "Có. Siết khi bạn cần nhất.",
        ppc: "Hạn mức theo key, theo tier",
        franklin: "Không. Số dư ví là giới hạn duy nhất.",
      },
      {
        label: "Định danh",
        saas: "Email + thẻ tín dụng",
        ppc: "Tài khoản nhà cung cấp, API key cho từng model",
        franklin: "Một chiếc ví. Không email, không KYC.",
      },
      {
        label: "Lựa chọn model",
        saas: "Một nhà cung cấp duy nhất",
        ppc: "Bạn xoay 12 chiếc key",
        franklin: "60+ models qua một ví · router quyết định.",
      },
      {
        label: "Nhà cung cấp ngừng hoạt động",
        saas: "Bạn đứng hình.",
        ppc: "Bạn đứng hình.",
        franklin: "Định tuyến sang nhà cung cấp kế tiếp.",
      },
      {
        label: "Rủi ro vượt chi",
        saas: "Tự gia hạn âm thầm",
        ppc: "Hóa đơn không giới hạn cuối tháng",
        franklin: "Không. Ví hết ⇒ Franklin dừng.",
      },
      {
        label: "Mã nguồn",
        saas: "Đóng",
        ppc: "SDK đóng",
        franklin: "Apache 2.0 · local-first.",
      },
    ],
  },

  openSource: {
    eyebrow: "The Commons · Apache 2.0",
    titleTop: "Bạn sở hữu",
    titleEm: "tất cả",
    labels: [
      { k: "Dữ liệu của bạn", v: "~/.blockrun/" },
      { k: "Ví của bạn", v: "Khóa riêng · local" },
      { k: "Models của bạn", v: "60+ · đổi bằng 1 lệnh" },
      { k: "Giấy phép của bạn", v: "Apache 2.0" },
      { k: "Uptime của bạn", v: "Fork. Self-host." },
    ],
    paragraphs: [
      "Với công cụ AI đóng, nhà cung cấp sở hữu dữ liệu sử dụng, sở thích, lịch sử của bạn. Họ đổi điều khoản — bạn chấp nhận. Họ tăng giá — bạn trả. Họ sập — bạn dừng.",
      "Franklin là Apache 2.0 và chạy trên máy bạn. Khóa ví, lịch sử phiên, learnings — tất cả nằm trong ~/.blockrun/. Zero telemetry. Không gì gọi về nhà.",
      "Nếu BlockRun biến mất ngày mai, USDC của bạn vẫn nằm trong ví và agent vẫn chạy. Đó là toàn bộ ý nghĩa.",
    ],
    smallParagraph:
      "Đọc từng dòng: toàn bộ agent loop, 16 tool tích hợp, plugin SDK, x402 client, router — tất cả đều trong repo. Audit, fork, ship phiên bản dọc của riêng bạn.",
  },

  blog: {
    eyebrow: "Bản tin",
    titleTop: "Từ",
    titleEm: "công xưởng",
    intro:
      "Ghi chú về multi-model coding agent, AI gốc-ví, và frontier model dành cho developer không có thẻ tín dụng quốc tế.",
    allPosts: "Tất cả bài viết →",
  },

  faq: {
    eyebrow: "Câu hỏi",
    titleTop: "Hỏi,",
    titleEm: "đáp",
    intro:
      "Mô hình tác nhân kinh tế tự trị nói thẳng. Không vòng vo.",
    items: [
      {
        q: "Khác Claude Code hay Cursor ở điểm nào?",
        a: "Họ viết code rất tốt. Họ không tiêu được tiền. Họ không mua được dữ liệu trading, không trả tiền cho lệnh API, không thanh toán cho image generation, không thanh toán hóa đơn web search. Franklin thì có — vì nó giữ ví USDC và trả theo từng hành động qua x402. Trí tuệ lập trình là điều kiện cần; tự trị kinh tế là một category mới.",
      },
      {
        q: "“Một agent có ví” thực sự nghĩa là gì?",
        a: "Franklin giữ USDC trên Base hoặc Solana. Khi cần một model, một nguồn dữ liệu hay một dịch vụ, nó ký một micropayment EIP-712 và trả tiền. Bạn đặt ngân sách; Franklin tuân thủ. Mọi cent được theo dõi real-time. Không subscription, không API key, không cổng thanh toán.",
      },
      {
        q: "Franklin có thể tiêu vào những gì?",
        a: "60+ AI models (Claude, GPT, Gemini, Grok, DeepSeek, Kimi, v.v.), tạo ảnh (GPT Image, Nano Banana, Grok Imagine), tạo video, Exa neural web search, dữ liệu prediction market (Polymarket, Kalshi), intelligence X/Twitter, tạo nhạc. Smart Router chọn model phù hợp nhất cho từng task — tiết kiệm tới 89% so với luôn-Opus.",
      },
      {
        q: "Giá bao nhiêu?",
        a: "YOPO — You Only Pay Outcome. Chi phí nhà cung cấp + 5%, thanh toán từng lần gọi bằng USDC. Câu hỏi đơn giản: ~$0.001. Phiên code: $0.02–$0.10. Phiên sâu 30 phút: $0.10–$0.50. Không subscription, không phí tháng, không rate limit. NVIDIA models miễn phí luôn có sẵn — không cần ví.",
      },
      {
        q: "Nó thật sự học cách tôi làm việc?",
        a: "Có. Sau mỗi phiên, Franklin trích xuất sở thích — ngôn ngữ, phong cách, lựa chọn model, workflow — và tiêm vào lần chạy kế tiếp. Sở thích được xác nhận tăng độ tin cậy. Cái cũ phai sau 30 ngày. Chạy /learnings để xem nó biết gì.",
      },
      {
        q: "Dữ liệu của tôi có riêng tư không?",
        a: "Tất cả nằm local trong ~/.blockrun/. Lịch sử phiên, learnings, khóa ví — không gì gọi về nhà. Zero telemetry, zero crash report. Khóa riêng không bao giờ rời máy bạn. Mã nguồn Apache 2.0 — audit từng dòng.",
      },
      {
        q: "Có dùng miễn phí được không?",
        a: "Có. NVIDIA models miễn phí (Nemotron, DeepSeek V4 Flash) chạy không cần ví, không USDC, không đăng ký. Chỉ nạp ví khi bạn muốn Sonnet, Opus, GPT, Gemini, Grok, hoặc các tool trả phí.",
      },
      {
        q: "Vì sao lại Base và Solana?",
        a: "Finality nhanh, phí gần như bằng không, hỗ trợ USDC trưởng thành, và một hệ sinh thái x402 thực sự trên cả hai. Bạn chọn lúc setup và đổi lúc nào cũng được. Cùng UX ví, cùng models, khác đường ray.",
      },
    ],
  },

  closing: {
    kicker: "Franklin Agent",
    titleTop: "Chạy một tác nhân kinh tế.",
    titleEm: "Đừng xem agent thất bại vì tiền nữa.",
    cta: "Cài Franklin Agent",
  },

  footer: {
    tagline:
      "AI agent có ví. Nó giữ USDC của bạn và tiêu hướng tới kết quả. Apache 2.0.",
    aboutPre: "Một sản phẩm của",
    aboutLink: "BlockRun.ai",
    aboutPost: ". Vận hành trên giao thức micropayment x402.",
    ctaGetStarted: "Bắt đầu",
    colProduct: "Sản phẩm",
    colResources: "Tài nguyên",
    colCommunity: "Cộng đồng",
    linkFeatures: "Tính năng",
    linkCompare: "So sánh",
    linkGetStarted: "Bắt đầu",
    linkNpm: "npm",
    linkDocs: "Tài liệu",
    linkBlog: "Blog",
    linkGallery: "Thư viện",
    linkGateway: "BlockRun Gateway",
    linkX402: "Giao thức x402",
    linkGitHub: "GitHub",
    linkX: "X / Twitter",
    linkTelegram: "Telegram",
    copyright: "© 2026 BlockRun.ai. Bảo lưu mọi quyền.",
    bottomRight: "Tác nhân kinh tế tự trị bởi BlockRun.ai",
  },

  localeSwitcherLabel: "Đọc bằng:",

  meta: {
    title: "Franklin — AI Agent có ví",
    description:
      "AI agent có ví. Nó giữ USDC của bạn và tiêu giúp bạn — 60+ models, dữ liệu trading, tạo ảnh, tạo video, web search. Một ví, không API key. Mã nguồn mở.",
    ogTitle: "Franklin — AI Agent có ví",
    ogDescription:
      "Các agent khác viết code. Franklin viết code và tiêu tiền để hoàn thành. 60+ models, dữ liệu trading, tạo ảnh, web search — một ví USDC. Mã nguồn mở.",
    twitterTitle: "Franklin — AI Agent có ví",
    twitterDescription:
      "AI agent có ví. 60+ models, dữ liệu trading, tạo ảnh — nó giữ USDC của bạn và tiêu giúp bạn. Mã nguồn mở.",
  },
};
