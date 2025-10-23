# Guía de Deployment - JoaoList Web

## Deployment en Vercel (Recomendado)

Vercel es la plataforma ideal para este proyecto ya que soporta tanto el frontend de React como las serverless functions del backend.

### Paso 1: Preparar el repositorio

```bash
# Inicializar git (si no lo has hecho)
git init
git add .
git commit -m "Initial commit: JoaoList Web"

# Crear repositorio en GitHub y pushear
git remote add origin https://github.com/tu-usuario/joaolist-web.git
git push -u origin main
```

### Paso 2: Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta o inicia sesión
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite
5. **No necesitas configurar nada más**, el `vercel.json` ya está configurado

### Paso 3: Deploy

Haz clic en "Deploy" y espera a que termine. ¡Listo! 🎉

### Variables de Entorno (Opcional)

Si en el futuro necesitas configurar variables de entorno:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Añade las variables necesarias

## Actualizaciones Automáticas

Cada vez que hagas push a tu rama main, Vercel desplegará automáticamente los cambios.

```bash
git add .
git commit -m "Mejoras en la interfaz"
git push
```

## Deployment Manual con Vercel CLI

Si prefieres desplegar desde la terminal:

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## Alternativas de Deployment

### Netlify

1. Conecta tu repositorio en Netlify
2. Configura el build command: `npm run build`
3. Publish directory: `dist`
4. **Importante**: Las API functions necesitan ser adaptadas al formato de Netlify Functions

### Railway / Render (Con servidor Node.js)

Si prefieres un servidor tradicional en lugar de serverless:

1. Modifica el proyecto para usar Express en producción
2. Añade un `server.js` que sirva el frontend y las APIs
3. Configura el puerto desde variables de entorno

```javascript
// server.js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Importar API routes
import searchHandler from './api/search.js';
import streamHandler from './api/stream.js';

app.use('/api/search', searchHandler);
app.use('/api/stream', streamHandler);

// Servir archivos estáticos del build
app.use(express.static('dist'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Troubleshooting

### Error: ytdl-core no funciona

Las librerías de YouTube pueden dejar de funcionar si Google actualiza su API. Soluciones:

```bash
# Actualizar ytdl-core a la última versión
npm update ytdl-core

# O usar una alternativa como play-dl
npm install play-dl
```

### Error: CORS en producción

Si tienes problemas de CORS, verifica que los headers estén correctamente configurados en `/api/*.ts`:

```typescript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
```

### Performance lenta

1. Activa el caché de Vercel en `vercel.json`
2. Considera usar un CDN para los assets estáticos
3. Implementa rate limiting en las API functions

### URLs de streaming expiran

Las URLs de YouTube expiran después de ~6 horas. El código ya maneja esto automáticamente recargando la URL cuando es necesario.

## Monitoreo

Para monitorear tu aplicación en producción:

1. **Vercel Analytics**: Activar en el dashboard de Vercel
2. **Logs**: Ver en Vercel Dashboard → Functions → Logs
3. **Sentry**: Para error tracking
   ```bash
   npm install @sentry/react @sentry/vite-plugin
   ```

## Costos

### Vercel (Hobby Plan - Gratis)
- 100GB bandwidth
- 100GB-Hrs serverless function execution
- Suficiente para uso personal y pequeños proyectos

### Consideraciones
- El streaming de audio consume ancho de banda
- Para uso intensivo, considera el plan Pro de Vercel ($20/mes)

## Backup y Datos

La aplicación usa IndexedDB local del navegador. Para implementar backup:

1. Agregar sincronización con Firebase/Supabase
2. Exportar/importar datos como JSON
3. Usar localStorage como fallback

## Seguridad

En producción, considera:

1. **Rate Limiting**: Limitar requests por IP
   ```typescript
   // api/middleware/rateLimit.ts
   ```

2. **API Keys**: Si planeas APIs externas

3. **HTTPS**: Vercel lo provee automáticamente

## Performance Tips

1. **Lazy Loading**: Los componentes ya usan code splitting
2. **Service Worker**: Para PWA y cache
3. **Compression**: Vercel lo hace automáticamente
4. **CDN**: Los assets se sirven desde CDN de Vercel

---

**¿Necesitas ayuda?** Abre un issue en el repositorio de GitHub
