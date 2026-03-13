// src/shared/constants/modifiers.ts
// Common Stellaris modifiers grouped by category
export interface ModifierDef {
  key: string;
  label: { en: string; it: string };
  type: 'additive' | 'multiplicative' | 'boolean';
  scope: string;
  min?: number;
  max?: number;
}

export const MODIFIERS: ModifierDef[] = [
  // Resources
  { key: 'planet_jobs_energy_produces_mult', label: { en: 'Energy Production', it: 'Produzione Energia' }, type: 'multiplicative', scope: 'planet' },
  { key: 'planet_jobs_minerals_produces_mult', label: { en: 'Minerals Production', it: 'Produzione Minerali' }, type: 'multiplicative', scope: 'planet' },
  { key: 'planet_jobs_food_produces_mult', label: { en: 'Food Production', it: 'Produzione Cibo' }, type: 'multiplicative', scope: 'planet' },
  { key: 'planet_jobs_alloys_produces_mult', label: { en: 'Alloys Production', it: 'Produzione Leghe' }, type: 'multiplicative', scope: 'planet' },
  { key: 'planet_jobs_consumer_goods_produces_mult', label: { en: 'Consumer Goods Production', it: 'Prod. Beni Consumo' }, type: 'multiplicative', scope: 'planet' },
  // Research
  { key: 'planet_jobs_physics_research_produces_mult', label: { en: 'Physics Research', it: 'Ricerca Fisica' }, type: 'multiplicative', scope: 'planet' },
  { key: 'planet_jobs_society_research_produces_mult', label: { en: 'Society Research', it: 'Ricerca Società' }, type: 'multiplicative', scope: 'planet' },
  { key: 'planet_jobs_engineering_research_produces_mult', label: { en: 'Engineering Research', it: 'Ricerca Ingegneria' }, type: 'multiplicative', scope: 'planet' },
  // Empire-wide
  { key: 'country_resource_max_energy_add', label: { en: 'Max Energy Storage', it: 'Stoccaggio Max Energia' }, type: 'additive', scope: 'country' },
  { key: 'country_resource_max_minerals_add', label: { en: 'Max Mineral Storage', it: 'Stoccaggio Max Minerali' }, type: 'additive', scope: 'country' },
  { key: 'country_naval_cap_add', label: { en: 'Naval Capacity', it: 'Capacità Navale' }, type: 'additive', scope: 'country' },
  { key: 'country_starbase_capacity_add', label: { en: 'Starbase Capacity', it: 'Capacità Basi Stellari' }, type: 'additive', scope: 'country' },
  // Pop
  { key: 'pop_happiness', label: { en: 'Pop Happiness', it: 'Felicità Pop' }, type: 'additive', scope: 'pop', min: -1, max: 1 },
  { key: 'pop_growth_speed', label: { en: 'Pop Growth Speed', it: 'Velocità Crescita Pop' }, type: 'multiplicative', scope: 'planet' },
  { key: 'pop_amenities_usage_mult', label: { en: 'Amenity Usage', it: 'Utilizzo Comfort' }, type: 'multiplicative', scope: 'pop' },
  // Military
  { key: 'ship_fire_rate_mult', label: { en: 'Ship Fire Rate', it: 'Cadenza Fuoco Nave' }, type: 'multiplicative', scope: 'ship' },
  { key: 'ship_hull_mult', label: { en: 'Ship Hull', it: 'Scafo Nave' }, type: 'multiplicative', scope: 'ship' },
  { key: 'ship_armor_mult', label: { en: 'Ship Armor', it: 'Armatura Nave' }, type: 'multiplicative', scope: 'ship' },
  { key: 'ship_shield_mult', label: { en: 'Ship Shields', it: 'Scudi Nave' }, type: 'multiplicative', scope: 'ship' },
  { key: 'army_damage_mult', label: { en: 'Army Damage', it: 'Danno Esercito' }, type: 'multiplicative', scope: 'army' },
  // Leader
  { key: 'leader_age', label: { en: 'Leader Lifespan', it: 'Aspettativa Vita Leader' }, type: 'additive', scope: 'leader' },
  { key: 'species_leader_exp_gain', label: { en: 'Leader XP Gain', it: 'Guadagno XP Leader' }, type: 'multiplicative', scope: 'species' },
];

export const MODIFIER_GROUPS = [
  { key: 'resources', label: { en: 'Resources', it: 'Risorse' } },
  { key: 'research', label: { en: 'Research', it: 'Ricerca' } },
  { key: 'empire', label: { en: 'Empire', it: 'Impero' } },
  { key: 'pop', label: { en: 'Population', it: 'Popolazione' } },
  { key: 'military', label: { en: 'Military', it: 'Militare' } },
  { key: 'leader', label: { en: 'Leader', it: 'Leader' } },
] as const;
