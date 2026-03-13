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
