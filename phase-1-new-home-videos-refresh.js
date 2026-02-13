(() => {
  const LIST_WRAPPER = '.phase-1_new-homes_collection-wrapper';
  const VIDEO_SEL = '.phase-1_new-homes_video.w-background-video video';
  const DEBOUNCE_MS = 120;

  function isVisible(el) {
    if (!el.isConnected) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  async function gentleEnsurePlaying(v, label) {
    // Only touch videos that are supposed to autoplay
    if (!(v.autoplay || v.hasAttribute('autoplay'))) return;

    // If it's already playing, leave it alone (prevents flash)
    // "paused === false" isn't perfect, so check time progression too.
    const t0 = v.currentTime;
    const wasPaused = v.paused;

    // First: just try play()
    try {
      const p = v.play();
      if (p && p.catch) await p.catch(() => {});
    } catch(e) {}

    // After a short delay, see if it actually advanced
    setTimeout(() => {
      const advanced = v.currentTime > t0 + 0.05;
      const nowPaused = v.paused;

      console.log(`[WF NO-FLASH] ${label}`, {
        id: v.id, wasPaused, nowPaused, t0, t1: v.currentTime, advanced
      });

      // If it's still stuck (paused or not advancing), do a LIGHT nudge:
      if (nowPaused || !advanced) {
        try {
          v.pause();
          // No currentTime reset (avoids visible jump)
          const p2 = v.play();
          if (p2 && p2.catch) p2.catch(() => {});
        } catch(e) {}
      }
    }, 120);
  }

  function handleChange(label) {
    const vids = Array.from(document.querySelectorAll(`${LIST_WRAPPER} ${VIDEO_SEL}`))
      .filter(isVisible);

    console.log(`[WF NO-FLASH] ${label} visible videos:`, vids.length);
    vids.forEach(v => gentleEnsurePlaying(v, label));
  }

  function initObserver() {
    const wrapper = document.querySelector(LIST_WRAPPER);
    if (!wrapper) return false;

    console.log('[WF NO-FLASH] Observer attached');

    let timer = null;
    const obs = new MutationObserver((mutations) => {
      const relevant = mutations.some(m =>
        m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)
      );
      if (!relevant) return;

      clearTimeout(timer);
      timer = setTimeout(() => {
        requestAnimationFrame(() => handleChange('mutation'));
      }, DEBOUNCE_MS);
    });

    obs.observe(wrapper, { childList: true, subtree: true });

    // Initial pass
    handleChange('initial');

    return true;
  }

  let tries = 0;
  const t = setInterval(() => {
    tries++;
    if (initObserver() || tries > 40) clearInterval(t);
  }, 250);
})();