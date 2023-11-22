window['flowMemory'] = {}

export const read = (instanceId, key, defaultValue) => {
	if(!window['flowMemory'][instanceId]) {
		return defaultValue
	}
	return window['flowMemory'][instanceId][key]
}

export const write = (instanceId, key, value) => {
	if(!window['flowMemory'][instanceId]) {
		window['flowMemory'][instanceId] = {}
	}
	window['flowMemory'][instanceId][key] = value
}
