import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../stores/playerStore';

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const useYouTubePlayer = () => {
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
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

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) {
      setReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setReady(true);
    };
  }, []);

  // Create player
  useEffect(() => {
    if (!ready || !currentSong) return;

    setLoading(true);
    setError(null);

    try {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: currentSong.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            setLoading(false);
            setDuration(event.target.getDuration());
            if (isPlaying) {
              event.target.playVideo();
            }
            event.target.setVolume(volume * 100);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              if (repeat === 'one') {
                playerRef.current?.seekTo(0);
                playerRef.current?.playVideo();
              } else {
                nextSong();
              }
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setPlaying(false);
            }
          },
          onError: (event: any) => {
            setError('Failed to load video');
            setLoading(false);
            console.error('YouTube player error:', event.data);
          },
        },
      });
    } catch (err) {
      setError('Failed to initialize player');
      setLoading(false);
      console.error('Player initialization error:', err);
    }
  }, [ready, currentSong?.id]);

  // Handle play/pause
  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Handle volume
  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume]);

  // Update current time
  useEffect(() => {
    if (!playerRef.current) return;

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerRef.current]);

  const seek = (time: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(time);
    }
  };

  return {
    loading,
    error,
    currentTime,
    duration,
    seek,
  };
};
