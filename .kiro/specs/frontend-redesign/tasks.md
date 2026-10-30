# Rediseño Frontend UniGrades — Plan de Implementación

> Regla transversal: NO tocar `services/`, `lib/supabase/`, `supabase/`, `types/domain.ts`, ni
> las `queryKey`/firmas de `services/queries.ts`. Tras cada tarea con código correr
> `npm run typecheck`, `npm run lint` y `npm run build`, y limpiar temporales.
> Toda cadena visible nueva va en `messages/es.json` y `messages/en.json`.

- [x] 1. Sistema de tokens de diseño
  - Reescribir `app/globals.css` con paleta de marca fija (`--brand-primary` `#0B6B4F`,
    `--brand-accent` `#2ED8A3`, `--brand-warning` `#FFB020`, `--brand-danger` `#FF5C5C`),
    variables de forma/espacio (`--radius: 16px`, `--radius-sm`, escala de `--space`,
    `--shadow-soft`, `--tap-min: 44px`, `--max-width`).
  - Definir temas con las MISMAS variables: `:root`/`[data-theme="light"]` (bg `#F7F8F5`,
    surface `#FFFFFF`, fg `#0F1B2D`, muted `#5B6770`) y `[data-theme="dark"]` (bg `#0F1B2D`,
    surface, fg `#F7F8F5`, border `#2A3A52`).
  - Añadir fallback `@media (prefers-color-scheme: dark)` para `:root:not([data-theme])`.
  - Conservar los nombres existentes (`--bg`, `--fg`, `--muted`, `--border`, `--radius`,
    `--space`, `--max-width`) para no romper consumidores; añadir los nuevos.
  - Añadir base mobile-first, `:focus-visible` global, clase `.num` (mono + `tabular-nums`).
  - _Requisitos: 1.1, 1.2, 1.3, 1.4, 2.2, 7.1, 7.4_

- [x] 2. Tipografía con next/font
  - En `app/layout.tsx` cargar Sora (700), Inter (400, 500) y JetBrains Mono (600) vía
    `next/font/google` con `variable` y `display: "swap"`.
  - Mapear a `--font-title/--font-body/--font-mono` y aplicar las clases de variable en
    `<html>`. Aplicar `--font-body` como fuente base del `body`.
  - _Requisitos: 2.1, 2.3, 2.4_

- [x] 3. Tema claro/oscuro (patrón idéntico al idioma)
- [x] 3.1 Capa de tema en `lib/theme/`
  - Crear `lib/theme/config.ts` (`themes`, `Theme`, `THEME_COOKIE = "unigrades_theme"`),
    `lib/theme/request.ts` (`getTheme()` lee cookie, devuelve `Theme | null`),
    `lib/theme/actions.ts` (`setTheme` server action: cookie de 1 año + `revalidatePath`),
    replicando `lib/i18n/{config,request,actions}.ts`.
  - _Requisitos: 6.1, 6.3_
- [x] 3.2 Resolución en servidor (anti-FOUC) y toggle
  - En `app/layout.tsx` resolver `getTheme()` y fijar `data-theme` en `<html>` (omitir el
    atributo si es `null` para caer en `prefers-color-scheme`).
  - Crear `components/theme/ThemeToggle.tsx` (client, `useTransition` + `setTheme`), molde de
    `LanguageSwitcher`, con icono Lucide + texto (no solo color).
  - _Requisitos: 6.2, 6.4, 6.5, 6.6, 6.7_

- [x] 4. Iconografía Lucide
  - Añadir `lucide-react` pineado a versión exacta en `package.json`; instalar.
  - Convención: iconos heredan `currentColor`; importar solo los usados.
  - _Requisitos: 4.1, 4.2, 4.3_

- [x] 5. Primitivos de UI en `components/ui`
- [x] 5.1 Rediseñar primitivos existentes (retrocompatibles)
  - `Button`: variantes `primary`/`secondary` con tokens, `isLoading?`, altura `--tap-min`;
    conservar firma (`variant` + props nativas).
  - `Input`: conservar `label`/`id`; añadir `error?` con `aria-invalid`/`aria-describedby`.
  - `Container`: mismo contrato, usar tokens.
  - _Requisitos: 3.1, 3.2, 3.7, 7.2, 7.3_
- [x] 5.2 Nuevos primitivos presentacionales
  - `Card`, `StatCard`, `StatusBadge` (`status: good|risk|behind` → menta/ámbar/coral, icono +
    texto), `ProgressRing` (SVG, `aria-label` con %), exportar todo desde
    `components/ui/index.ts`.
  - _Requisitos: 3.3, 3.4, 3.5, 3.6, 7.5_
- [x] 5.3 `AnimatedNumber`
  - Componente que anima la transición del valor con `requestAnimationFrame`, sin dependencias;
    si `prefers-reduced-motion: reduce`, fija el valor sin tween. Props `value`, `decimals?`.
  - _Requisitos: 3.6, 11.1, 11.4_

- [x] 6. Componente `Logo`
  - `components/Logo.tsx` con `variant: "symbol" | "horizontal" | "mono"` y `height?` (mín.
    24px). Placeholder: wordmark "unigrades" en Sora hasta tener assets. Zona de respeto.
  - _Requisitos: 9.1, 9.2, 9.3_

- [x] 7. Forecast de nota (tarjeta estrella) — lógica pura
- [x] 7.1 Implementar `lib/grade-forecast.ts`
  - Función pura `forecastRequiredGrade` con el tipo `Forecast` =
    `secured | needed | impossible | incomplete_setup | insufficient`.
  - Orden de la lógica: sin componentes → `insufficient`; suma de % ≠ 100 (tol. 0.01) →
    `incomplete_setup` (NO calcular sobre total parcial); `pesoRestante == 0` →
    `secured`/`impossible`; si no, `required = (notaMinima - aportado)/(pesoRestante/100)` →
    `secured` (≤0) / `impossible` (>escalaMax) / `needed` (1 decimal). Nunca lanza.
  - Recibe datos ya cargados por los hooks (componentes, `ComponenteCalificacion`,
    `nota_minima_aprobacion`); NO importa de `services/`.
  - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
- [x] 7.2 Test unitario del forecast
  - Añadir Vitest mínimo si no hay runner. `lib/grade-forecast.test.ts` cubre: `insufficient`,
    `incomplete_setup` (suma < 100 y > 100), `secured`, `needed` (valor esperado),
    `impossible` (required > 5 y sin peso restante).
  - _Requisitos: 8.2, 8.3, 8.4, 8.6, 10.1_

- [x] 8. Microinteracciones de celebración
  - Añadir `canvas-confetti` pineado; asset local `public/sounds/approve.mp3`.
  - Crear `lib/celebrate.ts` (`celebrate()`): confeti + sonido; sonido silenciable y silenciado
    por defecto si `prefers-reduced-motion` o sin gesto previo; desactivar confeti con
    `prefers-reduced-motion`. Sin red externa. No bloquea la UI ni propaga errores de audio.
  - _Requisitos: 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 9. Navegación móvil de `/app`
  - `components/nav/AppNav.tsx` montado en `app/app/layout.tsx` por encima de `{children}`
    (conservar el gate de sesión server existente).
  - Links `next/link` a `/app`, `/app/semesters`, `/app/settings`; sección activa con
    `usePathname` marcada con indicador/texto (no solo color).
  - Alojar `LanguageSwitcher`, `ThemeToggle` y `LogoutButton` sin cambiar su lógica.
  - Mobile-first: targets ≥44px, sin scroll horizontal a 360px; expandir en ≥640px.
  - _Requisitos: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [x] 10. Rediseño de pantallas (sin cambiar datos/callbacks)
- [x] 10.1 Landing + auth
  - `app/page.tsx`: hero con `Logo horizontal`, Sora, CTA; footer con aviso de no afiliación
    UNAL. `app/login/LoginForm.tsx` y `app/signup/SignupForm.tsx`: `Card`, `Input` con error,
    `Button` primario. Mismos hooks/acciones existentes.
  - _Requisitos: 5.1, 5.4, 9.4, 10.3, 10.4_
- [x] 10.2 Dashboard
  - `app/app/DashboardClient.tsx`: promedio global y créditos como `StatCard` (`.num`); avance
    por tipología con `ProgressRing`/barras; materias en curso como `Card` con `StatusBadge`.
    Conservar `useGlobalAverage`/`useProgressByTypology`/`useCurrentSubjects` y sus `queryKey`.
  - _Requisitos: 5.1, 5.2, 5.5, 10.3_
- [x] 10.3 Detalle de materia + tarjeta estrella + celebración
  - `app/app/subjects/[id]/SubjectComponentsClient.tsx` y `ComponentGrades.tsx`: nota de la
    materia con `AnimatedNumber`; `Card` destacada con el resultado de `forecastRequiredGrade`
    (mensaje por `kind`, incl. `incomplete_setup`); componentes/notas como `Card`; conservar la
    validación RN-2 de UX y todos los hooks.
  - Enganchar `celebrate()` SOLO en la transición real a `aprobada` (vía `onSuccess` de
    `useUpdateEnrollmentState` comparando estado previo ≠ `aprobada`; o `useRef` de salvaguarda
    que no dispara al montar una materia ya aprobada).
  - _Requisitos: 5.1, 5.3, 5.5, 5.6, 8.1, 11.2, 11.5, 10.3_
- [x] 10.4 Semestres, detalle de semestre, onboarding y settings
  - `SemestersClient.tsx`, `semesters/[id]/SemesterDetailClient.tsx`, `onboarding/
    OnboardingClient.tsx`: listas/formularios con `Card`, `Input`, `Button`; promedios con
    `.num`. Settings: idioma (`LanguageSwitcher`), tema (`ThemeToggle`), programa. Sin lógica
    de datos nueva; mismos hooks/callbacks.
  - _Requisitos: 5.1, 5.5, 6.2, 10.3, 10.4_

- [x] 11. Verificación final y no regresión
  - Correr `npm run typecheck`, `npm run lint`, `npm run build` y los tests del forecast.
  - Verificar que el diff NO toca `services/`, `lib/supabase/`, `supabase/`, `types/domain.ts`
    ni altera `queryKey`/firmas en `services/queries.ts`.
  - Revisión responsive a 360px y ≥640px, en claro y oscuro (manual por el usuario; el agente
    no levanta dev server). Confirmar que no hay textos hardcodeados (es/en completos).
  - _Requisitos: 10.1, 10.2, 10.3, 10.4, 7.1, 6.7_
