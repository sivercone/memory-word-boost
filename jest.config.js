const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^nanoid$': '<rootDir>/node_modules/nanoid/index.cjs',
  },
  testMatch: ['<rootDir>/__tests__/**/*.(test|spec).(ts|tsx)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/pages/**/*', '!src/**/index.ts'],
};

module.exports = createJestConfig(customJestConfig);
