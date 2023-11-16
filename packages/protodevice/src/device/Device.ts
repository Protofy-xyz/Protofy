const jsYaml = require("js-yaml");
class Device {
    components;
    pinTable;
    componentsTree;
    subsystemsTree;

    constructor(components) {
        this.pinTable = []
        this.components = components.slice(2)
        this.componentsTree = {}
        this.subsystemsTree = []
    }
    
    createComponentsTree(deviceName, deviceDefinition){
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
        this.componentsTree = deviceComponents

    }

    createSubsystemsTree(deviceName, deviceDefinition){
        this.subsystemsTree = []
        this.components?.forEach((component) => {
            if(component) {
                try {
                    this.subsystemsTree.push(component.getSubsystem())
                } catch {

                }
            }
        })
    }

    getComponentsTree(deviceName?, deviceDefinition?) {
        const ports = deviceDefinition.board.ports
        this.pinTable = []
        ports.forEach(port => {
            if(!['3V3', 'EN', '36', '39', 'CLK'].includes(port.name)) this.pinTable.push(port.name)
        });

        this.createComponentsTree(deviceName, deviceDefinition)
        //console.log("🚀 ~ file: Device.ts:275 ~ Device ~ create ~ jsYaml.dump(components):", jsYaml.dump(components, {lineWidth: -1}))
        return this.componentsTree
    }

    
    getSubsystemsTree(deviceName?, deviceDefinition?) {
        this.createSubsystemsTree(deviceName, deviceDefinition)
        return this.subsystemsTree;
    }

    dump(format="yaml"){
        if(format=="yaml"){
            return jsYaml.dump(this.componentsTree,{lineWidth: -1})
        }else{
            return undefined;
        }
    }
}

export default function device(deviceInfo) {
    return new Device(deviceInfo)
}
