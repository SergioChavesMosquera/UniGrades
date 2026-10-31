# UniGrades — Mapa del Frontend (guía para agentes externos)

> Propósito: que un agente (o persona) externo sepa QUÉ archivo hace QUÉ, QUÉ puede tocar y
> QUÉ no tocar NUNCA, para modificar **solo el frontend** sin romper backend ni reglas de
> negocio.

---

## ⛔ REGLA DE ORO — Archivos/áreas PROHIBIDAS (no tocar nunca)

Estos archivos son la autoridad de datos y negocio. Un cambio "solo visual" jamás necesita
tocarlos. Si algo parece exigirlo, es señal de que el enfoque está mal.

| Ruta | Qué es | Por qué NO tocar |
|------|--------|------------------|
| `services/**` | Capa de servicios tipada sobre Supabase (auth, catalog, components, grades, profile, progress, queries, semesters) | Es la lógica de acceso a datos. Cambiarla altera el comportamiento de la app. |
| `services/queries.ts` | Hooks de React Query | Sus **`queryKey`** y **firmas** deben quedar idénticas. La UI depende de ellas. |
| `lib/supabase/**` | Clientes Supabase (browser `client.ts`, server `server.ts`) | Config de conexión y sesión. |
| `supabase/**` | Migraciones SQL, esquema, triggers, vistas, RLS, seeds | Es la base de datos y las reglas RN-1..RN-7. |
| `types/domain.ts` | Tipos del dominio (reflejan el esquema) | Cambiarlos desincroniza UI y DB. |
| `proxy.ts` | Middleware de sesión (gate de auth de `/app`) | Seguridad. Tocar solo si la tarea es explícitamente de auth, con mucho cuidado. |

**La UI consume datos SOLO así:** importa hooks desde `@/services/queries` (p. ej.
`useGlobalAverage`, `useComponents`). NUNCA importa de `@/lib/supabase/*` ni llama a Supabase
directo desde un componente. Si necesitas un dato nuevo que no existe, **detente y repórtalo**
en vez de añadir una query en la UI.

---

## ✅ Áreas EDITABLES (frontend puro)

### 1. Tokens y estilo global

| Archivo | Qué controla | Cómo modificar |
|---------|--------------|----------------|
| `app/globals.css` | **Fuente de verdad del diseño.** Variables CSS (colores, radios, sombras, espaciado), temas claro/oscuro, puente `@theme inline` a tokens de shadcn/MagicUI, clases utilitarias (`.ug-btn`, `.num`) | Cambiar colores/espaciado aquí afecta toda la app. Los nombres de variables (`--bg`, `--fg`, `--primary`, `--accent`, `--border`, `--radius`…) ya los consumen los componentes: cambia VALORES, no renombres sin actualizar consumidores. |
| `postcss.config.mjs` | Plugin de Tailwind v4 | Solo si cambias la config de Tailwind. |
| `components.json` | Config de shadcn (para instalar MagicUI) | Solo al añadir componentes shadcn/MagicUI. |

**Paleta actual (jerarquía):** base blanco/negro dominante; verde esmeralda `#0B6B4F`
(`--accent`) como acento menor; menta `#2ED8A3`, ámbar `#FFB020`, coral `#FF5C5C` solo para
estados (semáforo de notas). Dark mode casi negro (`--bg #0b0f14`), menta como único acento
brillante. Los HEX están fijados por el líder: cambia la **aplicación**, no los HEX, salvo
indicación explícita.

### 2. Layout y tipografía

| Archivo | Qué hace | Notas |
|---------|----------|-------|
| `app/layout.tsx` | Layout raíz. Carga fuentes (Sora/Inter/JetBrains Mono vía `next/font`), aplica `data-theme` resuelto en server (anti-FOUC), monta `Providers` y `NextIntlClientProvider` | Editable para fuentes/estructura. El bloque de tema server-side es sensible: no rompas el `data-theme`. |
| `app/app/layout.tsx` | Layout del área autenticada `/app`. Gate de sesión server + monta la navegación | Editable para la UI de navegación. NO reintroducir validaciones `getUser()` redundantes (se quitaron por rendimiento). |

### 3. Primitivos de UI reutilizables — `components/ui/`

Componentes "tontos": reciben props/callbacks, sin lógica de negocio ni Supabase. **Aquí es
donde más seguro se trabaja.** Un restyle global suele ser cambiar estos + `globals.css`.

| Archivo | Qué es |
|---------|--------|
| `Button.tsx` | Botón (variantes primary/secondary, loading). Clase `.ug-btn` con feedback `:active`. **Conservar la firma de props.** |
| `NavButton.tsx` | Botón de navegación con `useLinkStatus` (estado pending al navegar) |
| `Input.tsx` | Input con label y estado de error |
| `Container.tsx` | Contenedor centrado con ancho máximo |
| `Card.tsx` | Tarjeta (esquinas redondeadas, sombra) |
| `StatCard.tsx` | Métrica grande + etiqueta (GPA, créditos) |
| `StatusBadge.tsx` | Badge de estado semáforo (good/risk/behind), icono + texto |
| `ProgressRing.tsx` | Anillo de progreso SVG por % |
| `AnimatedNumber.tsx` | Número animado casero (respeta prefers-reduced-motion) |
| `Logo.tsx` | Logo de marca (variantes symbol/horizontal/mono). **Pendiente: integrar las imágenes reales** `icono_unigrades.jpg` / `logotipo_unigrades.png` (ver sección de pendientes) |
| `index.ts` | Barrel de exports de `components/ui` |

**Componentes MagicUI** (instalados vía registro shadcn, MIT). Editables pero son librería:
| Archivo | Uso actual |
|---------|-----------|
| `aurora-text.tsx` | Acento del titular del hero |
| `shimmer-button.tsx` | CTA del hero |
| `dot-pattern.tsx` | Fondo del hero |
| `bento-grid.tsx` | Tarjetas GPA/créditos del dashboard |
| `number-ticker.tsx` | Cifras animadas del dashboard |
| `border-beam.tsx` | Realce de tarjetas del dashboard |
| `dock.tsx` | Navegación de `/app` |
| `confetti.tsx` | Celebración (instalado) |

Para añadir más MagicUI: `npx shadcn@latest add "https://magicui.design/r/<nombre>.json"`
(en Windows el CLI puede colgarse en shell no interactivo; si pasa, copiar el JSON del
registro a mano). Documentar cada uno en `redesign-log.md`.

### 4. Componentes compartidos — `components/`

| Archivo | Qué hace | Lógica que NO cambiar |
|---------|----------|------------------------|
| `components/nav/AppNav.tsx` | Barra de navegación de `/app` (links dashboard/semestres/settings + controles) | Links y controles; la lógica de auth no vive aquí |
| `components/LanguageSwitcher.tsx` | Selector es/en | Llama `setLocale` (server action). Reestiliza, no cambies la acción |
| `components/theme/ThemeToggle.tsx` | Toggle claro/oscuro | Llama `setTheme` (server action). Reestiliza, no cambies la acción |
| `components/LogoutButton.tsx` | Cerrar sesión | Llama `signOut()` de services/auth. NO tocar esa llamada, solo el estilo |
| `components/providers.tsx` | Provider de React Query (cache config) | Config de cache; tocar solo si sabes lo que haces |

### 5. Páginas (rutas) — `app/`

Las páginas `page.tsx` server pueden leer sesión/perfil; los `*Client.tsx` son la UI
interactiva que usa los hooks. **Reestiliza libremente; conserva los hooks y callbacks.**

| Ruta | Archivos | Qué es |
|------|----------|--------|
| `/` | `app/page.tsx` | Landing / hero (pública) |
| `/login` | `app/login/page.tsx`, `LoginForm.tsx` | Iniciar sesión |
| `/signup` | `app/signup/page.tsx`, `SignupForm.tsx` | Crear cuenta |
| `/app` | `app/app/page.tsx`, `DashboardClient.tsx` | Dashboard |
| `/app/onboarding` | `app/app/onboarding/page.tsx`, `OnboardingClient.tsx` | Elegir/crear programa |
| `/app/semesters` | `app/app/semesters/page.tsx`, `SemestersClient.tsx` | Lista de semestres |
| `/app/semesters/[id]` | `.../[id]/page.tsx`, `SemesterDetailClient.tsx` | Detalle de semestre |
| `/app/subjects/[id]` | `.../[id]/page.tsx`, `SubjectComponentsClient.tsx`, `ComponentGrades.tsx` | Detalle de materia (componentes + notas + tarjeta estrella) |
| `/app/settings` | `app/app/settings/...` | Perfil, idioma, tema, programa |

### 6. Textos e internacionalización — `messages/` y `lib/i18n/`

| Archivo | Qué es | Regla |
|---------|--------|-------|
| `messages/es.json`, `messages/en.json` | Todos los textos de UI | **Todo texto visible nuevo va aquí, en AMBOS idiomas.** Nunca hardcodear texto en componentes. Usar `useTranslations`. |
| `lib/i18n/config.ts` | Locales, cookie de idioma | Config; raramente se toca |
| `lib/i18n/request.ts` | Resuelve el idioma desde la cookie (server) | No tocar salvo tarea de i18n |
| `lib/i18n/actions.ts` | Server action `setLocale` | No tocar la lógica |

### 7. Tema (claro/oscuro) — `lib/theme/`

| Archivo | Qué es |
|---------|--------|
| `lib/theme/config.ts` | Temas y cookie `unigrades_theme` |
| `lib/theme/request.ts` | Resuelve el tema desde la cookie (server, anti-FOUC) |
| `lib/theme/actions.ts` | Server action `setTheme` |

Patrón idéntico al de idioma: cookie + server action + resolución en server. Reestiliza el
toggle, no cambies estos server actions.

### 8. Lógica de presentación (editable, NO es backend) — `lib/`

| Archivo | Qué es | Nota |
|---------|--------|------|
| `lib/grade-forecast.ts` | "Tarjeta estrella": cálculo puro de la nota necesaria | Función pura. Recibe datos ya cargados por hooks; no toca services |
| `lib/grade-forecast.test.ts` | Tests del forecast | Mantener si cambias el forecast |
| `lib/celebrate.ts` | Efecto de confeti + sonido al aprobar | Presentación; no altera datos |
| `lib/utils.ts` | Helper `cn()` (merge de clases Tailwind) | Utilidad de estilo |

### 9. Assets — `public/` y `app/`

- `public/` — imágenes, sonidos (`public/sounds/approve.mp3`), etc. servidos estáticamente.
- Favicon: en App Router va como `app/icon.*` (Next lo sirve automático).

---

## Cómo pedirle a un agente externo un cambio de frontend (plantilla)

> "Modifica SOLO el frontend de este proyecto Next.js (App Router + TypeScript estricto).
> NO toques `services/`, `services/queries.ts`, `lib/supabase/`, `supabase/`, `types/domain.ts`
> ni `proxy.ts`. La UI consume datos solo vía los hooks de `@/services/queries`; no llames a
> Supabase desde componentes. Todo texto visible va en `messages/es.json` y `messages/en.json`
> (ambos) vía next-intl, nunca hardcodeado. Estilo con Tailwind v4; los tokens de color/forma
> viven en `app/globals.css`. Tarea: <describe>. Verifica con `npm run typecheck`,
> `npm run lint` y `npm run build` (en Windows PowerShell el separador es `;`, no `&&`; no
> levantes el dev server en foreground)."

## Verificación obligatoria tras cualquier cambio

```
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run build        # next build
npm run test         # vitest (si tocaste grade-forecast)
```

Y confirmar que el diff NO incluye ninguna ruta prohibida:
```
git diff --name-only
```

---

## Pendientes conocidos (frontend)

1. **Logo real sin integrar:** `icono_unigrades.jpg` (icono cuadrado → favicon `app/icon.*` y
   variante `symbol`) y `logotipo_unigrades.png` (→ `public/`, variante `horizontal` del navbar)
   siguen sin trackear en la raíz; `components/ui/Logo.tsx` probablemente aún usa placeholder.
2. **`public/sounds/approve.mp3`** debe ser un archivo de audio real.
3. **`npm audit`** reporta vulnerabilidades heredadas de la instalación; revisar.
