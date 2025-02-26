
import { AutoAPI } from 'protonode'
import { AutomationModel } from './automationSchema'

const automations = {}

const getAutomation = (name, automation) => {
    automation = JSON.parse(automation)
    return JSON.stringify({
        name: name,
        ...automation
    })
}

const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            for (const [key, automation] of Object.entries(automations)) {
                yield [key, getAutomation(key, automation)];
            }
        },

        async del(key, value) {
            delete automations[key]
        },

        async put(key, value) {
            automations[key] = value
        },

        async get(key) {
            throw new Error('not implemented')
        }
    };

    return db;
}

export const AutomationsAPI = AutoAPI({
    modelName: 'automations',
    modelType: AutomationModel,
    prefix: '/api/core/v1/',
    getDB: getDB,
    connectDB: () => new Promise(resolve => resolve(null)),
    requiresAdmin: ['*']
})
