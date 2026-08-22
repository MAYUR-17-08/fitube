const fs = require('fs');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Fitube</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root { --bg: #09090b; --card-bg: #141417; --card-hover: #222228; --accent: #1ed760; --text: #ffffff; --text-muted: #8b8b99; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-tap-highlight-color: transparent; }
    body { background-color: var(--bg); color: var(--text); height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    
    .top-nav { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 12px 20px; }
    .nav-title { font-size: 26px; font-weight: 800; }
    .top-actions { display: flex; gap: 8px; }
    .icon-btn { width: 40px; height: 40px; border-radius: 50%; background: #1c1c22; border: 1px solid #282832; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 15px; cursor: pointer; }
    
    .main-view { flex: 1; overflow-y: auto; padding-bottom: 140px; scrollbar-width: none; }
    .main-view::-webkit-scrollbar { display: none; }
    .page-tab { display: none; }
    .page-tab.active-tab { display: block; }
    
    .banner-carousel { display: flex; gap: 14px; padding: 6px 20px 20px 20px; overflow-x: auto; scrollbar-width: none; }
    .banner-card { flex: 0 0 78vw; max-width: 320px; height: 180px; border-radius: 20px; position: relative; overflow: hidden; cursor: pointer; }
    .banner-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.75); }
    .banner-content { position: absolute; inset: 0; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%); }
    .banner-tag { align-self: flex-start; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; }
    .banner-title { font-size: 19px; font-weight: 800; }
    .banner-sub { font-size: 12px; color: #cfcfd8; }
    
    .recently-container { display: flex; padding: 0 20px; margin-bottom: 22px; }
    .vertical-label { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 16px; font-weight: 800; margin-right: 14px; }
    .recent-grid { flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .recent-item { display: flex; align-items: center; gap: 10px; background: var(--card-bg); padding: 7px; border-radius: 12px; cursor: pointer; border: 1px solid #1f1f26; }
    .recent-img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
    .recent-title { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .recent-artist { font-size: 11px; color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .section-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px 10px 20px; font-size: 18px; font-weight: 800; }
    .horizontal-scroll { display: flex; gap: 12px; padding: 0 20px 10px 20px; overflow-x: auto; scrollbar-width: none; }
    .card-item { flex: 0 0 135px; cursor: pointer; }
    .card-img-box { position: relative; width: 135px; height: 135px; border-radius: 16px; overflow: hidden; }
    .card-img-box img { width: 100%; height: 100%; object-fit: cover; }
    .card-play-badge { position: absolute; bottom: 8px; right: 8px; width: 30px; height: 30px; border-radius: 50%; background: var(--accent); color: #000; display: flex; align-items: center; justify-content: center; font-size: 12px; }
    .card-title { font-size: 13px; font-weight: 700; margin-top: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-artist { font-size: 11px; color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .search-wrapper { padding: 4px 20px 14px 20px; }
    .search-bar { position: relative; width: 100%; display: flex; align-items: center; }
    .search-bar i { position: absolute; left: 16px; color: var(--text-muted); font-size: 15px; }
    .search-input-field { width: 100%; padding: 13px 14px 13px 44px; border-radius: 16px; border: 1px solid #22222c; background: #15151a; color: #fff; font-size: 15px; outline: none; }
    .search-input-field:focus { border-color: var(--accent); }
    .track-list { display: flex; flex-direction: column; gap: 6px; padding: 0 20px; }
    .track-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; background: var(--card-bg); border: 1px solid #1a1a22; border-radius: 14px; cursor: pointer; }
    .track-info-box { display: flex; align-items: center; gap: 12px; overflow: hidden; flex: 1; }
    .track-row img { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
    .track-row-title { font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .track-row-artist { font-size: 12px; color: var(--text-muted); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .create-playlist-btn { display: flex; align-items: center; gap: 12px; padding: 12px; background: #1c1c24; border: 1px dashed var(--accent); border-radius: 14px; margin-bottom: 14px; cursor: pointer; color: #fff; }
    .playlist-folder { display: flex; align-items: center; justify-content: space-between; background: var(--card-bg); padding: 12px 14px; border-radius: 14px; margin-bottom: 8px; cursor: pointer; border: 1px solid #22222c; }

    .mini-dock { position: fixed; bottom: 76px; left: 14px; right: 14px; background: rgba(26, 26, 32, 0.95); backdrop-filter: blur(20px); border: 1px solid #2a2a36; border-radius: 16px; padding: 7px 12px; display: none; align-items: center; justify-content: space-between; z-index: 90; cursor: pointer; }
    .mini-info { display: flex; align-items: center; gap: 10px; overflow: hidden; flex: 1; }
    .mini-info img { width: 42px; height: 42px; border-radius: 10px; object-fit: cover; }
    .mini-title { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mini-artist { font-size: 11px; color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mini-btns { display: flex; align-items: center; gap: 12px; }
    .mini-play-btn { width: 34px; height: 34px; border-radius: 50%; background: #fff; color: #000; border: none; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; }
    
    .bottom-navbar { position: fixed; bottom: 12px; left: 20px; right: 20px; height: 58px; background: rgba(18, 18, 22, 0.92); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.08); border-radius: 30px; display: flex; align-items: center; justify-content: space-around; z-index: 100; }
    .nav-item { color: #828292; font-size: 18px; border: none; background: transparent; display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 20px; cursor: pointer; }
    .nav-item.active { background: #262630; color: #fff; font-size: 14px; font-weight: 700; }
    .nav-item span { display: none; }
    .nav-item.active span { display: inline-block; }
    
    .full-player-modal { position: fixed; inset: 0; background: linear-gradient(180deg, #22222c 0%, #0c0c10 100%); z-index: 300; display: none; flex-direction: column; justify-content: space-between; padding: 26px 24px 38px 24px; }
    .player-artwork-box { display: flex; justify-content: center; align-items: center; margin: 20px 0; }
    .player-artwork { width: 80vw; height: 80vw; max-width: 320px; max-height: 320px; border-radius: 24px; object-fit: cover; }
    .player-title { font-size: 22px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .player-artist { font-size: 15px; color: var(--text-muted); margin-top: 4px; }
    .seek-bar { width: 100%; height: 5px; background: #353542; border-radius: 3px; cursor: pointer; position: relative; margin-top: 22px; }
    .seek-fill { height: 100%; width: 0%; background: #fff; border-radius: 3px; }
    .time-labels { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-top: 8px; }
    .player-controls-row { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; }
    .player-big-btn { width: 68px; height: 68px; border-radius: 50%; background: #fff; color: #000; border: none; display: flex; align-items: center; justify-content: center; font-size: 26px; cursor: pointer; }
    .player-icon-btn { font-size: 24px; color: #fff; background: transparent; border: none; cursor: pointer; }
    
    .queue-modal { position: fixed; inset: 0; background: rgba(9, 9, 11, 0.96); backdrop-filter: blur(25px); z-index: 350; display: none; flex-direction: column; padding: 20px; }
    .queue-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 20px; font-weight: 800; }
    .queue-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-bottom: 20px; }
    .queue-item { display: flex; align-items: center; justify-content: space-between; background: var(--card-bg); border: 1px solid #22222a; padding: 10px 12px; border-radius: 14px; }
    .queue-item-info { display: flex; align-items: center; gap: 10px; overflow: hidden; flex: 1; cursor: pointer; }
    .queue-item-info img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
    .queue-order-btns { display: flex; gap: 6px; margin-left: 10px; }
    .order-btn { width: 32px; height: 32px; border-radius: 50%; background: #22222c; border: none; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; }

    .eq-modal { position: fixed; inset: 0; background: rgba(9, 9, 11, 0.96); backdrop-filter: blur(25px); z-index: 360; display: none; flex-direction: column; padding: 24px 20px; }
    .eq-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .eq-presets-bar { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; margin-bottom: 24px; }
    .eq-preset-chip { padding: 8px 16px; border-radius: 20px; background: #1c1c24; border: 1px solid #282834; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; white-space: nowrap; }
    .eq-preset-chip.active { background: var(--accent); color: #000; border-color: var(--accent); }
    .eq-sliders-grid { display: flex; justify-content: space-around; align-items: center; flex: 1; margin: 20px 0; }
    .eq-slider-col { display: flex; flex-direction: column; align-items: center; gap: 14px; height: 220px; }
    .eq-range { -webkit-appearance: slider-vertical; width: 8px; height: 160px; accent-color: var(--accent); background: #22222c; border-radius: 4px; outline: none; }
    .eq-freq-label { font-size: 12px; font-weight: 700; color: var(--text-muted); }

    /* Active Background Player Frame (Invisible yet Rendered for Browser Autoplay Policy) */
    #player-mount-point { position: fixed; bottom: 0; right: 0; width: 16px; height: 16px; opacity: 0.01; pointer-events: none; z-index: 1; }
  </style>
</head>
<body>

  <div class="top-nav">
    <div class="nav-title" id="page-title">Discover</div>
    <div class="top-actions">
      <button class="icon-btn" onclick="openEqualizerModal()"><i class="fa-solid fa-sliders"></i></button>
      <button class="icon-btn" onclick="openQueueModal()"><i class="fa-solid fa-list-ol"></i></button>
    </div>
  </div>

  <div class="main-view">
    <!-- Tab 1: Discover -->
    <div class="page-tab active-tab" id="tab-discover">
      <div class="banner-carousel" id="banner-list"></div>
      <div class="recently-container"><div class="vertical-label">Recently</div><div class="recent-grid" id="recently-grid"></div></div>
      <div class="section-header"><span>Top Trending Hits 🔥</span></div><div class="horizontal-scroll" id="trending-scroll"></div>
      <div class="section-header"><span>Indie Acoustic Vibes 🎸</span></div><div class="horizontal-scroll" id="indie-scroll"></div>
      <div class="section-header"><span>Rain Therapy 🍀🌧️</span></div><div class="horizontal-scroll" id="rain-scroll"></div>
      <div class="section-header"><span>Late Night Chill 🌙</span></div><div class="horizontal-scroll" id="latenight-scroll"></div>
    </div>

    <!-- Tab 2: Search -->
    <div class="page-tab" id="tab-search">
      <div class="search-wrapper"><div class="search-bar"><i class="fa-solid fa-magnifying-glass"></i><input type="text" id="global-search-input" class="search-input-field" placeholder="Search songs, artists..." /></div></div>
      <div class="track-list" id="search-results-list"><p style="color:var(--text-muted); font-size:14px; text-align:center; margin-top:30px;">Type any song to stream instantly...</p></div>
    </div>

    <!-- Tab 3: Playlists -->
    <div class="page-tab" id="tab-library" style="padding: 0 20px;">
      <div class="create-playlist-btn" onclick="createNewPlaylist()"><i class="fa-solid fa-plus" style="color:var(--accent); font-size:18px;"></i><div style="font-weight:700; font-size:15px;">Create New Playlist</div></div>
      <div id="custom-playlists-container"></div>
      <div class="section-header" style="padding: 14px 0 10px 0;"><span>Liked Songs ❤️</span></div>
      <div class="track-list" id="library-list" style="padding:0;"><p style="color:var(--text-muted); font-size:14px; text-align:center; margin-top:10px;">Songs you like will appear here.</p></div>
    </div>
  </div>

  <!-- Mini Dock -->
  <div class="mini-dock" id="mini-dock" onclick="openFullPlayer()">
    <div class="mini-info"><img id="dock-img" src="" /><div><div class="mini-title" id="dock-title">Track</div><div class="mini-artist" id="dock-artist">Artist</div></div></div>
    <div class="mini-btns">
      <button class="icon-btn" style="border:none; background:transparent;" onclick="event.stopPropagation(); toggleFavoriteForSong(currentSong);"><i class="fa-regular fa-heart" id="dock-like-btn"></i></button>
      <button class="mini-play-btn" onclick="event.stopPropagation(); togglePlay();"><i class="fa-solid fa-play" id="dock-play-icon"></i></button>
      <button class="icon-btn" style="border:none; background:transparent;" onclick="event.stopPropagation(); playNextInQueue();"><i class="fa-solid fa-forward-step"></i></button>
    </div>
  </div>

  <!-- Bottom Navbar -->
  <div class="bottom-navbar">
    <button class="nav-item active" onclick="switchTab('discover', this)"><i class="fa-solid fa-house"></i><span>Home</span></button>
    <button class="nav-item" onclick="switchTab('search', this)"><i class="fa-solid fa-magnifying-glass"></i><span>Search</span></button>
    <button class="nav-item" onclick="switchTab('library', this)"><i class="fa-solid fa-book-open"></i><span>Playlists</span></button>
  </div>

  <!-- Full Screen Modal Player -->
  <div class="full-player-modal" id="full-player-modal">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <button class="icon-btn" onclick="closeFullPlayer()"><i class="fa-solid fa-chevron-down"></i></button>
      <div style="font-size:11px; font-weight:800; color:var(--text-muted);">NOW PLAYING</div>
      <div style="display:flex; gap:8px;"><button class="icon-btn" onclick="openEqualizerModal()"><i class="fa-solid fa-sliders"></i></button><button class="icon-btn" onclick="openQueueModal()"><i class="fa-solid fa-list-ol"></i></button></div>
    </div>
    <div class="player-artwork-box"><img id="full-art" class="player-artwork" src="" /></div>
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="overflow:hidden; flex:1;"><div class="player-title" id="full-title">Song Title</div><div class="player-artist" id="full-artist">Artist</div></div>
        <div style="display:flex; gap:10px;"><button class="icon-btn" style="border:none; background:transparent; font-size:20px;" onclick="addCurrentSongToPlaylistModal()"><i class="fa-solid fa-folder-plus"></i></button><button class="icon-btn" style="border:none; background:transparent; font-size:20px;" onclick="toggleFavoriteForSong(currentSong)"><i class="fa-regular fa-heart" id="full-like-btn"></i></button></div>
      </div>
      <div class="seek-bar" onclick="seekAudio(event)" id="seek-container"><div class="seek-fill" id="seek-fill"></div></div>
      <div class="time-labels"><span id="curr-time">0:00</span><span id="total-time">0:00</span></div>
      <div class="player-controls-row"><button class="player-icon-btn" onclick="seekRelative(-10)"><i class="fa-solid fa-rotate-left"></i></button><button class="player-big-btn" onclick="togglePlay()"><i class="fa-solid fa-play" id="full-play-icon"></i></button><button class="player-icon-btn" onclick="playNextInQueue()"><i class="fa-solid fa-forward-step"></i></button></div>
    </div>
  </div>

  <div class="queue-modal" id="queue-modal">
    <div class="queue-header"><span>Upcoming Vibe Queue</span><button class="icon-btn" onclick="closeQueueModal()"><i class="fa-solid fa-xmark"></i></button></div>
    <div class="queue-list" id="queue-items-container"></div>
  </div>

  <div class="eq-modal" id="eq-modal">
    <div class="eq-header"><div style="font-size:20px; font-weight:800;">Sound Equalizer & Bass</div><button class="icon-btn" onclick="closeEqualizerModal()"><i class="fa-solid fa-xmark"></i></button></div>
    <div class="eq-presets-bar">
      <div class="eq-preset-chip active" onclick="applyEqPreset('flat', this)">Flat</div>
      <div class="eq-preset-chip" onclick="applyEqPreset('bass', this)">Bass Boost 🔥</div>
      <div class="eq-preset-chip" onclick="applyEqPreset('vocal', this)">Vocal Boost 🎤</div>
      <div class="eq-preset-chip" onclick="applyEqPreset('pop', this)">Pop & Dance 💃</div>
      <div class="eq-preset-chip" onclick="applyEqPreset('rock', this)">Rock 🎸</div>
    </div>
    <div class="eq-sliders-grid">
      <div class="eq-slider-col"><input type="range" class="eq-range" min="-12" max="12" value="0" id="eq-band-0" oninput="updateEqBand(0, this.value)"><span class="eq-freq-label">60Hz</span></div>
      <div class="eq-slider-col"><input type="range" class="eq-range" min="-12" max="12" value="0" id="eq-band-1" oninput="updateEqBand(1, this.value)"><span class="eq-freq-label">230Hz</span></div>
      <div class="eq-slider-col"><input type="range" class="eq-range" min="-12" max="12" value="0" id="eq-band-2" oninput="updateEqBand(2, this.value)"><span class="eq-freq-label">910Hz</span></div>
      <div class="eq-slider-col"><input type="range" class="eq-range" min="-12" max="12" value="0" id="eq-band-3" oninput="updateEqBand(3, this.value)"><span class="eq-freq-label">4kHz</span></div>
      <div class="eq-slider-col"><input type="range" class="eq-range" min="-12" max="12" value="0" id="eq-band-4" oninput="updateEqBand(4, this.value)"><span class="eq-freq-label">14kHz</span></div>
    </div>
  </div>

  <div id="player-mount-point"></div>
  <script src="https://www.youtube.com/iframe_api"></script>
  <script>
    let ytPlayer=null, currentSong=null, songQueue=[], searchDebounce=null, ticker=null;
    let favorites=JSON.parse(localStorage.getItem('fitube_favs')||'[]');
    let recentHistory=JSON.parse(localStorage.getItem('fitube_recents')||'[]');
    let userPlaylists=JSON.parse(localStorage.getItem('fitube_custom_playlists')||'[]');
    let audioCtx=null, eqFilters=[];
    const eqFrequencies = [60, 230, 910, 4000, 14000];
    const eqPresets = { flat: [0, 0, 0, 0, 0], bass: [10, 7, 2, 0, -1], vocal: [-2, 1, 6, 4, 1], pop: [5, 3, 0, 4, 6], rock: [7, 4, -1, 3, 7] };

    function initAudioEqualizer() {
      if (audioCtx) return;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        eqFilters = eqFrequencies.map((freq, idx) => {
          const filter = audioCtx.createBiquadFilter();
          filter.type = idx === 0 ? 'lowshelf' : (idx === eqFrequencies.length - 1 ? 'highshelf' : 'peaking');
          filter.frequency.value = freq;
          filter.gain.value = 0;
          return filter;
        });
        for (let i = 0; i < eqFilters.length - 1; i++) { eqFilters[i].connect(eqFilters[i + 1]); }
        eqFilters[eqFilters.length - 1].connect(audioCtx.destination);
      } catch(e) {}
    }

    function updateEqBand(index, gainValue) {
      initAudioEqualizer();
      if (eqFilters[index]) eqFilters[index].gain.value = parseFloat(gainValue);
      document.querySelectorAll('.eq-preset-chip').forEach(c => c.classList.remove('active'));
    }

    function applyEqPreset(name, chipElement) {
      initAudioEqualizer();
      const presetValues = eqPresets[name] || eqPresets.flat;
      presetValues.forEach((val, idx) => {
        if (eqFilters[idx]) eqFilters[idx].gain.value = val;
        const slider = document.getElementById('eq-band-' + idx);
        if (slider) slider.value = val;
      });
      document.querySelectorAll('.eq-preset-chip').forEach(c => c.classList.remove('active'));
      if (chipElement) chipElement.classList.add('active');
    }

    function openEqualizerModal() { document.getElementById('eq-modal').style.display = 'flex'; }
    function closeEqualizerModal() { document.getElementById('eq-modal').style.display = 'none'; }

    function onYouTubeIframeAPIReady() {
      ytPlayer = new YT.Player('player-mount-point', {
        height: '16', width: '16', playerVars: { autoplay: 1, controls: 0, playsinline: 1, origin: window.location.origin },
        events: {
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) { updatePlayState(true); startTicker(); }
            else if (e.data === YT.PlayerState.PAUSED) { updatePlayState(false); clearInterval(ticker); }
            else if (e.data === YT.PlayerState.ENDED) { playNextInQueue(); }
          },
          onError: (e) => {
            console.warn('Playback retry fallback trigger');
            playNextInQueue();
          }
        }
      });
    }

    async function loadDiscoverFeed() {
      try {
        const res = await fetch('/api/discover');
        const data = await res.json();
        document.getElementById('banner-list').innerHTML = (data.banners || []).map(b => '<div class="banner-card" onclick="quickSearch(\'' + b.query + '\')"><img class="banner-img" src="' + b.image + '" /><div class="banner-content"><div class="banner-tag">' + b.tag + '</div><div><div class="banner-title">' + b.title + '</div><div class="banner-sub">' + b.subtitle + '</div></div></div></div>').join('');
        const recentDisplay = recentHistory.length ? recentHistory.slice(0, 6) : (data.trending || []).slice(0, 6);
        document.getElementById('recently-grid').innerHTML = recentDisplay.map(s => '<div class="recent-item" onclick=\'playSongDirect(' + JSON.stringify(s).replace(/'/g, "&apos;") + ')\'><img class="recent-img" src="' + s.thumbnail + '" /><div class="recent-details"><div class="recent-title">' + s.title + '</div><div class="recent-artist">' + s.artist + '</div></div></div>').join('');
        const renderScroll = (elementId, list) => {
          document.getElementById(elementId).innerHTML = (list || []).map(s => '<div class="card-item" onclick=\'playSongDirect(' + JSON.stringify(s).replace(/'/g, "&apos;") + ')\'><div class="card-img-box"><img src="' + s.thumbnail + '" /><div class="card-play-badge"><i class="fa-solid fa-play"></i></div></div><div class="card-title">' + s.title + '</div><div class="card-artist">' + s.artist + '</div></div>').join('');
        };
        renderScroll('trending-scroll', data.trending);
        renderScroll('indie-scroll', data.indieChill);
        renderScroll('rain-scroll', data.rainTherapy);
        renderScroll('latenight-scroll', data.lateNight);
      } catch (err) {}
    }

    function switchTab(tab, btn) {
      document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active-tab'));
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active-tab');
      document.getElementById('page-title').innerText = tab.charAt(0).toUpperCase() + tab.slice(1);
      if (tab === 'library') renderLibrary();
      if (tab === 'search') document.getElementById('global-search-input').focus();
    }

    function quickSearch(q) {
      switchTab('search', document.querySelectorAll('.nav-item')[1]);
      document.getElementById('global-search-input').value = q;
      performSearch(q);
    }

    document.getElementById('global-search-input').addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      const q = e.target.value;
      if (!q || !q.trim()) {
        document.getElementById('search-results-list').innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin-top:30px;">Type any song to stream instantly...</p>';
        return;
      }
      searchDebounce = setTimeout(() => performSearch(q.trim()), 200);
    });

    async function performSearch(q) {
      const container = document.getElementById('search-results-list');
      container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin-top:30px;"><i class="fa-solid fa-spinner fa-spin"></i> Searching...</p>';
      try {
        const res = await fetch('/api/search?q=' + encodeURIComponent(q));
        const songs = await res.json();
        if (!songs || !songs.length) { container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin-top:30px;">No results found for "' + q + '"</p>'; return; }
        container.innerHTML = songs.map(s => {
          const isFav = favorites.some(f => f.id === s.id);
          return '<div class="track-row" onclick=\'playSongDirect(' + JSON.stringify(s).replace(/'/g, "&apos;") + ')\'><div class="track-info-box"><img src="' + s.thumbnail + '" /><div class="track-texts"><div class="track-row-title">' + s.title + '</div><div class="track-row-artist">' + s.artist + ' ' + (s.duration ? '• ' + s.duration : '') + '</div></div></div><div style="display:flex; align-items:center; gap:12px;"><i class="' + (isFav ? 'fa-solid' : 'fa-regular') + ' fa-heart" style="color:' + (isFav ? '#ff4d4d' : '#8b8b99') + '; font-size:16px; padding:6px;" onclick=\'event.stopPropagation(); toggleFavoriteForSong(' + JSON.stringify(s).replace(/'/g, "&apos;") + ')\'></i><i class="fa-solid fa-play" style="color:var(--accent); font-size:14px;"></i></div></div>';
        }).join('');
      } catch (err) { container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin-top:30px;">Failed to fetch results.</p>'; }
    }

    function playSongDirect(song, preserveQueue = false) {
      currentSong = song;
      recentHistory = [song, ...recentHistory.filter(s => s.id !== song.id)].slice(0, 10);
      localStorage.setItem('fitube_recents', JSON.stringify(recentHistory));

      document.getElementById('mini-dock').style.display = 'flex';
      document.getElementById('dock-img').src = song.thumbnail;
      document.getElementById('dock-title').innerText = song.title;
      document.getElementById('dock-artist').innerText = song.artist;

      document.getElementById('full-art').src = song.thumbnail;
      document.getElementById('full-title').innerText = song.title;
      document.getElementById('full-artist').innerText = song.artist;

      updateLikeButtons();

      if (ytPlayer && ytPlayer.loadVideoById) {
        ytPlayer.loadVideoById({ videoId: song.id, startSeconds: 0 });
        ytPlayer.playVideo();
      }

      if (!preserveQueue) { songQueue = []; refillQueue(song); } else { renderQueue(); }

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: song.title, artist: song.artist, artwork: [{ src: song.thumbnail, sizes: '512x512', type: 'image/jpeg' }] });
        navigator.mediaSession.setActionHandler('play', () => togglePlay());
        navigator.mediaSession.setActionHandler('pause', () => togglePlay());
        navigator.mediaSession.setActionHandler('nexttrack', () => playNextInQueue());
      }
    }

    async function refillQueue(song) {
      try {
        const res = await fetch('/api/vibe-next?artist=' + encodeURIComponent(song.artist) + '&title=' + encodeURIComponent(song.title) + '&currentId=' + song.id);
        const list = await res.json();
        const existingIds = new Set([song.id, ...songQueue.map(s => s.id)]);
        songQueue = [...songQueue, ...list.filter(item => !existingIds.has(item.id))];
        renderQueue();
      } catch (e) {}
    }

    function playNextInQueue() {
      if (songQueue.length > 0) {
        playSongDirect(songQueue.shift(), true);
      } else if (currentSong) {
        refillQueue(currentSong).then(() => { if (songQueue.length > 0) playSongDirect(songQueue.shift(), true); });
      }
    }

    function renderQueue() {
      const container = document.getElementById('queue-items-container');
      if (!songQueue || !songQueue.length) { container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin-top:40px;">Curating matching vibe queue...</p>'; return; }
      container.innerHTML = songQueue.map((s, idx) => '<div class="queue-item"><div class="queue-item-info" onclick=\'playFromQueueIndex(' + idx + ')\'><img src="' + s.thumbnail + '" /><div style="overflow:hidden;"><div style="font-size:13px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + (idx + 1) + '. ' + s.title + '</div><div style="font-size:11px; color:var(--text-muted); margin-top:2px;">' + s.artist + '</div></div></div><div class="queue-order-btns">' + (idx > 0 ? '<button class="order-btn" onclick="moveQueueItem(' + idx + ', -1)"><i class="fa-solid fa-arrow-up"></i></button>' : '') + (idx < songQueue.length - 1 ? '<button class="order-btn" onclick="moveQueueItem(' + idx + ', 1)"><i class="fa-solid fa-arrow-down"></i></button>' : '') + '<button class="order-btn" style="color:#ff4d4d;" onclick="removeQueueItem(' + idx + ')"><i class="fa-solid fa-trash"></i></button></div></div>').join('');
    }

    function moveQueueItem(index, direction) {
      const targetIndex = index + direction;
      if (targetIndex >= 0 && targetIndex < songQueue.length) {
        const item = songQueue.splice(index, 1)[0];
        songQueue.splice(targetIndex, 0, item);
        renderQueue();
      }
    }

    function removeQueueItem(index) { songQueue.splice(index, 1); renderQueue(); }
    function playFromQueueIndex(index) { playSongDirect(songQueue.splice(index, 1)[0], true); }
    function openQueueModal() { renderQueue(); document.getElementById('queue-modal').style.display = 'flex'; }
    function closeQueueModal() { document.getElementById('queue-modal').style.display = 'none'; }

    function createNewPlaylist() {
      const name = prompt("Enter Playlist Name (e.g. Workout, Dance Beats):");
      if (!name || !name.trim()) return;
      userPlaylists.unshift({ id: 'pl_' + Date.now(), name: name.trim(), tracks: [] });
      localStorage.setItem('fitube_custom_playlists', JSON.stringify(userPlaylists));
      renderLibrary();
    }

    function addCurrentSongToPlaylistModal() {
      if (!currentSong) return;
      if (!userPlaylists.length) { alert("Pehle Playlists tab me jakar playlist banayein!"); return; }
      const names = userPlaylists.map((p, idx) => (idx + 1) + '. ' + p.name).join('\n');
      const choice = prompt('Select Playlist Number for "' + currentSong.title + '":\n\n' + names);
      const selectedIdx = parseInt(choice) - 1;
      if (userPlaylists[selectedIdx]) {
        if (!userPlaylists[selectedIdx].tracks.some(t => t.id === currentSong.id)) {
          userPlaylists[selectedIdx].tracks.unshift(currentSong);
          localStorage.setItem('fitube_custom_playlists', JSON.stringify(userPlaylists));
          alert('Added to "' + userPlaylists[selectedIdx].name + '"!');
          renderLibrary();
        } else { alert("Song pehle se playlist me hai!"); }
      }
    }

    function playCustomPlaylist(plId) {
      const pl = userPlaylists.find(p => p.id === plId);
      if (!pl || !pl.tracks.length) { alert("Playlist is empty!"); return; }
      songQueue = [...pl.tracks.slice(1)];
      playSongDirect(pl.tracks[0], true);
    }

    function deletePlaylist(plId) {
      if (confirm("Delete this playlist?")) {
        userPlaylists = userPlaylists.filter(p => p.id !== plId);
        localStorage.setItem('fitube_custom_playlists', JSON.stringify(userPlaylists));
        renderLibrary();
      }
    }

    function toggleFavoriteForSong(song) {
      if (!song) return;
      const idx = favorites.findIndex(s => s.id === song.id);
      if (idx >= 0) favorites.splice(idx, 1); else favorites.unshift(song);
      localStorage.setItem('fitube_favs', JSON.stringify(favorites));
      updateLikeButtons();
      if (document.getElementById('tab-library').classList.contains('active-tab')) renderLibrary();
      const currentQuery = document.getElementById('global-search-input').value.trim();
      if (document.getElementById('tab-search').classList.contains('active-tab') && currentQuery) performSearch(currentQuery);
    }

    function updateLikeButtons() {
      if (!currentSong) return;
      const isFav = favorites.some(s => s.id === currentSong.id);
      document.getElementById('dock-like-btn').className = isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      document.getElementById('dock-like-btn').style.color = isFav ? '#ff4d4d' : '#8b8b99';
      document.getElementById('full-like-btn').className = isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      document.getElementById('full-like-btn').style.color = isFav ? '#ff4d4d' : '#fff';
    }

    function renderLibrary() {
      const plContainer = document.getElementById('custom-playlists-container');
      if (userPlaylists.length) {
        plContainer.innerHTML = userPlaylists.map(p => '<div class="playlist-folder" onclick="playCustomPlaylist(\'' + p.id + '\')"><div style="display:flex; align-items:center; gap:12px;"><i class="fa-solid fa-music" style="color:var(--accent); font-size:18px;"></i><div><div style="font-weight:700; font-size:14px;">' + p.name + '</div><div style="font-size:11px; color:var(--text-muted);">' + p.tracks.length + ' Songs</div></div></div><i class="fa-solid fa-trash" style="color:#ff4d4d; font-size:14px; padding:6px;" onclick="event.stopPropagation(); deletePlaylist(\'' + p.id + '\')"></i></div>').join('');
      } else { plContainer.innerHTML = ''; }
      const container = document.getElementById('library-list');
      if (!favorites.length) { container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin-top:20px;">No favorite songs added yet.</p>'; return; }
      container.innerHTML = favorites.map(s => '<div class="track-row" onclick=\'playSongDirect(' + JSON.stringify(s).replace(/'/g, "&apos;") + ')\'><div class="track-info-box"><img src="' + s.thumbnail + '" /><div class="track-texts"><div class="track-row-title">' + s.title + '</div><div class="track-row-artist">' + s.artist + '</div></div></div><div style="display:flex; align-items:center; gap:12px;"><i class="fa-solid fa-heart" style="color:#ff4d4d; font-size:16px; padding:6px;" onclick=\'event.stopPropagation(); toggleFavoriteForSong(' + JSON.stringify(s).replace(/'/g, "&apos;") + ')\'></i><i class="fa-solid fa-play" style="color:var(--accent); font-size:14px;"></i></div></div>').join('');
    }

    function startTicker() {
      clearInterval(ticker);
      ticker = setInterval(() => {
        if (ytPlayer && ytPlayer.getCurrentTime && ytPlayer.getDuration) {
          const curr = ytPlayer.getCurrentTime(), total = ytPlayer.getDuration();
          if (total > 0) {
            document.getElementById('seek-fill').style.width = ((curr / total) * 100) + '%';
            document.getElementById('curr-time').innerText = formatTime(curr);
            document.getElementById('total-time').innerText = formatTime(total);
          }
        }
      }, 500);
    }

    function formatTime(secs) { const min = Math.floor(secs / 60), sec = Math.floor(secs % 60); return min + ':' + (sec < 10 ? '0' : '') + sec; }
    function seekAudio(e) { const r = document.getElementById('seek-container').getBoundingClientRect(); if (ytPlayer && ytPlayer.getDuration) ytPlayer.seekTo(((e.clientX - r.left) / r.width) * ytPlayer.getDuration(), true); }
    function seekRelative(sec) { if (ytPlayer && ytPlayer.getCurrentTime) ytPlayer.seekTo(ytPlayer.getCurrentTime() + sec, true); }
    function togglePlay() { if (ytPlayer && ytPlayer.getPlayerState) { ytPlayer.getPlayerState() === YT.PlayerState.PLAYING ? ytPlayer.pauseVideo() : ytPlayer.playVideo(); } }
    function updatePlayState(isPlaying) {
      document.getElementById('dock-play-icon').className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
      document.getElementById('full-play-icon').className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
    function openFullPlayer() { document.getElementById('full-player-modal').style.display = 'flex'; }
    function closeFullPlayer() { document.getElementById('full-player-modal').style.display = 'none'; }
    loadDiscoverFeed();
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('Fixed playback frontend installed!');
