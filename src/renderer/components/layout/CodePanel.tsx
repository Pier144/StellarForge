import Editor from '@monaco-editor/react';
import { useEditorStore } from '../../stores/editorStore';
import { useUiStore } from '../../stores/uiStore';

export function CodePanel() {
  const { codePanelVisible, codePanelWidth } = useUiStore();
  const { codeContent, setCodeContent } = useEditorStore();

  if (!codePanelVisible) return null;

  return (
    <div className="border-l border-[var(--sf-border)] bg-[var(--sf-bg-secondary)]" style={{ width: codePanelWidth }}>
      <div className="h-8 flex items-center px-3 border-b border-[var(--sf-border)]">
        <span className="text-xs text-[var(--sf-text-muted)] uppercase tracking-wider">Paradox Script</span>
      </div>
      <Editor
        height="calc(100% - 32px)"
        language="paradox"
        theme="vs-dark"
        value={codeContent}
        onChange={(v) => setCodeContent(v ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: 'var(--sf-font-mono)',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
}
