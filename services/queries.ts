import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSubject,
  createOwnProgram,
  listPrograms,
  listSubjectsByProgram,
} from "./catalog";
import { completeOnboarding } from "./profile";
import {
  createSemester,
  deleteEnrollment,
  enrollSubject,
  getSemester,
  listEnrollments,
  listSemesters,
  updateEnrollmentState,
} from "./semesters";
import { addComponent, deleteComponent, listComponents } from "./components";
import {
  addGrade,
  deleteGrade,
  getComponentGrades,
  getGlobalAverage,
  getSemesterAverage,
  getSubjectGrade,
  listGrades,
} from "./grades";
import { getCurrentSubjects, getProgressByTypology } from "./progress";
import type { EstadoMateria } from "@/types/domain";

/**
 * Hooks de React Query sobre la capa de servicios. Los componentes usan estos
 * hooks; no llaman a los servicios ni a Supabase directamente.
 */

export function usePrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: listPrograms,
  });
}

export function useSubjects(programaId: string | null) {
  return useQuery({
    queryKey: ["subjects", programaId],
    queryFn: () => listSubjectsByProgram(programaId!),
    enabled: !!programaId,
  });
}

export function useCreateOwnProgram() {
  return useMutation({ mutationFn: createOwnProgram });
}

export function useAddSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addSubject,
    onSuccess: (m) => {
      qc.invalidateQueries({ queryKey: ["subjects", m.programa_id] });
    },
  });
}

export function useCompleteOnboarding() {
  return useMutation({ mutationFn: completeOnboarding });
}

// ---- Semestres ----

export function useSemesters(userId: string) {
  return useQuery({
    queryKey: ["semesters", userId],
    queryFn: () => listSemesters(userId),
  });
}

export function useSemester(id: string) {
  return useQuery({
    queryKey: ["semester", id],
    queryFn: () => getSemester(id),
  });
}

export function useCreateSemester() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSemester,
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: ["semesters", s.usuario_id] });
    },
  });
}

// ---- Inscripciones ----

export function useEnrollments(semestreId: string) {
  return useQuery({
    queryKey: ["enrollments", semestreId],
    queryFn: () => listEnrollments(semestreId),
  });
}

export function useEnrollSubject(semestreId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: enrollSubject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollments", semestreId] });
    },
  });
}

export function useUpdateEnrollmentState(semestreId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoMateria }) =>
      updateEnrollmentState(id, estado),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollments", semestreId] });
    },
  });
}

export function useDeleteEnrollment(semestreId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEnrollment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollments", semestreId] });
    },
  });
}

// ---- Componentes ----

export function useComponents(materiaUsuarioId: string) {
  return useQuery({
    queryKey: ["components", materiaUsuarioId],
    queryFn: () => listComponents(materiaUsuarioId),
  });
}

export function useAddComponent(materiaUsuarioId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addComponent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["components", materiaUsuarioId] });
    },
  });
}

export function useDeleteComponent(materiaUsuarioId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteComponent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["components", materiaUsuarioId] });
      qc.invalidateQueries({ queryKey: ["component-grades", materiaUsuarioId] });
      qc.invalidateQueries({ queryKey: ["subject-grade", materiaUsuarioId] });
    },
  });
}

// ---- Notas y calificaciones (vistas) ----

export function useGrades(componenteId: string) {
  return useQuery({
    queryKey: ["grades", componenteId],
    queryFn: () => listGrades(componenteId),
  });
}

export function useComponentGrades(materiaUsuarioId: string) {
  return useQuery({
    queryKey: ["component-grades", materiaUsuarioId],
    queryFn: () => getComponentGrades(materiaUsuarioId),
  });
}

export function useSubjectGrade(materiaUsuarioId: string) {
  return useQuery({
    queryKey: ["subject-grade", materiaUsuarioId],
    queryFn: () => getSubjectGrade(materiaUsuarioId),
  });
}

export function useSemesterAverage(semestreId: string) {
  return useQuery({
    queryKey: ["semester-average", semestreId],
    queryFn: () => getSemesterAverage(semestreId),
  });
}

export function useGlobalAverage(userId: string) {
  return useQuery({
    queryKey: ["global-average", userId],
    queryFn: () => getGlobalAverage(userId),
  });
}

export function useProgressByTypology(userId: string, programaId: string) {
  return useQuery({
    queryKey: ["progress-typology", userId, programaId],
    queryFn: () => getProgressByTypology(userId, programaId),
  });
}

export function useCurrentSubjects(userId: string) {
  return useQuery({
    queryKey: ["current-subjects", userId],
    queryFn: () => getCurrentSubjects(userId),
  });
}

/**
 * Agregar/eliminar notas invalida la lista de notas Y las vistas de calificación
 * (que dependen de las notas), para que los promedios se recalculen al instante.
 */
export function useAddGrade(componenteId: string, materiaUsuarioId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addGrade,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["grades", componenteId] });
      qc.invalidateQueries({ queryKey: ["component-grades", materiaUsuarioId] });
      qc.invalidateQueries({ queryKey: ["subject-grade", materiaUsuarioId] });
    },
  });
}

export function useDeleteGrade(componenteId: string, materiaUsuarioId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGrade(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["grades", componenteId] });
      qc.invalidateQueries({ queryKey: ["component-grades", materiaUsuarioId] });
      qc.invalidateQueries({ queryKey: ["subject-grade", materiaUsuarioId] });
    },
  });
}
