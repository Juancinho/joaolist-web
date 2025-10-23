import express from 'express';
import cors from 'cors';
import yts from 'yt-search';

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

    const results = await yts(q);

    const songs = results.videos
      .filter((video) => {
        if (!video.videoId || !video.duration) return false;

        const title = video.title?.toLowerCase() || '';
        const channel = video.author?.name?.toLowerCase() || '';

        const excludeKeywords = [
          'podcast', 'tutorial', 'review', 'unboxing',
          'gameplay', 'vlog', 'interview', 'reaction', 'trailer'
        ];

        return !excludeKeywords.some(keyword =>
          title.includes(keyword) || channel.includes(keyword)
        );
      })
      .slice(0, 20)
      .map((video) => ({
        id: video.videoId,
        videoId: video.videoId,
        title: video.title || 'Unknown',
        artist: video.author?.name || 'Unknown Artist',
        duration: video.duration?.seconds || video.timestamp || 0,
        thumbnailUrl: video.thumbnail || video.image || '',
        views: video.views || 0,
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

    // Return YouTube embed URL - frontend handles it with IFrame API
    res.json({
      url: `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`,
      videoId: videoId,
      format: 'youtube-embed',
      duration: 0,
    });

    console.log(`✅ Returned embed URL`);
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
  console.log('\n💡 Now run "npm run dev" in another terminal to start the frontend');
  console.log('🎼 Music playback uses YouTube IFrame Player API\n');
});
