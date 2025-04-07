class Modem {
  type
  rx_pin
  tx_pin
  power_pin
  model
  apn
  pin_code

  constructor(rx_pin, tx_pin, power_pin, model, apn, pin_code) {
    this.rx_pin = rx_pin
    this.tx_pin = tx_pin
    this.power_pin = power_pin
    this.model = model
    this.apn = apn
    this.pin_code = pin_code
    this.type = "modem"
  }

  attach(pin, deviceComponents) {
    const componentObjects = [
      {
        name: "external_components",
        config: {
            //@ts-ignore
            source: "github://Protofy-xyz/esphome-components",
            refresh: "0s",
            components: ["network", "modem"]
        }
      },
      {
        name: this.type,
        config: {
          id: "atmodem",
          rx_pin: this.rx_pin,
          tx_pin: this.tx_pin,
          power_pin: this.power_pin,
          model: this.model,
          apn: this.apn,
          enable_cmux: true,

        },
      }
    ]
    //if pin_code is provided, add it to the config 
    if (this.pin_code.length > 0) {
      componentObjects[1].config.pin_code = this.pin_code
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
}

export function modem(rx_pin, tx_pin, power_pin, model, apn, pin_code) {
  return new Modem(rx_pin, tx_pin, power_pin, model, apn, pin_code)
}
