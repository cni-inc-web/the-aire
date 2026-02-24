document.addEventListener("DOMContentLoaded", () => {

  const instances = [];

  function initSwiperBlock(block) {
    const contentEl = block.querySelector(".swiper.is-content");
    const photoEl   = block.querySelector(".swiper.is-photos");
    const nextEl    = block.querySelector(".arrow.is-right");
    const prevEl    = block.querySelector(".arrow.is-left");

    if (!contentEl || !photoEl) return;
    if (block.dataset.swiperInit === "1") return;
    block.dataset.swiperInit = "1";

    const photoSwiper = new Swiper(photoEl, {
      effect: "cards",
      grabCursor: true,
      loop: true,
      keyboard: true,
      navigation: { nextEl, prevEl },
      observer: true,
      observeParents: true
    });

    const contentSwiper = new Swiper(contentEl, {
      speed: 0,
      loop: true,
      followFinger: false,
      effect: "fade",
      fadeEffect: { crossFade: true },
      observer: true,
      observeParents: true
    });

    photoSwiper.controller.control = contentSwiper;
    contentSwiper.controller.control = photoSwiper;

    instances.push({ block, photoSwiper, contentSwiper });
  }

  document.querySelectorAll(".swiper-instance").forEach(initSwiperBlock);

  function updateSwipersIn(scope) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        instances.forEach(({ block, photoSwiper, contentSwiper }) => {
          if (!scope.contains(block)) return;

          photoSwiper.update();
          contentSwiper.update();

          photoSwiper.slideToLoop(photoSwiper.realIndex ?? 0, 0, false);
          contentSwiper.slideToLoop(contentSwiper.realIndex ?? 0, 0, false);
        });

        window.dispatchEvent(new Event("resize"));
      });
    });
  }

  document.querySelectorAll(".w-tab-link").forEach((tabLink) => {
    tabLink.addEventListener("click", () => {
      const tabs = tabLink.closest(".w-tabs");
      if (!tabs) return;

      setTimeout(() => {
        const activePane = tabs.querySelector(".w-tab-pane.w--tab-active");
        if (activePane) updateSwipersIn(activePane);
      }, 0);
    });
  });

});