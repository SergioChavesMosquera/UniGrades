# Requisitos — UniGrades Web (MVP)

## Introducción
UniGrades Web es una aplicación para estudiantes universitarios que centraliza el
seguimiento de su progreso académico. El estudiante registra materias por período,
configura los componentes de evaluación de cada asignatura y registra sus notas; el
sistema calcula automáticamente promedios por materia, por semestre y el promedio global
acumulado. Es agnóstico a la institución. Esta spec cubre únicamente la versión **web**
(Next.js + Supabase, desplegada en Vercel). El móvil se abordará después en un repo
separado compartiendo la misma base de datos.

El patrón de navegación es tipo Framer: landing pública en la raíz (`/`) y aplicación real
bajo `/app`. La UI es deliberadamente mínima (blanco/negro) para priorizar backend y flujo.

## Requisitos

### R1 — Acceso y navegación pública
**Historia:** Como visitante, quiero una landing que explique UniGrades y me deje crear
cuenta o iniciar sesión, para empezar a usar la app.
Criterios de aceptación:
1. CUANDO un visitante entra a `/` ENTONCES el sistema MOSTRARÁ título, descripción corta
   y botones "Crear cuenta" e "Iniciar sesión".
2. CUANDO el visitante hace clic en "Crear cuenta" ENTONCES el sistema NAVEGARÁ a `/signup`.
3. CUANDO el visitante hace clic en "Iniciar sesión" ENTONCES el sistema NAVEGARÁ a `/login`.
4. Las rutas `/`, `/login`, `/signup` SERÁN accesibles sin sesión.

### R2 — Autenticación
**Historia:** Como estudiante, quiero crear cuenta e iniciar sesión con email o Google,
para acceder a mis datos desde cualquier dispositivo.
Criterios de aceptación:
1. CUANDO un usuario se registra con email y contraseña ENTONCES el sistema CREARÁ la
   cuenta en Supabase Auth y una fila `usuario` asociada.
2. CUANDO un usuario elige "Continuar con Google" ENTONCES el sistema AUTENTICARÁ vía
   Google OAuth.
3. CUANDO un usuario completa el registro ENTONCES el sistema LO REDIRIGIRÁ a `/app`.
4. CUANDO un usuario con sesión activa recarga la página ENTONCES el sistema MANTENDRÁ la
   sesión.
5. CUANDO un usuario cierra sesión ENTONCES el sistema INVALIDARÁ la sesión y lo llevará a `/`.
6. SI un usuario sin sesión intenta acceder a cualquier ruta bajo `/app` ENTONCES el
   sistema LO REDIRIGIRÁ a `/login`.

### R3 — Programa del estudiante (RN-1)
**Historia:** Como estudiante, quiero quedar asociado a exactamente un programa, para que
mi avance se calcule sobre mi plan.
Criterios de aceptación:
1. CUANDO se crea un `usuario` ENTONCES el sistema EXIGIRÁ un `programa_id` no nulo.
2. SI no hay programa asignado ENTONCES el sistema NO PERMITIRÁ completar el onboarding.

### R4 — Onboarding: catálogo precargado + creación manual
**Historia:** Como estudiante nuevo, quiero elegir mi carrera de un catálogo o crearla a
mano si no está, para no quedarme sin usar la app.
Criterios de aceptación:
1. CUANDO un usuario entra por primera vez a `/app` ENTONCES el sistema LO LLEVARÁ a
   `/app/onboarding`.
2. CUANDO el usuario abre el onboarding ENTONCES el sistema MOSTRARÁ los programas
   precargados disponibles.
3. CUANDO el usuario selecciona un programa precargado ENTONCES el sistema ASOCIARÁ ese
   programa a su `usuario`.
4. CUANDO la carrera del usuario no está en el catálogo ENTONCES el sistema LE PERMITIRÁ
   crear materias manualmente.
5. CUANDO el onboarding se completa ENTONCES el sistema LO REDIRIGIRÁ a `/app`.

### R5 — Gestión de semestres y materias (RN-3, RN-4)
**Historia:** Como estudiante, quiero crear semestres e inscribir materias con su estado,
para organizar mi historial académico.
Criterios de aceptación:
1. CUANDO el usuario crea un semestre ENTONCES el sistema LO GUARDARÁ asociado a su cuenta.
2. CUANDO el usuario inscribe una materia en un semestre ENTONCES el sistema CREARÁ una
   `materia_usuario` con estado inicial `en_curso`.
3. SI el usuario intenta inscribir la misma materia dos veces en el mismo semestre
   ENTONCES el sistema RECHAZARÁ la operación (RN-3).
4. El estado de una materia SOLO PODRÁ ser `en_curso`, `aprobada`, `reprobada` o
   `retirada` (RN-4).
5. SI una materia está `aprobada` o `reprobada` ENTONCES el sistema NO PERMITIRÁ volverla
   a `en_curso` (RN-4).

### R6 — Componentes de evaluación (RN-2)
**Historia:** Como estudiante, quiero definir los componentes de cada materia con sus
porcentajes, para reflejar cómo se evalúa.
Criterios de aceptación:
1. CUANDO el usuario configura los componentes de una materia ENTONCES el sistema MOSTRARÁ
   en vivo la suma de porcentajes.
2. SI la suma de porcentajes no es exactamente 100 ENTONCES el sistema BLOQUEARÁ el guardado
   e indicará cuánto falta o sobra.
3. CUANDO la suma es exactamente 100 ENTONCES el sistema PERMITIRÁ guardar (RN-2 validado
   también en la base de datos vía trigger).

### R7 — Registro de notas y promedios (RN-5, RN-6, RN-7)
**Historia:** Como estudiante, quiero registrar notas por componente y ver mis promedios
calculados, para conocer mi rendimiento.
Criterios de aceptación:
1. CUANDO el usuario registra una nota ENTONCES el sistema EXIGIRÁ un valor entre 0.0 y 5.0
   (RN-5).
2. CUANDO un componente tiene varias notas ENTONCES el sistema CALCULARÁ su calificación
   como el promedio aritmético de ellas (RN-7).
3. CUANDO se calculan promedios de materia, semestre y global ENTONCES el sistema EXCLUIRÁ
   las materias de tipologías con `tipologia_cuenta_promedio = 0` (RN-6).
4. CUANDO el usuario registra o edita una nota ENTONCES el sistema ACTUALIZARÁ el promedio
   de la materia, del semestre y el global.

### R8 — Dashboard de progreso
**Historia:** Como estudiante, quiero una pantalla inicial con mi progreso, para verlo de
un vistazo.
Criterios de aceptación:
1. CUANDO el usuario entra a `/app` (con onboarding completo) ENTONCES el sistema MOSTRARÁ
   su promedio global, avance por tipología de créditos y materias en curso.
2. CUANDO los datos del usuario cambian ENTONCES el dashboard REFLEJARÁ los valores reales
   actualizados.

### R9 — Internacionalización
**Historia:** Como estudiante, quiero usar la app en español o inglés, para elegir mi
idioma.
Criterios de aceptación:
1. CUANDO el usuario cambia el idioma en `/app/settings` ENTONCES el sistema TRADUCIRÁ la
   interfaz entre español e inglés.
2. CUANDO el usuario vuelve a entrar ENTONCES el sistema RECORDARÁ su idioma elegido.

### R10 — Aislamiento de datos (RLS)
**Historia:** Como estudiante, quiero que mis datos sean privados, para que nadie más los
vea.
Criterios de aceptación:
1. CUANDO un usuario consulta datos ENTONCES el sistema SOLO DEVOLVERÁ los registros que le
   pertenecen (Row Level Security con `auth.uid()`).
2. SI un usuario intenta acceder a datos de otro ENTONCES el sistema LO RECHAZARÁ a nivel de
   base de datos.

### R11 — Despliegue y entregable de clase
**Historia:** Como equipo, queremos la app desplegada en Vercel y documentada, para que
compañeros la usen y para grabar el video de clase.
Criterios de aceptación:
1. CUANDO se hace push a la rama de producción ENTONCES Vercel DESPLEGARÁ la app con las
   variables de entorno de Supabase.
2. La app desplegada FUNCIONARÁ end-to-end para un usuario real (registro → onboarding →
   notas → promedios).
3. EXISTIRÁ un README con arquitectura y decisiones que sirva de guion para el video.

## Restricciones no funcionales
- UI mínima blanco/negro; sin esfuerzo en diseño en el MVP.
- Separación estricta backend/frontend: lógica de datos en capa de servicios tipada +
  Postgres; componentes de UI "tontos".
- Reglas de negocio son autoridad en Postgres (constraints/triggers/vistas/RLS).
- Sin suscripciones ni rastro técnico de cobros en el MVP.
- Soportar ~300 usuarios en plan gratuito de Supabase sin problemas.
