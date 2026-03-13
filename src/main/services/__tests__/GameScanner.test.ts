// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameScanner } from '../GameScanner';
import fs from 'fs';
import path from 'path';
import os from 'os';

const FIXTURE_DIR = path.join(os.tmpdir(), 'sf-test-game');

function setupFixture() {
  fs.mkdirSync(path.join(FIXTURE_DIR, 'common/traits'), { recursive: true });
  fs.mkdirSync(path.join(FIXTURE_DIR, 'events'), { recursive: true });
  fs.mkdirSync(path.join(FIXTURE_DIR, 'localisation/english'), { recursive: true });

  fs.writeFileSync(path.join(FIXTURE_DIR, 'common/traits/00_traits.txt'),
    `trait_intelligent = {\n\tcost = 2\n\tallowed_archetypes = { BIOLOGICAL }\n}\n`);

  fs.writeFileSync(path.join(FIXTURE_DIR, 'localisation/english/l_english.yml'),
    `\uFEFFl_english:\n trait_intelligent: "Intelligent"\n trait_intelligent_desc: "This species is smart."\n`);
}

function cleanupFixture() {
  fs.rmSync(FIXTURE_DIR, { recursive: true, force: true });
}

describe('GameScanner', () => {
  beforeEach(setupFixture);
  afterEach(cleanupFixture);

  it('validates a valid game directory', () => {
    expect(GameScanner.validateGamePath(FIXTURE_DIR)).toBe(true);
  });

  it('rejects invalid game directory', () => {
    expect(GameScanner.validateGamePath('/nonexistent')).toBe(false);
  });

  it('scans common/ directory and finds objects', async () => {
    const scanner = new GameScanner(FIXTURE_DIR);
    const results = await scanner.scanCategory('common/traits', 'trait');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].objectKey).toBe('trait_intelligent');
  });

  it('scans localisation files', async () => {
    const scanner = new GameScanner(FIXTURE_DIR);
    const results = await scanner.scanLocalisation();
    expect(results.length).toBeGreaterThan(0);
  });
});
