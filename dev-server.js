import express from 'express';
import cors from 'cors';
import { Innertube } from 'youtubei.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Search endpoint
app.get('/api/search', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    console.log(`🔍 Searching for: ${q}`);

    const youtube = await Innertube.create();
    const search = await youtube.search(q, { type: 'video' });

    const songs = search.videos
      .filter((video) => {
        if (!video.id || !video.duration) return false;

        const title = video.title?.text?.toLowerCase() || '';
        const channel = video.author?.name?.toLowerCase() || '';

        const excludeKeywords = [
          'podcast', 'tutorial', 'review', 'unboxing',
          'gameplay', 'vlog', 'interview', 'reaction', 'trailer',
          'news', 'documentary'
        ];

        return !excludeKeywords.some(keyword =>
          title.includes(keyword) || channel.includes(keyword)
        );
      })
      .slice(0, 20)
      .map((video) => ({
        id: video.id,
        videoId: video.id,
        title: video.title?.text || 'Unknown',
        artist: video.author?.name || 'Unknown Artist',
        duration: video.duration?.seconds || 0,
        thumbnailUrl: video.best_thumbnail?.url || '',
        views: video.view_count?.text || '0',
      }));

    console.log(`✅ Found ${songs.length} songs`);
    res.json({ songs, artists: [], albums: [], playlists: [] });
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

// Stream endpoint
app.get('/api/stream', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { videoId } = req.query;

  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'videoId is required' });
  }

  try {
    console.log(`🎵 Getting stream for: ${videoId}`);

    const youtube = await Innertube.create();
    const info = await youtube.getInfo(videoId);

    const format = info.chooseFormat({
      quality: 'best',
      type: 'audio'
    });

    if (!format) {
      return res.status(404).json({ error: 'No audio format found' });
    }

    const url = format.decipher(youtube.session.player);

    console.log(`✅ Stream URL obtained, bitrate: ${format.bitrate}`);

    res.json({
      url: url,
      format: format.mime_type,
      bitrate: format.bitrate,
      duration: info.basic_info.duration || 0,
    });
  } catch (error) {
    console.error('❌ Stream error:', error);
    res.status(500).json({
      error: 'Failed to get stream',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🎵 JoaoList API Server running at http://localhost:${PORT}`);
  console.log('\n📡 Available endpoints:');
  console.log(`  🔍 Search: http://localhost:${PORT}/api/search?q=query`);
  console.log(`  🎶 Stream: http://localhost:${PORT}/api/stream?videoId=id`);
  console.log('\n💡 Now run "npm run dev" in another terminal to start the frontend\n');
});
