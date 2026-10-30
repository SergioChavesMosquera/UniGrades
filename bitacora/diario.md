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


---

## Episodio 15 — Llenar el catálogo: 7 carreras más (Excel → SQL) 🛠️

**Lo que pasó:** Sergio llenó la plantilla Excel con 8 bloques de mallas (375 filas): además
de Sistemas, agregó Ingeniería Química, Enfermería, Geografía, Medicina Veterinaria, Diseño
Gráfico, Ingeniería Industrial e Ingeniería Mecatrónica, más un bloque "TODAS" de
nivelación común. Un trabajo enorme de recopilación.

**Flujo usado (el que diseñamos):** Sergio llena el Excel → se lee automáticamente y se
genera el SQL. No escribió una línea de SQL. Para leer el .xlsx se instaló temporalmente la
librería xlsx de SheetJS, se generó la migración, y se desinstaló (0 vulnerabilidades en
prod). El Excel estaba abierto (bloqueado), así que se leyó desde una copia.

**Decisiones de producto (de la conversación):**
- **Nivelación común ("TODAS"):** se copia a las carreras que no tenían nivelación propia.
  Razón real que dio Sergio: no todos cursan nivelación (quien entra con buen puntaje
  empieza directo), pero pertenece a toda carrera.
- **Libre Elección:** NO se carga para ninguna. Razón: una electiva puede ser casi
  cualquier materia de la universidad (un estudiante de Sistemas puede ver Cirugía como
  libre), así que modelarlas sería inviable por ahora.
- **total_creditos:** la suma de lo cargado (algunas mallas incluyen optativas que no todos
  ven, p. ej. Geografía suma 220). Se ajusta después; no vale la pena estresarse ahora.
- **Tipologías con espacios** ("Fundamentación ") se normalizaron automáticamente.

**🔎 Detalle técnico:** Sistemas ya estaba en `0003_seed.sql` (fuente de verdad), así que
se EXCLUYÓ del nuevo `0004_seed_programas.sql` para no duplicar. El 0004 es idempotente:
cada bloque verifica si el programa ya existe y se salta si sí.

**Resultado:** `0004_seed_programas.sql` con 7 carreras y 362 materias, listo para aplicar
en producción. El catálogo del onboarding pasa de 1 a 8 carreras reales de la UNAL.

**Lección de video:** el flujo "no-técnico llena un Excel → la herramienta genera el SQL"
es justo lo que permite escalar el contenido sin saber programar. Y la higiene: instalar
una dependencia solo para una tarea puntual y quitarla después.


---

## Episodio 16 — Empieza el rediseño del frontend: el sistema de tokens 🧭→🛠️

**Lo que pasó:** arranca un capítulo nuevo y muy esperado. Con el MVP de backend/flujo ya
completo (episodios 1-15), Sergio abrió este chat dedicado al **rediseño de frontend**. La
promesa que se hizo desde el día 1 —"UI mínima deliberada para que el rediseño sea SOLO
frontend, sin tocar backend ni lógica"— por fin se cobra.

**El prompt del usuario:** "Run all tasks for this spec." Es decir, ejecutar de corrido
toda la spec `frontend-redesign`, que ya traía sus tres documentos (`requirements.md`,
`design.md`, `tasks.md`) con 22 tareas (18 hojas ejecutables).

**Modo de trabajo:** 🛠️ Ejecución, orquestada. Kiro actúa como despachador: lee el plan de
tareas, las encola en orden de dependencias, y delega CADA implementación a un subagente
de ejecución. El orquestador no escribe código; solo coordina, verifica estados y reporta.

**La regla de oro del rediseño (transversal, en cada tarea):** NO tocar `services/`,
`lib/supabase/`, `supabase/`, `types/domain.ts`, ni las `queryKey`/firmas de
`services/queries.ts`. Todo cambio es presentacional. Tras cada tarea: `npm run typecheck`,
`npm run lint`, `npm run build`, limpiar temporales, y toda cadena visible nueva va en
`messages/es.json` y `messages/en.json`. Esta disciplina es la que permite rediseñar sin
romper la lógica probada.

**La identidad visual (sale de `.kiro/steering/design-guidelines.md`):** se abandona el
blanco/negro por una paleta de marca real:
- Verde esmeralda `#0B6B4F` (principal), menta `#2ED8A3` (acento/éxito), ámbar `#FFB020`
  (en riesgo), coral `#FF5C5C` (peligro).
- Tema claro (fondo `#F7F8F5`) y oscuro (azul noche `#0F1B2D`) con LAS MISMAS variables.
- Tipografía: Sora (títulos/logo), Inter (texto), JetBrains Mono (cifras, con
  `tabular-nums` para que las notas se lean alineadas).
- Esquinas de 16px, sombra suave, objetivos táctiles de 44px, mobile-first.

**Decisión de arquitectura clave (de la spec):** centralizar TODO el estilo en tokens CSS.
Los componentes nunca usan literales hex/px; leen variables. Así un restyle futuro vuelve a
ser un cambio centralizado. Se conservan los nombres de variables viejos (`--bg`, `--fg`,
`--muted`, `--border`, `--radius`, `--space`, `--max-width`) para no romper consumidores
durante la migración, y se AÑADEN los nuevos de marca. Retrocompatibilidad total.

### Tarea 1 completada — `app/globals.css` reescrito ✅

**Qué se hizo:** se reescribió `app/globals.css` como el sistema de tokens:
- Paleta de marca fija (independiente del tema): `--brand-primary/accent/warning/danger`.
- Alias de tipografía (`--font-title/body/mono`) apuntando a las variables que inyectará
  next/font en la Tarea 2, con fallbacks del sistema para que funcione mientras tanto.
- Tokens de forma/espacio: `--radius: 16px`, `--radius-sm: 10px`, escala `--space-*`,
  `--max-width: 960px`, `--shadow-soft`, `--tap-min: 44px`.
- Temas con las MISMAS variables: `:root, [data-theme="light"]` (claro) y
  `[data-theme="dark"]` (oscuro, surface `#16243A`, muted `#9AA7B2`, border `#2A3A52`).
- Fallback `@media (prefers-color-scheme: dark)` acotado a `:root:not([data-theme])`: si el
  usuario no ha elegido tema, se sigue al sistema operativo.
- Base mobile-first (360px, `overflow-x: hidden`, `100dvh`), `:focus-visible` global para
  accesibilidad de teclado, y la clase utilitaria `.num` (fuente mono + `tabular-nums`)
  para notas/promedios/porcentajes.

**Requisitos cubiertos:** 1.1, 1.2, 1.3, 1.4, 2.2, 7.1, 7.4.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` todos en verde. No se
introdujeron cadenas visibles nuevas, así que no se tocaron los JSON de i18n. `git status`
confirmó que SOLO se modificó `app/globals.css`: ningún archivo prohibido
(`services/`, `lib/supabase/`, `supabase/`, `types/domain.ts`, `queries.ts`) fue tocado.
La regla de oro se respetó desde la primera tarea.

**Lección de video:** aquí se ve, en la práctica, por qué valió la pena la "UI fea a
propósito" de los primeros episodios. Cambiar toda la identidad visual de la app empieza
por UN archivo de variables. El trabajo aburrido de separar estilo de lógica meses atrás
es lo que hoy convierte un rediseño en algo quirúrgico en vez de una reescritura.

### Tarea 2 completada — Tipografía con next/font ✅

**Qué se hizo:** en `app/layout.tsx` se cargaron las tres familias con `next/font/google`:
Sora (700, para títulos/logo), Inter (400/500, para texto) y JetBrains Mono (600, para
cifras), todas con `subsets:["latin"]` y `display:"swap"`. Se mapean a las variables
`--font-sora/inter/jetbrains` y se aplican las clases de variable en `<html>` junto al
`lang={locale}` que ya se resolvía en servidor. Se conservó intacta la estructura existente
(`NextIntlClientProvider` + `Providers`).

**Detalle fino:** no hizo falta tocar el `body`. La Tarea 1 ya había dejado en `globals.css`
el alias `--font-title/body/mono → --font-sora/inter/jetbrains` y el `body` leyendo
`var(--font-body)`. Las dos tareas encajan como piezas: una define los nombres semánticos,
la otra inyecta las fuentes reales. `display:"swap"` evita el flash de texto invisible
(FOUC) y el layout shift perceptible.

**Requisitos cubiertos:** 2.1, 2.3, 2.4.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde. Sin
temporales. Sin tocar archivos de la capa de datos.

**Lección de video:** `next/font` descarga y auto-hospeda las fuentes de Google en build,
así que no hay petición a servidores de Google en runtime (mejor privacidad y velocidad) y
las cifras tabulares (JetBrains Mono) hacen que las notas y promedios se lean alineados en
columna, un detalle pequeño que se nota muchísimo en una app de notas.

### Tarea 3.1 completada — Capa de tema en `lib/theme/` ✅

**Qué se hizo:** se creó la infraestructura de tema claro/oscuro copiando EXACTAMENTE el
patrón ya probado del idioma (`lib/i18n/*`). Tres archivos:
- `lib/theme/config.ts`: `themes = ["light","dark"]`, tipo `Theme`, y la cookie
  `THEME_COOKIE = "unigrades_theme"`.
- `lib/theme/request.ts`: helper de servidor `getTheme(): Promise<Theme | null>` que lee la
  cookie con `cookies()` de `next/headers`. Devuelve el tema si es válido, o `null` si no
  hay elección — y ese `null` significa "sigue el `prefers-color-scheme` del sistema".
- `lib/theme/actions.ts`: server action `setTheme(theme)` que valida contra `themes`,
  escribe la cookie de un año (`maxAge 60*60*24*365`, `path "/"`, `sameSite "lax"`) y llama
  `revalidatePath("/", "layout")` para refrescar la UI.

**Decisión de diseño (reutilizar, no inventar):** en vez de meter una librería de temas
(next-themes) o lógica nueva, se clonó el mecanismo del idioma que ya funciona en el repo.
Mismo tipo de cookie, misma duración, misma forma de server action. Esto reduce la
superficie nueva, es coherente con lo existente y —clave— permite resolver el tema EN EL
SERVIDOR para evitar el flash de tema incorrecto (FOUC) al cargar.

**Requisitos cubiertos:** 6.1, 6.3.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde. Sin
temporales. Capa de datos intacta.

**Lección de video:** cuando ya tienes un patrón que funciona en tu proyecto (aquí, el
idioma por cookie + server action), lo más inteligente es copiarlo para el siguiente
problema parecido (el tema). Menos dependencias, menos sorpresas, código que tu equipo ya
sabe leer.

### Tarea 3.2 completada — Resolución de tema en servidor (anti-FOUC) + toggle ✅  (cierra Episodio: Tarea 3 completa)

**Qué se hizo:**
- `app/layout.tsx`: se resuelve el tema EN EL SERVIDOR con `const theme = await getTheme();`
  y se fija `data-theme={theme ?? undefined}` en `<html>`. Si la cookie no existe (`null`),
  el atributo se OMITE y el CSS cae en `prefers-color-scheme` (R6.5). Al resolverse en el
  servidor antes del primer render, no hay flash de tema incorrecto (FOUC, R6.4). El resto
  del layout (fuentes, locale, providers) quedó intacto.
- `components/theme/ThemeToggle.tsx` (nuevo): componente cliente calcado de
  `LanguageSwitcher` — `useTransition` + el server action `setTheme`. Como no existe un hook
  `useTheme` equivalente a `useLocale`, el estado inicial del control sale de una prop
  opcional `current?: Theme`, con respaldo de leer `document.documentElement.dataset.theme`
  en un `useEffect` (para el caso sin cookie). Muestra icono Lucide (Sun/Moon) MÁS texto,
  nunca solo color (R7.5). Estilado 100% con tokens (`--surface`, `--border`, `--fg`,
  `--radius-sm`, `--tap-min`), sin hex hardcodeado. Con `aria-label`/`title`; iconos
  `aria-hidden`.
- i18n: se agregaron las claves `theme`, `lightMode`, `darkMode` bajo `common` en
  `messages/es.json` (Tema/Claro/Oscuro) y `messages/en.json` (Theme/Light/Dark).

**Dependencia nueva:** `lucide-react` no estaba instalado, así que se instaló PINEADO EXACTO
(sin caret): quedó `"lucide-react": "1.65.0"` en `package.json`. La Tarea 4 formaliza la
iconografía, pero el toggle ya lo necesitaba. Pinear exacto evita que una actualización
silenciosa cambie iconos o rompa el build.

**🔒🔥 Nota de seguridad a revisar:** al correr `npm install` para `lucide-react`, el audit
reportó "1 critical severity vulnerability" en el árbol de dependencias. El subagente —con
buen criterio— NO corrió `npm audit fix` para no meter cambios de dependencias no pedidos
que podrían romper el build (ya pasó antes con el plugin de ESLint y Next 16, ver Episodio
8). Queda PENDIENTE DE REVISIÓN del usuario: ejecutar `npm audit` para ver de qué paquete
viene esa alerta crítica y decidir si es de producción o solo de desarrollo, igual que se
hizo con las 4 alertas de `next-intl`. No bloquea el build actual (typecheck/lint/build en
verde).

**Requisitos cubiertos:** 6.2, 6.4, 6.5, 6.6, 6.7 (y con esto queda COMPLETA la Tarea 3
padre: tema claro/oscuro con el patrón idéntico al idioma).

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde. Sin
temporales. Capa de datos intacta.

**Lección de video:** el truco del "anti-FOUC" (que la página no parpadee del tema claro al
oscuro al cargar) es resolver el tema en el servidor leyendo la cookie, igual que el idioma.
Mucha gente lo resuelve con un script que corre en el navegador y termina viendo el
parpadeo; hacerlo en el servidor lo elimina de raíz.

**Pendiente de config del usuario:** revisar `npm audit` (la alerta crítica reportada) y
decidir acción, como se hizo con las alertas de desarrollo anteriores.

### Tarea 4 completada — Iconografía Lucide ✅ (verificación)

**Qué se hizo:** esta tarea fue principalmente de VERIFICACIÓN, porque `lucide-react` ya se
había instalado y pineado en la Tarea 3.2 (lo necesitaba el toggle de tema). Se confirmó:
- **Pin exacto (R4.2):** `package.json` tiene `"lucide-react": "1.65.0"` sin `^` ni `~`.
- **🔎 Versión real (no typosquat):** el subagente dudó de si "1.65.0" era una versión
  válida (esperaba el esquema `0.x` típico de lucide). Investigó con `npm view` y confirmó
  que 1.65.0 SÍ existe, es la última estable, y el paquete es el oficial (homepage
  lucide.dev, repo github.com/lucide-icons/lucide, licencia ISC). Falsa alarma, no hubo que
  corregir nada. Buena práctica: ante la duda de una dependencia, verificar origen y versión
  antes de confiar.
- **Convención currentColor + imports nombrados (R4.1, R4.3):** se verificó en el código del
  paquete que los iconos usan `stroke="currentColor"` por defecto, así que heredan el color
  del texto y funcionan en claro/oscuro sin tocar nada. El único consumidor
  (`ThemeToggle.tsx`) importa iconos individualmente (`{ Moon, Sun }`), lo que permite
  tree-shaking (solo entra al bundle lo que se usa).

**Requisitos cubiertos:** 4.1, 4.2, 4.3.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde (8 rutas
generadas). Sin cambios de código, sin temporales, capa de datos intacta.

**Lección de video:** verificar una dependencia antes de confiar en ella —que exista, que
sea la oficial y no un typosquat, y pinearla a versión exacta— es higiene de seguridad
básica que evita sustos. Y los iconos que heredan `currentColor` son el truco para que un
mismo icono se vea bien en tema claro y oscuro sin duplicar código.

### Tarea 5.1 completada — Rediseño de primitivos existentes (retrocompatible) ✅

**Qué se hizo:** se rediseñaron los tres primitivos base de `components/ui`, manteniendo
sus firmas de props intactas para no romper ninguna pantalla que ya los usa:
- **Button:** `primary` ahora usa `var(--primary)` / `var(--primary-fg)`; `secondary` usa
  `var(--surface)` / `var(--fg)` / borde `var(--border)`. Se añadió `isLoading?` que muestra
  un spinner (icono Lucide `Loader2`, `aria-hidden`, sin texto) y deshabilita el botón
  (también respeta el `disabled` nativo), con `aria-busy`. Altura mínima `var(--tap-min)`
  (44px, objetivo táctil R7.2). Adiós a los `#000/#fff` hardcodeados.
- **Input:** conserva `label`/`id` (label asociado por `htmlFor`, R7.3). Se añadió
  `error?: string`: cuando hay error, pone `aria-invalid`, pinta el borde con
  `var(--brand-danger)` y renderiza el texto de error en un `<span id="{id}-error">` enlazado
  por `aria-describedby` (fusionado con cualquier `aria-describedby` que pase el consumidor).
  Todo con tokens.
- **Container:** mismo contrato (`children`); se reemplazó el `32px` hardcodeado por
  `var(--space-xl)`.
- **globals.css:** se añadió el `@keyframes ug-spin` que usa el spinner del botón, y un
  bloque `prefers-reduced-motion: reduce` que neutraliza animaciones (adelanta R11.4).

**Decisión clave (aditividad):** las props nuevas (`isLoading`, `error`) son OPCIONALES y
los consumidores actuales solo usan `variant`/`disabled`/`label`/`id`. Así el rediseño es
puramente aditivo: nada que ya existía se rompe. Esta es la razón por la que la spec insiste
en "conservar la firma".

**🔎 Detalle a vigilar (no es un problema aún):** `git status` marca `types/domain.ts` como
modificado ("M"), pero `git diff` no reporta cambios de contenido — parece un artefacto de
fin de línea (CRLF/LF) o de stat, no un cambio real. Se verificará en la tarea final de no
regresión (Tarea 11) que `types/domain.ts` no tenga cambios reales, porque es uno de los
archivos PROHIBIDOS de tocar.

**Requisitos cubiertos:** 3.1, 3.2, 3.7, 7.2, 7.3.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde (9 rutas).
Sin temporales. `services/`, `lib/supabase/`, `supabase/` intactos; `queryKey`/firmas sin
cambios.

**Lección de video:** rediseñar sin romper nada se logra haciendo los cambios ADITIVOS
(props opcionales nuevas) y respetando los contratos existentes. El botón se ve
completamente distinto, pero cualquier `<Button variant="primary">` que ya existía sigue
funcionando igual.

### Tarea 5.2 completada — Nuevos primitivos presentacionales ✅

**Qué se hizo:** se crearon cuatro componentes nuevos en `components/ui`, todos "tontos"
(solo props, sin servicios ni lógica de negocio), estilados únicamente con tokens:
- **Card:** contenedor base polimórfico (prop `as`, por defecto `div`), con `className?` y
  `style?` fusionable. Esquinas `--radius` (16px), fondo `--surface`, sombra `--shadow-soft`,
  padding `--space-lg`.
- **StatCard:** métrica grande construida sobre Card. Props `label`, `value` (ReactNode, así
  acepta un AnimatedNumber luego), `hint?`. El valor usa la clase `.num` (mono tabular).
- **StatusBadge:** props `status: good|risk|behind` → menta/ámbar/coral
  (`--brand-accent`/`--brand-warning`/`--brand-danger`). SIEMPRE muestra icono Lucide
  (CheckCircle2 / AlertTriangle / TrendingDown, `aria-hidden`) MÁS el texto traducido que le
  pasa la pantalla. El color nunca es el único medio de transmitir el estado (R7.5), y el
  texto no se hardcodea: llega por prop `label`.
- **ProgressRing:** anillo de progreso SVG. Props `value` (recortado 0–100), `size?` (64 por
  defecto), `label?`. El trazo usa `currentColor` para adaptarse al tema; expone `role="img"`
  y `aria-label` (el label o `"{value}%"`).

Los cuatro se exportan desde `components/ui/index.ts` junto a Button/Input/Container.

**Decisión de accesibilidad:** el StatusBadge es el ejemplo vivo de R7.5 — "nunca solo
color". Un daltónico no distinguiría menta de ámbar de coral, así que cada estado lleva un
icono distinto y una etiqueta de texto. El color es refuerzo, no el mensaje.

**Requisitos cubiertos:** 3.3, 3.4, 3.5, 3.6, 7.5.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde. Sin
temporales. Sin claves i18n nuevas (todo el texto visible entra por props). Capa de datos
intacta.

**Lección de video:** armar una "caja de LEGO" de componentes presentacionales (Card,
StatCard, Badge, Ring) ANTES de rediseñar las pantallas hace que luego cada pantalla sea
solo componer piezas, no reinventar estilos. Y el ProgressRing en SVG puro, sin librería de
charts, mantiene el bundle liviano.

### Tarea 5.3 completada — AnimatedNumber ✅ (cierra Tarea 5: primitivos de UI)

**Qué se hizo:** se creó `components/ui/AnimatedNumber.tsx`, componente cliente sin
dependencias externas que anima la transición de un número con `requestAnimationFrame`:
- Props: `value`, `decimals?` (por defecto 1, porque las notas usan 1 decimal),
  `duration?` (500ms), `className?`.
- Hace tween de valor anterior → nuevo con easing suave (easeOutCubic), formateando cada
  frame con `toFixed(decimals)`.
- En el PRIMER montaje fija el valor (no anima al cargar la página); solo anima en cambios
  posteriores del valor (R11.1), usando un `previousRef`.
- Respeta `prefers-reduced-motion: reduce` vía `window.matchMedia`: si está activo, salta al
  valor final sin animar (R11.4). Igual salta si `duration <= 0` o no hay rAF/window.
- SSR-safe: nada de `window` durante el render, solo dentro del `useEffect`. Limpia el frame
  con `cancelAnimationFrame` al desmontar o cambiar el valor.
- Renderiza `<span className="num ...">` para heredar la cifra mono tabular.

Exportado desde `components/ui/index.ts`. Con esto queda COMPLETA la Tarea 5 padre: la caja
de primitivos de UI (Button, Input, Container rediseñados + Card, StatCard, StatusBadge,
ProgressRing, AnimatedNumber nuevos).

**Decisión de UX:** que no anime en el primer montaje es importante — si no, cada vez que
entras a una pantalla verías todos los números "contando" desde cero, lo cual marea. Anima
solo cuando el número REALMENTE cambia (p. ej. agregas una nota y el promedio sube), que es
justo el "momento mágico" que queremos resaltar.

**Requisitos cubiertos:** 3.6, 11.1, 11.4.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde. Sin
temporales, sin cadenas visibles nuevas, capa de datos intacta.

**Lección de video:** animar un número "a mano" con `requestAnimationFrame` (en vez de meter
una librería de animación) es poco código, cero peso extra en el bundle, y respeta la
preferencia de accesibilidad de "menos movimiento". Pequeño detalle, gran percepción de
calidad.

### Tarea 6 completada — Componente Logo ✅

**Qué se hizo:** se creó `components/Logo.tsx`, componente presentacional con las 3 variantes
que el equipo de diseño pidió soportar:
- `symbol`: marca compacta (la primera letra "u"), cuadrada al alto dado, en color de marca.
- `horizontal`: el wordmark completo "unigrades" al alto dado, en color de marca.
- `mono`: el wordmark en `currentColor` (versión monocromo que se adapta al contexto).
Props: `variant` y `height?` (con mínimo forzado de 24px vía `Math.max`, R9.2). Hay "zona de
respeto" (padding ~25% del alto, con `box-sizing: content-box`) para que el logo respire.
Accesible con `role="img"` + `aria-label`.

**Decisión clave (placeholder sin romper layout):** como los assets finales de marca aún no
existen, el componente renderiza un placeholder consistente: el wordmark "unigrades" en la
fuente Sora (`var(--font-title)`). Cuando lleguen los SVG/PNG definitivos, basta reemplazar
el interior del componente MANTENIENDO la misma firma de props, y todas las pantallas que ya
lo usan se actualizan solas. El nombre de marca "unigrades" es un literal a propósito: los
nombres de marca NO se traducen (no pasa por i18n).

**Requisitos cubiertos:** 9.1, 9.2, 9.3.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde. Sin
temporales. Capa de datos intacta.

**Pendiente de config del usuario:** cuando el diseñador entregue los assets reales del logo
(símbolo, horizontal, monocromo), reemplazar el placeholder dentro de `Logo.tsx` sin tocar
su firma.

**Lección de video:** diseñar el "hueco" del logo ANTES de tener el logo final es una
jugada de producto inteligente: el frontend ya está listo para recibir la marca, y el día
que llegue el diseño es un cambio de un solo archivo, no una cacería de dónde va el logo en
cada pantalla.

### Tarea 7.1 completada — Lógica pura del forecast (`lib/grade-forecast.ts`) ⭐

**Qué se hizo:** se implementó la lógica de la "tarjeta estrella": ¿qué nota necesitas en lo
que falta de la materia para aprobar? Es una función PURA, tipada y total (nunca lanza):
`forecastRequiredGrade`, con el tipo `Forecast` de 5 casos:
- `insufficient`: no hay componentes aún (faltan datos).
- `incomplete_setup`: los componentes no suman 100% (se devuelve la suma; NO se calcula
  sobre un total parcial porque daría un número engañoso).
- `secured`: ya aprobada con lo registrado (required ≤ 0, o todo calificado y aporte ≥
  nota mínima).
- `impossible`: ya no alcanza (required > escala máx 5.0, o todo calificado por debajo del
  mínimo).
- `needed`: la nota promedio que necesitas en el peso restante, redondeada a 1 decimal.

El orden de la lógica IMPORTA (y así está documentado): sin componentes → suma ≠ 100 → peso
restante 0 → cálculo final. La fórmula clave:
`required = (notaMinima - aportado) / (pesoRestante/100)`.

**Decisiones de diseño clave:**
- **Función pura FUERA de `services/` (R8.5):** no importa NADA (ni Supabase, ni red). Recibe
  los datos que las pantallas ya cargan vía hooks (componentes con %, `ComponenteCalificacion`
  con la calificación por componente, y `nota_minima_aprobacion`). Esto respeta la separación
  backend/frontend: el cálculo del pronóstico es presentacional/derivado, NO una regla de
  negocio que deba vivir en la base de datos.
- **Sin vista/función nueva en la DB:** se confirmó que `porcentaje`, `calificacion` por
  componente y `nota_minima_aprobacion` ya llegan al frontend, así que no se justifica tocar
  Postgres (R8.1).
- **Total, nunca lanza (R8.6):** un componente sin calificación o sin match cuenta como peso
  restante; nada revienta ante datos incompletos.
- **Decisión de producto (ampliación de R8):** si la suma de % no es 100, se muestra
  `incomplete_setup` en vez de un número. Mientras el estudiante arma la materia, la config
  puede estar incompleta; el forecast solo es confiable con el 100% definido.

**Requisitos cubiertos:** 8.1, 8.2, 8.3, 8.4, 8.5, 8.6.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde. El test
unitario NO se escribió aquí a propósito — es la Tarea 7.2. Capa de datos intacta.

**Lección de video:** esta es la ÚNICA lógica nueva de todo el rediseño, y fíjate dónde
vive: en una función pura, sin tocar la base de datos. La regla es clara —lo que es regla de
negocio va a Postgres; lo que es una ayuda visual derivada (como "qué nota te falta") puede
vivir en el cliente. Saber dónde poner cada cosa es diseño de software, no solo escribir
código.

### Tarea 7.2 completada — Test unitario del forecast + Vitest ✅ (cierra Tarea 7)

**Qué se hizo:** se montó un runner de tests (no había ninguno) y se escribió el test de la
lógica del forecast:
- **Vitest instalado** como dev-dependency PINEADO EXACTO (`vitest@3.2.7`), con script
  `"test": "vitest run"`. Sin `vitest.config.ts` (el test importa por ruta relativa
  `./grade-forecast`, así que no hace falta configurar el alias `@/`).
- **`lib/grade-forecast.test.ts`** con 9 casos que cubren TODAS las ramas del tipo
  `Forecast`: `insufficient`, `incomplete_setup` (suma 80 y suma 120), `secured` (todo
  calificado ≥ mínimo, y required ≤ 0 con peso restante), `needed` (valor exacto 2.0 y
  redondeo a 1 decimal: 1.1/0.3 = 3.666… → 3.7), `impossible` (required 6.5 > 5, y sin peso
  restante por debajo del mínimo). Los valores aritméticos se calcularon a mano contra la
  fórmula.

**🔥 Obstáculo real (dependencias): conflicto de versiones.** Al intentar instalar
`vitest@latest` (5.0.5), npm dio ERESOLVE: vitest 5 trae vite 8, que exige
`@types/node >= 22.12.0`, pero el proyecto pinea `22.10.7`. En vez de forzar con
`--legacy-peer-deps` o subir `@types/node` (que podría tocar otras cosas), el subagente
—con buen criterio— eligió `vitest@3.2.7`, una versión real y mantenida que acepta
`@types/node >= 22.0.0` e instala limpio. Lección: cuando una dependencia nueva choca con
el árbol existente, bajar a una versión compatible suele ser más seguro que forzar la
instalación o mover versiones de otras dependencias.

**Requisitos cubiertos:** 8.2, 8.3, 8.4, 8.6, 10.1. Con esto queda COMPLETA la Tarea 7 padre
(tarjeta estrella: lógica pura + test).

**Verificación:** `npm test` → 9/9 pasan. `npm run typecheck`, `npm run lint`,
`npm run build` en verde. Sin temporales. Solo se tocaron `package.json`,
`package-lock.json` y el nuevo test. Capa de datos intacta.

**Lección de video:** la única lógica nueva del rediseño es también la única que lleva tests
—y con razón: es la que hace cálculos con dinero (bueno, con notas). Los componentes
visuales se revisan a ojo; la aritmética se blinda con pruebas. Testear lo que calcula, no
lo que decora.

### Tarea 8 completada — Microinteracciones de celebración (confeti + sonido) ✅

**Qué se hizo:** se añadió la "celebración" para cuando apruebas una materia:
- **Dependencias pineadas exactas:** `canvas-confetti@1.9.3` (prod) y
  `@types/canvas-confetti@1.9.0` (dev, para tipos sin `any`). Ambas verificadas como reales
  y mantenidas. Nada de CDNs ni red externa.
- **`lib/celebrate.ts`** exporta `celebrate({ sound? })`:
  - SSR-safe (no hace nada si no hay `window`).
  - Confeti breve y discreto con `canvas-confetti`; se DESACTIVA por completo con
    `prefers-reduced-motion: reduce` (R11.4).
  - Sonido desde asset LOCAL `/sounds/approve.mp3` (sin red, R11.6). SILENCIADO por defecto:
    solo suena si se pide `sound: true` Y hubo un gesto de usuario previo (los navegadores
    bloquean autoplay de audio hasta la primera interacción) Y no hay movimiento reducido
    (R11.3). Una bandera a nivel de módulo registra el primer pointerdown/keydown/touchstart.
  - NUNCA bloquea la UI ni propaga errores: el rechazo de `audio.play()` se traga en un
    `.catch`, y todo va envuelto en try/catch (R11.5).

**Decisión de diseño:** el confeti usa el flag nativo `disableForReducedMotion: true` del
propio canvas-confetti ADEMÁS de nuestra propia comprobación de `prefers-reduced-motion`,
doble candado para accesibilidad. Y el sonido silenciado por defecto evita el peor pecado
de UX web: que una página haga ruido sin que lo pidas.

**Asset:** se creó `public/sounds/` con `.gitkeep` (para que git trackee la carpeta) y un
`README.md` explicando la acción pendiente. NO se fabricó un mp3 falso/corrupto (rompería la
reproducción); el código ya falla en silencio si el archivo no existe.

**Requisitos cubiertos:** 11.2, 11.3, 11.4, 11.5, 11.6.

**Nota:** `celebrate()` todavía NO está enganchado a ninguna pantalla; eso es la Tarea 10.3
(engancharlo a la transición real a `aprobada` en el detalle de materia).

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde;
`npm test` → 9/9 forecast siguen pasando (sin regresión). Sin temporales. Capa de datos
intacta.

**🔧 PENDIENTE DE CONFIG DEL USUARIO:** colocar un archivo real `public/sounds/approve.mp3`
(un efecto corto tipo "chime/success" de ~0.5–1.5s, con licencia que permita su uso).
Mientras no exista, la app funciona normal: el confeti se dispara y el sonido falla en
silencio. Detalles en `public/sounds/README.md`.

**Lección de video:** los detalles de deleite (confeti al aprobar) son baratos de agregar y
suben mucho la percepción de calidad —PERO hay que hacerlos con respeto: silenciar el audio
por defecto, honrar "menos movimiento", y que jamás un fallo de una animación tumbe la app.
Deleite sí, pero con accesibilidad y robustez.

### Tarea 9 completada — Navegación móvil de /app ✅

**Qué se hizo:** se creó `components/nav/AppNav.tsx`, la barra de navegación del área
autenticada:
- Client component (necesita `usePathname` para detectar la sección activa).
- Logo horizontal como enlace a `/app`, y enlaces `next/link` a `/app` (dashboard),
  `/app/semesters`, `/app/settings`, cada uno con icono Lucide + texto
  (LayoutDashboard, CalendarDays, Settings).
- **Sección activa marcada por MÁS que color (R12.3):** negrita, subrayado,
  `aria-current="page"` y un indicador textual "•". `/app` solo se marca en coincidencia
  exacta (para no quedar activo en todas sus subrutas); los demás con exacto-o-subruta.
- Aloja `LanguageSwitcher`, `ThemeToggle` y `LogoutButton` SIN cambiar su lógica (R12.4,
  R12.6).
- Mobile-first (R12.5): flex con `flex-wrap` para que no haya scroll horizontal a 360px;
  objetivos táctiles con `min-height: var(--tap-min)` (44px); solo tokens de diseño. Se
  apila en móvil y se expande en fila en pantallas anchas.
- Montado en `app/app/layout.tsx` por encima de `{children}`, conservando intacto el gate de
  sesión server (redirect a /login si no hay usuario).
- i18n: namespace nuevo `nav` (dashboard/semesters/settings/primary) en es.json y en.json.

**Nota:** `/app/settings` todavía no existe como ruta (se construye en la Tarea 10.4); el
enlace ya apunta ahí con `next/link`, lo cual es correcto y esperado.

**Requisitos cubiertos:** 12.1, 12.2, 12.3, 12.4, 12.5, 12.6.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde; `npm test`
→ 9/9. Sin temporales. Capa de datos intacta; lógica de los controles alojados sin cambios.

**Lección de video:** marcar la sección activa SOLO con color es una trampa de accesibilidad
clásica (un daltónico no la ve). Aquí la activa se nota por negrita + subrayado + un punto +
`aria-current`, así cualquiera —y cualquier lector de pantalla— sabe dónde está parado.

### Tarea 10.1 completada — Rediseño de landing + auth ✅

**Qué se hizo:** se aplicó la nueva identidad a las pantallas públicas, SIN cambiar ningún
comportamiento de datos (mismos hooks, mismos server actions `signInWithEmail`/
`signUpWithEmail`, mismas rutas, misma lógica de estado):
- **`app/page.tsx` (landing):** hero con `Logo horizontal`, título en Sora con la tagline, y
  los dos CTA (primario → /signup, secundario → /login). FOOTER nuevo con el aviso de NO
  afiliación a la UNAL (R9.4) + línea de copyright con el año. El LanguageSwitcher sigue
  arriba. Textos del footer vía i18n.
- **`app/login/LoginForm.tsx` y `app/signup/SignupForm.tsx`:** formularios dentro de `Card`,
  el error ahora fluye por la prop `error` del `Input` (se eliminó el `<p style color #000>`
  hardcodeado), botón primario con `isLoading`. En signup se conservó el mensaje `info`
  (confirmación de correo) con `role="status"` y color de token. Lógica de submit intacta.
- **`app/login/page.tsx` y `app/signup/page.tsx`:** restyle con Logo, títulos Sora, colores
  de token; se conservaron los enlaces e i18n existentes.
- i18n: únicas cadenas nuevas → `landing.footerDisclaimer` y `landing.footerRights` en es.json
  y en.json. Ningún hex hardcodeado quedó en los archivos tocados.

**Decisión de accesibilidad/UX:** el error de login/signup ahora usa el estado de error del
`Input` (borde coral + `aria-invalid` + texto enlazado por `aria-describedby`), en vez del
antiguo párrafo negro. Más claro visualmente y mejor para lectores de pantalla.

**Requisitos cubiertos:** 5.1, 5.4, 9.4, 10.3, 10.4.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde;
`npm test` → 9/9. Sin temporales. `services/`, `lib/supabase/`, `supabase/`,
`types/domain.ts`, `queries.ts` intactos.

**Lección de video:** el aviso de "no afiliado a la UNAL" en el footer no es solo estético
—es legal/producto. UniGrades es una herramienta personal e independiente, y dejarlo claro
desde la landing evita malentendidos con la universidad. Pequeño texto, decisión importante.

### Tarea 10.2 completada — Rediseño del dashboard ✅

**Qué se hizo:** se rediseñó `app/app/DashboardClient.tsx` con los primitivos nuevos, SIN
tocar los hooks ni sus queryKeys (`useGlobalAverage`, `useProgressByTypology`,
`useCurrentSubjects` siguen idénticos):
- Promedio global y créditos aprobados → `StatCard` (que ya aplica `.num` a la cifra).
  Mismos fallbacks: promedio null → `t("notYet")`, créditos null → `0`.
- Avance por tipología → cada tipología en una `Card` con un `ProgressRing` (coloreado con
  `var(--brand-primary)` vía `currentColor`). Se eliminó la barra con `background:"#000"`.
- Materias en curso → cada una en una `Card` con un `StatusBadge status="good"` cuyo label
  reutiliza la clave i18n existente `semesters.estado.en_curso` (sin hardcodear, sin claves
  nuevas). Créditos envueltos en `.num`.
- Todo hex/estilo ad-hoc reemplazado por tokens/primitivos.

**Decisión (reutilizar i18n):** para el badge "En curso" se reutilizó la clave de estado que
YA existía en el namespace `semesters.estado`, en vez de inventar una nueva. Menos
duplicación de traducciones y coherencia con el resto de la app.

**🔎 Detalle a limpiar en la Tarea 11 (no es error):** `app/app/page.tsx` todavía tiene en
su cabecera un `LanguageSwitcher` y un `LogoutButton` que AHORA duplican lo que ya ofrece la
nueva `AppNav` (Tarea 9). Esta tarea estaba acotada a `DashboardClient`, así que no se tocó
el wrapper. Pendiente de revisar en la verificación final: quitar los controles duplicados
del header del dashboard (y posiblemente de otras páginas que los tenían) para que la AppNav
sea la única fuente.

**Requisitos cubiertos:** 5.1, 5.2, 5.5, 10.3.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde;
`npm test` → 9/9. Sin temporales. Capa de datos intacta.

**Lección de video:** el dashboard es donde se nota el salto visual —de barras blanco/negro a
anillos de progreso con color de marca y tarjetas con sombra—, pero por dentro lee EXACTAMENTE
los mismos datos de antes. El rediseño es piel, no esqueleto.

### Tarea 10.3 completada — Detalle de materia + tarjeta estrella + celebración ⭐🎉

**Qué se hizo:** la pantalla más rica del rediseño. Tres bloques:
- **Tarjeta estrella (forecast):** se extendió el query server de
  `app/app/subjects/[id]/page.tsx` de `materia(nombre)` a
  `materia(nombre, nota_minima_aprobacion)` (código de ruta, NO services/ → permitido) y se
  pasa `notaMinima` como prop. En `SubjectComponentsClient` se llama la función pura
  `forecastRequiredGrade` con los datos que YA cargan los hooks (componentes + calificaciones
  + notaMinima) y se muestra una `Card` destacada con mensaje según `kind`: `secured`,
  `needed` (con `AnimatedNumber` para la nota requerida vía `t.rich`), `impossible`,
  `incomplete_setup` (con el `{sum}`), `insufficient`. Claves i18n nuevas bajo
  `subjects.forecast` en es.json y en.json.
- **Nota de la materia con `AnimatedNumber`:** el "momento mágico" ahora anima la transición
  del número cuando cambia (decimals=1), dentro de una `Card` destacada; null → `t("notYet")`.
- **Componentes y notas como `Card`:** se migraron los `<li>`/divs con borde a `Card`; cifras
  con `.num`; errores con `var(--brand-danger)` en vez de `#000`; el indicador de "completo"
  usa `var(--brand-primary)`. Se conservó INTACTA la validación RN-2 de UX (indicador en vivo
  de la suma + guardia de >100 en `handleAdd`) y TODOS los hooks/queryKeys.

**Decisión importante (dónde enganchar `celebrate()`):** el detalle de materia NO tiene
control para cambiar el estado de inscripción; ese cambio se hace en el detalle de SEMESTRE
(`SemesterDetailClient`) vía `useUpdateEnrollmentState`. Así que la celebración se enganchó
AHÍ: `handleStateChange` ahora recibe el estado previo (`en.estado`) y, tras el
`mutateAsync` exitoso, llama `celebrate()` SOLO si `nuevo === "aprobada" && previo !==
"aprobada"`. Esto garantiza que el confeti salga en la transición REAL a aprobada y nunca al
simplemente ver una materia ya aprobada. Es un efecto de presentación en la capa de
componentes, sin tocar la lógica de la mutación ni services/.

**Requisitos cubiertos:** 5.1, 5.3, 5.5, 5.6, 8.1, 11.2, 11.5, 10.3.

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde;
`npm test` → 9/9. Sin temporales. Capa de datos intacta.

**🔎 Dato técnico interesante:** se usó `t.rich` de next-intl para inyectar un
`<AnimatedNumber>` DENTRO de una cadena traducida (la nota requerida), con un tag
`<required>`. Así el número animado vive embebido en la frase "Necesitas X en promedio…" y
la traducción sigue controlando el orden de las palabras en es/en.

**Lección de video:** la tarjeta estrella ("¿qué nota necesitas?") es la función que puede
enamorar al usuario —responde la pregunta que todo estudiante se hace antes de un final. Y
fíjate que el confeti se enganchó con cuidado quirúrgico: solo en la transición real a
aprobada, comparando el estado previo. Un detalle de deleite mal hecho (que celebre cada vez
que abres la página) arruinaría el efecto; hacerlo bien es lo que se siente "mágico".

### Tarea 10.4 completada — Semestres, detalle, onboarding y settings ✅ (cierra Tarea 10)

**Qué se hizo:** rediseño del resto de pantallas de `/app` + creación de la pantalla de
Ajustes, sin cambiar lógica de datos:
- **SemestersClient:** lista de semestres de `<li>` con borde a `Card as="li"`; formulario de
  creación y hooks intactos; error a `var(--brand-danger)`.
- **SemesterDetailClient:** promedio del semestre en `Card` con `.num`; inscripciones como
  `Card`; los `<select>` pasaron de `background:#fff` a tokens (`--surface`/`--fg`); se añadió
  un `StatusBadge` por inscripción. Mapeo elegido: `en_curso`/`aprobada` → good (menta),
  `reprobada` → behind (coral), `retirada` → risk (ámbar). **El enganche de `celebrate()` de
  la Tarea 10.3 se conservó íntegro** (solo dispara en transición real a aprobada).
- **OnboardingClient:** CatalogMode y OwnMode restyleados con Card/Input/Button y tokens.
  Dato fino: los formularios se mantuvieron como `<form>` reales DENTRO de `Card` (Card no
  reenvía `onSubmit`).
- **Settings (NUEVO `app/app/settings/page.tsx`):** server component bajo `/app` (hereda la
  AppNav + gate de sesión). Tres `Card`s: Idioma (`LanguageSwitcher`), Tema (`ThemeToggle`) y
  Programa actual (solo lectura, leído en server: `usuario.programa_id` → `programa.nombre`).
  Sin lógica de cambio de programa (fuera de alcance). Namespace i18n `settings` nuevo en
  es.json y en.json.
- **Limpieza de duplicados:** ahora que la AppNav aloja LanguageSwitcher + ThemeToggle +
  LogoutButton, se quitaron los `<LanguageSwitcher>` duplicados de los wrappers de
  `semesters/page.tsx`, `semesters/[id]/page.tsx`, `onboarding/page.tsx` y `app/page.tsx`
  (más el `LogoutButton` duplicado del dashboard). Se conservó el LogoutButton del onboarding
  (un usuario nuevo puede querer salir). Las páginas PÚBLICAS (landing/login/signup) no se
  tocaron porque no tienen AppNav. Imports sin usar eliminados.

**🔥 Defecto detectado (pendiente para Tarea 11):** el subagente notó que
`DashboardClient.tsx` (de la Tarea 10.2) referencia tokens que NO existen en `globals.css`:
`--space-sm` y `--space-md`. Esos resuelven a vacío/cero, así que el espaciado del dashboard
puede verse mal. El subagente de esta tarea usó solo tokens existentes (`--space-xs`,
`--space`, `--space-lg`, `--space-xl`) y dejó el aviso. HAY QUE ARREGLARLO en la verificación
final (Tarea 11): o bien añadir `--space-sm`/`--space-md` a globals.css, o corregir
DashboardClient para usar los tokens que existen.

**Requisitos cubiertos:** 5.1, 5.5, 6.2, 10.3, 10.4. Con esto queda COMPLETA la Tarea 10
padre (todas las pantallas rediseñadas).

**Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` en verde (la ruta
`/app/settings` quedó registrada); `npm test` → 9/9. Sin temporales. Capa de datos intacta.

**Lección de video:** aparece una lección clásica de refactor: al centralizar los controles
(idioma/tema/logout) en la barra de navegación, hubo que ir a QUITAR los duplicados que
quedaron regados en cada página. Centralizar algo implica limpiar lo viejo, no solo agregar
lo nuevo. Y el defecto de los tokens inexistentes muestra por qué la tarea de verificación
final importa: pequeños descuidos entre tareas se cazan al revisar el conjunto.

### Tarea 11 completada — Verificación final y no regresión ✅🏁 (REDISEÑO COMPLETO)

**Qué se hizo:** la tarea de cierre. Se corrieron todas las verificaciones, se auditó la no
regresión y se resolvieron los dos cabos sueltos que habían quedado marcados:
- **🔥 Tokens inexistentes (arreglado):** `DashboardClient.tsx` usaba `--space-sm` y
  `--space-md`, que NO estaban definidos en `globals.css` (resolvían a vacío → espaciado
  roto). Se añadieron al scale respetando la progresión existente: `--space-sm: 12px` y
  `--space-md: 20px` (xs=8, sm=12, space=16, md=20, lg=24, xl=32). Se barrió todo `app/` y
  `components/`: ya no queda ninguna referencia a un token indefinido.
- **🔎 Artefacto de `types/domain.ts` (resuelto):** `git diff` confirmó que NO hay cambio real
  de contenido; el archivo está pristino y ni siquiera aparece en `git status`. Falsa alarma
  (era un tema de stat/fin de línea). El archivo prohibido quedó intacto.
- **Hex en LanguageSwitcher (migrado):** el selector ES/EN todavía usaba `#000/#fff`. Se pasó
  a tokens (activo `var(--primary)`/`var(--primary-fg)`, inactivo `var(--surface)`/`var(--fg)`,
  esquinas `var(--radius-sm)`), sin tocar su lógica. Tras esto, un barrido de `app/` +
  `components/` da CERO hex hardcodeados: todos los colores literales viven solo en los tokens
  de `globals.css`.

**Auditoría de no regresión (limpia):** `git diff --stat` sobre `services/`, `lib/supabase/`,
`supabase/` y `types/domain.ts` → VACÍO, no se tocó nada. `services/queries.ts` no aparece en
`git status` (queryKeys y firmas intactas). Se confirmó la lista completa de archivos
nuevos/modificados del rediseño (globals.css, layout, components/ui/*, theme/*, nav/*, Logo,
lib/theme/*, grade-forecast(+test), celebrate, páginas de app/ y app/app/*, messages/*.json,
package.json, public/sounds/*).

**Paridad i18n:** es.json y en.json tienen EXACTAMENTE 140 claves cada uno; `Compare-Object`
da cero asimetría. Ninguna traducción falta.

**Sin texto hardcodeado:** todo el copy visible sale de `t(...)`. El único literal es el
wordmark "unigrades" del Logo (nombre de marca, a propósito). Los estados usan icono + texto +
símbolo, nunca solo color.

**Verificación final (TODO PASA):** `npm run typecheck` ✅, `npm run lint` ✅,
`npm run build` ✅ (9 rutas), `npm test` ✅ (9/9 forecast). Sin temporales.

**Requisitos cubiertos:** 10.1, 10.2, 10.3, 10.4, 7.1, 6.7.

---

## Cierre del capítulo — Rediseño de frontend COMPLETO 🎨

**Lo que se logró:** se ejecutaron las 18 tareas de la spec `frontend-redesign` de corrido,
orquestadas (Kiro despacha, subagentes implementan). UniGrades pasó de la UI mínima
blanco/negro a una identidad real: paleta de marca (verde esmeralda + menta), tipografía
Sora/Inter/JetBrains Mono, tema claro/oscuro con anti-FOUC resuelto en servidor, iconos
Lucide, primitivos reutilizables (Card, StatCard, StatusBadge, ProgressRing, AnimatedNumber),
navegación móvil, microinteracciones (confeti + número animado), la "tarjeta estrella" (¿qué
nota necesitas?) y todas las pantallas restyleadas. TODO sin tocar una sola línea de
`services/`, `lib/supabase/`, `supabase/` ni `types/domain.ts`.

**La promesa cumplida:** lo que se prometió en el Episodio 2 —"haz que funcione antes de que
se vea bonito; el rediseño será SOLO frontend"— se cumplió al pie de la letra. La auditoría
de no regresión lo prueba: cero cambios en la capa de datos. Meses de disciplina
(separar estilo de lógica, tokens, componentes tontos) convirtieron el rediseño en algo
quirúrgico.

**🔧 PENDIENTES DE CONFIG DEL USUARIO (2):**
1. Colocar un `public/sounds/approve.mp3` real (efecto corto de éxito, con licencia).
   Mientras tanto la app funciona; el sonido falla en silencio.
2. Revisar la alerta crítica de `npm audit` que apareció al instalar lucide-react /
   canvas-confetti. Ejecutar `npm audit` para ver de qué paquete viene y decidir si afecta
   producción (como se hizo con las alertas de next-intl en el Episodio 8).

**🔎 Nota a confirmar:** `lucide-react` quedó pineado en `1.65.0`. Se verificó que es una
versión real, publicada y oficial (no typosquat), y el build pasa con ella. Aun así vale la
pena que el usuario confirme que es la línea de versión que quiere.

**MANUAL (no lo hace el agente):** revisión responsive a 360px y ≥640px, en claro y oscuro.
Correr `npm run dev` y confirmar a ojo que no hay scroll horizontal a 360px y que el
contraste es correcto en ambos temas.

**Lección de video (cierre):** el rediseño entero —cambiar la cara completa de la app— se
hizo sin tocar el backend, y una auditoría de git lo demuestra. Esa es la recompensa de
haber construido con los cimientos correctos: cuando llega el momento de "hacerlo bonito",
es solo piel sobre un esqueleto que ya funciona.
