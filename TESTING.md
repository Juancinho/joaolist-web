# Guía de Pruebas - JoaoList Web

## Probar la Aplicación Localmente

### 1. Iniciar los servidores

```bash
# Terminal 1: API Server
npm run dev:api

# Terminal 2: Frontend
npm run dev
```

### 2. Abrir en el navegador

Abre http://localhost:5173

### 3. Pruebas Funcionales

#### Búsqueda de Música

1. Haz clic en la pestaña "Buscar" (icono de lupa en la parte inferior)
2. Escribe una canción en la barra de búsqueda, por ejemplo:
   - "Bohemian Rhapsody Queen"
   - "Stairway to Heaven"
   - "Despacito"
3. Presiona Enter o haz clic en el icono de búsqueda
4. Deberías ver una lista de resultados con miniaturas

#### Reproducción de Audio

1. En los resultados de búsqueda, haz clic en el botón de play (▶) de cualquier canción
2. Observa la barra de reproducción en la parte inferior
3. La canción debería comenzar a cargar (verás un indicador de progreso)
4. Una vez cargada, debería reproducirse automáticamente

#### Controles del Reproductor

Prueba los siguientes controles:

- **Play/Pause**: Pausa y reanuda la reproducción
- **Next (⏭)**: Salta a la siguiente canción en la cola
- **Previous (⏮)**: Vuelve a la canción anterior
- **Shuffle (🔀)**: Activa/desactiva reproducción aleatoria
- **Repeat**: Cicla entre:
  - Sin repetir
  - Repetir todas
  - Repetir una
- **Volume (🔊)**: Ajusta el volumen (solo en desktop)
- **Progress bar**: Arrastra para buscar en la canción

#### Cola de Reproducción

1. Reproduce varias canciones
2. La cola se construye automáticamente con los resultados de búsqueda
3. Usa Next/Previous para navegar por la cola

## Pruebas del Backend API

### Probar endpoint de búsqueda

```bash
# Usando curl
curl "http://localhost:3001/api/search?q=queen"

# O abre en el navegador:
# http://localhost:3001/api/search?q=queen
```

Deberías recibir un JSON con resultados:

```json
{
  "songs": [
    {
      "id": "fJ9rUzIMcZQ",
      "videoId": "fJ9rUzIMcZQ",
      "title": "Queen - Bohemian Rhapsody",
      "artist": "Queen Official",
      "duration": 367,
      "thumbnailUrl": "https://...",
      "views": 1234567890
    }
  ],
  "artists": [],
  "albums": [],
  "playlists": []
}
```

### Probar endpoint de streaming

```bash
# Reemplaza VIDEO_ID con un ID real de YouTube
curl "http://localhost:3001/api/stream?videoId=fJ9rUzIMcZQ"
```

Respuesta esperada:

```json
{
  "url": "https://rr3---sn-...",
  "format": "audio/mp4; codecs=\"mp4a.40.2\"",
  "bitrate": 128,
  "duration": "367"
}
```

## Casos de Prueba

### ✅ Casos que deberían funcionar

1. **Búsqueda básica**: Buscar "pop music"
2. **Reproducción**: Reproducir cualquier canción de los resultados
3. **Navegación**: Cambiar entre pestañas (Inicio, Buscar, Biblioteca)
4. **Controles**: Todos los controles del reproductor
5. **Responsive**: Probar en tamaño móvil (Ctrl+Shift+M en Chrome)

### ⚠️ Casos conocidos que pueden fallar

1. **Videos restringidos por región**: Algunos videos no estarán disponibles en tu país
2. **Videos sin audio**: Algunos videos (ej: imágenes fijas) no tienen stream de audio
3. **Streaming lento**: Depende de tu conexión y los servidores de YouTube

### ❌ Errores esperados y cómo manejarlos

#### Error: "Failed to load audio"

**Causas**:
- Video no disponible en tu región
- Video eliminado o privado
- Límite de rate de YouTube

**Solución**:
- Intenta con otra canción
- Usa VPN si estás en región restringida
- Espera unos minutos si alcanzaste el límite

#### Error: CORS

**Causas**:
- El servidor API no está corriendo
- Puerto incorrecto configurado

**Solución**:
```bash
# Verifica que el API server esté corriendo
npm run dev:api

# Verifica el puerto en src/services/youtube-music.ts
# Debe ser http://localhost:3001/api
```

#### Error: "Cannot find module"

**Causas**:
- Dependencias no instaladas

**Solución**:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Testing en Diferentes Navegadores

### Chrome/Edge (Recomendado)
✅ Completamente soportado

### Firefox
✅ Completamente soportado

### Safari
⚠️ Puede tener problemas con algunos formatos de audio

### Mobile
📱 Probar en:
- Chrome móvil (Android)
- Safari móvil (iOS)

## Performance Testing

### Verificar tiempos de respuesta

```bash
# Medir tiempo de búsqueda
time curl "http://localhost:3001/api/search?q=test"

# Medir tiempo de obtención de stream
time curl "http://localhost:3001/api/stream?videoId=dQw4w9WgXcQ"
```

Tiempos esperados:
- Búsqueda: 1-3 segundos
- Obtención de stream: 2-5 segundos

### Network throttling

En Chrome DevTools:
1. Abre DevTools (F12)
2. Network tab
3. Throttling → Fast 3G
4. Prueba la reproducción

## Checklist Completo de Funcionalidad

- [ ] Instalación de dependencias sin errores
- [ ] Servidor API inicia correctamente
- [ ] Servidor frontend inicia correctamente
- [ ] Página carga sin errores en consola
- [ ] Búsqueda retorna resultados
- [ ] Resultados muestran miniaturas
- [ ] Click en play carga la canción
- [ ] Audio se reproduce correctamente
- [ ] Controles de reproducción funcionan
- [ ] Progress bar actualiza en tiempo real
- [ ] Next/Previous cambian canciones
- [ ] Shuffle mezcla el orden
- [ ] Repeat funciona en sus 3 modos
- [ ] Volumen se puede ajustar
- [ ] Interfaz responsive en móvil
- [ ] Navegación entre tabs funciona
- [ ] Sin memory leaks (verificar en DevTools)
- [ ] Build de producción exitoso

## Logs y Debugging

### Ver logs del API server

Los logs aparecen directamente en la terminal donde ejecutaste `npm run dev:api`

Busca líneas como:
```
Searching for: queen
Found 20 songs
Getting stream for: fJ9rUzIMcZQ
Stream URL obtained, bitrate: 128
```

### Ver logs del frontend

1. Abre DevTools (F12)
2. Console tab
3. Busca mensajes de `[JoaoList]`

### Network tab

Verifica las requests:
1. DevTools → Network
2. Filtra por "api"
3. Verifica que las requests a `/api/search` y `/api/stream` respondan con 200

## Reportar Issues

Si encuentras un bug, incluye:

1. **Pasos para reproducir**
2. **Comportamiento esperado vs actual**
3. **Screenshots o video**
4. **Console logs** (F12 → Console)
5. **Network logs** (F12 → Network)
6. **Navegador y versión**
7. **Sistema operativo**

---

**¿Todo funciona? ¡A disfrutar tu música! 🎵**
