module.exports = {
  rootDir: '.',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    // Alias for a common 'src' folder at the root
    '^@/(.*)$': '<rootDir>/src/$1',
    // Alias for a specific 'components' folder within 'src'
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
