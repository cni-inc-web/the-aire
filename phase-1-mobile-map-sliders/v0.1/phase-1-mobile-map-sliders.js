window.addEventListener("load", function () {
  const groups = document.querySelectorAll('.phase-1-map_slider-group');

  groups.forEach(group => {
    const slides = group.querySelectorAll('.w-slide');
    const copies = group.querySelectorAll('.phase-1-map_slide-copy');
    const next = group.querySelector('.w-slider-arrow-right');
    const prev = group.querySelector('.w-slider-arrow-left');

    let index = 0;

    function show(i) {
      index = (i + slides.length) % slides.length;

      copies.forEach((c, j) => {
        c.style.display = j === index ? 'block' : 'none';
      });

      console.log('Active:', index);
    }

    // initial
    show(0);

    if (next) {
      next.addEventListener('click', () => {
        show(index + 1);
      });
    }

    if (prev) {
      prev.addEventListener('click', () => {
        show(index - 1);
      });
    }
  });
});