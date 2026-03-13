import { create } from 'zustand';
import type { GameDataIndex } from '@shared/types/gameData';

interface GameDataStore {
  index: GameDataIndex | null;
  gamePath: string | null;
  scanning: boolean;
  setIndex: (index: GameDataIndex) => void;
  setGamePath: (path: string) => void;
  setScanning: (v: boolean) => void;
}

export const useGameDataStore = create<GameDataStore>((set) => ({
  index: null, gamePath: null, scanning: false,
  setIndex: (index) => set({ index, scanning: false }),
  setGamePath: (path) => set({ gamePath: path }),
  setScanning: (v) => set({ scanning: v }),
}));
