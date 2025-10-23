import type { VercelRequest, VercelResponse } from '@vercel/node';
import yts from 'yt-search';

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
    const results = await yts(q);

    const songs = results.videos
      .filter((video: any) => {
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
      .map((video: any) => ({
        id: video.videoId,
        videoId: video.videoId,
        title: video.title || 'Unknown',
        artist: video.author?.name || 'Unknown Artist',
        duration: video.duration?.seconds || video.timestamp || 0,
        thumbnailUrl: video.thumbnail || video.image || '',
        views: video.views || 0,
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
