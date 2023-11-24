// import OutputPin from "./OutputPin";
import Wifi from './Wifi'
import Mqtt from './Mqtt'
import DeepSleep from './DeepSleep'
import Device from "./Device";
import BinarySensor from "./BinarySensor";
import NeopixelsBus from "./NeopixelsBus";
import Relay from "./Relay";
import ADCSensor from "./ADCSensor";
// import PulseCounter from "./PulseCounter";
// import LEDCOutput from "./LEDCOutput";
// import PIRSensor from "./PIRSensor"
// import HX711 from "./HX711"
// import CapacitiveSoilMoistureSensor from "./CapacitiveSoilMoistureSensor";
// import NFCReader from "./NFCReader";
// import UltrasonicDistanceSensor from "./UltrasonicDistanceSensor";
// import ISOutput from "./ISOutput";
import Dfplayer from "./Dfplayer";
// import XiaomiMiFlora from "./XiaomiMiFlora";
// import ClimateIR from "./ClimateIR";
// import Servo from "./Servo";
// import Mpr121 from "./Mpr121";
// import TempHumidity from "./TempHumidity";
import ModbusLoadCell from "./ModbusLoadCell";
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
    getComponent: Device,
    getInitialData: () => { return { to: '"esp32dev"' } },
    hidden: true,
    nonDeletable: true
  },
  {
    id: 'Wifi',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('wifi'), //TODO: Change output function name
    getComponent: Wifi,
    getInitialData: () => { return { to: 'wifi', param1: '"SSID"', param2: '"PASSWORD"', param3: '"none"' } }
  },
  {
    id: 'Mqtt',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mqtt'), //TODO: Change output function name
    getComponent: Mqtt,
    getInitialData: () => { return { to: 'mqtt', param1: '"BROKERADDRESS"', param2: '""' } }
  },
  // {
  //   id: 'DeepSleep',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('deepSleep'), //TODO: Change output function name
  //   getComponent: DeepSleep,
  //   getInitialData: () => { return { to: 'deepSleep', param1: '"10"', param2: '"10"', param3: '' } }
  // },
  {
    id: 'Relay',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('relay'), //TODO: Change output function name
    getComponent: Relay,
    getInitialData: () => { return { to: 'relay', param1: '""',param2: '"ALWAYS_OFF"' } }
  },

  
  // This was commented on previous platform versions
  // {
  //   id: 'Output',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('output'), //TODO: Change output function name
  //   getComponent: OutputPin,
  //   getInitialData: () => { return { to: 'output', param1: '""' } }
  // },


  {
    id: 'BinarySensor',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('binarySensor'), //TODO: Change output function name
    getComponent: BinarySensor,
    getInitialData: () => { return { to: 'binarySensor', param1: '""' } }
  },
  {
    id: 'NeopixelsBus',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('neopixelsBus'), //TODO: Change output function name
    getComponent: NeopixelsBus,
    getInitialData: () => { return { to: 'neopixelsBus', param1: '""', param2: '16', param3: '"GRB"', param4: '"WS2811"', param5: '"ALWAYS_ON"', param6: '"1s"', param7: '0', param8: false, param9: false, param10: false, param11: false, param12: false, param13: false, param14: false, param15: false, param16: false, param17: false, param18: false } }
  },
  {
    id: 'ADCSensor',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('adcSensor'),
    getComponent: ADCSensor,
    getInitialData: () => { return { to: 'adcSensor', param1: '"analogic"', param2: '"30s"', param3: '"auto"' } }
  },
  // {
  //   id: 'PulseCounter',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('pulseCounter'),
  //   getComponent: PulseCounter,
  //   getInitialData: () => { return { to: 'pulseCounter', param1: '""' } }
  // },
  // {
  //   id: 'LEDCOutput',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ledcOutput'),
  //   getComponent: LEDCOutput,
  //   getInitialData: () => { return { to: 'ledcOutput', param1: '""', param2: '"1000Hz"' } }
  // },
  // {
  //   id: 'PIRSensor',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('pirSensor'),
  //   getComponent: PIRSensor,
  //   getInitialData: () => { return { to: 'pirSensor', param1: '""' } }
  // },
  // {
  //   id: 'HX711',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('hx711'),
  //   getComponent: HX711,
  //   getInitialData: () => { return { to: 'hx711', param1: '""', param2: '', param3: '"128"', param4: '"60s"' } }
  // },
  // {
  //   id: 'Dfplayer',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('dfplayer'),
  //   getComponent: Dfplayer,
  //   getInitialData: () => { return { to: 'dfplayer', param1: '""', param2: '', param3: '' } }
  // },
  // {
  //   id: 'UltrasonicDistanceSensor',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ultrasonicDistanceSensor'),
  //   getComponent: UltrasonicDistanceSensor,
  //   getInitialData: () => { return { to: 'ultrasonicDistanceSensor', param1: '""', param2: '', param3: '"60s"', param4: '"2.0m"' } }
  // },
  // {
  //   id: 'CapacitiveSoilMoistureSensor',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('capacitiveSoilMoistureSensor'),
  //   getComponent: CapacitiveSoilMoistureSensor,
  //   getInitialData: () => { return { to: 'capacitiveSoilMoistureSensor', param1: '""', param2: '"30s"' } }
  // },
  // {
  //   id: 'NFCReader',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('nfcReader'),
  //   getComponent: NFCReader,
  //   getInitialData: () => { return { to: 'nfcReader', param1: '""', param2: '"22"' } }
  // },
  // {
  //   id: 'ISOutput',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('isOutput'),
  //   getComponent: ISOutput,
  //   getInitialData: () => { return { to: 'isOutput', param1: '""' } }
  // },
  // {
  //   id: 'XiaomiMiFlora',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('xiaomiMiFlora'),
  //   getComponent: XiaomiMiFlora,
  //   getInitialData: () => { return { to: 'xiaomiMiFlora', param1: '""', param2: '""' } }
  // },
  // {
  //   id: 'ClimateIR',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('climateIR'),
  //   getComponent: ClimateIR,
  //   getInitialData: () => { return { to: 'climateIR', param1: '""', param2: '""', param3: '"auto"', param4: '"auto"', param5: '"30"', param6: '"16"' } }
  // },
  // {
  //   id: 'Servo',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('servo'),
  //   getComponent: Servo,
  //   getInitialData: () => { return { to: 'servo', param1: '""' } }
  // },
  // {
  //   id: 'Mpr121',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mpr121'),
  //   getComponent: Mpr121,
  //   getInitialData: () => { return { to: 'mpr121', param1: '""', param2: '"22"', param3: false, param4: false, param5: false, param6: false, param7: false, param8: false, param9: false, param10: false, param11: false, param12: false, param13: false, param14: false } }
  // },
  // {
  //   id: 'TempHumidity',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('tempHumidity'),
  //   getComponent: TempHumidity,
  //   getInitialData: () => { return { to: 'tempHumidity', param1: '""', param2: '"DHT11"', param3: '"60s"' } }
  // },
  // {
  //   id: 'ModbusLoadCell',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('modbusLoadCell'),
  //   getComponent: ModbusLoadCell,
  //   getInitialData: () => { return { to: 'modbusLoadCell', param1: '""', param2: '""', param3: '""', param4: '"2s"', param5: '3', param6: '2', param7: '5'} }
  // }
  // {
  //   id: 'BH1750',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('bh1750'),
  //   getComponent: BH1750,
  //   getInitialData: () => { return { to: 'bh1750', param1: '""', param2: '22', param3: '"0x23"', param4: '"30s"'} }
  // },
  // {
  //   id: 'HM3301',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('hm3301'),
  //   getComponent: HM3301,
  //   getInitialData: () => { return { to: 'hm3301', param1: '""', param2: '22', param3: '"0x40"', param4: '"30s"'} }
  // },
  // {
  //   id: 'SEN0377',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('sen0377'),
  //   getComponent: SEN0377,
  //   getInitialData: () => { return { to: 'sen0377', param1: '""', param2: '22', param3: '"0x75"', param4: '"30s"'} }
  // },
  // {
  //   id: 'MPU6050',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mpu6050'),
  //   getComponent: MPU6050,
  //   getInitialData: () => { return { to: 'mpu6050', param1: '""', param2: '22', param3: '"0x68"', param4: '"30s"'} }
  // },
  // {
  //   id: 'I2cSensorMatrix',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('i2cSensorMatrix'),
  //   getComponent: I2cSensorMatrix,
  //   getInitialData: () => { return { to: 'i2cSensorMatrix', param1: '""', param2: '22', param3: '"30s"', param4: '"0x23"', param5: '"0x40"', param6: '"0x75"', param7: '"0x68"'} }
  // },
  // {
  //   id: 'SEN55',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('sen55'),
  //   getComponent: SEN55,
  //   getInitialData: () => { return { to: 'sen55', param1: '""', param2: '22', param3: '"0x69"', param4: '"30s"'} }
  // },
  // {
  //   id: 'MHZ19',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mhz19'),
  //   getComponent: MHZ19,
  //   getInitialData: () => { return { to: 'mhz19', param1: '""', param2: '', param3: '"30s"'} }
  // }
]

export default deviceMasks.map((e) => {
  return {
      ...e,
      capabilities: ["esphome"]
  };
});