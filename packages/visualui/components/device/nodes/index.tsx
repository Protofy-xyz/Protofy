import OutputPin from "./OutputPin";
import Device from "./Device";
import BinarySensor from "./BinarySensor";
import NeopixelsBus from "./NeopixelsBus";
import Relay from "./Relay";
import ADCSensor from "./ADCSensor";
import PulseCounter from "./PulseCounter";
import LEDCOutput from "./LEDCOutput";
import PIRSensor from "./PIRSensor"
import HX711 from "./HX711"
import CapacitiveSoilMoistureSensor from "./CapacitiveSoilMoistureSensor";
import NFCReader from "./NFCReader";
import UltrasonicDistanceSensor from "./UltrasonicDistanceSensor";
import ISOutput from "./ISOutput";
import Dfplayer from "./Dfplayer";
import XiaomiMiFlora from "./XiaomiMiFlora";
import ClimateIR from "./ClimateIR";
import Servo from "./Servo";
import Mpr121 from "./Mpr121";
import TempHumidity from "./TempHumidity";

export default [
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
    getInitialData: () => { return { to: 'neopixelsBus', param1: '', param2: '', param3: '"GRB"', param4: '"WS2811"', param5: '"ALWAYS_ON"', param6: '"1s"', param7: '0', param8: false, param9: false, param10: false, param11: false, param12: false, param13: false, param14: false, param15: false, param16: false, param17: false, param18: false } }
  },
  // {
  //   id: 'Output',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('output'), //TODO: Change output function name
  //   getComponent: OutputPin,
  //   getInitialData: () => { return { to: 'output', param1: '""' } }
  // },
  {
    id: 'Relay',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('relay'), //TODO: Change output function name
    getComponent: Relay,
    getInitialData: () => { return { to: 'relay', param1: '""' } }
  },
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
    id: 'ADCSensor',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('adcSensor'),
    getComponent: ADCSensor,
    getInitialData: () => { return { to: 'adcSensor', param1: '""', param2: '"30s"', param3: '"auto"' } }
  },
  {
    id: 'PulseCounter',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('pulseCounter'),
    getComponent: PulseCounter,
    getInitialData: () => { return { to: 'pulseCounter', param1: '""' } }
  },
  {
    id: 'LEDCOutput',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ledcOutput'),
    getComponent: LEDCOutput,
    getInitialData: () => { return { to: 'ledcOutput', param1: '""', param2: '"1000Hz"' } }
  },
  {
    id: 'PIRSensor',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('pirSensor'),
    getComponent: PIRSensor,
    getInitialData: () => { return { to: 'pirSensor', param1: '""' } }
  },
  {
    id: 'HX711',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('hx711'),
    getComponent: HX711,
    getInitialData: () => { return { to: 'hx711', param1: '""', param2: '', param3: '"128"', param4: '"60s"' } }
  },
  {
    id: 'Dfplayer',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('dfplayer'),
    getComponent: Dfplayer,
    getInitialData: () => { return { to: 'dfplayer', param1: '""', param2: '', param3: '' } }
  },
  {
    id: 'UltrasonicDistanceSensor',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ultrasonicDistanceSensor'),
    getComponent: UltrasonicDistanceSensor,
    getInitialData: () => { return { to: 'ultrasonicDistanceSensor', param1: '""', param2: '', param3: '"60s"', param4: '"2.0m"' } }
  },
  {
    id: 'CapacitiveSoilMoistureSensor',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('capacitiveSoilMoistureSensor'),
    getComponent: CapacitiveSoilMoistureSensor,
    getInitialData: () => { return { to: 'capacitiveSoilMoistureSensor', param1: '""', param2: '"30s"' } }
  },
  {
    id: 'NFCReader',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('nfcReader'),
    getComponent: NFCReader,
    getInitialData: () => { return { to: 'nfcReader', param1: '""', param2: '"22"' } }
  },
  {
    id: 'ISOutput',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('isOutput'),
    getComponent: ISOutput,
    getInitialData: () => { return { to: 'isOutput', param1: '""' } }
  },
  {
    id: 'XiaomiMiFlora',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('xiaomiMiFlora'),
    getComponent: XiaomiMiFlora,
    getInitialData: () => { return { to: 'xiaomiMiFlora', param1: '""', param2: '""' } }
  },
  {
    id: 'ClimateIR',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('climateIR'),
    getComponent: ClimateIR,
    getInitialData: () => { return { to: 'climateIR', param1: '""', param2: '""', param3: '"auto"', param4: '"auto"', param5: '"30"', param6: '"16"' } }
  },
  {
    id: 'Servo',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('servo'),
    getComponent: Servo,
    getInitialData: () => { return { to: 'servo', param1: '""' } }
  },
  {
    id: 'Mpr121',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mpr121'),
    getComponent: Mpr121,
    getInitialData: () => { return { to: 'mpr121', param1: '""', param2: '"22"', param3: false, param4: false, param5: false, param6: false, param7: false, param8: false, param9: false, param10: false, param11: false, param12: false, param13: false, param14: false } }
  },
  {
    id: 'TempHumidity',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('tempHumidity'),
    getComponent: TempHumidity,
    getInitialData: () => { return { to: 'tempHumidity', param1: '""', param2: '"DHT11"', param3: '"60s"' } }
  }
]