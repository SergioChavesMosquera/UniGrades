# Bitácora de construcción — UniGrades

> Diario crudo y cronológico de cómo se construyó UniGrades desde cero, con Kiro
> (asistente de IA) como copiloto. Material fuente para la serie de TikTok y el ebook.
> Se escribe en tiempo real: honesto, con los aciertos y los tropiezos.
>
> **Convención:** cada entrada marca el modo de trabajo —🧭 *Plan* (conversación y diseño)
> o 🛠️ *Ejecución* (escribir código real)— porque esa distinción es una de las
> lecciones centrales: pensar antes de construir.

---

## Episodio 0 — El contacto inicial 🧭

**Lo que pasó:** Sergio contacta a Kiro con una idea: retomar UniGrades, un proyecto
que ya había hecho como trabajo de clase de Bases de Datos, pero esta vez llevarlo a
algo real de producción, con miras a una startup, y usarlo también como entregable para
una clase de inglés (un video paso a paso de cómo se saca adelante un proyecto).

**El prompt inicial (resumido):** "Quiero hacer una startup retomando UniGrades. La idea
es una app para llevar registro de notas, cómo se reparten, promedios por materia,
semestre y global. Quizás app móvil con React Native. Adjunto el documento del proyecto
de clase (enfocado en bases de datos)."

**Contexto que aportó:** un PDF completo del proyecto de clase con el dominio ya pensado:
9 entidades, 7 reglas de negocio (RN-1 a RN-7), diagrama entidad-relación, diccionario de
datos. Oro puro para no partir de cero.

**Decisión clave:** no reinventar el dominio. El modelo de datos del trabajo de clase era
sólido; lo reutilizamos y lo adaptamos a producción.

---

## Episodio 1 — Definir qué construir (y qué NO) 🧭

**Lo que pasó:** Kiro hizo preguntas en bloques de 3 para acotar el alcance en vez de
asumir. Decisiones tomadas:

- **Plataforma:** se evaluó móvil (React Native) vs web. Se eligió **web primero**
  (Next.js), y móvil después en un repo aparte. Razón: la web es más rápida de iterar,
  ideal para una demo de clase, y permite una landing para la startup.
- **Backend:** **Supabase** (Postgres real + Auth). Aguanta 300+ usuarios en plan
  gratuito y soporta las reglas de negocio (triggers, constraints) tal cual el documento
  de clase.
- **Alcance del MVP:** núcleo completo (materias, componentes que suman 100%, notas,
  promedios) + catálogo de carreras precargado + creación manual + auth + i18n es/en.
- **Fuera del MVP:** suscripciones y cobros (eso lo definirá el socio de negocio después).
  La app arranca 100% gratis y sin rastro técnico de pagos.

**Pregunta del espectador que responde este episodio:** "¿Cómo decides qué entra en la
primera versión y qué no?"

---

## Episodio 2 — El patrón de rutas tipo Framer 🧭

**Lo que pasó:** Sergio pidió definir rutas y slugs antes de programar, inspirado en cómo
lo hace Framer: la landing en la raíz (`framer.com`) y la app bajo un slug
(`framer.com/projects`).

**Decisión:** landing pública en `/`, y toda la app bajo `/app/*` (protegida). También se
decidió **UI mínima deliberada** (blanco y negro) para no gastar tiempo en diseño: primero
que funcione el backend y el flujo, el embellecimiento es solo frontend y va al final.

**Lección de producto:** "Haz que funcione antes de que se vea bonito." Separar backend y
frontend desde el día 1 permite rediseñar después sin tocar la lógica.

---

## Episodio 3 — Organización con Kiro: Steering, Specs y Hooks 🧭→🛠️

**Lo que pasó:** antes de escribir código, se montó la infraestructura para que el
proyecto corriera "como relojito":

- **Steering** (`.kiro/steering/`): reglas fijas del proyecto (stack, convenciones, UI
  mínima, las 7 reglas de negocio). Kiro las respeta en cada interacción.
- **Spec** (`.kiro/specs/unigrades-web/`): el plan convertido en 3 documentos —
  `requirements.md`, `design.md`, `tasks.md`— con 13 tareas ejecutables una por una.
- **Hook** (`.kiro/hooks/`): automatización que corre type-check + lint cada vez que se
  guarda un archivo de código.

**Lección:** la IA rinde mucho más cuando le das reglas y un plan escrito, en vez de
pedirle cosas sueltas.

---

## Episodio 4 — Primera construcción: el esqueleto web 🛠️

**Lo que pasó:** se inicializó el proyecto Next.js (App Router + TypeScript), con estilo
mínimo blanco/negro y componentes reutilizables (Button, Input, Container). Luego la
landing y las rutas públicas (`/`, `/login`, `/signup`).

**🔥 Obstáculo real #1 (buen material de video):** al instalar, npm avisó que la versión
de Next.js tenía una **vulnerabilidad de seguridad** (CVE-2025-66478). Decisión: actualizar
a la versión parcheada antes de seguir. Lección: no ignorar las advertencias de seguridad,
aunque frenen un minuto.

**🔥 Obstáculo real #2:** el comando `next lint` fue **removido en Next.js 16**. El lint se
rompió. Hubo que migrar la configuración de ESLint al formato nuevo ("flat config"). Lección:
las herramientas cambian; saber diagnosticar y migrar es parte del trabajo.

**Resultado:** landing navegable en blanco y negro, compilando limpio.

---

## Episodio 5 — Donde viven los datos: Supabase 🛠️

**Lo que pasó:** se creó el proyecto en Supabase y se definió el esquema de base de datos
como **migraciones SQL versionadas** (archivos en `supabase/migrations/`). Se conectó el
cliente a la app.

**Analogía para el video:** una base de datos relacional es como "un Excel que vive en
internet, con reglas que nadie puede saltarse": varias hojas (tablas) conectadas entre sí,
donde cada dato tiene su lugar y su validación.

**🔒 Momento de seguridad (material de video):** al pegar las claves, una era la clave
*secreta* (acceso total). Lección en vivo: nunca expongas la clave secreta; en el frontend
solo va la clave publicable, y la seguridad real la impone la base de datos (RLS).

**Decisión de diseño:** el `id` del usuario en la base de datos es el mismo que el de
Supabase Auth, para que la seguridad por usuario sea directa y limpia.

---

## Episodio 6 — Las reglas que nadie puede romper 🛠️

**Lo que pasó:** se implementaron las reglas de negocio directamente en la base de datos
(no solo en la app), para que sean la autoridad:

- Los porcentajes de evaluación de una materia no pueden pasar de 100 (y deben sumar 100
  al cerrar). **Decisión de UX:** modo flexible — se permite ir sumando de a poco mientras
  configuras, pero nunca pasarse de 100.
- Una materia aprobada o reprobada no puede volver a "en curso".
- Una nota siempre está entre 0.0 y 5.0.
- Las materias de nivelación (como inglés) no cuentan en el promedio.
- Cada usuario solo ve sus propios datos (Row Level Security).

**Lección:** poner las reglas en la base de datos protege la integridad aunque cambie la
app o el dispositivo. La base de datos es "el guardián".

---

## Episodio 7 — Entrar a la app: autenticación 🛠️

**Lo que pasó:** se implementó registro e inicio de sesión con correo/contraseña y con
Google. Se protegieron las rutas: sin sesión no entras a `/app`. Al registrarte, se crea
tu perfil automáticamente.

**🔥 Obstáculo real #3:** en Next.js 16 el archivo `middleware` quedó deprecado y hubo que
renombrarlo a `proxy`. Otra herramienta que evolucionó a mitad de camino.

**Verificación:** el registro por correo funcionó a la primera.

**Pregunta del espectador:** "¿Cómo haces que cada persona solo vea SUS datos y no los de
los demás?"

---

## Episodio 7.5 — Dos pivotes reales: cuenta y alcance de auth 🧭🛠️

**🔄 Pivote #1 — Cambio de cuenta Supabase.** Al ir a configurar Google, Sergio notó que
el proyecto Supabase inicial estaba en OTRA cuenta (no la institucional). Decisión:
rehacer el proyecto Supabase desde cero en la cuenta con correo UNAL, para centralizar
todo bajo un mismo correo. Como las migraciones ya estaban versionadas en el repo, "mudar"
la base de datos fue trivial: crear proyecto nuevo + correr `0001_schema.sql` y
`0002_rules.sql` otra vez. **Lección de video:** por esto se versiona el SQL —cambiar de
servidor es copiar y pegar, no empezar de cero.

**🔄 Pivote #2 — Quitar Google del MVP.** Configurar Google OAuth obliga a salir a Google
Cloud Console (crear proyecto, consent screen, credenciales), y además las cuentas
institucionales (@unal.edu.co) a veces lo bloquean por políticas del administrador. Sergio
lo intentó y se topó con fricción. Decisión de producto: **quitar Google por ahora** y
quedarnos solo con email + contraseña, que vive 100% dentro de Supabase y "cualquier
persona lo entiende". Google se podrá retomar al desplegar.

**🔥 Obstáculo técnico al quitar Google:** tras borrar el callback de OAuth, el type-check
falló porque Next.js tenía en caché (`.next/types`) una referencia a la ruta borrada.
Solución: limpiar la carpeta `.next` y reconstruir. Lección: a veces el error no está en tu
código sino en el caché de la herramienta.

**Lección de producto (muy vendible):** la mejor decisión a veces es QUITAR una función,
no agregarla. Menos fricción para el usuario = mejor producto. "Hazlo tan simple que
cualquiera pueda usarlo" ganó sobre "ten todas las opciones de login".

**Estado final de auth:** solo email + contraseña. Botón de Google, función
`signInWithGoogle`, y el route handler `/auth/callback` eliminados por completo (nada de
código muerto). Confirmación de correo desactivada en Supabase para desarrollo rápido.

**Pendiente de config del usuario:** si en el futuro se quiere Google, habrá que configurar
Google Cloud (quizá con un Gmail personal si la cuenta UNAL sigue bloqueando) + reactivar
el proveedor en Supabase.

---

---

## Interludio — Nace la estrategia de contenido (build in public) 🧭

**Lo que pasó:** a mitad de la construcción, Sergio propuso dos ideas de negocio sobre el
propio proceso:

1. **Serie de TikTok de 10 episodios** mostrando cómo se crea la startup paso a paso
   (de "find a problem worth solving" hasta "launch & get first users"), 60-90s cada uno.
2. **Un ebook** como producto de venta: documentar en tiempo real todo el proceso (prompts,
   decisiones, modo plan vs ejecución, qué se revisó) y venderlo en los videos con el clásico
   "comenta X palabra y te mando el link".

**Decisiones:**
- Se creó la carpeta `bitacora/` separada del código: `diario.md` (bitácora cruda,
  cronológica, en español, material fuente) y `ebook-outline.md` (producto final, 100%
  en inglés, sin rastro de español).
- La bitácora se actualiza **automáticamente al cerrar cada tarea** (se creó un hook
  `update-bitacora-on-task-complete` con trigger PostTaskExec) para no perder ningún dato.
- Lección de producto: el "detrás de cámaras" vale más grabado en tiempo real que
  reconstruido; los obstáculos reales (🔥) son el mejor material, no el enemigo.

**Recomendación activa:** ir capturando screenshots y clips en cada hito (especialmente el
futuro "momento mágico": el promedio calculándose solo). No dejarlo para el final.

---

## Episodio 8 — Hablar dos idiomas: internacionalización 🛠️

**Lo que pasó:** se agregó soporte español/inglés con `next-intl`, con un selector de
idioma visible (ES/EN) en la landing y en la app. El idioma elegido se guarda en una
cookie (dura un año) y persiste entre visitas.

**Decisión técnica:** se eligió i18n SIN prefijos de ruta (nada de `/es` o `/en` en la
URL). Las URLs quedan limpias y el idioma se resuelve por cookie. Esto encaja con el patrón
Framer y evita duplicar rutas.

**Arquitectura:** todos los textos salieron del código y viven ahora en `messages/es.json`
y `messages/en.json`. Los componentes piden textos por clave (ej. `login.title`). Un
server action (`setLocale`) cambia la cookie y refresca la UI. Lección: separar los textos
del código es lo que permite traducir sin tocar la lógica —y mañana agregar un tercer
idioma es solo un archivo JSON más.

**🔥 Obstáculo de seguridad (decisión consciente):** al instalar `next-intl`, npm reportó
4 vulnerabilidades "altas" en la cadena `braces → micromatch → fast-glob →
@next/eslint-plugin-next`. Análisis: son dependencias SOLO de desarrollo (el plugin de
ESLint), no van al producto desplegado, y el riesgo (DoS por patrones anidados) no aplica
en producción. El "fix" automático degradaría el plugin a una versión vieja incompatible
con Next 16. Decisión: NO aplicar el fix; dejarlo documentado. Lección de video: no todas
las alertas de seguridad son iguales —hay que leer de dónde vienen y si afectan producción
antes de romper algo por miedo.

**Resultado:** la app cambia entre español e inglés al instante, con el idioma recordado.
Nota: `/login` y `/signup` pasaron de estáticas a dinámicas (ahora leen la cookie por
request), lo cual es esperado.

---

## Episodio 9 — El onboarding y el catálogo de carreras 🧭🛠️

**Lo que pasó:** se construyó el onboarding, el momento en que un usuario nuevo pasa de
"cuenta vacía" a "listo para registrar notas". Dos caminos:
- **Camino A (catálogo):** elige un programa ya cargado y queda con todas sus materias.
- **Camino B (crear a mano):** si su carrera no está, crea su programa y agrega materias
  (privadas, solo él las ve).

**Decisiones de producto (de la conversación con Sergio):**
- **Datos:** se arrancó con SU malla de Ingeniería de Sistemas (UNAL, plan 2A74), bien
  hecha; las de los compañeros se cargarán después con la misma plantilla.
- **Privacidad camino B:** privado por ahora ("tirando a" compartido en el futuro, en
  vacaciones). Simple y sin datos sucios para el MVP.
- **Alcance:** el onboarding deja el programa y sus materias cargados y visibles (RN-1 +
  onboarding_completo), pero registrar notas/componentes es tarea posterior.
- **🔄 Simplificación en vivo:** inicialmente se iba a modelar la rama "obligatoria vs
  optativa" por materia, pero Sergio decidió —con buen criterio— que "no hay mucha
  diferencia para ponernos a hacer tanto": todas quedan como obligatorias dentro de su
  tipología, y se puede refinar después. Lección: no sobre-modelar; lo que importa para los
  promedios es la tipología y si cuenta o no.

**🔎 Dato real que se corrigió:** el scraping de Gemini traía códigos de materias
duplicados y errados. La malla OFICIAL (PDF del plan 2A74) permitió corregirlos. Sergio
fue claro: "no supongas ni modifiques nada; una cosa es lo que dice la malla y otra cómo
funciona el sistema". Se respetó: los datos salieron de la fuente oficial + lo que él
confirmó, sin inventar.

**🛠️ La plantilla para escalar:** Sergio pidió una forma de capturar mallas (suya y de
compañeros) sin escribir SQL. Primero se hizo un CSV, pero Excel le daba la advertencia de
"posible pérdida de datos". Solución: se generó un `.xlsx` NATIVO con la malla de Sistemas
cargada, listas desplegables (tipología/rama/cuenta_promedio) y una hoja de instrucciones.
**🔥 Detalle de higiene:** para generar el Excel se instaló una librería (exceljs) que traía
dependencias viejas; se usó una vez y se DESINSTALÓ enseguida. Se verificó
`npm audit --omit=dev` = 0 vulnerabilidades en producción. Lección: no dejar carga
innecesaria en el proyecto por una tarea de un solo uso.

**Arquitectura:** servicios `catalog.ts` (leer programas/materias, crear programa propio,
agregar materias) y `profile.ts` (cerrar onboarding), con hooks de React Query en
`queries.ts`. La UI (OnboardingClient) es cliente y consume los hooks; nada habla con
Supabase directo.

**Seed:** `0003_seed.sql` carga el catálogo público (idempotente). Material fuente en
`supabase/seed-data/` (xlsx + csv).

**Pendiente de config del usuario:** aplicar `0003_seed.sql` en el SQL Editor de Supabase.

---

## Episodio 10 — Armar el historial: semestres e inscripciones 🛠️

**Lo que pasó:** el usuario ya puede crear semestres (ej. "2024-2") e inscribir materias
de su programa en cada uno, con un estado (en curso / aprobada / reprobada / retirada).
Rutas nuevas: `/app/semesters` (lista + crear) y `/app/semesters/[id]` (detalle: inscribir,
cambiar estado, quitar).

**Decisiones de producto (de la conversación con Sergio):**
- **De dónde se eligen las materias:** solo del programa del usuario (las del catálogo que
  eligió). Nada de prerrequisitos ni electivas por ahora: "después nos preocupamos por
  escalar".
- **Estado al inscribir:** el usuario ELIGE el estado al inscribir (no nace siempre "en
  curso"). Razón de peso: al empezar a usar la app, el estudiante querrá cargar su
  historial pasado (materias ya aprobadas de semestres anteriores), no solo el semestre
  actual. Buen ejemplo de pensar en el uso real.

**Reglas de negocio en acción (ahora visibles para el usuario):**
- RN-3: si intentas inscribir la misma materia dos veces en el mismo semestre, la base de
  datos lo rechaza (UNIQUE) y la app muestra "esa materia ya está inscrita".
- RN-4: si intentas devolver una materia aprobada/reprobada a "en curso", el trigger lo
  rechaza y la app muestra el mensaje correspondiente. El frontend traduce los errores
  técnicos de la base de datos a mensajes claros.

**Arquitectura:** servicio `semesters.ts` (semestres + inscripciones con la materia
asociada por join), hooks de React Query en `queries.ts` con invalidación de caché al
mutar, y dos pantallas cliente que consumen los hooks. El dashboard ahora enlaza a "Mis
semestres". Todo traducido es/en.

**Lección de video:** las reglas que pusimos en la base de datos (RN-3, RN-4) por fin se
"ven" en la interfaz. El usuario no puede romperlas aunque quiera, porque la autoridad es
la base de datos, no el formulario.

---

## Episodio 11 — Cómo se evalúa cada materia: componentes y el 100% 🛠️

**Lo que pasó:** el usuario ya puede configurar los componentes de evaluación de cada
materia inscrita (ej. Parcial 1 = 30%, Talleres = 20%, Proyecto = 50%), en la ruta
`/app/subjects/[id]` (donde [id] es la inscripción). Se llega con un botón "Configurar
evaluación" en cada materia del detalle del semestre.

**La estrella de la tarea — RN-2 en modo flexible, visible:** hay un indicador EN VIVO de
la suma de porcentajes:
- Si va en menos de 100 → "Falta X% para llegar a 100".
- Si llega a 100 → "Completo — suma 100%".
- Si se intenta pasar de 100 → la base de datos (trigger) lo rechaza y la app avisa; además
  el frontend valida antes para dar feedback inmediato.
Esto es exactamente la decisión de UX que Sergio tomó (opción flexible): dejar sumar de a
poco sin regañar, pero nunca permitir pasarse de 100.

**Decisiones de producto:** solo nombre + porcentaje por componente (sin "nota mínima" por
ahora, para menos fricción). Se accede a la config desde el detalle del semestre.

**Arquitectura:** servicio `components.ts` + hooks en `queries.ts`, y la pantalla cliente
`SubjectComponentsClient` con el cálculo del total y el estado del indicador. Todo es/en.

**Lección de video:** este es el paso previo al "momento mágico". Configurar bien los pesos
es lo que permitirá, en el siguiente episodio, que al meter las notas el promedio salga
solo. La validación del 100% evita el error más común al calcular promedios a mano.

---

## Episodio 12 — El MOMENTO MÁGICO: las notas y el promedio que se calcula solo ⭐🛠️

**Lo que pasó:** este es el corazón del producto. El usuario registra notas dentro de cada
componente, y TODO el cálculo pasa solo:
- Cada componente muestra su calificación = promedio de sus notas (RN-7). Si Talleres tiene
  3.5, 4.0 y 4.5, el componente vale 4.0 automáticamente.
- La materia muestra su nota ponderada por los porcentajes de los componentes.
- El semestre muestra su promedio ponderado por créditos (excluyendo nivelación, RN-6).
Todo se recalcula al instante al agregar o quitar una nota (invalidación de caché en los
hooks de React Query, encadenada: nota → calificación de componente → nota de materia).

**🎬 ESTE es el episodio estrella para TikTok.** El gancho visual: "calcular mi promedio en
Excel me tomaba horas" → se mete una nota y el promedio de materia, semestre y global
cambian solos frente a la cámara. Capturar ESTE clip es prioridad (recordatorio activo).

**Reglas en acción:**
- RN-5: la nota debe estar entre 0.0 y 5.0 (CHECK en la base + validación en la app).
- RN-7: el promedio del componente lo calcula la vista `v_componente_calificacion`.
- RN-6: nivelación (Inglés, etc.) no entra en los promedios de semestre/global.

**Arquitectura:** servicio `grades.ts` (notas + lectura de las 4 vistas de promedio),
hooks con invalidación encadenada en `queries.ts`. La UI: en `/app/subjects/[id]` cada
componente despliega su gestión de notas (ComponentGrades) y arriba se ve la nota de la
materia; en el detalle del semestre se ve el promedio del semestre. Todo es/en.

**Lección de video:** el trabajo que hicimos ANTES (reglas y vistas en la base de datos en
los episodios 6 y 11) es lo que hace que ahora el frontend sea tan simple: solo LEE
resultados ya calculados. La magia no está en la pantalla, está en el diseño de la base de
datos. "Lo difícil se hizo temprano para que lo visible fuera fácil."

---

## Episodio 13 — El panel: todo el progreso de un vistazo 🛠️

**Lo que pasó:** el dashboard dejó de ser un placeholder. Ahora, al entrar a `/app`, el
estudiante ve de un vistazo:
- **Promedio global** y **créditos aprobados** (tarjetas grandes).
- **Avance por tipología de créditos:** una barra de progreso (en blanco/negro) por cada
  tipología (Fundamentación, Disciplinar, Libre Elección, Nivelación), mostrando
  aprobados / requeridos.
- **Materias en curso:** lista de lo que está cursando ahora, con su semestre.

**Arquitectura:** servicio `progress.ts` (avance por tipología calculado desde tipologías +
inscripciones aprobadas; materias en curso), hooks en `queries.ts`, y `DashboardClient`
que arma las tarjetas, las barras y la lista. El promedio global y créditos salen de la
vista `v_promedio_global`. Todo es/en.

**Detalle de diseño:** las barras de progreso son blanco/negro (relleno negro sobre borde
negro), fieles a la UI mínima. Se ven decentes sin esfuerzo de diseño, y un rediseño futuro
solo toca estilos.

**Lección de video:** el dashboard "junta todo" pero no calcula nada nuevo —lee lo que las
vistas de la base de datos ya producen. Es la recompensa visual de todo el trabajo previo:
el estudiante ve su carrera entera en una pantalla.

---

## Episodio 14 — Publicar: documentación, Git y camino a Vercel 🛠️🧭

**Lo que pasó:** se preparó el proyecto para publicarse y se cerró el MVP del backend/flujo.

- **README** completo (stack, arquitectura, rutas, reglas de negocio, puesta en marcha,
  despliegue, seguridad). Sirve también de guion técnico para el video.
- **Git inicializado** en la rama `main` con un commit inicial. Se verificó explícitamente
  que `.env.local` (credenciales) queda IGNORADO y NO se sube: solo viaja `.env.example`
  con placeholders. 🔒 Lección: antes del primer push, confirmar que ningún secreto entra
  al repo.
- **Nombre del repo:** UniGrades (el nombre local de la carpeta "Vstudy" se queda solo en
  la máquina; el proyecto público es UniGrades).

**Decisión de proceso:** Sergio cierra aquí este chat (queda como "backend") y abrirá chats
separados por aspecto (frontend, etc.) para mantener mejor memoria y respuestas enfocadas.
El líder del grupo revisará lo construido antes de definir el frontend.

**Pendiente de config del usuario (con guía):**
1. Crear el repo `UniGrades` en GitHub (vacío) y hacer push del commit inicial.
2. Importar el repo en Vercel.
3. Configurar en Vercel `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Desplegar y obtener el link público.

**Estado del MVP (web, backend + flujo): COMPLETO.** Landing, auth (email), onboarding con
catálogo (malla de Ingeniería de Sistemas) + creación manual, semestres e inscripciones,
componentes con validación 100%, notas con promedios automáticos (materia/semestre/global)
y dashboard de progreso. Todo con i18n es/en, RLS por usuario y reglas de negocio en la
base de datos. Pendiente (futuro, otros chats): rediseño de frontend, app móvil, Google
OAuth, suscripciones, escalar el catálogo compartido.
