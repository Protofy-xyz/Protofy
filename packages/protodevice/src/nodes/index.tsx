import dynamic from 'next/dynamic'
import { generateColorbyIndex } from 'protoflow/src/diagram/Theme'

const Wifi = dynamic(() => import('./Wifi'))
const Device = dynamic(() => import('./Device'))
const Mqtt = dynamic(() => import('./Mqtt'))
const DeepSleep = dynamic(() => import('./DeepSleep'))
const BinarySensor = dynamic(() => import('./BinarySensor'))
const NeopixelsBus = dynamic(() => import('./NeopixelsBus'))
const Relay = dynamic(() => import('./Relay'))
const GPIOSwitch = dynamic(() => import('./GPIOSwitch'))
const ADCSensor = dynamic(() => import('./ADCSensor'))
const I2cBus = dynamic(() => import('./I2cBus'))
const PCA9685 = dynamic(() => import('./PCA9685'))
const Ethernet = dynamic(() => import('./Ethernet'))
const Dfplayer = dynamic(() => import('./Dfplayer'))
const ModbusLoadCell = dynamic(() => import('./ModbusLoadCell'))
const TempHumidity = dynamic(() => import('./TempHumidity'))
const MicrofirePhEcTemp = dynamic(() => import('./MicrofirePhEcTemp'))
const SEN55 = dynamic(() => import('./SEN55'))
const MHZ19 = dynamic(() => import('./MHZ19'))
const UARTBus = dynamic(() => import('./UARTBus'))
const MPU6050 = dynamic(() => import('./MPU6050'))
const HX711 = dynamic(() => import('./HX711'))
const A4988 = dynamic(() => import('./A4988'))
// import PulseCounter from "./PulseCounter";
// import LEDCOutput from "./LEDCOutput";
// import PIRSensor from "./PIRSensor"
// import HX711 from "./HX711"
// import CapacitiveSoilMoistureSensor from "./CapacitiveSoilMoistureSensor";
// import NFCReader from "./NFCReader";
// import UltrasonicDistanceSensor from "./UltrasonicDistanceSensor";
// import ISOutput from "./ISOutput";
// import XiaomiMiFlora from "./XiaomiMiFlora";
// import ClimateIR from "./ClimateIR";
// import Servo from "./Servo";
// import Mpr121 from "./Mpr121";
// import TempHumidity from "./TempHumidity";
// import BH1750 from "./BH1750";
// import HM3301 from "./HM3301";
// import SEN0377 from "./SEN0377";
// import MPU6050 from "./MPU6050";
// import I2cSensorMatrix from "./I2cSensorMatrix";
// import SEN55 from "./SEN55";
// import MHZ19 from "./MHZ19";


const deviceMasks = [
  {
    id: 'esp32dev',
    type: 'ArrayLiteralExpression',
    check: (node, nodeData) => node.type == "ArrayLiteralExpression" && nodeData['element-1'] == '"esp32dev"',
    getComponent: (node, nodeData, children) => <Device color={getColor('esp32dev')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: '"esp32dev"' } },
    hidden: true,
    nonDeletable: true
  },
  {
    id: 'Wifi',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('wifi'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <Wifi color={getColor('Wifi')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'wifi', "param-1": { value: "SSID", kind: "StringLiteral" }, "param-2": { value: "PASSWORD", kind: "StringLiteral" }, "param-3": { value: "none", kind: "StringLiteral" } } }
  },
  {
    id: 'Mqtt',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mqtt'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <Mqtt color={getColor('Mqtt')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'mqtt', "param-1": { value: "BROKERADDRESS", kind: "StringLiteral" }, "param-2": { value: "1883", kind: "StringLiteral" } } }
  },
  // {
  //   id: 'DeepSleep',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('deepSleep'), //TODO: Change output function name
  //   getComponent: DeepSleep,
  //   getInitialData: () => { return { to: 'deepSleep', "param-1": '"10"', "param-2": '"10"', "param-3": '' } }
  // },
  {
    id: 'Relay',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('relay'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <Relay color={getColor('Relay')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'relay', "param-1": { value: "", kind: "StringLiteral" }, "param-2": '"ALWAYS_OFF"' } }
  },

  {
    id: 'GPIOSwitch',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('GPIOSwitch'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <GPIOSwitch color={getColor('GPIOSwitch')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'GPIOSwitch', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "ALWAYS_OFF", kind: "StringLiteral" } } }
  },

  // This was commented on previous platform versions
  // {
  //   id: 'Output',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('output'), //TODO: Change output function name
  //   getComponent: OutputPin,
  //   getInitialData: () => { return { to: 'output', "param-1": "" } }
  // },


  {
    id: 'BinarySensor',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('binarySensor'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <BinarySensor color={getColor('BinarySensor')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'binarySensor', "param-1": { value: "", kind: "StringLiteral" } } }
  },
  {
    id: 'NeopixelsBus',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('neopixelsBus'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <NeopixelsBus color={getColor('NeopixelsBus')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'neopixelsBus', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "16", kind: "StringLiteral" }, "param-3": { value: "GRB", kind: "StringLiteral" }, "param-4": { value: "WS2811", kind: "StringLiteral" }, "param-5": { value: "ALWAYS_ON", kind: "StringLiteral" }, "param-6": { value: "1s", kind: "StringLiteral" }, "param-7": { value: "0", kind: "StringLiteral" }, "param-8": { value: false, kind: "FalseKeyword" }, "param-9": { value: false, kind: "FalseKeyword" }, "param-10": { value: false, kind: "FalseKeyword" }, "param-11": { value: false, kind: "FalseKeyword" }, "param-12": { value: false, kind: "FalseKeyword" }, "param-13": { value: false, kind: "FalseKeyword" }, "param-14": { value: false, kind: "FalseKeyword" }, "param-15": { value: false, kind: "FalseKeyword" }, "param-16": { value: false, kind: "FalseKeyword" }, "param-17": { value: false, kind: "FalseKeyword" }, "param-18": { value: false, kind: "FalseKeyword" } } }
  },
  {
    id: 'ADCSensor',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('adcSensor'),
    getComponent: (node, nodeData, children) => <ADCSensor color={getColor('ADCSensor')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'adcSensor', "param-1": { value: "analogic", kind: "StringLiteral" }, "param-2": { value: "30s", kind: "StringLiteral" }, "param-3": { value: "auto", kind: "StringLiteral" } } }
  },
  {
    id: 'I2cBus',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('i2cBus'),
    getComponent: (node, nodeData, children) => <I2cBus color={getColor('I2cBus')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'i2cBus', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "22", kind: "StringLiteral" }, "param-3": { value: true, kind: "FalseKeyword" } } }
  },
  {
    id: 'UARTBus',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('uartBus'),
    getComponent: (node, nodeData, children) => <UARTBus color={getColor('UARTBus')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'uartBus', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "17", kind: "StringLiteral" }, "param-3": { value: "9600", kind: "StringLiteral" } } }
  },
  {
    id: 'PCA9685',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('pca9685'),
    getComponent: (node, nodeData, children) => <PCA9685 color={getColor('PCA9685')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'pca9685', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "1000", kind: "StringLiteral" }, "param-3": { value: false, kind: "FalseKeyword" }, "param-4": { value: "0x40", kind: "StringLiteral" }, "param-5": { value: "", kind: "StringLiteral" } } }
  },
  {
    id: 'Ethernet',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ethernet'),
    getComponent: (node, nodeData, children) => <Ethernet color={getColor('Ethernet')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'ethernet', "param-1": { value: "LAN8720", kind: "StringLiteral" }, "param-2": { value: 23, kind: "NumericLiteral" }, "param-3": { value: 18, kind: "NumericLiteral" }, "param-4": { value: "GPIO17_OUT", kind: "StringLiteral" }, "param-5": { value: 0, kind: "NumericLiteral" }, "param-6": { value: 12, kind: "NumericLiteral" } } }
  },
  {
    id: 'TempHumidity',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('tempHumidity'),
    getComponent: (node, nodeData, children) => <TempHumidity color={getColor('TempHumidity')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'tempHumidity', "param-1": { value: "temperaturehumidity", kind: "StringLiteral" }, "param-2": { value: "DHT22", kind: "StringLiteral" }, "param-3": { value: "60s", kind: "StringLiteral" } } }
  },
  {
    id: 'MicrofirePhEcTemp',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('microfirePhEcTemp'),
    getComponent: (node, nodeData, children) => <MicrofirePhEcTemp color={getColor('MicrofirePhEcTemp')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'microfirePhEcTemp', "param-1": { value: "phectemp", kind: "StringLiteral" }, "param-2": { value: 22, kind: "NumericLiteral" }, "param-3": { value: "60s", kind: "StringLiteral" } } }
  },
  // {
  //   id: 'PulseCounter',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('pulseCounter'),
  //   getComponent: PulseCounter,
  //   getInitialData: () => { return { to: 'pulseCounter', "param-1": "" } }
  // },
  // {
  //   id: 'LEDCOutput',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ledcOutput'),
  //   getComponent: LEDCOutput,
  //   getInitialData: () => { return { to: 'ledcOutput', "param-1": "", "param-2": '"1000Hz"' } }
  // },
  // {
  //   id: 'PIRSensor',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('pirSensor'),
  //   getComponent: PIRSensor,
  //   getInitialData: () => { return { to: 'pirSensor', "param-1": "" } }
  // },
  {
    id: 'HX711',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('hx711'),
    getComponent: (node, nodeData, children) => <HX711 color={getColor('HX711')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'hx711', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "128", kind: "StringLiteral" }, "param-4": { value: "60s", kind: "StringLiteral" } } }
  },
  {
    id: 'A4988',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('a4988'),
    getComponent: (node, nodeData, children) => <A4988 color={getColor('A4988')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'a4988', "param-1": "", "param-2": "", "param-3": "250 steps/s", "param-4": "none", "param-5": "inf", "param-6": "inf" } }
  },

  // {
  //   id: 'Dfplayer',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('dfplayer'),
  //   getComponent: Dfplayer,
  //   getInitialData: () => { return { to: 'dfplayer', "param-1": "", "param-2": '', "param-3": '' } }
  // },
  // {
  //   id: 'UltrasonicDistanceSensor',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ultrasonicDistanceSensor'),
  //   getComponent: UltrasonicDistanceSensor,
  //   getInitialData: () => { return { to: 'ultrasonicDistanceSensor', "param-1": "", "param-2": '', "param-3": '"60s"', "param-4": '"2.0m"' } }
  // },
  // {
  //   id: 'CapacitiveSoilMoistureSensor',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('capacitiveSoilMoistureSensor'),
  //   getComponent: CapacitiveSoilMoistureSensor,
  //   getInitialData: () => { return { to: 'capacitiveSoilMoistureSensor', "param-1": "", "param-2": '"30s"' } }
  // },
  // {
  //   id: 'NFCReader',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('nfcReader'),
  //   getComponent: NFCReader,
  //   getInitialData: () => { return { to: 'nfcReader', "param-1": "", "param-2": '"22"' } }
  // },
  // {
  //   id: 'ISOutput',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('isOutput'),
  //   getComponent: ISOutput,
  //   getInitialData: () => { return { to: 'isOutput', "param-1": "" } }
  // },
  // {
  //   id: 'XiaomiMiFlora',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('xiaomiMiFlora'),
  //   getComponent: XiaomiMiFlora,
  //   getInitialData: () => { return { to: 'xiaomiMiFlora', "param-1": "", "param-2": '""' } }
  // },
  // {
  //   id: 'ClimateIR',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('climateIR'),
  //   getComponent: ClimateIR,
  //   getInitialData: () => { return { to: 'climateIR', "param-1": "", "param-2": '""', "param-3": '"auto"', "param-4": '"auto"', "param-5": '"30"', "param-6": "16" } }
  // },
  // {
  //   id: 'Servo',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('servo'),
  //   getComponent: Servo,
  //   getInitialData: () => { return { to: 'servo', "param-1": "" } }
  // },
  // {
  //   id: 'Mpr121',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mpr121'),
  //   getComponent: Mpr121,
  //   getInitialData: () => { return { to: 'mpr121', "param-1": "", "param-2": '"22"', "param-3": false, "param-4": false, "param-5": false, "param-6": false, "param-7": false, "param-8": false, "param-9": false, "param-10": false, "param-11": false, "param-12": false, "param-13": false, "param-14": false } }
  // },
  // {
  //   id: 'ModbusLoadCell',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('modbusLoadCell'),
  //   getComponent: ModbusLoadCell,
  //   getInitialData: () => { return { to: 'modbusLoadCell', "param-1": "", "param-2": '""', "param-3": '""', "param-4": '"2s"', "param-5": '3', "param-6": '2', "param-7": '5'} }
  // }
  // {
  //   id: 'BH1750',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('bh1750'),
  //   getComponent: BH1750,
  //   getInitialData: () => { return { to: 'bh1750', "param-1": "", "param-2": '22', "param-3": '"0x23"', "param-4": '"30s"'} }
  // },
  // {
  //   id: 'HM3301',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('hm3301'),
  //   getComponent: HM3301,
  //   getInitialData: () => { return { to: 'hm3301', "param-1": "", "param-2": '22', "param-3": '"0x40"', "param-4": '"30s"'} }
  // },
  // {
  //   id: 'SEN0377',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('sen0377'),
  //   getComponent: SEN0377,
  //   getInitialData: () => { return { to: 'sen0377', "param-1": "", "param-2": '22', "param-3": '"0x75"', "param-4": '"30s"'} }
  // },
  {
    id: 'MPU6050',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mpu6050'),
    getComponent: (node, nodeData, children) => <MPU6050 color={getColor('MPU6050')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'mpu6050', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "0x68", kind: "StringLiteral" }, "param-4": { value: "30s", kind: "StringLiteral" } } }
  },
  // {
  //   id: 'I2cSensorMatrix',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('i2cSensorMatrix'),
  //   getComponent: I2cSensorMatrix,
  //   getInitialData: () => { return { to: 'i2cSensorMatrix', "param-1": "", "param-2": '22', "param-3": '"30s"', "param-4": '"0x23"', "param-5": "0x40", "param-6": "0x75", "param-7": "0x68"} }
  // },
  {
    id: 'SEN55',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('sen55'),
    getComponent: (node, nodeData, children) => <SEN55 color={getColor('SEN55')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'sen55', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "0x69", kind: "StringLiteral" }, "param-4": { value: "30s", kind: "StringLiteral" } } }
  },
  {
    id: 'MHZ19',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mhz19'),
    getComponent: (node, nodeData, children) => <MHZ19 color={getColor('MHZ19')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'mhz19', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "30s", kind: "StringLiteral" } } }
  },
]

const masksLength = deviceMasks.length
export const getColor = (id) => {
  // To future refactor: 
  // If you try to find index by "e.check(...)"" instead "e.id == id" on node menu doesn't get the color
  const index = deviceMasks.findIndex(e => e.id == id)
  const col = generateColorbyIndex(index, masksLength)

  return col
}


export default deviceMasks.map((e) => {
  return {
    ...e,
    capabilities: ["esphome"]
  };
});