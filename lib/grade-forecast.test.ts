import { describe, it, expect } from "vitest";

import { forecastRequiredGrade } from "./grade-forecast";

/**
 * Tests unitarios de `forecastRequiredGrade` (función pura, total y sin red).
 *
 * Cubren cada rama del tipo `Forecast` (R8.2/8.3/8.4/8.6, R10.1):
 *  - `insufficient`      → sin componentes.
 *  - `incomplete_setup`  → la suma de % ≠ 100 (tanto < 100 como > 100).
 *  - `secured`           → ya aprobada (todo calificado, o required ≤ 0).
 *  - `needed`            → nota promedio requerida en el peso restante (1 decimal).
 *  - `impossible`        → required > escalaMax, o sin peso restante y por debajo.
 *
 * Los valores aritméticos están calculados a mano contra la fórmula
 * `required = (notaMinima - aportado) / (pesoRestante / 100)`.
 */
describe("forecastRequiredGrade", () => {
  it("devuelve 'insufficient' cuando no hay componentes", () => {
    expect(
      forecastRequiredGrade({
        componentes: [],
        calificaciones: [],
        notaMinima: 3.0,
      })
    ).toEqual({ kind: "insufficient" });
  });

  it("devuelve 'incomplete_setup' con la suma cuando los % suman < 100", () => {
    expect(
      forecastRequiredGrade({
        componentes: [
          { id: "a", porcentaje: 50 },
          { id: "b", porcentaje: 30 },
        ],
        calificaciones: [],
        notaMinima: 3.0,
      })
    ).toEqual({ kind: "incomplete_setup", sum: 80 });
  });

  it("devuelve 'incomplete_setup' con la suma cuando los % suman > 100", () => {
    expect(
      forecastRequiredGrade({
        componentes: [
          { id: "a", porcentaje: 70 },
          { id: "b", porcentaje: 50 },
        ],
        calificaciones: [],
        notaMinima: 3.0,
      })
    ).toEqual({ kind: "incomplete_setup", sum: 120 });
  });

  it("devuelve 'secured' cuando todo está calificado y supera la nota mínima", () => {
    // aportado = 4.0*0.5 + 4.0*0.5 = 4.0 ; pesoRestante = 0 ; 4.0 >= 3.0
    expect(
      forecastRequiredGrade({
        componentes: [
          { id: "a", porcentaje: 50 },
          { id: "b", porcentaje: 50 },
        ],
        calificaciones: [
          { componente_id: "a", calificacion: 4.0 },
          { componente_id: "b", calificacion: 4.0 },
        ],
        notaMinima: 3.0,
      })
    ).toEqual({ kind: "secured" });
  });

  it("devuelve 'secured' cuando queda peso pero el required es ≤ 0", () => {
    // aportado = 5.0*0.5 = 2.5 ; pesoRestante = 50
    // required = (2.0 - 2.5) / 0.5 = -1.0 → ≤ 0 → secured
    expect(
      forecastRequiredGrade({
        componentes: [
          { id: "a", porcentaje: 50 },
          { id: "b", porcentaje: 50 },
        ],
        calificaciones: [{ componente_id: "a", calificacion: 5.0 }],
        notaMinima: 2.0,
      })
    ).toEqual({ kind: "secured" });
  });

  it("devuelve 'needed' con el valor exacto requerido en el peso restante", () => {
    // aportado = 4.0*0.5 = 2.0 ; pesoRestante = 50
    // required = (3.0 - 2.0) / 0.5 = 2.0
    expect(
      forecastRequiredGrade({
        componentes: [
          { id: "a", porcentaje: 50 },
          { id: "b", porcentaje: 50 },
        ],
        calificaciones: [{ componente_id: "a", calificacion: 4.0 }],
        notaMinima: 3.0,
      })
    ).toEqual({ kind: "needed", required: 2.0 });
  });

  it("devuelve 'needed' redondeando a 1 decimal", () => {
    // aportado = 3.0*0.7 = 2.1 ; pesoRestante = 30
    // required = (3.2 - 2.1) / 0.3 = 1.1 / 0.3 = 3.6666... → 3.7
    expect(
      forecastRequiredGrade({
        componentes: [
          { id: "a", porcentaje: 70 },
          { id: "b", porcentaje: 30 },
        ],
        calificaciones: [{ componente_id: "a", calificacion: 3.0 }],
        notaMinima: 3.2,
      })
    ).toEqual({ kind: "needed", required: 3.7 });
  });

  it("devuelve 'impossible' cuando el required supera la escala máxima", () => {
    // aportado = 0.5*0.5 = 0.25 ; pesoRestante = 50
    // required = (3.5 - 0.25) / 0.5 = 3.25 / 0.5 = 6.5 > 5 → impossible
    expect(
      forecastRequiredGrade({
        componentes: [
          { id: "a", porcentaje: 50 },
          { id: "b", porcentaje: 50 },
        ],
        calificaciones: [{ componente_id: "a", calificacion: 0.5 }],
        notaMinima: 3.5,
      })
    ).toEqual({ kind: "impossible" });
  });

  it("devuelve 'impossible' sin peso restante y por debajo de la nota mínima", () => {
    // aportado = 2.0*0.5 + 2.0*0.5 = 2.0 ; pesoRestante = 0 ; 2.0 < 3.0
    expect(
      forecastRequiredGrade({
        componentes: [
          { id: "a", porcentaje: 50 },
          { id: "b", porcentaje: 50 },
        ],
        calificaciones: [
          { componente_id: "a", calificacion: 2.0 },
          { componente_id: "b", calificacion: 2.0 },
        ],
        notaMinima: 3.0,
      })
    ).toEqual({ kind: "impossible" });
  });
});
