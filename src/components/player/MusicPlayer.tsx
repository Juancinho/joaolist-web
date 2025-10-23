import {
  Box,
  Card,
  CardMedia,
  IconButton,
  LinearProgress,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Repeat,
  RepeatOne,
  Shuffle,
  VolumeUp,
} from '@mui/icons-material';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

export const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    repeat,
    shuffle,
    togglePlay,
    nextSong,
    previousSong,
    setVolume,
    toggleRepeat,
    toggleShuffle,
  } = usePlayerStore();

  const {
    audioRef,
    loading,
    error,
    currentTime,
    duration,
    handleEnded,
    seek,
  } = useAudioPlayer();

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return null;
  }

  return (
    <Card
      sx={{
        position: 'fixed',
        bottom: { xs: 56, sm: 0 },
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: 0,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(30, 30, 30, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <audio ref={audioRef} onEnded={handleEnded} />

      {loading && <LinearProgress />}

      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CardMedia
            component="img"
            sx={{ width: 56, height: 56, borderRadius: 1 }}
            image={currentSong.thumbnailUrl}
            alt={currentSong.title}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap>
              {currentSong.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {currentSong.artist}
            </Typography>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              onClick={toggleShuffle}
              color={shuffle ? 'primary' : 'inherit'}
            >
              <Shuffle />
            </IconButton>

            <IconButton onClick={previousSong} disabled={loading}>
              <SkipPrevious />
            </IconButton>

            <IconButton
              onClick={togglePlay}
              disabled={loading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '&:disabled': { bgcolor: 'action.disabledBackground' },
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            <IconButton onClick={nextSong} disabled={loading}>
              <SkipNext />
            </IconButton>

            <IconButton size="small" onClick={toggleRepeat}>
              {repeat === 'one' ? (
                <RepeatOne color="primary" />
              ) : (
                <Repeat color={repeat === 'all' ? 'primary' : 'inherit'} />
              )}
            </IconButton>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                width: 120,
              }}
            >
              <VolumeUp sx={{ mr: 1 }} />
              <Slider
                size="small"
                value={volume}
                onChange={(_, value) => setVolume(value as number)}
                min={0}
                max={1}
                step={0.01}
                sx={{ width: 80 }}
              />
            </Box>
          </Stack>
        </Stack>

        {/* Progress bar */}
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40 }}>
            {formatTime(currentTime)}
          </Typography>
          <Slider
            size="small"
            value={currentTime}
            max={duration || 100}
            onChange={(_, value) => seek(value as number)}
            sx={{ flex: 1 }}
            disabled={loading || !duration}
          />
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40 }}>
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
