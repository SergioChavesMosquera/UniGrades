/**
 * Forecast de nota — "tarjeta estrella".
 *
 * Función pura, tipada y total: calcula qué nota promedio necesita el estudiante
 * en el peso restante de una materia para alcanzar la nota mínima de aprobación.
 *
 * Vive fuera de `services/` (R8.5): recibe datos que las pantallas ya cargan vía
 * los hooks de React Query (componentes con porcentaje, calificaciones por
 * componente y `nota_minima_aprobacion`). No accede a red ni a Supabase y NUNCA
 * lanza (R8.6): ante datos faltantes o inconsistentes degrada con elegancia.
 */

export type Forecast =
  | { kind: "secured" } // ya aprobada con lo registrado
  | { kind: "needed"; required: number } // nota promedio necesaria en el peso restante
  | { kind: "impossible" } // required > escalaMax
  | { kind: "incomplete_setup"; sum: number } // los componentes no suman 100% todavía
  | { kind: "insufficient" }; // faltan datos (sin componentes)

const PERCENT_TOLERANCE = 0.01;
const DEFAULT_ESCALA_MAX = 5.0;

/**
 * Determina la proyección de nota de una materia.
 *
 * El orden de la lógica es significativo (ver design.md §8):
 * 1. Sin componentes → `insufficient`.
 * 2. Σ porcentaje ≠ 100 (tol. 0.01) → `incomplete_setup` (no se calcula sobre
 *    un total parcial, daría un número engañoso).
 * 3. `pesoRestante == 0` (todo calificado) → `secured` / `impossible`.
 * 4. En otro caso → `required = (notaMinima - aportado) / (pesoRestante / 100)`
 *    → `secured` (≤ 0) / `impossible` (> escalaMax) / `needed` (1 decimal).
 */
export function forecastRequiredGrade(input: {
  componentes: { id: string; porcentaje: number }[];
  calificaciones: { componente_id: string; calificacion: number | null }[];
  notaMinima: number;
  escalaMax?: number;
}): Forecast {
  const { componentes, calificaciones, notaMinima } = input;
  const escalaMax = input.escalaMax ?? DEFAULT_ESCALA_MAX;

  // 1. Sin componentes → datos insuficientes (R8.6).
  if (componentes.length === 0) {
    return { kind: "insufficient" };
  }

  // 2. Los componentes deben sumar 100% para que el forecast sea confiable (R8 ampliado).
  const sumaPorcentajes = componentes.reduce(
    (acc, c) => acc + c.porcentaje,
    0
  );
  if (Math.abs(sumaPorcentajes - 100) > PERCENT_TOLERANCE) {
    return { kind: "incomplete_setup", sum: sumaPorcentajes };
  }

  // Mapa componente_id → calificación (último valor no nulo gana). Un componente
  // sin entrada o con calificación nula cuenta como peso restante.
  const calificacionPorComponente = new Map<string, number>();
  for (const cal of calificaciones) {
    if (cal.calificacion != null) {
      calificacionPorComponente.set(cal.componente_id, cal.calificacion);
    }
  }

  // 3. Repartir el aporte ya asegurado y el peso aún sin calificar.
  let aportado = 0;
  let pesoRestante = 0;
  for (const c of componentes) {
    const calificacion = calificacionPorComponente.get(c.id);
    if (calificacion != null) {
      aportado += calificacion * (c.porcentaje / 100);
    } else {
      pesoRestante += c.porcentaje;
    }
  }

  // 4. Sin peso restante: la suerte ya está echada.
  if (pesoRestante === 0) {
    return aportado >= notaMinima ? { kind: "secured" } : { kind: "impossible" };
  }

  // 5. Nota promedio requerida en el peso restante.
  const required = (notaMinima - aportado) / (pesoRestante / 100);

  if (required <= 0) {
    return { kind: "secured" };
  }
  if (required > escalaMax) {
    return { kind: "impossible" };
  }
  return { kind: "needed", required: Math.round(required * 10) / 10 };
}
