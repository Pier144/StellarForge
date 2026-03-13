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
    pickDirectory: () => Promise<string | null>;
    create: (projectPath: string, options: { name: string; author: string; stellarisVersion: string; tags?: string[] }) => Promise<Project>;
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
