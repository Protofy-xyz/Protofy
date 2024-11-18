import { AgentIOInterface } from "../Agent";

//function runner
export default (interf: AgentIOInterface) => {
    //check if the interface is a function
    if(interf.getProtocol().type !== 'function') {
        throw new Error('Error: Invalid protocol type, expected function')
    }



}