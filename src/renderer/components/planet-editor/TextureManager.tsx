// src/renderer/components/planet-editor/TextureManager.tsx
import { Button } from '../common/Button';

interface Props {
  surfaceTexture: string | null;
  normalMap: string | null;
  specularMap: string | null;
  onSurfaceChange: (path: string | null) => void;
  onNormalChange: (path: string | null) => void;
  onSpecularChange: (path: string | null) => void;
}

export function TextureManager({ surfaceTexture, normalMap, specularMap, onSurfaceChange, onNormalChange, onSpecularChange }: Props) {
  const handleBrowse = async (setter: (path: string | null) => void) => {
    try {
      const path = await window.stellarforge.project?.pickDirectory?.();
      if (path) setter(path);
    } catch { /* user cancelled */ }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider">Textures</h4>
      {[
        { label: 'Surface', value: surfaceTexture, setter: onSurfaceChange },
        { label: 'Normal Map', value: normalMap, setter: onNormalChange },
        { label: 'Specular Map', value: specularMap, setter: onSpecularChange },
      ].map(slot => (
        <div key={slot.label}>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">{slot.label}</label>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded flex items-center justify-center text-xs text-[var(--sf-text-muted)]">
              {slot.value ? '🖼️' : '—'}
            </div>
            <div className="flex-1 text-xs text-[var(--sf-text-muted)] truncate">{slot.value ?? 'No texture'}</div>
            <Button variant="ghost" size="sm" onClick={() => handleBrowse(slot.setter)}>Browse</Button>
            {slot.value && <Button variant="ghost" size="sm" onClick={() => slot.setter(null)}>×</Button>}
          </div>
        </div>
      ))}
    </div>
  );
}
