const jsYaml = require("js-yaml");
class Device {
    components;
    pinTable;

    constructor(components) {
        this.pinTable = []
        this.components = components.slice(2)
    }
    
    getComponents(deviceName, deviceDefinition){
        var deviceComponents = {
            esphome: {
                name: deviceName,
            },
            [deviceDefinition.board.core]: deviceDefinition.config.sdkConfig,
            logger: {}
        }

        this.components?.forEach((component, i) => {
            console.log("🚀 ~ file: Device.ts:62 ~ Device ~ this.components?.forEach ~ component:", component)
            if(component){
                deviceComponents = component.attach(
                    !isNaN(parseInt(this.pinTable[i])) 
                      ? parseInt(this.pinTable[i])
                      : this.pinTable[i], deviceComponents, this.components
                  );
            }
        })
        //console.log("🚀 ~ file: Device.ts:120 ~ Device ~ getComponents ~ deviceComponents:", deviceComponents)
        return deviceComponents

    }

    create(deviceName?, deviceDefinition?) {
        const ports = deviceDefinition.board.ports
        this.pinTable = []
        ports.forEach(port => {
            if(!['3V3', 'EN', '36', '39', 'CLK'].includes(port.name)) this.pinTable.push(port.name)
        });

        var components = this.getComponents(deviceName, deviceDefinition)
        //console.log("🚀 ~ file: Device.ts:275 ~ Device ~ create ~ jsYaml.dump(components):", jsYaml.dump(components, {lineWidth: -1}))
        return jsYaml.dump(components, {lineWidth: -1});
    }
}

export default function device(deviceInfo) {
    return new Device(deviceInfo)
}
