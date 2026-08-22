const express = require('express');
const cors = require('cors');
const ytSearch = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: 'Query missing' });

        const r = await ytSearch(query);
        const videos = r.videos.slice(0, 20).map(v => ({
            id: v.videoId,
            title: v.title,
            artist: v.author ? v.author.name : 'Unknown Artist',
            duration: v.timestamp,
            thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
        }));
        res.json(videos);
    } catch (err) {
        console.error('Search Error:', err);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.get('/api/stream/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        res.header('Content-Type', 'audio/mpeg');
        ytdl(videoUrl, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }).pipe(res);
    } catch (err) {
        console.error('Stream Error:', err);
        res.status(500).end();
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on port ${PORT}`);
});
