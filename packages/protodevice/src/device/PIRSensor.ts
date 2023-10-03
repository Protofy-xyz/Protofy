class PIRSensor {
    name;
    platform;
    constructor(name, platform) {
        this.name = name
        this.platform = platform
    }

    attach(pin) {
        return {componentName: 'binary_sensor',payload:
`    - platform: ${this.platform}
      pin: ${pin}
      id: ${this.name}
      name: ${this.name}
      device_class: motion
`
    }
    }
}

export default function pirSensor(name) { 
    return new PIRSensor(name, 'gpio');
}