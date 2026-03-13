// src/renderer/components/settings/GamePathSelector.tsx
import { useState } from 'react';
import { Button } from '../common/Button';
import { useGameDataStore } from '../../stores/gameDataStore';
import { useTranslation } from 'react-i18next';

export function GamePathSelector() {
  const { gamePath, setGamePath, setScanning } = useGameDataStore();
  const [inputPath, setInputPath] = useState(gamePath ?? '');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const { t } = useTranslation();

  const handleBrowse = async () => {
    const path = await window.stellarforge.project.pickDirectory();
    if (path) setInputPath(path);
  };

  const handleVerify = async () => {
    setScanning(true);
    try {
      const result = await window.stellarforge.game.scan(inputPath);
      if (result) { setGamePath(inputPath); setStatus('valid'); }
      else setStatus('invalid');
    } catch { setStatus('invalid'); }
    setScanning(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-xs text-[var(--sf-text-muted)]">{t('settings.gamePath')}</label>
      <div className="flex gap-2">
        <input className="flex-1 bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded px-3 py-2 text-sm text-[var(--sf-text-primary)] font-mono"
          value={inputPath} onChange={e => setInputPath(e.target.value)} placeholder="C:/Program Files/Steam/steamapps/common/Stellaris" />
        <Button variant="secondary" onClick={handleBrowse}>{t('actions.browse', 'Browse')}</Button>
      </div>
      <Button variant="primary" size="sm" onClick={handleVerify}>{t('actions.verify', 'Verify & Scan')}</Button>
      {status === 'valid' && <p className="text-xs text-green-400">{t('settings.gamePathValid', 'Valid Stellaris installation found')}</p>}
      {status === 'invalid' && <p className="text-xs text-red-400">{t('settings.gamePathInvalid', 'Invalid path')}</p>}
    </div>
  );
}
