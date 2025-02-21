const path = require('path');
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')],
    detectOpenHandles: true,
    testMatch: [
        "<rootDir>/**/*.test.ts"
    ]
};