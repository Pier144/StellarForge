// src/renderer/hooks/useCodeSync.ts
import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useProjectStore } from '../stores/projectStore';
import { useUiStore } from '../stores/uiStore';

// This hook synchronizes the active editor item with the Monaco code panel.
// Form → Code: Instant. Serialize current item to Paradox script.
// Code → Form: 300ms debounce. Parse code and update store.
export function useCodeSync() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { activeCategory, activeItemKey } = useUiStore();
  const { codeContent, setCodeContent, codeSyncEnabled } = useEditorStore();
  const { project, setItem } = useProjectStore();

  // Form → Code: when active item changes, serialize to code
  useEffect(() => {
    if (!codeSyncEnabled || !activeCategory || !activeItemKey || !project) return;
    const item = project.items[activeCategory]?.[activeItemKey];
    if (!item) return;
    // Serialize item to Paradox code via IPC (main process has the serializer).
    // STUB: Uses JSON.stringify until IPC channel 'paradox:serialize' is wired in a later task.
    if (typeof (window as any).stellarforge?.paradox?.serialize === 'function') {
      (window as any).stellarforge.paradox.serialize(activeCategory, item).then((code: string) => setCodeContent(code));
    } else {
      setCodeContent(JSON.stringify(item, null, 2));
    }
  }, [activeCategory, activeItemKey, project, codeSyncEnabled, setCodeContent]);

  // Code → Form: debounced parse on code change
  const handleCodeChange = useCallback((newCode: string) => {
    setCodeContent(newCode);
    if (!codeSyncEnabled || !activeCategory || !activeItemKey) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // STUB: Parse code via IPC and update store. Uses JSON.parse fallback
      // until IPC channel 'paradox:parse' is wired in a later task.
      try {
        if (typeof (window as any).stellarforge?.paradox?.parse === 'function') {
          const parsed = await (window as any).stellarforge.paradox.parse(newCode);
          if (parsed) setItem(activeCategory!, activeItemKey!, parsed);
        } else {
          const parsed = JSON.parse(newCode);
          if (parsed && typeof parsed === 'object') setItem(activeCategory!, activeItemKey!, parsed);
        }
      } catch { /* ignore parse errors during typing */ }
    }, 300);
  }, [codeSyncEnabled, activeCategory, activeItemKey, setCodeContent, setItem]);

  return { handleCodeChange };
}
