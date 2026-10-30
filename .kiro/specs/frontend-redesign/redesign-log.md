# Rediseño Frontend UniGrades — Bitácora técnica del segundo pase

> Este documento registra el **segundo pase** del rediseño (adopción de Tailwind v4 +
> shadcn + MagicUI, nueva jerarquía de color, hero corto y arreglos de rendimiento),
> ejecutado sobre la rama `frontend-redesign`. El primer pase (tokens CSS, tema por cookie,
> primitivos tontos, forecast, celebración) está documentado en `bitacora/diario.md`
> (Episodio 16) y en `requirements.md` / `design.md` / `tasks.md`.
>
> Regla de oro transversal (igual que el primer pase): NO se tocó `services/`,
> `lib/supabase/`, `supabase/`, `types/domain.ts`, ni las `queryKey`/firmas de
> `services/queries.ts`. Todo cambio es de presentación. Toda cadena visible nueva vive en
> `messages/es.json` y `messages/en.json`.

---

## 1. Dependencias nuevas (nombre + versión exacta)

Leídas de `package.json` tras FEAT-001..004.

### Instaladas y usadas

| Paquete | Versión en `package.json` | Tipo | Para qué |
|---|---|---|---|
| `tailwindcss` | `4.3.3` (pin exacto, sin `^`) | dev | Motor de utilidades Tailwind v4 |
| `@tailwindcss/postcss` | `4.3.3` (pin exacto, sin `^`) | dev | Plugin PostCSS de Tailwind v4 |
| `tw-animate-css` | `^1.4.0` | dev | Utilidades de animación que shadcn/MagicUI esperan (reemplaza al obsoleto `tailwindcss-animate` en v4) |
| `class-variance-authority` | `^0.7.1` | prod | Variantes de clases (helper de shadcn) |
| `clsx` | `^2.1.1` | prod | Composición de clases condicionales |
| `tailwind-merge` | `^3.7.0` | prod | Fusión de clases Tailwind sin conflicto (parte de `cn`) |
| `motion` | `^14.9.0` | prod | Motor de animación (sucesor de `framer-motion`, compatible React 19). Lo usan `dot-pattern`, `number-ticker`, `border-beam`, `dock` |
| `@radix-ui/react-icons` | `^1.3.2` | prod | `ArrowRightIcon` usado por `bento-grid` |

> Nota: Tailwind y su plugin PostCSS quedaron **pineados exactos** (sin `^`) por decisión de
> FEAT-001; el resto conserva el rango `^` que dejó el registro de shadcn/MagicUI. Las
> versiones de marca y las ya existentes del MVP (`lucide-react@1.65.0`, `canvas-confetti@1.9.3`,
> `next@^16.3.8`, `react@19.0.0`) no cambiaron en este pase.

### Instaladas por el CLI y luego DESINSTALADAS (ruido/typosquat)

Al correr los `shadcn add` de MagicUI, el CLI arrastró dependencias no usadas. Se quitaron con
`npm uninstall cn radix-ui next-themes`:

- `cn@0.5.1` — riesgo de **typosquat**: el proyecto ya tiene su propio helper `cn` en
  `lib/utils.ts` (`twMerge(clsx(...))`); este paquete no se usa.
- `radix-ui` — meta-paquete no usado (solo se necesitaba `@radix-ui/react-icons`).
- `next-themes` — el proyecto gestiona el tema por **cookie + `data-theme`** (patrón del
  idioma), no con el `ThemeProvider` de `next-themes`.

---

## 2. Comandos ejecutados

Todos en PowerShell (Windows), separador `;`, dentro del worktree
`c:\Sergio\7. Projects\Vstudy\.worktrees\frontend-redesign`.

### Fundación Tailwind v4 + shadcn (FEAT-001)

```powershell
npm install -D tailwindcss@4.3.3 "@tailwindcss/postcss@4.3.3"
```

- `npx shadcn@canary init` — **falló** en este shell no-TTY: la interfaz canary cambió (ya no
  acepta `--base-color`, usa `-b/--base`) y se cuelga esperando prompts interactivos
  (re-install / component library / base color) pese a `--yes/--force/--no-reinstall`. Se
  reprodujo 2 veces. **Solución:** se generaron a mano, de forma determinista, los mismos
  artefactos que produce el init:
  - `components.json` (style `new-york`, `rsc: true`, `tailwind.cssVariables: true`,
    baseColor `neutral`, css `app/globals.css`, alias `@/*`, iconLibrary `lucide`).
  - `lib/utils.ts` con `cn() = twMerge(clsx(...))`.
- `postcss.config.mjs` creado a mano con el plugin `@tailwindcss/postcss`.

### Componentes MagicUI (FEAT-004)

Patrón general (uno por componente, best-effort):

```powershell
npx shadcn@latest add "https://magicui.design/r/<comp>.json"
```

Ejecutado para: `aurora-text`, `shimmer-button`, `dot-pattern`, `bento-grid`,
`number-ticker`, `border-beam`, `dock`, `confetti`.

Limpieza posterior:

```powershell
npm uninstall cn radix-ui next-themes
git checkout -- components/ui/Button.tsx   # restaurar Button del proyecto (ver §3)
```

---

## 3. Componentes MagicUI

Origen del registro: `https://magicui.design/r/<comp>.json`. Todos se añadieron con
`npx shadcn@latest add "<url>"` y **todos instalaron OK con React 19.0.0 / Next 16.4.3**
(ninguno falló por incompatibilidad React 18/19).

| Componente | URL de origen | Archivo | Dónde se usó |
|---|---|---|---|
| Aurora Text | `https://magicui.design/r/aurora-text.json` | `components/ui/aurora-text.tsx` | Acento del titular del hero (`app/page.tsx`) |
| Shimmer Button | `https://magicui.design/r/shimmer-button.json` | `components/ui/shimmer-button.tsx` | CTA principal del hero → `/signup` |
| Dot Pattern | `https://magicui.design/r/dot-pattern.json` | `components/ui/dot-pattern.tsx` | Fondo sutil del hero (verde, con máscara radial) |
| Bento Grid | `https://magicui.design/r/bento-grid.json` | `components/ui/bento-grid.tsx` | Tarjetas de GPA/créditos del dashboard (`DashboardClient.tsx`) |
| Number Ticker | `https://magicui.design/r/number-ticker.json` | `components/ui/number-ticker.tsx` | Cifras de GPA/créditos del dashboard (envuelto en `StatTicker`, respeta `prefers-reduced-motion`) |
| Border Beam | `https://magicui.design/r/border-beam.json` | `components/ui/border-beam.tsx` | Realce de las tarjetas del dashboard |
| Dock | `https://magicui.design/r/dock.json` | `components/ui/dock.tsx` | Navegación de `/app` (`components/nav/AppNav.tsx`) con magnificación en hover |
| Confetti | `https://magicui.design/r/confetti.json` | `components/ui/confetti.tsx` | Disponible (declarativo, canvas). NO sustituyó al disparo imperativo existente — ver abajo |

### Componentes que fallaron / se eliminaron / se refactorizaron

- **`magic-card`** — **ELIMINADO.** Requería `useTheme` de `next-themes`, pero el proyecto
  usa tema por cookie/`data-theme` sin el `ThemeProvider` de `next-themes`. La tarea permitía
  elegir `border-beam` **o** `magic-card`; se eligió `border-beam` para el dashboard.
- **shadcn `button`** — **NO instalar en Windows.** El filesystem es *case-insensitive*, así
  que `npx shadcn add button` sobreescribió el `Button.tsx` del proyecto (`button.tsx` ==
  `Button.tsx`). Se restauró con `git checkout -- components/ui/Button.tsx`. Los MagicUI que
  importaban el `@/components/ui/button` de shadcn se refactorizaron para NO depender de él:
  - `bento-grid` usa un `<a>` estilado en vez del `Button` shadcn.
  - `confetti.tsx` perdió su `ConfettiButton` (requería el `Button` shadcn); quedó solo el
    componente `Confetti` (canvas).
- **`confetti` (integración)** — instalado OK, pero **no reemplazó** al confeti imperativo.
  La celebración al aprobar ya estaba correctamente cableada en el primer pase
  (`lib/celebrate.ts` + `SemesterDetailClient.tsx`), disparando SOLO en la transición real a
  `aprobada` (vía `canvas-confetti`). El `Confetti` declarativo de MagicUI no aportaba sin
  arriesgar ese disparo, así que `lib/celebrate.ts` y `SemesterDetailClient.tsx` no se tocaron.
- **`number-ticker` en el detalle de materia** — **NO se aplicó ahí.** En
  `SubjectComponentsClient.tsx` se conservó `AnimatedNumber`: anima *on-change* (la nota de la
  materia y `forecast.required` cambian), mientras que `NumberTicker` anima *once-on-inview*
  (sería una regresión). Así no se tocó el forecast ni RN-2.

---

## 4. Cambios de paleta / tokens

Decisión del usuario (mensajes 4 y 5): base dominante **blanco/negro**, verde como **acento
MENOR**, y dark mode **casi negro** con un único color brillante puntual (estilo "SerStack").
Los HEX de marca de la tabla de `design-guidelines.md` NO cambiaron; cambió **cómo y cuánto**
se aplican. Se conservaron todos los NOMBRES de variables para no romper consumidores.

### Tema claro (`:root` / `[data-theme="light"]`)

| Token | Valor nuevo | Nota |
|---|---|---|
| `--bg` | `#f7f8f5` | Blanco hueso |
| `--surface` | `#ffffff` | Blanco |
| `--fg` | `#0d0f12` | Casi negro |
| `--primary` | `#0d0f12` (NEGRO) | Antes era el verde; ahora botones base blanco/negro |
| `--accent` (nuevo) | `var(--brand-primary)` (`#0B6B4F`) | Verde como acento **menor** |
| `--focus-ring` | `var(--brand-primary)` | — |

### Tema oscuro (`[data-theme="dark"]`, estilo SerStack)

| Token | Valor nuevo | Nota |
|---|---|---|
| `--bg` | `#0b0f14` | Casi negro |
| `--surface` | `#14191f` | — |
| `--fg` | `#f7f8f5` | Blanco |
| `--border` | `#272e38` | Contraste AA sobre casi negro |
| `--muted` | `#9aa7b2` | — |
| `--primary` / `--accent` | `var(--brand-accent)` (`#2ED8A3` menta) | Único color brillante, usado con moderación |
| `--primary-fg` | `#0b0f14` | — |

El fallback `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { … } }` replica
exactamente los valores del tema oscuro (incluido el nuevo `--accent`) para mantener
coherencia sin cookie.

### HEX de marca (semáforo de estado) — intactos

`--brand-primary #0B6B4F`, `--brand-accent #2ED8A3`, `--brand-warning #FFB020`,
`--brand-danger #FF5C5C`. Solo cambió su aplicación/jerarquía (de dominante a acento puntual),
no los valores. Siguen usándose para el `StatusBadge` (aprobando / en riesgo / reprobando).

### Puente de tokens `@theme inline`

- `--color-accent` ahora apunta a `var(--accent, var(--brand-accent))` para que shadcn/MagicUI
  usen el acento sensible al tema (antes iba directo a `--brand-accent`).
- El CLI de MagicUI añadió al archivo: `@custom-variant dark`, keyframes `aurora` /
  `shimmer-slide` / `spin-around` y tokens `--animate-*`. Se conservaron los tokens del
  proyecto; la paleta sigue viviendo UNA sola vez en los temas y shadcn/MagicUI la leen por
  este puente.

`lib/theme/*` y `app/layout.tsx` NO se tocaron: la resolución del tema en servidor por cookie
y el anti-FOUC del primer pase siguen intactos.

---

## 5. Rendimiento

Mensaje 4 del usuario: "está demasiado lenta… se da clic y no se sabe si se activó el botón".
Tres frentes, todos en la capa de UI/server-components de `/app` (sin tocar `services/` ni
`lib/supabase/`).

### 5.1 Dedupe de la validación de sesión (`getUser`) — con razonamiento de seguridad

`supabase.auth.getUser()` aparecía **3 veces en serie** por request a `/app`:
`proxy.ts` (middleware) → `app/app/layout.tsx` (gate) → `app/app/page.tsx` (usa `user.id`
para consultar el perfil `usuario`).

**Cambio:** se ELIMINÓ la llamada redundante de `app/app/layout.tsx` (el layout pasó de
`async` a síncrono). Queda UNA sola revalidación server dentro de `/app`, en
`app/app/page.tsx`, donde el `user.id` es necesario para la consulta.

**Razonamiento de seguridad (documentado como comentario en `layout.tsx` y `page.tsx`):**
`proxy.ts` llama `supabase.auth.getUser()` en **cada** request — un round-trip real que
revalida el token contra Supabase (no solo lee la cookie) — y ya protege `/app` redirigiendo
a `/login` cuando no hay sesión. Si el proxy deja pasar la request, la sesión es válida; por
tanto un segundo gate en el layout no añadía garantía, solo latencia. No se tocó
`lib/supabase/*`. La defensa en profundidad sigue existiendo: proxy (cada request) + una
revalidación server en `page.tsx`.

### 5.2 Paralelización del dashboard — se usó `useQueries` (NO prefetch+hydration)

El dashboard lanzaba 3 queries en cascada (waterfall): `global-average`,
`progress-typology`, `current-subjects`.

**Decisión: se usó el FALLBACK `useQueries`, no `prefetch + HydrationBoundary`.**
**Motivo:** las funciones de servicio (`getGlobalAverage`, `getProgressByTypology`,
`getCurrentSubjects`) usan `createBrowserClient` (`lib/supabase/client.ts`), que no lleva la
sesión server en un prefetch de server component → con RLS devolvería vacío. Como no se puede
tocar `services/` para inyectar un client server, el prefetch server sería frágil/incorrecto.

En `DashboardClient.tsx` los 3 `useQuery` se reemplazaron por UN `useQueries` con las
`queryKey` **exactas** de `services/queries.ts`:
`['global-average', userId]`, `['progress-typology', userId, programaId]`,
`['current-subjects', userId]`, reutilizando las mismas funciones de servicio importadas.
`services/queries.ts` NO se modificó. Resultado: las 3 corren en paralelo.

### 5.3 Feedback inmediato de botones

- **`components/ui/Button.tsx`:** se añadió la clase `ug-btn` (respetando el `className` del
  consumidor) y en `app/globals.css` la regla
  `.ug-btn:not(:disabled):active { transform: scale(0.97); opacity: .9 }` con transición de
  80ms → señal `:active` instantánea al click, antes de que termine la navegación/mutación.
  La firma de props (`variant`, `isLoading`, nativas) no cambió; solo se agregó el passthrough
  opcional de `className`.
- **`components/ui/NavButton.tsx` (nuevo):** usa `useLinkStatus()` de `next/link` (disponible
  desde Next 15.3; aquí Next 16.4.3) para mostrar estado *pending* inmediato en los CTAs que
  navegan. Se usa en `app/page.tsx` (signup/login) y `app/app/page.tsx` (ir a semestres),
  todos dentro de `<Link>`. No agrega claves i18n (reutiliza las existentes).

---

## 6. Hero corto (landing)

Mensaje 4: "en el hero inicial hay muchísimo texto… redúcelo". `app/page.tsx` se reescribió a
Tailwind con fondo oscuro casi negro (`#0b0f14`) fijo:

- Titular corto `landing.heroTitle` + fragmento de acento `landing.heroTitleAccent` en
  `AuroraText` (menta→verde, `#2ed8a3`→`#0b6b4f`).
- Subtítulo de **una línea** `landing.heroSubtitle`.
- CTA con `ShimmerButton` (verde) → `/signup` y enlace a `/login`, ambos con el `.ug-btn` de
  FEAT-003; `DotPattern` verde sutil de fondo con máscara radial.
- Footer de no-afiliación UNAL conservado (`landing.footerDisclaimer` / `landing.footerRights`).
- Sin copy hardcodeado: todo vía `useTranslations`; claves nuevas añadidas en es.json y en.json.
  `landing.tagline` y las demás claves existentes se conservaron.

---

## 7. Verificación

Tras FEAT-004, en el worktree: `npm run typecheck`, `npm run lint`, `npm run build`
(Next 16.4.3 Turbopack, 9 rutas) y `npm run test` (9/9 de `grade-forecast`) quedaron en verde.
`git diff --name-only` confirmó que NO se tocaron `services/`, `lib/supabase/`, `supabase/`,
`types/domain.ts` ni `services/queries.ts` en todo el pase.

## 8. Pendientes de config del usuario (heredados)

1. Colocar un `public/sounds/approve.mp3` real (efecto corto de éxito, con licencia). Mientras
   tanto el confeti dispara y el sonido falla en silencio.
2. Revisar la alerta de `npm audit` aparecida al instalar dependencias (decidir si afecta
   producción, como se hizo con las alertas de `next-intl`).
3. Revisión responsive manual a 360px y ≥640px en claro y oscuro (el agente no levanta dev
   server): confirmar contraste AA de `--muted`/`--border` sobre el fondo casi negro y que el
   verde solo aparezca como acento puntual.
