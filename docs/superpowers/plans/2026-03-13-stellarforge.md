# StellarForge Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visual, low-code desktop application for creating Stellaris mods with form-based editors, bidirectional code panel, 3D planet editor, event node editor, and one-click mod export.

**Architecture:** Electron shell with React 19 renderer. Main process handles file I/O, game scanning (SQLite), parsing/serializing Paradox script, mod export, and DDS conversion. Renderer provides schema-driven form editors, Monaco code panel, React Flow node editor, Three.js planet viewer, and a Zustand-based state layer with undo/redo.

**Tech Stack:** Electron, React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Monaco Editor, Three.js + @react-three/fiber, React Flow, Zustand, better-sqlite3, sharp, dds.js, react-i18next, steamworks.js, electron-builder

**Spec:** `docs/superpowers/specs/2026-03-13-stellarforge-design.md`

---

## Chunk 1: Foundation & Project Scaffolding

Sets up the Electron + React + Vite + TypeScript project with all dependencies, build configuration, and shared type definitions.

### Task 1.1: Initialize Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `.gitignore`
- Create: `electron-builder.yml`

- [ ] **Step 1: Initialize git repo**

```bash
cd "C:/Users/pierangelo.pancera/Desktop/Programmi Dev/StellarForge"
git init
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "stellarforge",
  "version": "0.1.0",
  "description": "Visual low-code mod editor for Stellaris",
  "main": "dist/main/index.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && electron-builder",
    "preview": "vite preview",
    "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && electron .\"",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src/"
  },
  "author": "",
  "license": "UNLICENSED",
  "private": true
}
```

- [ ] **Step 3: Install core dependencies**

```bash
npm install react@19 react-dom@19 zustand @monaco-editor/react monaco-editor @reactflow/core @reactflow/background @reactflow/controls @reactflow/minimap @react-three/fiber @react-three/drei three framer-motion react-i18next i18next tailwindcss @tailwindcss/vite react-router-dom
```

Expected: packages install successfully

- [ ] **Step 4: Install dev dependencies**

```bash
npm install -D typescript @types/react @types/react-dom @types/three vite @vitejs/plugin-react electron electron-builder concurrently wait-on vitest @testing-library/react @testing-library/jest-dom jsdom eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Expected: packages install successfully

- [ ] **Step 5: Install main process dependencies**

```bash
npm install better-sqlite3 sharp electron-store
npm install -D @types/better-sqlite3
```

Expected: packages install successfully

- [ ] **Step 6: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["src/shared/*"],
      "@renderer/*": ["src/renderer/*"],
      "@main/*": ["src/main/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 7: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist/main",
    "rootDir": "src/main"
  },
  "include": ["src/main", "src/shared", "vite.config.ts"]
}
```

- [ ] **Step 8: Create .gitignore**

```
node_modules/
dist/
.vite/
*.db
*.db-journal
release/
.env
```

- [ ] **Step 9: Create electron-builder.yml**

```yaml
appId: com.stellarforge.app
productName: StellarForge
directories:
  output: release
files:
  - dist/**/*
  - node_modules/**/*
win:
  target: nsis
  icon: build/icon.ico
linux:
  target: AppImage
  icon: build/icon.png
mac:
  target: dmg
  icon: build/icon.icns
```

- [ ] **Step 10: Commit**

```bash
git add package.json tsconfig.json tsconfig.node.json .gitignore electron-builder.yml package-lock.json
git commit -m "chore: initialize project with dependencies and build config"
```

### Task 1.2: Vite & Electron Config

**Files:**
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main/index.ts`
- Create: `src/main/preload.ts`
- Create: `src/renderer/main.tsx`
- Create: `src/renderer/App.tsx`
- Create: `src/renderer/index.css`

- [ ] **Step 1: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    outDir: 'dist/renderer',
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@main': path.resolve(__dirname, 'src/main'),
    },
  },
});
```

- [ ] **Step 2: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
    <title>StellarForge</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/renderer/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Create src/main/index.ts (Electron entry)**

```typescript
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Window control IPC handlers
ipcMain.handle('window:minimize', () => mainWindow?.minimize());
ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.handle('window:close', () => mainWindow?.close());

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

- [ ] **Step 4: Create src/main/preload.ts**

```typescript
import { contextBridge, ipcRenderer } from 'electron';

const api = {
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },
  // Will be extended with project, game, mod, dds channels
};

contextBridge.exposeInMainWorld('stellarforge', api);
```

- [ ] **Step 5: Create src/renderer/index.css**

```css
@import "tailwindcss";

:root {
  --sf-bg-primary: #050810;
  --sf-bg-secondary: #0a0f1e;
  --sf-bg-card: rgba(0, 20, 50, 0.3);
  --sf-border: rgba(0, 200, 255, 0.08);
  --sf-border-active: rgba(0, 200, 255, 0.25);
  --sf-accent: #22d3ee;
  --sf-accent-glow: rgba(0, 200, 255, 0.15);
  --sf-text-primary: #e0f2fe;
  --sf-text-secondary: rgba(150, 200, 255, 0.4);
  --sf-text-muted: rgba(0, 200, 255, 0.3);
  --sf-font-display: 'Orbitron', sans-serif;
  --sf-font-body: 'Inter', sans-serif;
  --sf-font-mono: 'JetBrains Mono', monospace;
  --sf-radius-sm: 6px;
  --sf-radius-md: 10px;
  --sf-radius-lg: 14px;
}

body {
  margin: 0;
  padding: 0;
  background: var(--sf-bg-primary);
  color: var(--sf-text-primary);
  font-family: var(--sf-font-body);
  overflow: hidden;
  -webkit-app-region: no-drag;
}

* {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--sf-border-active);
  border-radius: 3px;
}
```

- [ ] **Step 6: Create src/renderer/main.tsx**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 7: Create src/renderer/App.tsx**

```typescript
export default function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <h1 style={{ fontFamily: 'var(--sf-font-display)', color: 'var(--sf-accent)' }}>
        StellarForge
      </h1>
    </div>
  );
}
```

- [ ] **Step 8: Verify dev server starts**

```bash
npx vite --host
```

Expected: Vite dev server starts on port 5173, browser shows "StellarForge" text

- [ ] **Step 9: Commit**

```bash
git add vite.config.ts index.html src/
git commit -m "feat: add Vite config, Electron entry, and React shell"
```

### Task 1.3: Shared Types

**Files:**
- Create: `src/shared/types/paradox.ts`
- Create: `src/shared/types/project.ts`
- Create: `src/shared/types/gameData.ts`
- Create: `src/shared/types/categories.ts`
- Create: `src/shared/types/ipc.ts`

- [ ] **Step 1: Create src/shared/types/paradox.ts**

```typescript
export interface ParadoxNode {
  key: string;
  operator: '=' | '>' | '<' | '>=' | '<=' | '!=';
  value: ParadoxValue;
  comments?: string[];
  inlineComment?: string;
  sourceLocation?: SourceLocation;
}

export interface SourceLocation {
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
}

export type ParadoxValue =
  | string
  | number
  | boolean
  | ParadoxNode[]
  | ParadoxListValue[]
  | ParadoxColor;

export type ParadoxListValue = string | number;

export interface ParadoxColor {
  type: 'hsv' | 'rgb';
  values: [number, number, number];
}

export interface ParadoxFile {
  nodes: ParadoxNode[];
  variables: Map<string, number>;
}

export interface ParseError {
  message: string;
  line: number;
  column: number;
}

export interface ParseResult {
  file: ParadoxFile;
  errors: ParseError[];
}
```

- [ ] **Step 2: Create src/shared/types/project.ts**

```typescript
export interface ProjectMetadata {
  name: string;
  internalName: string;
  version: string;
  stellarisVersion: string;
  tags: string[];
  thumbnail?: string;
  description: string;
  author: string;
  workshopId?: string;
  dependencies?: string[];
  createdAt: string;
  lastModified: string;
  stellarforgeVersion: string;
}

export interface Project {
  metadata: ProjectMetadata;
  items: Record<string, CategoryItems>;
  localisation: Record<string, Record<string, string>>;
  assets: ProjectAssets;
}

export interface CategoryItems {
  [itemKey: string]: Record<string, unknown>;
}

export interface ProjectAssets {
  icons: AssetEntry[];
  eventPictures: AssetEntry[];
  portraits: AssetEntry[];
  planetTextures: AssetEntry[];
  flags: AssetEntry[];
}

export interface AssetEntry {
  id: string;
  sourcePath: string;
  originalName: string;
  category: string;
}

export interface ExportResult {
  success: boolean;
  outputPath: string;
  warnings: string[];
  errors: string[];
  filesGenerated: number;
}
```

- [ ] **Step 3: Create src/shared/types/gameData.ts**

```typescript
export interface GameDataIndex {
  version: string;
  objectCount: number;
  scanDate: string;
}

export interface GameObject {
  id: number;
  category: string;
  objectKey: string;
  filePath: string;
  parsedData: string;
  dlc: string | null;
}

export interface GameModifier {
  name: string;
  scopes: string[];
  description?: string;
}

export interface GameTrigger {
  name: string;
  scopes: string[];
  parameters?: string;
}

export interface GameEffect {
  name: string;
  scopes: string[];
  parameters?: string;
}

export interface GameScope {
  name: string;
  transitions: Record<string, string[]>;
}

export interface GameIcon {
  gfxKey: string;
  filePath: string;
  category?: string;
}

export interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
}
```

- [ ] **Step 4: Create src/shared/types/categories.ts**

```typescript
export interface CategorySchema {
  category: string;
  gameFolder: string;
  outputPath: string;
  displayName: { en: string; it: string };
  fields: FieldDefinition[];
  validators: ValidatorRule[];
}

export interface FieldDefinition {
  key: string;
  label: { en: string; it: string };
  type: FieldType;
  required: boolean;
  default?: unknown;
  options?: SelectOption[];
  referenceCategory?: string;
  tooltip?: { en: string; it: string };
  group?: string;
  condition?: FieldCondition;
}

export type FieldType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'modifier-list'
  | 'trigger-block'
  | 'effect-block'
  | 'icon'
  | 'color'
  | 'reference'
  | 'event-options'
  | 'resource-block';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldCondition {
  field: string;
  value: unknown;
}

export interface ValidatorRule {
  rule: string;
  params: Record<string, unknown>;
}

export interface ValidationResult {
  level: 'error' | 'warning' | 'info';
  message: string;
  category?: string;
  itemKey?: string;
  field?: string;
  line?: number;
}

export type CategoryGroup =
  | 'empire'
  | 'economy'
  | 'tech'
  | 'military'
  | 'exploration'
  | 'scripting'
  | 'graphics'
  | 'localisation';

export interface CategoryMeta {
  category: string;
  group: CategoryGroup;
  displayName: { en: string; it: string };
  icon: string;
}
```

- [ ] **Step 5: Create src/shared/types/ipc.ts**

```typescript
import type { Project, ExportResult } from './project';
import type { GameDataIndex, FileEntry } from './gameData';
import type { ValidationResult } from './categories';

export interface WorkshopMeta {
  title: string;
  description: string;
  visibility: 'public' | 'friends' | 'private';
  tags: string[];
  changelog?: string;
}

export interface IPCChannels {
  'project:save': (project: Project) => Promise<void>;
  'project:load': (path: string) => Promise<Project>;
  'project:export-sfproj': (path: string) => Promise<void>;
  'project:import-sfproj': (path: string) => Promise<Project>;
  'game:scan': (gamePath: string) => Promise<GameDataIndex>;
  'game:get-version': (gamePath: string) => Promise<string>;
  'mod:export': (project: Project, outputPath: string) => Promise<ExportResult>;
  'mod:validate': (project: Project) => Promise<ValidationResult[]>;
  'mod:generate-tests': (project: Project) => Promise<string[]>;
  'workshop:upload': (modPath: string, metadata: WorkshopMeta) => Promise<void>;
  'workshop:update': (workshopId: string, modPath: string) => Promise<void>;
  'dds:convert-to': (inputPath: string, outputPath: string) => Promise<void>;
  'dds:convert-from': (ddsPath: string, outputPath: string) => Promise<void>;
  'fs:read-file': (path: string) => Promise<string>;
  'fs:write-file': (path: string, content: string) => Promise<void>;
  'fs:list-dir': (path: string) => Promise<FileEntry[]>;
}

// Type-safe preload API
export interface StellarForgeAPI {
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
  };
  project: {
    save: (project: Project) => Promise<void>;
    load: (path: string) => Promise<Project>;
    exportSfproj: (path: string) => Promise<void>;
    importSfproj: (path: string) => Promise<Project>;
  };
  game: {
    scan: (gamePath: string) => Promise<GameDataIndex>;
    getVersion: (gamePath: string) => Promise<string>;
  };
  mod: {
    export: (project: Project, outputPath: string) => Promise<ExportResult>;
    validate: (project: Project) => Promise<ValidationResult[]>;
    generateTests: (project: Project) => Promise<string[]>;
  };
  fs: {
    readFile: (path: string) => Promise<string>;
    writeFile: (path: string, content: string) => Promise<void>;
    listDir: (path: string) => Promise<FileEntry[]>;
  };
}

declare global {
  interface Window {
    stellarforge: StellarForgeAPI;
  }
}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 7: Commit**

```bash
git add src/shared/
git commit -m "feat: add shared type definitions for Paradox AST, project, game data, categories, and IPC"
```

### Task 1.4: Vitest Setup

**Files:**
- Create: `vitest.config.ts`
- Create: `src/shared/__tests__/types.test.ts`

- [ ] **Step 1: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    include: ['src/**/__tests__/**/*.test.ts', 'src/**/__tests__/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@main': path.resolve(__dirname, 'src/main'),
    },
  },
});
```

- [ ] **Step 2: Create src/shared/__tests__/types.test.ts**

```typescript
import { describe, it, expect } from 'vitest';
import type { ParadoxNode, ParadoxColor, ParadoxFile } from '../types/paradox';
import type { ProjectMetadata } from '../types/project';
import type { CategorySchema, FieldDefinition } from '../types/categories';

describe('Shared types compile correctly', () => {
  it('ParadoxNode accepts valid structures', () => {
    const node: ParadoxNode = {
      key: 'trait_intelligent',
      operator: '=',
      value: [
        { key: 'cost', operator: '=', value: 2 },
        { key: 'modifier', operator: '=', value: [
          { key: 'planet_researchers_produces_mult', operator: '=', value: 0.1 }
        ]},
      ],
    };
    expect(node.key).toBe('trait_intelligent');
  });

  it('ParadoxColor holds HSV values', () => {
    const color: ParadoxColor = { type: 'hsv', values: [0.5, 0.8, 0.9] };
    expect(color.type).toBe('hsv');
    expect(color.values).toHaveLength(3);
  });

  it('ProjectMetadata has required fields', () => {
    const meta: ProjectMetadata = {
      name: 'Test Mod',
      internalName: 'test_mod',
      version: '1.0.0',
      stellarisVersion: '3.12.*',
      tags: ['Gameplay'],
      description: 'A test mod',
      author: 'Tester',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      stellarforgeVersion: '0.1.0',
    };
    expect(meta.name).toBe('Test Mod');
  });

  it('FieldDefinition supports all field types', () => {
    const field: FieldDefinition = {
      key: 'test',
      label: { en: 'Test', it: 'Test' },
      type: 'trigger-block',
      required: false,
      group: 'conditions',
    };
    expect(field.type).toBe('trigger-block');
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run
```

Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts src/shared/__tests__/
git commit -m "feat: add Vitest config and type compilation tests"
```

---

## Chunk 2: Core Engine — Paradox Parser & Serializer

The parser and serializer are the backbone of StellarForge. Everything — game scanning, code panel sync, mod export — depends on them. TDD approach: write tests from real Stellaris syntax, then implement.

### Task 2.1: Paradox Tokenizer

**Files:**
- Create: `src/main/services/ParadoxTokenizer.ts`
- Create: `src/main/services/__tests__/ParadoxTokenizer.test.ts`

- [ ] **Step 1: Write failing tokenizer tests**

```typescript
// src/main/services/__tests__/ParadoxTokenizer.test.ts
import { describe, it, expect } from 'vitest';
import { tokenize, TokenType } from '../ParadoxTokenizer';

describe('ParadoxTokenizer', () => {
  it('tokenizes simple key = value', () => {
    const tokens = tokenize('name = "Test"');
    expect(tokens).toEqual([
      { type: TokenType.Identifier, value: 'name', line: 1, col: 1 },
      { type: TokenType.Operator, value: '=', line: 1, col: 6 },
      { type: TokenType.QuotedString, value: 'Test', line: 1, col: 8 },
    ]);
  });

  it('tokenizes numbers (int and float)', () => {
    const tokens = tokenize('cost = 2\nweight = 0.5');
    expect(tokens[2].type).toBe(TokenType.Number);
    expect(tokens[2].value).toBe('2');
    expect(tokens[5].type).toBe(TokenType.Number);
    expect(tokens[5].value).toBe('0.5');
  });

  it('tokenizes negative numbers', () => {
    const tokens = tokenize('cost = -3');
    expect(tokens[2].type).toBe(TokenType.Number);
    expect(tokens[2].value).toBe('-3');
  });

  it('tokenizes yes/no as booleans', () => {
    const tokens = tokenize('initial = yes\nrandomized = no');
    expect(tokens[2]).toEqual(expect.objectContaining({ type: TokenType.Boolean, value: 'yes' }));
    expect(tokens[5]).toEqual(expect.objectContaining({ type: TokenType.Boolean, value: 'no' }));
  });

  it('tokenizes braces', () => {
    const tokens = tokenize('modifier = { }');
    expect(tokens[2].type).toBe(TokenType.OpenBrace);
    expect(tokens[3].type).toBe(TokenType.CloseBrace);
  });

  it('tokenizes comparison operators', () => {
    const tokens = tokenize('num_pops > 10\ncount >= 5\nvalue != 0\namount < 3\nlevel <= 2');
    expect(tokens[1].value).toBe('>');
    expect(tokens[4].value).toBe('>=');
    expect(tokens[7].value).toBe('!=');
    expect(tokens[10].value).toBe('<');
    expect(tokens[13].value).toBe('<=');
  });

  it('tokenizes @variables', () => {
    const tokens = tokenize('@cost = 100\ncost = @cost');
    expect(tokens[0]).toEqual(expect.objectContaining({ type: TokenType.Variable, value: '@cost' }));
    expect(tokens[5]).toEqual(expect.objectContaining({ type: TokenType.Variable, value: '@cost' }));
  });

  it('tokenizes comments', () => {
    const tokens = tokenize('# This is a comment\nname = "Test"');
    expect(tokens[0]).toEqual(expect.objectContaining({ type: TokenType.Comment, value: ' This is a comment' }));
  });

  it('tokenizes inline comments', () => {
    const tokens = tokenize('cost = 2 # inline comment');
    expect(tokens[3]).toEqual(expect.objectContaining({ type: TokenType.Comment, value: ' inline comment' }));
  });

  it('tokenizes hsv color', () => {
    const tokens = tokenize('color = hsv { 0.5 0.8 0.9 }');
    expect(tokens[2]).toEqual(expect.objectContaining({ type: TokenType.Identifier, value: 'hsv' }));
  });

  it('tokenizes rgb color', () => {
    const tokens = tokenize('color = rgb { 255 128 0 }');
    expect(tokens[2]).toEqual(expect.objectContaining({ type: TokenType.Identifier, value: 'rgb' }));
  });

  it('handles multiline blocks', () => {
    const input = `trait_intelligent = {
  cost = 2
  modifier = {
    planet_researchers_produces_mult = 0.10
  }
}`;
    const tokens = tokenize(input);
    const identifiers = tokens.filter(t => t.type === TokenType.Identifier);
    expect(identifiers.map(t => t.value)).toContain('trait_intelligent');
    expect(identifiers.map(t => t.value)).toContain('planet_researchers_produces_mult');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/main/services/__tests__/ParadoxTokenizer.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement ParadoxTokenizer**

```typescript
// src/main/services/ParadoxTokenizer.ts
export enum TokenType {
  Identifier = 'Identifier',
  QuotedString = 'QuotedString',
  Number = 'Number',
  Boolean = 'Boolean',
  Operator = 'Operator',
  OpenBrace = 'OpenBrace',
  CloseBrace = 'CloseBrace',
  Variable = 'Variable',
  Comment = 'Comment',
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let col = 1;

  while (pos < input.length) {
    const ch = input[pos];

    // Skip whitespace (not newlines)
    if (ch === ' ' || ch === '\t' || ch === '\r') {
      pos++;
      col++;
      continue;
    }

    // Newlines
    if (ch === '\n') {
      pos++;
      line++;
      col = 1;
      continue;
    }

    // Comments
    if (ch === '#') {
      const startCol = col;
      pos++; // skip #
      col++;
      let comment = '';
      while (pos < input.length && input[pos] !== '\n') {
        comment += input[pos];
        pos++;
        col++;
      }
      tokens.push({ type: TokenType.Comment, value: comment, line, col: startCol });
      continue;
    }

    // Braces
    if (ch === '{') {
      tokens.push({ type: TokenType.OpenBrace, value: '{', line, col });
      pos++;
      col++;
      continue;
    }
    if (ch === '}') {
      tokens.push({ type: TokenType.CloseBrace, value: '}', line, col });
      pos++;
      col++;
      continue;
    }

    // Operators: >=, <=, !=, >, <, =
    if (ch === '>' || ch === '<' || ch === '!' || ch === '=') {
      const startCol = col;
      if ((ch === '>' || ch === '<' || ch === '!') && pos + 1 < input.length && input[pos + 1] === '=') {
        tokens.push({ type: TokenType.Operator, value: ch + '=', line, col: startCol });
        pos += 2;
        col += 2;
        continue;
      }
      tokens.push({ type: TokenType.Operator, value: ch, line, col: startCol });
      pos++;
      col++;
      continue;
    }

    // Quoted strings
    if (ch === '"') {
      const startCol = col;
      pos++; // skip opening quote
      col++;
      let str = '';
      while (pos < input.length && input[pos] !== '"') {
        if (input[pos] === '\\' && pos + 1 < input.length) {
          str += input[pos + 1];
          pos += 2;
          col += 2;
        } else {
          if (input[pos] === '\n') { line++; col = 0; }
          str += input[pos];
          pos++;
          col++;
        }
      }
      if (pos < input.length) { pos++; col++; } // skip closing quote
      tokens.push({ type: TokenType.QuotedString, value: str, line, col: startCol });
      continue;
    }

    // @variables
    if (ch === '@') {
      const startCol = col;
      let varName = '@';
      pos++;
      col++;
      while (pos < input.length && /[a-zA-Z0-9_]/.test(input[pos])) {
        varName += input[pos];
        pos++;
        col++;
      }
      tokens.push({ type: TokenType.Variable, value: varName, line, col: startCol });
      continue;
    }

    // Numbers (including negative)
    if (/[0-9]/.test(ch) || (ch === '-' && pos + 1 < input.length && /[0-9]/.test(input[pos + 1]))) {
      const startCol = col;
      let num = '';
      if (ch === '-') { num = '-'; pos++; col++; }
      while (pos < input.length && /[0-9.]/.test(input[pos])) {
        num += input[pos];
        pos++;
        col++;
      }
      // Check it's not followed by identifier chars (would make it an identifier)
      if (pos < input.length && /[a-zA-Z_]/.test(input[pos])) {
        // It's actually an identifier starting with digits — rare but handle it
        let ident = num;
        while (pos < input.length && /[a-zA-Z0-9_.\-:]/.test(input[pos])) {
          ident += input[pos];
          pos++;
          col++;
        }
        tokens.push({ type: TokenType.Identifier, value: ident, line, col: startCol });
      } else {
        tokens.push({ type: TokenType.Number, value: num, line, col: startCol });
      }
      continue;
    }

    // Identifiers (and yes/no booleans)
    if (/[a-zA-Z_]/.test(ch)) {
      const startCol = col;
      let ident = '';
      while (pos < input.length && /[a-zA-Z0-9_.\-:]/.test(input[pos])) {
        ident += input[pos];
        pos++;
        col++;
      }
      if (ident === 'yes' || ident === 'no') {
        tokens.push({ type: TokenType.Boolean, value: ident, line, col: startCol });
      } else {
        tokens.push({ type: TokenType.Identifier, value: ident, line, col: startCol });
      }
      continue;
    }

    // Unknown character — skip
    pos++;
    col++;
  }

  return tokens;
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/main/services/__tests__/ParadoxTokenizer.test.ts
```

Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/main/services/ParadoxTokenizer.ts src/main/services/__tests__/ParadoxTokenizer.test.ts
git commit -m "feat: implement Paradox script tokenizer with full test coverage"
```

### Task 2.2: Paradox Parser

**Files:**
- Create: `src/main/services/ParadoxParser.ts`
- Create: `src/main/services/__tests__/ParadoxParser.test.ts`

- [ ] **Step 1: Write failing parser tests**

```typescript
// src/main/services/__tests__/ParadoxParser.test.ts
import { describe, it, expect } from 'vitest';
import { parse } from '../ParadoxParser';

describe('ParadoxParser', () => {
  it('parses simple key = string', () => {
    const result = parse('name = "Test Mod"');
    expect(result.errors).toHaveLength(0);
    expect(result.file.nodes).toHaveLength(1);
    expect(result.file.nodes[0]).toEqual(expect.objectContaining({
      key: 'name',
      operator: '=',
      value: 'Test Mod',
    }));
  });

  it('parses key = number', () => {
    const result = parse('cost = 2');
    expect(result.file.nodes[0].value).toBe(2);
  });

  it('parses key = float', () => {
    const result = parse('weight = 0.5');
    expect(result.file.nodes[0].value).toBe(0.5);
  });

  it('parses key = boolean (yes/no)', () => {
    const result = parse('initial = yes');
    expect(result.file.nodes[0].value).toBe(true);
  });

  it('parses nested block', () => {
    const result = parse(`trait_intelligent = {
  cost = 2
  initial = yes
}`);
    expect(result.errors).toHaveLength(0);
    const trait = result.file.nodes[0];
    expect(trait.key).toBe('trait_intelligent');
    expect(Array.isArray(trait.value)).toBe(true);
    const children = trait.value as any[];
    expect(children).toHaveLength(2);
    expect(children[0]).toEqual(expect.objectContaining({ key: 'cost', value: 2 }));
    expect(children[1]).toEqual(expect.objectContaining({ key: 'initial', value: true }));
  });

  it('parses comparison operators', () => {
    const result = parse('num_pops > 10');
    expect(result.file.nodes[0].operator).toBe('>');
    expect(result.file.nodes[0].value).toBe(10);
  });

  it('parses @variable definitions', () => {
    const result = parse('@base_cost = 100');
    expect(result.file.variables.get('@base_cost')).toBe(100);
  });

  it('parses hsv color', () => {
    const result = parse('color = hsv { 0.5 0.8 0.9 }');
    expect(result.file.nodes[0].value).toEqual({
      type: 'hsv',
      values: [0.5, 0.8, 0.9],
    });
  });

  it('parses rgb color', () => {
    const result = parse('color = rgb { 255 128 0 }');
    expect(result.file.nodes[0].value).toEqual({
      type: 'rgb',
      values: [255, 128, 0],
    });
  });

  it('parses value list (unkeyed list)', () => {
    const result = parse('allowed_archetypes = { BIOLOGICAL LITHOID MACHINE }');
    const node = result.file.nodes[0];
    expect(node.value).toEqual(['BIOLOGICAL', 'LITHOID', 'MACHINE']);
  });

  it('preserves comments', () => {
    const result = parse(`# This is a trait
trait_smart = {
  cost = 1
}`);
    expect(result.file.nodes[0].comments).toContain(' This is a trait');
  });

  it('preserves inline comments', () => {
    const result = parse('cost = 2 # trait point cost');
    expect(result.file.nodes[0].inlineComment).toBe(' trait point cost');
  });

  it('tracks source locations', () => {
    const result = parse('cost = 2');
    const loc = result.file.nodes[0].sourceLocation;
    expect(loc).toBeDefined();
    expect(loc!.startLine).toBe(1);
  });

  it('handles deeply nested structures', () => {
    const result = parse(`country_event = {
  id = test.1
  trigger = {
    is_at_war = yes
    any_owned_planet = {
      num_pops > 10
    }
  }
  option = {
    name = "OK"
    add_resource = {
      energy = 100
    }
  }
}`);
    expect(result.errors).toHaveLength(0);
    const event = result.file.nodes[0];
    expect(event.key).toBe('country_event');
  });

  it('recovers from syntax errors', () => {
    const result = parse(`trait_one = {
  cost = 2
}
= broken
trait_two = {
  cost = 3
}`);
    expect(result.errors.length).toBeGreaterThan(0);
    // Should still parse trait_two despite error
    const keys = result.file.nodes.map(n => n.key);
    expect(keys).toContain('trait_one');
    expect(keys).toContain('trait_two');
  });

  it('parses real Stellaris trait syntax', () => {
    const input = `trait_intelligent = {
	cost = 2
	opposites = { "trait_nerve_stapled" "trait_presapient_proles" }
	allowed_archetypes = { BIOLOGICAL LITHOID }
	modifier = {
		planet_researchers_produces_mult = 0.10
	}
	slave_cost = {
		energy = 500
	}
}`;
    const result = parse(input);
    expect(result.errors).toHaveLength(0);
    const trait = result.file.nodes[0];
    expect(trait.key).toBe('trait_intelligent');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/main/services/__tests__/ParadoxParser.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement ParadoxParser**

```typescript
// src/main/services/ParadoxParser.ts
import { tokenize, Token, TokenType } from './ParadoxTokenizer';
import type {
  ParadoxNode, ParadoxFile, ParadoxValue, ParadoxColor,
  ParadoxListValue, ParseError, ParseResult, SourceLocation,
} from '@shared/types/paradox';

export function parse(input: string): ParseResult {
  const tokens = tokenize(input);
  const errors: ParseError[] = [];
  const variables = new Map<string, number>();
  let pos = 0;

  function peek(): Token | undefined {
    return tokens[pos];
  }

  function advance(): Token {
    return tokens[pos++];
  }

  function isAtEnd(): boolean {
    return pos >= tokens.length;
  }

  function collectComments(): string[] {
    const comments: string[] = [];
    while (!isAtEnd() && peek()!.type === TokenType.Comment) {
      comments.push(advance().value);
    }
    return comments;
  }

  function parseValue(): ParadoxValue {
    const token = peek()!;

    // hsv { } or rgb { }
    if (token.type === TokenType.Identifier && (token.value === 'hsv' || token.value === 'rgb')) {
      const colorType = token.value as 'hsv' | 'rgb';
      advance(); // consume hsv/rgb
      if (peek()?.type === TokenType.OpenBrace) {
        advance(); // consume {
        const values: number[] = [];
        while (!isAtEnd() && peek()!.type !== TokenType.CloseBrace) {
          if (peek()!.type === TokenType.Number) {
            values.push(parseFloat(advance().value));
          } else {
            advance(); // skip unexpected tokens
          }
        }
        if (peek()?.type === TokenType.CloseBrace) advance(); // consume }
        return { type: colorType, values: values.slice(0, 3) as [number, number, number] } satisfies ParadoxColor;
      }
    }

    // Block { ... }
    if (token.type === TokenType.OpenBrace) {
      advance(); // consume {
      return parseBlock();
    }

    // Quoted string
    if (token.type === TokenType.QuotedString) {
      return advance().value;
    }

    // Number
    if (token.type === TokenType.Number) {
      const val = advance().value;
      return val.includes('.') ? parseFloat(val) : parseInt(val, 10);
    }

    // Boolean
    if (token.type === TokenType.Boolean) {
      return advance().value === 'yes';
    }

    // Variable reference
    if (token.type === TokenType.Variable) {
      return advance().value;
    }

    // Unquoted identifier as string value
    if (token.type === TokenType.Identifier) {
      return advance().value;
    }

    // Fallback
    return advance().value;
  }

  function parseBlock(): ParadoxValue {
    // Look ahead to determine if this is a value list or a keyed block
    // Value list: { item1 item2 item3 } — no operators
    // Keyed block: { key = value key2 = value2 } — has operators

    const savedPos = pos;
    let hasOperator = false;
    let depth = 0;

    // Scan ahead to check structure
    for (let i = pos; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.type === TokenType.OpenBrace) depth++;
      if (t.type === TokenType.CloseBrace) {
        if (depth === 0) break;
        depth--;
      }
      if (depth === 0 && t.type === TokenType.Operator) {
        hasOperator = true;
        break;
      }
    }

    if (!hasOperator) {
      // Value list
      const items: ParadoxListValue[] = [];
      while (!isAtEnd() && peek()!.type !== TokenType.CloseBrace) {
        const t = peek()!;
        if (t.type === TokenType.Comment) { advance(); continue; }
        if (t.type === TokenType.QuotedString) { items.push(advance().value); continue; }
        if (t.type === TokenType.Number) {
          const val = advance().value;
          items.push(val.includes('.') ? parseFloat(val) : parseInt(val, 10));
          continue;
        }
        if (t.type === TokenType.Identifier || t.type === TokenType.Boolean) {
          items.push(advance().value);
          continue;
        }
        advance(); // skip unexpected
      }
      if (peek()?.type === TokenType.CloseBrace) advance();
      return items;
    }

    // Keyed block
    const nodes: ParadoxNode[] = [];
    while (!isAtEnd() && peek()!.type !== TokenType.CloseBrace) {
      const node = parseNode();
      if (node) nodes.push(node);
    }
    if (peek()?.type === TokenType.CloseBrace) advance();
    return nodes;
  }

  function parseNode(): ParadoxNode | null {
    const comments = collectComments();

    if (isAtEnd() || peek()!.type === TokenType.CloseBrace) return null;

    const keyToken = peek()!;
    const startLine = keyToken.line;
    const startCol = keyToken.col;

    // Variable definition: @var = number
    if (keyToken.type === TokenType.Variable) {
      const varName = advance().value;
      if (peek()?.type === TokenType.Operator && peek()!.value === '=') {
        advance(); // consume =
        if (peek()?.type === TokenType.Number) {
          const val = advance().value;
          const numVal = val.includes('.') ? parseFloat(val) : parseInt(val, 10);
          variables.set(varName, numVal);
        }
      }
      return null; // Variables are stored separately, not as nodes
    }

    // Must have identifier or quoted string as key
    if (keyToken.type !== TokenType.Identifier && keyToken.type !== TokenType.QuotedString) {
      errors.push({ message: `Unexpected token: ${keyToken.value}`, line: keyToken.line, column: keyToken.col });
      advance(); // skip
      return null;
    }

    const key = advance().value;

    // Must have operator
    if (isAtEnd() || peek()!.type !== TokenType.Operator) {
      errors.push({ message: `Expected operator after "${key}"`, line: startLine, column: startCol });
      return null;
    }

    const operator = advance().value as ParadoxNode['operator'];
    const value = parseValue();

    // Check for inline comment
    let inlineComment: string | undefined;
    if (!isAtEnd() && peek()!.type === TokenType.Comment && peek()!.line === startLine) {
      inlineComment = advance().value;
    }

    const endLine = tokens[pos - 1]?.line ?? startLine;
    const endCol = tokens[pos - 1]?.col ?? startCol;

    const node: ParadoxNode = {
      key,
      operator,
      value,
      sourceLocation: { startLine, startCol, endLine, endCol },
    };

    if (comments.length > 0) node.comments = comments;
    if (inlineComment) node.inlineComment = inlineComment;

    return node;
  }

  // Parse top-level nodes
  const nodes: ParadoxNode[] = [];
  while (!isAtEnd()) {
    const node = parseNode();
    if (node) nodes.push(node);
  }

  return {
    file: { nodes, variables },
    errors,
  };
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/main/services/__tests__/ParadoxParser.test.ts
```

Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/main/services/ParadoxParser.ts src/main/services/__tests__/ParadoxParser.test.ts
git commit -m "feat: implement Paradox script parser with recursive descent, comments, source locations"
```

### Task 2.3: Paradox Serializer

**Files:**
- Create: `src/main/services/ParadoxSerializer.ts`
- Create: `src/main/services/__tests__/ParadoxSerializer.test.ts`

- [ ] **Step 1: Write failing serializer tests**

```typescript
// src/main/services/__tests__/ParadoxSerializer.test.ts
import { describe, it, expect } from 'vitest';
import { serialize } from '../ParadoxSerializer';
import { parse } from '../ParadoxParser';
import type { ParadoxNode } from '@shared/types/paradox';

describe('ParadoxSerializer', () => {
  it('serializes simple key = string', () => {
    const nodes: ParadoxNode[] = [
      { key: 'name', operator: '=', value: 'Test Mod' },
    ];
    expect(serialize(nodes)).toBe('name = "Test Mod"\n');
  });

  it('serializes key = number', () => {
    const nodes: ParadoxNode[] = [
      { key: 'cost', operator: '=', value: 2 },
    ];
    expect(serialize(nodes)).toBe('cost = 2\n');
  });

  it('serializes key = float', () => {
    const nodes: ParadoxNode[] = [
      { key: 'weight', operator: '=', value: 0.5 },
    ];
    expect(serialize(nodes)).toBe('weight = 0.5\n');
  });

  it('serializes key = boolean', () => {
    const nodes: ParadoxNode[] = [
      { key: 'initial', operator: '=', value: true },
    ];
    expect(serialize(nodes)).toBe('initial = yes\n');
  });

  it('serializes nested blocks with indentation', () => {
    const nodes: ParadoxNode[] = [
      {
        key: 'trait_smart', operator: '=', value: [
          { key: 'cost', operator: '=', value: 2 },
          { key: 'initial', operator: '=', value: true },
        ],
      },
    ];
    const expected = `trait_smart = {\n\tcost = 2\n\tinitial = yes\n}\n`;
    expect(serialize(nodes)).toBe(expected);
  });

  it('serializes value lists', () => {
    const nodes: ParadoxNode[] = [
      { key: 'allowed_archetypes', operator: '=', value: ['BIOLOGICAL', 'LITHOID'] },
    ];
    expect(serialize(nodes)).toBe('allowed_archetypes = { BIOLOGICAL LITHOID }\n');
  });

  it('serializes hsv colors', () => {
    const nodes: ParadoxNode[] = [
      { key: 'color', operator: '=', value: { type: 'hsv' as const, values: [0.5, 0.8, 0.9] as [number, number, number] } },
    ];
    expect(serialize(nodes)).toBe('color = hsv { 0.5 0.8 0.9 }\n');
  });

  it('serializes comparison operators', () => {
    const nodes: ParadoxNode[] = [
      { key: 'num_pops', operator: '>', value: 10 },
    ];
    expect(serialize(nodes)).toBe('num_pops > 10\n');
  });

  it('preserves comments', () => {
    const nodes: ParadoxNode[] = [
      { key: 'cost', operator: '=', value: 2, comments: [' This is the cost'] },
    ];
    expect(serialize(nodes)).toBe('# This is the cost\ncost = 2\n');
  });

  it('preserves inline comments', () => {
    const nodes: ParadoxNode[] = [
      { key: 'cost', operator: '=', value: 2, inlineComment: ' point cost' },
    ];
    expect(serialize(nodes)).toBe('cost = 2 # point cost\n');
  });

  it('round-trips: parse then serialize produces equivalent output', () => {
    const original = `trait_intelligent = {
\tcost = 2
\tallowed_archetypes = { BIOLOGICAL LITHOID }
\tmodifier = {
\t\tplanet_researchers_produces_mult = 0.10
\t}
}
`;
    const parsed = parse(original);
    const serialized = serialize(parsed.file.nodes);
    const reparsed = parse(serialized);
    expect(reparsed.errors).toHaveLength(0);
    expect(reparsed.file.nodes[0].key).toBe('trait_intelligent');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/main/services/__tests__/ParadoxSerializer.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement ParadoxSerializer**

```typescript
// src/main/services/ParadoxSerializer.ts
import type { ParadoxNode, ParadoxValue, ParadoxColor, ParadoxListValue } from '@shared/types/paradox';

export interface SerializeOptions {
  indent?: string; // default '\t'
  bom?: boolean;   // add UTF-8 BOM (for localisation files)
}

export function serialize(nodes: ParadoxNode[], options: SerializeOptions = {}): string {
  const indent = options.indent ?? '\t';
  let output = '';
  if (options.bom) output = '\uFEFF';

  output += serializeNodes(nodes, 0, indent);
  return output;
}

function serializeNodes(nodes: ParadoxNode[], depth: number, indent: string): string {
  let output = '';
  for (const node of nodes) {
    output += serializeNode(node, depth, indent);
  }
  return output;
}

function serializeNode(node: ParadoxNode, depth: number, indent: string): string {
  let output = '';
  const prefix = indent.repeat(depth);

  // Comments before the node
  if (node.comments) {
    for (const comment of node.comments) {
      output += `${prefix}#${comment}\n`;
    }
  }

  output += `${prefix}${node.key} ${node.operator} `;
  output += serializeValue(node.value, depth, indent);

  // Inline comment
  if (node.inlineComment) {
    // Remove trailing newline, add comment, re-add newline
    output = output.trimEnd() + ` #${node.inlineComment}\n`;
  }

  return output;
}

function serializeValue(value: ParadoxValue, depth: number, indent: string): string {
  if (typeof value === 'boolean') {
    return `${value ? 'yes' : 'no'}\n`;
  }

  if (typeof value === 'number') {
    return `${value}\n`;
  }

  if (typeof value === 'string') {
    // Quote strings that contain spaces or are not simple identifiers
    if (/^[a-zA-Z_][a-zA-Z0-9_.:\-]*$/.test(value) && value !== 'yes' && value !== 'no') {
      return `${value}\n`;
    }
    return `"${value}"\n`;
  }

  // Color
  if (isColor(value)) {
    return `${value.type} { ${value.values.join(' ')} }\n`;
  }

  // Array: either ParadoxNode[] (keyed block) or ParadoxListValue[] (value list)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '{ }\n';
    }

    // Check if it's a list of ParadoxNode (has .key property)
    if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null && 'key' in value[0]) {
      // Keyed block
      let output = '{\n';
      output += serializeNodes(value as ParadoxNode[], depth + 1, indent);
      output += `${indent.repeat(depth)}}\n`;
      return output;
    }

    // Value list — inline
    const items = (value as ParadoxListValue[]).map(item => {
      if (typeof item === 'string') {
        if (/^[a-zA-Z_][a-zA-Z0-9_.:\-]*$/.test(item)) return item;
        return `"${item}"`;
      }
      return String(item);
    });
    return `{ ${items.join(' ')} }\n`;
  }

  return `${String(value)}\n`;
}

function isColor(value: unknown): value is ParadoxColor {
  return typeof value === 'object' && value !== null && 'type' in value && 'values' in value
    && ((value as ParadoxColor).type === 'hsv' || (value as ParadoxColor).type === 'rgb');
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/main/services/__tests__/ParadoxSerializer.test.ts
```

Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/main/services/ParadoxSerializer.ts src/main/services/__tests__/ParadoxSerializer.test.ts
git commit -m "feat: implement Paradox script serializer with round-trip fidelity"
```

---

## Chunk 3: Data Layer — SQLite, Game Scanner, Project Manager

### Task 3.1: SQLite Database Setup

**Files:**
- Create: `src/main/db/GameDataIndex.ts`
- Create: `src/main/db/__tests__/GameDataIndex.test.ts`

- [ ] **Step 1: Write failing database tests**

```typescript
// src/main/db/__tests__/GameDataIndex.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameDataDb } from '../GameDataIndex';
import path from 'path';
import fs from 'fs';

const TEST_DB = path.join(__dirname, 'test_gamedata.db');

describe('GameDataDb', () => {
  let db: GameDataDb;

  beforeEach(() => {
    db = new GameDataDb(TEST_DB);
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
  });

  it('creates tables on init', () => {
    const tables = db.listTables();
    expect(tables).toContain('game_objects');
    expect(tables).toContain('modifiers');
    expect(tables).toContain('triggers');
    expect(tables).toContain('effects');
    expect(tables).toContain('localisation');
    expect(tables).toContain('icons');
  });

  it('inserts and retrieves a game object', () => {
    db.insertGameObject({
      category: 'trait',
      objectKey: 'trait_intelligent',
      filePath: 'common/traits/00_traits.txt',
      parsedData: '{"key":"trait_intelligent"}',
      dlc: null,
    });
    const result = db.getObjectsByCategory('trait');
    expect(result).toHaveLength(1);
    expect(result[0].objectKey).toBe('trait_intelligent');
  });

  it('searches objects by key prefix', () => {
    db.insertGameObject({ category: 'trait', objectKey: 'trait_intelligent', filePath: 'f', parsedData: '{}', dlc: null });
    db.insertGameObject({ category: 'trait', objectKey: 'trait_strong', filePath: 'f', parsedData: '{}', dlc: null });
    db.insertGameObject({ category: 'technology', objectKey: 'tech_lasers_1', filePath: 'f', parsedData: '{}', dlc: null });
    const results = db.searchObjects('trait_');
    expect(results).toHaveLength(2);
  });

  it('inserts and retrieves localisation', () => {
    db.insertLocalisation('trait_intelligent', 'l_english', 'Intelligent');
    db.insertLocalisation('trait_intelligent', 'l_italian', 'Intelligente');
    const en = db.getLocalisation('trait_intelligent', 'l_english');
    expect(en).toBe('Intelligent');
  });

  it('clears all data', () => {
    db.insertGameObject({ category: 'trait', objectKey: 'test', filePath: 'f', parsedData: '{}', dlc: null });
    db.clearAll();
    expect(db.getObjectsByCategory('trait')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/main/db/__tests__/GameDataIndex.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement GameDataDb**

```typescript
// src/main/db/GameDataIndex.ts
import Database from 'better-sqlite3';

export interface InsertGameObject {
  category: string;
  objectKey: string;
  filePath: string;
  parsedData: string;
  dlc: string | null;
}

export class GameDataDb {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.createTables();
  }

  private createTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS game_objects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        object_key TEXT NOT NULL,
        file_path TEXT NOT NULL,
        parsed_data TEXT NOT NULL,
        dlc TEXT,
        UNIQUE(category, object_key)
      );
      CREATE TABLE IF NOT EXISTS modifiers (
        name TEXT PRIMARY KEY,
        scopes TEXT NOT NULL,
        description TEXT
      );
      CREATE TABLE IF NOT EXISTS triggers (
        name TEXT PRIMARY KEY,
        scopes TEXT NOT NULL,
        parameters TEXT
      );
      CREATE TABLE IF NOT EXISTS effects (
        name TEXT PRIMARY KEY,
        scopes TEXT NOT NULL,
        parameters TEXT
      );
      CREATE TABLE IF NOT EXISTS scopes (
        name TEXT PRIMARY KEY,
        transitions TEXT
      );
      CREATE TABLE IF NOT EXISTS icons (
        gfx_key TEXT PRIMARY KEY,
        file_path TEXT NOT NULL,
        category TEXT
      );
      CREATE TABLE IF NOT EXISTS localisation (
        loc_key TEXT NOT NULL,
        language TEXT NOT NULL,
        text TEXT NOT NULL,
        PRIMARY KEY(loc_key, language)
      );
      CREATE TABLE IF NOT EXISTS defines (
        define_key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        file_path TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_objects_category ON game_objects(category);
      CREATE INDEX IF NOT EXISTS idx_objects_key ON game_objects(object_key);
      CREATE INDEX IF NOT EXISTS idx_loc_key ON localisation(loc_key);
    `);
  }

  listTables(): string[] {
    const rows = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[];
    return rows.map(r => r.name);
  }

  insertGameObject(obj: InsertGameObject): void {
    this.db.prepare(`
      INSERT OR REPLACE INTO game_objects (category, object_key, file_path, parsed_data, dlc)
      VALUES (?, ?, ?, ?, ?)
    `).run(obj.category, obj.objectKey, obj.filePath, obj.parsedData, obj.dlc);
  }

  getObjectsByCategory(category: string): Array<{ id: number; objectKey: string; filePath: string; parsedData: string; dlc: string | null }> {
    return this.db.prepare('SELECT id, object_key as objectKey, file_path as filePath, parsed_data as parsedData, dlc FROM game_objects WHERE category = ?').all(category) as any[];
  }

  searchObjects(prefix: string): Array<{ category: string; objectKey: string }> {
    return this.db.prepare('SELECT category, object_key as objectKey FROM game_objects WHERE object_key LIKE ?').all(prefix + '%') as any[];
  }

  insertLocalisation(locKey: string, language: string, text: string): void {
    this.db.prepare('INSERT OR REPLACE INTO localisation (loc_key, language, text) VALUES (?, ?, ?)').run(locKey, language, text);
  }

  getLocalisation(locKey: string, language: string): string | undefined {
    const row = this.db.prepare('SELECT text FROM localisation WHERE loc_key = ? AND language = ?').get(locKey, language) as { text: string } | undefined;
    return row?.text;
  }

  clearAll(): void {
    const tables = ['game_objects', 'modifiers', 'triggers', 'effects', 'scopes', 'icons', 'localisation', 'defines'];
    for (const table of tables) {
      this.db.prepare(`DELETE FROM ${table}`).run();
    }
  }

  close(): void {
    this.db.close();
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/main/db/__tests__/GameDataIndex.test.ts
```

Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/main/db/
git commit -m "feat: implement SQLite game data database with CRUD operations"
```

### Task 3.2: Game Scanner Service

> **Dependency:** Requires Task 2.2 (ParadoxParser) to be implemented first. Scanner tests use the real parser — no mocks.

**Files:**
- Create: `src/main/services/GameScanner.ts`
- Create: `src/main/services/__tests__/GameScanner.test.ts`

- [ ] **Step 1: Write failing scanner tests**

```typescript
// src/main/services/__tests__/GameScanner.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameScanner } from '../GameScanner';
import fs from 'fs';
import path from 'path';
import os from 'os';

const FIXTURE_DIR = path.join(os.tmpdir(), 'sf-test-game');

function setupFixture() {
  fs.mkdirSync(path.join(FIXTURE_DIR, 'common/traits'), { recursive: true });
  fs.mkdirSync(path.join(FIXTURE_DIR, 'events'), { recursive: true });
  fs.mkdirSync(path.join(FIXTURE_DIR, 'localisation/english'), { recursive: true });

  fs.writeFileSync(path.join(FIXTURE_DIR, 'common/traits/00_traits.txt'),
    `trait_intelligent = {\n\tcost = 2\n\tallowed_archetypes = { BIOLOGICAL }\n}\n`);

  fs.writeFileSync(path.join(FIXTURE_DIR, 'localisation/english/l_english.yml'),
    `\uFEFFl_english:\n trait_intelligent: "Intelligent"\n trait_intelligent_desc: "This species is smart."\n`);
}

function cleanupFixture() {
  fs.rmSync(FIXTURE_DIR, { recursive: true, force: true });
}

describe('GameScanner', () => {
  beforeEach(setupFixture);
  afterEach(cleanupFixture);

  it('validates a valid game directory', () => {
    expect(GameScanner.validateGamePath(FIXTURE_DIR)).toBe(true);
  });

  it('rejects invalid game directory', () => {
    expect(GameScanner.validateGamePath('/nonexistent')).toBe(false);
  });

  it('scans common/ directory and finds objects', async () => {
    const scanner = new GameScanner(FIXTURE_DIR);
    const results = await scanner.scanCategory('common/traits', 'trait');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].objectKey).toBe('trait_intelligent');
  });

  it('scans localisation files', async () => {
    const scanner = new GameScanner(FIXTURE_DIR);
    const results = await scanner.scanLocalisation();
    expect(results.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/main/services/__tests__/GameScanner.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement GameScanner**

```typescript
// src/main/services/GameScanner.ts
import fs from 'fs';
import path from 'path';
import { parse } from './ParadoxParser';
import type { InsertGameObject } from '../db/GameDataIndex';

export interface ScanResult {
  objectKey: string;
  category: string;
  filePath: string;
  parsedData: string;
  dlc: string | null;
}

export interface LocResult {
  locKey: string;
  language: string;
  text: string;
}

export class GameScanner {
  constructor(private gamePath: string) {}

  static validateGamePath(gamePath: string): boolean {
    try {
      const hasCommon = fs.existsSync(path.join(gamePath, 'common'));
      const hasEvents = fs.existsSync(path.join(gamePath, 'events'));
      return hasCommon && hasEvents;
    } catch {
      return false;
    }
  }

  async scanCategory(relativeDir: string, category: string): Promise<ScanResult[]> {
    const dirPath = path.join(this.gamePath, relativeDir);
    if (!fs.existsSync(dirPath)) return [];

    const results: ScanResult[] = [];
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.txt'));

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = parse(content);

      for (const node of parsed.file.nodes) {
        results.push({
          objectKey: node.key,
          category,
          filePath: path.join(relativeDir, file),
          parsedData: JSON.stringify(node),
          dlc: this.detectDlc(relativeDir),
        });
      }
    }

    return results;
  }

  async scanLocalisation(): Promise<LocResult[]> {
    const results: LocResult[] = [];
    const locDir = path.join(this.gamePath, 'localisation');
    if (!fs.existsSync(locDir)) return results;

    const langDirs = fs.readdirSync(locDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const lang of langDirs) {
      const langDir = path.join(locDir, lang);
      const files = fs.readdirSync(langDir).filter(f => f.endsWith('.yml'));

      for (const file of files) {
        const content = fs.readFileSync(path.join(langDir, file), 'utf-8');
        const lines = content.split('\n');

        for (const line of lines) {
          const match = line.match(/^\s+(\S+?):\d*\s+"(.+)"$/);
          if (match) {
            results.push({ locKey: match[1], language: `l_${lang}`, text: match[2] });
          }
        }
      }
    }

    return results;
  }

  private detectDlc(relativeDir: string): string | null {
    if (relativeDir.includes('dlc/')) {
      const parts = relativeDir.split('/');
      const dlcIdx = parts.indexOf('dlc');
      return dlcIdx >= 0 && parts.length > dlcIdx + 1 ? parts[dlcIdx + 1] : null;
    }
    return null;
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/main/services/__tests__/GameScanner.test.ts
```

Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/main/services/GameScanner.ts src/main/services/__tests__/GameScanner.test.ts
git commit -m "feat: implement game scanner for Stellaris directory parsing"
```

### Task 3.3: Project Manager

**Files:**
- Create: `src/main/services/ProjectManager.ts`
- Create: `src/main/services/__tests__/ProjectManager.test.ts`

- [ ] **Step 1: Write failing project manager tests**

```typescript
// src/main/services/__tests__/ProjectManager.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProjectManager } from '../ProjectManager';
import fs from 'fs';
import path from 'path';
import os from 'os';

const TEST_DIR = path.join(os.tmpdir(), 'sf-test-projects');

describe('ProjectManager', () => {
  beforeEach(() => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('creates a new project with correct structure', () => {
    const projectPath = path.join(TEST_DIR, 'TestMod.sfproj');
    ProjectManager.createProject(projectPath, {
      name: 'Test Mod',
      internalName: 'test_mod',
      version: '1.0.0',
      stellarisVersion: '3.12.*',
      tags: ['Gameplay'],
      description: 'A test',
      author: 'Tester',
    });

    expect(fs.existsSync(path.join(projectPath, 'project.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'items'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'localisation'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'assets'))).toBe(true);
  });

  it('saves and loads a project', () => {
    const projectPath = path.join(TEST_DIR, 'TestMod.sfproj');
    const project = ProjectManager.createProject(projectPath, {
      name: 'Test Mod',
      internalName: 'test_mod',
      version: '1.0.0',
      stellarisVersion: '3.12.*',
      tags: [],
      description: '',
      author: '',
    });

    project.items.traits = { trait_test: { cost: 2, initial: true } };
    ProjectManager.saveProject(projectPath, project);

    const loaded = ProjectManager.loadProject(projectPath);
    expect(loaded.metadata.name).toBe('Test Mod');
    expect(loaded.items.traits).toBeDefined();
    expect(loaded.items.traits.trait_test).toEqual({ cost: 2, initial: true });
  });

  it('exports project as .sfpkg', () => {
    const projectPath = path.join(TEST_DIR, 'TestMod.sfproj');
    ProjectManager.createProject(projectPath, {
      name: 'Test Mod',
      internalName: 'test_mod',
      version: '1.0.0',
      stellarisVersion: '3.12.*',
      tags: [],
      description: '',
      author: '',
    });

    const pkgPath = path.join(TEST_DIR, 'TestMod.sfpkg');
    ProjectManager.exportPackage(projectPath, pkgPath);
    expect(fs.existsSync(pkgPath)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/main/services/__tests__/ProjectManager.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Install archiver for .sfpkg zip export**

```bash
npm install archiver extract-zip
npm install -D @types/archiver
```

- [ ] **Step 4: Implement ProjectManager**

```typescript
// src/main/services/ProjectManager.ts
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import type { Project, ProjectMetadata, ProjectAssets } from '@shared/types/project';

interface CreateProjectOptions {
  name: string;
  internalName: string;
  version: string;
  stellarisVersion: string;
  tags: string[];
  description: string;
  author: string;
}

export class ProjectManager {
  static createProject(projectPath: string, options: CreateProjectOptions): Project {
    // Create directory structure
    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'items'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'localisation'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'assets/icons'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'assets/event_pictures'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'assets/portraits'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'assets/planet_textures'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'assets/flags'), { recursive: true });

    const now = new Date().toISOString();
    const metadata: ProjectMetadata = {
      ...options,
      createdAt: now,
      lastModified: now,
      stellarforgeVersion: '0.1.0',
    };

    const project: Project = {
      metadata,
      items: {},
      localisation: {},
      assets: { icons: [], eventPictures: [], portraits: [], planetTextures: [], flags: [] },
    };

    // Write project.json
    fs.writeFileSync(path.join(projectPath, 'project.json'), JSON.stringify(metadata, null, 2));

    return project;
  }

  static saveProject(projectPath: string, project: Project): void {
    project.metadata.lastModified = new Date().toISOString();
    fs.writeFileSync(path.join(projectPath, 'project.json'), JSON.stringify(project.metadata, null, 2));

    // Save each category items file
    for (const [category, items] of Object.entries(project.items)) {
      fs.writeFileSync(
        path.join(projectPath, 'items', `${category}.json`),
        JSON.stringify(items, null, 2)
      );
    }

    // Save localisation
    for (const [lang, strings] of Object.entries(project.localisation)) {
      fs.writeFileSync(
        path.join(projectPath, 'localisation', `${lang}.json`),
        JSON.stringify(strings, null, 2)
      );
    }
  }

  static loadProject(projectPath: string): Project {
    const metadata: ProjectMetadata = JSON.parse(
      fs.readFileSync(path.join(projectPath, 'project.json'), 'utf-8')
    );

    const items: Record<string, any> = {};
    const itemsDir = path.join(projectPath, 'items');
    if (fs.existsSync(itemsDir)) {
      for (const file of fs.readdirSync(itemsDir).filter(f => f.endsWith('.json'))) {
        const category = path.basename(file, '.json');
        items[category] = JSON.parse(fs.readFileSync(path.join(itemsDir, file), 'utf-8'));
      }
    }

    const localisation: Record<string, Record<string, string>> = {};
    const locDir = path.join(projectPath, 'localisation');
    if (fs.existsSync(locDir)) {
      for (const file of fs.readdirSync(locDir).filter(f => f.endsWith('.json'))) {
        const lang = path.basename(file, '.json');
        localisation[lang] = JSON.parse(fs.readFileSync(path.join(locDir, file), 'utf-8'));
      }
    }

    return {
      metadata,
      items,
      localisation,
      assets: { icons: [], eventPictures: [], portraits: [], planetTextures: [], flags: [] },
    };
  }

  static exportPackage(projectPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(projectPath, path.basename(projectPath));
      archive.finalize();
    });
  }

  static async importPackage(pkgPath: string, outputDir: string): Promise<string> {
    const extractZip = (await import('extract-zip')).default;
    const projectName = path.basename(pkgPath, '.sfpkg');
    const extractDir = path.join(outputDir, projectName);
    await extractZip(pkgPath, { dir: extractDir });
    // Find the .sfproj file inside the extracted directory
    const files = fs.readdirSync(extractDir);
    const sfprojFile = files.find(f => f.endsWith('.sfproj'));
    if (!sfprojFile) throw new Error('No .sfproj file found in package');
    return path.join(extractDir, sfprojFile);
  }
}
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run src/main/services/__tests__/ProjectManager.test.ts
```

Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/main/services/ProjectManager.ts src/main/services/__tests__/ProjectManager.test.ts
git commit -m "feat: implement project manager with create, save, load, and package export"
```

### Task 3.4: IPC Handler Registration

**Files:**
- Create: `src/main/ipc/projectHandler.ts`
- Create: `src/main/ipc/gameScanHandler.ts`
- Create: `src/main/ipc/fileOps.ts`
- Modify: `src/main/index.ts`
- Modify: `src/main/preload.ts`

- [ ] **Step 1: Create src/main/ipc/projectHandler.ts**

```typescript
import { ipcMain, dialog } from 'electron';
import { ProjectManager } from '../services/ProjectManager';
import type { Project } from '@shared/types/project';

export function registerProjectHandlers(): void {
  ipcMain.handle('project:save', async (_event, project: Project, projectPath: string) => {
    ProjectManager.saveProject(projectPath, project);
  });

  ipcMain.handle('project:load', async (_event, projectPath: string) => {
    return ProjectManager.loadProject(projectPath);
  });

  ipcMain.handle('project:create', async (_event, projectPath: string, options: { name: string; author: string; stellarisVersion: string; tags?: string[] }) => {
    return ProjectManager.createProject(projectPath, options);
  });

  ipcMain.handle('project:pick-directory', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('project:pick-save-path', async (_event, defaultName: string) => {
    const result = await dialog.showSaveDialog({
      defaultPath: defaultName,
      filters: [{ name: 'StellarForge Project', extensions: ['sfproj'] }],
    });
    return result.canceled ? null : result.filePath;
  });
}
```

- [ ] **Step 2: Create src/main/ipc/gameScanHandler.ts**

```typescript
import { ipcMain } from 'electron';
import { GameScanner } from '../services/GameScanner';
import { GameDataDb } from '../db/GameDataIndex';
import path from 'path';
import { app } from 'electron';

let gameDb: GameDataDb | null = null;

function getDb(): GameDataDb {
  if (!gameDb) {
    const dbPath = path.join(app.getPath('userData'), 'gamedata.db');
    gameDb = new GameDataDb(dbPath);
  }
  return gameDb;
}

const CATEGORY_DIRS: Record<string, string> = {
  trait: 'common/traits',
  technology: 'common/technology',
  building: 'common/buildings',
  civic: 'common/governments/civics',
  ethic: 'common/ethics',
  government: 'common/governments',
  authority: 'common/governments/authorities',
  origin: 'common/governments/civics',
  species_class: 'common/species_classes',
  species_right: 'common/species_rights',
  personality: 'common/personalities',
  district: 'common/districts',
  pop_job: 'common/pop_jobs',
  planet_class: 'common/planet_classes',
  deposit: 'common/deposits',
  decision: 'common/decisions',
  edict: 'common/edicts',
  policy: 'common/policies',
  tradition: 'common/traditions',
  ascension_perk: 'common/ascension_perks',
  ship_size: 'common/ship_sizes',
  component_template: 'common/component_templates',
  army: 'common/armies',
  event: 'events',
  anomaly: 'common/anomalies',
  relic: 'common/relics',
  archaeological_site: 'common/archaeological_site_types',
};

export function registerGameScanHandlers(): void {
  ipcMain.handle('game:scan', async (_event, gamePath: string) => {
    const scanner = new GameScanner(gamePath);
    const db = getDb();
    db.clearAll();

    let objectCount = 0;

    for (const [category, dir] of Object.entries(CATEGORY_DIRS)) {
      const results = await scanner.scanCategory(dir, category);
      for (const result of results) {
        db.insertGameObject(result);
        objectCount++;
      }
    }

    // Scan localisation
    const locResults = await scanner.scanLocalisation();
    for (const loc of locResults) {
      db.insertLocalisation(loc.locKey, loc.language, loc.text);
    }

    return {
      version: '3.12',
      objectCount,
      scanDate: new Date().toISOString(),
    };
  });

  ipcMain.handle('game:validate-path', async (_event, gamePath: string) => {
    return GameScanner.validateGamePath(gamePath);
  });

  ipcMain.handle('game:search-objects', async (_event, prefix: string) => {
    return getDb().searchObjects(prefix);
  });

  ipcMain.handle('game:get-objects', async (_event, category: string) => {
    return getDb().getObjectsByCategory(category);
  });
}
```

- [ ] **Step 3: Create src/main/ipc/fileOps.ts**

```typescript
import { ipcMain } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import type { FileEntry } from '@shared/types/gameData';

export function registerFileOpsHandlers(): void {
  ipcMain.handle('fs:read-file', async (_event, filePath: string) => {
    return fs.readFile(filePath, 'utf-8');
  });

  ipcMain.handle('fs:write-file', async (_event, filePath: string, content: string) => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  });

  ipcMain.handle('fs:list-dir', async (_event, dirPath: string): Promise<FileEntry[]> => {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.map(entry => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isDirectory: entry.isDirectory(),
    }));
  });
}
```

- [ ] **Step 4: Update src/main/index.ts to register IPC handlers**

Add after the window control handlers:

```typescript
import { registerProjectHandlers } from './ipc/projectHandler';
import { registerGameScanHandlers } from './ipc/gameScanHandler';
import { registerFileOpsHandlers } from './ipc/fileOps';

// ... existing code ...
// After app.whenReady().then(createWindow), add:
app.whenReady().then(() => {
  registerProjectHandlers();
  registerGameScanHandlers();
  registerFileOpsHandlers();
  createWindow();
});
```

- [ ] **Step 5: Update src/main/preload.ts with full API**

> Note: Some channels (`project:export-sfproj`, `project:import-sfproj`, `game:get-version`, `mod:export`, `mod:validate`, `mod:generate-tests`) define the API surface but their `ipcMain.handle` registrations come in Chunk 8. They will return `Error: No handler registered` until then — this is expected during incremental development.

```typescript
import { contextBridge, ipcRenderer } from 'electron';
import type { StellarForgeAPI } from '@shared/types/ipc';

const api: StellarForgeAPI = {
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },
  project: {
    save: (project) => ipcRenderer.invoke('project:save', project),
    load: (path) => ipcRenderer.invoke('project:load', path),
    exportSfproj: (path) => ipcRenderer.invoke('project:export-sfproj', path),
    importSfproj: (path) => ipcRenderer.invoke('project:import-sfproj', path),
  },
  game: {
    scan: (gamePath) => ipcRenderer.invoke('game:scan', gamePath),
    getVersion: (gamePath) => ipcRenderer.invoke('game:get-version', gamePath),
  },
  mod: {
    export: (project, outputPath) => ipcRenderer.invoke('mod:export', project, outputPath),
    validate: (project) => ipcRenderer.invoke('mod:validate', project),
    generateTests: (project) => ipcRenderer.invoke('mod:generate-tests', project),
  },
  fs: {
    readFile: (path) => ipcRenderer.invoke('fs:read-file', path),
    writeFile: (path, content) => ipcRenderer.invoke('fs:write-file', path, content),
    listDir: (path) => ipcRenderer.invoke('fs:list-dir', path),
  },
};

contextBridge.exposeInMainWorld('stellarforge', api);
```

- [ ] **Step 6: Commit**

```bash
git add src/main/ipc/ src/main/index.ts src/main/preload.ts
git commit -m "feat: register IPC handlers for project, game scan, and file operations"
```

---

## Chunk 4: UI Foundation — i18n, Themes, Design System

### Task 4.1: i18n Setup

**Files:**
- Create: `src/renderer/i18n/index.ts`
- Create: `src/renderer/i18n/en.json`
- Create: `src/renderer/i18n/it.json`

- [ ] **Step 1: Create i18n config**

```typescript
// src/renderer/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import it from './it.json';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, it: { translation: it } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
```

- [ ] **Step 2: Create en.json with full namespace structure**

```json
{
  "app": { "title": "StellarForge", "version": "v{{version}}", "newProject": "New Project", "openProject": "Open Project", "importProject": "Import Project", "recentProjects": "Recent Projects", "noRecentProjects": "No recent projects" },
  "sidebar": {
    "empireDesign": "Empire Design", "economy": "Economy & Planets", "tech": "Tech & Traditions",
    "military": "Military", "exploration": "Exploration & Events", "scripting": "Scripting",
    "graphics": "Graphics & UI", "localisation": "Localisation"
  },
  "categories": {
    "governments": "Governments", "authorities": "Authorities", "civics": "Civics", "origins": "Origins",
    "ethics": "Ethics", "species_classes": "Species Classes", "traits": "Traits", "species_rights": "Species Rights",
    "personalities": "AI Personalities", "name_lists": "Name Lists", "prescripted_countries": "Prescripted Countries",
    "buildings": "Buildings", "districts": "Districts", "pop_jobs": "Pop Jobs", "planet_classes": "Planet Classes",
    "deposits": "Deposits", "decisions": "Decisions", "pop_categories": "Pop Categories",
    "economic_categories": "Economic Categories", "trade_conversions": "Trade Conversions", "terraform": "Terraform",
    "technologies": "Technologies", "traditions": "Traditions", "ascension_perks": "Ascension Perks",
    "edicts": "Edicts", "policies": "Policies", "agendas": "Agendas",
    "ship_sizes": "Ship Sizes", "component_templates": "Component Templates", "section_templates": "Section Templates",
    "armies": "Armies", "war_goals": "War Goals", "casus_belli": "Casus Belli",
    "bombardment_stances": "Bombardment Stances", "ship_behaviors": "Ship Behaviors", "global_ship_designs": "Ship Designs",
    "events": "Events", "anomalies": "Anomalies", "archaeological_sites": "Archaeological Sites",
    "relics": "Relics", "on_actions": "On Actions", "solar_system_initializers": "System Initializers",
    "star_classes": "Star Classes", "ambient_objects": "Ambient Objects", "leader_classes": "Leader Classes",
    "scripted_effects": "Scripted Effects", "scripted_triggers": "Scripted Triggers",
    "scripted_modifiers": "Scripted Modifiers", "scripted_variables": "Scripted Variables",
    "script_values": "Script Values", "inline_scripts": "Inline Scripts", "defines": "Defines",
    "static_modifiers": "Static Modifiers", "random_names": "Random Names",
    "icons": "Icons", "event_pictures": "Event Pictures", "empire_flags": "Empire Flags",
    "loading_screens": "Loading Screens", "gui_files": "GUI Files", "sprite_libraries": "Sprite Libraries",
    "music_sound": "Music & Sound"
  },
  "editors": {
    "newItem": "New {{category}}", "deleteItem": "Delete", "duplicateItem": "Duplicate",
    "unsavedChanges": "Unsaved changes", "emptyState": "Create your first {{category}}",
    "general": "General", "conditions": "Conditions", "effects": "Effects", "requirements": "Requirements",
    "restrictions": "Restrictions", "costs": "Costs", "ai": "AI"
  },
  "actions": {
    "save": "Save", "cancel": "Cancel", "delete": "Delete", "confirm": "Confirm",
    "export": "Export Mod", "exportLocal": "Export Locally", "exportWorkshop": "Export & Publish",
    "validate": "Validate", "undo": "Undo", "redo": "Redo", "search": "Search"
  },
  "validation": {
    "requiredField": "This field is required",
    "invalidReference": "Referenced {{type}} \"{{key}}\" does not exist",
    "syntaxError": "Syntax error at line {{line}}: {{message}}"
  },
  "settings": {
    "title": "Settings", "gamePath": "Stellaris Game Path", "language": "Language",
    "theme": "Theme", "codePanel": "Code Panel", "autoSave": "Auto-save Interval",
    "selectGamePath": "Select Game Directory"
  },
  "export": {
    "title": "Export Mod", "validating": "Validating...", "exporting": "Exporting...",
    "success": "Mod exported successfully!", "errors": "{{count}} errors found",
    "warnings": "{{count}} warnings", "filesGenerated": "{{count}} files generated"
  }
}
```

- [ ] **Step 3: Create it.json** — full Italian translation file

Create `src/renderer/i18n/it.json` with identical key structure as en.json. The implementer MUST translate ALL keys from en.json — not a subset. Key examples: `"newProject": "Nuovo Progetto"`, `"openProject": "Apri Progetto"`, `"empireDesign": "Progettazione Impero"`, `"traits": "Tratti"`, `"technologies": "Tecnologie"`, `"events": "Eventi"`, `"buildings": "Edifici"`, `"export": "Esporta"`, `"validate": "Valida"`, `"settings": "Impostazioni"`, `"language": "Lingua"`, `"theme": "Tema"`. Every namespace (app, sidebar, categories, editors, actions, validation, settings, export) must be fully translated.

- [ ] **Step 4: Add i18n import to main.tsx**

Add `import './i18n';` at the top of `src/renderer/main.tsx`.

- [ ] **Step 5: Commit**

```bash
git add src/renderer/i18n/ src/renderer/main.tsx
git commit -m "feat: add i18n setup with English and Italian translations"
```

### Task 4.2: Theme System

**Files:**
- Create: `src/renderer/themes/theme-engine.ts`
- Create: `src/renderer/themes/sci-fi.css`
- Create: `src/renderer/themes/glassmorphism.css`
- Create: `src/renderer/themes/minimal-dark.css`
- Create: `src/renderer/themes/aurora.css`
- Create: `src/renderer/themes/warm-carbon.css`

- [ ] **Step 1: Create theme-engine.ts**

```typescript
// src/renderer/themes/theme-engine.ts
export type ThemeId = 'sci-fi' | 'glassmorphism' | 'minimal-dark' | 'aurora' | 'warm-carbon' | 'custom';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  variables: Record<string, string>;
}

const THEME_IMPORTS: Record<string, () => Promise<unknown>> = {
  'sci-fi': () => import('./sci-fi.css'),
  'glassmorphism': () => import('./glassmorphism.css'),
  'minimal-dark': () => import('./minimal-dark.css'),
  'aurora': () => import('./aurora.css'),
  'warm-carbon': () => import('./warm-carbon.css'),
};

let currentStyleEl: HTMLStyleElement | null = null;

export async function loadTheme(themeId: ThemeId): Promise<void> {
  // Remove previous theme stylesheet
  document.querySelectorAll('[data-sf-theme]').forEach(el => el.remove());

  if (themeId === 'custom') return; // Custom themes applied via variables directly

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
```

- [ ] **Step 2: Create the 5 theme CSS files**

Each file overrides the `:root` CSS variables. Create all 5 with appropriate colors per spec section 7.4. Example for `sci-fi.css` (default — already in index.css, so this is a no-op file):

```css
/* src/renderer/themes/sci-fi.css — default theme, variables already in index.css */
:root { /* Sci-Fi is the base theme */ }
```

Create the other 4 theme CSS files with concrete variable overrides:

**`glassmorphism.css`** — frosted glass aesthetic:
`--sf-bg-primary: #0f0f23`, `--sf-bg-secondary: rgba(255,255,255,0.05)`, `--sf-bg-card: rgba(255,255,255,0.08)`, `--sf-accent: #7c3aed`, `--sf-border: rgba(255,255,255,0.12)`, `--sf-text-primary: #f0f0f5`, blur backdrop filters on cards

**`minimal-dark.css`** — clean monochrome:
`--sf-bg-primary: #111111`, `--sf-bg-secondary: #1a1a1a`, `--sf-bg-card: #222222`, `--sf-accent: #ffffff`, `--sf-border: #333333`, `--sf-text-primary: #eeeeee`

**`aurora.css`** — northern lights gradient:
`--sf-bg-primary: #0a0e1a`, `--sf-bg-secondary: #0f1628`, `--sf-bg-card: #141e35`, `--sf-accent: #22d3ee`, `--sf-accent-hover: #06b6d4`, `--sf-border: #1e3a5f`, green/purple gradient accents

**`warm-carbon.css`** — carbon fiber with warm tones:
`--sf-bg-primary: #1a1410`, `--sf-bg-secondary: #231c15`, `--sf-bg-card: #2a2018`, `--sf-accent: #f59e0b`, `--sf-border: #3d3028`, `--sf-text-primary: #f5e6d3`

- [ ] **Step 3: Commit**

```bash
git add src/renderer/themes/
git commit -m "feat: add theme engine with 5 preinstalled themes"
```

### Task 4.3: Design System Components

**Files:**
- Create: `src/renderer/components/common/Button.tsx`
- Create: `src/renderer/components/common/Input.tsx`
- Create: `src/renderer/components/common/Select.tsx`
- Create: `src/renderer/components/common/Card.tsx`
- Create: `src/renderer/components/common/Modal.tsx`
- Create: `src/renderer/components/common/Tooltip.tsx`
- Create: `src/renderer/components/common/Toast.tsx`
- Create: `src/renderer/components/common/Tabs.tsx`
- Create: `src/renderer/components/common/TreeView.tsx`
- Create: `src/renderer/components/common/SearchBar.tsx`
- Create: `src/renderer/components/common/IconPicker.tsx`
- Create: `src/renderer/components/common/ModifierInput.tsx`
- Create: `src/renderer/components/common/index.ts` (barrel export)
- Create: `src/renderer/components/common/__tests__/Button.test.tsx`

All components use CSS variables from the theme system, Tailwind utility classes, and Framer Motion for animations. Each component is a focused React component following the spec section 7.3.

- [ ] **Step 1: Write Button tests**

```typescript
// src/renderer/components/common/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  it('calls onClick', () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(fn).toHaveBeenCalled();
  });
  it('supports variants: primary, secondary, ghost', () => {
    const { rerender } = render(<Button variant="primary">P</Button>);
    expect(screen.getByText('P')).toBeInTheDocument();
    rerender(<Button variant="secondary">S</Button>);
    expect(screen.getByText('S')).toBeInTheDocument();
    rerender(<Button variant="ghost">G</Button>);
    expect(screen.getByText('G')).toBeInTheDocument();
  });
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByText('X')).toBeDisabled();
  });
});
```

- [ ] **Step 2: Implement Button component**

```typescript
// src/renderer/components/common/Button.tsx
import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variants = {
  primary: 'bg-[var(--sf-accent)] text-[var(--sf-bg-primary)] hover:brightness-110 shadow-[0_0_15px_var(--sf-accent-glow)]',
  secondary: 'border border-[var(--sf-border-active)] text-[var(--sf-text-primary)] hover:bg-[var(--sf-bg-card)]',
  ghost: 'text-[var(--sf-text-secondary)] hover:text-[var(--sf-text-primary)] hover:bg-[var(--sf-bg-card)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export function Button({ variant = 'primary', size = 'md', children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`rounded-[var(--sf-radius-md)] font-medium transition-all duration-150 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

- [ ] **Step 3: Implement form components** — Input (dark bg, subtle border, glow on focus, label above, error state), Select (custom styled, searchable for long lists, dropdown with filter), Tabs (underline style with Framer Motion animated indicator), SearchBar (search icon, debounced input, clear button).

- [ ] **Step 4: Implement layout/feedback components** — Card (semi-transparent bg, top-edge line decoration, hover glow), Modal (centered, backdrop blur, slide-in via Framer Motion, sizes sm/md/lg), Tooltip (dark card with arrow, 200ms delay), Toast (bottom-right notifications, auto-dismiss, 4 variants).

- [ ] **Step 5: Implement tree/data components** — TreeView (expandable/collapsible with chevron, active item glow, animated expand).

- [ ] **Step 6: Implement game-specific components** — IconPicker (grid of game icons, searchable. Uses placeholder static icons until Chunk 3 GameDataDb + Chunk 8 DDS pipeline are available), ModifierInput (compound: modifier dropdown + operator (+/×/=) + numeric value. Uses hardcoded modifier list stub until Chunk 3 GameDataDb populates real modifiers).

- [ ] **Step 7: Create barrel export**

```typescript
// src/renderer/components/common/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';
export { Card } from './Card';
export { Modal } from './Modal';
export { Tooltip } from './Tooltip';
export { ToastProvider, useToast } from './Toast';
export { Tabs } from './Tabs';
export { TreeView } from './TreeView';
export { SearchBar } from './SearchBar';
export { IconPicker } from './IconPicker';
export { ModifierInput } from './ModifierInput';
```

- [ ] **Step 8: Run tests**

```bash
npx vitest run src/renderer/components/common/__tests__/
```

Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/renderer/components/common/
git commit -m "feat: add complete design system component library"
```

---

## Chunk 5: App Shell — Layout, Stores, Code Panel, Routing

### Task 5.1: Zustand Stores

**Files:**
- Create: `src/renderer/stores/projectStore.ts`
- Create: `src/renderer/stores/gameDataStore.ts`
- Create: `src/renderer/stores/uiStore.ts`
- Create: `src/renderer/stores/editorStore.ts`
- Create: `src/renderer/stores/__tests__/projectStore.test.ts`

- [ ] **Step 1: Write projectStore tests**

```typescript
// src/renderer/stores/__tests__/projectStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../projectStore';

describe('projectStore', () => {
  beforeEach(() => { useProjectStore.getState().reset(); });

  it('starts with null project', () => {
    expect(useProjectStore.getState().project).toBeNull();
  });

  it('sets and gets project', () => {
    const project = { metadata: { name: 'Test' } } as any;
    useProjectStore.getState().setProject(project);
    expect(useProjectStore.getState().project?.metadata.name).toBe('Test');
  });

  it('updates an item in a category', () => {
    useProjectStore.getState().setProject({ metadata: {} as any, items: {}, localisation: {}, assets: {} as any });
    useProjectStore.getState().setItem('traits', 'trait_test', { cost: 2 });
    expect(useProjectStore.getState().project!.items.traits.trait_test).toEqual({ cost: 2 });
  });

  it('deletes an item', () => {
    useProjectStore.getState().setProject({ metadata: {} as any, items: { traits: { trait_test: { cost: 2 } } }, localisation: {}, assets: {} as any });
    useProjectStore.getState().deleteItem('traits', 'trait_test');
    expect(useProjectStore.getState().project!.items.traits.trait_test).toBeUndefined();
  });

  it('supports undo/redo', () => {
    useProjectStore.getState().setProject({ metadata: {} as any, items: {}, localisation: {}, assets: {} as any });
    useProjectStore.getState().setItem('traits', 't1', { cost: 1 });
    useProjectStore.getState().setItem('traits', 't1', { cost: 5 });
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().project!.items.traits.t1.cost).toBe(1);
    useProjectStore.getState().redo();
    expect(useProjectStore.getState().project!.items.traits.t1.cost).toBe(5);
  });
});
```

- [ ] **Step 2: Implement projectStore with undo middleware**

```typescript
// src/renderer/stores/projectStore.ts
import { create } from 'zustand';
import type { Project } from '@shared/types/project';

interface UndoState {
  past: Project[];
  future: Project[];
}

interface ProjectStore {
  project: Project | null;
  projectPath: string | null;
  dirty: boolean;
  _undo: UndoState;

  setProject: (project: Project) => void;
  setProjectPath: (path: string) => void;
  setItem: (category: string, key: string, data: Record<string, unknown>) => void;
  deleteItem: (category: string, key: string) => void;
  setLocalisation: (lang: string, key: string, value: string) => void;
  markClean: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const MAX_UNDO = 100;

function pushUndo(state: ProjectStore): UndoState {
  if (!state.project) return state._undo;
  const past = [...state._undo.past, structuredClone(state.project)].slice(-MAX_UNDO);
  return { past, future: [] };
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  projectPath: null,
  dirty: false,
  _undo: { past: [], future: [] },

  setProject: (project) => set({ project, dirty: false, _undo: { past: [], future: [] } }),
  setProjectPath: (path) => set({ projectPath: path }),

  setItem: (category, key, data) => set((state) => {
    if (!state.project) return state;
    const _undo = pushUndo(state);
    const items = { ...state.project.items };
    items[category] = { ...items[category], [key]: data };
    return { project: { ...state.project, items }, dirty: true, _undo };
  }),

  deleteItem: (category, key) => set((state) => {
    if (!state.project) return state;
    const _undo = pushUndo(state);
    const items = { ...state.project.items };
    const catItems = { ...items[category] };
    delete catItems[key];
    items[category] = catItems;
    return { project: { ...state.project, items }, dirty: true, _undo };
  }),

  setLocalisation: (lang, key, value) => set((state) => {
    if (!state.project) return state;
    const _undo = pushUndo(state);
    const loc = { ...state.project.localisation };
    loc[lang] = { ...loc[lang], [key]: value };
    return { project: { ...state.project, localisation: loc }, dirty: true, _undo };
  }),

  markClean: () => set({ dirty: false }),

  undo: () => set((state) => {
    if (state._undo.past.length === 0 || !state.project) return state;
    const past = [...state._undo.past];
    const previous = past.pop()!;
    const future = [structuredClone(state.project), ...state._undo.future];
    return { project: previous, dirty: true, _undo: { past, future } };
  }),

  redo: () => set((state) => {
    if (state._undo.future.length === 0 || !state.project) return state;
    const future = [...state._undo.future];
    const next = future.shift()!;
    const past = [...state._undo.past, structuredClone(state.project!)];
    return { project: next, dirty: true, _undo: { past, future } };
  }),

  reset: () => set({ project: null, projectPath: null, dirty: false, _undo: { past: [], future: [] } }),
}));
```

- [ ] **Step 3: Implement uiStore, gameDataStore, editorStore**

```typescript
// src/renderer/stores/uiStore.ts
import { create } from 'zustand';
import type { ThemeId } from '../themes/theme-engine';

interface UiStore {
  sidebarCollapsed: boolean;
  codePanelVisible: boolean;
  codePanelWidth: number;
  activeCategory: string | null;
  activeItemKey: string | null;
  theme: ThemeId;
  language: 'en' | 'it';
  toggleSidebar: () => void;
  toggleCodePanel: () => void;
  setCodePanelWidth: (w: number) => void;
  setActiveCategory: (cat: string) => void;
  setActiveItem: (cat: string, key: string) => void;
  setTheme: (t: ThemeId) => void;
  setLanguage: (l: 'en' | 'it') => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarCollapsed: false,
  codePanelVisible: true,
  codePanelWidth: 270,
  activeCategory: null,
  activeItemKey: null,
  theme: 'sci-fi',
  language: 'en',
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleCodePanel: () => set(s => ({ codePanelVisible: !s.codePanelVisible })),
  setCodePanelWidth: (w) => set({ codePanelWidth: w }),
  setActiveCategory: (cat) => set({ activeCategory: cat, activeItemKey: null }),
  setActiveItem: (cat, key) => set({ activeCategory: cat, activeItemKey: key }),
  setTheme: (t) => set({ theme: t }),
  setLanguage: (l) => set({ language: l }),
}));
```

```typescript
// src/renderer/stores/gameDataStore.ts
import { create } from 'zustand';
import type { GameDataIndex, GameObject } from '@shared/types/gameData';

interface GameDataStore {
  index: GameDataIndex | null;
  gamePath: string | null;
  scanning: boolean;
  setIndex: (index: GameDataIndex) => void;
  setGamePath: (path: string) => void;
  setScanning: (v: boolean) => void;
}

export const useGameDataStore = create<GameDataStore>((set) => ({
  index: null,
  gamePath: null,
  scanning: false,
  setIndex: (index) => set({ index, scanning: false }),
  setGamePath: (path) => set({ gamePath: path }),
  setScanning: (v) => set({ scanning: v }),
}));
```

```typescript
// src/renderer/stores/editorStore.ts
import { create } from 'zustand';

interface EditorStore {
  codeContent: string;
  codeSyncEnabled: boolean;
  setCodeContent: (content: string) => void;
  setCodeSyncEnabled: (enabled: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  codeContent: '',
  codeSyncEnabled: true,
  setCodeContent: (content) => set({ codeContent: content }),
  setCodeSyncEnabled: (enabled) => set({ codeSyncEnabled: enabled }),
}));
```

- [ ] **Step 4: Run tests, commit**

```bash
npx vitest run src/renderer/stores/__tests__/
git add src/renderer/stores/
git commit -m "feat: add Zustand stores with undo/redo middleware"
```

### Task 5.2: App Shell Layout

**Files:**
- Create: `src/renderer/components/layout/AppShell.tsx`
- Create: `src/renderer/components/layout/TitleBar.tsx`
- Create: `src/renderer/components/layout/Sidebar.tsx`
- Create: `src/renderer/components/layout/MainArea.tsx`
- Create: `src/renderer/components/layout/CodePanel.tsx`
- Create: `src/renderer/components/layout/StatusBar.tsx`

- [ ] **Step 1: Implement TitleBar** (custom frameless with min/max/close buttons)

```typescript
// src/renderer/components/layout/TitleBar.tsx
export function TitleBar() {
  return (
    <div className="h-9 flex items-center justify-between px-4 bg-[var(--sf-bg-secondary)] border-b border-[var(--sf-border)] select-none" style={{ WebkitAppRegion: 'drag' } as any}>
      <span className="text-xs font-semibold tracking-wider text-[var(--sf-accent)]" style={{ fontFamily: 'var(--sf-font-display)' }}>
        STELLARFORGE
      </span>
      <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button onClick={() => window.stellarforge.window.minimize()} className="w-8 h-7 flex items-center justify-center hover:bg-[var(--sf-bg-card)] rounded text-[var(--sf-text-secondary)]">−</button>
        <button onClick={() => window.stellarforge.window.maximize()} className="w-8 h-7 flex items-center justify-center hover:bg-[var(--sf-bg-card)] rounded text-[var(--sf-text-secondary)]">□</button>
        <button onClick={() => window.stellarforge.window.close()} className="w-8 h-7 flex items-center justify-center hover:bg-red-600 rounded text-[var(--sf-text-secondary)] hover:text-white">×</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement Sidebar** with TreeView-based navigation for all 8 category groups

Uses `TreeView` component, populates nodes from category constants, highlights active category.

- [ ] **Step 3: Implement CodePanel** with Monaco Editor

```typescript
// src/renderer/components/layout/CodePanel.tsx
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
```

- [ ] **Step 4: Implement StatusBar**

Shows project name, validation status (errors/warnings count), dirty indicator, game version.

- [ ] **Step 5: Implement AppShell** combining all layout components

```typescript
// src/renderer/components/layout/AppShell.tsx
import { TitleBar } from './TitleBar';
import { Sidebar } from './Sidebar';
import { MainArea } from './MainArea';
import { CodePanel } from './CodePanel';
import { StatusBar } from './StatusBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <TitleBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainArea>{children}</MainArea>
        <CodePanel />
      </div>
      <StatusBar />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/renderer/components/layout/
git commit -m "feat: add app shell with sidebar, code panel, title bar, and status bar"
```

### Task 5.3: Monaco Paradox Language & Bidirectional Sync

**Files:**
- Create: `src/renderer/lib/paradox-language/paradoxLanguage.ts`
- Create: `src/renderer/lib/paradox-language/paradoxCompletion.ts`
- Create: `src/renderer/hooks/useCodeSync.ts`

- [ ] **Step 1: Register Paradox language in Monaco**

```typescript
// src/renderer/lib/paradox-language/paradoxLanguage.ts
import * as monaco from 'monaco-editor';

export function registerParadoxLanguage() {
  monaco.languages.register({ id: 'paradox' });

  monaco.languages.setMonarchTokensProvider('paradox', {
    tokenizer: {
      root: [
        [/#.*$/, 'comment'],
        [/"[^"]*"/, 'string'],
        [/\b(yes|no)\b/, 'keyword'],
        [/\b(hsv|rgb)\b/, 'type'],
        [/@\w+/, 'variable'],
        [/[><=!]+/, 'operator'],
        [/\b\d+\.?\d*\b/, 'number'],
        [/[{}]/, 'delimiter.bracket'],
        [/\b\w+\b/, 'identifier'],
      ],
    },
  });
}
```

- [ ] **Step 2: Implement useCodeSync hook**

```typescript
// src/renderer/hooks/useCodeSync.ts
import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useProjectStore } from '../stores/projectStore';
import { useUiStore } from '../stores/uiStore';

// This hook synchronizes the active editor item with the Monaco code panel.
// Form → Code: Instant. Serialize current item to Paradox script.
// Code → Form: 300ms debounce. Parse code and update store.
export function useCodeSync() {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const { activeCategory, activeItemKey } = useUiStore();
  const { codeContent, setCodeContent, codeSyncEnabled } = useEditorStore();
  const { project, setItem } = useProjectStore();

  // Form → Code: when active item changes, serialize to code
  useEffect(() => {
    if (!codeSyncEnabled || !activeCategory || !activeItemKey || !project) return;
    const item = project.items[activeCategory]?.[activeItemKey];
    if (!item) return;
    // Serialize item to Paradox code via IPC (main process has the serializer)
    // For now, JSON preview as placeholder until we wire up serializer IPC
    setCodeContent(JSON.stringify(item, null, 2));
  }, [activeCategory, activeItemKey, project, codeSyncEnabled]);

  // Code → Form: debounced parse on code change
  const handleCodeChange = useCallback((newCode: string) => {
    setCodeContent(newCode);
    if (!codeSyncEnabled || !activeCategory || !activeItemKey) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Parse code via IPC and update store
      // Will be wired up when export IPC channel is available
    }, 300);
  }, [codeSyncEnabled, activeCategory, activeItemKey]);

  return { handleCodeChange };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/renderer/lib/ src/renderer/hooks/
git commit -m "feat: add Paradox language for Monaco and bidirectional code sync hook"
```

### Task 5.4: Welcome Screen & Router

**Files:**
- Create: `src/renderer/components/project/ProjectWelcome.tsx`
- Create: `src/renderer/components/project/ProjectSettings.tsx`
- Create: `src/renderer/components/settings/SettingsView.tsx`
- Create: `src/renderer/components/settings/GamePathSelector.tsx`
- Modify: `src/renderer/App.tsx` (add routing)

- [ ] **Step 1: Implement ProjectWelcome**

Welcome screen with StellarForge logo, New/Open/Import buttons, recent projects list. Uses Button and Card components.

- [ ] **Step 2: Implement SettingsView and GamePathSelector**

Settings page for game path, language, theme, code panel defaults. GamePathSelector uses IPC `project:pick-directory` to open native dialog, validates with `game:validate-path`.

- [ ] **Step 3: Update App.tsx with routing**

```typescript
// src/renderer/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProjectWelcome } from './components/project/ProjectWelcome';
import { SettingsView } from './components/settings/SettingsView';
import { ToastProvider } from './components/common/Toast';
import { useProjectStore } from './stores/projectStore';
import './i18n';

export default function App() {
  const project = useProjectStore((s) => s.project);

  return (
    <BrowserRouter>
      <ToastProvider>
        {project ? (
          <AppShell>
            <Routes>
              <Route path="/settings" element={<SettingsView />} />
              <Route path="*" element={<div>Editor area — will be replaced by category views</div>} />
            </Routes>
          </AppShell>
        ) : (
          <ProjectWelcome />
        )}
      </ToastProvider>
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/renderer/components/project/ src/renderer/components/settings/ src/renderer/App.tsx
git commit -m "feat: add welcome screen, settings, game path selector, and app routing"
```

---

## Chunk 6: Editor Framework — Schemas, Generic Editor, Category Views

### Task 6.1: Category Constants & Metadata

**Files:**
- Create: `src/shared/constants/categories.ts`
- Create: `src/shared/constants/scopes.ts`
- Create: `src/shared/constants/modifiers.ts`

- [ ] **Step 1: Create category metadata for all 51 categories**

```typescript
// src/shared/constants/categories.ts
import type { CategoryMeta, CategoryGroup } from '../types/categories';

export const CATEGORIES: CategoryMeta[] = [
  // Empire Design (11)
  { category: 'governments', group: 'empire', displayName: { en: 'Governments', it: 'Governi' }, icon: '🏛️' },
  { category: 'authorities', group: 'empire', displayName: { en: 'Authorities', it: 'Autorità' }, icon: '👑' },
  { category: 'civics', group: 'empire', displayName: { en: 'Civics', it: 'Civiche' }, icon: '📜' },
  { category: 'origins', group: 'empire', displayName: { en: 'Origins', it: 'Origini' }, icon: '🌟' },
  { category: 'ethics', group: 'empire', displayName: { en: 'Ethics', it: 'Etiche' }, icon: '⚖️' },
  { category: 'species_classes', group: 'empire', displayName: { en: 'Species Classes', it: 'Classi Specie' }, icon: '🧬' },
  { category: 'traits', group: 'empire', displayName: { en: 'Traits', it: 'Tratti' }, icon: '🧠' },
  { category: 'species_rights', group: 'empire', displayName: { en: 'Species Rights', it: 'Diritti Specie' }, icon: '✊' },
  { category: 'personalities', group: 'empire', displayName: { en: 'AI Personalities', it: 'Personalità AI' }, icon: '🤖' },
  { category: 'name_lists', group: 'empire', displayName: { en: 'Name Lists', it: 'Liste Nomi' }, icon: '📋' },
  { category: 'prescripted_countries', group: 'empire', displayName: { en: 'Prescripted Countries', it: 'Paesi Prescritti' }, icon: '🏴' },
  // Economy & Planets (10)
  { category: 'buildings', group: 'economy', displayName: { en: 'Buildings', it: 'Edifici' }, icon: '🏗️' },
  { category: 'districts', group: 'economy', displayName: { en: 'Districts', it: 'Distretti' }, icon: '🏘️' },
  { category: 'pop_jobs', group: 'economy', displayName: { en: 'Pop Jobs', it: 'Lavori Pop' }, icon: '👷' },
  { category: 'planet_classes', group: 'economy', displayName: { en: 'Planet Classes', it: 'Classi Pianeta' }, icon: '🌍' },
  { category: 'deposits', group: 'economy', displayName: { en: 'Deposits', it: 'Giacimenti' }, icon: '💎' },
  { category: 'decisions', group: 'economy', displayName: { en: 'Decisions', it: 'Decisioni' }, icon: '📝' },
  { category: 'pop_categories', group: 'economy', displayName: { en: 'Pop Categories', it: 'Categorie Pop' }, icon: '👥' },
  { category: 'economic_categories', group: 'economy', displayName: { en: 'Economic Categories', it: 'Categorie Economiche' }, icon: '💰' },
  { category: 'trade_conversions', group: 'economy', displayName: { en: 'Trade Conversions', it: 'Conversioni Commerciali' }, icon: '🔄' },
  { category: 'terraform', group: 'economy', displayName: { en: 'Terraform', it: 'Terraformazione' }, icon: '🌱' },
  // Tech & Traditions (6)
  { category: 'technologies', group: 'tech', displayName: { en: 'Technologies', it: 'Tecnologie' }, icon: '🔬' },
  { category: 'traditions', group: 'tech', displayName: { en: 'Traditions', it: 'Tradizioni' }, icon: '📿' },
  { category: 'ascension_perks', group: 'tech', displayName: { en: 'Ascension Perks', it: 'Perk Ascensione' }, icon: '⬆️' },
  { category: 'edicts', group: 'tech', displayName: { en: 'Edicts', it: 'Editti' }, icon: '📢' },
  { category: 'policies', group: 'tech', displayName: { en: 'Policies', it: 'Politiche' }, icon: '📰' },
  { category: 'agendas', group: 'tech', displayName: { en: 'Agendas', it: 'Agende' }, icon: '📅' },
  // Military (9)
  { category: 'ship_sizes', group: 'military', displayName: { en: 'Ship Sizes', it: 'Dimensioni Navi' }, icon: '🚀' },
  { category: 'component_templates', group: 'military', displayName: { en: 'Component Templates', it: 'Template Componenti' }, icon: '⚙️' },
  { category: 'section_templates', group: 'military', displayName: { en: 'Section Templates', it: 'Template Sezioni' }, icon: '🔧' },
  { category: 'armies', group: 'military', displayName: { en: 'Armies', it: 'Eserciti' }, icon: '⚔️' },
  { category: 'war_goals', group: 'military', displayName: { en: 'War Goals', it: 'Obiettivi di Guerra' }, icon: '🎯' },
  { category: 'casus_belli', group: 'military', displayName: { en: 'Casus Belli', it: 'Casus Belli' }, icon: '🏳️' },
  { category: 'bombardment_stances', group: 'military', displayName: { en: 'Bombardment Stances', it: 'Posizioni Bombardamento' }, icon: '💥' },
  { category: 'ship_behaviors', group: 'military', displayName: { en: 'Ship Behaviors', it: 'Comportamenti Nave' }, icon: '🎮' },
  { category: 'global_ship_designs', group: 'military', displayName: { en: 'Ship Designs', it: 'Design Navi' }, icon: '✏️' },
  // Exploration & Events (9)
  { category: 'events', group: 'exploration', displayName: { en: 'Events', it: 'Eventi' }, icon: '📖' },
  { category: 'anomalies', group: 'exploration', displayName: { en: 'Anomalies', it: 'Anomalie' }, icon: '❓' },
  { category: 'archaeological_sites', group: 'exploration', displayName: { en: 'Archaeological Sites', it: 'Siti Archeologici' }, icon: '🏺' },
  { category: 'relics', group: 'exploration', displayName: { en: 'Relics', it: 'Reliquie' }, icon: '🏆' },
  { category: 'on_actions', group: 'exploration', displayName: { en: 'On Actions', it: 'On Actions' }, icon: '⚡' },
  { category: 'solar_system_initializers', group: 'exploration', displayName: { en: 'System Initializers', it: 'Inizializzatori Sistemi' }, icon: '☀️' },
  { category: 'star_classes', group: 'exploration', displayName: { en: 'Star Classes', it: 'Classi Stella' }, icon: '⭐' },
  { category: 'ambient_objects', group: 'exploration', displayName: { en: 'Ambient Objects', it: 'Oggetti Ambiente' }, icon: '🌌' },
  { category: 'leader_classes', group: 'exploration', displayName: { en: 'Leader Classes', it: 'Classi Leader' }, icon: '👤' },
  // Scripting (9)
  { category: 'scripted_effects', group: 'scripting', displayName: { en: 'Scripted Effects', it: 'Effetti Script' }, icon: '⚡' },
  { category: 'scripted_triggers', group: 'scripting', displayName: { en: 'Scripted Triggers', it: 'Trigger Script' }, icon: '🎯' },
  { category: 'scripted_modifiers', group: 'scripting', displayName: { en: 'Scripted Modifiers', it: 'Modificatori Script' }, icon: '🔢' },
  { category: 'scripted_variables', group: 'scripting', displayName: { en: 'Scripted Variables', it: 'Variabili Script' }, icon: '📊' },
  { category: 'script_values', group: 'scripting', displayName: { en: 'Script Values', it: 'Valori Script' }, icon: '🔣' },
  { category: 'inline_scripts', group: 'scripting', displayName: { en: 'Inline Scripts', it: 'Script Inline' }, icon: '📄' },
  { category: 'defines', group: 'scripting', displayName: { en: 'Defines', it: 'Definizioni' }, icon: '🔧' },
  { category: 'static_modifiers', group: 'scripting', displayName: { en: 'Static Modifiers', it: 'Modificatori Statici' }, icon: '📌' },
  { category: 'random_names', group: 'scripting', displayName: { en: 'Random Names', it: 'Nomi Casuali' }, icon: '🎲' },
  // Graphics & UI (7)
  { category: 'icons', group: 'graphics', displayName: { en: 'Icons', it: 'Icone' }, icon: '🖼️' },
  { category: 'event_pictures', group: 'graphics', displayName: { en: 'Event Pictures', it: 'Immagini Evento' }, icon: '🎨' },
  { category: 'empire_flags', group: 'graphics', displayName: { en: 'Empire Flags', it: 'Bandiere Impero' }, icon: '🚩' },
  { category: 'loading_screens', group: 'graphics', displayName: { en: 'Loading Screens', it: 'Schermate Caricamento' }, icon: '🖥️' },
  { category: 'gui_files', group: 'graphics', displayName: { en: 'GUI Files', it: 'File GUI' }, icon: '🪟' },
  { category: 'sprite_libraries', group: 'graphics', displayName: { en: 'Sprite Libraries', it: 'Librerie Sprite' }, icon: '🎭' },
  { category: 'music_sound', group: 'graphics', displayName: { en: 'Music & Sound', it: 'Musica e Suoni' }, icon: '🎵' },
];

export const CATEGORY_GROUPS: { group: CategoryGroup; label: { en: string; it: string } }[] = [
  { group: 'empire', label: { en: 'Empire Design', it: 'Progettazione Impero' } },
  { group: 'economy', label: { en: 'Economy & Planets', it: 'Economia e Pianeti' } },
  { group: 'tech', label: { en: 'Tech & Traditions', it: 'Tech e Tradizioni' } },
  { group: 'military', label: { en: 'Military', it: 'Militare' } },
  { group: 'exploration', label: { en: 'Exploration & Events', it: 'Esplorazione e Eventi' } },
  { group: 'scripting', label: { en: 'Scripting', it: 'Scripting' } },
  { group: 'graphics', label: { en: 'Graphics & UI', it: 'Grafica e UI' } },
  { group: 'localisation', label: { en: 'Localisation', it: 'Localizzazione' } },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/constants/
git commit -m "feat: add category constants and metadata for all 51 categories"
```

### Task 6.2: Schema Registry & Representative Schemas

**Files:**
- Create: `src/shared/schemas/traitSchema.ts`
- Create: `src/shared/schemas/techSchema.ts`
- Create: `src/shared/schemas/eventSchema.ts`
- Create: `src/shared/schemas/buildingSchema.ts`
- Create: `src/shared/schemas/registry.ts`

- [ ] **Step 1: Create the 4 representative schemas from spec section 8.2**

Copy the exact schemas from the spec (traitSchema, techSchema, eventSchema, buildingSchema) into their respective files.

- [ ] **Step 2: Create minimal schemas for remaining 47 categories**

Each minimal schema has: `category`, `gameFolder`, `outputPath`, `displayName`, and 3-5 core fields (at minimum: `key` text field + 2-3 category-specific fields). These will be enhanced incrementally.

- [ ] **Step 3: Create schema registry**

```typescript
// src/shared/schemas/registry.ts
import type { CategorySchema } from '../types/categories';
import { traitSchema } from './traitSchema';
import { techSchema } from './techSchema';
import { eventSchema } from './eventSchema';
import { buildingSchema } from './buildingSchema';
// ... import all others

const schemas: Record<string, CategorySchema> = {
  traits: traitSchema,
  technologies: techSchema,
  events: eventSchema,
  buildings: buildingSchema,
  // ... all 51
};

export function getSchema(category: string): CategorySchema | undefined {
  return schemas[category];
}

export function getAllSchemas(): CategorySchema[] {
  return Object.values(schemas);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/schemas/
git commit -m "feat: add category schemas for all 51 categories with schema registry"
```

### Task 6.3: GenericEditor Component

**Files:**
- Create: `src/renderer/components/editors/GenericEditor.tsx`
- Create: `src/renderer/components/editors/CategoryListView.tsx`
- Create: `src/renderer/components/editors/__tests__/GenericEditor.test.tsx`

- [ ] **Step 1: Write GenericEditor tests**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenericEditor } from '../GenericEditor';
import { traitSchema } from '@shared/schemas/traitSchema';

describe('GenericEditor', () => {
  it('renders fields from schema', () => {
    render(<GenericEditor schema={traitSchema} item={{}} onChange={vi.fn()} />);
    expect(screen.getByText(/Trait ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Cost/i)).toBeInTheDocument();
  });
  it('groups fields by group property', () => {
    render(<GenericEditor schema={traitSchema} item={{}} onChange={vi.fn()} />);
    expect(screen.getByText(/General/i)).toBeInTheDocument();
    expect(screen.getByText(/Restrictions/i)).toBeInTheDocument();
  });
  it('calls onChange when a field is modified', () => {
    const onChange = vi.fn();
    render(<GenericEditor schema={traitSchema} item={{ key: 'test' }} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('test'), { target: { value: 'new_key' } });
    expect(onChange).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Implement GenericEditor**

Renders a form from any `CategorySchema`:
- Groups fields by `group` property into collapsible sections
- Renders appropriate input component for each `FieldType`:
  - `text` → Input
  - `number` → Input type="number"
  - `boolean` → Checkbox/Toggle
  - `select` → Select with options
  - `multiselect` → Multi-select with checkboxes
  - `modifier-list` → List of ModifierInput components
  - `trigger-block` → ConditionBuilder (placeholder until Chunk 7)
  - `effect-block` → ConditionBuilder (placeholder until Chunk 7)
  - `icon` → IconPicker
  - `color` → Color picker (HSV)
  - `reference` → Select populated from game data
  - `event-options` → Custom event options editor
  - `resource-block` → Resource cost/upkeep editor
- Shows tooltip on hover for fields with tooltip
- Conditional field visibility based on `condition` property

- [ ] **Step 3: Implement CategoryListView**

Grid of Cards showing all items in a category. "New" button. Empty state with "Create your first X" message. Click card → opens GenericEditor for that item.

- [ ] **Step 4: Run tests, commit**

```bash
npx vitest run src/renderer/components/editors/__tests__/
git add src/renderer/components/editors/
git commit -m "feat: add GenericEditor and CategoryListView for schema-driven editing"
```

---

## Chunk 7: Specialized Editors

### Task 7.1: Condition Builder (Trigger/Effect Block Builder)

**Files:**
- Create: `src/renderer/components/condition-builder/ConditionBuilder.tsx`
- Create: `src/renderer/components/condition-builder/TriggerBlock.tsx`
- Create: `src/renderer/components/condition-builder/EffectBlock.tsx`
- Create: `src/renderer/components/condition-builder/ScopeBlock.tsx`
- Create: `src/renderer/components/condition-builder/LogicBlock.tsx`
- Create: `src/renderer/components/condition-builder/ComparisonBlock.tsx`
- Create: `src/renderer/components/condition-builder/BlockPalette.tsx`
- Create: `src/renderer/components/condition-builder/conditionSerializer.ts`
- Create: `src/renderer/components/condition-builder/__tests__/conditionSerializer.test.ts`

- [ ] **Step 1: Implement BlockPalette** — searchable palette of available triggers, effects, scopes, logic, and comparison blocks. Categorized by type with color coding per spec section 9.2: triggers=blue, effects=green, logic=gray (AND/OR/NOT/NOR/NAND), scopes=orange, comparisons=yellow (>, <, >=, <=, =).

- [ ] **Step 2: Implement all 5 block types** — TriggerBlock, EffectBlock, ScopeBlock, LogicBlock (AND/OR/NOT/NOR/NAND wrappers), ComparisonBlock (operator + left/right value). Each block is nestable, has typed parameter inputs, and can contain child blocks via drag-to-reorder.

- [ ] **Step 3: Implement conditionSerializer** — converts Block[] tree to indented Paradox script. Pure function, unit-testable.

- [ ] **Step 4: Implement ConditionBuilder** — main component combining BlockPalette (left) and builder canvas (center). Supports drag-and-drop from palette to canvas, nesting, and real-time code generation via conditionSerializer.

- [ ] **Step 5: Integrate with GenericEditor** — wire ConditionBuilder as the renderer for `trigger-block` and `effect-block` FieldTypes in GenericEditor, replacing the placeholder stubs from Chunk 6.

- [ ] **Step 6: Write tests for conditionSerializer** — test block nesting, all 5 block types, code generation output.

- [ ] **Step 7: Commit**

```bash
git add src/renderer/components/condition-builder/
git commit -m "feat: add visual condition builder for Paradox triggers and effects"
```

### Task 7.2: Event Node Editor

**Files:**
- Create: `src/renderer/components/node-editor/EventNodeEditor.tsx`
- Create: `src/renderer/components/node-editor/EventNode.tsx`
- Create: `src/renderer/components/node-editor/OptionEdge.tsx`
- Create: `src/renderer/components/node-editor/NodeInspector.tsx`

- [ ] **Step 1: Implement EventNode** — custom React Flow node showing event ID, title, type badge (colored), option count. Has output ports for each option.

- [ ] **Step 2: Implement OptionEdge** — custom React Flow edge with label showing option text.

- [ ] **Step 3: Implement NodeInspector** — side panel that opens when a node is selected. Shows full event editor form (using GenericEditor with eventSchema), option list with trigger/effect blocks.

- [ ] **Step 4: Implement EventNodeEditor** — main canvas with React Flow, minimap, controls. Context menu for add/delete/duplicate. Drag from option port creates new connected event.

- [ ] **Step 5: Write tests** — test EventNode rendering, edge creation from option ports, NodeInspector form binding.

- [ ] **Step 6: Commit**

```bash
git add src/renderer/components/node-editor/
git commit -m "feat: add visual event chain node editor with React Flow"
```

### Task 7.3: Planet Editor (3D)

**Files:**
- Create: `src/renderer/components/planet-editor/PlanetEditor.tsx`
- Create: `src/renderer/components/planet-editor/PlanetPreview.tsx`
- Create: `src/renderer/components/planet-editor/AtmosphereControls.tsx`
- Create: `src/renderer/components/planet-editor/TextureManager.tsx`
- Create: `src/renderer/components/planet-editor/CloudLayerEditor.tsx`

- [ ] **Step 1: Install simplex-noise**

```bash
npm install simplex-noise
```

- [ ] **Step 2: Implement PlanetPreview** — Three.js sphere with orbit controls, diffuse/normal/specular texture slots, atmosphere glow shader, cloud layer, auto-rotation. Preview modes per spec section 9.3: day side, night side, orbit view, colony sky view.

- [ ] **Step 3: Implement TextureManager** — separate import slots for surface texture, normal map, and specular map (PNG/JPG/DDS auto-converted). Procedural texture generator using simplex noise with color stops, roughness, water level, scale, seed parameters. Output: 2048x1024 equirectangular PNG per texture slot.

- [ ] **Step 4: Implement AtmosphereControls** — HSV color picker, intensity slider (0-2), width slider (0-1.5), live preview updates.

- [ ] **Step 5: Implement CloudLayerEditor** — enable/disable toggle, texture import/generation, opacity and rotation speed sliders.

- [ ] **Step 6: Implement CityLightsEditor** — per spec section 9.3: color correction LUT selector for city lights on night side.

- [ ] **Step 7: Implement PlanetEditor** — main component combining PlanetPreview (left/center) and controls panel (right) with planet class settings, texture management (surface/normal/specular), atmosphere, clouds, city lights, and 4 preview modes (day/night/orbit/colony sky).

- [ ] **Step 8: Write tests, commit**

```bash
git add src/renderer/components/planet-editor/
git commit -m "feat: add 3D planet editor with Three.js rendering and procedural textures"
```

### Task 7.4: Portrait Editor

**Files:**
- Create: `src/renderer/components/portrait-editor/PortraitEditor.tsx`
- Create: `src/renderer/components/portrait-editor/StaticPortraitManager.tsx`
- Create: `src/renderer/components/portrait-editor/AnimatedPortraitDefs.tsx`
- Create: `src/renderer/components/portrait-editor/PortraitPreview.tsx`

- [ ] **Step 1: Implement StaticPortraitManager** — import images (PNG/JPG), crop/resize, background removal via threshold alpha masking (Canvas API getImageData/putImageData). Auto-generate definition files per spec section 9.4: species_class entries, portrait_sets, portrait_categories, and .gfx sprite definitions (spriteType with texturefile paths).

- [ ] **Step 2: Implement AnimatedPortraitDefs** — entity definition editor (.asset), clothes/hair selector configuration, animation state editor (idle, talking), static fallback preview.

- [ ] **Step 3: Implement PortraitPreview** — species selection screen frame mockup showing how portrait looks in-game.

- [ ] **Step 4: Implement PortraitEditor** — tabbed interface: Static mode / Animated mode.

- [ ] **Step 5: Write tests, commit**

```bash
git add src/renderer/components/portrait-editor/
git commit -m "feat: add portrait editor with static import and animated portrait definitions"
```

### Task 7.5: Localisation Editor

**Files:**
- Create: `src/renderer/components/localisation/LocalisationEditor.tsx`
- Create: `src/renderer/components/localisation/LanguageTable.tsx`

- [ ] **Step 1: Implement LanguageTable** — spreadsheet-style table with dynamic language columns. Supports all 10 Stellaris languages per spec section 9.5: English, French, German, Spanish, Russian, Polish, Brazilian Portuguese, Chinese, Japanese, Korean (+ Italian for StellarForge). Editable cells. Search/filter. Missing translation highlighting (yellow). Sortable by key or completion status.

- [ ] **Step 2: Implement LocalisationEditor** — wraps LanguageTable, provides "Add Key" button, auto-generates keys from item definitions (e.g. `trait_x` + `trait_x_desc`), language column visibility picker (user selects which of 11 languages to show), import/export .yml per language.

- [ ] **Step 3: Write tests, commit**

```bash
git add src/renderer/components/localisation/
git commit -m "feat: add localisation editor with multi-language table"
```

### Task 7.6: Theme Creator

**Files:**
- Create: `src/renderer/components/theme-creator/ThemeCreator.tsx`
- Create: `src/renderer/components/theme-creator/ColorPicker.tsx`
- Create: `src/renderer/components/theme-creator/ThemePreview.tsx`

- [ ] **Step 1: Implement ColorPicker** — color swatch + hex input + native color picker overlay. Reusable for each CSS custom property.

- [ ] **Step 2: Implement ThemePreview** — miniature mockup of the StellarForge UI (title bar, sidebar, card, button) rendered with the custom theme's CSS variables. Live-updates as colors change.

- [ ] **Step 3: Implement ThemeCreator** — left: list of saved themes (built-in 5 + custom). Center: color pickers for all CSS custom properties grouped by category (backgrounds, text, accent, status). Right: ThemePreview. Export/import as JSON. Save per-project or globally.

- [ ] **Step 4: Write tests** — test themeToCSS/cssToTheme round-trip, validateTheme, color field coverage.

- [ ] **Step 5: Commit**

```bash
git add src/renderer/components/theme-creator/
git commit -m "feat: add theme creator with live preview and import/export"
```

---

## Chunk 8: Export, Validation & Integration

### Task 8.1: Mod Exporter

**Files:**
- Create: `src/main/services/ModExporter.ts`
- Create: `src/main/services/__tests__/ModExporter.test.ts`
- Create: `src/main/ipc/exportHandler.ts`

- [ ] **Step 1: Write ModExporter tests**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ModExporter } from '../ModExporter';
import fs from 'fs';
import path from 'path';
import os from 'os';

const OUT_DIR = path.join(os.tmpdir(), 'sf-test-export');

describe('ModExporter', () => {
  beforeEach(() => fs.mkdirSync(OUT_DIR, { recursive: true }));
  afterEach(() => fs.rmSync(OUT_DIR, { recursive: true, force: true }));

  const testProject = {
    name: 'TestMod',
    version: '1.0',
    stellarisVersion: '3.12.*',
    tags: ['Gameplay'],
    items: {
      trait: { trait_smart: { key: 'trait_smart', cost: 2, modifiers: {} } },
    },
    localisation: [
      { key: 'trait_smart', translations: { english: 'Intelligent' } },
    ],
    assets: [],
  };

  it('generates descriptor.mod', () => {
    const result = ModExporter.exportMod(testProject, OUT_DIR);
    expect(fs.existsSync(path.join(OUT_DIR, 'descriptor.mod'))).toBe(true);
  });

  it('backs up existing files before overwrite', () => {
    // First export
    ModExporter.exportMod(testProject, OUT_DIR);
    // Second export should back up
    ModExporter.exportMod(testProject, OUT_DIR);
    const backupDir = path.join(OUT_DIR, '.sfg_backup');
    expect(fs.existsSync(backupDir)).toBe(true);
  });

  it('generates category .txt files', () => {
    const result = ModExporter.exportMod(testProject, OUT_DIR);
    expect(fs.existsSync(path.join(OUT_DIR, 'common/traits/sfg_traits.txt'))).toBe(true);
  });

  it('generates localisation .yml files with BOM', () => {
    const result = ModExporter.exportMod(testProject, OUT_DIR);
    const content = fs.readFileSync(path.join(OUT_DIR, 'localisation/english/sfg_l_english.yml'));
    expect(content[0]).toBe(0xEF); // BOM byte
  });
});
```

- [ ] **Step 2: Implement ModExporter**

Full export pipeline per spec section 6:
1. Validate project
2. If output mod directory exists, back up to `{mod_dir}/.sfg_backup/` before overwrite
3. Create mod folder structure
4. Serialize all items using ParadoxSerializer, writing to correct output paths (per spec section 6.3 mapping table)
5. Generate localisation .yml files (UTF-8-BOM)
6. Copy/convert asset files
7. Generate descriptor.mod (inside mod folder, without `path`) — must match spec section 6.2 template exactly
8. Generate .mod file (in parent directory, with `path`)
9. Return ExportResult with warnings/errors/file count

- [ ] **Step 3: Create export IPC handler and register**

- [ ] **Step 4: Run tests, commit**

```bash
npx vitest run src/main/services/__tests__/ModExporter.test.ts
git add src/main/services/ModExporter.ts src/main/services/__tests__/ModExporter.test.ts src/main/ipc/exportHandler.ts
git commit -m "feat: implement mod exporter with full pipeline and descriptor generation"
```

### Task 8.2: Validation Engine

**Files:**
- Create: `src/main/services/Validator.ts`
- Create: `src/main/services/__tests__/Validator.test.ts`

- [ ] **Step 1: Implement syntax + schema validation** — Level 1: parse Paradox script for syntax errors. Level 2: check required fields, value types, enum constraints from CategorySchema.

- [ ] **Step 2: Implement reference + balance + compat validation** — Level 3: verify referenced objects exist (prerequisite techs, trigger scopes). Level 4: balance heuristics (cost/tier ratios, modifier ranges). Level 5: Stellaris version compatibility warnings.

- [ ] **Step 3: Define ValidationResult output format** — structured data with severity (error/warning/info), field path, line number, and message. Must support 4 display modes per spec section 10.2: inline form underlines, Monaco squiggly decorations, status bar summary counts, and validation panel list.

- [ ] **Step 4: Write tests** — test each validation level independently with valid/invalid fixtures.

- [ ] **Step 5: Commit**

```bash
git add src/main/services/Validator.ts src/main/services/__tests__/Validator.test.ts
git commit -m "feat: implement mod validation engine with 5 validation levels"
```

### Task 8.3: DDS Converter & Asset Pipeline

**Files:**
- Create: `src/main/services/DdsConverter.ts`
- Create: `src/main/ipc/ddsHandler.ts`

- [ ] **Step 1: Implement DdsConverter** per spec section 14. Two encoder paths with fallback logic:
  - Primary: `texconv.exe` (bundled or user-provided) for DXT5 compression
  - Fallback: `dds.js` for A8R8G8B8 uncompressed when texconv unavailable
  - Auto-detect texconv availability at startup, store in settings
  - Conversion specs: Icons: A8R8G8B8, 29x29 (+ 36x36, 24x24 variants). Event pictures: DXT5, 480x300. Portraits: A8R8G8B8 with alpha. Planet textures: DXT5, power-of-2.

- [ ] **Step 2: Write tests** — test chooseEncoder logic, buildOutputPath, conversion spec constants.

- [ ] **Step 3: Create DDS IPC handler, commit**

```bash
git add src/main/services/DdsConverter.ts src/main/ipc/ddsHandler.ts
git commit -m "feat: add DDS conversion pipeline with sharp and dds.js"
```

### Task 8.4: Test Generator

**Files:**
- Create: `src/main/services/TestGenerator.ts`

- [ ] **Step 1: Write TestGenerator tests** — verify research_technology commands for techs, event spawn commands, add_trait_species commands, header comment format.

- [ ] **Step 2: Implement TestGenerator** — generates Stellaris console commands per spec section 10.3 (research_technology, event, add_trait_species, create_building, cash/minerals).

- [ ] **Step 3: Run tests, commit**

```bash
git add src/main/services/TestGenerator.ts
git commit -m "feat: add test command generator for in-game testing"
```

### Task 8.5: Steam Workshop Manager

**Files:**
- Create: `src/main/services/WorkshopManager.ts`
- Create: `src/main/ipc/workshopHandler.ts`

- [ ] **Step 1: Implement WorkshopManager** using steamworks.js. Upload/update flows per spec section 13. Graceful fallback when Steam not running. Validate user owns Stellaris (appId 281990). For GOG users: hide Workshop UI entirely and only show local export option.

- [ ] **Step 2: Register IPC handlers, commit**

```bash
git add src/main/services/WorkshopManager.ts src/main/ipc/workshopHandler.ts
git commit -m "feat: add Steam Workshop integration via steamworks.js"
```

### Task 8.6: Export View UI

**Files:**
- Create: `src/renderer/components/project/ExportView.tsx`

- [ ] **Step 1: Implement ExportView** — validation summary, export options (local/workshop), progress indicator, result summary with file count and warnings.

- [ ] **Step 2: Add export route in App.tsx** — add `/export` route for ExportView. (Category routes were already wired in Chunk 6; settings route in Chunk 5.)

- [ ] **Step 3: Final integration commit**

```bash
git add src/renderer/components/project/ExportView.tsx src/renderer/App.tsx
git commit -m "feat: add export view UI and complete app routing"
```
