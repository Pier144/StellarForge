export type ThemeId = 'sci-fi' | 'glassmorphism' | 'minimal-dark' | 'aurora' | 'warm-carbon' | 'custom';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  variables: Record<string, string>;
}

let currentStyleEl: HTMLStyleElement | null = null;

export async function loadTheme(themeId: ThemeId): Promise<void> {
  document.querySelectorAll('[data-sf-theme]').forEach(el => el.remove());
  if (themeId === 'custom') return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.setAttribute('data-sf-theme', themeId);
  link.href = `/src/renderer/themes/${themeId}.css`;
  document.head.appendChild(link);
}

export function applyCustomTheme(variables: Record<string, string>): void {
  if (currentStyleEl) currentStyleEl.remove();
  currentStyleEl = document.createElement('style');
  currentStyleEl.setAttribute('data-sf-theme', 'custom');
  const rules = Object.entries(variables).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  currentStyleEl.textContent = `:root {\n${rules}\n}`;
  document.head.appendChild(currentStyleEl);
}

export const AVAILABLE_THEMES: { id: ThemeId; name: string }[] = [
  { id: 'sci-fi', name: 'Sci-Fi Immersive' },
  { id: 'glassmorphism', name: 'Glassmorphism' },
  { id: 'minimal-dark', name: 'Minimal Dark' },
  { id: 'aurora', name: 'Aurora Gradient' },
  { id: 'warm-carbon', name: 'Warm Carbon' },
];
