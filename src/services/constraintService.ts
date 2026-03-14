import { LS_KEYS } from "@/lib/constants";
import { loadArrayFromStorage, saveToStorage } from "@/lib/storage";
import type { Constraint } from "@/types";

// ═══ LOAD ═══
export function loadConstraints(): Constraint[] {
  return loadArrayFromStorage<Constraint>(LS_KEYS.CONSTRAINTS);
}

// ═══ SAVE ALL ═══
export function saveConstraints(constraints: Constraint[]): void {
  saveToStorage(LS_KEYS.CONSTRAINTS, constraints);
}

// ═══ ADD ═══
export function addConstraint(constraint: Omit<Constraint, "id" | "createdAt" | "updatedAt">): Constraint {
  const now = new Date().toISOString();
  const newConstraint: Constraint = {
    ...constraint,
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };
  const all = loadConstraints();
  all.unshift(newConstraint);
  saveConstraints(all);
  return newConstraint;
}

// ═══ UPDATE ═══
export function updateConstraint(id: string, updates: Partial<Constraint>): void {
  const all = loadConstraints();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
  saveConstraints(all);
}

// ═══ DELETE ═══
export function deleteConstraint(id: string): void {
  const all = loadConstraints().filter(c => c.id !== id);
  saveConstraints(all);
}

// ═══ TOGGLE ACTIVE ═══
export function toggleConstraintActive(id: string): void {
  const all = loadConstraints();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], active: !all[idx].active, updatedAt: new Date().toISOString() };
  saveConstraints(all);
}

// ═══ GET ACTIVE CONSTRAINTS ═══
export function getActiveConstraints(): Constraint[] {
  return loadConstraints().filter(c => c.active);
}
