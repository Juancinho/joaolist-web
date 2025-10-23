import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Innertube } from 'youtubei.js';

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
    const youtube = await Innertube.create();
    const search = await youtube.search(q, { type: 'video' });

    const songs = search.videos
      .filter((video: any) => {
        if (!video.id || !video.duration) return false;

        const title = video.title?.text?.toLowerCase() || '';
        const channel = video.author?.name?.toLowerCase() || '';

        // Filter out non-music content
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
      .map((video: any) => ({
        id: video.id,
        videoId: video.id,
        title: video.title?.text || 'Unknown',
        artist: video.author?.name || 'Unknown Artist',
        duration: video.duration?.seconds || 0,
        thumbnailUrl: video.best_thumbnail?.url || '',
        views: video.view_count?.text || '0',
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
