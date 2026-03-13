// src/renderer/components/planet-editor/PlanetEditor.tsx
import { useState } from 'react';
import { PlanetPreview } from './PlanetPreview';
import { AtmosphereControls } from './AtmosphereControls';
import { TextureManager } from './TextureManager';
import { CloudLayerEditor } from './CloudLayerEditor';

type PreviewMode = 'day' | 'night' | 'orbit' | 'colony';

export function PlanetEditor() {
  // Planet properties
  const [surfaceColor, setSurfaceColor] = useState('#2d6a4f');
  const [atmosphereColor, setAtmosphereColor] = useState('#60a5fa');
  const [atmosphereIntensity, setAtmosphereIntensity] = useState(1.0);
  const [atmosphereWidth, setAtmosphereWidth] = useState(0.5);
  const [cloudEnabled, setCloudEnabled] = useState(true);
  const [cloudOpacity, setCloudOpacity] = useState(0.6);
  const [cloudRotationSpeed, setCloudRotationSpeed] = useState(1.0);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('day');

  // Textures
  const [surfaceTexture, setSurfaceTexture] = useState<string | null>(null);
  const [normalMap, setNormalMap] = useState<string | null>(null);
  const [specularMap, setSpecularMap] = useState<string | null>(null);

  const modes: { id: PreviewMode; label: string }[] = [
    { id: 'day', label: 'Day Side' },
    { id: 'night', label: 'Night Side' },
    { id: 'orbit', label: 'Orbit View' },
    { id: 'colony', label: 'Colony Sky' },
  ];

  return (
    <div className="flex h-full">
      {/* 3D Preview */}
      <div className="flex-1 flex flex-col">
        <div className="flex gap-1 p-2 bg-[var(--sf-bg-secondary)] border-b border-[var(--sf-border)]">
          {modes.map(m => (
            <button key={m.id} onClick={() => setPreviewMode(m.id)}
              className={`px-3 py-1 text-xs rounded ${previewMode === m.id
                ? 'bg-[var(--sf-accent)] text-white'
                : 'text-[var(--sf-text-muted)] hover:text-[var(--sf-text-secondary)]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <PlanetPreview
            surfaceColor={surfaceColor}
            atmosphereColor={atmosphereColor}
            atmosphereIntensity={atmosphereIntensity}
            atmosphereWidth={atmosphereWidth}
            cloudOpacity={cloudOpacity}
            cloudEnabled={cloudEnabled}
            previewMode={previewMode}
            textureUrl={surfaceTexture ?? undefined}
          />
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-72 border-l border-[var(--sf-border)] bg-[var(--sf-bg-secondary)] overflow-y-auto p-4 space-y-6">
        {/* Surface color */}
        <div>
          <h4 className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider mb-2">Surface</h4>
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Base Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={surfaceColor} onChange={e => setSurfaceColor(e.target.value)}
              className="w-8 h-8 rounded border border-[var(--sf-border)] cursor-pointer" />
            <input className="flex-1 bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-2 py-1 text-xs text-[var(--sf-text-primary)] font-mono"
              value={surfaceColor} onChange={e => setSurfaceColor(e.target.value)} />
          </div>
        </div>

        <TextureManager
          surfaceTexture={surfaceTexture}
          normalMap={normalMap}
          specularMap={specularMap}
          onSurfaceChange={setSurfaceTexture}
          onNormalChange={setNormalMap}
          onSpecularChange={setSpecularMap}
        />

        <AtmosphereControls
          color={atmosphereColor}
          intensity={atmosphereIntensity}
          width={atmosphereWidth}
          onColorChange={setAtmosphereColor}
          onIntensityChange={setAtmosphereIntensity}
          onWidthChange={setAtmosphereWidth}
        />

        <CloudLayerEditor
          enabled={cloudEnabled}
          opacity={cloudOpacity}
          rotationSpeed={cloudRotationSpeed}
          onEnabledChange={setCloudEnabled}
          onOpacityChange={setCloudOpacity}
          onRotationSpeedChange={setCloudRotationSpeed}
        />
      </div>
    </div>
  );
}
