import path from 'path';

/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    '^nimma/legacy': require.resolve('nimma/legacy'),
    '^nimma/fallbacks': require.resolve('nimma/fallbacks'),
    '^date-fns': require.resolve('date-fns'),
    '^@modules(.*)$': `${path.resolve(__dirname, 'src')}/modules$1`,
  },
};
