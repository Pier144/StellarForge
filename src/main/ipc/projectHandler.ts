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
    return ProjectManager.createProject(projectPath, {
      name: options.name,
      internalName: options.name.toLowerCase().replace(/\s+/g, '_'),
      version: '1.0.0',
      stellarisVersion: options.stellarisVersion,
      tags: options.tags ?? [],
      description: '',
      author: options.author,
    });
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
