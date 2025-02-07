/*
# Example configuration entry
dallas:
  - pin: GPIO23

# Individual sensors
sensor:
  - platform: dallas
    address: 0x1C0000031EDD2A28
    name: "Living Room Temperature"
*/

class DS18B20 {
  name;
  platform;
  dallasBusId
  address;
  type;
  constructor(name, platform, dallasBusId, address) {
      this.name = name
      this.platform = platform
      this.dallasBusId = dallasBusId
      this.type = "sensor"
      this.address = address
  }

  attach(pin, deviceComponents) {
      
      const componentObjects = [
          {
              name: this.type,
              config: {
                  platform: this.platform,
                  one_wire_id: this.dallasBusId,
                  name: this.name,
                  id: this.name,
                  address: this.address
              },
              subsystem: this.getSubsystem()
          }
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
      return deviceComponents;
  }

  getSubsystem() {
      return {
          name: this.name,
          type: this.type,
          monitors:[
              {
                  name: "status",
                  label: "Get temperature",
                  description: "Get temperature status",
                  units: 'ºC',
                  endpoint: "/"+this.type+"/"+this.name+"/state",
                  connectionType: "mqtt",
              }
          ]
      }
  }
}

export function ds18b20(name,dallasBusId, address) { 
  return new DS18B20(name, 'dallas_temp',dallasBusId, address);
}