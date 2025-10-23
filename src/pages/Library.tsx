import { Container, Typography, Box } from '@mui/material';

export const Library = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Biblioteca
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tus canciones, álbumes y playlists guardadas
        </Typography>
      </Box>

      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          Tu biblioteca está vacía
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Busca y guarda tu música favorita
        </Typography>
      </Box>
    </Container>
  );
};
