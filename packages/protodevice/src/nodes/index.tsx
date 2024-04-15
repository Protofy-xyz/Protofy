import dynamic from 'next/dynamic';
import { generateColorbyIndex } from 'protoflow/src/diagram/Theme';
import Wifi from './Wifi';
import Device from './Device';
import Mqtt from './Mqtt';
import Relay from './Relay';
import GPIOSwitch from './GPIOSwitch';
import BinarySensor from './BinarySensor';
import NeopixelsBus from './NeopixelsBus';
import ADCSensor from './ADCSensor';
import I2cBus from './I2cBus';
import UARTBus from './UARTBus';
import PCA9685 from './PCA9685';
import Ethernet from './Ethernet';
import TempHumidity from './TempHumidity';
import MicrofirePhEcTemp from './MicrofirePhEcTemp';
import HX711 from './HX711';
import A4988 from './A4988';
import MPU6050 from './MPU6050';
import SEN55 from './SEN55';
import MHZ19 from './MHZ19';
import NFCReader from './NFCReader';

const deviceMasks = [
  Wifi,
  Device,
  Mqtt,
  Relay,
  GPIOSwitch,
  BinarySensor,
  NeopixelsBus,
  ADCSensor,
  I2cBus,
  UARTBus,
  PCA9685,
  Ethernet,
  TempHumidity,
  MicrofirePhEcTemp,
  HX711,
  A4988,
  MPU6050,
  SEN55,
  MHZ19,
  NFCReader,
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
// const DeepSleep = dynamic(() => import('./DeepSleep'))
// const Dfplayer = dynamic(() => import('./Dfplayer'))
// const ModbusLoadCell = dynamic(() => import('./ModbusLoadCell'))

// {
//   id: 'DeepSleep',
//   type: 'CallExpression',
//   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('deepSleep'), //TODO: Change output function name
//   getComponent: DeepSleep,
//   getInitialData: () => { return { to: 'deepSleep', "param-1": '"10"', "param-2": '"10"', "param-3": '' } }
// },
// {
//   id: 'Output',
//   type: 'CallExpression',
//   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('output'), //TODO: Change output function name
//   getComponent: OutputPin,
//   getInitialData: () => { return { to: 'output', "param-1": "" } }
// },
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
// {
//   id: 'I2cSensorMatrix',
//   type: 'CallExpression',
//   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('i2cSensorMatrix'),
//   getComponent: I2cSensorMatrix,
//   getInitialData: () => { return { to: 'i2cSensorMatrix', "param-1": "", "param-2": '22', "param-3": '"30s"', "param-4": '"0x23"', "param-5": "0x40", "param-6": "0x75", "param-7": "0x68"} }
// },