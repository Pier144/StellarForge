// src/renderer/components/portrait-editor/PortraitPreview.tsx
interface Props {
  imageUrl: string | null;
  speciesName: string;
}

export function PortraitPreview({ imageUrl, speciesName }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h4 className="text-xs font-semibold text-[var(--sf-text-secondary)] uppercase tracking-wider">Preview</h4>
      {/* Species selection screen frame mockup */}
      <div className="w-48 h-64 bg-[#1a1a2e] rounded-lg border-2 border-[#2a2a4a] overflow-hidden flex flex-col items-center">
        <div className="w-full h-4 bg-[#2a2a4a] flex items-center justify-center">
          <span className="text-[8px] text-[#8888aa] uppercase">Species</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          {imageUrl ? (
            <img src={imageUrl} alt="Portrait" className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#2a2a4a] flex items-center justify-center text-2xl text-[#4a4a6a]">?</div>
          )}
        </div>
        <div className="w-full py-2 bg-[#2a2a4a] text-center">
          <span className="text-xs text-[#ccccdd]">{speciesName || 'Species Name'}</span>
        </div>
      </div>
    </div>
  );
}
