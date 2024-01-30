var config:any={};

export const setConfig = (customConfig) => {
    config = customConfig
    return config
}

export const getConfig = () => {
    return config
}