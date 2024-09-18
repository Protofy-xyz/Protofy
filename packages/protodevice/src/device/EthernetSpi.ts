class EthernetSpi {
    type;
    clk_pin;
    mosi_pin;
    miso_pin;
    cs_pin;
    interrupt_pin;
    reset_pin;

    constructor(type, mosi_pin, miso_pin, clk_pin, cs_pin, interrupt_pin, reset_pin) {
        this.type = type
        this.clk_pin = clk_pin
        this.mosi_pin = mosi_pin
        this.miso_pin = miso_pin
        this.cs_pin = cs_pin
        this.interrupt_pin = interrupt_pin
        this.reset_pin = reset_pin
    }

    attach(pin, deviceComponents) {
        let componentObjects = [
            {
                name: "ethernet",
                config: {
                    type: this.type,
                    clk_pin: this.clk_pin,
                    mosi_pin: this.mosi_pin,
                    miso_pin: this.miso_pin,
                    cs_pin: this.cs_pin,
                },
                subsystem: this.getSubsystem()
            },
        ]
        if(this.interrupt_pin !== "None") {
            componentObjects[0]["config"]["interrupt_pin"] = parseInt(this.interrupt_pin)
        }
        if(this.reset_pin !== "None") {
            componentObjects[0]["config"]["reset_pin"] = parseInt(this.reset_pin)
        }

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
        return {}
    }
}

export function ethernetSpi(type, mosi_pin, miso_pin, clk_pin, cs_pin, interrupt_pin, reset_pin) { 
    return new EthernetSpi(type, mosi_pin, miso_pin, clk_pin, cs_pin, interrupt_pin, reset_pin)
}