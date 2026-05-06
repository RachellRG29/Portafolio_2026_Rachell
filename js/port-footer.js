fetch("/footer.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer-container").innerHTML = data;
        initFooter(); // 
        if (typeof aplicarIdioma === "function") {
            aplicarIdioma();
        }
    });

function initFooter() {
    const footer = document.querySelector(".footer-container");
    if (!footer) return;

    // =============================
    // SCROLL (abre y reinicia)
    // =============================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.add("abierto");
            } else {
                footer.classList.remove("abierto");
            }
        });
    }, { threshold: 0.4 });

    observer.observe(footer);

    // =============================
    // MOUSE (TU ANIMACIÓN ORIGINAL)
    // =============================
    const wrapper = footer.querySelector(".folder-wrapper");
    const icons = footer.querySelectorAll(".icon");

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

            // ✅ SOLO transform dinámico (no acumula)
            icon.style.transform = 
                `translate(${moveX / factor}px, ${moveY / factor}px)`;
        });
    });

    wrapper.addEventListener("mouseleave", () => {
        icons.forEach(icon => {
            icon.style.transform = ""; // vuelve a CSS base
        });
    });
}


