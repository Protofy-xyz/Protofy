class TempHumidity {
    name;
    platform;
    model;
    updateInterval;
    constructor(name, platform, model, updateInterval) {
        this.name = name
        this.platform = platform
        this.model = model
        this.updateInterval = updateInterval
        
    }

    attach(pin) {
        return {componentName: 'sensor',payload:
`    - platform: ${this.platform}
      id: ${this.name}
      pin: ${pin}
      model: ${this.model}
      update_interval: ${this.updateInterval}
      temperature:
        name: ${this.name}temp
      humidity:
        name: ${this.name}hum
`
    }
    }
}

export default function tempHumidity(name, model, updateInterval) { 
    return new TempHumidity(name, 'dht', model, updateInterval);
}