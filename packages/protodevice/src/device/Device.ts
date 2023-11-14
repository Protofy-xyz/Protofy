const jsYaml = require("js-yaml");
class Device {
    name;
    type;
    components;
    dsComponents;
    ssid;
    password;
    mqtt;
    mqttPrefix;
    mqttJsonEndpoints;
    onJsonMessage;
    onMessage;
    onBoot;
    onShutdown;
    wifiPowerMode;
    deepSleep;
    deepSleepRunDuration;
    deepSleepSleepDuration;
    wakeupPin;
    pinTable;

    constructor(deviceInfo) {
        this.name = deviceInfo[0]
        this.type = deviceInfo[1]
        // this.ssid = deviceInfo[2]
        // this.password = deviceInfo[3]
        // this.wifiPowerMode = deviceInfo[4]
        // this.mqtt = deviceInfo[5]
        // this.deepSleep = deviceInfo[6]
        // this.deepSleepRunDuration = deviceInfo[7]
        // this.deepSleepSleepDuration =deviceInfo[8]
        // this.wakeupPin = deviceInfo[9]
        this.pinTable = []
        this.mqttPrefix = ""
        this.components = deviceInfo.slice(10)
        this.mqttJsonEndpoints = ''
        this.onJsonMessage = undefined
        this.onMessage = undefined
        this.onBoot = undefined
        this.onShutdown= undefined

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
    
    getComponents(deviceDefinition){
        var deviceComponents = {
            esphome: {
                name: this.name,
            },
            [deviceDefinition.board.core.name]: deviceDefinition.sdkConfig,
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
        this.components.forEach((component, i) => {
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
                      : this.pinTable[i], deviceComponents
                  );
            }
        })
        // if(this.deepSleep) exctractComponents(this.dsComponents)
        console.log("🚀 ~ file: Device.ts:120 ~ Device ~ getComponents ~ deviceComponents:", deviceComponents)
        return deviceComponents

    }

    extractOnJSONMessage(components) {
        if (!components.on_json_message) return components;
        if(Array.isArray(components.on_json_message)){
            this.onJsonMessage = []
            components.on_json_message.map(e => {
                this.onJsonMessage.push(e)
            })
        }else{
            this.onJsonMessage = components.on_json_message

        }
        delete components.on_json_message
        return components
    }

    create(deviceDefinition?) {
        const ports = deviceDefinition[0].board.ports
        this.pinTable = []
        ports.forEach(port => {
            if(!['3V3', 'EN', '36', '39', 'CLK'].includes(port.name)) this.pinTable.push(port.name)
        });

        var components = this.getComponents(deviceDefinition[0])
        //console.log("🚀 ~ file: Device.ts:275 ~ Device ~ create ~ jsYaml.dump(components):", jsYaml.dump(components, {lineWidth: -1}))
        return jsYaml.dump(components, {lineWidth: -1});
    }
}

export default function device(deviceInfo) {
    return new Device(deviceInfo)
}
