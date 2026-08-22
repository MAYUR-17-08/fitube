const fs = require('fs');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fitube Pro</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root { --bg: #09090b; --card-bg: #141417; --accent: #1ed760; --text: #ffffff; --text-muted: #8b8b99; }
    body { background-color: var(--bg); color: var(--text); height: 100vh; display: flex; flex-direction: column; }
    .main-view { flex: 1; overflow-y: auto; padding-bottom: 80px; }
    .track-row { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--card-bg); margin: 6px 20px; border-radius: 12px; }
    .playlist-card { padding: 15px; background: var(--card-bg); margin: 10px 20px; border-radius: 12px; display: flex; justify-content: space-between; cursor: pointer; }
    .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 1000; display: none; flex-direction: column; padding: 20px; }
  </style>
</head>
<body>
  <div id="app-view"></div>
  <div id="modal-container" class="modal"></div>
  <script>
    let playlists = JSON.parse(localStorage.getItem('fitube_pls') || '[]');
    let currentSong = null;

    function renderLibrary() {
      let html = '<div style="padding:20px;"><h2>Your Playlists</h2><button onclick="createPlaylist()">+ New Playlist</button></div>';
      playlists.forEach((p, i) => {
        html += \`<div class="playlist-card" onclick="openPlaylist(\${i})"><div>\${p.name} (\${p.songs.length} songs)</div><i class="fa fa-trash" onclick="event.stopPropagation(); deletePlaylist(\${i})"></i></div>\`;
      });
      document.getElementById('app-view').innerHTML = html;
    }

    function createPlaylist() {
      const name = prompt("Playlist Name:");
      if(name) { playlists.push({name, songs: []}); localStorage.setItem('fitube_pls', JSON.stringify(playlists)); renderLibrary(); }
    }

    function openPlaylist(idx) {
      const p = playlists[idx];
      let html = \`<div style="padding:20px;"><button onclick="renderLibrary()">Back</button><h2>\${p.name}</h2></div>\`;
      p.songs.forEach(s => {
        html += \`<div class="track-row" onclick='playSong(\${JSON.stringify(s)})'>\${s.title}</div>\`;
      });
      document.getElementById('app-view').innerHTML = html;
    }

    function addToPlaylistModal(song) {
      let html = \`<div style="color:#fff;"><h2>Add to Playlist</h2><input id="new-pl-name" placeholder="New Playlist Name"><button onclick="createNewFromModal()">Create & Add</button><hr>\`;
      playlists.forEach((p, i) => {
        html += \`<div onclick="addSongToExisting(\${i}, \${JSON.stringify(song).replace(/'/g, "&apos;")})">Add to \${p.name}</div>\`;
      });
      html += \`<button onclick="document.getElementById('modal-container').style.display='none'">Close</button></div>\`;
      const m = document.getElementById('modal-container');
      m.innerHTML = html; m.style.display = 'flex';
    }

    function createNewFromModal() {
      const name = document.getElementById('new-pl-name').value;
      if(name) { playlists.push({name, songs: [currentSong]}); localStorage.setItem('fitube_pls', JSON.stringify(playlists)); alert("Added!"); document.getElementById('modal-container').style.display='none'; }
    }
    
    function addSongToExisting(idx, song) {
        playlists[idx].songs.push(song);
        localStorage.setItem('fitube_pls', JSON.stringify(playlists));
        alert("Added to " + playlists[idx].name);
        document.getElementById('modal-container').style.display='none';
    }

    renderLibrary();
  </script>
</body>
</html>`;
fs.writeFileSync('public/index.html', html);
