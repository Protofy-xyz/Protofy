import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { API } from 'protolib';
import { useState, useEffect, useContext } from 'react';
// import {FlowStoreContext } from "./store/FlowsStore"

const getDeviceNames = (devData)=>{
    return devData?.map(e=>e.name)
}
const getDeviceSubsystemsNames = (devData)=>{
        // devData.map((e)=>{

        // })
        // const subsystems = device?.subsystem?.filter((e)=>{
        //     return e.actions.length >0;
        // })
        return {"test1":['cohete'],"test2": []}

        //     console.log("Subsystems: ", subsystems)
        //     const subsystemsNames = subsystems?.map((s)=>{
        //         return s.name;
        //     })
}

const getSubsystemsActions = (devData)=>{
    return {test1: {cohete: ["Turn On", "Turn Off", "Toggle"]},test2:{}}
}


const DevicePub = ({ node = {}, nodeData = {}, children }: any) => {
    console.log("nodeParam ", nodeData)
    console.log("nodeParam ", nodeData['param1'].replaceAll('"\"','').replaceAll('"',''))
    const [loadedDevicesData, setLoadedDevicesData] = useState(null)
    const [devicesNames, setDevicesNames] = useState([]);
    const [deviceSubsystems, setDeviceSubsystems] = useState([]);
    const [subsystemActions, setSubsystemActions] = useState([]);
    // const data = useContext(FlowStoreContext)
    const deviceData = []

    useEffect(() => {
        if (loadedDevicesData) {
            return;
        }
        API.get("/adminapi/v1/devices").then((val) => {
            setLoadedDevicesData(val.data.items);
            console.log("APIIII -> ", val.data.items)
            setDevicesNames(val.data.items.map((e) => {
                return e.name;
            }))
            val.data.items?.map(e=>deviceData.push(e))
            console.log("deviceNames: ",getDeviceNames(deviceData))
            console.log("devices subsystems with actions: ",getDeviceSubsystemsNames(deviceData))
            
        })
    }, [loadedDevicesData])

    const devs = {
        test1: { cohete: ["Turn ON", "Turn OFF", "Toggle"] } ,
        test2: [] 
    }

    // useEffect(()=>{
    //     console.log("pa")
    // }, [data['param1']])


    //const options2 = {test1:[op1,op2]}
    //const options3 = {op1:[pe2,pe3],op2:[pa,pa1]}

    // useEffect(()=>{
    //     console.log("Ha cambiat param1")
    //     const device = loadedDevicesData?.filter((e)=>{return e.name == nodeData['param1']})[0];
    //     console.log("Device: ",device);
    //     const subsystems = device?.subsystem?.filter((e)=>{
    //         return e.actions.length >0;
    //     })
    //     console.log("Subsystems: ", subsystems)
    //     const subsystemsNames = subsystems?.map((s)=>{
    //         return s.name;
    //     })
    //     console.log("Subsystems Names: ", subsystemsNames)
    //     setDeviceSubsystems(subsystemsNames?subsystemsNames:[])

    //     console.log("node: ", nodeData)
    //     console.log("Subsystems: ", subsystems)
    //     const actions = subsystems?.filter((e)=>{return e.name == nodeData['param2']})[0]?.actions;
    //     console.log("Actions: ",actions)
    //     const actionsNames = actions?.map((e) =>{return e.name;});
    //     console.log("Actions names: ",actionsNames)
    //     setSubsystemActions(actionsNames?actionsNames:[])
    // },[nodeData['param1']])

    // useEffect(()=>{

    //    console.log 
    // },[nodeData['param2']])

    const nodeParams: Field[] = [
        {
            label: 'Device name', field: 'param1', type: 'select', static: true,
            data: loadedDevicesData ? devicesNames : ['"none"'],
        },
        {
            label: 'Component', field: 'param2', type: 'select', static: true,
            data: loadedDevicesData? getDeviceSubsystemsNames(deviceData)[nodeData['param1'].replaceAll('"\"','').replaceAll('"','')] : ['"none"'],
        },
        {
            label: 'Action', field: 'param3', type: 'select', static: true,
            data: loadedDevicesData ? getSubsystemsActions(deviceData)[nodeData['param1'].replaceAll('"\"','').replaceAll('"','')][nodeData['param2'].replaceAll('"\"','').replaceAll('"','')]??[] : ['"none"'],
        }
    ] as Field[]

    return (
        <Node node={node} isPreview={!node.id} title='devicePub' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}
export default DevicePub