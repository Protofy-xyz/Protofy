class CANBusSPI {
    name; 
    platform;
    id;
    spiBusId;
    csPin;
    defaultCANId;
    bitRate;
    constructor(id, spiBusId, csPin, defaultCANId, bitRate) {
        this.name = "canbus",
        this.platform = "mcp2515",
        this.id = id
        this.spiBusId = spiBusId
        this.csPin = csPin
        this.defaultCANId = defaultCANId
        this.bitRate = bitRate
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: this.name,
                config: {
                    platform: this.platform,
                    id: this.id,
                    cs_pin: this.csPin,
                    can_id: this.defaultCANId,
                    spi_id: this.spiBusId,
                    bit_rate: this.bitRate,
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

export function canBusSPI(id, spiBusId, csPin, defaultCANId, bitRate) { 
    return new CANBusSPI(id, spiBusId, csPin, defaultCANId, bitRate)
}