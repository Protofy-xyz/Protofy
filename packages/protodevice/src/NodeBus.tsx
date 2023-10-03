import React from "react";
import { useAppStore } from "../../../../context/appStore";
import { useDeviceStore } from "../../store/DeviceStore";

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME

export default ({ componentName ,type }) => {
    const currentDevice = useDeviceStore(state => state.electronicDevice)
    const addChannel = useAppStore(state => state.addChannel);
    const busChannels = useAppStore(state => state.busChannels);
    const [subscribed, setSubscribed] = React.useState(false)
    React.useEffect(() => {
        console.log("NODEBUS: subscribe attempt: ", subscribed,currentDevice, type, componentName);
        if(!currentDevice || !type || !componentName) {
            return
        }
        const topic = generateTopic(currentDevice, type, componentName)
        if(topic){
            console.log("Subs NODEBUS topic: ", topic)
            //if(busChannels.indexOf(payload) == -1)
                addChannel(topic);
           // setSubscribed(true)
        }
    }, [componentName,type,currentDevice])
    return <></>
}

export const cleanName = (name)=> name? name.replace(/['"]+/g, ''):''

export const generateTopic = (currentDevice,type,componentName) => currentDevice && type && componentName ? `${projectName}/${currentDevice}/${type}/${componentName}/state` : null;