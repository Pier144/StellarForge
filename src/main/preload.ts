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
    pickDirectory: () => ipcRenderer.invoke('project:pick-directory'),
    create: (projectPath, options) => ipcRenderer.invoke('project:create', projectPath, options),
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
