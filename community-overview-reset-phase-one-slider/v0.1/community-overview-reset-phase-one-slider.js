document.addEventListener('DOMContentLoaded', function () {

  const modal = document.querySelector('.community-map_popup-wrapper.is-condos-and-townhomes');
  const slider = document.querySelector('.community-map_popup-image.is-phase-one');

  if (!modal || !slider) return;

  let wasVisible = false;

  function forceResetSlider() {
    console.log('FORCING SLIDER RESET');

    const mask = slider.querySelector('.w-slider-mask');
    if (!mask) return;

    const slides = slider.querySelectorAll('.w-slide');

    // Move all slides back to starting position
    slides.forEach((slide, index) => {
      slide.style.transform = 'translateX(0px)';
    });

    // Trigger Webflow internal reflow
    slider.offsetHeight;

    // Click first dot AFTER reset
    const firstDot = slider.querySelector('.w-slider-dot');
    if (firstDot) firstDot.click();
  }

  const observer = new MutationObserver(() => {
    const isVisible = getComputedStyle(modal).opacity !== '0';

    if (isVisible && !wasVisible) {
      setTimeout(forceResetSlider, 300);
    }

    wasVisible = isVisible;
  });

  observer.observe(modal, { attributes: true, attributeFilter: ['style', 'class'] });

});