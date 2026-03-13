# StellarForge — Design Specification

**Date:** 2026-03-13
**Status:** Draft
**Author:** AI-assisted design

## 1. Overview

StellarForge is a desktop application for creating Stellaris mods through a visual, low-code interface. It is the first purpose-built visual mod editor for any Paradox game. The app targets all skill levels: guided wizards for beginners, direct code access for experts.

### Core Principles

- **Low-code first**: Every moddable category has a visual form editor. No scripting knowledge required.
- **Code always available**: Bidirectional code panel (Monaco Editor) syncs in real-time with the UI. Users can paste code from external sources and StellarForge parses it into the visual editor.
- **Game-aware**: Reads Stellaris game files on startup to provide autocompletion, validation, and reference browsing.
- **One-click export**: Generates complete mod folder + descriptor.mod automatically.
- **Project-based**: Each project = one mod. Projects are saved in a proprietary .sfproj format with import/export capability.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Shell | Electron |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS + CSS Variables (theming) |
| Animations | Framer Motion |
| Code Editor | Monaco Editor |
| 3D Planet Editor | Three.js + @react-three/fiber |
| Node Editor | React Flow |
| i18n | react-i18next |
| State Management | Zustand |
| Local Database | SQLite (better-sqlite3) |
| Image Processing | sharp (PNG/JPG) + dds.js (DDS encoding/decoding) + texconv (optional) |
| Build | Vite + electron-builder |

## 2. Architecture

### 2.1 Directory Structure

```
StellarForge/
├── src/
│   ├── main/                        # Electron main process
│   │   ├── index.ts                 # Entry point, window management
│   │   ├── ipc/                     # IPC handlers
│   │   │   ├── fileOps.ts           # File read/write operations
│   │   │   ├── exportHandler.ts     # Mod export IPC
│   │   │   ├── gameScanHandler.ts   # Game scan IPC
│   │   │   ├── projectHandler.ts    # Project save/load IPC
│   │   │   ├── workshopHandler.ts   # Steam Workshop IPC
│   │   │   └── ddsHandler.ts        # DDS conversion IPC
│   │   ├── services/
│   │   │   ├── GameScanner.ts       # Scans Stellaris game directory
│   │   │   ├── ParadoxParser.ts     # Parses Clausewitz .txt files to AST
│   │   │   ├── ParadoxSerializer.ts # Serializes AST back to Clausewitz format
│   │   │   ├── ModExporter.ts       # Exports mod folder + descriptor
│   │   │   ├── ProjectManager.ts    # .sfproj save/load/import/export
│   │   │   ├── DdsConverter.ts      # Image <-> DDS conversion
│   │   │   ├── Validator.ts         # Mod validation engine
│   │   │   ├── TestGenerator.ts     # Generates console test commands
│   │   │   └── WorkshopManager.ts   # Steam Workshop upload/update
│   │   └── db/
│   │       ├── GameDataIndex.ts     # SQLite game data indexer
│   │       └── migrations/          # DB schema migrations
│   │
│   ├── renderer/                    # React application
│   │   ├── App.tsx                  # Root component + router
│   │   ├── components/
│   │   │   ├── layout/             # App shell
│   │   │   │   ├── AppShell.tsx     # Main layout container
│   │   │   │   ├── Sidebar.tsx      # Expandable sidebar navigation
│   │   │   │   ├── CodePanel.tsx    # Monaco editor panel (right)
│   │   │   │   ├── MainArea.tsx     # Central content area
│   │   │   │   └── StatusBar.tsx    # Bottom status bar
│   │   │   ├── editors/            # Category-specific editors
│   │   │   │   ├── TraitEditor.tsx
│   │   │   │   ├── TechEditor.tsx
│   │   │   │   ├── CivicEditor.tsx
│   │   │   │   ├── EventEditor.tsx
│   │   │   │   ├── BuildingEditor.tsx
│   │   │   │   ├── ... (one per category)
│   │   │   │   └── GenericEditor.tsx    # Fallback for categories without dedicated UI
│   │   │   ├── common/             # Shared UI components (design system)
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Tooltip.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   ├── TreeView.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── IconPicker.tsx
│   │   │   │   └── ModifierInput.tsx    # Specialized input for game modifiers
│   │   │   ├── node-editor/        # Visual event chain editor
│   │   │   │   ├── EventNodeEditor.tsx  # Main canvas
│   │   │   │   ├── EventNode.tsx        # Event node component
│   │   │   │   ├── OptionEdge.tsx       # Option connection edge
│   │   │   │   └── NodeInspector.tsx    # Side panel for selected node
│   │   │   ├── planet-editor/      # 3D planet editor
│   │   │   │   ├── PlanetEditor.tsx     # Main editor
│   │   │   │   ├── PlanetPreview.tsx    # Three.js 3D sphere renderer
│   │   │   │   ├── AtmosphereControls.tsx
│   │   │   │   ├── TextureManager.tsx
│   │   │   │   └── CloudLayerEditor.tsx
│   │   │   ├── portrait-editor/    # Portrait editor
│   │   │   │   ├── PortraitEditor.tsx
│   │   │   │   ├── StaticPortraitManager.tsx  # Import/preview static .dds
│   │   │   │   ├── AnimatedPortraitDefs.tsx   # Clothes/hair selector definitions
│   │   │   │   └── PortraitPreview.tsx
│   │   │   ├── condition-builder/  # Visual trigger/effect builder
│   │   │   │   ├── ConditionBuilder.tsx     # Main block builder
│   │   │   │   ├── TriggerBlock.tsx
│   │   │   │   ├── EffectBlock.tsx
│   │   │   │   ├── ScopeBlock.tsx
│   │   │   │   └── BlockPalette.tsx         # Available blocks palette
│   │   │   ├── theme-creator/      # Custom theme editor
│   │   │   │   ├── ThemeCreator.tsx
│   │   │   │   ├── ColorPicker.tsx
│   │   │   │   └── ThemePreview.tsx
│   │   │   ├── localisation/       # Mod localisation editor
│   │   │   │   ├── LocalisationEditor.tsx
│   │   │   │   └── LanguageTable.tsx
│   │   │   ├── project/            # Project management views
│   │   │   │   ├── ProjectWelcome.tsx    # Start screen
│   │   │   │   ├── ProjectSettings.tsx   # Mod metadata editor
│   │   │   │   └── ExportView.tsx        # Export/Workshop publish
│   │   │   └── settings/           # App settings
│   │   │       ├── SettingsView.tsx
│   │   │       └── GamePathSelector.tsx
│   │   ├── stores/
│   │   │   ├── projectStore.ts     # Active project state + all mod data
│   │   │   ├── gameDataStore.ts    # Indexed vanilla game data
│   │   │   ├── uiStore.ts          # UI state (sidebar, panels, theme)
│   │   │   └── editorStore.ts      # Active editor + code sync state
│   │   ├── hooks/
│   │   │   ├── useCodeSync.ts      # Bidirectional code <-> form sync
│   │   │   ├── useGameData.ts      # Query game data index
│   │   │   ├── useAutoComplete.ts  # Autocompletion from game data
│   │   │   ├── useValidation.ts    # Real-time validation
│   │   │   └── useExport.ts        # Export operations
│   │   ├── i18n/
│   │   │   ├── index.ts            # i18next setup
│   │   │   ├── en.json             # English translations
│   │   │   └── it.json             # Italian translations
│   │   ├── themes/
│   │   │   ├── theme-engine.ts     # Theme loading/switching system
│   │   │   ├── sci-fi.css          # Default theme
│   │   │   ├── glassmorphism.css
│   │   │   ├── minimal-dark.css
│   │   │   ├── aurora.css
│   │   │   └── warm-carbon.css
│   │   └── lib/
│   │       ├── paradox-language/   # Monaco language definition
│   │       │   ├── paradoxLanguage.ts    # Token definitions
│   │       │   ├── paradoxCompletion.ts  # Completion provider
│   │       │   └── paradoxValidation.ts  # Inline validation
│   │       └── validators/         # Per-category validation rules
│   │           ├── traitValidator.ts
│   │           ├── techValidator.ts
│   │           └── ... (one per category)
│   │
│   └── shared/                     # Shared between main and renderer
│       ├── types/
│       │   ├── project.ts          # Project/mod types
│       │   ├── paradox.ts          # Paradox AST types
│       │   ├── gameData.ts         # Game data index types
│       │   ├── categories.ts       # All moddable category types
│       │   └── ipc.ts              # IPC message types
│       ├── constants/
│       │   ├── scopes.ts           # All Stellaris scopes
│       │   ├── modifiers.ts        # All modifier names
│       │   ├── triggers.ts         # All trigger names
│       │   ├── effects.ts          # All effect names
│       │   └── categories.ts       # Category definitions + metadata
│       └── schemas/
│           ├── traitSchema.ts      # Field definitions for traits
│           ├── techSchema.ts       # Field definitions for technologies
│           └── ... (one per category)
```

### 2.2 Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌───────────────────┐
│  Visual Form │ ←──→│ Zustand Store │←──→ │ ParadoxSerializer │
│  (React)     │     │ (projectStore)│     │ / ParadoxParser   │
└─────────────┘     └──────┬───────┘     └────────┬──────────┘
                           │                       │
                           │                       ↕
                           │              ┌──────────────────┐
                           │              │  Monaco Editor    │
                           │              │  (CodePanel)      │
                           │              └──────────────────┘
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
     ┌──────────────┐ ┌─────────┐ ┌──────────┐
     │ProjectManager│ │Validator│ │ModExporter│
     │ (.sfproj)    │ │         │ │ (→ mod/)  │
     └──────────────┘ └─────────┘ └──────────┘
```

**Sync bidirectional flow:**
1. User edits form → store updates → serializer generates Paradox code → Monaco updates
2. User edits Monaco → parser reads code → store updates → form updates
3. User pastes external code into Monaco → parser reads → store updates → form populates

**Debouncing:** Code → UI sync debounced at 300ms to avoid jitter during typing.

### 2.3 IPC Architecture

Main process and renderer communicate via typed IPC channels:

```typescript
// Channel naming convention: "domain:action"
// All IPC channels use ipcMain.handle / ipcRenderer.invoke (async).
// Return types are always wrapped in Promise<>.
type IPCChannels = {
  "project:save": (project: Project) => Promise<void>;
  "project:load": (path: string) => Promise<Project>;
  "project:export-sfproj": (path: string) => Promise<void>;
  "project:import-sfproj": (path: string) => Promise<Project>;
  "game:scan": (gamePath: string) => Promise<GameDataIndex>;
  "game:get-version": (gamePath: string) => Promise<string>;
  "mod:export": (project: Project, outputPath: string) => Promise<ExportResult>;
  "mod:validate": (project: Project) => Promise<ValidationResult[]>;
  "mod:generate-tests": (project: Project) => Promise<string[]>;
  "workshop:upload": (modPath: string, metadata: WorkshopMeta) => Promise<void>;
  "workshop:update": (workshopId: string, modPath: string) => Promise<void>;
  "dds:convert-to": (inputPath: string, outputPath: string) => Promise<void>;
  "dds:convert-from": (ddsPath: string, outputPath: string) => Promise<void>;
  "fs:read-file": (path: string) => Promise<string>;
  "fs:write-file": (path: string, content: string) => Promise<void>;
  "fs:list-dir": (path: string) => Promise<FileEntry[]>;
};
```

## 3. Paradox Parser & Serializer

### 3.1 Parser

Parses Clausewitz script (.txt) into an AST.

```typescript
interface ParadoxNode {
  key: string;
  operator: "=" | ">" | "<" | ">=" | "<=" | "!=";
  value: ParadoxValue;
  comments?: string[];           // Comments preceding this node
  inlineComment?: string;        // Comment on the same line
  sourceLocation?: {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
  };
}

type ParadoxValue =
  | string                        // "quoted" or unquoted
  | number                        // integers and floats
  | boolean                       // yes/no
  | ParadoxNode[]                 // nested block { ... }
  | ParadoxListValue[];           // value list { item1 item2 }
  | ParadoxColor;                 // hsv { } or rgb { } color values

type ParadoxListValue = string | number;  // Mixed-type lists

interface ParadoxColor {
  type: "hsv" | "rgb";
  values: [number, number, number];
}

interface ParadoxFile {
  nodes: ParadoxNode[];
  variables: Map<string, number>; // @variable definitions
}
```

**Parser features:**
- Tokenizer → recursive descent parser
- Handles: quoted strings, unquoted identifiers, numbers (int/float), `yes`/`no` booleans, `@variable` references, `hsv { }` color values, inline math expressions
- Preserves comments for round-trip fidelity
- Tracks source locations for Monaco sync
- Error recovery: continues parsing after syntax errors, collects all errors

### 3.2 Serializer

Converts AST back to Clausewitz format:
- Configurable indentation (tabs or spaces)
- Preserves original comments
- Consistent formatting with standard Paradox conventions
- Outputs valid UTF-8 (for scripts) or UTF-8-BOM (for localisation)

## 4. Game Scanner & Data Index

### 4.1 Scan Process

1. User selects Stellaris installation directory (persisted in app settings)
2. Scanner validates the path (checks for `common/`, `events/`, `stellaris.exe` or `stellaris` on Linux/Mac)
3. Parallel file reading of all game directories
4. Each file parsed with ParadoxParser
5. Parsed data indexed into SQLite database
6. DLC content detected from `dlc/` subdirectories
7. Game version extracted from launcher metadata

**Error handling:**
- **Invalid path**: Show clear error message, ask user to re-select
- **Corrupt game files**: Skip unparseable files, log warnings, continue scan. Show summary of skipped files at end.
- **Unsupported game version**: Warn but allow (mod format rarely breaks between versions)
- **Game mid-update**: Detect Steam's `downloading` state via `appmanifest_281990.acf` if available, warn user to wait
- **No Steam (GOG users)**: Works identically — user just selects the GOG install directory. Workshop features disabled gracefully.

### 4.2 SQLite Schema

```sql
CREATE TABLE game_objects (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL,        -- "trait", "technology", "building", etc.
  object_key TEXT NOT NULL,      -- "trait_intelligent", "tech_lasers_1"
  file_path TEXT NOT NULL,
  parsed_data TEXT NOT NULL,     -- JSON serialized ParadoxNode
  dlc TEXT,                      -- Which DLC this belongs to (NULL = base game)
  UNIQUE(category, object_key)
);

CREATE TABLE modifiers (
  name TEXT PRIMARY KEY,         -- "pop_happiness", "ship_fire_rate_mult"
  scopes TEXT NOT NULL,          -- JSON array of valid scopes
  description TEXT
);

CREATE TABLE triggers (
  name TEXT PRIMARY KEY,
  scopes TEXT NOT NULL,
  parameters TEXT                -- JSON schema of parameters
);

CREATE TABLE effects (
  name TEXT PRIMARY KEY,
  scopes TEXT NOT NULL,
  parameters TEXT
);

CREATE TABLE scopes (
  name TEXT PRIMARY KEY,
  transitions TEXT               -- JSON: which scopes can transition to which
);

CREATE TABLE icons (
  gfx_key TEXT PRIMARY KEY,      -- "GFX_trait_intelligent"
  file_path TEXT NOT NULL,
  category TEXT
);

CREATE TABLE localisation (
  loc_key TEXT NOT NULL,
  language TEXT NOT NULL,        -- "l_english", "l_french", etc.
  text TEXT NOT NULL,
  PRIMARY KEY(loc_key, language)
);

CREATE TABLE defines (
  define_key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  file_path TEXT NOT NULL
);

CREATE INDEX idx_objects_category ON game_objects(category);
CREATE INDEX idx_objects_key ON game_objects(object_key);
CREATE INDEX idx_loc_key ON localisation(loc_key);
```

### 4.3 Autocompletion

The game data index powers autocompletion in:
- **Monaco Editor**: Custom completion provider queries SQLite for matching keys
- **Form dropdowns**: Prerequisite tech lists, modifier names, trigger names populated from index
- **Icon picker**: Browse all game icons with preview, filtered by category
- **Reference validation**: Real-time checking that referenced objects exist

## 5. Project System

### 5.1 Project Format (.sfproj)

Projects are saved as a directory containing JSON files:

```
MyMod.sfproj/
├── project.json              # Metadata, settings, game version target
├── items/
│   ├── traits.json           # All trait definitions
│   ├── technologies.json     # All technology definitions
│   ├── events.json           # All events + chain layout data (node positions)
│   ├── buildings.json        # All building definitions
│   ├── civics.json
│   ├── ...                   # One file per active category
│   └── planet_classes.json
├── localisation/
│   ├── en.json               # English strings
│   └── it.json               # Italian strings
├── assets/
│   ├── icons/                # Custom icon source images
│   ├── event_pictures/       # Event picture source images
│   ├── portraits/            # Portrait source images
│   ├── planet_textures/      # Planet texture source images
│   └── flags/                # Empire flag images
└── theme.json                # Custom theme if user created one
```

### 5.2 project.json

```typescript
interface ProjectMetadata {
  name: string;                    // Mod display name
  internalName: string;            // Filesystem-safe name
  version: string;                 // Mod version
  stellarisVersion: string;        // Target Stellaris version (e.g. "3.12.*")
  tags: string[];                  // Steam Workshop tags
  thumbnail?: string;              // Thumbnail image path
  description: string;             // Mod description
  author: string;
  workshopId?: string;             // Steam Workshop ID (after first upload)
  dependencies?: string[];         // Mod dependencies
  createdAt: string;               // ISO timestamp
  lastModified: string;            // ISO timestamp
  stellarforgeVersion: string;     // StellarForge version that created this
}
```

### 5.3 Project Import/Export

- **Export**: Compresses the entire .sfproj directory into a .sfpkg (ZIP) file
- **Import**: Extracts .sfpkg and validates the structure
- Initially only supports projects created by StellarForge

## 6. Mod Export System

### 6.1 Export Process

One-click export generates a complete Stellaris mod:

1. **Validate** entire project (stop if critical errors)
2. **Create** mod folder in the Stellaris mod directory
3. **Generate** all .txt files from project data using ParadoxSerializer
4. **Generate** localisation .yml files (UTF-8-BOM encoding)
5. **Convert** and copy asset files (icons → DDS, event pictures, etc.)
6. **Generate** descriptor.mod (inside mod folder, without `path`)
7. **Generate** .mod file (in mod/ directory root, with `path`)
8. **Show** export summary with warnings

### 6.2 Descriptor Generation

```
# descriptor.mod (inside mod folder)
name = "My Mod Name"
tags = { "Gameplay" "Balance" }
picture = "thumbnail.png"
supported_version = "3.12.*"
version = "1.0.0"

# MyMod.mod (in mod/ directory)
name = "My Mod Name"
path = "mod/MyMod"
tags = { "Gameplay" "Balance" }
picture = "thumbnail.png"
supported_version = "3.12.*"
version = "1.0.0"
```

### 6.3 File Generation Mapping

| Project Category | Output Path |
|-----------------|-------------|
**Empire Design:**
| Category | Output Path |
|----------|-------------|
| Governments | `common/governments/sfg_governments.txt` |
| Authorities | `common/governments/authorities/sfg_authorities.txt` |
| Civics | `common/governments/civics/sfg_civics.txt` |
| Origins | `common/governments/civics/sfg_origins.txt` |
| Ethics | `common/ethics/sfg_ethics.txt` |
| Species Classes | `common/species_classes/sfg_species_classes.txt` |
| Traits | `common/traits/sfg_traits.txt` |
| Species Rights | `common/species_rights/sfg_species_rights.txt` |
| AI Personalities | `common/personalities/sfg_personalities.txt` |
| Name Lists | `common/name_lists/sfg_name_lists.txt` |
| Prescripted Countries | `prescripted_countries/sfg_countries.txt` |

**Economy & Planets:**
| Category | Output Path |
|----------|-------------|
| Buildings | `common/buildings/sfg_buildings.txt` |
| Districts | `common/districts/sfg_districts.txt` |
| Pop Jobs | `common/pop_jobs/sfg_pop_jobs.txt` |
| Planet Classes | `common/planet_classes/sfg_planet_classes.txt` |
| Deposits | `common/deposits/sfg_deposits.txt` |
| Decisions | `common/decisions/sfg_decisions.txt` |
| Pop Categories | `common/pop_categories/sfg_pop_categories.txt` |
| Economic Categories | `common/economic_categories/sfg_economic_categories.txt` |
| Trade Conversions | `common/trade_conversions/sfg_trade_conversions.txt` |
| Terraform | `common/terraform/sfg_terraform.txt` |

**Tech & Traditions:**
| Category | Output Path |
|----------|-------------|
| Technologies | `common/technology/sfg_technologies.txt` |
| Traditions | `common/traditions/sfg_traditions.txt` |
| Ascension Perks | `common/ascension_perks/sfg_ascension_perks.txt` |
| Edicts | `common/edicts/sfg_edicts.txt` |
| Policies | `common/policies/sfg_policies.txt` |
| Agendas | `common/agendas/sfg_agendas.txt` |

**Military:**
| Category | Output Path |
|----------|-------------|
| Ship Sizes | `common/ship_sizes/sfg_ship_sizes.txt` |
| Component Templates | `common/component_templates/sfg_components.txt` |
| Section Templates | `common/section_templates/sfg_sections.txt` |
| Armies | `common/armies/sfg_armies.txt` |
| War Goals | `common/war_goals/sfg_war_goals.txt` |
| Casus Belli | `common/casus_belli/sfg_casus_belli.txt` |
| Bombardment Stances | `common/bombardment_stances/sfg_bombardment.txt` |
| Ship Behaviors | `common/ship_behaviors/sfg_ship_behaviors.txt` |
| Global Ship Designs | `common/global_ship_designs/sfg_ship_designs.txt` |

**Exploration & Events:**
| Category | Output Path |
|----------|-------------|
| Events | `events/sfg_events.txt` |
| Anomalies | `common/anomalies/sfg_anomalies.txt` |
| Archaeological Sites | `common/archaeological_site_types/sfg_sites.txt` |
| Relics | `common/relics/sfg_relics.txt` |
| On Actions | `common/on_actions/sfg_on_actions.txt` |
| Solar System Initializers | `common/solar_system_initializers/sfg_initializers.txt` |
| Star Classes | `common/star_classes/sfg_star_classes.txt` |
| Ambient Objects | `common/ambient_objects/sfg_ambient.txt` |
| Leader Classes | `common/leader_classes/sfg_leader_classes.txt` |

**Scripting:**
| Category | Output Path |
|----------|-------------|
| Scripted Effects | `common/scripted_effects/sfg_effects.txt` |
| Scripted Triggers | `common/scripted_triggers/sfg_triggers.txt` |
| Scripted Modifiers | `common/scripted_modifiers/sfg_modifiers.txt` |
| Scripted Variables | `common/scripted_variables/sfg_variables.txt` |
| Script Values | `common/script_values/sfg_values.txt` |
| Inline Scripts | `common/inline_scripts/sfg_inline.txt` |
| Defines | `common/defines/sfg_defines.txt` |
| Static Modifiers | `common/static_modifiers/sfg_static_modifiers.txt` |
| Random Names | `common/random_names/sfg_random_names.txt` |

**Graphics & UI:**
| Category | Output Path |
|----------|-------------|
| Icons | `gfx/interface/icons/sfg/` (directory of .dds files) |
| Event Pictures | `gfx/event_pictures/sfg/` (directory of .dds files) |
| Empire Flags | `gfx/flags/sfg/` (directory of .dds files) |
| Loading Screens | `gfx/loadingscreens/sfg/` (directory of .dds files) |
| GUI Files | `interface/sfg_gui.gui` |
| Sprite Libraries | `interface/sfg_sprites.gfx` |
| Music & Sound | `music/sfg_music.asset` + `sound/sfg_sounds/` |

**Localisation:**
| Language | Output Path |
|----------|-------------|
| English | `localisation/english/sfg_l_english.yml` |
| Italian | `localisation/italian/sfg_l_italian.yml` |
| French | `localisation/french/sfg_l_french.yml` |
| German | `localisation/german/sfg_l_german.yml` |
| Spanish | `localisation/spanish/sfg_l_spanish.yml` |
| (other languages follow same pattern) | |

All generated files prefixed with `sfg_` to avoid conflicts with vanilla or other mods.

**Re-export behavior:** If the output mod directory already exists, StellarForge shows a diff summary of changes and asks for confirmation before overwriting. Old files are backed up to `{mod_dir}/.sfg_backup/` before overwrite.

### 6.4 Steam Workshop Integration

- **Upload**: Uses Steamworks API via `steamworks.js` (MIT-licensed, actively maintained Node.js Steamworks bindings) to upload mod to Workshop
- **Update**: Detects changes since last upload, updates only modified files
- **User choice**: Export locally only OR export + upload to Workshop
- Requires Steam to be running for Workshop operations
- **No Steam fallback**: If Steam is not installed (GOG users), Workshop UI is hidden. All other features work normally.

## 7. UI Design System

### 7.1 Visual Direction

- **Theme default**: Sci-Fi Immersive — dark backgrounds, cyan/teal glow accents, Orbitron font for headers, subtle animated light effects
- **Component shape**: Mix of rounded (cards, inputs, buttons have border-radius: 8-12px) with sharp decorative accents (corner marks, angular line decorations, clip-path on accent elements)
- **Animations**: Framer Motion for page transitions, hover effects, panel open/close. Subtle and performant.

### 7.2 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Title Bar (Electron custom)                      _ □ X  │
├──────────┬──────────────────────────┬───────────────────┤
│          │                          │                   │
│ Sidebar  │     Main Content Area    │   Code Panel      │
│          │                          │   (Monaco)        │
│ - Empire │  [Category List View]    │                   │
│   - Govt │  or                      │   Live Paradox    │
│   - Auth │  [Item Editor Form]      │   script output   │
│   - Civi │  or                      │                   │
│   - Orig │  [Node Editor]           │   Bidirectional   │
│   - Ethi │  or                      │   sync            │
│   - Trai │  [Planet Editor 3D]      │                   │
│ - Economy│  or                      │                   │
│ - Tech   │  [Portrait Editor]       │                   │
│ - Milit  │                          │                   │
│ - Events │                          │                   │
│ - Script │                          │                   │
│ - GFX    │                          │                   │
│ - Locale │                          │                   │
│          │                          │                   │
├──────────┴──────────────────────────┴───────────────────┤
│ Status Bar: Project name | Validation status | Version  │
└─────────────────────────────────────────────────────────┘
```

- **Sidebar**: 230px wide, expandable/collapsible groups, active item highlight with glow accent, project name at top
- **Code Panel**: 270px wide, toggleable (show/hide), resizable via drag handle
- **Main Area**: Fills remaining space, scrollable content

### 7.3 Design System Components

All components support theming via CSS custom properties:

```css
:root {
  /* Theme variables (overridden per theme) */
  --sf-bg-primary: #050810;
  --sf-bg-secondary: #0a0f1e;
  --sf-bg-card: rgba(0, 20, 50, 0.3);
  --sf-border: rgba(0, 200, 255, 0.08);
  --sf-border-active: rgba(0, 200, 255, 0.25);
  --sf-accent: #22d3ee;
  --sf-accent-glow: rgba(0, 200, 255, 0.15);
  --sf-text-primary: #e0f2fe;
  --sf-text-secondary: rgba(150, 200, 255, 0.4);
  --sf-text-muted: rgba(0, 200, 255, 0.3);
  --sf-font-display: 'Orbitron', sans-serif;
  --sf-font-body: 'Inter', sans-serif;
  --sf-font-mono: 'JetBrains Mono', monospace;
  --sf-radius-sm: 6px;
  --sf-radius-md: 10px;
  --sf-radius-lg: 14px;
}
```

**Component list:**
- **Button**: Primary (filled accent), Secondary (outline), Ghost (transparent). Sharp corner accent decoration on primary buttons.
- **Input**: Dark background, subtle border, glow on focus. Label above.
- **Select/Dropdown**: Custom styled, searchable for long lists (e.g., tech prerequisites).
- **Card**: Semi-transparent background, top-edge light line decoration, hover glow.
- **Modal**: Centered, backdrop blur, slide-in animation.
- **Toast**: Bottom-right notifications with auto-dismiss.
- **Tabs**: Underline style for sub-navigation within editors.
- **TreeView**: For sidebar navigation, indented with expand/collapse icons.
- **Tooltip**: Dark card with arrow, appears on hover with 200ms delay.
- **IconPicker**: Grid of game icons with search, previews DDS icons inline.
- **ModifierInput**: Specialized compound input: modifier dropdown + operator + value.

### 7.4 Theme System

**5 preinstalled themes:**
1. **Sci-Fi Immersive** (default) — Dark space, cyan glow, Orbitron headers
2. **Glassmorphism** — Semi-transparent panels, blur effects, soft gradients
3. **Minimal Dark** — Pure black, cyan neon accents, clean typography
4. **Aurora Gradient** — Purple/pink gradients, mystical atmosphere
5. **Warm Carbon** — Carbon black, amber/gold accents, professional

**Ethics-inspired themes** (additional):
- Militarist (red/aggressive), Pacifist (green/calm), Materialist (blue/tech), Spiritualist (purple/mystic), Xenophile (warm), Xenophobe (cold), Authoritarian (dark/gold), Egalitarian (bright/open)

**Theme Creator:**
- Color picker for all CSS custom properties
- Live preview as you edit
- Export/import custom themes as JSON
- Theme saved per-project or globally

## 8. Category Editors

### 8.1 Schema-Driven Editors

Each moddable category has a **schema** that defines its fields, types, constraints, and relationships. The schema drives both the form generation and the code serialization.

```typescript
interface CategorySchema {
  category: string;                    // "trait", "technology", etc.
  gameFolder: string;                  // "common/traits/"
  displayName: { en: string; it: string };
  fields: FieldDefinition[];
  validators: ValidatorRule[];
}

interface FieldDefinition {
  key: string;                         // Paradox script key
  label: { en: string; it: string };
  type: "text" | "number" | "boolean" | "select" | "multiselect"
      | "modifier-list" | "trigger-block" | "effect-block"
      | "icon" | "color" | "reference"
      | "event-options" | "resource-block";  // Specialized compound types
  required: boolean;
  default?: any;
  options?: SelectOption[];            // For select/multiselect
  referenceCategory?: string;          // For "reference" type (e.g., "technology")
  tooltip?: { en: string; it: string };
  group?: string;                      // Visual grouping in the form
  condition?: FieldCondition;          // Show/hide based on other field values
}
```

### 8.2 Representative Schemas

These concrete schemas establish the pattern for all 51 category editors.

**Trait Schema:**
```typescript
const traitSchema: CategorySchema = {
  category: "trait",
  gameFolder: "common/traits/",
  displayName: { en: "Traits", it: "Tratti" },
  fields: [
    { key: "key", label: { en: "Trait ID", it: "ID Tratto" }, type: "text", required: true, group: "general",
      tooltip: { en: "Internal ID (e.g., trait_intelligent)", it: "ID interno (es. trait_intelligent)" } },
    { key: "cost", label: { en: "Cost", it: "Costo" }, type: "number", required: true, default: 1, group: "general",
      tooltip: { en: "Trait point cost (positive = positive trait)", it: "Costo in punti tratto" } },
    { key: "icon", label: { en: "Icon", it: "Icona" }, type: "icon", required: false, group: "general" },
    { key: "allowed_archetypes", label: { en: "Allowed Archetypes", it: "Archetipi Consentiti" }, type: "multiselect",
      required: true, group: "restrictions",
      options: [
        { value: "BIOLOGICAL", label: "Biological" }, { value: "LITHOID", label: "Lithoid" },
        { value: "MACHINE", label: "Machine" }, { value: "ROBOT", label: "Robot" },
        { value: "PRESAPIENT", label: "Pre-Sapient" }
      ] },
    { key: "opposites", label: { en: "Opposites", it: "Opposti" }, type: "multiselect", required: false,
      group: "restrictions", referenceCategory: "trait" },
    { key: "initial", label: { en: "Available at Start", it: "Disponibile all'Inizio" }, type: "boolean",
      required: false, default: true, group: "restrictions" },
    { key: "randomized", label: { en: "Can Appear Randomly", it: "Appare Casualmente" }, type: "boolean",
      required: false, default: true, group: "restrictions" },
    { key: "modifier", label: { en: "Modifiers", it: "Modificatori" }, type: "modifier-list", required: false, group: "effects" },
    { key: "slave_cost", label: { en: "Slave Cost Modifier", it: "Modificatore Costo Schiavo" }, type: "modifier-list",
      required: false, group: "effects" },
    { key: "ai_weight", label: { en: "AI Weight", it: "Peso AI" }, type: "number", required: false,
      default: 1, group: "ai" },
  ],
  validators: [
    { rule: "cost_balance", params: { warnIfAbove: 4, warnIfBelow: -4 } },
    { rule: "opposite_symmetry", params: {} }, // warn if A lists B as opposite but B doesn't list A
    { rule: "modifier_exists", params: { field: "modifier" } },
  ]
};
```

**Technology Schema:**
```typescript
const techSchema: CategorySchema = {
  category: "technology",
  gameFolder: "common/technology/",
  displayName: { en: "Technologies", it: "Tecnologie" },
  fields: [
    { key: "key", label: { en: "Tech ID", it: "ID Tecnologia" }, type: "text", required: true, group: "general" },
    { key: "area", label: { en: "Research Area", it: "Area di Ricerca" }, type: "select", required: true, group: "general",
      options: [
        { value: "physics", label: "Physics" }, { value: "society", label: "Society" },
        { value: "engineering", label: "Engineering" }
      ] },
    { key: "category", label: { en: "Category", it: "Categoria" }, type: "select", required: true, group: "general",
      tooltip: { en: "Research subcategory", it: "Sotto-categoria di ricerca" } },
    { key: "tier", label: { en: "Tier", it: "Livello" }, type: "number", required: true, default: 1, group: "general" },
    { key: "cost", label: { en: "Cost", it: "Costo" }, type: "number", required: true, group: "general" },
    { key: "weight", label: { en: "Base Weight", it: "Peso Base" }, type: "number", required: true, default: 100, group: "general" },
    { key: "prerequisites", label: { en: "Prerequisites", it: "Prerequisiti" }, type: "multiselect", required: false,
      group: "requirements", referenceCategory: "technology" },
    { key: "is_rare", label: { en: "Rare Tech", it: "Tech Rara" }, type: "boolean", required: false, default: false, group: "general" },
    { key: "is_dangerous", label: { en: "Dangerous Tech", it: "Tech Pericolosa" }, type: "boolean", required: false, group: "general" },
    { key: "potential", label: { en: "Potential (Visibility)", it: "Potenziale (Visibilità)" }, type: "trigger-block",
      required: false, group: "conditions" },
    { key: "weight_modifier", label: { en: "Weight Modifiers", it: "Modificatori Peso" }, type: "trigger-block",
      required: false, group: "conditions" },
    { key: "modifier", label: { en: "Modifiers", it: "Modificatori" }, type: "modifier-list", required: false, group: "effects" },
    { key: "icon", label: { en: "Icon", it: "Icona" }, type: "icon", required: false, group: "general" },
  ],
  validators: [
    { rule: "reference_exists", params: { field: "prerequisites", category: "technology" } },
    { rule: "tier_cost_consistency", params: {} }, // warn if cost is too low/high for tier
  ]
};
```

**Event Schema:**
```typescript
const eventSchema: CategorySchema = {
  category: "event",
  gameFolder: "events/",
  displayName: { en: "Events", it: "Eventi" },
  fields: [
    { key: "namespace", label: { en: "Namespace", it: "Namespace" }, type: "text", required: true, group: "general" },
    { key: "id", label: { en: "Event ID", it: "ID Evento" }, type: "text", required: true, group: "general",
      tooltip: { en: "Format: namespace.number", it: "Formato: namespace.numero" } },
    { key: "type", label: { en: "Event Type", it: "Tipo Evento" }, type: "select", required: true, group: "general",
      options: [
        { value: "country_event", label: "Country Event" },
        { value: "planet_event", label: "Planet Event" },
        { value: "fleet_event", label: "Fleet Event" },
        { value: "ship_event", label: "Ship Event" },
        { value: "pop_event", label: "Pop Event" },
        { value: "observer_event", label: "Observer Event" },
      ] },
    { key: "title", label: { en: "Title Key", it: "Chiave Titolo" }, type: "text", required: true, group: "general" },
    { key: "desc", label: { en: "Description Key", it: "Chiave Descrizione" }, type: "text", required: true, group: "general" },
    { key: "picture", label: { en: "Event Picture", it: "Immagine Evento" }, type: "icon", required: false, group: "general" },
    { key: "is_triggered_only", label: { en: "Triggered Only", it: "Solo Triggherato" }, type: "boolean",
      required: false, default: true, group: "trigger" },
    { key: "hide_window", label: { en: "Hide Window", it: "Nascondi Finestra" }, type: "boolean",
      required: false, default: false, group: "general" },
    { key: "fire_only_once", label: { en: "Fire Only Once", it: "Solo Una Volta" }, type: "boolean",
      required: false, default: false, group: "trigger" },
    { key: "trigger", label: { en: "Trigger", it: "Condizione" }, type: "trigger-block", required: false, group: "trigger" },
    { key: "mean_time_to_happen", label: { en: "Mean Time to Happen", it: "Tempo Medio" }, type: "trigger-block",
      required: false, group: "trigger",
      condition: { field: "is_triggered_only", value: false } },
    { key: "immediate", label: { en: "Immediate Effects", it: "Effetti Immediati" }, type: "effect-block",
      required: false, group: "effects" },
    { key: "options", label: { en: "Options", it: "Opzioni" }, type: "event-options", required: false, group: "options" },
    { key: "after", label: { en: "After Effects", it: "Effetti Dopo Scelta" }, type: "effect-block",
      required: false, group: "effects" },
  ],
  validators: [
    { rule: "localisation_key_exists", params: { fields: ["title", "desc"] } },
    { rule: "event_has_options_or_hidden", params: {} },
  ]
};
```

**Building Schema:**
```typescript
const buildingSchema: CategorySchema = {
  category: "building",
  gameFolder: "common/buildings/",
  displayName: { en: "Buildings", it: "Edifici" },
  fields: [
    { key: "key", label: { en: "Building ID", it: "ID Edificio" }, type: "text", required: true, group: "general" },
    { key: "base_buildtime", label: { en: "Build Time (days)", it: "Tempo Costruzione (giorni)" },
      type: "number", required: true, default: 360, group: "general" },
    { key: "base_cap_amount", label: { en: "Max per Planet", it: "Max per Pianeta" },
      type: "number", required: false, default: 1, group: "general" },
    { key: "category", label: { en: "Category", it: "Categoria" }, type: "select", required: true, group: "general",
      options: [
        { value: "manufacturing", label: "Manufacturing" }, { value: "research", label: "Research" },
        { value: "trade", label: "Trade" }, { value: "unity", label: "Unity" },
        { value: "amenity", label: "Amenity" }, { value: "government", label: "Government" },
        { value: "army", label: "Army" }, { value: "resource", label: "Resource" },
      ] },
    { key: "potential", label: { en: "Potential (Visibility)", it: "Potenziale" }, type: "trigger-block",
      required: false, group: "conditions" },
    { key: "allow", label: { en: "Allow (Build Conditions)", it: "Consenti" }, type: "trigger-block",
      required: false, group: "conditions" },
    { key: "prerequisites", label: { en: "Required Technologies", it: "Tecnologie Richieste" },
      type: "multiselect", required: false, group: "requirements", referenceCategory: "technology" },
    { key: "resources", label: { en: "Resources", it: "Risorse" }, type: "resource-block",
      required: false, group: "costs",
      tooltip: { en: "Build cost and upkeep", it: "Costo costruzione e mantenimento" } },
    { key: "planet_modifier", label: { en: "Planet Modifiers", it: "Modificatori Pianeta" },
      type: "modifier-list", required: false, group: "effects" },
    { key: "triggered_planet_modifier", label: { en: "Triggered Modifiers", it: "Modificatori Condizionali" },
      type: "trigger-block", required: false, group: "effects" },
    { key: "icon", label: { en: "Icon", it: "Icona" }, type: "icon", required: false, group: "general" },
    { key: "upgrades", label: { en: "Upgrades To", it: "Si Migliora In" }, type: "multiselect",
      required: false, group: "general", referenceCategory: "building" },
  ],
  validators: [
    { rule: "reference_exists", params: { field: "prerequisites", category: "technology" } },
    { rule: "reference_exists", params: { field: "upgrades", category: "building" } },
  ]
};
```

**GenericEditor:** For categories without a dedicated editor component, a `GenericEditor` auto-generates the form UI from the category schema. It supports all field types (`text`, `number`, `boolean`, `select`, `multiselect`, `modifier-list`, `trigger-block`, `effect-block`, `icon`, `color`, `reference`) and renders them using the shared component library. This ensures every category is editable from day one, even before a specialized editor is built.

### 8.3 Included Categories (51 total)

> Note: Section numbering continues as 8.4, 8.5 below.

**Empire Design (11):**
- Governments, Authorities, Civics, Origins, Ethics, Species Classes, Traits, Species Rights, AI Personalities, Name Lists, Prescripted Countries

**Economy & Planets (10):**
- Buildings, Districts, Pop Jobs, Planet Classes, Deposits, Decisions, Pop Categories, Economic Categories, Trade Conversions, Terraform

**Tech & Traditions (6):**
- Technologies, Traditions, Ascension Perks, Edicts, Policies, Agendas

**Military (9):**
- Ship Sizes, Component Templates, Section Templates, Armies, War Goals, Casus Belli, Bombardment Stances, Ship Behaviors, Global Ship Designs

**Exploration & Events (9):**
- Events, Anomalies, Archaeological Sites, Relics, On Actions, Solar System Initializers, Star Classes, Ambient Objects, Leader Classes

**Scripting (9):**
- Scripted Effects, Scripted Triggers, Scripted Modifiers, Scripted Variables, Script Values, Inline Scripts, Defines, Static Modifiers, Random Names

**Graphics & UI (7):**
- Icons, Event Pictures, Empire Flags, Loading Screens, GUI Files, Sprite Libraries, Music & Sound

**Localisation (1):**
- Localisation editor

### 8.4 Category List View

When a category is selected in the sidebar, the main area shows:
- Category title + item count
- "New" button
- Grid of cards for each defined item (icon, name, brief description)
- Click a card → opens the item editor form
- Empty state with "Create your first [category]" prompt

### 8.5 Item Editor Form

Standard layout for most category editors:
- Top: Item name (editable) + icon preview
- Form fields organized in collapsible groups (General, Conditions, Modifiers, etc.)
- Each field has a label, input, and optional tooltip explaining the Paradox syntax
- "Delete" and "Duplicate" buttons
- Unsaved changes indicator

## 9. Specialized Editors

### 9.1 Event Node Editor

Visual flowchart for event chains using React Flow:

**Nodes:**
- Each node represents one event (country_event, planet_event, etc.)
- Node displays: event ID, title, type badge, option count
- Node color indicates event type (country = blue, planet = green, fleet = orange)

**Edges:**
- Each edge represents an option that leads to another event
- Edge label shows the option text
- Multiple edges from one node = multiple options

**Interaction:**
- Click node → opens event detail editor in a side panel
- Drag from option port → creates new connected event
- Right-click → context menu (add event, delete, duplicate)
- Minimap in corner for large chains
- Zoom/pan with mouse wheel and drag

**Event detail panel** (opens alongside the node canvas):
- Event ID, title, description fields
- Event picture selector
- Trigger block (using Condition Builder)
- Options list, each with:
  - Option text
  - Trigger (when this option is available)
  - Effects (what happens when selected)
  - Target event (which node it connects to)
- Immediate effects block
- Mean Time to Happen / weight config

### 9.2 Condition Builder (Trigger/Effect Block Builder)

Visual drag-and-drop builder for Paradox trigger/effect logic:

**Block types:**
- **Trigger blocks** (blue): `is_at_war`, `has_technology`, `num_pops >`, etc.
- **Effect blocks** (green): `add_resource`, `create_pop`, `set_variable`, etc.
- **Logic blocks** (gray): `AND`, `OR`, `NOT`, `NOR`, `NAND`
- **Scope blocks** (orange): `every_owned_planet`, `random_country`, `owner`, etc.
- **Comparison blocks** (yellow): `>`, `<`, `>=`, `<=`, `=`

**Layout:**
- Left: Block palette (searchable, categorized by scope)
- Center: Builder canvas where blocks are stacked/nested
- Blocks nest inside each other (scope contains triggers, logic wraps triggers)
- Drag to reorder, click to configure parameters

**Integration:**
- Used inside Event Editor (trigger, options, effects sections)
- Used inside any category editor that has `trigger` or `effect` fields
- Generates Paradox code in real-time → visible in Code Panel

### 9.3 Planet Editor (3D)

Full planet creation and customization with live 3D preview:

**Three.js viewport (left/center):**
- Rendered sphere with:
  - Diffuse texture (surface map)
  - Normal map (terrain depth)
  - Specular map (reflectivity)
  - Cloud layer (separate rotating sphere)
  - Atmosphere glow (shader-based)
- Camera: orbit controls (rotate, zoom, pan)
- Lighting: simulated star light
- Slow auto-rotation toggle

**Controls panel (right of 3D view):**
- **Planet Class Settings**: name, climate, colonizable toggle, habitability
- **Texture Management**:
  - Import surface texture (PNG/JPG/DDS → auto-converted)
  - Import normal map
  - Import specular map
  - Built-in procedural texture generator:
    - Algorithm: Simplex noise (via `simplex-noise` npm package), layered with octaves for terrain detail
    - UI: 2-4 color stops (e.g., deep water, shallow water, land, mountain) with position sliders
    - Parameters: roughness (octave count 1-8), water level (0-100%), scale, seed (randomizable)
    - Output: 2048x1024 equirectangular PNG, auto-applied to preview sphere
    - Scope: Simple procedural textures only — not a full terrain editor
- **Atmosphere**:
  - Color picker (HSV, matching Stellaris format)
  - Intensity slider (0.0 - 2.0)
  - Width slider (0.0 - 1.5)
  - Live preview updates as you drag
- **Cloud Layer**:
  - Enable/disable
  - Cloud texture import or procedural generation
  - Opacity slider
  - Rotation speed
- **City Lights**: Color correction LUT selector
- **Preview Modes**: Day side, night side, orbit view, colony sky view

### 9.4 Portrait Editor

**Static Portrait mode:**
- Import images (PNG/JPG → auto-converted to DDS with transparency)
- Crop/resize tool
- Background removal: Simple threshold-based alpha masking (user sets a color + tolerance slider, pixels within tolerance become transparent). No ML/AI — just color threshold. Implemented with HTML Canvas `getImageData`/`putImageData`. Adequate for portraits with solid-color backgrounds.
- Preview how portrait will look in-game (species selection screen frame mockup)
- Automatic generation of all definition files (species_class, portrait_sets, portrait_categories, .gfx sprite definitions)

**Animated Portrait Definitions mode:**
- For users who have created meshes externally (Maya/Blender)
- Entity definition editor (.asset file builder)
- Clothes selector configuration
- Hair/attachment selector configuration
- Animation state editor (idle, talking, etc.)
- Preview using static fallback image (cannot render .mesh in-app)

### 9.5 Localisation Editor

Table-based editor for multi-language mod text:

```
┌──────────────────┬───────────────────┬───────────────────┐
│ Key              │ English           │ Italiano          │
├──────────────────┼───────────────────┼───────────────────┤
│ trait_smart       │ Intelligent       │ Intelligente      │
│ trait_smart_desc  │ This species...   │ Questa specie...  │
│ tech_laser_2      │ Blue Lasers       │ Laser Blu         │
└──────────────────┴───────────────────┴───────────────────┘
```

- Keys auto-generated from item definitions (e.g., creating trait "smart" auto-creates `trait_smart` and `trait_smart_desc` keys)
- User adds text for each language they want to support
- Languages supported: English, French, German, Spanish, Russian, Polish, Brazilian Portuguese, Chinese, Japanese, Korean (matching Stellaris)
- Export generates separate .yml files per language with correct encoding (UTF-8-BOM)
- Search/filter keys
- Missing translation indicators (highlight keys missing text for a language)

## 10. Validation System

### 10.1 Validation Levels

1. **Syntax**: Paradox script syntax correctness
2. **Schema**: Required fields present, correct types, valid values
3. **Reference**: Referenced objects exist (tech prerequisites, required civics, icons)
4. **Balance** (warnings): Trait cost vs effect analysis, tech tier consistency, modifier magnitude checks
5. **Compatibility**: Warns about known conflicts with popular mod patterns

### 10.2 Validation Display

- **Inline**: Red/yellow underlines in form fields with tooltip messages
- **Monaco**: Squiggly underlines in code panel (standard Monaco diagnostics)
- **Status bar**: Error/warning count summary
- **Validation panel**: Full list of all issues, clickable to navigate to source

### 10.3 Test Generation

Generates Stellaris console commands to quickly test the mod in-game:

```
# Auto-generated test commands for MyMod
# Paste these in the Stellaris console (` key)

# Unlock all custom technologies
research_technology tech_my_laser
research_technology tech_my_shield

# Spawn test events
event sfg_events.1
event sfg_events.5

# Add custom traits to species
add_trait_species trait_my_custom

# Add resources to test buildings
cash 10000
minerals 10000
```

Exported as a `.txt` file alongside the mod.

## 11. Internationalization (i18n)

### 11.1 App i18n

- **react-i18next** with JSON translation files
- Initial languages: English (en), Italian (it)
- Architecture supports adding new languages by adding a JSON file
- All user-facing strings use translation keys: `t('sidebar.empireDesign')`
- Language switcher in app settings
- Fallback: English if translation missing

### 11.2 Namespace Organization

```json
{
  "app": { "title": "StellarForge", "newProject": "New Project", ... },
  "sidebar": { "empireDesign": "Empire Design", "economy": "Economy & Planets", ... },
  "editors": {
    "trait": { "name": "Trait Name", "cost": "Cost", "opposites": "Opposites", ... },
    "tech": { "area": "Research Area", "tier": "Tier", "cost": "Cost", ... }
  },
  "actions": { "save": "Save", "export": "Export Mod", "delete": "Delete", ... },
  "validation": { "requiredField": "This field is required", ... }
}
```

## 12. Welcome Screen & Project Management

### 12.1 Welcome Screen

Displayed on app startup (no project open):

- StellarForge logo + version
- **New Project** button → Project creation wizard
- **Open Project** button → File picker for .sfproj
- **Import Project** button → File picker for .sfpkg
- Recent projects list (name, last modified, game version)
- Game path status indicator (configured / not configured)

### 12.2 Project Creation Wizard

Step-by-step guided creation:

1. **Mod Info**: Name, author, description, tags
2. **Game Path**: Select Stellaris directory (if not already configured) → triggers game scan
3. **Target Version**: Select Stellaris version compatibility
4. **Categories**: Checkbox list of which categories to enable (can add more later)
5. **Create**: Generates project structure

### 12.3 Settings

Persisted in Electron `app.getPath('userData')`:

- Stellaris game directory path
- UI language (EN/IT)
- Active theme
- Code panel default visibility
- Code panel width
- Auto-save interval
- Export output directory override
- Recent projects list

## 13. Steam Workshop Integration

### 13.1 Upload Flow

1. User opens Export view
2. Chooses "Export & Publish to Workshop" (or just "Export Locally")
3. If first upload:
   - Fills in Workshop-specific metadata (description, visibility, tags)
   - Confirms upload
   - StellarForge uploads via Steamworks API
   - `remote_file_id` saved to project
4. If update:
   - Shows changelog input
   - Confirms update
   - StellarForge updates existing Workshop item

### 13.2 Requirements

- Steam must be running
- User must own Stellaris
- `steamworks.js` package for Steamworks API access (MIT-licensed, actively maintained)
- Fallback: If Steam integration fails or Steam is not installed, user can publish via Paradox Launcher manually

## 14. Asset Management

### 14.1 DDS Conversion Pipeline

```
Import: PNG/JPG/BMP → sharp (resize/format convert) → dds.js or texconv (DDS encoding)
Export: DDS files copied to mod output directory
Preview: DDS → decoded via dds.js → PNG for in-app thumbnail display
```

**DDS encoding approach:** `sharp` handles image resize and PNG/JPG processing. For DDS encoding/decoding, use `dds.js` (JavaScript DDS parser/encoder) for basic A8R8G8B8 encoding, or bundle Microsoft's `texconv.exe` (from DirectXTex, MIT-licensed) as an optional native tool for DXT5 compression. The app detects `texconv` availability and falls back to `dds.js` if unavailable.

Conversion rules:
- **Icons** (traits, civics, tech): A8R8G8B8, 29x29px standard (also generates 36x36, 24x24 variants)
- **Event pictures**: DXT5 compression, 480x300px
- **Portraits**: A8R8G8B8 with alpha, various sizes
- **Planet textures**: DXT5 compression, power-of-2 dimensions

### 14.2 Asset Library

Each project has an `assets/` directory:
- Source images stored at original quality
- DDS conversions generated at export time
- In-app browser with drag-and-drop import
- Preview thumbnails for all assets
- Automatic .gfx sprite definition generation

## 15. Non-functional Requirements

### 15.1 Performance

- App startup: < 3 seconds to main window
- Game scan: < 30 seconds for full Stellaris installation
- Code sync latency: < 100ms (form → code), < 300ms debounced (code → form)
- Planet 3D editor: 60fps on mid-range hardware
- Project save: < 1 second
- Mod export: < 10 seconds

### 15.2 Data Safety

- Auto-save every 60 seconds (configurable)
- Project backup before major operations (export, version change)
- Confirmation dialog before destructive actions (delete item, delete project)
- Export never overwrites without confirmation

### 15.3 Undo/Redo

- Global undo/redo stack per project (Ctrl+Z / Ctrl+Shift+Z)
- Implementation: Zustand middleware that records state snapshots on every meaningful change
- Granularity: Each form field change, each node move, each block add/remove is one undo step
- Stack limit: 100 steps (configurable)
- Monaco editor has its own built-in undo/redo which handles code-side changes independently
- When code → form sync triggers a form update, that update is recorded as a single undo step

### 15.4 Accessibility

- Keyboard navigation for all UI elements
- High contrast support via theme system
- Screen reader labels on interactive elements
- Minimum touch target: 32x32px
