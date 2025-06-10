module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};