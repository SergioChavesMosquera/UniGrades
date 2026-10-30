# Rediseño Frontend UniGrades — Diseño

## Visión general

Este diseño aplica la identidad visual de `.kiro/steering/design-guidelines.md` sobre la capa
de presentación existente, **sin tocar** `services/`, `lib/supabase/`, `supabase/` ni
`types/domain.ts`. La estrategia es:

1. Centralizar todo el estilo en **tokens CSS** (`app/globals.css`) y reemplazar los estilos
   inline por clases/utilidades que leen esos tokens.
2. Enriquecer `components/ui` con primitivos presentacionales (`Card`, `StatusBadge`,
   `ProgressRing`, `StatCard`, `Logo`, `AnimatedNumber`), manteniendo las firmas de `Button`,
   `Input` y `Container`.
3. Introducir **tema claro/oscuro** con el mismo patrón cookie+server-action del idioma,
   resuelto en el servidor para evitar FOUC.
4. Añadir una función pura `lib/grade-forecast.ts` para la "tarjeta estrella" (cálculo en
   cliente, sin backend).
5. Rediseñar las pantallas existentes reutilizando sus hooks de React Query sin cambios.

Principio rector: **los componentes son "tontos"**. Reciben datos de los hooks existentes y
callbacks; no hablan con Supabase ni contienen reglas de negocio. La única lógica nueva es
presentacional (forecast de nota, animaciones) y vive fuera de `services/`.

### Mapa de impacto

| Archivo/área | Acción | Toca datos/negocio |
|---|---|---|
| `app/globals.css` | Reescribir: tokens, temas, base mobile-first | No |
| `app/layout.tsx` | Cargar fuentes, aplicar tema resuelto en server | No |
| `components/ui/*` | Rediseñar Button/Input/Container; agregar primitivos | No |
| `components/theme/*` (nuevo) | Toggle de tema + server action | No (solo cookie UI) |
| `components/nav/*` (nuevo) | Header de navegación de `/app` | No |
| `components/Logo.tsx` (nuevo) | 3 variantes + placeholder | No |
| `lib/theme/*` (nuevo) | config + request + action de tema | No (patrón i18n) |
| `lib/grade-forecast.ts` (nuevo) | cálculo "nota necesaria" | No (función pura) |
| `app/app/**/*Client.tsx` | Reestilizar, mismos hooks/callbacks | No |
| `app/(login|signup|page)` | Reestilizar landing + auth | No |
| `services/**`, `supabase/**`, `types/**`, `lib/supabase/**` | **Sin cambios** | — |

---

## Arquitectura

### Capas (sin cambios en las inferiores)

```
UI (pantallas + primitivos)      ← se rediseña
  ↓ consume
Hooks React Query (queries.ts)   ← intacto
  ↓ llama
Servicios (services/*)           ← intacto
  ↓ usa
Supabase (lib/supabase/*)        ← intacto
  ↓
Postgres: RN-1..7, vistas, RLS   ← intacto
```

Lógica presentacional nueva (fuera de la cadena de datos):
- `lib/grade-forecast.ts` — función pura, recibe datos ya cargados por los hooks.
- `lib/theme/*` — tema por cookie, análogo a `lib/i18n/*`.

---

## Componentes y diseño detallado

### 1. Tokens de diseño (`app/globals.css`)

Se reescribe `globals.css` con una capa de tokens semánticos y temas. Los componentes nunca
usan literales; leen variables.

```css
:root {
  /* Paleta de marca (fija, independiente del tema) */
  --brand-primary: #0B6B4F;   /* verde esmeralda */
  --brand-accent:  #2ED8A3;   /* menta / éxito */
  --brand-warning: #FFB020;   /* ámbar / en riesgo */
  --brand-danger:  #FF5C5C;   /* coral / peligro */

  /* Tipografía (variables inyectadas por next/font) */
  --font-title: var(--font-sora);
  --font-body:  var(--font-inter);
  --font-mono:  var(--font-jetbrains);

  /* Forma y espacio */
  --radius: 16px;        /* tarjetas (design-guidelines) */
  --radius-sm: 10px;     /* inputs/botones */
  --space: 16px;
  --space-xs: 8px; --space-lg: 24px; --space-xl: 32px;
  --max-width: 960px;
  --shadow-soft: 0 2px 8px rgba(15,27,45,.08), 0 1px 2px rgba(15,27,45,.06);
  --tap-min: 44px;       /* objetivo táctil mínimo */
}

/* Tema claro (por defecto) */
:root, [data-theme="light"] {
  --bg: #F7F8F5;
  --surface: #FFFFFF;
  --fg: #0F1B2D;
  --muted: #5B6770;      /* gris pizarra */
  --border: #E2E6E1;
  --primary: var(--brand-primary);
  --primary-fg: #FFFFFF;
  --focus-ring: var(--brand-accent);
}

/* Tema oscuro */
[data-theme="dark"] {
  --bg: #0F1B2D;         /* azul noche */
  --surface: #16243A;
  --fg: #F7F8F5;
  --muted: #9AA7B2;
  --border: #2A3A52; /* ver nota de contraste */
  --primary: var(--brand-accent);
  --primary-fg: #0F1B2D;
  --focus-ring: var(--brand-accent);
}

/* Sin elección explícita: seguir el SO */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { /* mismas vars que [data-theme="dark"] */ }
}
```

Notas:
- Se **mantienen** los nombres que ya usan los componentes (`--bg`, `--fg`, `--muted`,
  `--border`, `--radius`, `--space`, `--max-width`) para no romper consumidores durante la
  migración; se **añaden** los nuevos. Requisito 1.4 cumplido.
- Mobile-first: estilos base para 360px; `@media (min-width: 640px)` para ampliar.
- `:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }` (R7.4).

### 2. Tipografía (`app/layout.tsx`)

Usar `next/font/google` para evitar FOUC y layout shift (R2.4):

```ts
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
const sora = Sora({ subsets:["latin"], weight:["700"], variable:"--font-sora", display:"swap" });
const inter = Inter({ subsets:["latin"], weight:["400","500"], variable:"--font-inter", display:"swap" });
const mono = JetBrains_Mono({ subsets:["latin"], weight:["600"], variable:"--font-jetbrains", display:"swap" });
```

Las variables se aplican en `<html className={...}>`. Clase utilitaria `.num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }` para notas/porcentajes (R2.2).

### 3. Tema claro/oscuro (patrón idéntico al idioma)

Réplica de `lib/i18n/*`:

**`lib/theme/config.ts`**
```ts
export const themes = ["light","dark"] as const;
export type Theme = (typeof themes)[number];
export const THEME_COOKIE = "unigrades_theme";
```

**`lib/theme/request.ts`** — helper server para leer la cookie (como `i18n/request.ts`):
```ts
export async function getTheme(): Promise<Theme | null> {
  const store = await cookies();
  const v = store.get(THEME_COOKIE)?.value as Theme | undefined;
  return v && themes.includes(v) ? v : null; // null = seguir prefers-color-scheme
}
```

**`lib/theme/actions.ts`** — server action análoga a `setLocale`:
```ts
"use server";
export async function setTheme(theme: Theme) {
  if (!themes.includes(theme)) return;
  const store = await cookies();
  store.set(THEME_COOKIE, theme, { maxAge: 60*60*24*365, path:"/", sameSite:"lax" });
  revalidatePath("/", "layout");
}
```

**`app/layout.tsx`** — resolver en server y fijar el atributo en `<html>` antes del render
(R6.4, anti-FOUC):
```tsx
const theme = await getTheme();                 // "light" | "dark" | null
<html lang={locale} data-theme={theme ?? undefined} className={fontVars}>
```
Cuando `theme` es `null` se omite `data-theme` y el CSS cae en `prefers-color-scheme` (R6.5).

**`components/theme/ThemeToggle.tsx`** — client, mismo molde que `LanguageSwitcher`
(`useTransition` + server action). Lee el tema actual desde una prop (pasada por el server)
o desde `document.documentElement.dataset.theme` para el estado inicial del control.

### 4. Primitivos de UI (`components/ui`)

Todos "tontos", tipados, sin `any`. Se exportan desde `components/ui/index.ts`.

- **`Button`** — conserva `variant`. Variantes: `primary` (fondo `--primary`, texto
  `--primary-fg`), `secondary` (contorno `--border`). Añade `isLoading?: boolean` (muestra
  spinner y aplica `disabled`). Altura mínima `--tap-min`. Firma retrocompatible (R3.7).
- **`Input`** — conserva `label`, `id`. Añade `error?: string` (borde `--brand-danger` +
  texto de error con `aria-invalid`/`aria-describedby`). Firma retrocompatible.
- **`Container`** — igual contrato; usa tokens.
- **`Card`** — `radius 16px`, `background: var(--surface)`, `box-shadow: var(--shadow-soft)`,
  `padding: var(--space-lg)`. Props: `children`, `as?`, `className?`.
- **`StatCard`** — métrica grande (`.num`) + etiqueta `--muted`. Props: `label`, `value`,
  `hint?`.
- **`StatusBadge`** — props `status: "good" | "risk" | "behind"`. Mapea a menta/ámbar/coral.
  Incluye **icono + texto** (Lucide), nunca solo color (R7.5). Texto vía i18n (la pantalla
  pasa el label ya traducido, o el badge recibe `label`).
- **`ProgressRing`** — SVG circular. Props: `value` (0–100), `size?`, `label?`. `currentColor`
  para el trazo; `role="img"` + `aria-label` con el porcentaje.
- **`AnimatedNumber`** — anima la transición del valor (R11.1). Props: `value: number`,
  `decimals?`, `duration?`. Respeta `prefers-reduced-motion` (si reduce, fija el valor sin
  tween). Usa `requestAnimationFrame`, sin dependencias.
- **`Logo`** — props `variant: "symbol" | "horizontal" | "mono"`, `height?` (mín. 24px).
  Mientras no haya assets, renderiza el wordmark "unigrades" en Sora como placeholder (R9.3).

### 5. Iconografía

- Dependencia: `lucide-react`, versión **exacta** pineada (R4.2). Tree-shakeable; se importan
  solo los iconos usados.
- Los iconos heredan `currentColor` (R4.3), tamaño 2px de trazo por defecto de la familia.

### 6. Microinteracciones (`lib/celebrate.ts` + assets)

- **Número animado:** `AnimatedNumber` (ver arriba).
- **Confeti + sonido al aprobar:** helper `celebrate()` en `lib/celebrate.ts`:
  - Confeti: `canvas-confetti` (dependencia ligera, versión exacta).
  - Sonido: asset local en `public/sounds/approve.mp3` (sin red externa, R11.6).
  - Silenciable: preferencia de sonido en estado de UI (toggle + persistible luego); por
    defecto silenciado si `prefers-reduced-motion: reduce` o si no hubo gesto de usuario que
    habilite audio (R11.3).
  - `prefers-reduced-motion`: desactiva confeti y tween (R11.4).
- **Disparo solo en la transición real a `aprobada`:** `celebrate()` debe dispararse cuando el
  estado **cambia** de un valor previo distinto de `aprobada` a `aprobada`, no al cargar/montar
  una materia que ya estaba aprobada. Implementación:
  - La celebración se engancha al éxito de la mutación `useUpdateEnrollmentState` (la acción
    deliberada del usuario que marca la materia como aprobada): en el `onSuccess`/callback de
    la pantalla, si el nuevo estado es `aprobada` y el estado anterior (el que tenía la fila
    antes de mutar) **no** era `aprobada`, se llama `celebrate()`.
  - Como salvaguarda adicional, si se usara un `useEffect` sobre el estado derivado de la
    query, debe comparar contra el valor previo con un `useRef` y disparar solo en la
    transición `prev !== "aprobada" && next === "aprobada"`, inicializando el ref con el estado
    ya cargado para que el primer render de una materia ya aprobada **no** celebre.
  - Es un efecto de presentación; no altera datos ni el flujo de la mutación (R11.5).

### 7. Navegación móvil (`components/nav/AppNav.tsx`)

- Server component que arma el header y pasa a sus hijos client (toggles) lo necesario; se
  monta en `app/app/layout.tsx` por encima de `{children}` (ese layout ya es server y hace el
  gate de sesión — se mantiene intacto salvo envolver el children con el nav).
- Enlaces con `next/link`: dashboard `/app`, semestres `/app/semesters`, settings
  `/app/settings` (R12.2). Sección activa con `usePathname` en un subcomponente client,
  marcada con texto/indicador además de color (R12.3).
- Aloja `LanguageSwitcher`, `ThemeToggle` y `LogoutButton` existentes, sin cambiar su lógica
  (R12.4).
- Mobile-first: barra superior compacta; targets ≥44px; sin scroll horizontal a 360px
  (R12.5). En ≥640px se expande horizontalmente.

### 8. Tarjeta estrella — forecast de nota (`lib/grade-forecast.ts`)

Función pura, tipada, sin acceso a red. Recibe datos que las pantallas ya cargan vía hooks
existentes:
- `componentes`: `Componente[]` (de `useComponents`) → `porcentaje` por componente.
- `calificaciones`: `ComponenteCalificacion[]` (de `useComponentGrades`) → `calificacion`
  (promedio de notas) y `num_notas` por componente.
- `notaMinima`: `number` — `materia.nota_minima_aprobacion` (ya en el tipo `Materia`).
- `escalaMax = 5.0`.

```ts
export type Forecast =
  | { kind: "secured" }                    // ya aprobada con lo registrado
  | { kind: "needed"; required: number }   // nota promedio necesaria en el peso restante
  | { kind: "impossible" }                 // required > escalaMax
  | { kind: "incomplete_setup"; sum: number } // los componentes no suman 100% todavía
  | { kind: "insufficient" };              // faltan datos (sin componentes)

export function forecastRequiredGrade(input: {
  componentes: { id: string; porcentaje: number }[];
  calificaciones: { componente_id: string; calificacion: number | null }[];
  notaMinima: number;
  escalaMax?: number;
}): Forecast;
```

Lógica (el orden importa):
1. Si no hay componentes → `insufficient` (R8.6).
2. `sumaPorcentajes` = Σ porcentaje de todos los componentes.
   Si `sumaPorcentajes` ≠ 100 (con tolerancia de redondeo, p. ej. |suma−100| > 0.01) →
   `incomplete_setup` con `sum`. **No** se calcula la nota necesaria sobre un total parcial,
   porque daría un número engañoso. RN-2 se cumple de forma flexible (la configuración puede
   estar incompleta mientras el estudiante arma la materia); el forecast solo es confiable con
   el 100% definido. (R8 ampliado por decisión del usuario.)
3. `aportado` = Σ (calificacion × porcentaje/100) de componentes con `calificacion != null`.
   `pesoRestante` = Σ porcentaje de componentes con `calificacion == null`.
4. Si `pesoRestante == 0` (todos calificados):
   - `aportado >= notaMinima` → `secured` (R8.4); si no, ya no hay peso para remontar →
     `impossible` (R8.3).
5. `required = (notaMinima - aportado) / (pesoRestante/100)`.
   - `required <= 0` → `secured` (ya asegurada aunque falte registrar notas).
   - `required > escalaMax` → `impossible` (R8.3).
   - en otro caso → `needed` con `required` redondeado a 1 decimal (R8.2).

La pantalla de detalle de materia renderiza una `Card` destacada con el mensaje según `kind`
(incluido un mensaje propio para `incomplete_setup`, p. ej. "Configura los componentes hasta
100% para ver tu proyección"), todo vía i18n. Nunca lanza (R8.6). Esta función **no** vive en
`services/` (R8.5).

### 9. Pantallas rediseñadas

Cada pantalla conserva sus hooks, `queryKey` y callbacks; solo cambia marcado/estilo.

- **Landing (`app/page.tsx`)** — hero con `Logo horizontal`, tipografía Sora, CTA a
  login/signup; footer con aviso de no afiliación UNAL (R9.4).
- **Login/Signup** — `Card` centrada, `Input` con estados de error, `Button` primario.
- **Dashboard (`DashboardClient`)** — promedio global y créditos como `StatCard` (`.num`);
  avance por tipología con `ProgressRing`/barras; materias en curso como `Card` con
  `StatusBadge`.
- **Semestres / detalle de semestre** — listas como `Card`; promedio de semestre con `.num`.
- **Detalle de materia (`SubjectComponentsClient`)** — nota de la materia destacada con
  `AnimatedNumber`; **tarjeta estrella** con el forecast; indicador de suma de % conservando
  la validación RN-2 de UX actual; componentes y notas como `Card`.
- **Settings** — idioma (`LanguageSwitcher`), tema (`ThemeToggle`), programa; sin lógica nueva.

---

## Modelo de datos

**Sin cambios.** No se crean tablas, vistas, funciones, triggers ni migraciones. El forecast
usa datos ya expuestos por `services/grades.ts` (`ComponenteCalificacion`) y por el tipo
`Materia` (`nota_minima_aprobacion`). Confirmado contra `services/grades.ts` y
`types/domain.ts`.

---

## Manejo de errores

- **Forecast:** degradación elegante a `insufficient`; función total, nunca lanza (R8.6).
- **Tema:** cookie inválida o ausente → `prefers-color-scheme` (R6.5). La server action ignora
  valores fuera de `themes`.
- **Fuentes:** `display:swap` evita texto invisible; variables con fallback del sistema.
- **Audio:** si el navegador bloquea autoplay, el sonido simplemente no suena; no se propaga
  error ni se bloquea la UI.
- **Errores de datos existentes:** se conservan los manejos actuales en cada pantalla
  (mensajes de error de mutaciones, estados de carga de React Query).

---

## Accesibilidad

- Contraste AA en ambos temas (verificar fg/bg; ajustar `--border`/`--muted` oscuros).
- Estado nunca solo por color: `StatusBadge` lleva icono + texto (R7.5).
- Foco visible global con `:focus-visible` (R7.4).
- Targets táctiles ≥44px vía `--tap-min` (R7.2).
- Labels asociados en inputs (ya presentes) (R7.3).
- `prefers-reduced-motion` respetado en animaciones y confeti (R11.4).
- `ProgressRing` con `aria-label` del porcentaje.

---

## Estrategia de verificación

Por tratarse de rediseño visual, la verificación se centra en no regresión y en el único
bloque de lógica nueva (forecast):

1. **Type-check / lint / build** tras cada cambio: `npm run typecheck`, `npm run lint`,
   `npm run build` (R10.1). Limpiar temporales.
2. **Test unitario del forecast** — `lib/grade-forecast.test.ts` con casos: secured,
   needed (valor esperado), impossible (required > 5), insufficient (sin componentes / sin
   peso). Es lógica nueva, así que lleva tests (convención de `tech.md`). Si no hay runner de
   tests configurado, se añade el estándar del ecosistema (Vitest) solo para este archivo.
3. **No regresión de capa de datos** — revisión de que el diff no toca `services/`,
   `lib/supabase/`, `supabase/`, `types/domain.ts`, ni altera `queryKey`/firmas de
   `services/queries.ts` (R10.2, R10.3).
4. **Revisión responsive manual** a 360px y en ≥640px; claro y oscuro (indicado al usuario,
   sin levantar dev server desde el agente).
5. **i18n** — toda cadena visible nueva (estados, forecast, nav) con clave en `messages/es.json`
   y `messages/en.json` (R10.4).

---

## Decisiones y notas

- **Forecast en cliente, no en DB:** confirmado que `porcentaje`, `calificacion` por componente
  y `nota_minima_aprobacion` ya llegan al frontend; no se justifica una vista/función nueva.
  Respeta la separación backend/frontend (R8.1, R8.5).
- **Tokens retrocompatibles:** se conservan los nombres de variables actuales y se añaden los
  nuevos, para migrar pantallas sin romper nada intermedio (R1.4).
- **Tema con el patrón del idioma:** reutiliza un patrón ya probado en el repo (cookie +
  server action + `revalidatePath` + resolución en server), minimizando superficie nueva y
  evitando FOUC (R6.3, R6.4).
- **Estilos:** se migran los estilos inline actuales a tokens; se puede usar CSS Modules o
  clases utilitarias en `globals.css`. No se introduce una librería de CSS nueva salvo que la
  tarea de implementación lo justifique y se apruebe.

---

## Segundo pase — Tailwind v4 + shadcn + MagicUI, jerarquía de color, hero corto y rendimiento

Tras el primer pase, el usuario pidió profundizar. Este bloque documenta la estrategia del
segundo pase. El registro operativo completo (versiones exactas, comandos, URLs de MagicUI,
componentes que fallaron) vive en `redesign-log.md`.

### Estrategia Tailwind / shadcn / MagicUI

- **Tailwind v4** se activa con el plugin PostCSS (`@tailwindcss/postcss`) y
  `@import "tailwindcss"` como primera línea de `app/globals.css`. No se reescriben los
  consumidores existentes: las utilidades Tailwind conviven con los estilos basados en tokens.
- **shadcn** se inicializa generando `components.json` (style `new-york`, `cssVariables: true`,
  baseColor `neutral`, alias `@/*`, iconLibrary `lucide`) y `lib/utils.ts` (`cn`). En este
  shell no-TTY el `init` canary se cuelga en los prompts, así que los artefactos se generan a
  mano de forma determinista (equivalente al init).
- **MagicUI** se añade por componente desde su registro
  (`npx shadcn@latest add "https://magicui.design/r/<comp>.json"`), best-effort. Integrados:
  `aurora-text` + `shimmer-button` + `dot-pattern` (hero), `bento-grid` + `number-ticker` +
  `border-beam` (dashboard), `dock` (nav), `confetti` (disponible). `magic-card` se descartó
  (dependía de `next-themes`); el shadcn `button` NO se instala en Windows (colisiona con
  `Button.tsx` por filesystem case-insensitive).

### Puente de tokens `@theme inline`

El bloque `@theme inline` de `globals.css` mapea los nombres que esperan shadcn/MagicUI
(`--color-background`, `--color-primary`, `--color-accent`, `--radius-*`, `--font-*`…) a las
variables que ya definen los temas del proyecto (`--bg`, `--fg`, `--primary`, `--accent`…).
`--color-accent` apunta a `var(--accent, var(--brand-accent))` para que el acento sea sensible
al tema. Objetivo: los componentes nuevos leen la paleta del proyecto sin duplicar la fuente
de verdad del color ni reescribir consumidores.

### Nueva paleta y dark mode (invierte la jerarquía)

Se mantienen los NOMBRES de variables y los HEX de marca; cambia su aplicación:

- **Claro:** `--bg #f7f8f5`, `--surface #fff`, `--fg #0d0f12`; `--primary` pasa a **negro**
  `#0d0f12` (botones blanco/negro); nuevo `--accent = var(--brand-primary)` (`#0B6B4F`) como
  acento **menor**; `--focus-ring = var(--brand-primary)`.
- **Oscuro (estilo "SerStack"):** `--bg #0b0f14` (casi negro), `--surface #14191f`,
  `--fg #f7f8f5`, `--border #272e38`; `--primary`/`--accent = var(--brand-accent)` (`#2ED8A3`)
  como único color brillante puntual; `--primary-fg #0b0f14`.
- El fallback `@media (prefers-color-scheme: dark) { :root:not([data-theme]) }` replica el tema
  oscuro. Los HEX `#0B6B4F/#2ED8A3/#FFB020/#FF5C5C` no cambian: siguen alimentando el
  `StatusBadge`. `lib/theme/*` y `app/layout.tsx` intactos.

### Hero corto

`app/page.tsx` se reescribe a Tailwind: fondo oscuro casi negro, titular corto
(`landing.heroTitle`) con fragmento de acento en `AuroraText` (`landing.heroTitleAccent`),
subtítulo de una línea (`landing.heroSubtitle`), CTA `ShimmerButton` → `/signup` y enlace a
`/login`, `DotPattern` de fondo. Footer de no-afiliación UNAL conservado. Copy 100% vía
next-intl; `landing.tagline` y demás claves existentes se conservan.

### Cambios de rendimiento

- **Dedupe de `getUser` (seguridad):** `supabase.auth.getUser()` iba 3 veces en serie
  (`proxy.ts` → `app/app/layout.tsx` → `app/app/page.tsx`). Se elimina la del `layout`
  (vuelve a síncrono); queda UNA revalidación server en `page.tsx` (ahí se usa `user.id`).
  Razonamiento: `proxy.ts` ejecuta `getUser()` en **cada** request (round-trip que revalida el
  token, no solo lee la cookie) y ya redirige a `/login` sin sesión; si el proxy deja pasar, la
  sesión es válida, así que el segundo gate solo añadía latencia. Defensa en profundidad:
  proxy (cada request) + una revalidación server. No se toca `lib/supabase/*`.
- **Dashboard en paralelo (`useQueries`, NO prefetch+hydration):** se eligió el fallback
  `useQueries` porque las funciones de servicio usan `createBrowserClient`, que no lleva la
  sesión server en un prefetch de server component → RLS devolvería vacío, y no se puede tocar
  `services/`. En `DashboardClient.tsx` los 3 `useQuery` pasan a un `useQueries` con las
  `queryKey` EXACTAS de `services/queries.ts` (`global-average`/`progress-typology`/
  `current-subjects`). `services/queries.ts` sin cambios.
- **Feedback de botones:** `Button.tsx` añade la clase `ug-btn` y una regla
  `.ug-btn:not(:disabled):active { transform: scale(.97); opacity:.9 }` (80ms) para señal
  `:active` inmediata; nuevo `NavButton.tsx` usa `useLinkStatus()` de `next/link` para estado
  *pending* inmediato en los CTAs de navegación. Firma de `Button` retrocompatible (solo se
  agrega passthrough de `className`).
