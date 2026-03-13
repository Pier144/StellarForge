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
