/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ["<rootDir>/tests"],
    moduleFileExtensions: ["ts", "js"],
    transform: {
      "^.+\\.ts$": "ts-jest"
    },
    testRegex: ".*\\.test\\.ts$" // Coincide con cualquier archivo que termine en .test.ts
  };