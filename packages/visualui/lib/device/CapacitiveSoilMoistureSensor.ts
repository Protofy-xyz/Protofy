class CapacitiveSoilMoistureSensor {
    name;
    platform;
    updateInterval;
    attenuation;
    constructor(name, platform,updateInterval) {
        this.name = name
        this.platform = platform
        this.updateInterval = updateInterval
        this.attenuation = "11db"
    }

//

    attach(pin) {
        return {componentName: 'sensor',payload:
`    - platform: ${this.platform}
      pin: ${pin}
      id: ${this.name}
      name: ${this.name}
      update_interval: ${this.updateInterval}
      attenuation: ${this.attenuation}
`
    }
    }
}

export default function capacitiveSoilMoistureSensor(name,updateInterval) { 
    return new CapacitiveSoilMoistureSensor(name, 'adc',updateInterval);
}