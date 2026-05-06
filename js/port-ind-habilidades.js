document.querySelectorAll('.scroll-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const direction = parseInt(button.getAttribute('data-dir'));
        const slider = document.getElementById(targetId);

        const amount = 220;
        slider.scrollBy({
            left: amount * direction,
            behavior: 'smooth'
        });
    });
});

/* arrastrar con mouse */
document.querySelectorAll('.skills-scroll').forEach(slider => {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('dragging');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('dragging');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.3;
        slider.scrollLeft = scrollLeft - walk;
    });
});
