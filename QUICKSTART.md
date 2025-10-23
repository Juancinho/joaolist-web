# Inicio Rápido - JoaoList Web

## Problema Actual
Si ves errores 500 en Vercel o problemas con el servidor local, sigue estos pasos:

## Solución Rápida

### 1. Limpia todo y reinstala

```bash
cd joaolist-web

# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### 2. Deploy directo a Vercel (RECOMENDADO)

La forma más fácil de probarlo es deployarlo directamente en Vercel:

```bash
# Si ya tienes vercel instalado
vercel

# O instálalo primero
npm install -g vercel
vercel login
vercel
```

Vercel automáticamente instalará las dependencias correctas (`youtubei.js`) que funcionan en su entorno serverless.

### 3. Probar localmente (alternativa)

Si quieres probar local:

```bash
# Primero matar todos los node processes
taskkill //F //IM node.exe

# Iniciar servidor API (Terminal 1)
cd joaolist-web
npm run dev:api

# Esperar 10 segundos para que inicie

# Iniciar frontend (Terminal 2)
cd joaolist-web
npm run dev

# Abrir navegador
# http://localhost:5173
```

## Verificar que Funciona

1. Ve a la pestaña "Buscar" (icono de lupa)
2. Busca "queen"
3. Deberías ver resultados de canciones
4. Haz clic en play en cualquier canción
5. Debería cargar y reproducirse

## Si todavía falla

### En Vercel:

1. Ve a tu dashboard de Vercel
2. Deployment → Functions → Logs
3. Busca errores en las funciones `/api/search` y `/api/stream`
4. Copia el error y repórtalo

### En Local:

1. Abre Chrome DevTools (F12)
2. Network tab
3. Busca las requests a `/api/search` y `/api/stream`
4. Ve el Response para ver el error exacto

## Notas Importantes

- **youtubei.js** es la única librería que necesitas para que funcione
- Las viejas dependencias (ytdl-core, youtube-sr, play-dl) ya fueron removidas
- Vercel necesita unos minutos para instalar las dependencias en el primer deploy

## Alternativa: Usar API de YouTube Direct

Si `youtubei.js` también falla en Vercel, puedes usar la API oficial de YouTube:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita YouTube Data API v3
4. Crea una API Key
5. Agrega la key como variable de entorno en Vercel: `YOUTUBE_API_KEY`

Luego modifica `/api/search.ts` y `/api/stream.ts` para usar la API oficial.

## Contacto

Si nada funciona, abre un issue con:
- Screenshot del error
- Logs de Vercel
- Output de `npm list youtubei.js`
