// src/shared/schemas/registry.ts
import type { CategorySchema } from '../types/categories';
import { traitSchema } from './traitSchema';
import { techSchema } from './techSchema';
import { eventSchema } from './eventSchema';
import { buildingSchema } from './buildingSchema';
import { governmentsSchema } from './governmentsSchema';
import { authoritiesSchema } from './authoritiesSchema';
import { civicsSchema } from './civicsSchema';
import { originsSchema } from './originsSchema';
import { ethicsSchema } from './ethicsSchema';
import { speciesClassesSchema } from './speciesClassesSchema';
import { speciesRightsSchema } from './speciesRightsSchema';
import { personalitiesSchema } from './personalitiesSchema';
import { nameListsSchema } from './nameListsSchema';
import { prescriptedCountriesSchema } from './prescriptedCountriesSchema';
import { districtsSchema } from './districtsSchema';
import { popJobsSchema } from './popJobsSchema';
import { planetClassesSchema } from './planetClassesSchema';
import { depositsSchema } from './depositsSchema';
import { decisionsSchema } from './decisionsSchema';
import { popCategoriesSchema } from './popCategoriesSchema';
import { economicCategoriesSchema } from './economicCategoriesSchema';
import { tradeConversionsSchema } from './tradeConversionsSchema';
import { terraformSchema } from './terraformSchema';
import { traditionsSchema } from './traditionsSchema';
import { ascensionPerksSchema } from './ascensionPerksSchema';
import { edictsSchema } from './edictsSchema';
import { policiesSchema } from './policiesSchema';
import { agendasSchema } from './agendasSchema';
import { shipSizesSchema } from './shipSizesSchema';
import { componentTemplatesSchema } from './componentTemplatesSchema';
import { sectionTemplatesSchema } from './sectionTemplatesSchema';
import { armiesSchema } from './armiesSchema';
import { warGoalsSchema } from './warGoalsSchema';
import { casusBelliSchema } from './casusBelliSchema';
import { bombardmentStancesSchema } from './bombardmentStancesSchema';
import { shipBehaviorsSchema } from './shipBehaviorsSchema';
import { globalShipDesignsSchema } from './globalShipDesignsSchema';
import { anomaliesSchema } from './anomaliesSchema';
import { archaeologicalSitesSchema } from './archaeologicalSitesSchema';
import { relicsSchema } from './relicsSchema';
import { onActionsSchema } from './onActionsSchema';
import { solarSystemInitializersSchema } from './solarSystemInitializersSchema';
import { starClassesSchema } from './starClassesSchema';
import { ambientObjectsSchema } from './ambientObjectsSchema';
import { leaderClassesSchema } from './leaderClassesSchema';
import { scriptedEffectsSchema } from './scriptedEffectsSchema';
import { scriptedTriggersSchema } from './scriptedTriggersSchema';
import { scriptedModifiersSchema } from './scriptedModifiersSchema';
import { scriptedVariablesSchema } from './scriptedVariablesSchema';
import { scriptValuesSchema } from './scriptValuesSchema';
import { inlineScriptsSchema } from './inlineScriptsSchema';
import { definesSchema } from './definesSchema';
import { staticModifiersSchema } from './staticModifiersSchema';
import { randomNamesSchema } from './randomNamesSchema';
import { iconsSchema } from './iconsSchema';
import { eventPicturesSchema } from './eventPicturesSchema';
import { empireFlagsSchema } from './empireFlagsSchema';
import { loadingScreensSchema } from './loadingScreensSchema';
import { guiFilesSchema } from './guiFilesSchema';
import { spriteLibrariesSchema } from './spriteLibrariesSchema';
import { musicSoundSchema } from './musicSoundSchema';

const schemas: Record<string, CategorySchema> = {
  // Empire Design
  governments: governmentsSchema,
  authorities: authoritiesSchema,
  civics: civicsSchema,
  origins: originsSchema,
  ethics: ethicsSchema,
  species_classes: speciesClassesSchema,
  traits: traitSchema,
  species_rights: speciesRightsSchema,
  personalities: personalitiesSchema,
  name_lists: nameListsSchema,
  prescripted_countries: prescriptedCountriesSchema,
  // Economy & Planets
  buildings: buildingSchema,
  districts: districtsSchema,
  pop_jobs: popJobsSchema,
  planet_classes: planetClassesSchema,
  deposits: depositsSchema,
  decisions: decisionsSchema,
  pop_categories: popCategoriesSchema,
  economic_categories: economicCategoriesSchema,
  trade_conversions: tradeConversionsSchema,
  terraform: terraformSchema,
  // Tech & Traditions
  technologies: techSchema,
  traditions: traditionsSchema,
  ascension_perks: ascensionPerksSchema,
  edicts: edictsSchema,
  policies: policiesSchema,
  agendas: agendasSchema,
  // Military
  ship_sizes: shipSizesSchema,
  component_templates: componentTemplatesSchema,
  section_templates: sectionTemplatesSchema,
  armies: armiesSchema,
  war_goals: warGoalsSchema,
  casus_belli: casusBelliSchema,
  bombardment_stances: bombardmentStancesSchema,
  ship_behaviors: shipBehaviorsSchema,
  global_ship_designs: globalShipDesignsSchema,
  // Exploration & Events
  events: eventSchema,
  anomalies: anomaliesSchema,
  archaeological_sites: archaeologicalSitesSchema,
  relics: relicsSchema,
  on_actions: onActionsSchema,
  solar_system_initializers: solarSystemInitializersSchema,
  star_classes: starClassesSchema,
  ambient_objects: ambientObjectsSchema,
  leader_classes: leaderClassesSchema,
  // Scripting
  scripted_effects: scriptedEffectsSchema,
  scripted_triggers: scriptedTriggersSchema,
  scripted_modifiers: scriptedModifiersSchema,
  scripted_variables: scriptedVariablesSchema,
  script_values: scriptValuesSchema,
  inline_scripts: inlineScriptsSchema,
  defines: definesSchema,
  static_modifiers: staticModifiersSchema,
  random_names: randomNamesSchema,
  // Graphics & UI
  icons: iconsSchema,
  event_pictures: eventPicturesSchema,
  empire_flags: empireFlagsSchema,
  loading_screens: loadingScreensSchema,
  gui_files: guiFilesSchema,
  sprite_libraries: spriteLibrariesSchema,
  music_sound: musicSoundSchema,
};

export function getSchema(category: string): CategorySchema | undefined {
  return schemas[category];
}

export function getAllSchemas(): CategorySchema[] {
  return Object.values(schemas);
}
