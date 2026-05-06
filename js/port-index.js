//navegación agregar propiedad de activacion 
/*
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".sidebar .icono");

// CLICK → activar + scroll
navLinks.forEach(link => {
    link.addEventListener("click", function () {

        navLinks.forEach(item => item.classList.remove("activo"));
        this.classList.add("activo");

        const id = this.getAttribute("data-section");

        if (id) {
            document.getElementById(id).scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// SCROLL → sincronización automática
window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollY >= top - height / 3) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        const id = link.getAttribute("data-section");

        link.classList.remove("activo");

        if (id === current) {
            link.classList.add("activo");
        }
    });
});
*/

lottie.loadAnimation({
  container: document.getElementById('anim-ui-ux'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'lotties-anim/animac-roles.json'
});


document.addEventListener('DOMContentLoaded', () => {
  /* =========================
     ANIMACIONES AL CARGAR
  ========================= */
  const introElements = [
    document.querySelector('.sidebar'),
    document.querySelector('.titulo-principal'),
    document.querySelector('.subtitulo-estu'),
    document.querySelector('.linea-decorativa'),
    document.querySelector('.botones-contacto'),
    document.querySelector('.slogan-vidrio'),
    document.querySelector('.scrolldown'),
    document.querySelector('.img-prov'),
  ];

  introElements.forEach((el, index) => {
    if (!el) return;
    el.classList.add('intro-pop');
    setTimeout(() => {
      el.classList.add('show');
    }, 120 + (index * 120));
  });

  const imgProv = document.querySelector('.img-prov');
  if (imgProv) {
    setTimeout(() => {
      imgProv.classList.add('anim-floating');
    }, 1200);
  }

  /* =========================
     ELEMENTOS A REVELAR EN SCROLL
  ========================= */
  const revealMap = [
    { selector: '.secctitulo-acercademi', animation: 'reveal-up' },
    { selector: '.imagenes-sobremi', animation: 'reveal-left' },
    { selector: '.texto-sobremi', animation: 'reveal-right' },
    { selector: '.glass-card-top', animation: 'reveal-up delay-1' },
    { selector: '.glass-card-bottom', animation: 'reveal-up delay-2' },
    { selector: '.encabezado-habilidad', animation: 'reveal-up' },
    { selector: '.label-figma', animation: 'reveal-fade' },
    { selector: '.skill-card', animation: 'reveal-scale' },
    { selector: '.soft-card', animation: 'reveal-up' }
  ];

  revealMap.forEach(item => {
    document.querySelectorAll(item.selector).forEach((el, index) => {
      item.animation.split(' ').forEach(cls => el.classList.add(cls));

      /* delays automáticos para grids */
      if (item.selector === '.skill-card') {
        el.classList.add(`delay-${(index % 6) + 1 > 6 ? 6 : (index % 6) + 1}`);
      }

      if (item.selector === '.soft-card') {
        el.classList.add(`delay-${(index % 5) + 1 > 6 ? 6 : (index % 5) + 1}`);
      }
    });
  });

  /* =========================
     OBSERVER
  ========================= */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'
  ).forEach(el => observer.observe(el));
});


