# Wanderlust Explorer

MVP del explorador de experiencias de **Wanderlust Labs**: un catálogo de 100 experiencias de viaje que se explora, busca y filtra sin recargar la página, con el estado de los filtros guardado en la URL para que cualquier vista sea compartible.

Construido con Next.js (App Router), TypeScript y Tailwind CSS. Sin backend, sin base de datos y **sin ninguna librería externa de gestión de estado**.

---

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Home con hero a pantalla completa y CTA al explorador |
| `/experiences` | Explorador: buscador, filtros de categoría y destino, cuadrícula de 100 tarjetas |
| `/experiences/[id]` | Detalle con hero a sangre, descripción y resumen lateral de reserva |
| `/favorites` | Las experiencias guardadas durante la sesión |
| `/profile` | Perfil simulado con el contador de favoritos en vivo |

---

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre **http://localhost:3000**.

> **Ojo con la IP de red.** En desarrollo, Next 16 bloquea las peticiones cross-origin a sus recursos internos. Si abres la aplicación desde la IP de tu red local (`http://192.168.x.x:3000`) en lugar de `localhost`, el HTML llega bien renderizado pero **el cliente nunca hidrata**: la página se ve perfecta y no responde a ningún clic. El WebSocket de HMR devuelve un 403 y no hay forma de arreglarlo desde `allowedDevOrigins`.
>
> Para probar desde el móvil u otro equipo de la red, usa una build de producción, que no tiene HMR y funciona por IP sin problemas:
>
> ```bash
> npm run build
> npm start
> ```

Otros comandos:

```bash
npm run build   # build de producción
npm start       # sirve la build
npm run lint    # ESLint
```

---

## Qué hace

**Búsqueda por texto.** Compara el término contra el título y el destino mediante una expresión regular, ignorando mayúsculas y tildes: `japon` encuentra las experiencias de "Kioto, Japón". Los caracteres especiales se escapan antes de construir la expresión, así que teclear `(` no rompe la página. La URL se reescribe con 280 ms de *debounce* para no hacerlo en cada pulsación.

**Filtros combinables.** Categoría (tira horizontal con subrayado en escritorio, desplegable en móvil) y destino (agrupado en países y ciudades). Se combinan entre sí y con la búsqueda mediante lógica AND. Las opciones salen del propio dataset, no de listas escritas a mano.

**La URL es la fuente de verdad.** Los filtros viven en los query params y la relación es bidireccional: al cargar `/experiences?search=velero&category=adventure&destination=Croacia` los tres controles aparecen prerrellenados y la cuadrícula ya filtrada; al tocar un control, la URL se reescribe sin recarga y sin saltar el scroll. Los parámetros vacíos se eliminan y un valor inexistente se ignora en lugar de romper.

**Favoritos en memoria.** Un `useState<string[]>` en un componente de cliente montado una sola vez en el layout raíz. Desde el contenedor de cada página hacia abajo, el estado y la función de alternado viajan como props explícitas hasta el botón del corazón. El contador del menú, la página de favoritos y el perfil reflejan el cambio al instante. No hay persistencia: al refrescar, la lista se vacía.

**Estados vacíos** definidos tanto para "ningún resultado" como para "ningún favorito", con acción para salir del callejón.

---

## Decisiones técnicas

**Sin librerías de estado.** Todo se construye con primitivas de React. El `Context` aparece únicamente como canal de transporte para cruzar la frontera del layout de servidor, que no puede pasar funciones como props a `children`.

**Server Components por defecto.** Solo se marcan como cliente las piezas que lo necesitan: el explorador, la tarjeta, el menú, el botón de favoritos y el contador del perfil. La home, el detalle y el perfil se renderizan en el servidor.

**Todo el detalle es estático.** `generateStaticParams` prerenderiza las 100 rutas de `/experiences/[id]` en tiempo de build.

**Dataset generado y validado por script.** Las 100 experiencias cumplen reglas comprobadas automáticamente: ids únicos en slug ASCII sin tildes, 20 experiencias por categoría, 22 destinos de 19 países, precios entre 15 y 600 EUR y valoraciones de un decimal.

---

## Design References

Antes de escribir un solo componente se analizaron tres interfaces reales de descubrimiento con tarjetas, búsqueda y filtros. De cada una se extrajeron decisiones concretas aplicadas al MVP.

### 1. Airbnb — Experiences (`airbnb.com/experiences`)

El referente principal de la estética "clean discovery UI".

- Cuadrícula de tarjetas con fotos redondeadas, corazón de guardado, precio y valoración, sin borde ni sombra: la profundidad la aporta la fotografía, no la elevación. Es exactamente el modelo de nuestra `ExperienceCard`.
- La barra de filtros es discreta y escaneable, y nunca compite con las fotos que quedan debajo → nuestro `FilterPanel` va en una franja sticky, ligera, con controles neutros.
- La tira horizontal de categorías marca la pestaña activa con un subrayado fino y un cambio de peso tipográfico, no con color de relleno → patrón adoptado para el filtro de categoría en viewport ancho.
- Un único color de acento reservado para la acción primaria y el estado "guardado"; el resto de la interfaz en grises y blanco con mucho aire.

### 2. GetYourGuide — Página de resultados (`getyourguide.com`)

Referencia funcional del sistema de búsqueda y filtros de un marketplace de actividades.

- Búsqueda persistente en la cabecera que se mantiene visible en la página de resultados, con el término siempre a la vista.
- Recuento de resultados sobre la cuadrícula → nuestro `ResultsCount`.
- Chips de filtros activos con descarte individual y un "limpiar todo" global → nuestro `ActiveFilters`.
- Filtros reflejados en la URL, lo que hace que cualquier vista filtrada sea compartible.

### 3. Klook — Explorar por destino (`klook.com`)

Referencia de densidad y jerarquía cuando hay muchos resultados por destino.

- Tarjetas compactas con insignia de categoría sobre la imagen y bloque inferior de precio y valoración alineados, que soporta bien 100 items sin cansar la vista.
- Filtros por destino y por tipo de actividad combinables, con estado vacío explícito.
- Página de detalle con hero a sangre, resumen lateral y descripción larga debajo → estructura de nuestro `/experiences/[id]`.

### Design tokens

Definidos como variables CSS en `src/app/globals.css` y expuestos a Tailwind con `@theme inline`.

| Token | Valor |
|---|---|
| Acento primario | `#FF5A5F` coral, **solo** para CTA y estado favorito |
| Texto | `#222222` principal, `#767676` secundario |
| Fondo | `#FFFFFF` lienzo, `#F7F7F7` superficies suaves |
| Borde | `#E6E6E6` |
| Radios | 12 px inputs, 16 px tarjetas, 20 px paneles |
| Tipografía | Inter vía `next/font` |
| Rejilla | Grid de 1 / 2 / 3 / 4 columnas según breakpoint |

---

## Estructura del proyecto

```
nextjs-wanderlust-explorer/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Layout raíz: fuente, Navbar y provider de favoritos
│   │   ├── page.tsx                    # Home (/)
│   │   ├── globals.css                 # Tailwind + design tokens
│   │   ├── experiences/
│   │   │   ├── page.tsx                # Explorador — Suspense sobre el componente de cliente
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Detalle, prerenderizado con generateStaticParams
│   │   │       └── not-found.tsx       # 404 controlado para un id inexistente
│   │   ├── favorites/
│   │   │   ├── page.tsx                # Favoritos (componente de cliente)
│   │   │   └── layout.tsx              # Solo metadata: un cliente no puede exportarla
│   │   └── profile/
│   │       └── page.tsx                # Perfil simulado
│   ├── components/
│   │   ├── Navbar.tsx                  # Navegación con contador de favoritos
│   │   ├── ExperienceExplorer.tsx      # Orquesta búsqueda, filtros y sincronización con la URL
│   │   ├── SearchBar.tsx               # Input controlado del buscador
│   │   ├── FilterPanel.tsx             # Categoría (tira + select) y destino (países y ciudades)
│   │   ├── ActiveFilters.tsx           # Chips de filtros activos
│   │   ├── ResultsCount.tsx            # "Mostrando X de 100 experiencias"
│   │   ├── ExperienceGrid.tsx          # Cuadrícula responsive
│   │   ├── ExperienceCard.tsx          # Tarjeta con corazón de favoritos
│   │   ├── FavoriteButton.tsx          # Botón de guardado del detalle
│   │   ├── FavoritesSummary.tsx        # Contador reactivo del perfil
│   │   └── EmptyState.tsx              # Sin resultados / sin favoritos
│   ├── hooks/
│   │   └── useFavorites.tsx            # Provider y hook, solo con primitivas de React
│   ├── data/
│   │   └── experiences.ts              # Las 100 experiencias
│   ├── lib/
│   │   └── filters.ts                  # Filtrado, escapado de regex y plegado de tildes
│   └── types/
│       └── experience.ts               # Experience, Category y etiquetas
├── CONTEXT.md                          # Especificación y fuente de verdad del MVP
├── README.md
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Fuera de alcance

Backend, API o base de datos; autenticación real; persistencia de favoritos; reservas, pagos, mapas, i18n y tests automatizados; paginación o scroll infinito. El botón de reserva del detalle está deshabilitado a propósito, con una nota que lo explica.
