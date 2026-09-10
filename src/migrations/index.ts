import * as migration_20260910_230204 from './20260910_230204';

export const migrations = [
  {
    up: migration_20260910_230204.up,
    down: migration_20260910_230204.down,
    name: '20260910_230204'
  },
];
