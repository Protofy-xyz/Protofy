module.exports = {
    transform: {
        '^.+\\.test.ts?$': [
            'ts-jest',
            { tsconfig: './tests/tsconfig.json' },
        ],
    },
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: [
        "<rootDir>/tests/**/*.test.ts"
    ]
};