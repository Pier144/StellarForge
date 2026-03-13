// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProjectManager } from '../ProjectManager';
import fs from 'fs';
import path from 'path';
import os from 'os';

const TEST_DIR = path.join(os.tmpdir(), 'sf-test-projects');

describe('ProjectManager', () => {
  beforeEach(() => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('creates a new project with correct structure', () => {
    const projectPath = path.join(TEST_DIR, 'TestMod.sfproj');
    ProjectManager.createProject(projectPath, {
      name: 'Test Mod',
      internalName: 'test_mod',
      version: '1.0.0',
      stellarisVersion: '3.12.*',
      tags: ['Gameplay'],
      description: 'A test',
      author: 'Tester',
    });

    expect(fs.existsSync(path.join(projectPath, 'project.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'items'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'localisation'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'assets'))).toBe(true);
  });

  it('saves and loads a project', () => {
    const projectPath = path.join(TEST_DIR, 'TestMod.sfproj');
    const project = ProjectManager.createProject(projectPath, {
      name: 'Test Mod',
      internalName: 'test_mod',
      version: '1.0.0',
      stellarisVersion: '3.12.*',
      tags: [],
      description: '',
      author: '',
    });

    project.items.traits = { trait_test: { cost: 2, initial: true } };
    ProjectManager.saveProject(projectPath, project);

    const loaded = ProjectManager.loadProject(projectPath);
    expect(loaded.metadata.name).toBe('Test Mod');
    expect(loaded.items.traits).toBeDefined();
    expect(loaded.items.traits.trait_test).toEqual({ cost: 2, initial: true });
  });

  it('exports project as .sfpkg', async () => {
    const projectPath = path.join(TEST_DIR, 'TestMod.sfproj');
    ProjectManager.createProject(projectPath, {
      name: 'Test Mod',
      internalName: 'test_mod',
      version: '1.0.0',
      stellarisVersion: '3.12.*',
      tags: [],
      description: '',
      author: '',
    });

    const pkgPath = path.join(TEST_DIR, 'TestMod.sfpkg');
    await ProjectManager.exportPackage(projectPath, pkgPath);
    expect(fs.existsSync(pkgPath)).toBe(true);
  });
});
