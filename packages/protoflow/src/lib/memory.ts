const isClient = typeof window !== "undefined"
if(isClient) window['flowMemory'] = {}

export const read = (instanceId, key, defaultValue) => {
  if(!isClient) return []
  if(!window['flowMemory'][instanceId]) {
    return defaultValue
  }
  return window['flowMemory'][instanceId][key]
}

export const write = (instanceId, key, value) => {
  if(!isClient) return
  if(!window['flowMemory'][instanceId]) {
    window['flowMemory'][instanceId] = {}
  }
  window['flowMemory'][instanceId][key] = value
}
