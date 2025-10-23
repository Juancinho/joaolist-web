import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  const { videoId } = req.query;

  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'videoId is required' });
  }

  try {
    // Use a proxy service that handles YouTube audio extraction
    // This is more reliable for serverless environments
    const proxyUrls = [
      `https://www.youtube.com/watch?v=${videoId}`,
      `https://music.youtube.com/watch?v=${videoId}`,
    ];

    // Return the YouTube URL - the browser can handle it directly
    // Or use an iframe embed
    res.status(200).json({
      url: `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`,
      videoId: videoId,
      format: 'youtube-embed',
      duration: 0,
    });
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({
      error: 'Failed to get stream',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
