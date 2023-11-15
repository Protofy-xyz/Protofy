const jsYaml = require("js-yaml");
class Device {
    components;

    mqttPrefix;


    pinTable;

    constructor(components) {
        this.pinTable = []
        this.mqttPrefix = ""
        this.components = components.slice(10)

    }


    setMqttPrefix(mqttPrefix) {
        this.mqttPrefix = mqttPrefix
        return this
    }

    setWifiPowerMode(mode) {
        if (this.wifiPowerMode === 'none') {
            if (mode === 'light' || mode == 'high') {
                this.wifiPowerMode = mode
            }

            return
        }
        if (this.wifiPowerMode === 'light' && mode === 'high') {
            this.wifiPowerMode = mode
            return
        }

        this.wifiPowerMode === mode // for "high" mode cases on this.wifiPowerMode
    }
    
    getComponents(deviceName, deviceDefinition){
        console.log("🚀 ~ file: Device.ts:69 ~ Device ~ getComponents ~ deviceDefinition:", deviceDefinition)
        var deviceComponents = {
            esphome: {
                name: deviceName,
            },
            [deviceDefinition.board.core]: deviceDefinition.config.sdkConfig,
            logger: {}
        }

        // const exctractComponents = (componentObjects) => {
        //     componentObjects.forEach((element, j)=>{
        //         if(!components[element.name]){
        //             components[element.name] = element.config
        //         }else{
        //             if(!Array.isArray(components[element.name])){
        //                 components[element.name] = [components[element.name]]
        //             }
        //             components[element.name] = [...components[element.name],element.config]
        //         }
        //     })
        // }
        this.components?.forEach((component, i) => {
            console.log("🚀 ~ file: Device.ts:62 ~ Device ~ this.components?.forEach ~ component:", component)
            if(component){
                // try {
                //     component.setMqttTopicPrefix(`${this.mqttPrefix != '' ? this.mqttPrefix + '/' + this.name : this.name}`);
                // } catch (e) {
                    
                // }
                // try {
                //     component.setDeepSleep(this.deepSleep);
                // } catch (e) {

                // }
                deviceComponents = component.attach(
                    !isNaN(parseInt(this.pinTable[i])) 
                      ? parseInt(this.pinTable[i])
                      : this.pinTable[i], deviceComponents, this.components
                  );
            }
        })
        // if(this.deepSleep) exctractComponents(this.dsComponents)
        console.log("🚀 ~ file: Device.ts:120 ~ Device ~ getComponents ~ deviceComponents:", deviceComponents)
        return deviceComponents

    }

    create(deviceName?, deviceDefinition?) {
        const ports = deviceDefinition.board.ports
        this.pinTable = []
        ports.forEach(port => {
            if(!['3V3', 'EN', '36', '39', 'CLK'].includes(port.name)) this.pinTable.push(port.name)
        });

        var components = this.getComponents(deviceName, deviceDefinition)
        console.log("🚀 ~ file: Device.ts:275 ~ Device ~ create ~ jsYaml.dump(components):", jsYaml.dump(components, {lineWidth: -1}))
        return jsYaml.dump(components, {lineWidth: -1});
    }
}

export default function device(deviceInfo) {
    return new Device(deviceInfo)
}
