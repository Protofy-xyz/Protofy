export function extractNestedComponents(element, deviceComponents, keysToExtract=[]) {
    // const keysToExtract = [
    //   { key: 'mqtt', nestedKey: 'on_message' },
    //   { key: 'esphome', nestedKey: 'on_boot' }
    // ];
  
    keysToExtract.forEach(({ key, nestedKey }) => {
      if (element.config[nestedKey]) {
        if(!deviceComponents[key]) deviceComponents[key] = {}
        if(!deviceComponents[key][nestedKey]) deviceComponents[key][nestedKey] = []

        if(Array.isArray(deviceComponents[key][nestedKey])){
          deviceComponents[key][nestedKey].push(...element.config[nestedKey])
        } else {
          deviceComponents[key][nestedKey] = {
            ...deviceComponents[key][nestedKey],
            ...element.config[nestedKey]
          }
        }
      }
    });
    return new Array(deviceComponents)[0];
  }

  export function extractComponent(element, deviceComponents,keysToExtract=[]) {
    const keys = keysToExtract.map((element)=>{
        return element.key
    })
    if (keys.includes(element.name)) {
      deviceComponents = extractNestedComponents(element, deviceComponents,keysToExtract)
    } else {
      if (!deviceComponents[element.name]) {
        deviceComponents[element.name] = element.config
      } else {
        if (!Array.isArray(deviceComponents[element.name])) {
          deviceComponents[element.name] = [deviceComponents[element.name]]
        }
        deviceComponents[element.name].push(element.config)
      }
    }
    return new Array(deviceComponents)[0];
  }