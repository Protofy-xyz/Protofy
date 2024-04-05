class Ethernet {
    type;
    mdc_pin;
    mdio_pin;
    clk_mode;
    phy_addr;
    power_pin;

    constructor(type, mdc_pin, mdio_pin, clk_mode, phy_addr, power_pin) {
        this.type = type
        this.mdc_pin = mdc_pin
        this.mdio_pin = mdio_pin
        this.clk_mode = clk_mode
        this.phy_addr = phy_addr
        this.power_pin = power_pin
    }

    attach(pin, deviceComponents) {
        let componentObjects = [
            {
                name: "ethernet",
                config: {
                    type: this.type,
                    mdc_pin: this.mdc_pin,
                    mdio_pin: this.mdio_pin,
                    clk_mode: this.clk_mode,
                    phy_addr: this.phy_addr,
                    power_pin: this.power_pin
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

export function ethernet(type, mdc_pin, mdio_pin, clk_mode, phy_addr, power_pin) { 
    return new Ethernet(type, mdc_pin, mdio_pin, clk_mode, phy_addr, power_pin)
}