export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  thumbnailUrl: string;
  videoId: string;
}

export interface Artist {
  id: string;
  name: string;
  thumbnailUrl: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
  thumbnailUrl: string;
  songs: Song[];
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  songs: Song[];
  isLocal?: boolean;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  volume: number;
  repeat: 'off' | 'one' | 'all';
  shuffle: boolean;
}

export interface SearchResult {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}
