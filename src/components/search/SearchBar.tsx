import { useState } from 'react';
import { Box, InputBase, IconButton, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 2,
      }}
    >
      <Box sx={{ flex: 1, px: 2 }}>
        <InputBase
          placeholder="Buscar canciones, artistas, álbumes..."
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>
      <IconButton type="submit" sx={{ p: '10px' }}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
