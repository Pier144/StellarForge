import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../projectStore';

describe('projectStore', () => {
  beforeEach(() => { useProjectStore.getState().reset(); });

  it('starts with null project', () => {
    expect(useProjectStore.getState().project).toBeNull();
  });

  it('sets and gets project', () => {
    const project = { metadata: { name: 'Test' } } as any;
    useProjectStore.getState().setProject(project);
    expect(useProjectStore.getState().project?.metadata.name).toBe('Test');
  });

  it('updates an item in a category', () => {
    useProjectStore.getState().setProject({ metadata: {} as any, items: {}, localisation: {}, assets: {} as any });
    useProjectStore.getState().setItem('traits', 'trait_test', { cost: 2 });
    expect(useProjectStore.getState().project!.items.traits.trait_test).toEqual({ cost: 2 });
  });

  it('deletes an item', () => {
    useProjectStore.getState().setProject({ metadata: {} as any, items: { traits: { trait_test: { cost: 2 } } }, localisation: {}, assets: {} as any });
    useProjectStore.getState().deleteItem('traits', 'trait_test');
    expect(useProjectStore.getState().project!.items.traits.trait_test).toBeUndefined();
  });

  it('supports undo/redo', () => {
    useProjectStore.getState().setProject({ metadata: {} as any, items: {}, localisation: {}, assets: {} as any });
    useProjectStore.getState().setItem('traits', 't1', { cost: 1 });
    useProjectStore.getState().setItem('traits', 't1', { cost: 5 });
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().project!.items.traits.t1.cost).toBe(1);
    useProjectStore.getState().redo();
    expect(useProjectStore.getState().project!.items.traits.t1.cost).toBe(5);
  });
});
