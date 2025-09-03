// jest.config.js
// This file configures the Jest testing framework.

module.exports = {
  // The environment in which the tests are run
  testEnvironment: 'node',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/*.test.js',
    '!**/coverage/**',
    '!jest.config.js',
    '!index.js', // Often excluded as it's an entry point
    '!config.js', // Configuration files usually don't need test coverage
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // A list of reporters to use when writing coverage reports
  coverageReporters: ['json', 'text', 'lcov', 'clover'],

  // This setting will cause the test run to fail if coverage drops below these thresholds.
  // This aligns with the goal of our coverageAgent and provides an immediate failure
  // signal if a manual `npm test` is run.
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80, // Using -10 would mean "allow 10 uncovered statements"
    },
  },

  // A preset that is used as a base for Jest's configuration
  // preset: 'ts-jest', // Uncomment this line if you are using TypeScript
};

