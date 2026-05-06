window.history.scrollRestoration = "manual";

const navLinks = document.querySelectorAll(".sidebar .icono");

const grupos = {
    inicio: "grupo-inicio",
    "sobre-mi": "grupo-sobremi",
    proyectos: "grupo-proyectos"
};

const allGrupos = document.querySelectorAll(".grupo");

function mostrarGrupo(nombre) {

    // ocultar todos
    allGrupos.forEach(g => g.classList.remove("grupo-activo"));

    // mostrar el seleccionado
    const grupo = document.getElementById(grupos[nombre]);
    if (grupo) grupo.classList.add("grupo-activo");

    // scroll arriba
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}

// eventos
navLinks.forEach(link => {
    link.addEventListener("click", function () {

        navLinks.forEach(item => item.classList.remove("activo"));
        this.classList.add("activo");

        const id = this.getAttribute("data-section");

        if (grupos[id]) {
            mostrarGrupo(id);
        }
    });
});

// inicio
window.addEventListener("DOMContentLoaded", () => {

    const ultimaSeccion = localStorage.getItem("ultimaSeccion");

    if (ultimaSeccion && grupos[ultimaSeccion] && ultimaSeccion !== "footer") {
        mostrarGrupo(ultimaSeccion);

        // activar icono correcto
        navLinks.forEach(item => item.classList.remove("activo"));
        const btn = document.querySelector(`.icono[data-section="${ultimaSeccion}"]`);
        if (btn) btn.classList.add("activo");

        // limpiar después de usar
        localStorage.removeItem("ultimaSeccion");

    } else {
        // comportamiento normal
        mostrarGrupo("inicio");

        const btnInicio = document.querySelector('.icono[data-section="inicio"]');
        if (btnInicio) btnInicio.classList.add("activo");
    }
});