# Rediseño Frontend UniGrades — Requisitos

## Introducción

El MVP de UniGrades se construyó con una UI deliberadamente mínima (blanco y negro, estilos
inline) para que el rediseño visual fuera **solo frontend**. Esta spec cubre ese rediseño:
aplicar la identidad visual definida por el equipo (ver
`.kiro/steering/design-guidelines.md`) sobre la capa de presentación existente, sin tocar
el backend, los servicios (`services/`), las reglas de negocio (RN-1..RN-7) ni el esquema de
la base de datos.

### Alcance (lo que cambia)
- Tokens de diseño (color, tipografía, radios, sombras, espaciado) en `app/globals.css`.
- Componentes de UI reutilizables en `components/ui` (Button, Input, Container) y nuevos
  primitivos presentacionales (Card, Badge/estado, ProgressRing, StatCard).
- Estilos y marcado de las pantallas existentes (landing, login, signup, dashboard,
  onboarding, semestres, detalle de semestre, detalle de materia, settings).
- Tipografía vía Google Fonts (Sora, Inter, JetBrains Mono).
- Iconografía con Lucide.
- Soporte de modo claro/oscuro con las mismas variables de color.
- Diseño mobile-first.
- Soporte para las 3 versiones del logo (símbolo, horizontal, monocromo) como slots.
- "Tarjeta estrella" (¿qué nota necesitas en el próximo parcial?): cálculo en el cliente.

### Fuera de alcance (lo que NO cambia)
- `services/*` y `lib/supabase/*` (capa de datos).
- Reglas de negocio RN-1..RN-7, triggers, vistas, RLS, migraciones.
- Los hooks de React Query y las `queryKey` existentes.
- Rutas y nombres de archivos de rutas (convención Next.js).
- i18n: se mantienen las claves de `messages/*.json`; se pueden **agregar** claves nuevas
  para textos de estado, pero no se renombran las existentes sin necesidad.

### Convenciones (de `tech.md`)
- TypeScript estricto, sin `any`. ESLint + Prettier.
- Componentes de UI "tontos": reciben datos y callbacks, no hablan con Supabase ni contienen
  reglas de negocio.
- Datos remotos siempre vía React Query (nada de `useEffect` + `fetch`).
- Verificación tras cada cambio: `npm run typecheck`, `npm run lint`, `npm run build`.

> **Segundo pase (revisión del líder + feedback del usuario).** Tras ejecutar el primer pase,
> el usuario pidió un rediseño más profundo: adoptar **Tailwind v4 + shadcn + MagicUI** para
> dar vida a la página, invertir la jerarquía de color (**blanco/negro dominante, verde como
> acento menor**, dark mode casi negro estilo "SerStack"), **acortar el hero** (tenía
> demasiado texto) y **arreglar el rendimiento** (la app se sentía lenta y los botones no daban
> señal al click). Los Requisitos 13–16 cubren ese segundo pase; los Requisitos 1–12 siguen
> vigentes, con la salvedad de la jerarquía de color (ver Requisito 14) y el hero (Requisito 15).
> Detalle de lo instalado/usado: ver `redesign-log.md`.

---

## Requisitos

### Requisito 1 — Sistema de tokens de diseño

**Historia de usuario:** Como desarrollador, quiero un único sistema de variables de diseño,
para que un restyle futuro sea un cambio centralizado y los componentes no repitan valores.

#### Criterios de aceptación
1. CUANDO se definan los colores ENTONCES `app/globals.css` DEBE exponer variables CSS para:
   principal `#0B6B4F`, acento/éxito `#2ED8A3`, fondo oscuro `#0F1B2D`, fondo claro
   `#F7F8F5`, alerta `#FFB020`, peligro `#FF5C5C`, texto secundario `#5B6770`.
2. CUANDO se definan radios, sombras y espaciado ENTONCES DEBEN existir como variables
   (`--radius: 16px` para tarjetas, sombra suave, escala de espaciado).
3. CUANDO un componente necesite un color o medida ENTONCES DEBE leerlo de una variable, NO
   de un literal hex o px incrustado.
4. EL SISTEMA DEBE conservar los nombres de variables existentes usados por los componentes
   (`--radius`, `--space`, `--border`, `--muted`, `--max-width`, `--bg`, `--fg`) o
   actualizarlos de forma consistente en todos los consumidores.

### Requisito 2 — Tipografía

**Historia de usuario:** Como estudiante, quiero una tipografía clara y cifras alineadas,
para leer mis notas de un vistazo.

#### Criterios de aceptación
1. EL SISTEMA DEBE cargar Sora (700) para títulos/logo, Inter (400, 500) para texto, y
   JetBrains Mono (600) para cifras, vía `next/font/google`.
2. CUANDO se muestre una nota, promedio o porcentaje ENTONCES DEBE usar la fuente mono con
   cifras tabulares (`font-variant-numeric: tabular-nums`).
3. CUANDO se muestre un título o el wordmark ENTONCES DEBE usar Sora.
4. LA carga de fuentes NO DEBE causar layout shift perceptible (usar `display: swap` o
   `next/font` con subsetting).

### Requisito 3 — Primitivos de UI reutilizables

**Historia de usuario:** Como desarrollador, quiero primitivos presentacionales, para que las
pantallas compongan UI consistente sin estilos inline duplicados.

#### Criterios de aceptación
1. EL SISTEMA DEBE proveer `Button` con variantes al menos `primary` (verde) y `secondary`
   (contorno), estados `disabled`/`loading`, manteniendo la firma de props actual
   (`variant`, props nativas de button).
2. EL SISTEMA DEBE proveer `Input` con label opcional y estado de error, manteniendo la
   firma actual (`label`, `id`, props nativas de input).
3. EL SISTEMA DEBE proveer `Card` (esquinas 16px, sombra suave) como contenedor base.
4. EL SISTEMA DEBE proveer `StatusBadge` con tres estados de color: "Vas bien" (menta),
   "En riesgo" (ámbar), "Necesitas remontar" (coral), con texto vía i18n.
5. EL SISTEMA DEBE proveer `ProgressRing` (anillo de progreso por %) y `StatCard`
   (métrica grande con etiqueta).
6. TODOS los primitivos DEBEN ser componentes "tontos": sin llamadas a servicios, sin
   lógica de negocio, solo props y callbacks.
7. LAS firmas de props de `Button`, `Input` y `Container` DEBEN seguir siendo compatibles con
   los consumidores actuales, o actualizarse en todos los consumidores en el mismo cambio.

### Requisito 4 — Iconografía

**Historia de usuario:** Como estudiante, quiero iconos claros, para reconocer acciones y
estados rápidamente.

#### Criterios de aceptación
1. EL SISTEMA DEBE usar la familia de iconos Lucide (línea redondeada, 2px).
2. CUANDO se agregue la dependencia de iconos ENTONCES DEBE pinearse a una versión exacta y
   ser un paquete mantenido (`lucide-react`).
3. LOS iconos DEBEN heredar el color del texto (`currentColor`) para funcionar en claro/oscuro.

### Requisito 5 — Rediseño de pantallas existentes

**Historia de usuario:** Como estudiante, quiero que toda la app tenga la nueva identidad
visual, para una experiencia coherente.

#### Criterios de aceptación
1. CUANDO se rediseñe una pantalla ENTONCES DEBE conservar exactamente su comportamiento de
   datos: mismos hooks de React Query, mismos callbacks, mismas rutas.
2. EL dashboard (`DashboardClient`) DEBE presentar promedio global y créditos como `StatCard`,
   el avance por tipología con barras/anillos de progreso, y las materias en curso como
   tarjetas.
3. EL detalle de materia (`SubjectComponentsClient`) DEBE presentar la nota de la materia
   como pieza destacada, el indicador de suma de porcentajes y la lista de componentes como
   tarjetas, sin cambiar la validación RN-2 de UX existente.
4. LAS pantallas de auth (login, signup) y la landing DEBEN adoptar la nueva identidad.
5. CUANDO se muestre un estado de materia ENTONCES DEBE usar `StatusBadge` con el color
   correspondiente.
6. NINGUNA pantalla DEBE introducir lecturas directas a Supabase ni lógica de negocio nueva
   (salvo la tarjeta estrella del Requisito 8, resuelta en cliente).

### Requisito 6 — Modo claro y oscuro

**Historia de usuario:** Como estudiante, quiero modo claro y oscuro, para usar la app
cómodamente de día y de noche.

#### Criterios de aceptación
1. EL SISTEMA DEBE soportar modo claro (fondo `#F7F8F5`) y oscuro (fondo `#0F1B2D`) usando
   las mismas variables de color (redefinidas por tema).
2. EL usuario DEBE poder alternar claro/oscuro desde un control en la UI.
3. CUANDO el usuario elija un tema ENTONCES su elección DEBE recordarse vía cookie, siguiendo
   el mismo patrón que el idioma: una cookie de un año (p. ej. `unigrades_theme`), escrita por
   una server action análoga a `setLocale` con `revalidatePath`.
4. EL tema activo DEBE resolverse en el servidor (leyendo la cookie, como hace
   `lib/i18n/request.ts`) y aplicarse en el `<html>` del layout raíz ANTES del primer
   render, para evitar el flash (FOUC) al cargar.
5. CUANDO el usuario no haya elegido tema (sin cookie) ENTONCES DEBE respetarse
   `prefers-color-scheme` como valor por defecto.
6. EL cambio de tema NO DEBE requerir cambios en los componentes (solo variables).
7. EL tema NO DEBE romper el contraste de texto en ninguno de los dos modos (AA en texto).

### Requisito 7 — Mobile-first y accesibilidad

**Historia de usuario:** Como estudiante, quiero que la web se vea perfecta en el celular,
porque es donde la usaré.

#### Criterios de aceptación
1. CADA pantalla DEBE ser legible y operable a 360px de ancho sin scroll horizontal.
2. LOS objetivos táctiles (botones, enlaces) DEBEN tener al menos 44x44px de área.
3. LOS controles de formulario DEBEN conservar `label` asociado e `id` (ya presentes).
4. EL foco de teclado DEBE ser visible en elementos interactivos.
5. LOS colores de estado NO DEBEN ser el único medio de transmitir información (incluir
   texto/icono junto al color).

### Requisito 8 — Tarjeta estrella: nota necesaria

**Historia de usuario:** Como estudiante, quiero saber qué nota necesito en lo que falta de
una materia, para enfocar mi esfuerzo.

#### Criterios de aceptación
1. EL cálculo de "nota necesaria" DEBE resolverse en el cliente a partir de datos que ya
   existen (componentes con porcentaje, notas por componente, nota mínima de aprobación),
   SIN crear vistas ni funciones nuevas en la base de datos.
2. CUANDO existan componentes sin nota aún (peso restante) ENTONCES la tarjeta DEBE mostrar
   la nota promedio requerida en ese peso restante para alcanzar la nota mínima de aprobación.
3. CUANDO la nota requerida sea mayor que el máximo de la escala (5.0) ENTONCES la tarjeta
   DEBE indicar que ya no es alcanzable (mensaje, no un número imposible).
4. CUANDO la materia ya esté aprobada con lo registrado ENTONCES la tarjeta DEBE indicar que
   ya está asegurada.
5. EL cálculo DEBE vivir en una función pura y tipada (p. ej. `lib/grade-forecast.ts`), sin
   tocar `services/`.
6. SI falta algún dato para el cálculo ENTONCES la tarjeta DEBE degradar con elegancia
   (mensaje de "sin datos suficientes"), nunca lanzar.

### Requisito 9 — Soporte de logo

**Historia de usuario:** Como equipo, queremos que el frontend soporte las 3 versiones del
logo, para integrarlas cuando el diseño las entregue.

#### Criterios de aceptación
1. EL SISTEMA DEBE proveer un componente `Logo` con variantes `symbol`, `horizontal` y
   `mono`.
2. EL `Logo` DEBE respetar un tamaño mínimo de 24px de alto y una zona de respeto.
3. MIENTRAS no existan los assets finales ENTONCES el componente DEBE renderizar un
   placeholder consistente (wordmark "unigrades" en Sora) sin romper el layout.
4. EL pie de la web DEBE incluir el aviso de no afiliación a la UNAL.

### Requisito 10 — Verificación y no regresión

**Historia de usuario:** Como desarrollador, quiero garantizar que el rediseño no rompe nada,
para entregar con confianza.

#### Criterios de aceptación
1. TRAS cada cambio DEBEN pasar `npm run typecheck`, `npm run lint` y `npm run build`.
2. EL rediseño NO DEBE modificar archivos en `services/`, `lib/supabase/`, `supabase/` ni
   `types/domain.ts`.
3. LAS `queryKey` y las firmas de los hooks de `services/queries.ts` DEBEN permanecer
   intactas.
4. LOS textos de UI DEBEN seguir resolviéndose vía next-intl (es/en); no se introducen
   textos hardcodeados visibles al usuario.

### Requisito 11 — Microinteracciones

**Historia de usuario:** Como estudiante, quiero pequeñas señales visuales y sonoras, para
sentir satisfacción y claridad cuando mis notas cambian o apruebo una materia.

#### Criterios de aceptación
1. CUANDO una cifra mostrada cambie (nota, promedio, porcentaje) ENTONCES DEBE animarse la
   transición del número (p. ej. conteo/tween), de forma breve y discreta.
2. CUANDO una materia pase a estado aprobada ENTONCES DEBE dispararse un efecto de confeti
   discreto y un sonido corto.
3. EL sonido DEBE poder silenciarse por el usuario, y DEBE estar silenciado por defecto si
   el navegador indica `prefers-reduced-motion` o no hay interacción previa que permita
   audio.
4. CUANDO el usuario tenga `prefers-reduced-motion: reduce` ENTONCES las animaciones de
   número y el confeti DEBEN reducirse o desactivarse.
5. LAS microinteracciones NO DEBEN bloquear la interacción ni retrasar la actualización de
   datos; son puramente de presentación sobre el estado que ya provee React Query.
6. CUALQUIER dependencia nueva (confeti) DEBE pinearse a versión exacta y ser ligera; el
   sonido DEBE servirse como asset local, sin llamadas externas.

### Requisito 12 — Navegación móvil

**Historia de usuario:** Como estudiante en el celular, quiero una barra de navegación
consistente, para moverme entre las secciones principales sin perderme.

#### Criterios de aceptación
1. EL área autenticada (`/app`) DEBE tener un header/barra de navegación consistente,
   diseñado mobile-first, visible en todas sus pantallas.
2. LA navegación DEBE dar acceso al menos a dashboard (`/app`), semestres (`/app/semesters`)
   y settings (`/app/settings`), usando `next/link` (sin recargas de página).
3. LA navegación DEBE indicar la sección activa de forma visible (no solo por color).
4. LA navegación DEBE incluir los controles de idioma y de tema, y el botón de cerrar sesión
   ya existente (`LogoutButton`), sin cambiar su lógica.
5. EN viewport móvil (360px) LA navegación DEBE ser operable con objetivos táctiles de al
   menos 44x44px y sin provocar scroll horizontal.
6. LA navegación NO DEBE introducir lógica de datos nueva: solo enlaces y los controles
   presentacionales/acciones ya existentes.

### Requisito 13 — Adopción de Tailwind v4 + shadcn + MagicUI

**Historia de usuario:** Como usuario, quiero una página más viva y con componentes modernos,
y como desarrollador quiero una base de estilos que haga fácil sumar más componentes.

#### Criterios de aceptación
1. EL SISTEMA DEBE adoptar Tailwind CSS v4 vía el plugin PostCSS (`@tailwindcss/postcss`),
   con `@import "tailwindcss"` en `app/globals.css`, SIN reescribir los consumidores actuales.
2. EL SISTEMA DEBE inicializar shadcn (`components.json` + `lib/utils.ts` con `cn`) y puentear
   los tokens que shadcn/MagicUI esperan a las variables existentes mediante `@theme inline`,
   de modo que la paleta siga viviendo UNA sola vez en los temas.
3. CUANDO se añada un componente MagicUI ENTONCES DEBE instalarse por separado desde su
   registro (`https://magicui.design/r/<comp>.json`) y, si falla por incompatibilidad React
   19 / Next 16, NO forzarse: se documenta el fallo en `redesign-log.md`.
4. LAS dependencias de Tailwind DEBEN pinearse a versión exacta; las dependencias de ruido o
   con riesgo de typosquat que arrastre el CLI DEBEN desinstalarse.
5. TODO lo instalado y usado (versiones, comandos, componentes y su origen) DEBE quedar
   documentado en `redesign-log.md`.

### Requisito 14 — Jerarquía de color blanco/negro con verde como acento menor

**Historia de usuario:** Como usuario, quiero una identidad sobria blanco/negro con el verde
solo como acento, y un modo oscuro casi negro que se vea bien.

#### Criterios de aceptación
1. EN tema claro EL fondo y el texto DEBEN ser dominantemente blanco/negro; `--primary` DEBE
   ser negro (botones base blanco/negro) y el verde `#0B6B4F` DEBE usarse solo como acento
   menor (token `--accent`).
2. EN tema oscuro EL fondo DEBE ser casi negro (p. ej. `#0b0f14`), el texto blanco, y el único
   color brillante DEBE ser el acento (menta `#2ED8A3`), usado con moderación.
3. LOS HEX de marca (`#0B6B4F`, `#2ED8A3`, `#FFB020`, `#FF5C5C`) NO DEBEN cambiar de valor;
   solo cambia su aplicación/jerarquía. Siguen sirviendo al semáforo de estado.
4. LOS NOMBRES de variables existentes DEBEN conservarse; el fallback
   `prefers-color-scheme: dark` DEBE reflejar el nuevo tema oscuro.
5. EL cambio NO DEBE tocar `lib/theme/*` ni `app/layout.tsx` (la resolución por cookie y el
   anti-FOUC se conservan).

### Requisito 15 — Hero corto en la landing

**Historia de usuario:** Como visitante, quiero entender la propuesta de un vistazo, sin
párrafos largos antes de registrarme.

#### Criterios de aceptación
1. EL hero de `app/page.tsx` DEBE presentar un titular CORTO y un subtítulo de UNA línea, en
   lugar del párrafo largo anterior.
2. EL titular DEBE llevar un fragmento de acento en color brillante (verde/menta) y el fondo
   DEBE ser oscuro casi negro, coherente con el estilo "SerStack".
3. TODO el copy del hero DEBE resolverse vía next-intl en es/en; `landing.tagline` y las demás
   claves existentes DEBEN conservarse.
4. EL footer con el aviso de no afiliación a la UNAL DEBE conservarse.

### Requisito 16 — Rendimiento percibido

**Historia de usuario:** Como usuario, quiero que la app responda rápido y que al tocar un
botón sepa de inmediato que se activó.

#### Criterios de aceptación
1. LA validación de sesión server dentro de `/app` NO DEBE repetirse en serie: DEBE quedar UNA
   sola revalidación además del `proxy.ts` (que ya valida en cada request), con un comentario
   que justifique la seguridad del cambio. NO se toca `lib/supabase/*`.
2. EL dashboard DEBE lanzar sus 3 queries en paralelo (no en cascada) conservando las
   `queryKey` y firmas de `services/queries.ts` exactas; si el prefetch server resulta frágil
   por el client de navegador + RLS, DEBE usarse el fallback `useQueries`, documentando la
   elección.
3. LOS botones DEBEN dar feedback `:active`/pressed instantáneo al click, y al menos un CTA de
   navegación DEBE mostrar estado *pending* inmediato (`useLinkStatus`/`useTransition`),
   conservando la firma de props de `Button`.
