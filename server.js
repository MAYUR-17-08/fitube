const express = require('express');
const cors = require('cors');
const yts = require('yt-search');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const JUNK = ['tutorial', 'lesson', 'karaoke', 'live stream', 'interview', 'reaction', 'dance steps', 'review', 'vlog'];
function cleanTitle(t) { return (t || '').replace(/\[.*?\]|\(.*?\)/g, '').replace(/official video|music video|lyric video|audio|official audio|full song|hd video|video song/gi, '').trim(); }
function isSong(t) { return !JUNK.some(j => (t || '').toLowerCase().includes(j)); }

app.get('/api/search', async (req, res) => {
  try {
    const q = req.query.q; if (!q || !q.trim()) return res.json([]);
    const r = await yts(q.trim() + ' song audio');
    res.json((r.videos || []).filter(v => v.seconds > 45 && v.seconds < 600 && isSong(v.title)).slice(0, 15).map(v => ({
      id: v.videoId,
      title: cleanTitle(v.title) || v.title,
      artist: v.author && v.author.name ? v.author.name.replace(/ - Topic|VEVO/gi, '') : 'Artist',
      thumbnail: v.thumbnail || ('https://i.ytimg.com/vi/' + v.videoId + '/hqdefault.jpg'),
      duration: v.timestamp || ''
    })));
  } catch (e) { res.json([]); }
});

app.get('/api/discover', async (req, res) => {
  try {
    const [trending, indieChill, rainTherapy, lateNight] = await Promise.all([
      yts('Trending Indian Pop Hits 2025').then(r => (r.videos || []).filter(v => v.seconds < 600 && isSong(v.title)).slice(0, 6)),
      yts('Best Indian Indie acoustic chill hits').then(r => (r.videos || []).filter(v => v.seconds < 600 && isSong(v.title)).slice(0, 6)),
      yts('Rain Therapy hindi lofi chill songs').then(r => (r.videos || []).filter(v => v.seconds < 600 && isSong(v.title)).slice(0, 6)),
      yts('Late Night Bollywood Chill Songs').then(r => (r.videos || []).filter(v => v.seconds < 600 && isSong(v.title)).slice(0, 6))
    ]);

    const fmt = (l) => (l || []).map(v => ({
      id: v.videoId,
      title: cleanTitle(v.title) || v.title,
      artist: v.author && v.author.name ? v.author.name.replace(/ - Topic|VEVO/gi, '') : 'Artist',
      thumbnail: v.thumbnail || ('https://i.ytimg.com/vi/' + v.videoId + '/hqdefault.jpg'),
      duration: v.timestamp || ''
    }));

    res.json({
      banners: [
        { title: "Top 50 Hits", subtitle: "Chart Toppers & Viral Tracks", tag: "TRENDING NOW", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80", query: "Trending Indian Hits" },
        { title: "Indie Chill Vibes", subtitle: "Anuv, Prateek, Zaeden", tag: "INDIE ACOUSTIC", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80", query: "Indian Indie Chill Acoustic" },
        { title: "Midnight Drive", subtitle: "Slowed + Reverb Chill Beats", tag: "CURATED FOR YOU", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80", query: "Midnight Drive Hindi Vibes" }
      ],
      trending: fmt(trending), indieChill: fmt(indieChill), rainTherapy: fmt(rainTherapy), lateNight: fmt(lateNight)
    });
  } catch (e) { res.json({ banners: [], trending: [], indieChill: [], rainTherapy: [], lateNight: [] }); }
});

app.get('/api/vibe-next', async (req, res) => {
  try {
    const { artist, title, currentId } = req.query;
    const cleanArtist = (artist || '').replace(/ - Topic|VEVO/gi, '').trim();
    const [rArtist, rVibe] = await Promise.all([
      yts(cleanArtist + ' popular hit audio songs').then(r => r.videos || []),
      yts((title || cleanArtist) + ' similar vibe songs').then(r => r.videos || [])
    ]);

    const seen = new Set(), cleanQueue = [];
    for (const v of [...rArtist, ...rVibe]) {
      if (v.seconds > 45 && v.seconds < 600 && v.videoId !== currentId && !seen.has(v.videoId) && isSong(v.title)) {
        seen.add(v.videoId);
        cleanQueue.push({
          id: v.videoId,
          title: cleanTitle(v.title) || v.title,
          artist: v.author && v.author.name ? v.author.name.replace(/ - Topic|VEVO/gi, '') : cleanArtist || 'Artist',
          thumbnail: v.thumbnail || ('https://i.ytimg.com/vi/' + v.videoId + '/hqdefault.jpg'),
          duration: v.timestamp || ''
        });
      }
      if (cleanQueue.length >= 12) break;
    }
    res.json(cleanQueue);
  } catch (e) { res.json([]); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('Fitube Master Server LIVE on http://localhost:' + PORT));
