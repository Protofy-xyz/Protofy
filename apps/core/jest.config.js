const baseJestConfig = require('./jest/jest.config.base.js');
module.exports = {
    ...baseJestConfig,
    setupFiles: ['module-alias/register'],
    transform: {
        '^.+\\.test.ts?$': [
            'ts-jest',
            { tsconfig: './tsconfig.json' },
        ],
    }
};