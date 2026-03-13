import fs from 'fs';
import path from 'path';
import { parse } from './ParadoxParser';

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
