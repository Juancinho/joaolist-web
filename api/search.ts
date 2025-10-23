import type { VercelRequest, VercelResponse } from '@vercel/node';
import yts from 'youtube-sr';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    // Search for music videos
    const results = await yts.search(q, {
      limit: 20,
      type: 'video',
    });

    // Filter and format results
    const songs = results
      .filter((video) => {
        // Filter out non-music content
        const title = video.title?.toLowerCase() || '';
        const channel = video.channel?.name?.toLowerCase() || '';

        // Exclude common non-music keywords
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

    res.status(200).json({
      songs,
      artists: [],
      albums: [],
      playlists: [],
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function parseDuration(duration: string): number {
  const parts = duration.split(':').map(Number).reverse();
  let seconds = 0;

  if (parts[0]) seconds += parts[0]; // seconds
  if (parts[1]) seconds += parts[1] * 60; // minutes
  if (parts[2]) seconds += parts[2] * 3600; // hours

  return seconds;
}
