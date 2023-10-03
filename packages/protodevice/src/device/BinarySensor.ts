class BinarySensor {
    name;
    platform
    constructor(name, platform) {
        this.name = name
        this.platform = platform
    }

    attach(pin) {
        return {componentName: "binary_sensor",payload:
`    - platform: ${this.platform}
      pin: ${pin}
      id: ${this.name}
      name: ${this.name}
      filters:
        - invert:
        - delayed_on: 100ms
        - delayed_off: 100ms
`
    }
    }
}

export default function binarySensor(name) { 
    return new BinarySensor(name, 'gpio')
}