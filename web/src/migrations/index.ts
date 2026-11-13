import * as migration_20261112_182750_initial from './20261112_182750_initial';

export const migrations = [
  {
    up: migration_20261112_182750_initial.up,
    down: migration_20261112_182750_initial.down,
    name: '20261112_182750_initial'
  },
];
