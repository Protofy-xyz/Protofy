class DallasBus {
  name;
  type;
  constructor(name, type,) {
      this.name = name
      this.type = type
  }

  attach(pin, deviceComponents) {
      
      const componentObjects = [
          {
            name: this.type,
            config:{
                id: this.name,
                pin: pin
            }
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
      return {}
  }
}

export function dallasBus(name) { 
  return new DallasBus(name, 'dallas');
}