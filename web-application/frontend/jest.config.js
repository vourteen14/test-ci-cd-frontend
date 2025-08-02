module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/tests/**/*.spec.js'],
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.vue',
    '!src/main.js',
    '!src/router/index.js'
  ],
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true
}