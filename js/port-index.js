document.addEventListener("DOMContentLoaded", () => {
  const INTRO_SELECTORS = [
    ".titulo-principal",
    ".subtitulo-estu",
    ".linea-decorativa",
    ".botones-contacto",
    ".slogan-vidrio",
    ".scrolldown",
    ".img-prov",
  ];

  // Una sola pasada, sin setTimeout individual por elemento
  INTRO_SELECTORS.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    // El delay se maneja en CSS con animation-delay: var(--delay)
    el.style.setProperty("--delay", `${120 + i * 120}ms`);
    // requestAnimationFrame garantiza que el navegador ya aplicó el estilo
    // antes de añadir 'show', evitando que la transición se salte
    requestAnimationFrame(() =>
      requestAnimationFrame(() => el.classList.add("show")),
    );
  });

  // Floating solo en img-prov si existe
  const imgProv = document.querySelector(".img-prov");
  if (imgProv) imgProv.classList.add("anim-floating");

  /* =========================================================
     2. REVEAL EN SCROLL — IntersectionObserver único
        Pre-lee todo el DOM una sola vez, luego observa.
     ========================================================= */
  const REVEAL_MAP = [
    { selector: ".secctitulo-acercademi", cls: ["reveal-up"] },
    { selector: ".imagenes-sobremi", cls: ["reveal-left"] },
    { selector: ".texto-sobremi", cls: ["reveal-right"] },
    { selector: ".glass-card-top", cls: ["reveal-up", "delay-1"] },
    { selector: ".glass-card-bottom", cls: ["reveal-up", "delay-2"] },
    { selector: ".encabezado-habilidad", cls: ["reveal-up"] },
    { selector: ".label-figma", cls: ["reveal-fade"] },
    { selector: ".skill-card", cls: ["reveal-scale"], autoDelay: 6 },
    { selector: ".soft-card", cls: ["reveal-up"], autoDelay: 5 },
  ];

  // Recoge todos los elementos a observar en un array plano
  const toObserve = [];

  REVEAL_MAP.forEach(({ selector, cls, autoDelay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(...cls);
      if (autoDelay) {
        el.classList.add(`delay-${(i % autoDelay) + 1}`);
      }
      toObserve.push(el);
    });
  });

  // Un único observer para todos los elementos
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target); // se auto-desconecta por elemento
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  toObserve.forEach((el) => revealObserver.observe(el));

  /* =========================================================
     3. LOTTIE — carga diferida

     ========================================================= */
  const lottieTarget = document.getElementById("anim-ui-ux");

  if (lottieTarget) {
    let lottieLoaded = false;

    const lottieObserver = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting || lottieLoaded) return;
        lottieLoaded = true;
        obs.disconnect();

        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
        script.onload = () => {
          lottie.loadAnimation({
            container: lottieTarget,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "lotties-anim/animac-roles.json",
          });
        };
        document.head.appendChild(script);
      },
      { rootMargin: "300px" },
    ); // empieza a cargar 300px antes de ser visible

    lottieObserver.observe(lottieTarget);
  }
});
