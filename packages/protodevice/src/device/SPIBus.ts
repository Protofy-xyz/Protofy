class SPIBus { 
    type;
    id;
    mosi_pin;
    miso_pin;
    constructor(id, mosi_pin, miso_pin) {
        this.type = "spi"
        this.id = id
        this.mosi_pin = mosi_pin
        this.miso_pin = miso_pin
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: this.type,
                config: {
                    id: this.id,
                    clk_pin: pin,
                    mosi_pin: this.mosi_pin,
                    miso_pin: this.miso_pin,
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
        return {}
    }
}

export function spiBus(id, mosi_pin, miso_pin) { 
    return new SPIBus(id, mosi_pin, miso_pin)
}