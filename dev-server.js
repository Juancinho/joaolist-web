import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';
import yts from 'youtube-sr';

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
    console.log(`Searching for: ${q}`);

    const results = await yts.search(q, {
      limit: 20,
      type: 'video',
    });

    const songs = results
      .filter((video) => {
        const title = video.title?.toLowerCase() || '';
        const channel = video.channel?.name?.toLowerCase() || '';

        const excludeKeywords = [
          'podcast', 'tutorial', 'review', 'unboxing',
          'gameplay', 'vlog', 'interview', 'reaction'
        ];

        const hasExcluded = excludeKeywords.some(keyword =>
          title.includes(keyword) || channel.includes(keyword)
        );

        return !hasExcluded && video.duration && video.id;
      })
      .map((video) => ({
        id: video.id || '',
        videoId: video.id || '',
        title: video.title || 'Unknown',
        artist: video.channel?.name || 'Unknown Artist',
        duration: parseDuration(video.duration || '0:00'),
        thumbnailUrl: video.thumbnail?.url || video.thumbnail?.displayThumbnailURL() || '',
        views: video.views,
      }));

    console.log(`Found ${songs.length} songs`);
    res.json({ songs, artists: [], albums: [], playlists: [] });
  } catch (error) {
    console.error('Search error:', error);
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
    console.log(`Getting stream for: ${videoId}`);
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const info = await ytdl.getInfo(videoUrl);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

    if (audioFormats.length === 0) {
      return res.status(404).json({ error: 'No audio formats found' });
    }

    const bestAudio = audioFormats.reduce((prev, current) => {
      const prevBitrate = prev.audioBitrate || 0;
      const currentBitrate = current.audioBitrate || 0;
      return currentBitrate > prevBitrate ? current : prev;
    });

    console.log(`Stream URL obtained, bitrate: ${bestAudio.audioBitrate}`);

    res.json({
      url: bestAudio.url,
      format: bestAudio.mimeType,
      bitrate: bestAudio.audioBitrate,
      duration: info.videoDetails.lengthSeconds,
    });
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({
      error: 'Failed to get stream',
      message: error.message
    });
  }
});

function parseDuration(duration) {
  const parts = duration.split(':').map(Number).reverse();
  let seconds = 0;

  if (parts[0]) seconds += parts[0];
  if (parts[1]) seconds += parts[1] * 60;
  if (parts[2]) seconds += parts[2] * 3600;

  return seconds;
}

app.listen(PORT, () => {
  console.log(`\n🎵 JoaoList API Server running at http://localhost:${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log(`  🔍 Search: http://localhost:${PORT}/api/search?q=query`);
  console.log(`  🎶 Stream: http://localhost:${PORT}/api/stream?videoId=id`);
  console.log('\n');
});
