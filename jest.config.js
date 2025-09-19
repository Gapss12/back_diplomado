// jest.config.js - REEMPLAZAR COMPLETAMENTE
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ]
}