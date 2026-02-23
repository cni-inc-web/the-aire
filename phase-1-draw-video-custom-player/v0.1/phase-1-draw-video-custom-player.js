(function(){
  function loadYT(){
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve();
      const existing = document.querySelector('script[data-yt-api]');
      if (existing) {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function(){ prev && prev(); resolve(); };
        return;
      }
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      tag.dataset.ytApi = "1";
      document.head.appendChild(tag);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function(){ prev && prev(); resolve(); };
    });
  }

  const playerMap = new WeakMap();

  function showPoster(shell, pause=true){
    shell.classList.remove('is-playing');
    const player = playerMap.get(shell);
    if (player && pause) { try { player.pauseVideo(); } catch(e){} }
  }
  function hidePoster(shell){ shell.classList.add('is-playing'); }

  document.addEventListener('click', async (e) => {
    const poster = e.target.closest('.js-video-shell .video_poster');
    if (!poster) return;

    const shell = poster.closest('.js-video-shell');
    const videoId = shell?.dataset.videoId;
    if (!shell || !videoId) return;

    await loadYT();

    let player = playerMap.get(shell);
    const mount = shell.querySelector('.video_player');

    if (!player) {
      mount.innerHTML = '';
      const node = document.createElement('div');
      mount.appendChild(node);

      player = new YT.Player(node, {
        videoId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => { hidePoster(shell); player.playVideo(); },
          onStateChange: (ev) => {
            if (ev.data === YT.PlayerState.PAUSED || ev.data === YT.PlayerState.ENDED) {
              showPoster(shell, false);
            }
            if (ev.data === YT.PlayerState.PLAYING) hidePoster(shell);
          }
        }
      });

      playerMap.set(shell, player);
    } else {
      hidePoster(shell);
      try { player.playVideo(); } catch(e){}
    }
  });

  // OPTIONAL: pause the video when swiper changes slides
  // If you can access your swiper instance, call this on slide change:
  // showPoster(document.querySelector('.js-video-shell'), true);

})();