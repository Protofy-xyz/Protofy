class ADCSensor {
    name;
    platform;
    updateInterval;
    attenuation;
    constructor(name, platform,updateInterval, attenuation) {
        this.name = name
        this.platform = platform
        this.updateInterval = updateInterval
        this.attenuation = attenuation? attenuation:"auto"
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

export default function adcSensor(name,updateInterval,attenuation) { 
    return new ADCSensor(name, 'adc',updateInterval, attenuation);
}