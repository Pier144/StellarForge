import { create } from 'zustand';
import type { Project } from '@shared/types/project';

interface UndoState {
  past: Project[];
  future: Project[];
}

interface ProjectStore {
  project: Project | null;
  projectPath: string | null;
  dirty: boolean;
  _undo: UndoState;
  setProject: (project: Project) => void;
  setProjectPath: (path: string) => void;
  setItem: (category: string, key: string, data: Record<string, unknown>) => void;
  deleteItem: (category: string, key: string) => void;
  setLocalisation: (lang: string, key: string, value: string) => void;
  markClean: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const MAX_UNDO = 100;

function pushUndo(state: ProjectStore): UndoState {
  if (!state.project) return state._undo;
  const past = [...state._undo.past, structuredClone(state.project)].slice(-MAX_UNDO);
  return { past, future: [] };
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null, projectPath: null, dirty: false,
  _undo: { past: [], future: [] },
  setProject: (project) => set({ project, dirty: false, _undo: { past: [], future: [] } }),
  setProjectPath: (path) => set({ projectPath: path }),
  setItem: (category, key, data) => set((state) => {
    if (!state.project) return state;
    const _undo = pushUndo(state);
    const items = { ...state.project.items };
    items[category] = { ...items[category], [key]: data };
    return { project: { ...state.project, items }, dirty: true, _undo };
  }),
  deleteItem: (category, key) => set((state) => {
    if (!state.project) return state;
    const _undo = pushUndo(state);
    const items = { ...state.project.items };
    const catItems = { ...items[category] };
    delete catItems[key];
    items[category] = catItems;
    return { project: { ...state.project, items }, dirty: true, _undo };
  }),
  setLocalisation: (lang, key, value) => set((state) => {
    if (!state.project) return state;
    const _undo = pushUndo(state);
    const loc = { ...state.project.localisation };
    loc[lang] = { ...loc[lang], [key]: value };
    return { project: { ...state.project, localisation: loc }, dirty: true, _undo };
  }),
  markClean: () => set({ dirty: false }),
  undo: () => set((state) => {
    if (state._undo.past.length === 0 || !state.project) return state;
    const past = [...state._undo.past];
    const previous = past.pop()!;
    const future = [structuredClone(state.project), ...state._undo.future];
    return { project: previous, dirty: true, _undo: { past, future } };
  }),
  redo: () => set((state) => {
    if (state._undo.future.length === 0 || !state.project) return state;
    const future = [...state._undo.future];
    const next = future.shift()!;
    const past = [...state._undo.past, structuredClone(state.project!)];
    return { project: next, dirty: true, _undo: { past, future } };
  }),
  reset: () => set({ project: null, projectPath: null, dirty: false, _undo: { past: [], future: [] } }),
}));
