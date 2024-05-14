import { extractComponent } from "./utils"

class RotaryEncoder {
    name
    platform
    restoreMode
    type
    pinB
    pinReset
    constructor(name, platform,pinB, pinReset, ) {
        this.name = name
        this.platform = platform
        this.restoreMode = "ALWAYS_ZERO"
        this.type = 'sensor'
        this.pinB = pinB
        this.pinReset = pinReset
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: this.type,
                config: {
                    platform: this.platform,
                    pin_a: pin,
                    pin_b: this.pinB,
                    pin_reset: this.pinReset,
                    name: this.name,
                    id: this.name,
                    restore_mode: this.restoreMode,
                    publish_initial_value: true
                },
                subsystem: this.getSubsystem()
            }
        ]
        componentObjects.forEach((element, j) => {
            deviceComponents = extractComponent(element, deviceComponents)
        })

        return deviceComponents
    }

    getSubsystem() {
        return {
            name: this.name,
            type: this.type,
            config: {
                restoreMode: this.restoreMode
            },
            monitors: [
                {
                    name: "status",
                    label: "Get status",
                    description: "Get rotary encoder status",
                    endpoint: "/" + this.type + "/" + this.name + "/state",
                    connectionType: "mqtt"
                }
            ]
        }
    }
}

export function rotaryEncoder(name, pinB,pinReset) {
    return new RotaryEncoder(name, 'rotary_encoder',pinB,pinReset)
}