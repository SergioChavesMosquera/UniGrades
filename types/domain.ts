/**
 * Tipos del dominio de UniGrades.
 * Reflejan el esquema de la base de datos (supabase/migrations/0001_schema.sql).
 * La capa de servicios (services/) usa estos tipos; los componentes de UI los consumen.
 */

export type EstadoMateria = "en_curso" | "aprobada" | "reprobada" | "retirada";
export type Idioma = "es" | "en";

export type Institucion = {
  id: string;
  nombre: string;
  sigla: string | null;
  pais: string | null;
  ciudad: string | null;
  es_publico: boolean;
  creado_por: string | null;
  creado_en: string;
};

export type Programa = {
  id: string;
  institucion_id: string;
  nombre: string;
  facultad: string | null;
  total_creditos: number;
  es_publico: boolean;
  creado_por: string | null;
  creado_en: string;
};

export type Tipologia = {
  id: string;
  programa_id: string;
  nombre: string;
  creditos_requeridos: number;
  cuenta_promedio: boolean;
  creado_en: string;
};

export type Materia = {
  id: string;
  programa_id: string;
  tipologia_id: string;
  codigo: string | null;
  nombre: string;
  creditos: number;
  nota_minima_aprobacion: number;
  semestre_sugerido: number | null;
  creado_en: string;
};

export type Usuario = {
  id: string;
  programa_id: string | null;
  nombre: string | null;
  apellido: string | null;
  email: string | null;
  codigo_estudiantil: string | null;
  avatar_url: string | null;
  idioma: Idioma;
  onboarding_completo: boolean;
  creado_en: string;
};

export type Semestre = {
  id: string;
  usuario_id: string;
  etiqueta: string;
  anio: number | null;
  periodo: number | null;
  orden: number;
  creado_en: string;
};

export type MateriaUsuario = {
  id: string;
  usuario_id: string;
  materia_id: string;
  semestre_id: string;
  estado: EstadoMateria;
  creado_en: string;
};

export type Componente = {
  id: string;
  materia_usuario_id: string;
  nombre: string;
  porcentaje: number;
  nota_minima: number | null;
  orden: number;
  creado_en: string;
};

export type Nota = {
  id: string;
  componente_id: string;
  nombre: string;
  valor: number;
  fecha_registro: string | null;
  observacion: string | null;
  creado_en: string;
};
