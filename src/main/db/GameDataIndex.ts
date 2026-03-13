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
