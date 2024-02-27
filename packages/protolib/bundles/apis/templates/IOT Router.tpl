import {Protofy} from 'protolib/base'
import { Application } from 'express';
import { getLogger } from "protolib/base"

const logger = getLogger()

Protofy("type", "IOTRouter")

export default (app, {devicePub, deviceSub, mqtt}) => {
    ///PUT YOUR ROUTER LOGIC HERE
    //devicePub function allows to communicate with devices via mqtt
    //deviceSub allows to receive notifications from devices via mqtt
    //app is a normal expressjs object
    //mqtt is a mqttclient connection
    
    // TODO refactor this example (message callback)
    //IoT device flow example:
    // deviceSub('testdevice', 'testbutton', (message) => {
    //     message == 'ON' ?
    //         devicePub('testdevice', 'switch', 'testrelay', 'OFF')
    //         : devicePub('testdevice', 'switch', 'testrelay', 'ON')
    // })
}
