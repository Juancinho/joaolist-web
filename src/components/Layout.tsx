import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import { Home, Search, LibraryMusic } from '@mui/icons-material';
import { MusicPlayer } from './player/MusicPlayer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname === '/search') return 1;
    if (location.pathname === '/library') return 2;
    return 0;
  };

  const handleNavigationChange = (_: any, newValue: number) => {
    const routes = ['/', '/search', '/library'];
    navigate(routes[newValue]);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: { xs: '56px', sm: '80px' }, // Space for player
        bgcolor: 'background.default',
      }}
    >
      {children}

      <MusicPlayer />

      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
        elevation={3}
      >
        <BottomNavigation
          value={getActiveTab()}
          onChange={handleNavigationChange}
          showLabels
        >
          <BottomNavigationAction label="Inicio" icon={<Home />} />
          <BottomNavigationAction label="Buscar" icon={<Search />} />
          <BottomNavigationAction label="Biblioteca" icon={<LibraryMusic />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};
