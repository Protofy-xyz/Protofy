class XiaomiMiFlora {
    id;
    platform;
    macAddress;

    constructor(id, platform, macAddress) {
        this.id = id
        this.platform = platform
        this.macAddress = macAddress
    }

    getWifiPowerMode() {
        return 'light'
    }

    attach(pin) {
        return [
            {
                componentName: 'esp32_ble_tracker',
                payload:
                    `   scan_parameters:
        interval: 320ms # try with 300ms if you don't have LAN module
        window: 30ms # try with 300ms if you don't have LAN module
        continuous: true
        active: false
`
            },
            {
                componentName: 'sensor',
                payload:
                    `    - platform: ${this.platform}
      mac_address: '${this.macAddress}'
      id: ${this.id}
      temperature:
          name: "${this.id}temperature"
   
      moisture:
          name: "${this.id}moisture"

      illuminance:
          name: "${this.id}illuminance"

      conductivity:
          name: "${this.id}soilconductivity"

      battery_level:
          name: "${this.id}batterylevel"
`
            }
        ]
    }
}

export default function xiaomiMiFlora(name, macAddress) {
    return new XiaomiMiFlora(name, 'xiaomi_hhccjcy01', macAddress)
}