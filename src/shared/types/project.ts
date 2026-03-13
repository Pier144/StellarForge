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
