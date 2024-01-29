const path = require('path')
const fs = require('fs')

const INVALID_DEPENDENCIES = ["bindings", "deasync", "node-etcd"]

describe("Protofy setup tests", () => {
    it("Should have a yarn.lock file and avoid usage of OS dependent packages", () => {
        const validDependencies = () => {
            const yarnLockContent = fs.readFileSync(path.join(__dirname, '../yarn.lock'), 'utf-8');
            if (!yarnLockContent) return false
            const dependencies = yarnLockContent.split('\n\n')

            for (let i = 0; i < dependencies.length; i++) {
                if (dependencies[i].startsWith('#') || dependencies[i].startsWith('__metadata')) continue

                const dependencyName = dependencies[i].split(':')[0] || "";
                const matches = INVALID_DEPENDENCIES.filter((inv) => dependencyName.includes(inv))
                if (matches.length > 0) return false
            }

            return true
        }

        expect(validDependencies()).toBe(true);
    })
    it.skip("skips the test for testing purposes", () => {
        expect(true).toBe(true)
    })
})