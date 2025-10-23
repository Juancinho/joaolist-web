import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { youtubeMusicService } from '../services/youtube-music';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const {
    currentSong,
    isPlaying,
    volume,
    repeat,
    setPlaying,
    nextSong,
  } = usePlayerStore();

  // Load stream URL when song changes
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const loadAudio = async () => {
      setLoading(true);
      setError(null);

      try {
        const streamUrl = await youtubeMusicService.getStreamUrl(currentSong.videoId);

        if (audioRef.current) {
          audioRef.current.src = streamUrl;
          audioRef.current.load();
        }
      } catch (err) {
        setError('Failed to load audio');
        console.error('Audio load error:', err);
        setPlaying(false);
      } finally {
        setLoading(false);
      }
    };

    loadAudio();
  }, [currentSong?.id]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || loading) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.error('Play error:', error);
          setPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, loading, setPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, []);

  // Handle song end
  const handleEnded = () => {
    if (repeat === 'one') {
      audioRef.current?.play();
    } else {
      nextSong();
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return {
    audioRef,
    loading,
    error,
    currentTime,
    duration,
    handleEnded,
    seek,
  };
};
