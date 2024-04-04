class HX711 {
    name;
    type;
    platform;
    clkPin;
    updateInterval;
    gain;
    constructor(name, platform, clkPin, gain, updateInterval) {
        this.type = "sensor"
        this.name = name
        this.platform = platform
        this.clkPin = clkPin
        this.updateInterval = updateInterval
        this.gain = gain
    }
    attach(pin, deviceComponents) {
        const componentObjects = [
          {
            name: this.type,
            config: {
              platform: this.platform,
              name: this.name,
              id: this.name,
              dout_pin: pin,
              clk_pin: this.clkPin,
              gain: this.gain,
              update_interval: this.updateInterval
            },
            subsystem: this.getSubsystem()
          },
        ]
    
        componentObjects.forEach((element, j) => {
            if (!deviceComponents[element.name]) {
                deviceComponents[element.name] = element.config
            } else {
                if (!Array.isArray(deviceComponents[element.name])) {
                    deviceComponents[element.name] = [deviceComponents[element.name]]
                }
                deviceComponents[element.name] = [...deviceComponents[element.name], element.config]
            }
        })
        return deviceComponents
      }
      getSubsystem() {
        return {
          name: this.name,
          type: this.type,
          monitors: [
            {
              name: 'load',
              label: 'Load cell',
              description: 'Get load cell status',
              units: 'pts',
              endpoint: "/sensor/"+this.name+"/state",
              connectionType: 'mqtt',
            }
          ]
        }
      }
}

export default function hx711(name, clkPin, gain, updateInterval) { 
    return new HX711(name, 'hx711', clkPin, gain, updateInterval);
}