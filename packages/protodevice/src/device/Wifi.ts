class Wifi {
  ssid
  password
  power_save_mode
  constructor(ssid, password, power_save_mode) {
    this.ssid = ssid
    this.password = password
    this.power_save_mode = power_save_mode
  }


  attach(pin) {
    return [
      {
        name: 'wifi',
        config: {
          ssid: this.ssid,
          password: this.password,
          power_save_mode: this.power_save_mode
        }
      }
    ]
  }
}

export default function wifi(ssid, password, power_save_mode) {
  return new Wifi(ssid, password, power_save_mode)
}
