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
