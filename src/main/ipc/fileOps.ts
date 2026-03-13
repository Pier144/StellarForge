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
