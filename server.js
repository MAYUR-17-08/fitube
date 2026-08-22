const express = require('express');
const cors = require('cors');
const ytSearch = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Filter logic: Exclude non-music titles
const nonMusicKeywords = ['trailer', 'teaser', 'reaction', 'full movie', 'episode', 'gameplay', 'review', 'vlog', 'podcast', 'unboxing', 'tutorial', 'interview'];

app.get('/api/search', async (req, res) => {
    try {
        let query = req.query.q;
        if (!query) return res.status(400).json({ error: 'Query missing' });

        // Search strictly for music/audio
        const r = await ytSearch(`${query} audio song`);
        
        const filteredVideos = r.videos.filter(v => {
            const title = v.title.toLowerCase();
            const seconds = v.seconds;
            
            // 1. Duration check: Between 60s (1 min) and 480s (8 mins)
            const isSongDuration = seconds >= 60 && seconds <= 480;
            
            // 2. Keyword blacklist filter
            const hasBlockedWord = nonMusicKeywords.some(keyword => title.includes(keyword));

            return isSongDuration && !hasBlockedWord;
        });

        const songs = (filteredVideos.length > 0 ? filteredVideos : r.videos)
            .slice(0, 20)
            .map(v => ({
                id: v.videoId,
                title: v.title.replace(/\(Official.*?\)|\[Official.*?\]|Official Video|Audio|Lyric Video/gi, '').trim(),
                artist: v.author ? v.author.name.replace(/ - Topic|VEVO/gi, '').trim() : 'Unknown Artist',
                duration: v.timestamp,
                thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
            }));

        res.json(songs);
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
    console.log(`Music Filter Server live on port ${PORT}`);
});
