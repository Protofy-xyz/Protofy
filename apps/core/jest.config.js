const { maxWorkers } = require('../expo/metro.config.js');
const baseJestConfig = require('./jest/jest.config.base.js');
module.exports = {
    ...baseJestConfig,
    setupFiles: ['module-alias/register'],
    maxWorkers: 1,
    transform: {
        '^.+\\.test.ts?$': [
            'ts-jest',
            { tsconfig: './tsconfig.json' },
        ],
    }
};