import {Protofy} from 'protolib/base'

Protofy("type", "IOTRouter")

export default (app, context) => {

    const { devicePub, deviceSub } = context

    ///YOUR LOGIC HERE:

    //IoT device flow example:
    // deviceSub('testdevice', 'binary_sensor', 'testbutton', (message) => {
    //     message == 'ON' ?
    //         devicePub('testdevice', 'switch', 'testrelay', 'OFF')
    //         : devicePub('testdevice', 'switch', 'testrelay', 'ON')
    // })

}