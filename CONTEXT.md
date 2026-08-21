# CONTEXT.md — Wanderlust Labs: Explorador de Experiencias (MVP)

> Documento de contexto y especificación del MVP. Es la fuente de verdad para cualquier persona
> —o asistente de IA— que trabaje en este repositorio.

---

## 1. Contexto de producto

**Wanderlust Labs** es una startup de travel-tech que construye una plataforma para **descubrir y guardar experiencias únicas** alrededor del mundo: desde tours gastronómicos en Bangkok hasta rutas de vela por el Adriático.

La diseñadora de producto ya ha preparado las referencias visuales (ver §3). El equipo de ingeniería necesita a un frontend que dé vida al **MVP del explorador**: una aplicación multipágina con **React + Next.js (App Router)** donde los usuarios puedan **explorar, buscar y filtrar** experiencias **sin recargar la página**.

La sensación que buscamos es la de hojear un catálogo bien editado: fotografía grande, poco texto, resultados que reaccionan al instante y ninguna espera intermedia. Todo el peso visual lo llevan las imágenes; la interfaz debe desaparecer.

### Objetivos del MVP

1. Explorar un catálogo de 100 experiencias en una cuadrícula de tarjetas.
2. Buscar por título y filtrar por categoría y destino, de forma combinable.
3. **Estado de búsqueda y filtros en la URL** para que los enlaces sean compartibles.
4. Ver el detalle completo de una experiencia.
5. Marcar/desmarcar favoritos y consultarlos en una página propia.
6. Un perfil de usuario simulado con el número de favoritos guardados.

### Fuera de alcance (v1)

- Backend, API o base de datos (el dataset es un fichero local de TypeScript).
- Autenticación real.
- Persistencia de favoritos (`localStorage`, cookies o servidor).
- Reservas, pagos, mapas, i18n, tests automatizados.
- Paginación o scroll infinito (100 items se renderizan de una vez).

---

## 2. Stack técnico

| Área | Decisión |
|---|---|
| Framework | Next.js (App Router) |
| Lenguaje | TypeScript (modo estricto) |
| Estilos | Tailwind CSS |
| Linting | ESLint (config de Next.js) |
| Estructura | `src/` directory |
| Alias de imports | `@/*` |
| Estado global | `useState` de nivel superior, expuesto mediante props o custom hooks |
| Navegación y URL | `useSearchParams`, `usePathname`, `useRouter` (`next/navigation`) |
| Datos | Array local en `src/data/experiences.ts` |

### Restricción de gestión de estado

**No se usa ninguna librería externa de gestión de estado** (Redux, Zustand, Jotai, Recoil, MobX, React Query o similares). Todo el estado vive en el **`useState` nativo de React** y se comparte **mediante props o custom hooks**. Cualquier abstracción que se cree —por ejemplo, un `useFavorites`— debe construirse únicamente con primitivas de React (`useState`, `useMemo`, `useCallback` y, como mucho, el `Context` que el propio React incluye como canal de transporte). Si aparece una dependencia de estado en el `package.json`, la entrega no es válida.

### Comando de creación del proyecto

```bash
npx create-next-app@latest nextjs-wanderlust-explorer \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

---

## 3. Design References

Antes de escribir un solo componente se analizaron tres interfaces reales de descubrimiento con tarjetas, búsqueda y filtros. De cada una se extrajeron decisiones concretas aplicadas al MVP.

### 1. Airbnb — Experiences (`airbnb.com/experiences`)

El referente principal de la estética "clean discovery UI".

- Su cuadrícula usa fotos redondeadas con corazón de guardado, precio y valoración, sin borde ni sombra: la profundidad la aporta la fotografía, no la elevación de la tarjeta. Es exactamente el modelo de nuestra `ExperienceCard`.
- La barra de filtros es discreta y escaneable, y nunca compite con las fotos que quedan debajo → nuestro `FilterPanel` va en una franja sticky, ligera, con controles neutros.
- La tira horizontal de categorías marca la pestaña activa con un subrayado fino y un cambio de peso tipográfico, no con color de relleno → patrón adoptado para el filtro de categoría en viewport ancho.
- Un único color de acento reservado para la acción primaria y el estado "guardado"; el resto de la interfaz en grises y blanco, con mucho aire.

### 2. GetYourGuide — Página de resultados (`getyourguide.com`)

Referencia funcional del sistema de búsqueda y filtros de un marketplace de actividades.

- Búsqueda persistente en la cabecera, que se mantiene visible en la página de resultados con el término siempre a la vista.
- Recuento de resultados sobre la cuadrícula ("X activities found") → nuestro `ResultsCount`.
- Chips de filtros activos con descarte individual y un "Clear all" global → nuestro `ActiveFilters`.
- Filtros reflejados en la URL, lo que hace que cualquier vista filtrada sea compartible: es el mismo requisito que nos pide la PM.

### 3. Klook — Explorar por destino (`klook.com`)

Referencia de densidad y jerarquía cuando hay muchos resultados por destino.

- Tarjetas compactas con insignia de categoría sobre la imagen y bloque inferior de precio y valoración alineados, que soporta bien 100 items sin cansar la vista.
- Filtros por destino y por tipo de actividad combinables, con estado vacío explícito y sugerencia de relajar filtros.
- Página de detalle con hero a sangre, resumen lateral (precio, duración, valoración) y descripción larga debajo → estructura de nuestro `/experiences/[id]`.

### Principios de diseño derivados

Una barra horizontal de filtros en la parte superior es compacta y adecuada cuando hay pocos tipos de filtro, y conviene ofrecer siempre un "clear all" junto al descarte de filtros individuales. Además, el buscador debe situarse donde el usuario mira primero —arriba y ancho— y las estadísticas de resultados sobre el listado aportan contexto antes de empezar a scrollear.

| Token | Valor sugerido |
|---|---|
| Acento primario | Teal/coral saturado, **solo** para CTA y estado favorito |
| Texto | `#222` principal, `#767676` secundario |
| Fondo | `#FFFFFF` lienzo, `#F7F7F7` superficies suaves |
| Radios | 12–20 px en tarjetas e inputs |
| Tipografía | Geométrica-humanista (Inter vía `next/font`) |
| Rejilla | Base de 4 px; grid de 1 / 2 / 3 / 4 columnas según breakpoint |

---

## 4. Arquitectura de páginas y rutas

| Ruta | Página | Descripción y funcionalidades |
|---|---|---|
| `/` | Home | Sección hero atractiva con una llamada a la acción que lleva a `/experiences`. |
| `/experiences` | Explorador | Listado completo de tarjetas con barra de búsqueda y al menos dos filtros (categoría y destino), sincronizados en tiempo real con los query parameters. |
| `/experiences/[id]` | Detalle | Vista detallada de una experiencia concreta, obtenida del dataset local por su `id`. |
| `/favorites` | Favoritos | Listado de las experiencias que el usuario ha marcado como favoritas durante la sesión. |
| `/profile` | Perfil | Página estática con un perfil de usuario simulado y un resumen con el número de favoritos guardados. |

### Home

Una sola pantalla de bienvenida: titular de marca, una frase que explique la propuesta de valor y un botón principal que conduce al explorador. La navegación debe ser de cliente, sin recarga completa. Si sobra tiempo, una fila de tres o cuatro experiencias destacadas y accesos directos por categoría que ya lleguen al explorador prefiltrado.

### Explorador

Es el corazón del MVP y donde se juega la nota. De arriba abajo: buscador ancho, fila de filtros (categoría y destino), recuento de resultados, chips de filtros activos si los hay, y la cuadrícula de tarjetas. Cuando ninguna experiencia encaja, en lugar de una página vacía aparece un mensaje que explica la situación y ofrece limpiar los filtros.

La cuadrícula es responsiva: una columna en móvil, dos en tablet y tres o cuatro en escritorio.

**La tarjeta de experiencia** muestra la imagen en formato apaisado con esquinas redondeadas, la insignia de categoría arriba a la izquierda, el corazón de favoritos arriba a la derecha, y debajo el título (truncado a dos líneas), el destino en tono secundario, la valoración con estrella y el precio. La tarjeta entera es un enlace al detalle, con una excepción importante: pulsar el corazón guarda la experiencia y **no** navega.

### Detalle

Recupera la experiencia buscando su `id` dentro del dataset local. Presenta la imagen a gran tamaño, el título, la categoría, el destino, la valoración, el precio y la descripción completa, además del mismo botón de favorito que en la tarjeta y un enlace de vuelta al explorador. Si el `id` de la URL no existe, la página muestra un 404 controlado en lugar de romperse.

### Favoritos

Reutiliza exactamente la misma tarjeta del explorador, filtrando el catálogo por los identificadores guardados. Encabeza la página el recuento ("tienes N experiencias guardadas") y, cuando la lista está vacía, un estado explicativo con un botón que devuelve al explorador. Al refrescar el navegador la lista se vacía: es el comportamiento esperado en esta versión.

### Perfil

Página estática con un usuario inventado —avatar, nombre, alias, ubicación, breve biografía y año de alta— acompañado de una tarjeta de resumen con el número de favoritos guardados. Ese número debe leerse del estado real de la aplicación, nunca escribirse a mano: si el usuario guarda una experiencia y navega al perfil, el contador ya refleja el cambio.

---

## 5. Modelo de datos

### 5.1 Tipos — `src/types/experience.ts`

```ts
export const CATEGORIES = [
  'Adventure',
  'Culture',
  'Food',
  'Wellness',
  'Nature',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Experience {
  id: string;            // slug ASCII sin tildes, p. ej. "ruta-en-velero-adriatico-042"
  title: string;         // junto con destination, campo sobre el que se aplica la búsqueda (§6)
  description: string;   // 1–3 frases, se muestra completa en el detalle
  category: Category;
  destination: string;   // "Ciudad, País" — p. ej. "Split, Croacia". Buscable y filtrable
  price: number;         // en EUR, entero
  rating: number;        // 1.0–5.0, un decimal
  imageUrl: string;      // placeholder, p. ej. https://picsum.photos/seed/<id>/800/600
}
```

Campos opcionales bienvenidos si el generador los produce (`duration`, `groupSize`, `language`, `highlights: string[]`): enriquecen la página de detalle, pero **no son obligatorios**.

### 5.2 Dataset — `src/data/experiences.ts`

- **100 objetos** exactamente, generados con un asistente de código con IA.
- Export nombrado: `export const experiences: Experience[] = [ ... ];`
- Reglas de calidad del dataset:
  - `id` único en todo el array; usar slug derivado del título + índice.
  - Distribución razonable entre las **5 categorías** (~20 cada una).
  - Al menos **15–25 destinos distintos**, con varias experiencias por destino para que el filtro tenga sentido.
  - Incluir explícitamente casos del brief: algo de **vela / velero** en **Croacia** y algún **tour gastronómico** en **Bangkok, Tailandia**, para poder validar la URL de ejemplo. Si no existen en los datos, el enlace de demostración devuelve una lista vacía delante del cliente.
  - Títulos y descripciones **en castellano**, igual que el resto de la interfaz, con palabras repetidas entre ellos (p. ej. "ruta", "taller", "tour", "paseo", "mercado") para que la búsqueda parcial devuelva varios resultados.
  - Los destinos también van en castellano, con el exónimo cuando existe: "Nápoles, Italia", "Kioto, Japón", "Estambul, Turquía".
  - El `id` se deriva del título pero **plegando tildes y eñes a ASCII**, para que las URLs de detalle no lleven caracteres escapados.
  - `price` entre 15 y 600; `rating` entre 3.5 y 5.0.
  - `imageUrl` con seed determinista por `id`, para que la imagen no cambie entre renders.

> **Prompt sugerido para el asistente de IA:** «Genera un array TypeScript de exactamente 100 objetos `Experience` con la interfaz de arriba. Experiencias de viaje reales y variadas (gastronomía, aventura, cultura, bienestar, naturaleza) en ciudades de todo el mundo. IDs en slug-case ASCII sin tildes y únicos, títulos en castellano de 4–9 palabras, descripciones de 1–2 frases en castellano, precios enteros en EUR, ratings con un decimal. Sin comentarios, solo el array exportado.»

---

## 6. Comportamiento de búsqueda, filtros y URL

### Sincronización con la URL

La búsqueda y los filtros activos viven en la URL como query parameters. El enlace de referencia es:

```
/experiences?search=velero&category=adventure&destination=Croacia
```

La relación es bidireccional. Al cargar o refrescar la página, los valores presentes en la URL prerrellenan los inputs de búsqueda y selección, y la cuadrícula se renderiza ya filtrada. Al revés, cualquier cambio en un input reescribe la URL al instante, sin recarga y sin que la página salte al principio del scroll.

Tres reglas de higiene:

1. Los parámetros vacíos o en "todos" se eliminan de la URL; nunca deben quedar restos del tipo `?search=&category=`.
2. Los valores llegan tal y como los escriba quien comparta el enlace, así que las comparaciones son insensibles a mayúsculas **y a tildes**: `category=adventure` selecciona la categoría *Adventure*, y `destination=japon` selecciona *Japón*. Con el destino conviene además aceptar coincidencias parciales, para que `destination=Croacia` encuentre las experiencias de "Split, Croacia".
3. Un valor que no exista —una categoría inventada, por ejemplo— se ignora y se trata como "todos", en lugar de dejar la página en blanco o lanzar un error.

La URL es la fuente de verdad de los filtros. El único estado local admisible es el texto "en vuelo" del buscador mientras se teclea.

### Lógica de filtrado

**Búsqueda por texto.** Compara el término contra el **título y el destino** de cada experiencia mediante una expresión regular *case-insensitive*, del estilo `/term/i`, con coincidencia parcial: buscar "velero" encuentra "Ruta en velero al atardecer por el Adriático", y buscar "japon" encuentra las experiencias de "Kioto, Japón". Como el destino se guarda en formato "Ciudad, País", una sola expresión cubre ciudad y país sin necesidad de partir la cadena.

Con el catálogo en castellano, la comparación además **pliega las tildes en los dos lados** antes de evaluarse: nadie debería tener que escribir "Japón" con acento para encontrarlo. Basta con que uno de los dos campos case:

```ts
// fold() descompone en NFD y descarta las marcas diacríticas: "Japón" → "Japon"
const pattern = new RegExp(escapeRegExp(fold(term)), 'i');
pattern.test(fold(experience.title)) || pattern.test(fold(experience.destination));
```

Dos precauciones prácticas: escapar los caracteres especiales que escriba el usuario antes de construir la expresión —un paréntesis suelto provocaría un error de sintaxis y tumbaría la página— y esperar unos 250–300 milisegundos entre pulsación y actualización de la URL, para no reescribirla en cada tecla.

> **Nota de revisión.** La primera versión de este documento limitaba la búsqueda al título. Se amplió al destino tras comprobar sobre el dataset real que **33 de los nombres de ciudad y país no aparecen en ningún título**: teclear "Indonesia", "Croacia", "Japón" o "Barcelona" devolvía cero resultados, que es justo lo que un usuario espera encontrar en un buscador de viajes. Es además el comportamiento de GetYourGuide y Klook, las referencias de §3. El filtro de destino no desaparece: sigue siendo un control independiente, y ahora hay dos caminos para la misma consulta.

**Filtros por categoría y destino.** Funcionan de forma independiente entre sí y se combinan con la búsqueda de texto con lógica AND: una experiencia se muestra solo si supera los tres criterios activos. Las opciones de ambos controles se derivan del propio dataset, sin listas escritas a mano, de modo que añadir un destino nuevo a los datos lo hace aparecer automáticamente en el filtro.

El control de destino agrupa sus opciones en **países** y **ciudades**, y ambos valen como valor del filtro. Esto es posible porque el cotejo del destino también es por coincidencia parcial: elegir "Croacia" recoge "Split, Croacia" y "Dubrovnik, Croacia" a la vez, mientras que elegir "Split, Croacia" acota a esa ciudad.

Todo el filtrado ocurre en el cliente y en memoria, sin peticiones de red y sin recargas.

---

## 7. Sistema de favoritos

**Interacción.** Un icono de corazón en cada tarjeta permite activar o desactivar la experiencia en la lista de favoritos. El cambio se refleja de inmediato en la propia tarjeta, en el contador del menú de navegación, en la página de favoritos y en el resumen del perfil.

**Estado.** Se guarda en un `useState` de nivel superior —un array de identificadores— y se pasa hacia abajo mediante props a los componentes que lo requieran. Como el layout raíz del App Router es un componente de servidor, ese "nivel superior" se materializa en un componente de cliente montado una sola vez en el layout: así el estado sobrevive a la navegación entre el explorador, los favoritos y el perfil. Desde el contenedor de cada página hacia abajo, el estado y la función de alternado viajan explícitamente como props hasta la tarjeta y el botón. La lógica común (alternar, comprobar si está guardado, contar) se encapsula en un custom hook propio, `useFavorites`, escrito solo con primitivas de React. **Ninguna librería externa de estado**, según la restricción de §2.

**Persistencia.** No se requiere almacenamiento persistente —ni `localStorage` ni base de datos— en esta versión.

**Detalles de acabado.** El corazón es un botón real, no un icono decorativo, con su etiqueta accesible y su estado anunciado para lectores de pantalla. Lleno y en color de acento cuando está guardado; contorneado y con una sombra suave sobre la foto cuando no lo está. Una micro-animación de escala al pulsarlo hace que la acción se sienta física. Y, de nuevo: pulsarlo no debe navegar al detalle.

---

## 8. Estructura de directorios

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

## 9. Criterios de aceptación

- [ ] `npm run build` y `npm run lint` pasan sin errores ni warnings.
- [ ] El `package.json` **no** contiene ninguna librería externa de gestión de estado.
- [ ] Existen y funcionan las 5 rutas: `/`, `/experiences`, `/experiences/[id]`, `/favorites`, `/profile`.
- [ ] El dataset tiene exactamente **100** experiencias con todos los campos obligatorios e `id` únicos.
- [ ] El botón del hero navega a `/experiences` **sin recarga completa** (`next/link`).
- [ ] Escribir en el buscador actualiza la cuadrícula y la URL (`?search=...`) sin recargar.
- [ ] Los filtros de categoría y destino funcionan **por separado** y **combinados** con la búsqueda.
- [ ] Abrir `/experiences?search=velero&category=adventure&destination=Croacia` en una pestaña nueva muestra la vista ya filtrada **y** los tres controles prerrellenados.
- [ ] Limpiar un filtro elimina su parámetro de la URL (no quedan `key=` vacíos).
- [ ] La búsqueda es **case-insensitive** vía regex y no rompe con caracteres especiales (`(`, `*`, `[`).
- [ ] La búsqueda ignora las tildes: `?search=japon` y `?search=japón` devuelven lo mismo.
- [ ] Cada tarjeta enlaza a su detalle y el detalle resuelve la experiencia por `id` desde el dataset local.
- [ ] Un `id` inexistente muestra un 404 controlado, no un crash.
- [ ] El corazón alterna el favorito y el cambio se refleja al instante en la tarjeta, en el contador del navbar, en `/favorites` y en `/profile`.
- [ ] Pulsar el corazón **no** navega al detalle.
- [ ] `/favorites` y el explorador comparten estado durante la navegación cliente.
- [ ] `/profile` muestra `favorites.length` en vivo, no un número hardcodeado.
- [ ] Estados vacíos definidos para "sin resultados" y "sin favoritos".
- [ ] Responsive: 1 columna en móvil, 2 en tablet, 3–4 en escritorio.

---

## 10. Notas y trampas conocidas

Unas cuantas cosas que, si no se anticipan, cuestan una tarde:

- Cualquier componente que lea los parámetros de la URL debe estar envuelto en un límite de `Suspense`, o la compilación de producción fallará.
- En las versiones recientes de Next.js los parámetros de ruta llegan de forma asíncrona a la página de detalle; hay que esperarlos antes de usar el `id`.
- Si se usa el componente de imagen optimizada de Next.js con URLs remotas, el dominio del servicio de placeholders debe declararse en la configuración. Para un MVP también vale una etiqueta de imagen normal con carga diferida.
- Al reescribir la URL conviene desactivar el salto de scroll, o la página volverá arriba en cada pulsación de tecla.
- Marcar como componentes de cliente solo lo imprescindible: el explorador, la tarjeta, el contenedor de favoritos y el menú. La home, el detalle y el perfil pueden renderizarse en el servidor salvo por sus islas interactivas.
- Renderizar cien tarjetas de golpe es perfectamente asumible. Si la fluidez se resintiera, memorizar la tarjeta antes de plantear paginación.

---