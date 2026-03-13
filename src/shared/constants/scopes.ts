// src/shared/constants/scopes.ts
// Stellaris scope types used by triggers and effects
export const SCOPES = [
  'country', 'planet', 'system', 'fleet', 'ship', 'pop', 'leader', 'army',
  'species', 'war', 'federation', 'galactic_object', 'sector', 'megastructure',
  'starbase', 'deposit', 'archaeological_site', 'first_contact', 'spy_network',
  'espionage_operation', 'agreement', 'astral_rift', 'no_scope',
] as const;

export type ScopeType = typeof SCOPES[number];

export const SCOPE_TRANSITIONS: Record<string, ScopeType[]> = {
  country: ['planet', 'fleet', 'leader', 'pop', 'species', 'federation', 'sector'],
  planet: ['country', 'pop', 'system', 'army', 'deposit'],
  system: ['planet', 'fleet', 'starbase', 'country'],
  fleet: ['country', 'ship', 'system', 'leader'],
  ship: ['fleet', 'leader'],
  pop: ['planet', 'country', 'species'],
  leader: ['country'],
  species: ['country'],
};
