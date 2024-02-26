import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { API } from 'protolib';
import { useState, useEffect, useContext } from 'react';
// import {FlowStoreContext } from "./store/FlowsStore"

const getDeviceNames = (devData)=>{
    return devData?.map(e=>'"'+e.name+'"')
}
const getDeviceSubsystemsNames = (devData)=>{
    const deviceSubsystems = {}
    devData.forEach(device => {
        const subsystemsNames = device.subsystem?.filter(sub => sub.actions && sub.actions.length > 0).map(sub => '"'+sub.name+'"')
        deviceSubsystems['"'+device.name+'"'] = subsystemsNames
    });
    // console.log("🤖 ~ deviceSubsystems ~ deviceSubsystems:", deviceSubsystems)
    return deviceSubsystems
}

const getSubsystemsActions = (devData)=>{
    const deviceSubsystemsActions = {};

    devData.forEach(device => {
        const deviceName = '"'+device.name+'"';
        const actions = {};

        device.subsystem?.forEach(subsystem => {
            subsystem.actions?.forEach(action => {
                actions['"'+subsystem.name+'"'] = actions['"'+subsystem.name+'"'] || [];
                actions['"'+subsystem.name+'"'].push('"' + action.name + '"');
            });
        });

        deviceSubsystemsActions[deviceName] = actions;
    });
    // console.log("🤖 ~ getSubsystemsActions ~ deviceSubsystemsActions:", deviceSubsystemsActions)
    return deviceSubsystemsActions

}


const DevicePub = ({ node = {}, nodeData = {}, children }: any) => {
    console.log("nodeParam ", nodeData)
    console.log("nodeParam ", nodeData['param1'])
    const [loadedDevicesData, setLoadedDevicesData] = useState(null)
    const [devicesNames, setDevicesNames] = useState([]);
    const [deviceSubsystemsNames, setDeviceSubsystemsNames] = useState([])
    
    var deviceData = []

    useEffect(() => {
        if (loadedDevicesData) {
            return;
        }
        API.get("/adminapi/v1/devices").then((val) => {
            setLoadedDevicesData(val.data.items);
            // console.log("APIIII -> ", val.data.items)
            setDevicesNames(val.data.items.map((e) => {
                return '"'+e.name+'"';
            }))
            val.data.items?.map(e=>deviceData.push(e))
            // console.log("🤖 ~ API.get ~ deviceData:", deviceData)
            // console.log("deviceNames: ",getDeviceNames(deviceData))
            // console.log("devices subsystems with actions: ",getDeviceSubsystemsNames(deviceData))
        })
    }, [loadedDevicesData])
    // if(loadedDevicesData){
    //     console.log("🤖 loadedDevicesData",loadedDevicesData)
    //         console.log("🤖 param2", getDeviceSubsystemsNames(loadedDevicesData))
    //         console.log("🤖 param3", getSubsystemsActions(loadedDevicesData))
    // }
    const devs = {
        test1: { cohete: ["Turn ON", "Turn OFF", "Toggle"] } ,
        test2: [] 
    }

    const nodeParams: Field[] = [
        {
            label: 'Device name', field: 'param1', type: 'selectWithDefault', static: true, selectedIndex:loadedDevicesData ? devicesNames.indexOf(nodeData['param1']) : 0,
            data: loadedDevicesData ? devicesNames : ['"none"'],
        },
        {
            label: 'Component', field: 'param2', type: 'selectWithDefault', static: true, selectedIndex: loadedDevicesData && nodeData['param1'] &&  getDeviceSubsystemsNames(loadedDevicesData)[nodeData['param1']] ? getDeviceSubsystemsNames(loadedDevicesData)[nodeData['param1']].indexOf(nodeData['param2']) : 0,
            data: loadedDevicesData && nodeData['param1'] ? getDeviceSubsystemsNames(loadedDevicesData)[nodeData['param1']]??[] : ['"none"'],
        },
        {
            label: 'Action', field: 'param3', type: 'selectWithDefault', static: true, selectedIndex: loadedDevicesData && getSubsystemsActions(loadedDevicesData)[nodeData['param1']] ? getSubsystemsActions(loadedDevicesData)[nodeData['param1']][nodeData['param2']]?.indexOf(nodeData['param3']) ??[] : 0,
            data: loadedDevicesData && getSubsystemsActions(loadedDevicesData)[nodeData['param1']] ? getSubsystemsActions(loadedDevicesData)[nodeData['param1']][nodeData['param2']] ??[] : ['"none"'],
        }
    ] as Field[]

    return (
        <Node node={node} isPreview={!node.id} title='devicePub' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}
export default DevicePub