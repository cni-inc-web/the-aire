document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".swiper-instance").forEach(block => {

    const contentEl = block.querySelector(".swiper.is-content");
    const photoEl   = block.querySelector(".swiper.is-photos");
    const nextEl    = block.querySelector(".arrow.is-right");
    const prevEl    = block.querySelector(".arrow.is-left");

    if (!contentEl || !photoEl) return;

    const photoSwiper = new Swiper(photoEl, {
      effect: "cards",
      grabCursor: true,
      loop: true,
      keyboard: true,
      navigation: {
        nextEl,
        prevEl
      }
    });

    const contentSwiper = new Swiper(contentEl, {
      speed: 0,
      loop: true,
      followFinger: false,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      }
    });

    // 🔗 Sync only this pair
    photoSwiper.controller.control = contentSwiper;
    contentSwiper.controller.control = photoSwiper;

  });

});