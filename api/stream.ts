import type { VercelRequest, VercelResponse } from '@vercel/node';
import ytdl from 'ytdl-core';

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
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Validate video
    const info = await ytdl.getInfo(videoUrl);

    // Get audio formats
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

    if (audioFormats.length === 0) {
      return res.status(404).json({ error: 'No audio formats found' });
    }

    // Get the best audio format
    const bestAudio = audioFormats.reduce((prev, current) => {
      const prevBitrate = prev.audioBitrate || 0;
      const currentBitrate = current.audioBitrate || 0;
      return currentBitrate > prevBitrate ? current : prev;
    });

    // Return the stream URL
    res.status(200).json({
      url: bestAudio.url,
      format: bestAudio.mimeType,
      bitrate: bestAudio.audioBitrate,
      duration: info.videoDetails.lengthSeconds,
    });
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({
      error: 'Failed to get stream',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
