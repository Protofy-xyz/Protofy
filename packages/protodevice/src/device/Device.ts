const jsYaml = require("js-yaml");
// const pinTable = [
//     '34', '35', '32', '33', '25', '26', '27', '14', '12', '13', 'D2', 'D3',
//     '23', '22', 'TX', 'RX', '21', '19', '18', '5', '17', '16', '4', '0', '2', '15', 'D1', 'D0'
// ]

export const pinTable = [
    '34', '35', '32', '33', '25', '26', '27', '14', '12', 'GND', '13',
    'D2', 'D3', 'CMD', '5V', 'GND', '23', '22', 'TX', 'RX', '21', 'GND',
    '19', '18', '5', '17', '16', '4', '0', '2', '15', 'D1', 'D0'
]

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

    constructor(deviceInfo) {
        this.name = deviceInfo[0]
        this.type = deviceInfo[1]
        this.ssid = deviceInfo[2]
        this.password = deviceInfo[3]
        this.wifiPowerMode = deviceInfo[4]
        this.mqtt = deviceInfo[5]
        this.deepSleep = deviceInfo[6]
        this.deepSleepRunDuration = deviceInfo[7]
        this.deepSleepSleepDuration =deviceInfo[8]
        this.wakeupPin = deviceInfo[9]
        this.mqttPrefix = ""
        this.components = deviceInfo.slice(10)
        this.dsComponents = []
        this.mqttJsonEndpoints = ''
        this.onJsonMessage = undefined
        this.onMessage = undefined
        this.onBoot = undefined
        this.onShutdown= undefined
        this.dsComponents = [
        {
            name: 'deep_sleep', 
            config:{
                id: "ds",
                sleep_duration: this.deepSleepSleepDuration+"s",
                wakeup_pin: this.wakeupPin,
                wakeup_pin_mode: "KEEP_AWAKE"

        }},
        {
            name: 'globals', 
            config:{
                id: "dp_run_duration",
                type: "int",
                restore_value: "yes",
                initial_value: this.deepSleepRunDuration
        }},
        {
            name: 'globals',
            config: {
                id: "dp_sleep_duration",
                type: "int",
                restore_value: "yes",
                initial_value: this.deepSleepSleepDuration
        }},
        {
            name: 'on_message',
            config:{
                topic: `${this.mqttPrefix !== '' ? this.mqttPrefix + '/' + this.name : this.name}/deep_sleep/dp_sleep_duration/command`,
                then:{
                    lambda: 
`int value = atoi(x.c_str());
if (value == 0) {
id(ds).prevent_deep_sleep();
ESP_LOGD("Deep Sleep", "Deep Sleep disabled");
} else if (value > 0) {
id(ds).allow_deep_sleep();
id(dp_sleep_duration) = value;
id(ds).set_sleep_duration(value * 1000);
ESP_LOGD("Deep Sleep", "Deep Sleep sleep duration set to: %d", value);
ESP_LOGD("Deep Sleep", "Global Deep Sleep sleep duration set to: %d", id(dp_run_duration));
} else {
ESP_LOGD("Deep Sleep", "Invalid sleep duration value");
}`
                }
        }},
        {
            name: 'on_message',
            config:{
                topic: `${this.mqttPrefix !== '' ? this.mqttPrefix + '/' + this.name : this.name}/deep_sleep/dp_run_duration/command`,
                then:{
                    lambda: 
`int value = atoi(x.c_str());
if (value > 0){
id(dp_run_duration) = value;
id(ds).set_run_duration(value*1000);
ESP_LOGD("Deep Sleep", "Deep Sleep run duration set to: %d",  value);
ESP_LOGD("Deep Sleep", "Global Deep Sleep run duration set to: %d",  id(dp_run_duration));       
} 
else {
ESP_LOGD("Deep Sleep", "Invalid run duration value");
}`
                }
        }},
        {
            name: 'on_boot',
            config:{
                priority: 600,
                then:{
                  lambda: 
`ESP_LOGD("Deep Sleep", "Global Deep Sleep run duration set to at boot: %d",  id(dp_run_duration));
id(ds).set_run_duration(id(dp_run_duration)*1000);
ESP_LOGD("Deep Sleep", "Global Deep Sleep sleep duration set to at boot: %d",  id(dp_sleep_duration));
id(ds).set_sleep_duration(id(dp_sleep_duration)*1000);`
              }
      }},
    ]

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

//     getComponentsJSON() {
//         var finalJSON = {}
//         var prevComponentsOut = []
//         console.log('components', this.components)
//         this.components.forEach((component, i) => {
//             if (component) {
//                 try {
//                     component.setMqttTopicPrefix(`${this.mqttPrefix != '' ? this.mqttPrefix + '/' + this.name : this.name}`);
//                 } catch (e) {

//                 }

//                 try {
//                     this.setWifiPowerMode(component.getWifiPowerMode())
//                 } catch (e) {

//                 }
//                 try {
//                     component.setDeepSleep(this.deepSleep);
//                 } catch (e) {

//                 }

//                 console.log('component', component)
//                 var repeated = false
//                 const componentsOut = component.attach(pinTable[i]);
//                 if (!componentsOut.length) {
//                     if (finalJSON.hasOwnProperty(componentsOut.componentName)) {
//                         finalJSON[componentsOut.componentName].push(componentsOut.payload);
//                     } else {
//                         finalJSON[componentsOut.componentName] = [componentsOut.payload];
//                     }
//                 } else {
//                     componentsOut.map((componentOut) => {
//                     if (finalJSON.hasOwnProperty(componentOut.componentName)) {
//                         prevComponentsOut.forEach(component => {
//                             if(component.payload === componentOut.payload) repeated = true
//                         })
//                         if(!repeated) finalJSON[componentOut.componentName].push(componentOut.payload);
//                         repeated = false
//                     } else {
//                         finalJSON[componentOut.componentName] = [componentOut.payload]
//                     }
//                     prevComponentsOut.push(componentOut)
//                     })
//                 }
//             }
//         })
//         this.dsComponents = [
//             {componentName: 'deep_sleep', payload:{
//                 deep_sleep: {
//                     id: "ds",
//                     sleep_duration: this.deepSleepSleepDuration+"s",
//                     wakeup_pin: this.wakeupPin,
//                     wakeup_pin_mode: "KEEP_AWAKE"

//                 }
//             }},
//             {componentName: 'globals', payload:{
//                 globals: {
//                     id: "dp_run_duration",
//                     type: "int",
//                     restore_value: "yes",
//                     initial_value: this.deepSleepRunDuration
//                 }
//             }},
//             {componentName: 'globals', payload:{
//                 globals: {
//                     id: "dp_sleep_duration",
//                     type: "int",
//                     restore_value: "yes",
//                     initial_value: this.deepSleepSleepDuration
//                 }
//             }},
//             {componentName: 'on_message', payload:{
//                 on_message:{
//                     topic: `${this.mqttPrefix !== '' ? this.mqttPrefix + '/' + this.name : this.name}/deep_sleep/dp_sleep_duration/command`,
//                     then:{
//                         lambda: 
// `int value = atoi(x.c_str());
// if (value == 0) {
//     id(ds).prevent_deep_sleep();
//     ESP_LOGD("Deep Sleep", "Deep Sleep disabled");
// } else if (value > 0) {
//     id(ds).allow_deep_sleep();
//     id(dp_sleep_duration) = value;
//     id(ds).set_sleep_duration(value * 1000);
//     ESP_LOGD("Deep Sleep", "Deep Sleep sleep duration set to: %d", value);
//     ESP_LOGD("Deep Sleep", "Global Deep Sleep sleep duration set to: %d", id(dp_run_duration));
// } else {
//     ESP_LOGD("Deep Sleep", "Invalid sleep duration value");
// }`
//                     }
//                 }
//             }},
//             {componentName: 'on_message', payload:{
//                 on_message:{
//                     topic: `${this.mqttPrefix !== '' ? this.mqttPrefix + '/' + this.name : this.name}/deep_sleep/dp_run_duration/command`,
//                     then:{
//                         lambda: 
// `int value = atoi(x.c_str());
// if (value > 0){
//     id(dp_run_duration) = value;
//     id(ds).set_run_duration(value*1000);
//     ESP_LOGD("Deep Sleep", "Deep Sleep run duration set to: %d",  value);
//     ESP_LOGD("Deep Sleep", "Global Deep Sleep run duration set to: %d",  id(dp_run_duration));       
//     } 
//     else {
//     ESP_LOGD("Deep Sleep", "Invalid run duration value");
// }`
//                     }
//                 }
//             }},
//             {componentName: 'on_boot', payload:{
//               on_boot:{
//                   priority: 600,
//                   then:{
//                       lambda: 
// `ESP_LOGD("Deep Sleep", "Global Deep Sleep run duration set to at boot: %d",  id(dp_run_duration));
// id(ds).set_run_duration(id(dp_run_duration)*1000);
// ESP_LOGD("Deep Sleep", "Global Deep Sleep sleep duration set to at boot: %d",  id(dp_sleep_duration));
// id(ds).set_sleep_duration(id(dp_sleep_duration)*1000);
// `
//                   }
//               }
//           }},
//         ]
//         console.log("dscomponents ", this.dsComponents)
//         if(this.deepSleep) this.dsComponents.forEach((component, i) => {
//             console.log('component', component)
//             var repeated = false
//             const componentsOut = component
//             if (!componentsOut.length) {
//                 if (finalJSON.hasOwnProperty(componentsOut.componentName)) {
//                     finalJSON[componentsOut.componentName].push(componentsOut.payload);
//                 } else {
//                     finalJSON[componentsOut.componentName] = [componentsOut.payload];
//                 }
//             } else {
//                 componentsOut.map((componentOut) => {
//                 if (finalJSON.hasOwnProperty(componentOut.componentName)) {
//                     prevComponentsOut.forEach(component => {
//                         if(component.payload === componentOut.payload) repeated = true
//                     })
//                     if(!repeated) finalJSON[componentOut.componentName].push(componentOut.payload);
//                     repeated = false
//                 } else {
//                     finalJSON[componentOut.componentName] = [componentOut.payload]
//                 }
//                 prevComponentsOut.push(componentOut)
//                 })
//             }
//         })
//         return finalJSON
//     }
    getComponents(){
        const components = {}

        
        const exctractComponents = (componentObjects) => {
            componentObjects.forEach((element, j)=>{
                if(!components[element.name]){
                    components[element.name] = element.config
                }else{
                    if(!Array.isArray(components[element.name])){
                        components[element.name] = [components[element.name]]
                    }
                    components[element.name] = [...components[element.name],element.config]
                }
            })
        }
        
        this.components.forEach((component, i) => {
            if(component){
                try {
                    component.setMqttTopicPrefix(`${this.mqttPrefix != '' ? this.mqttPrefix + '/' + this.name : this.name}`);
                } catch (e) {
                    
                }
                try {
                    component.setDeepSleep(this.deepSleep);
                } catch (e) {

                }
                const componentObjects = component.attach(parseInt(pinTable[i]))
                exctractComponents(componentObjects)
            }
        })
        if(this.deepSleep) exctractComponents(this.dsComponents)
        return components

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

    extractOnMessage(components) {
        if (!components.on_message) return components;
        if(Array.isArray(components.on_message)){
            this.onMessage = []
            components.on_message.map(e => {
                this.onMessage.push(e)
            })
        }else{
            this.onMessage = components.on_message

        }
        delete components.on_message
        return components
    }
    extractOnBoot(components) {
        if (!components.on_boot) return components;
        if(Array.isArray(components.on_boot)){
            this.onBoot = []
            components.on_boot.map(e => {
                this.onBoot.push(e)
            })
        }else{
            this.onBoot = components.on_boot

        }
        delete components.on_boot
        return components
    }
    extractOnShutdown(components) {
        if (!components.on_shutdown) return components;
        if(Array.isArray(components.on_shutdown)){
            this.onShutdown = []
            components.on_shutdown.map(e => {
                this.onShutdown.push(e)
            })
        }else{
            this.onShutdown = components.on_shutdown

        }
        delete components.on_shutdown
        return components
    }


    create() {
        //var components = this.getComponentsJSON()
        var components = this.getComponents()
        // var outJson = {}
        components = this.extractOnJSONMessage(components)
        components = this.extractOnMessage(components)
        components = this.extractOnBoot(components)
        components= this.extractOnShutdown(components)
        // Object.keys(components).map((k) => {
        //     if (components[k].length > 1) {
        //         if (outJson[k] === undefined) {
        //             outJson[k] = [];
        //         }
        //         components[k].forEach((component) => {
        //             outJson[k].push(component[k]);
        //         });
        //     } else {
        //             outJson[k] = components[k][0][k];
        //     }
        // })

        console.log("🚀 ~ file: Device.ts:275 ~ Device ~ create ~ this.dump() + jsYaml.dump(components):", this.dump() + jsYaml.dump(components, {lineWidth: -1}))
        
        // console.log("🚀 ~ file: Device.ts:290 ~ Device ~ create ~ outJson:", outJson)
        return this.dump() + jsYaml.dump(components, {lineWidth: -1});
    }

    dump() {
        const esphomeJson = {
            esphome: {
                name: this.name,
            },
            esp32: {
                board: this.type,
                framework: {
                    type: 'arduino'
                }
            },
            logger: {},
            wifi: {
                ssid: this.ssid,
                password: this.password,
                power_save_mode: this.wifiPowerMode
            },
            mqtt: {
                broker: this.mqtt,
                topic_prefix: this.mqttPrefix != '' ? this.mqttPrefix + '/' + this.name : this.name,
            }
        }
        if (this.onBoot != undefined) {
            esphomeJson['esphome']['on_boot'] = this.onBoot
        }
        if (this.onShutdown != undefined) {
            esphomeJson['esphome']['on_shutdown'] = this.onShutdown
        }
        if (this.onJsonMessage != undefined) {
            esphomeJson['mqtt']['on_json_message'] = this.onJsonMessage
        }
        if (this.onMessage != undefined) {
            esphomeJson['mqtt']['on_message'] = this.onMessage
        }
        var dumpStr = jsYaml.dump(esphomeJson, {lineWidth: -1})
        return dumpStr;
        
    }

//     dump() {
//         var dumpStr = `esphome:
//     name: ${this.name}
//     ${this.onBoot == '' ? '' : "on_boot:"}
//     ${this.onBoot}
//     ${this.onShutdown == '' ? '' : "on_shutdown:"}
//     ${this.onShutdown}

// esp32:
//     board: ${this.type}
//     framework:
//         type: arduino

// logger:

// wifi:
//     ssid: "${this.ssid}"
//     password: "${this.password}"
//     power_save_mode: ${this.wifiPowerMode} 

// mqtt:
//     broker: ${this.mqtt}
//     topic_prefix: ${this.mqttPrefix != '' ? this.mqttPrefix + '/' + this.name : this.name}
//     ${this.onJsonMessage == '' ? '' : "on_json_message:"}
//     ${this.onJsonMessage}
//     ${this.onMessage == '' ? '' : "on_message:"}
//     ${this.onMessage}
// `;
//     return dumpStr
//     }
}

export default function device(deviceInfo) {
    return new Device(deviceInfo)
}
