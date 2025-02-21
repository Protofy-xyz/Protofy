/*
# Example configuration entry
sensor:
  - platform: max31865
    name: "living_room_temp"
    id: "living_room_temp"
    spi_id: "myspibus"
    cs_pin: 16
    reference_resistance: 430 Ω
    rtd_nominal_resistance: 100 Ω
    rtd_wires: 3
    update_interval: 5s
*/

class MAX31865 {
    type;
    platform;
    id;
    spiBusId;
    csPin;
    referenceResistance;
    rtdNominalResistance;
    rtdWires;
    updateInterval;
    constructor(id, spiBusId, csPin, referenceResistance, rtdNominalResistance, rtdWires, updateInterval) {
        this.type = "sensor",
        this.platform = "max31865",
        this.id = id
        this.spiBusId = spiBusId
        this.csPin = csPin
        this.referenceResistance = referenceResistance
        this.rtdNominalResistance = rtdNominalResistance
        this.rtdWires = rtdWires
        this.updateInterval = updateInterval
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: this.type,
                config: {
                    platform: this.platform,
                    name: this.id,
                    id: this.id,
                    cs_pin: this.csPin,
                    spi_id: this.spiBusId,
                    reference_resistance: this.referenceResistance,
                    rtd_nominal_resistance: this.rtdNominalResistance,
                    rtd_wires: this.rtdWires,
                    update_interval: this.updateInterval,
                

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

export function max31865(id, spiBusId, csPin, referenceResistance, rtdNominalResistance, rtdWires, updateInterval) { 
    return new MAX31865(id, spiBusId, csPin, referenceResistance, rtdNominalResistance, rtdWires, updateInterval)
}