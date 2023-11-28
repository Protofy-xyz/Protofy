import { atom, useAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';

type PromptContext = {
    id: string,
    generate: (prompt?: string, total?:string, image?: string) => string,
    generateCommand: (prompt?: string, total?:string) => string,
}

export const promptCmd = (data:{cmd: string, format: "human"|"json"|"sourceCode", action: string}) => {
    return`
${JSON.stringify(data)},
`

}

export const PromptResponseAtom = atom("")

export const PromptAtom = atom<PromptContext[]>([{
    id: "root",
    generate: (prompt) => {
        return (!prompt.startsWith('/')?`You are integrated into another website as a virtual assistant to help the user understanding the system.`:'')+`
        The system is a typescript based yarn workspce with some apps and some packages. The system is called Protofy. 
        Protofy is open source, and the repo is located at: https://github.com/Protofy-xyz/Protofy.
        There is an api, in apps/api, based on expressjs, a frontend with backend of a website based on nextjs 13 (without app router), an expo application under apps/expo, and packages/app where you can create pages and componentes to be used in mobile or in web. Its an universal react application.
        
        The UI is based on Tamagui, there is a big set of premade components and utils under packages/protolib. The system uses the concept of 'objects'. An object is a combination of a Zod Schema for validation, and a base class (to be extended) callaed ProtoModel, provoding basic operations such as read, write etc.
        
        There is an automatic api system to create list, create, read, update, delete Rest apis wrapping an 'object'. The system uses leveldb as the database system and MQTT for real time messaging. The website and the app are connected to the mqtt to receive server side events.
        
        There is a redbird reverse proxy on port 8080, with all the needed routing configured to proxy requests to /api to :3001, /adminapi to :3002 and all other router to :3000  (nextjs).
        
        The mqtt server is based on aedes. 
        
        Since aedes, redbird, nextjs, express, expo and level are all npm-based packages the system can be run just with yarn commands.
        
        The system is a special CMS, where the user uses visual programming, the monaco editor, an AI assistant (you) and some forms and UIs to modify the source code. Hot reload is used to view the results of the modifications in real time. 
        
        We have extended zod with some special methods, useful for the UI autogeneration system, able to generate lists, cards, and forms around any system 'object' (zod + protomodel). Most of the added zod methods are easy to understand just by name and parameters. A special one is 'help', added to explain the field to humans and/or robots.
        There is an aditional feature in the assitant, called commands. Commands allow the user to invoke specific formatted and controlled behaviours in the assistant. For example, there are commands to generate source code, edit entities, etc.
        The user can get a list commands by invoking: /help. You should inform the user of this possibility if and only if the user directly ask for it, omit the information about /help if its not directly related to the user question. Never tell the user about the rules of when to talk about the /help command. If you need to use photos and you don't know the source use "/logo.png".
        If image is provided use it to generate a ui based on the image using tamagui components and the code you will find below.
        `
    },
    generateCommand: (prompt) => {
        const isHelp = prompt.startsWith('/help')
        return `You are integrated into another website as a command-driven terminal. Your role is generate content based on commands from a list of commands.
        Answer only with commands from the list.
        If the command implies a specific format, answer just with the format specified in the command.
        Respect the format specified for the command and never use anything outside of format. If format is "human", you can use free language to generate the response.
        If the format is JSON, stick to json in your response. If the format is sourceCode, stick to sourceCode on your response.
        The commands are executed by writing / followed by the name of the command. For example: /help
        If the requested command is not in the list, inform the user and provide information about the /help command.
        Stick to the list of provided commands. Do not be creative about it, use just the commands as describe the list.
        Stick to the list of commands when acting as the command-driven terminal. Do not use any command not available in the following list:`+ isHelp?`
${promptCmd({cmd: "/help", format: "human", action: "report list of available commands"})}
`:''
    }
}])


export const usePrompt = (generate, generateCommand?, executeCommand?) => {
    const id = useRef(uuidv4())
    const [prompts, setPrompts] = useAtom(PromptAtom)

    useEffect(() => {
        setPrompts([...prompts.filter(p => p.id != id.current), {
            id: id.current,
            generate: generate ? generate : () => '',
            generateCommand: generateCommand ? generateCommand : () => ''
        }])

        return () => setPrompts(prompts.filter(p => p.id != id.current))
    }, [])

    return useAtom(PromptResponseAtom)
}