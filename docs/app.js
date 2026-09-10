const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const languageToggle = document.querySelector(".language-toggle");

const translations = {
  tr: {
    "nav-start": "Başlangıç", "nav-architecture": "Mimari", "nav-verify": "Doğrulama", "nav-measurements": "Ölçümler",
    "hero-title": "Kaosu sadece kullanma.<br><em>Ölç ve doğrula.</em>",
    "hero-lead": "EntropyHub, Rössler dinamik sistemini 4. dereceden Runge–Kutta ile entegre eden, işletim sistemi entropisiyle tohumlanan ve çalışma anında Lyapunov üssünü ölçebilen bir PRNG çekirdeğidir.",
    "hero-start": "Hızlı başlangıç <span>→</span>", "hero-source": "Kaynak kodu gör",
    "stats-version": "sürüm", "stats-integration": "entegrasyon", "stats-output": "çıktı karıştırma", "stats-license": "lisans",
    "start-label": "BAŞLANGIÇ", "start-title": "İlk çıktınızı dakikalar içinde alın.",
    "start-copy": "EntropyHub, Rust workspace içindeki saf çekirdeği ve PyO3 üzerinden sunulan Python paketini birlikte barındırır. Python kullanımı için Rust toolchain, Python 3.8+ ve Maturin gerekir.",
    "copy": "Kopyala", "production-note": "Üretim notu", "production-copy": "Güvenlik-kritik kullanım için <code>secrets</code>, <code>os.urandom</code> veya denetlenmiş bir CSPRNG tercih edin. EntropyHub kriptografik olarak bağımsız denetlenmemiştir.",
    "architecture-label": "MİMARİ", "architecture-title": "İki dil, tek deterministik çekirdek.",
    "arch-os-copy": "24 byte işletim sistemi entropisi okunur; değerler Rössler çekicisinin doğal havzasına taşınır.",
    "arch-core-copy": "RK4 ile durum ilerletilir, SHA-256 ile beyazlatılır ve deterministik byte çıktısı üretilir.",
    "arch-api-copy": "PyO3 bağlayıcısı veya doğrudan Rust crate'i üzerinden aynı davranışa erişilir.",
    "layout-label": "PROJE YAPISI", "layout-title": "Kod nerede?", "layout-copy": "Çekirdek mantık Python bağımlılığı olmayan Rust crate'inde tutulur. Bu sayede performans ve test edilebilirlik korunurken Python ergonomisi ayrı bir katmanda sağlanır.",
    "api-label": "PYTHON API", "api-title": "Günlük kullanım için sade arayüz.", "api-copy-1": "OS entropisiyle yeni bir örnek oluşturur. <code>dt</code>, RK4 zaman adımıdır.", "api-copy-2": "<code>n</code> adet byte döndürür. Daha yüksek iteration, örnekler arasında daha fazla faz uzayı mesafesi sağlar.", "api-copy-3": "Rejection sampling kullanarak kapalı aralıkta (<code>lo ≤ x ≤ hi</code>) uniform tamsayı üretir.", "api-copy-4": "<code>[0, 1)</code> aralığında 64 bitlik ham çıktıyı ölçekleyerek uniform kayan nokta üretir.", "api-copy-5": "Canlı örneği bozmadan Benettin yöntemiyle en büyük Lyapunov üssünü tahmin eder.", "api-copy-6": "Yeni OS entropisiyle tohumlar veya mevcut <code>(x, y, z)</code> konumunu okur.",
    "verify-label": "04 · BİLİMSEL DOĞRULAMA", "verify-title": "Parametreye değil, ölçüme güven.", "verify-copy": "Rössler sisteminin teorik olarak kaotik parametrelerini kullanmak tek başına yeterli değildir. Yanlış integratör kaosu sayısal olarak bastırabilir. Bu nedenle her CI çalıştırmasında Lyapunov ölçümü yapılır.",
    "not-chaotic": "kaos gözlenmiyor", "literature": "literatür: 0.0714", "final-label": "AÇIK KAYNAK · DOĞRULANABİLİR · EĞİTİCİ", "final-title": "Kaosu birlikte daha iyi anlayalım.", "final-copy": "Katkıda bulunmak, bir issue açmak veya çekirdeği incelemek için GitHub deposunu ziyaret edin.", "final-button": "GitHub deposuna git →",
    "company": "Şükran Akyıldız Yazılım Teknolojileri ve Proje Danışmanlık Hizmetleri Şirketi",
    "measure-label": "GERÇEK ÖLÇÜMLER", "measure-title": "Grafik, kaynak koddaki test sonuçlarını gösterir.", "measure-copy": "Bu sayfadaki değerler görsel amaçlı uydurulmuş skorlar değildir. RK4 ve periyodik parametre sonuçları, entropyhub-core içindeki Benettin yöntemiyle çalışan Rust testleri ve proje README'sinde açıklanan ölçümlerden alınmıştır.", "measure-source": "● KAYNAK: cargo test -p entropyhub-core --release", "chart-title": "En büyük Lyapunov üssü (λ)", "chart-caption": "Pozitif ve yüksek λ, hassas başlangıç koşullarına duyarlılığın ölçülebilir göstergesidir.", "table-caption": "Parametre ve doğrulama özeti", "table-experiment": "Deney", "table-result": "λ sonucu", "table-comment": "Yorum", "table-chaotic": "Kaotik", "table-suppressed": "Kaosu bastırıyor", "table-limit": "Limit cycle", "table-threshold": "Test geçmeli", "measure-note": "Not: `~` işareti, değerlerin çalışma ortamı ve iterasyon sayısına göre küçük farklılıklar gösterebileceğini belirtir. Uygulama kendi örneğini `verify_chaos()` ile yeniden ölçebilir."
  },
  en: {
    "nav-start": "Getting started", "nav-architecture": "Architecture", "nav-verify": "Verification", "nav-measurements": "Measurements",
    "hero-title": "Do not just use chaos.<br><em>Measure and verify it.</em>",
    "hero-lead": "EntropyHub is a PRNG core that integrates the Rössler dynamical system with 4th-order Runge–Kutta, seeds it from OS entropy, and measures its Lyapunov exponent at runtime.",
    "hero-start": "Quick start <span>→</span>", "hero-source": "View source code",
    "stats-version": "version", "stats-integration": "integration", "stats-output": "output whitening", "stats-license": "license",
    "start-label": "GETTING STARTED", "start-title": "Get your first output in minutes.",
    "start-copy": "EntropyHub bundles a pure Rust core with a Python package exposed through PyO3. Python usage requires the Rust toolchain, Python 3.8+, and Maturin.",
    "copy": "Copy", "production-note": "Production note", "production-copy": "For security-critical use, choose <code>secrets</code>, <code>os.urandom</code>, or an audited CSPRNG. EntropyHub has not been independently cryptanalyzed.",
    "architecture-label": "ARCHITECTURE", "architecture-title": "Two languages, one deterministic core.",
    "arch-os-copy": "24 bytes of operating-system entropy are read and mapped into the natural basin of the Rössler attractor.",
    "arch-core-copy": "The state advances with RK4, is whitened with SHA-256, and produces deterministic byte output.",
    "arch-api-copy": "Access the same behavior through the PyO3 binding or directly through the Rust crate.",
    "layout-label": "PROJECT STRUCTURE", "layout-title": "Where is the code?", "layout-copy": "Core logic lives in a Python-independent Rust crate. This preserves performance and testability while a separate layer provides Python ergonomics.",
    "api-label": "PYTHON API", "api-title": "A simple interface for everyday use.", "api-copy-1": "Creates an instance seeded from OS entropy. <code>dt</code> is the RK4 time step.", "api-copy-2": "Returns <code>n</code> bytes. Higher iteration values move samples farther apart in phase space.", "api-copy-3": "Generates a uniform integer in the closed interval (<code>lo ≤ x ≤ hi</code>) using rejection sampling.", "api-copy-4": "Scales 64 bits of raw output into a uniform float in <code>[0, 1)</code>.", "api-copy-5": "Estimates the live instance's largest Lyapunov exponent with the Benettin method without disturbing it.", "api-copy-6": "Seeds from fresh OS entropy or reads the current <code>(x, y, z)</code> position.",
    "verify-label": "04 · SCIENTIFIC VERIFICATION", "verify-title": "Trust measurement, not parameters.", "verify-copy": "Using theoretically chaotic Rössler parameters is not enough. A wrong integrator can suppress chaos numerically, so every CI run measures the Lyapunov exponent.",
    "not-chaotic": "chaos not observed", "literature": "literature: 0.0714", "final-label": "OPEN SOURCE · VERIFIABLE · EDUCATIONAL", "final-title": "Let's understand chaos together.", "final-copy": "Visit the GitHub repository to contribute, open an issue, or inspect the core.", "final-button": "Go to GitHub repository →",
    "company": "Şükran Akyıldız Software Technologies and Project Consultancy Services Company",
    "measure-label": "REAL MEASUREMENTS", "measure-title": "The chart shows results from the source-code tests.", "measure-copy": "The values on this page are not invented scores for decoration. RK4 and periodic-parameter results come from the Rust tests using the Benettin method in entropyhub-core and measurements documented in the project README.", "measure-source": "● SOURCE: cargo test -p entropyhub-core --release", "chart-title": "Largest Lyapunov exponent (λ)", "chart-caption": "A positive, high λ is a measurable indicator of sensitivity to initial conditions.", "table-caption": "Parameter and verification summary", "table-experiment": "Experiment", "table-result": "λ result", "table-comment": "Interpretation", "table-chaotic": "Chaotic", "table-suppressed": "Chaos suppressed", "table-limit": "Limit cycle", "table-threshold": "Must pass", "measure-note": "Note: The `~` marker means values can vary slightly with the runtime environment and iteration count. The live instance can measure itself again with `verify_chaos()`."
  }
};

const textTargets = {
  "a[href='#baslangic']": "nav-start", "a[href='#mimari']": "nav-architecture", "a[href='#dogrulama']": "nav-verify", "a[href='#olcumler']": "nav-measurements",
  ".hero h1": "hero-title", ".hero .lead": "hero-lead", ".hero .button.primary": "hero-start", ".hero .button.secondary": "hero-source",
  ".stats-grid div:nth-child(1) span": "stats-version", ".stats-grid div:nth-child(2) span": "stats-integration", ".stats-grid div:nth-child(3) span": "stats-output", ".stats-grid div:nth-child(4) span": "stats-license",
  "#baslangic .eyebrow": "start-label", "#baslangic h2": "start-title", "#baslangic .two-column > div > p": "start-copy", "#baslangic .copy": "copy", ".note strong": "production-note", ".note p": "production-copy",
  "#mimari .eyebrow": "architecture-label", "#mimari h2": "architecture-title", ".arch-card:nth-child(1) p": "arch-os-copy", ".arch-card:nth-child(3) p": "arch-core-copy", ".arch-card:nth-child(5) p": "arch-api-copy", ".layout-code .eyebrow": "layout-label", ".layout-code h3": "layout-title", ".layout-code p:not(.eyebrow)": "layout-copy",
  "#api .eyebrow": "api-label", "#api h2": "api-title", ".api-card:nth-child(1) p": "api-copy-1", ".api-card:nth-child(2) p": "api-copy-2", ".api-card:nth-child(3) p": "api-copy-3", ".api-card:nth-child(4) p": "api-copy-4", ".api-card:nth-child(5) p": "api-copy-5", ".api-card:nth-child(6) p": "api-copy-6", "#api .copy": "copy",
  ".verify-grid .eyebrow": "verify-label", ".verify-grid h2": "verify-title", ".verify-grid > div > p:not(.eyebrow)": "verify-copy", ".comparison > div:first-child small": "not-chaotic", ".comparison .winner small": "literature",
  "#olcumler .eyebrow": "measure-label", "#olcumler h2": "measure-title", ".measurement-intro p": "measure-copy", ".data-badge": "measure-source", ".chart-title strong": "chart-title", ".chart-caption": "chart-caption", "caption": "table-caption", "th:nth-child(1)": "table-experiment", "th:nth-child(2)": "table-result", "th:nth-child(3)": "table-comment", ".chaotic-label": "table-chaotic", ".periodic-label": "table-suppressed", ".threshold-label": "table-threshold", ".measurement-footnote": "measure-note",
  ".final-cta .eyebrow": "final-label", ".final-cta h2": "final-title", ".final-cta > p:not(.eyebrow)": "final-copy", ".final-cta .button": "final-button", ".company-name": "company"
};

function setLanguage(language) {
  const dictionary = translations[language];
  Object.entries(textTargets).forEach(([selector, key]) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.innerHTML = dictionary[key];
    });
  });
  document.documentElement.lang = language;
  document.title = language === "tr" ? "EntropyHub | Dokümantasyon" : "EntropyHub | Documentation";
  languageToggle.textContent = language === "tr" ? "EN" : "TR";
  languageToggle.setAttribute("aria-label", language === "tr" ? "Switch to English" : "Türkçeye geç");
  localStorage.setItem("entropyhub-language", language);
}

languageToggle?.addEventListener("click", () => {
  setLanguage(document.documentElement.lang === "tr" ? "en" : "tr");
});
setLanguage(localStorage.getItem("entropyhub-language") === "en" ? "en" : "tr");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".copy").forEach((button) => {
  button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copy);
    if (!source) return;
    await navigator.clipboard.writeText(source.textContent);
    const original = button.textContent;
    button.textContent = "Kopyalandı ✓";
    setTimeout(() => { button.textContent = original; }, 1500);
  });
});
