import { create } from 'zustand';
import type { ThemeId } from '../themes/theme-engine';

interface UiStore {
  sidebarCollapsed: boolean;
  codePanelVisible: boolean;
  codePanelWidth: number;
  activeCategory: string | null;
  activeItemKey: string | null;
  theme: ThemeId;
  language: 'en' | 'it';
  toggleSidebar: () => void;
  toggleCodePanel: () => void;
  setCodePanelWidth: (w: number) => void;
  setActiveCategory: (cat: string) => void;
  setActiveItem: (cat: string, key: string) => void;
  setTheme: (t: ThemeId) => void;
  setLanguage: (l: 'en' | 'it') => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarCollapsed: false, codePanelVisible: true, codePanelWidth: 270,
  activeCategory: null, activeItemKey: null, theme: 'sci-fi', language: 'en',
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleCodePanel: () => set(s => ({ codePanelVisible: !s.codePanelVisible })),
  setCodePanelWidth: (w) => set({ codePanelWidth: w }),
  setActiveCategory: (cat) => set({ activeCategory: cat, activeItemKey: null }),
  setActiveItem: (cat, key) => set({ activeCategory: cat, activeItemKey: key }),
  setTheme: (t) => set({ theme: t }),
  setLanguage: (l) => set({ language: l }),
}));
