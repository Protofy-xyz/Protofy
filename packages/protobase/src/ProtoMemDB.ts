let state = {}

export const ProtoMemDB = {
    set: (tag, name, value) => {
        state[tag] = state[tag] || {}
        state[tag][name] = value
    },
    get: (tag, name) => {
        return state[tag] && state[tag][name]
    },
    getByTag: (tag) => {
        return state[tag] || {}
    },
    remove: (tag, name) => {
        if(state[tag]) {
            delete state[tag][name]
        }
    },
    clear: (tag) => {
        delete state[tag]
    },
    clearAll: () => {
        state = {}
    },
    getState: () => {
        return state
    },
    setState: (newState) => {
        state = newState
    }
}