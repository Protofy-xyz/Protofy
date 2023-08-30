class HX711 {
    name;
    platform;
    clkPin;
    updateInterval;
    gain;
    constructor(name, platform, clkPin, gain, updateInterval) {
        this.name = name
        this.platform = platform
        this.clkPin = clkPin
        this.updateInterval = updateInterval
        this.gain = gain
    }

    attach(pin) {
        return {componentName: 'sensor',payload:
`    - platform: ${this.platform}
      id: ${this.name}
      name: ${this.name}
      dout_pin: ${pin}
      clk_pin: ${this.clkPin}
      gain: ${this.gain}
      update_interval: ${this.updateInterval}
`
    }
    }
}

export default function hx711(name, clkPin, gain, updateInterval) { 
    return new HX711(name, 'hx711', clkPin, gain, updateInterval);
}