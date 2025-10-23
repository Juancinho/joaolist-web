import axios from 'axios';
import type { SearchResult } from '../types/music';

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

class YouTubeMusicService {
  private cache = new Map<string, string>();

  async search(query: string): Promise<SearchResult> {
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { q: query },
      });

      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      return { songs: [], artists: [], albums: [], playlists: [] };
    }
  }

  async getStreamUrl(videoId: string): Promise<string> {
    try {
      // Check cache first
      if (this.cache.has(videoId)) {
        const cachedUrl = this.cache.get(videoId)!;
        // Check if cached URL is still valid (URLs expire after ~6 hours)
        if (this.isUrlValid(cachedUrl)) {
          return cachedUrl;
        }
        this.cache.delete(videoId);
      }

      const response = await axios.get(`${API_BASE_URL}/stream`, {
        params: { videoId },
      });

      const url = response.data.url;
      this.cache.set(videoId, url);

      return url;
    } catch (error) {
      console.error('Stream error:', error);
      throw new Error('Failed to get stream URL');
    }
  }

  private isUrlValid(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const expire = urlObj.searchParams.get('expire');
      if (!expire) return false;

      const expireTime = parseInt(expire) * 1000;
      return Date.now() < expireTime;
    } catch {
      return false;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const youtubeMusicService = new YouTubeMusicService();
