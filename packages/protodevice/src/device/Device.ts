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
        this.ssid = deviceInfo[2]
        this.password = deviceInfo[3]
        this.wifiPowerMode = deviceInfo[4]
        this.mqtt = deviceInfo[5]
        this.deepSleep = deviceInfo[6]
        this.deepSleepRunDuration = deviceInfo[7]
        this.deepSleepSleepDuration =deviceInfo[8]
        this.wakeupPin = deviceInfo[9]
        this.pinTable = []
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
                const componentObjects = component.attach(
                    !isNaN(parseInt(this.pinTable[i])) 
                      ? parseInt(this.pinTable[i])
                      : this.pinTable[i]
                  );
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


    create(deviceDefinition?) {
        console.log("🚀 ~ file: Device.ts:253 ~ Device ~ create ~ deviceDefinition:", deviceDefinition)
        const ports = deviceDefinition.board.ports
        this.pinTable = []
        ports.forEach(port => {
            if(!['3V3', 'EN', '36', '39', 'CLK'].includes(port.name)) this.pinTable.push(port.name)
        });

        var components = this.getComponents()
        components = this.extractOnJSONMessage(components)
        components = this.extractOnMessage(components)
        components = this.extractOnBoot(components)
        components= this.extractOnShutdown(components)

        //console.log("🚀 ~ file: Device.ts:275 ~ Device ~ create ~ this.dump() + jsYaml.dump(components):", this.dump() + jsYaml.dump(components, {lineWidth: -1}))
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
}

export default function device(deviceInfo) {
    return new Device(deviceInfo)
}
