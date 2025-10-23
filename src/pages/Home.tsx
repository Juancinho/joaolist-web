import { Container, Typography, Box, Card, CardMedia, CardContent } from '@mui/material';

const quickPicks = [
  {
    id: '1',
    title: 'Mix rápido 1',
    thumbnailUrl: 'https://via.placeholder.com/200',
  },
  {
    id: '2',
    title: 'Mix rápido 2',
    thumbnailUrl: 'https://via.placeholder.com/200',
  },
  {
    id: '3',
    title: 'Descubre',
    thumbnailUrl: 'https://via.placeholder.com/200',
  },
];

export const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Inicio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Descubre música nueva y tus favoritos
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom fontWeight="600">
          Selecciones rápidas
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {quickPicks.map((pick) => (
            <Card
              key={pick.id}
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={pick.thumbnailUrl}
                alt={pick.title}
              />
              <CardContent>
                <Typography variant="subtitle2" noWrap>
                  {pick.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom fontWeight="600">
          Recomendados para ti
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Busca música para empezar a recibir recomendaciones
        </Typography>
      </Box>
    </Container>
  );
};
