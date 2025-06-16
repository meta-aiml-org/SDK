module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],

  // Coverage collection
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Coverage directory
  coverageDirectory: 'coverage',

  // Setup files
  setupFilesAfterEnv: [],

  // Module paths
  moduleFileExtensions: ['js', 'json'],

  // Transform files
  transform: {},

  // Verbose output
  verbose: true,

  // Clear mocks automatically
  clearMocks: true,

  // Restore mocks automatically
  restoreMocks: true
};
