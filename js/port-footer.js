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
