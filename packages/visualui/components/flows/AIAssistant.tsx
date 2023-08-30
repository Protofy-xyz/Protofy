import React, { useState } from 'react';
import 'reactflow/dist/style.css';
import { postData } from './Post'
import { Widget, addResponseMessage, toggleMsgLoader } from 'react-chat-widget';


const AIAssistant = ({ selectedCode, sourceCode, setSourceCode }) => {
    const getDevicesInfo = async () => {
        // Fetch devices info
        const response = await fetch('/api/v1/device/list')
        const devicesInfo = await response.json()
        return devicesInfo
    }

    const getGlobalPreffix = async () => {
        const devices = await getDevicesInfo()
        return `My program includes a function to control IOT devices: 

    devicePub(deviceName: string, moduleType: string, moduleName: string, message: string);
    
    Currently I have available the following devices: devices = '''${devices}'''
    
    The keys are the available devices, by default take the device called "mydevice". 
    The keys inside of each device are the modules connected to the device. Each module has a key named "type" which indicates the type of the module.
    The module of type "switch" accepts the message "ON" and "OFF". 
    
    An example would be: 
    devices = {"mydevice":{"rele":{"mqttMessages":{"options":["ON","OFF"]}, "type":"switch"}}}

    devicePub("mydevice", "switch", "rele", "OFF");

    To create an api endpoint I do:
        app.get("/cloudapi/v1/rele/off", (req, res) => {
            //api code goes here
            res.send(...); //send response
    });

    Given the example and the value of devices=${devices}: 
    `
    }
    // Get devices and inject it to the  
    const ask = async (question) => {
        toggleMsgLoader()
        var preffix = "I have the following javascript program:\n" + sourceCode + "\n" + await getGlobalPreffix()
        if (selectedCode != sourceCode) {
            preffix += "and I have a doubt about this specific part: \n" + selectedCode + "\n the doubt is: "
        }
        console.log(preffix + question)
        const result = await postData('/api/v1/openAI/assistant', { description: preffix + question })
        if (result && result.response) {
            addResponseMessage(result.response)
        }
        toggleMsgLoader()
    }

    const generate = async (newMessage) => {
        toggleMsgLoader()
        const suffix = `Please give me the js code. Only reply with js code. Do not include reasonings or explanations, just the code and nothing else. Be direct, include only code in your response. Please, do not include anything that is not code in your response, not a single word. Give me the code in one single file, not separated in different parts. I already have required the express library, and my app is instantiated. Do not include anything before or after the code, no single sentence or word, just code.`
        const result = await postData('/api/v1/openAI/assistant', { description: await getGlobalPreffix() + newMessage + suffix })
        if (result && result.response) {
            addResponseMessage("Done!")
            setSourceCode(sourceCode + ' ' + result.response)
        }
        toggleMsgLoader()
    }

    const handleNewUserMessage = async (newMessage) => {
        if (newMessage?.startsWith('/generate')) {
            const result = newMessage.replace(/^\/generate/, "generate"); // replace /generate keyword at end of provided message by "generate"
            generate(result)
        }
        else if (newMessage == '/help') { // Show help
            const generateMan = "**/generate [prompt]** generates code specifying the context at prompt field"
            const helpMan = "**/help** obtain help"
            const helpMessage = [generateMan, helpMan].join('\n\n')
            addResponseMessage(helpMessage)
        }
        else {
            ask(newMessage)
        }
    };

    const [chatWindowOpen, setChatWindowOpen] = useState(true);
    const [isFirstTime, setIsFirstTime] = useState();

    const handleToggle = (chatWindowOpen) => {
        setChatWindowOpen(!chatWindowOpen);
        if (isFirstTime === undefined && chatWindowOpen) setIsFirstTime(true)
    };

    React.useEffect(() => {
        if (isFirstTime) {
            addResponseMessage("👋 Welcome to **Protofy AI Assistant**")
            addResponseMessage("Use **/generate [prompt]** to generate code.\n\nUse **/help** to obtain all commands");
        }
    }, [isFirstTime]);

    return <Widget
        handleToggle={handleToggle}
        title='AI Assitant'
        subtitle="Ask questions or generate code"
        // resizable={true}
        // senderPlaceHolder={"Type message... Obtain help by /help"}
        handleNewUserMessage={handleNewUserMessage}
    />
}

export default React.memo(AIAssistant)