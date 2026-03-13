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

    fs.writeFileSync(path.join(projectPath, 'project.json'), JSON.stringify(metadata, null, 2));

    return project;
  }

  static saveProject(projectPath: string, project: Project): void {
    project.metadata.lastModified = new Date().toISOString();
    fs.writeFileSync(path.join(projectPath, 'project.json'), JSON.stringify(project.metadata, null, 2));

    for (const [category, items] of Object.entries(project.items)) {
      fs.writeFileSync(
        path.join(projectPath, 'items', `${category}.json`),
        JSON.stringify(items, null, 2)
      );
    }

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
    const files = fs.readdirSync(extractDir);
    const sfprojFile = files.find(f => f.endsWith('.sfproj'));
    if (!sfprojFile) throw new Error('No .sfproj file found in package');
    return path.join(extractDir, sfprojFile);
  }
}
