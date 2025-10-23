import { create } from 'zustand';
import type { Song, PlayerState } from '../types/music';

interface PlayerStore extends PlayerState {
  setCurrentSong: (song: Song) => void;
  togglePlay: () => void;
  setPlaying: (isPlaying: boolean) => void;
  setQueue: (songs: Song[]) => void;
  addToQueue: (song: Song) => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  playFromQueue: (index: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  volume: 1,
  repeat: 'off',
  shuffle: false,

  setCurrentSong: (song) => {
    const { queue } = get();
    const index = queue.findIndex((s) => s.id === song.id);
    set({ currentSong: song, currentIndex: index >= 0 ? index : -1 });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setPlaying: (isPlaying) => set({ isPlaying }),

  setQueue: (songs) => {
    set({ queue: songs });
    if (songs.length > 0 && !get().currentSong) {
      set({ currentSong: songs[0], currentIndex: 0 });
    }
  },

  addToQueue: (song) =>
    set((state) => ({ queue: [...state.queue, song] })),

  nextSong: () => {
    const { queue, currentIndex, repeat, shuffle } = get();
    if (queue.length === 0) return;

    let nextIndex: number;

    if (repeat === 'one') {
      return; // Stay on current song
    }

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeat === 'all') {
          nextIndex = 0;
        } else {
          set({ isPlaying: false });
          return;
        }
      }
    }

    set({
      currentSong: queue[nextIndex],
      currentIndex: nextIndex,
    });
  },

  previousSong: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    set({
      currentSong: queue[prevIndex],
      currentIndex: prevIndex,
    });
  },

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  toggleRepeat: () =>
    set((state) => ({
      repeat:
        state.repeat === 'off'
          ? 'all'
          : state.repeat === 'all'
          ? 'one'
          : 'off',
    })),

  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

  playFromQueue: (index) => {
    const { queue } = get();
    if (index >= 0 && index < queue.length) {
      set({
        currentSong: queue[index],
        currentIndex: index,
        isPlaying: true,
      });
    }
  },
}));
