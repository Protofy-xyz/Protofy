class UARTBusComponent {
    type;
    rx;
    baudrate;
    id;
    constructor(id, rx, baudrate) {
        this.type = "uart"
        this.rx = rx
        this.baudrate = baudrate
        this.id = id
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: this.type,
                config: {
                    id: this.id,
                    tx_pin: pin,
                    rx_pin: this.rx,
                    baud_rate: this.baudrate,
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

export function uartBus(id, rx, baudrate) {
    return new UARTBusComponent(id, rx, baudrate)
}