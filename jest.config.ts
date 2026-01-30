module.exports = {
  testEnvironment: 'jsdom',
  testRegex: '(/tests/.*|\\.(test|spec))\\.(ts|tsx)$',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  }
};