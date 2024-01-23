module.exports = {
    transform: {
        '^.+\\.test.ts?$': [
            'ts-jest',
            { tsconfig: './tests/tsconfig.json' },
        ],
    },
    setupFilesAfterEnv: [
        "jest-expect-message"
    ],
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: [
        "<rootDir>/tests/**/*.test.ts"
    ]
};