let state = {}

export const ProtoMemDB = (chunk) => {
    if(!state[chunk]) {
        state[chunk] = {}
    }
    
    return {
        set: (group, tag, name, value) => {
            state[chunk][group] = state[chunk][group] || {}
            state[chunk][group][tag] = state[chunk][group][tag] || {}
            state[chunk][group][tag][name] = value
        },
        get: (group, tag, name) => {
            return state[chunk][group] && state[chunk][group][tag] && state[chunk][group][tag][name]
        },
        getTags: (group) => {
            return state[chunk][group] ? Object.keys(state[chunk][group]) : []
        },
        getByTag: (group, tag) => {
            return state[chunk][group] && state[chunk][group][tag]
        },
        getByGroup: (group) => {
            return state[chunk][group]
        },
        remove: (group, tag, name) => {
            if (state[chunk][group] && state[chunk][group][tag]) {
                delete state[chunk][group][tag][name]
            }
        },
        clear: (group, tag) => {
            if (state[chunk][group]) {
                delete state[chunk][group][tag]
            }
        },
        clearGroup: (group) => {
            delete state[chunk][group]
        },
        clearAll: () => {
            state[chunk] = {}
        },
        getState: () => {
            return state[chunk]
        },
        setState: (newState) => {
            state[chunk] = newState
        },
        setGroupState: (group, newState) => {
            state[chunk][group] = newState
        }
    }
}