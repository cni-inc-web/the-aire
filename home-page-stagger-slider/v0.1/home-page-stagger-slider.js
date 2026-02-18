document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".staggered-slider");
  const slideInterval = 3000; // same timing for all sliders
  const stagger = 200; // 0.2s delay
  let started = false;

  const observer = new IntersectionObserver(entries => {
    if (started) return;
    if (!entries.some(e => e.isIntersecting)) return;

    started = true;

    sliders.forEach((slider, index) => {
      const next = slider.querySelector(".w-slider-arrow-right");
      if (!next) return;

      setTimeout(() => {
        setInterval(() => {
          next.click();
        }, slideInterval);
      }, index * stagger);
    });
  }, { threshold: 0.3 });

  sliders.forEach(slider => observer.observe(slider));
});