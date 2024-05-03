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
            ...deviceDefinition.config.sdkConfig,
            logger: {}
        }
        deviceComponents.esphome.name = deviceName

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
                    let componentSubsystem = component.getSubsystem()
                    this.subsystemsTree.push({generateEvent: componentSubsystem.generateEvent??true, ...componentSubsystem})
                } catch {

                }
            }
        })
        this.subsystemsTree = this.subsystemsTree.sort((a,b)=>{
            if(a.name=="mqtt"){
                return 1
            }else if(b.name == "mqtt"){
                return -1
            }else{
                return 0
            }
        })
    }

    getComponentsTree(deviceName?, deviceDefinition?) {
        const ports = deviceDefinition.board.ports
        if(deviceDefinition.board.name == "Seeed Studio XIAO ESP32S3"){
            this.pinTable = ports.map(port => port.name)
        } else {
            ports.forEach(port => {
                if(!['3V3', 'EN', '36', '39', 'CLK'].includes(port.name)) this.pinTable.push(port.name)
                });
        }
        
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

export function device(deviceInfo) {
    return new Device(deviceInfo)
}
