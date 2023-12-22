/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    roots: ['./__test__'],
    setupFilesAfterEnv: ['./integrationTestSetup.ts'],
    preset: 'ts-jest',
    testEnvironment: 'node',
  };