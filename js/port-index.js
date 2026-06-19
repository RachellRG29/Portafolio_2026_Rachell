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
});



/* =========================================================
  NAVEGACIÓN
    ========================================================= */

window.history.scrollRestoration = "manual";

const navLinks = document.querySelectorAll(".sidebar .icono");

const grupos = {
  inicio: "grupo-inicio",
  "sobre-mi": "grupo-sobremi",
  proyectos: "grupo-proyectos",
  certificados: "grupo-certificados",
  contacto: "grupo-contacto",
};

const allGrupos = document.querySelectorAll(".grupo");

// Guardar referencia al grupo activo para evitar recorrer todos cada vez
let grupoActivo = document.querySelector(".grupo.grupo-activo");

function mostrarGrupo(nombre) {
  const nuevoGrupo = document.getElementById(grupos[nombre]);

  if (!nuevoGrupo || nuevoGrupo === grupoActivo) return;

  // Ocultar únicamente el grupo activo
  if (grupoActivo) {
    grupoActivo.classList.remove("grupo-activo");
  }

  // Mostrar el nuevo
  nuevoGrupo.classList.add("grupo-activo");
  grupoActivo = nuevoGrupo;

  // Hacer scroll en el siguiente frame
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
}

// Eventos de navegación
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("activo"));
    link.classList.add("activo");

    const id = link.dataset.section;

    if (grupos[id]) {
      mostrarGrupo(id);
    }
  });
});

// Inicialización
window.addEventListener("DOMContentLoaded", () => {
  const ultimaSeccion = localStorage.getItem("ultimaSeccion");

  const seccionInicial =
    ultimaSeccion && grupos[ultimaSeccion] && ultimaSeccion !== "footer"
      ? ultimaSeccion
      : "inicio";

  mostrarGrupo(seccionInicial);

  navLinks.forEach((item) => {
    item.classList.toggle("activo", item.dataset.section === seccionInicial);
  });

  localStorage.removeItem("ultimaSeccion");
});


/* =========================================================
  FOOTER
    ========================================================= */
// =============================
// OBTENER RUTA BASE DEL REPO
function obtenerRutaFooter() {
  const path = window.location.pathname;

  const partes = path.split("/").filter(Boolean);

  const primeraParte = partes[0] || "";
  const esArchivo = primeraParte.includes(".");

  if (esArchivo || partes.length === 0) {
    return "/footer.html";
  }

  const repo = primeraParte;
  return `/${repo}/footer.html`;
}

// CARGAR FOOTER
fetch(obtenerRutaFooter())
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  })
  .then((data) => {
    const container = document.getElementById("footer-container");
    if (!container) return;

    const limpio = data.replace(
      /<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi,
      "",
    );

    container.innerHTML = limpio;

    // CORREGIR RUTAS DE IMÁGENES AUTOMÁTICAMENTE
    const pathPartes = window.location.pathname.split("/").filter(Boolean);
    const primeraParte = pathPartes[0] || "";
    const hayRepo = primeraParte && !primeraParte.includes(".");
    const repo = hayRepo ? primeraParte : "";

    container.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      // Solo modifica rutas relativas sin prefijo de repo
      if (src && !src.startsWith("http") && !src.startsWith("/") && repo) {
        img.src = `/${repo}/${src}`;
      }
    });

    initFooter();

    if (typeof aplicarIdioma === "function") {
      aplicarIdioma();
    }
  })
  .catch((err) => {
    console.error("Error cargando footer:", err);
  });

// FUNCIONES FOOTER
function initFooter() {
  const footer = document.querySelector(".footer-container");
  if (!footer) return;

  // SCROLL: abre al entrar en viewport, cierra al salir
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.add("abierto");
        } else {
          footer.classList.remove("abierto");
        }
      });
    },
    { threshold: 0.4 },
  );
  observer.observe(footer);

  // MOUSE ANIMATION en la carpeta
  const wrapper = footer.querySelector(".folder-wrapper");
  const icons = footer.querySelectorAll(".icon");

  if (!wrapper) return;

  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const moveX = (x - centerX) / 10;
    const moveY = (y - centerY) / 10;

    icons.forEach((icon, index) => {
      const factor = (index + 1) * 2;
      icon.style.transform = `translate(${moveX / factor}px, ${moveY / factor}px)`;
    });
  });

  wrapper.addEventListener("mouseleave", () => {
    icons.forEach((icon) => {
      icon.style.transform = "";
    });
  });
}
