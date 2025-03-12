let state = {}

export const ProtoMemDB = {
    set: (group, tag, name, value) => {
        state[group] = state[group] || {}
        state[group][tag] = state[group][tag] || {}
        state[group][tag][name] = value
    },
    get: (group, tag, name) => {
        return state[group] && state[group][tag] && state[group][tag][name]
    },
    getTags: (group)=>{
        return state[group] ? Object.keys(state[group]) : []
    },
    getByTag: (group, tag) => {
        return state[group] && state[group][tag]
    },
    getByGroup: (group) => {
        return state[group]
    },
    remove: (group, tag, name) => {
        if(state[group] && state[group][tag]) {
            delete state[group][tag][name]
        }
    },
    clear: (group, tag) => {
        if(state[group]) {
            delete state[group][tag]
        }
    },
    clearGroup: (group) => {
        delete state[group]
    },
    clearAll: () => {
        state = {}
    },
    getState: () => {
        return state
    },
    setState: (newState) => {
        state = newState
    },
    setGroupState: (group, newState) => {
        state[group] = newState
    }
}