(function () {
  // -------------------------
  // Config / selectors
  // -------------------------
  const SHELL_SELECTOR = ".js-video-shell";

  // Track YT players per shell
  const playerMap = new WeakMap();

  // -------------------------
  // Load YouTube Iframe API once
  // -------------------------
  function loadYT() {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve();

      // If it's already being loaded, just hook into ready
      const existing = document.querySelector('script[data-yt-api="1"]');
      if (existing) {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function () {
          prev && prev();
          resolve();
        };
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      tag.dataset.ytApi = "1";
      document.head.appendChild(tag);

      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        prev && prev();
        resolve();
      };
    });
  }

  // -------------------------
  // Swiper helpers
  // -------------------------
  function getSwiperForShell(shell) {
    // Swiper commonly attaches the instance to the container element as `.swiper`
    // Look for the nearest swiper container
    const swiperEl =
      shell.closest(".swiper") ||
      shell.closest(".swiper-container") ||
      shell.closest("[data-swiper]");

    if (!swiperEl) return null;

    // Swiper instance usually stored here:
    return swiperEl.swiper || null;
  }

  function setSwiperTouchMove(shell, enabled) {
    const swiper = getSwiperForShell(shell);
    if (!swiper) return;

    // Swiper supports allowTouchMove
    swiper.allowTouchMove = enabled;

    // Also stop click-prevention oddities on iOS when video is active
    // (doesn't hurt if unsupported)
    if (enabled) {
      swiper.allowClick = true;
    } else {
      swiper.allowClick = false;
    }
  }

  // Pause/reset when leaving the slide (best-effort)
  function pauseAndShowPoster(shell) {
    shell.classList.remove("is-playing");
    const player = playerMap.get(shell);
    if (player && typeof player.pauseVideo === "function") {
      try { player.pauseVideo(); } catch (e) {}
    }
    setSwiperTouchMove(shell, true);
  }

  // If Swiper is available, attach listeners so leaving slide pauses video
  function attachSwiperSlideChangeHandlers(shell) {
    const swiper = getSwiperForShell(shell);
    if (!swiper || shell.dataset.swiperHooked === "1") return;

    shell.dataset.swiperHooked = "1";

    const handler = () => pauseAndShowPoster(shell);

    // fire when user starts moving away
    swiper.on("slideChangeTransitionStart", handler);
    swiper.on("transitionStart", handler);
    swiper.on("touchStart", handler);
  }

  // -------------------------
  // Player creation + state handling
  // -------------------------
  function hidePoster(shell) {
    shell.classList.add("is-playing");
  }

  function showPoster(shell) {
    shell.classList.remove("is-playing");
  }

  function mountPlayer(shell) {
    const mount = shell.querySelector(".video_player");
    const videoId = shell.getAttribute("data-video-id");
    if (!mount || !videoId) return null;

    // Clear mount
    mount.innerHTML = "";
    const node = document.createElement("div");
    mount.appendChild(node);

    // Create YT player
    const player = new YT.Player(node, {
      videoId,
      playerVars: {
        autoplay: 1,
        playsinline: 1,
        controls: 1,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: () => {
          // Only fade poster when player is ready => smooth swap
          hidePoster(shell);

          // Important for mobile scrubbing: stop Swiper from hijacking touches
          setSwiperTouchMove(shell, false);

          // Best-effort: pause if user slides away
          attachSwiperSlideChangeHandlers(shell);

          try { player.playVideo(); } catch (e) {}
        },
        onStateChange: (ev) => {
          // 1 playing, 2 paused, 0 ended
          if (ev.data === YT.PlayerState.PLAYING) {
            hidePoster(shell);
            setSwiperTouchMove(shell, false); // lock swiper while playing
          }

          if (ev.data === YT.PlayerState.PAUSED || ev.data === YT.PlayerState.ENDED) {
            showPoster(shell);                 // show poster again
            setSwiperTouchMove(shell, true);   // unlock swiper
          }
        }
      }
    });

    // Extra: prevent touch events on player layer from bubbling to Swiper
    // Helps iOS especially.
    mount.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: true });
    mount.addEventListener("touchmove", (e) => e.stopPropagation(), { passive: true });
    mount.addEventListener("pointerdown", (e) => e.stopPropagation(), { passive: true });

    return player;
  }

  // -------------------------
  // Click handling (delegated)
  // -------------------------
  document.addEventListener("click", async (e) => {
    const poster = e.target.closest(`${SHELL_SELECTOR} .video_poster`);
    if (!poster) return;

    const shell = poster.closest(SHELL_SELECTOR);
    if (!shell) return;

    const videoId = shell.getAttribute("data-video-id");
    if (!videoId) return;

    await loadYT();

    let player = playerMap.get(shell);
    if (!player) {
      player = mountPlayer(shell);
      if (player) playerMap.set(shell, player);
    } else {
      // player already exists
      hidePoster(shell);
      setSwiperTouchMove(shell, false);
      attachSwiperSlideChangeHandlers(shell);
      try { player.playVideo(); } catch (e) {}
    }
  });

  // Optional: if you want the poster to show again when user taps outside controls,
  // you can add a second click handler here — but usually not recommended.

})();