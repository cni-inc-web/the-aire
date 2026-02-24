document.addEventListener("DOMContentLoaded", () => {

  // store instances so we can update them on tab switches
  const instances = [];

  function initSwiperBlock(block) {
    const contentEl = block.querySelector(".swiper.is-content");
    const photoEl   = block.querySelector(".swiper.is-photos");
    const nextEl    = block.querySelector(".arrow.is-right");
    const prevEl    = block.querySelector(".arrow.is-left");

    if (!contentEl || !photoEl) return;

    // prevent double-init if Webflow re-renders anything
    if (block.dataset.swiperInit === "1") return;
    block.dataset.swiperInit = "1";

    const photoSwiper = new Swiper(photoEl, {
      effect: "cards",
      grabCursor: true,
      loop: true,
      keyboard: true,
      navigation: { nextEl, prevEl },

      // ✅ important for hidden/visible parent changes
      observer: true,
      observeParents: true,
    });

    const contentSwiper = new Swiper(contentEl, {
      speed: 0,
      loop: true,
      followFinger: false,
      effect: "fade",
      fadeEffect: { crossFade: true },

      // ✅ important for hidden/visible parent changes
      observer: true,
      observeParents: true,
    });

    // 🔗 Sync only this pair
    photoSwiper.controller.control = contentSwiper;
    contentSwiper.controller.control = photoSwiper;

    instances.push({ block, photoSwiper, contentSwiper });
  }

  // init all blocks on load (including the default active tab)
  document.querySelectorAll(".swiper-instance").forEach(initSwiperBlock);

  function updateSwipersIn(scope) {
    // after tab pane becomes visible, force Swiper to recalc
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        instances.forEach(({ block, photoSwiper, contentSwiper }) => {
          if (!scope.contains(block)) return;

          photoSwiper.update();
          contentSwiper.update();

          // snap to active index without animation to "reveal" correctly
          photoSwiper.slideToLoop(photoSwiper.realIndex, 0, false);
          contentSwiper.slideToLoop(contentSwiper.realIndex, 0, false);
        });
      });
    });
  }

  // Webflow tabs: update when user switches tabs
  document.querySelectorAll(".w-tab-link").forEach((tabLink) => {
    tabLink.addEventListener("click", () => {
      const tabs = tabLink.closest(".w-tabs");
      if (!tabs) return;

      // give Webflow a moment to apply .w--tab-active
      setTimeout(() => {
        const activePane = tabs.querySelector(".w-tab-pane.w--tab-active");
        if (activePane) updateSwipersIn(activePane);
      }, 0);
    });
  });

});