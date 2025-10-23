import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { PlayArrow, MoreVert } from '@mui/icons-material';
import type { Song } from '../../types/music';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
}

export const SongCard = ({ song, onPlay }: SongCardProps) => {
  return (
    <Card
      sx={{
        display: 'flex',
        mb: 1,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 80, height: 80 }}
        image={song.thumbnailUrl}
        alt={song.title}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', py: 1 }}>
          <Typography component="div" variant="subtitle1" noWrap>
            {song.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
            noWrap
          >
            {song.artist}
            {song.album && ` • ${song.album}`}
          </Typography>
        </CardContent>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
        <IconButton onClick={() => onPlay(song)} color="primary">
          <PlayArrow />
        </IconButton>
        <IconButton size="small">
          <MoreVert />
        </IconButton>
      </Box>
    </Card>
  );
};
