const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const languageToggle = document.querySelector(".language-toggle");

const translations = {
  tr: {
    title: "EntropyHub | Dokümantasyon",
    brandAria: "EntropyHub ana sayfa",
    navAria: "Ana menü",
    chartAria: "Lyapunov üssü karşılaştırması",
    brandTagline: "doğrulanabilir kaos",
    menuOpen: "Menüyü aç",
    menuClose: "Menüyü kapat",
    switchTo: "Switch to English",
    copy: "Kopyala",
    copied: "Kopyalandı ✓",
    heroTitle: "Kaosu sadece kullanma.|Ölç ve doğrula.",
    heroLead: "EntropyHub, Rössler dinamik sistemini 4. dereceden Runge–Kutta ile entegre eden, işletim sistemi entropisiyle tohumlanan ve çalışma anında Lyapunov üssünü ölçebilen bir PRNG çekirdeğidir.",
    quickStart: "Hızlı başlangıç →",
    source: "Kaynak kodu gör",
    liveVerification: "CANLI DOĞRULAMA",
    lyapunov: "en büyük Lyapunov üssü",
    chaotic: "● kaotik",
    version: "sürüm",
    integration: "entegrasyon",
    whitening: "çıktı karıştırma",
    license: "lisans",
    startLabel: "BAŞLANGIÇ",
    startTitle: "İlk çıktınızı dakikalar içinde alın.",
    startCopy: "EntropyHub, Rust workspace içindeki saf çekirdeği ve PyO3 üzerinden sunulan Python paketini birlikte barındırır. Python kullanımı için Rust toolchain, Python 3.8+ ve Maturin gerekir.",
    production: "Üretim notu",
    productionCopy: "Güvenlik-kritik kullanım için secrets, os.urandom veya denetlenmiş bir CSPRNG tercih edin. EntropyHub kriptografik olarak bağımsız denetlenmemiştir.",
    architecture: "MİMARİ",
    architectureTitle: "İki dil, tek deterministik çekirdek.",
    osCopy: "24 byte işletim sistemi entropisi okunur; değerler Rössler çekicisinin doğal havzasına taşınır.",
    coreCopy: "RK4 ile durum ilerletilir, SHA-256 ile beyazlatılır ve deterministik byte çıktısı üretilir.",
    apiCopy: "PyO3 bağlayıcısı veya doğrudan Rust crate'i üzerinden aynı davranışa erişilir.",
    projectStructure: "PROJE YAPISI",
    whereCode: "Kod nerede?",
    layoutCopy: "Çekirdek mantık Python bağımlılığı olmayan Rust crate'inde tutulur. Bu sayede performans ve test edilebilirlik korunurken Python ergonomisi ayrı bir katmanda sağlanır.",
    apiLabel: "PYTHON API",
    apiTitle: "Günlük kullanım için sade arayüz.",
    verifyLabel: "04 · BİLİMSEL DOĞRULAMA",
    verifyTitle: "Parametreye değil, ölçüme güven.",
    verifyCopy: "Rössler sisteminin teorik olarak kaotik parametrelerini kullanmak tek başına yeterli değildir. Yanlış integratör kaosu sayısal olarak bastırabilir. Bu nedenle her CI çalıştırmasında Lyapunov ölçümü yapılır.",
    notChaotic: "kaos gözlenmiyor",
    literature: "literatür: 0.0714",
    measurements: "GERÇEK ÖLÇÜMLER",
    measurementsTitle: "Grafik, kaynak koddaki test sonuçlarını gösterir.",
    measurementsCopy: "Bu sayfadaki değerler görsel amaçlı uydurulmuş skorlar değildir. RK4 ve periyodik parametre sonuçları, entropyhub-core içindeki Benettin yöntemiyle çalışan Rust testleri ve proje README'sinde açıklanan ölçümlerden alınmıştır.",
    sourceBadge: "● KAYNAK: cargo test -p entropyhub-core --release",
    chartTitle: "En büyük Lyapunov üssü (λ)",
    chartCaption: "Pozitif ve yüksek λ, hassas başlangıç koşullarına duyarlılığın ölçülebilir göstergesidir.",
    tableCaption: "Parametre ve doğrulama özeti",
    experiment: "Deney",
    result: "λ sonucu",
    interpretation: "Yorum",
    chaosSuppressed: "Kaosu bastırıyor",
    limitCycle: "Limit cycle",
    apiTags: ["constructor", "bytes", "integer", "float", "diagnostic", "state"],
    mustPass: "Test geçmeli",
    measureNote: "Not: ~ işareti, değerlerin çalışma ortamı ve iterasyon sayısına göre küçük farklılıklar gösterebileceğini belirtir. Uygulama kendi örneğini verify_chaos() ile yeniden ölçebilir.",
    finalLabel: "AÇIK KAYNAK · DOĞRULANABİLİR · EĞİTİCİ",
    finalTitle: "Kaosu birlikte daha iyi anlayalım.",
    finalCopy: "Katkıda bulunmak, bir issue açmak veya çekirdeği incelemek için GitHub deposunu ziyaret edin.",
    finalButton: "GitHub deposuna git →",
    company: "Şükran Akyıldız Yazılım Teknolojileri ve Proje Danışmanlık Hizmetleri Şirketi"
  },
  en: {
    title: "EntropyHub | Documentation",
    brandAria: "EntropyHub home",
    navAria: "Main menu",
    chartAria: "Lyapunov exponent comparison",
    brandTagline: "chaos you can verify",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    switchTo: "Türkçeye geç",
    copy: "Copy",
    copied: "Copied ✓",
    heroTitle: "Do not just use chaos.|Measure and verify it.",
    heroLead: "EntropyHub is a PRNG core that integrates the Rössler dynamical system with 4th-order Runge–Kutta, seeds it from OS entropy, and measures its Lyapunov exponent at runtime.",
    quickStart: "Quick start →",
    source: "View source code",
    liveVerification: "LIVE VERIFICATION",
    lyapunov: "largest Lyapunov exponent",
    chaotic: "● chaotic",
    version: "version",
    integration: "integration",
    whitening: "output whitening",
    license: "license",
    startLabel: "GETTING STARTED",
    startTitle: "Get your first output in minutes.",
    startCopy: "EntropyHub bundles a pure Rust core with a Python package exposed through PyO3. Python usage requires the Rust toolchain, Python 3.8+, and Maturin.",
    production: "Production note",
    productionCopy: "For security-critical use, choose secrets, os.urandom, or an audited CSPRNG. EntropyHub has not been independently cryptanalyzed.",
    architecture: "ARCHITECTURE",
    architectureTitle: "Two languages, one deterministic core.",
    osCopy: "24 bytes of operating-system entropy are read and mapped into the natural basin of the Rössler attractor.",
    coreCopy: "The state advances with RK4, is whitened with SHA-256, and produces deterministic byte output.",
    apiCopy: "Access the same behavior through the PyO3 binding or directly through the Rust crate.",
    projectStructure: "PROJECT STRUCTURE",
    whereCode: "Where is the code?",
    layoutCopy: "Core logic lives in a Python-independent Rust crate. This preserves performance and testability while a separate layer provides Python ergonomics.",
    apiLabel: "PYTHON API",
    apiTitle: "A simple interface for everyday use.",
    verifyLabel: "04 · SCIENTIFIC VERIFICATION",
    verifyTitle: "Trust measurement, not parameters.",
    verifyCopy: "Using theoretically chaotic Rössler parameters is not enough. A wrong integrator can suppress chaos numerically, so every CI run measures the Lyapunov exponent.",
    notChaotic: "chaos not observed",
    literature: "literature: 0.0714",
    measurements: "REAL MEASUREMENTS",
    measurementsTitle: "The chart shows results from the source-code tests.",
    measurementsCopy: "The values on this page are not invented scores for decoration. RK4 and periodic-parameter results come from the Rust tests using the Benettin method in entropyhub-core and measurements documented in the project README.",
    sourceBadge: "● SOURCE: cargo test -p entropyhub-core --release",
    chartTitle: "Largest Lyapunov exponent (λ)",
    chartCaption: "A positive, high λ is a measurable indicator of sensitivity to initial conditions.",
    tableCaption: "Parameter and verification summary",
    experiment: "Experiment",
    result: "λ result",
    interpretation: "Interpretation",
    chaosSuppressed: "Chaos suppressed",
    limitCycle: "Limit cycle",
    apiTags: ["constructor", "bytes", "integer", "float", "diagnostic", "state"],
    mustPass: "Must pass",
    measureNote: "Note: The ~ marker means values can vary slightly with the runtime environment and iteration count. The live instance can measure itself again with verify_chaos().",
    finalLabel: "OPEN SOURCE · VERIFIABLE · EDUCATIONAL",
    finalTitle: "Let's understand chaos together.",
    finalCopy: "Visit the GitHub repository to contribute, open an issue, or inspect the core.",
    finalButton: "Go to GitHub repository →",
    company: "Şükran Akyıldız Software Technologies and Project Consultancy Services Company"
  }
};

const targets = {
  ".brand small": "brandTagline", ".hero .lead": "heroLead", ".hero .button.primary": "quickStart",
  ".hero .button.secondary": "source", ".card-label": "liveVerification", ".metric span": "lyapunov",
  ".metric-foot .green": "chaotic", ".stats-grid div:nth-child(1) span": "version",
  ".stats-grid div:nth-child(2) span": "integration", ".stats-grid div:nth-child(3) span": "whitening",
  ".stats-grid div:nth-child(4) span": "license", "#baslangic .eyebrow": "startLabel", "#baslangic h2": "startTitle",
  "#baslangic .two-column > div > p": "startCopy", ".note strong": "production", ".note p": "productionCopy",
  "#mimari .eyebrow": "architecture", "#mimari h2": "architectureTitle", ".arch-card:nth-child(1) p": "osCopy",
  ".arch-card:nth-child(3) p": "coreCopy", ".arch-card:nth-child(5) p": "apiCopy", ".layout-code .eyebrow": "projectStructure",
  ".layout-code h3": "whereCode", ".layout-code p:not(.eyebrow)": "layoutCopy", "#api .eyebrow": "apiLabel",
  "#api h2": "apiTitle", ".verify-grid .eyebrow": "verifyLabel", ".verify-grid h2": "verifyTitle",
  ".verify-grid > div > p:not(.eyebrow)": "verifyCopy", ".comparison > div:first-child small": "notChaotic",
  ".comparison .winner small": "literature", "#olcumler .eyebrow": "measurements", "#olcumler h2": "measurementsTitle",
  ".measurement-intro p": "measurementsCopy", ".data-badge": "sourceBadge", ".chart-title strong": "chartTitle",
  ".chart-caption": "chartCaption", "caption": "tableCaption", "th:nth-child(1)": "experiment",
  "th:nth-child(2)": "result", "th:nth-child(3)": "interpretation", ".periodic-label": "chaosSuppressed",
  ".measurement-grid tr:nth-child(3) .periodic-label": "limitCycle", ".threshold-label": "mustPass",
  ".measurement-footnote": "measureNote", ".final-cta .eyebrow": "finalLabel",
  ".final-cta h2": "finalTitle", ".final-cta > p:not(.eyebrow)": "finalCopy", ".final-cta .button": "finalButton",
  ".company-name": "company"
};

function setLanguage(language) {
  const dictionary = translations[language] || translations.tr;
  document.querySelectorAll(".nav a[href]").forEach((link) => {
    const key = { "#baslangic": "startLabel", "#mimari": "architecture", "#dogrulama": "verifyLabel", "#olcumler": "measurements" }[link.getAttribute("href")];
    if (key) link.textContent = dictionary[key].replace(/^04 · /, "");
  });
  const title = document.querySelector(".hero h1");
  if (title) {
    const [before, after] = dictionary.heroTitle.split("|");
    title.replaceChildren(document.createTextNode(`${before}\n`), Object.assign(document.createElement("em"), { textContent: after }));
  }
  document.querySelectorAll(".copy").forEach((button) => { button.textContent = dictionary.copy; });
  Object.entries(targets).forEach(([selector, key]) => {
    document.querySelectorAll(selector).forEach((element) => { element.textContent = dictionary[key]; });
  });
  document.querySelectorAll(".api-card .tag").forEach((tag, index) => { tag.textContent = dictionary.apiTags[index]; });
  document.documentElement.lang = language;
  document.title = dictionary.title;
  languageToggle.textContent = language === "tr" ? "EN" : "TR";
  languageToggle.setAttribute("aria-label", dictionary.switchTo);
  document.querySelector(".brand")?.setAttribute("aria-label", dictionary.brandAria);
  document.querySelector(".nav")?.setAttribute("aria-label", dictionary.navAria);
  document.querySelector(".bar-chart")?.setAttribute("aria-label", dictionary.chartAria);
  menuToggle?.setAttribute("aria-label", dictionary.menuOpen);
  localStorage.setItem("entropyhub-language", language);
}

languageToggle?.addEventListener("click", () => setLanguage(document.documentElement.lang === "tr" ? "en" : "tr"));
setLanguage(localStorage.getItem("entropyhub-language") === "en" ? "en" : "tr");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", translations[document.documentElement.lang][open ? "menuClose" : "menuOpen"]);
});
document.querySelectorAll(".nav a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

document.querySelectorAll(".copy").forEach((button) => button.addEventListener("click", async () => {
  const source = document.getElementById(button.dataset.copy);
  if (!source || !navigator.clipboard) return;
  await navigator.clipboard.writeText(source.textContent);
  const language = document.documentElement.lang;
  button.textContent = translations[language].copied;
  setTimeout(() => { button.textContent = translations[language].copy; }, 1500);
}));
