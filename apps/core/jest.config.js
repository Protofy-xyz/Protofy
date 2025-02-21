const baseJestConfig = require('./jest/jest.config.base.js');
module.exports = {
    ...baseJestConfig,
    transform: {
        '^.+\\.test.ts?$': [
            'ts-jest',
            { tsconfig: './tests/tsconfig.json' },
        ],
    }
};