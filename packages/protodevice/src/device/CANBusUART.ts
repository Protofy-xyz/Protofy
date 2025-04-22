class CANBusUART {
    name; 
    platform;
    id;
    txPin;
    rxPin;
    defaultCANId;
    bitRate;
    constructor(id, txPin, rxPin, defaultCANId, bitRate) {
        this.name = "canbus",
        this.platform = "esp32_can",
        this.id = id
        this.txPin = txPin
        this.rxPin = rxPin
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
                    tx_pin: this.txPin,
                    rx_pin: this.rxPin,
                    can_id: this.defaultCANId,
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

export function canBusUART(id, txPin, rxPin, defaultCANId, bitRate) { 
    return new CANBusUART(id, txPin, rxPin, defaultCANId, bitRate)
}