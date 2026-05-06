const btn = document.getElementById("btnIdioma");
const btnCV = document.getElementById("btnCV");

let idioma = localStorage.getItem("idioma") || "es";

function aplicarIdioma() {
    // Cambia el atributo lang del HTML
    document.documentElement.lang = idioma;

    // Cambia texto del botón de idioma
    if (btn) {
        btn.textContent = idioma.toUpperCase();
    }

    // Traduce todos los elementos con data-es / data-en
    document.querySelectorAll("[data-es]").forEach(el => {
        const texto = el.getAttribute(`data-${idioma}`);
        if (texto) {
            el.innerHTML = texto;
        }
    });

    // Cambia el CV según idioma
    if (btnCV) {
        if (idioma === "es") {
            btnCV.href = "curriculum-vitae/Cindy_Ramirez_UXUI_FrontEnd_2026-ES.pdf";
        } if (idioma=== "en") {
            btnCV.href = "curriculum-vitae/Cindy_Ramirez_UXUI_FrontEnd_2026-EN.pdf";
        }
    }
}

// Ejecutar al cargar
aplicarIdioma();

// Evento click para cambiar idioma
if (btn) {
    btn.addEventListener("click", () => {
        idioma = idioma === "es" ? "en" : "es";
        localStorage.setItem("idioma", idioma);
        aplicarIdioma();
    });
}