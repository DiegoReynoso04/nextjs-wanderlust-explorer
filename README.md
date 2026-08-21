# Wanderlust Explorer

Descripción · Stack · Cómo ejecutarlo (`npm install`, `npm run dev`)

## Features
- Explorador con búsqueda y filtros sincronizados con la URL
- Detalle de experiencia, favoritos en memoria y perfil simulado

## Design References

Antes de escribir un solo componente se analizaron tres interfaces reales de descubrimiento con
tarjetas, búsqueda y filtros. De cada una se extrajeron decisiones concretas aplicadas al MVP.

### 1. Airbnb — Experiences (`airbnb.com/experiences`)

El referente principal de la estética "clean discovery UI".

- <cite index="1-1">Cuadrícula de tarjetas con fotos redondeadas, corazón de guardado, precio y rating, sin borde ni sombra: la profundidad la aporta la fotografía, no la elevación</cite>. Es exactamente el modelo de nuestra `ExperienceCard`.
- <cite index="1-1">La barra de filtros es discreta y escaneable, y nunca compite con las fotos que quedan debajo</cite> → nuestro `FilterBar` va en una franja sticky, ligera, con controles neutros.
- <cite index="6-1">La tira horizontal de categorías usa una pestaña activa con subrayado de 2 px y un cambio de peso tipográfico</cite> → patrón adoptado para el filtro de categoría en viewport ancho.
- Un único color de acento reservado para la acción primaria y el estado "guardado"; el resto de la interfaz en grises y blanco con mucho aire.

### 2. GetYourGuide — Página de resultados (`getyourguide.com`)

Referencia funcional del sistema de búsqueda y filtros de un marketplace de actividades.

- Búsqueda persistente en la cabecera que se mantiene visible en la página de resultados, con el término siempre a la vista.
- Recuento de resultados sobre la cuadrícula ("X activities found") → nuestro `ResultsCount`.
- Chips de filtros activos con descarte individual y un "Clear all" global → nuestro `ActiveFilters`.
- Filtros reflejados en la URL, lo que hace que cualquier vista filtrada sea compartible: es el mismo requisito que nos pide la PM.

### 3. Klook — Explorar por destino (`klook.com`)

Referencia de densidad y jerarquía cuando hay muchos resultados por destino.

- Tarjetas compactas con badge de categoría sobre la imagen y bloque inferior de precio + rating alineados, que soporta bien 100 items sin cansar la vista.
- Filtros por destino y por tipo de actividad combinables, con estado vacío explícito y sugerencia de relajar filtros.
- Página de detalle con hero a sangre, resumen lateral (precio, duración, rating) y descripción larga debajo → estructura de nuestro `/experiences/[id]`.

### Principios de diseño derivados

<cite index="10-1">Una barra horizontal de filtros en la parte superior es compacta y adecuada cuando hay pocos tipos de filtro, y conviene ofrecer siempre un "clear all" junto al descarte de filtros individuales</cite>. Además, <cite index="13-1">el buscador debe situarse donde el usuario mira primero y las estadísticas de resultados sobre el listado aportan contexto</cite>.

| Token | Valor sugerido |
|---|---|
| Acento primario | Teal/coral saturado, **solo** para CTA y estado favorito |
| Texto | `#222` principal, `#767676` secundario |
| Fondo | `#FFFFFF` lienzo, `#F7F7F7` superficies suaves |
| Radios | 12–20 px en tarjetas e inputs |
| Tipografía | Geométrica-humanista (Inter vía `next/font`) |
| Rejilla | Base de 4 px; grid `1 / 2 / 3 / 4` columnas según breakpoint |

---

## Project Structure

```
nextjs-wanderlust-explorer/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Layout global con el estado de favoritos
│   │   ├── page.tsx             # Home (/)
│   │   ├── experiences/
│   │   │   ├── page.tsx         # Explorador (/experiences)
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Detalle (/experiences/[id])
│   │   ├── favorites/
│   │   │   └── page.tsx         # Favoritos (/favorites)
│   │   └── profile/
│   │       └── page.tsx         # Perfil (/profile)
│   ├── components/
│   │   ├── Navbar.tsx           # Menú de navegación con contador de favoritos
│   │   ├── ExperienceCard.tsx   # Tarjeta individual con toggle de favoritos
│   │   ├── ExperienceGrid.tsx   # Cuadrícula responsive de tarjetas
│   │   ├── SearchBar.tsx        # Input de búsqueda conectado a la URL
│   │   ├── FilterPanel.tsx      # Desplegables de categoría y destino
│   │   ├── ActiveFilters.tsx    # Chips de filtros activos
│   │   ├── ResultsCount.tsx     # "Mostrando X de 100 experiencias"
│   │   └── EmptyState.tsx       # Estado sin resultados / sin favoritos
│   ├── hooks/
│   │   └── useFavorites.ts      # Custom hook sobre useState nativo
│   ├── data/
│   │   └── experiences.ts       # Array con las 100 experiencias
│   ├── lib/
│   │   └── filters.ts           # Lógica de búsqueda y filtrado
│   └── types/
│       └── experience.ts        # Interfaces de TypeScript
├── CONTEXT.md
├── README.md
└── package.json
```

---