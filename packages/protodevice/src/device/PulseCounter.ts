class PulseCounter {
    name;
    platform;
    constructor(name, platform) {
        this.name = name
        this.platform = platform
    }

//

    attach(pin) {
        return {componentName: 'sensor',payload:
`    - platform: ${this.platform}
      pin: ${pin}
      id: ${this.name}
      name: ${this.name}
`
    }
    }
}

export default function pulseCounter(name) { 
    return new PulseCounter(name, 'pulse_counter');
}