// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameDataDb } from '../GameDataIndex';
import path from 'path';
import fs from 'fs';

const TEST_DB = path.join(__dirname, 'test_gamedata.db');

describe('GameDataDb', () => {
  let db: GameDataDb;

  beforeEach(() => {
    db = new GameDataDb(TEST_DB);
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
  });

  it('creates tables on init', () => {
    const tables = db.listTables();
    expect(tables).toContain('game_objects');
    expect(tables).toContain('modifiers');
    expect(tables).toContain('triggers');
    expect(tables).toContain('effects');
    expect(tables).toContain('localisation');
    expect(tables).toContain('icons');
  });

  it('inserts and retrieves a game object', () => {
    db.insertGameObject({
      category: 'trait',
      objectKey: 'trait_intelligent',
      filePath: 'common/traits/00_traits.txt',
      parsedData: '{"key":"trait_intelligent"}',
      dlc: null,
    });
    const result = db.getObjectsByCategory('trait');
    expect(result).toHaveLength(1);
    expect(result[0].objectKey).toBe('trait_intelligent');
  });

  it('searches objects by key prefix', () => {
    db.insertGameObject({ category: 'trait', objectKey: 'trait_intelligent', filePath: 'f', parsedData: '{}', dlc: null });
    db.insertGameObject({ category: 'trait', objectKey: 'trait_strong', filePath: 'f', parsedData: '{}', dlc: null });
    db.insertGameObject({ category: 'technology', objectKey: 'tech_lasers_1', filePath: 'f', parsedData: '{}', dlc: null });
    const results = db.searchObjects('trait_');
    expect(results).toHaveLength(2);
  });

  it('inserts and retrieves localisation', () => {
    db.insertLocalisation('trait_intelligent', 'l_english', 'Intelligent');
    db.insertLocalisation('trait_intelligent', 'l_italian', 'Intelligente');
    const en = db.getLocalisation('trait_intelligent', 'l_english');
    expect(en).toBe('Intelligent');
  });

  it('clears all data', () => {
    db.insertGameObject({ category: 'trait', objectKey: 'test', filePath: 'f', parsedData: '{}', dlc: null });
    db.clearAll();
    expect(db.getObjectsByCategory('trait')).toHaveLength(0);
  });
});
