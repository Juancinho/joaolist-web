import localforage from 'localforage';
import type { Song, Playlist } from '../types/music';

// Configure IndexedDB storage
const songsCache = localforage.createInstance({
  name: 'joaolist',
  storeName: 'songs',
});

const playlistsCache = localforage.createInstance({
  name: 'joaolist',
  storeName: 'playlists',
});

const audioCache = localforage.createInstance({
  name: 'joaolist',
  storeName: 'audio',
});

export class CacheService {
  // Songs cache
  async cacheSong(song: Song): Promise<void> {
    await songsCache.setItem(song.id, song);
  }

  async getCachedSong(id: string): Promise<Song | null> {
    return await songsCache.getItem(id);
  }

  async getAllCachedSongs(): Promise<Song[]> {
    const songs: Song[] = [];
    await songsCache.iterate((value: Song) => {
      songs.push(value);
    });
    return songs;
  }

  async removeCachedSong(id: string): Promise<void> {
    await songsCache.removeItem(id);
  }

  // Playlists cache
  async cachePlaylist(playlist: Playlist): Promise<void> {
    await playlistsCache.setItem(playlist.id, playlist);
  }

  async getCachedPlaylist(id: string): Promise<Playlist | null> {
    return await playlistsCache.getItem(id);
  }

  async getAllCachedPlaylists(): Promise<Playlist[]> {
    const playlists: Playlist[] = [];
    await playlistsCache.iterate((value: Playlist) => {
      playlists.push(value);
    });
    return playlists;
  }

  async removeCachedPlaylist(id: string): Promise<void> {
    await playlistsCache.removeItem(id);
  }

  // Audio cache
  async cacheAudio(songId: string, audioBlob: Blob): Promise<void> {
    await audioCache.setItem(songId, audioBlob);
  }

  async getCachedAudio(songId: string): Promise<Blob | null> {
    return await audioCache.getItem(songId);
  }

  async removeCachedAudio(songId: string): Promise<void> {
    await audioCache.removeItem(songId);
  }

  // Clear all cache
  async clearAllCache(): Promise<void> {
    await Promise.all([
      songsCache.clear(),
      playlistsCache.clear(),
      audioCache.clear(),
    ]);
  }

  // Get cache size info
  async getCacheInfo() {
    const songsCount = (await this.getAllCachedSongs()).length;
    const playlistsCount = (await this.getAllCachedPlaylists()).length;
    let audioCount = 0;
    await audioCache.iterate(() => {
      audioCount++;
    });

    return {
      songs: songsCount,
      playlists: playlistsCount,
      audios: audioCount,
    };
  }
}

export const cacheService = new CacheService();
