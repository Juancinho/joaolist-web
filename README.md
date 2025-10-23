# JoaoList Web - Cliente Web de YouTube Music

Una aplicación web moderna para reproducir música de YouTube Music, inspirada en MetroList.

## Características

- 🎵 Reproducción de música de YouTube Music
- 🔍 Búsqueda avanzada de canciones, artistas, álbumes y playlists
- 📱 Interfaz responsive optimizada para móviles
- 🎨 Material Design 3 con tema claro y oscuro
- 💾 Sistema de caché offline con IndexedDB
- 🎚️ Controles de reproducción avanzados
- 📂 Gestión de biblioteca y playlists
- 🔄 Modo aleatorio y repetición

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: Zustand
- **Routing**: React Router v6
- **Storage**: LocalForage (IndexedDB)
- **HTTP Client**: Axios
- **API**: YouTube Music InnerTube API

## Instalación

```bash
# Instalar dependencias
npm install
```

## Desarrollo Local

La aplicación requiere dos servidores en desarrollo: uno para el frontend y otro para el backend API.

### Opción 1: Iniciar ambos servidores manualmente (recomendado)

```bash
# Terminal 1: Iniciar servidor API (puerto 3001)
npm run dev:api

# Terminal 2: Iniciar servidor frontend (puerto 5173)
npm run dev
```

Luego abre http://localhost:5173 en tu navegador.

### Opción 2: Iniciar todo junto (experimental)

```bash
npm run dev:full
```

### Otros comandos

```bash
# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## Deployment en Vercel

Este proyecto está configurado para desplegarse fácilmente en Vercel:

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente la configuración de Vite
3. El archivo `vercel.json` ya está configurado para el routing de SPA

### Deployment manual

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── player/      # Componentes del reproductor
│   ├── search/      # Componentes de búsqueda
│   └── Layout.tsx   # Layout principal con navegación
├── pages/           # Páginas principales
│   ├── Home.tsx     # Página de inicio
│   ├── Search.tsx   # Página de búsqueda
│   └── Library.tsx  # Página de biblioteca
├── services/        # Servicios y APIs
│   ├── youtube-music.ts  # Integración con YouTube Music
│   └── cache.ts          # Sistema de caché
├── stores/          # Estado global (Zustand)
│   └── playerStore.ts    # Estado del reproductor
├── types/           # Tipos TypeScript
│   └── music.ts     # Tipos de entidades musicales
├── theme.ts         # Configuración del tema MUI
└── App.tsx          # Componente principal
```

## Funcionalidades Principales

### Reproductor de Audio
- Control de reproducción (play, pause, next, previous)
- Cola de reproducción
- Modo aleatorio y repetición
- Control de volumen
- Visualización de canción actual

### Búsqueda
- Búsqueda en tiempo real
- Resultados categorizados (canciones, artistas, álbumes, playlists)
- Filtros por categoría
- Vista previa de resultados

### Biblioteca
- Canciones guardadas
- Playlists personalizadas
- Historial de reproducción
- Favoritos

### Caché Offline
- Almacenamiento de canciones para reproducción offline
- Caché de metadatos
- Gestión de espacio de almacenamiento

## Arquitectura Backend

El proyecto incluye un backend completo implementado con:
- **Serverless Functions** en Vercel para producción (`/api` folder)
- **Express Server** para desarrollo local (`dev-server.js`)
- **ytdl-core** para obtener streams de audio de YouTube
- **youtube-sr** para búsqueda optimizada de videos

### API Endpoints

- `GET /api/search?q=query` - Buscar canciones, artistas y álbumes
- `GET /api/stream?videoId=id` - Obtener URL de streaming de audio

## Limitaciones Conocidas

- En algunas regiones puede ser necesario usar un proxy o VPN para acceder a YouTube
- Las URLs de streaming expiran después de ~6 horas (se recachen automáticamente)
- El sistema de caché offline requiere permisos de almacenamiento en el navegador
- ytdl-core puede requerir actualizaciones ocasionales si YouTube cambia su API

## Próximas Características

- [x] Backend para streaming de audio ✅
- [x] Sistema de búsqueda rápida ✅
- [x] Caché de URLs de streaming ✅
- [ ] Sincronización con cuenta de Google
- [ ] Letras en vivo
- [ ] Integración con Last.fm
- [ ] Ecualizador de audio
- [ ] Sleep timer
- [ ] Compartir canciones y playlists
- [ ] PWA (Progressive Web App)
- [ ] Download de canciones para offline
- [ ] Playlists colaborativas

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está basado en MetroList (GPL-3.0) y mantiene la misma licencia.

## Créditos

Inspirado en [MetroList](https://github.com/mostafaalagamy/Metrolist) por Mo Agamy

## Nota Importante

Esta aplicación es solo para uso educativo y personal. YouTube Music es una marca registrada de Google LLC.
