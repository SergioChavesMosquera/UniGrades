# Plan de Implementación — UniGrades Web (MVP)

- [ ] 1. Inicializar proyecto Next.js + estilo base mínimo
  - Crear proyecto con create-next-app (App Router, TypeScript), configurar ESLint/Prettier.
  - Estilo global mínimo (fondo blanco, texto negro, botones negros con texto blanco).
  - Componentes reutilizables simples en components/ui: Button, Input, Container.
  - Verificar que compila y corre (`next build`, `npm run dev`).
  - _Requisitos: NFR UI mínima; base para todo lo demás_

- [ ] 2. Configurar hooks de lint/type-check al guardar
  - Hook PostFileSave para .ts/.tsx que corre lint + type-check.
  - _Requisitos: herramienta de orden (verificación continua)_

- [ ] 3. Landing page mínima + rutas públicas
  - `/` con título, descripción y botones "Crear cuenta" / "Iniciar sesión".
  - Esqueletos de `/login` y `/signup`.
  - Navegación entre `/`, `/login`, `/signup`.
  - _Requisitos: R1_

- [ ] 4. Configurar Supabase y modelo de datos
  - Crear proyecto Supabase; definir esquema SQL completo de todas las entidades.
  - Constraints: CHECK nota 0.0–5.0 (RN-5), UNIQUE materia/semestre (RN-3), FK programa (RN-1).
  - Conectar cliente Supabase (browser + server) con variables de entorno.
  - PEDIR al usuario su avance SQL previo e integrarlo.
  - Datos semilla de una institución.
  - _Requisitos: R3, R10 (base); modelo de datos_

- [ ] 5. Reglas de negocio en la base de datos (triggers + vistas + RLS)
  - Trigger RN-2 (porcentajes suman 100), trigger RN-4 (transiciones de estado).
  - Vistas RN-7 (promedio de componente) y promedios materia/semestre/global con RN-6.
  - Row Level Security por usuario (auth.uid()).
  - Tests: casos inválidos rechazados, válidos aceptados.
  - _Requisitos: R5, R6, R7, R10; RN-2, RN-4, RN-6, RN-7_

- [ ] 6. Autenticación (email + Google) + rutas protegidas
  - Signup/login con Supabase Auth (email/contraseña + Google OAuth).
  - middleware.ts protege `/app/*`, redirige a `/login` sin sesión.
  - Crear fila `usuario` al registrarse; redirección post-registro a `/app`.
  - _Requisitos: R2, R3_

- [ ] 7. i18n español/inglés
  - next-intl con mensajes es/en; selector en `/app/settings`.
  - Persistir idioma preferido; aplicar a landing y app.
  - _Requisitos: R9_

- [ ] 8. Onboarding — catálogo precargado + creación manual
  - Seed de 2-3 programas conocidos (materias, créditos, tipologías).
  - `/app/onboarding`: elegir programa del catálogo (RN-1) o crear materias manualmente.
  - Marcar onboarding_completo y redirigir a `/app`.
  - _Requisitos: R4, R3_

- [ ] 9. Gestión de semestres y materias del usuario
  - CRUD de semestres en `/app/semesters` y detalle en `/app/semesters/[id]`.
  - Inscripción de materias (materia_usuario) con estados (RN-4) y bloqueo de duplicados (RN-3).
  - _Requisitos: R5_

- [ ] 10. Componentes de evaluación con validación de 100%
  - UI en `/app/subjects/[id]` para configurar componentes con suma en vivo.
  - Bloqueo de guardado si no suma 100 (RN-2), con indicador de cuánto falta/sobra.
  - _Requisitos: R6; RN-2_

- [ ] 11. Registro de notas y cálculo de promedios
  - Registrar notas por componente (RN-5, RN-7).
  - Consumir vistas de promedio por materia, semestre y global, excluyendo nivelación (RN-6).
  - _Requisitos: R7; RN-5, RN-6, RN-7_

- [ ] 12. Dashboard de progreso
  - `/app` con promedio global, avance por tipología de créditos, materias en curso.
  - Datos reales del usuario (blanco/negro simple).
  - _Requisitos: R8_

- [ ] 13. Despliegue en Vercel + documentación para el video
  - Conectar repo a Vercel, configurar env vars de Supabase, ajustar dominio.
  - README con arquitectura y decisiones como guion para el video de clase.
  - Verificar flujo end-to-end con un usuario real.
  - _Requisitos: R11_
