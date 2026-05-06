document.addEventListener("DOMContentLoaded", () => {

    const iconos = document.querySelectorAll(".icono[data-target]");

    /* ========= SCROLL DESDE SIDEBAR ========= */
    iconos.forEach(icono => {
        icono.addEventListener("click", () => {
            const destino = document.getElementById(icono.dataset.target);

            if (destino) {
                destino.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    /* ========= INDICADORES (TODOS) ========= */
    const indicadores = document.querySelectorAll(".indicador-parallax");

    window.addEventListener("scroll", () => {

        const scrollTop = window.scrollY;
        const alturaVentana = window.innerHeight;
        const alturaDocumento = document.documentElement.scrollHeight;

        const scrollMaximo = alturaDocumento - alturaVentana;
        const progresoScroll = scrollTop / scrollMaximo;

        indicadores.forEach(indicador => {

            const linea = indicador.querySelector(".linea");
            const circulo = indicador.querySelector(".circulo");

            if (!linea || !circulo) return;

            const alturaLinea = linea.offsetHeight;
            const alturaCirculo = circulo.offsetHeight;

            const recorridoMaximo = alturaLinea - alturaCirculo;

            circulo.style.top = (progresoScroll * recorridoMaximo) + "px";
        });

    });

});