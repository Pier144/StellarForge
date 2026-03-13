// src/renderer/components/portrait-editor/PortraitEditor.tsx
import { useState } from 'react';
import { StaticPortraitManager } from './StaticPortraitManager';
import { AnimatedPortraitDefs } from './AnimatedPortraitDefs';
import { PortraitPreview } from './PortraitPreview';

type EditorTab = 'static' | 'animated';

interface StaticPortrait {
  id: string;
  name: string;
  path: string;
  thumbnail: string | null;
}

export function PortraitEditor() {
  const [activeTab, setActiveTab] = useState<EditorTab>('static');
  const [portraits, setPortraits] = useState<StaticPortrait[]>([]);
  const [selectedPortraitId, setSelectedPortraitId] = useState<string | null>(null);
  const [speciesName, setSpeciesName] = useState('');
  const [animatedDef, setAnimatedDef] = useState({
    entityName: '',
    meshFile: '',
    idleAnim: 'idle',
    talkAnim: 'talking',
    clothesSlots: [] as string[],
    hairSlots: [] as string[],
  });

  const selectedPortrait = portraits.find(p => p.id === selectedPortraitId);

  const handleAddPortrait = async () => {
    // Would use file picker in real implementation
    const id = `portrait_${Date.now()}`;
    setPortraits(prev => [...prev, { id, name: `Portrait ${prev.length + 1}`, path: '', thumbnail: null }]);
  };

  const handleRemovePortrait = (id: string) => {
    setPortraits(prev => prev.filter(p => p.id !== id));
    if (selectedPortraitId === id) setSelectedPortraitId(null);
  };

  return (
    <div className="flex h-full">
      {/* Editor area */}
      <div className="flex-1 overflow-y-auto">
        {/* Species name */}
        <div className="p-4 border-b border-[var(--sf-border)]">
          <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Species Class Name</label>
          <input className="w-full bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)]"
            value={speciesName} onChange={e => setSpeciesName(e.target.value)} placeholder="e.g., HUMANOID" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--sf-border)]">
          {(['static', 'animated'] as EditorTab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm ${activeTab === tab
                ? 'text-[var(--sf-accent)] border-b-2 border-[var(--sf-accent)]'
                : 'text-[var(--sf-text-muted)] hover:text-[var(--sf-text-secondary)]'
              }`}
            >
              {tab === 'static' ? 'Static Portraits' : 'Animated'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-4">
          {activeTab === 'static' ? (
            <StaticPortraitManager
              portraits={portraits}
              onAdd={handleAddPortrait}
              onRemove={handleRemovePortrait}
              onSelect={setSelectedPortraitId}
              selectedId={selectedPortraitId}
            />
          ) : (
            <AnimatedPortraitDefs definition={animatedDef} onChange={setAnimatedDef} />
          )}
        </div>
      </div>

      {/* Preview panel */}
      <div className="w-64 border-l border-[var(--sf-border)] bg-[var(--sf-bg-secondary)] p-4">
        <PortraitPreview
          imageUrl={selectedPortrait?.thumbnail ?? null}
          speciesName={speciesName}
        />
      </div>
    </div>
  );
}
