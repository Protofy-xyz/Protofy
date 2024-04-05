class I2cBus { 
    type;
    scl;
    scan;
    id;
    constructor(id, scl, scan) {
        this.type = "i2c"
        this.scl = scl
        this.scan = scan
        this.id = id
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: this.type,
                config: {
                    id: this.id,
                    sda: pin,
                    scl: this.scl,
                    scan: this.scan,
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

export function i2cBus(id, scl, scan) { 
    return new I2cBus(id, scl, scan)
}