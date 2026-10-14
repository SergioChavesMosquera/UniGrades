# UniGrades — Producto

## Qué es
UniGrades es una aplicación web para estudiantes universitarios que centraliza el
seguimiento de su progreso académico durante toda la carrera. El estudiante registra
las materias cursadas por período, configura los componentes de evaluación de cada
asignatura (parciales, talleres, proyectos, etc.) y registra las notas obtenidas. El
sistema calcula automáticamente promedios por materia, por semestre y el promedio
global acumulado.

A diferencia de los sistemas institucionales (como el SIA de la UNAL), UniGrades es una
herramienta personal del estudiante: él mismo configura su plan de trabajo, registra sus
notas a medida que las recibe y visualiza su avance por tipología de créditos. Es
agnóstico a la institución: soporta cualquier universidad, programa y escala de
calificación.

## Actores
- **Estudiante:** usuario principal. Registra materias, configura componentes y consulta
  su progreso.
- **Institución:** entidad maestra que provee el catálogo de programas, tipologías y
  materias sobre el que opera el estudiante.

## Alcance del MVP (web)
- Solo **web** por ahora. El móvil se hará después en un repo separado (Expo), compartiendo
  la misma base de datos Supabase.
- Núcleo completo: registrar materias, configurar componentes con % que sumen 100,
  registrar notas, ver promedios (materia/semestre/global).
- Catálogo precargado de carreras conocidas + creación manual para quien no esté.
- Autenticación (email + Google) y datos en la nube multi-dispositivo.
- Internacionalización español/inglés con selector.

## Fuera del alcance del MVP
- Suscripciones y cobros (se agregarán cuando el socio de negocio los defina). El MVP es
  100% gratis y SIN rastro técnico de planes de pago.
- Diseño/branding elaborado. La UI es deliberadamente mínima (ver tech.md).
- App móvil (repo separado futuro).

## Objetivos de negocio
- Producto real que enganche por calidad, con miras a una startup.
- Doble propósito: entregable para clase de inglés (video paso a paso de la construcción)
  y base para una posible sociedad.

## Dominio actual
- Web desplegada en Vercel: https://unigrades-project.vercel.app/
- Se puede migrar a `unigrades.vercel.app` o a un dominio `.com` propio más adelante.
