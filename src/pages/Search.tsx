import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { SearchBar } from '../components/search/SearchBar';
import { SongCard } from '../components/search/SongCard';
import { youtubeMusicService } from '../services/youtube-music';
import type { SearchResult, Song } from '../types/music';
import { usePlayerStore } from '../stores/playerStore';

export const Search = () => {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { setCurrentSong, setQueue, setPlaying } = usePlayerStore();

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const searchResults = await youtubeMusicService.search(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    if (results) {
      setQueue(results.songs);
    }
    setPlaying(true);
  };

  const tabs = [
    { label: 'Todo', count: results ? Object.values(results).flat().length : 0 },
    { label: 'Canciones', count: results?.songs.length || 0 },
    { label: 'Artistas', count: results?.artists.length || 0 },
    { label: 'Álbumes', count: results?.albums.length || 0 },
    { label: 'Playlists', count: results?.playlists.length || 0 },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Buscar
        </Typography>
        <SearchBar onSearch={handleSearch} />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {results && !loading && (
        <>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={`${tab.label} (${tab.count})`}
                disabled={tab.count === 0}
              />
            ))}
          </Tabs>

          <Box>
            {activeTab === 0 || activeTab === 1 ? (
              <>
                {results.songs.length > 0 ? (
                  <>
                    {activeTab === 0 && (
                      <Typography variant="h6" gutterBottom fontWeight="600">
                        Canciones
                      </Typography>
                    )}
                    {results.songs.map((song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        onPlay={handlePlaySong}
                      />
                    ))}
                  </>
                ) : (
                  <Typography color="text.secondary">
                    No se encontraron canciones
                  </Typography>
                )}
              </>
            ) : null}

            {activeTab === 0 || activeTab === 2 ? (
              <>
                {results.artists.length > 0 && (
                  <>
                    {activeTab === 0 && (
                      <Typography variant="h6" gutterBottom fontWeight="600" mt={3}>
                        Artistas
                      </Typography>
                    )}
                    <Typography color="text.secondary">
                      {results.artists.length} artistas encontrados
                    </Typography>
                  </>
                )}
              </>
            ) : null}

            {activeTab === 0 || activeTab === 3 ? (
              <>
                {results.albums.length > 0 && (
                  <>
                    {activeTab === 0 && (
                      <Typography variant="h6" gutterBottom fontWeight="600" mt={3}>
                        Álbumes
                      </Typography>
                    )}
                    <Typography color="text.secondary">
                      {results.albums.length} álbumes encontrados
                    </Typography>
                  </>
                )}
              </>
            ) : null}

            {activeTab === 0 || activeTab === 4 ? (
              <>
                {results.playlists.length > 0 && (
                  <>
                    {activeTab === 0 && (
                      <Typography variant="h6" gutterBottom fontWeight="600" mt={3}>
                        Playlists
                      </Typography>
                    )}
                    <Typography color="text.secondary">
                      {results.playlists.length} playlists encontradas
                    </Typography>
                  </>
                )}
              </>
            ) : null}
          </Box>
        </>
      )}

      {!results && !loading && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            Busca tu música favorita
          </Typography>
        </Box>
      )}
    </Container>
  );
};
