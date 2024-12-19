class GM77 {
    name;
    type;
    uartId;

    constructor(name, type, uartId) {
        this.name = name
        this.type = type
        this.uartId = uartId
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: "external_components",
                config: {
                    //@ts-ignore
                    source: "github://Protofy-xyz/esphome-components",
                    refresh: "0s",
                    components: ["gm77"]
                }
            },

            {
                name: this.type,
                config: {
                    id: this.name,
                    uart_id: this.uartId,
                    on_tag:
                    {
                        "mqtt.publish": {

                             topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/state`,
                             payload: `@!lambda "return id(${this.name}).tag.c_str();"@`

                        },
                    }

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
                    name: "barcodeReading",
                    label: "Barcode reading",
                    description: "Get barcode reading from qr sensor",
                    endpoint: "/" + this.type + "/" + this.name + "/state",
                    connectionType: "mqtt",
                }
            ]
        }
    }
}

export function gm77(name, uartId) {
    return new GM77(name, 'gm77', uartId)
}