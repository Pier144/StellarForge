import { create } from 'zustand';

interface EditorStore {
  codeContent: string;
  codeSyncEnabled: boolean;
  setCodeContent: (content: string) => void;
  setCodeSyncEnabled: (enabled: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  codeContent: '', codeSyncEnabled: true,
  setCodeContent: (content) => set({ codeContent: content }),
  setCodeSyncEnabled: (enabled) => set({ codeSyncEnabled: enabled }),
}));
