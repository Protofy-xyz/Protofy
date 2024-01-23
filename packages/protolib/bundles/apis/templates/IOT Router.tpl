import {Protofy} from 'protolib/base'
import { Application } from 'express';

Protofy("type", "IOTRouter")

export default (app:Application, context) => {

    const { devicePub, deviceSub } = context

    ///YOUR LOGIC HERE:

    //IoT device flow example:
    // deviceSub('testdevice', 'binary_sensor', 'testbutton', (message) => {
    //     message == 'ON' ?
    //         devicePub('testdevice', 'switch', 'testrelay', 'OFF')
    //         : devicePub('testdevice', 'switch', 'testrelay', 'ON')
    // })

}