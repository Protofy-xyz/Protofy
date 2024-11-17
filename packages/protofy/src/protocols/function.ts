import { AgentInterface } from "../Agent";

//function runner
export default (interf: AgentInterface) => {
    //check if the interface is a function
    if(interf.getProtocol().type !== 'function') {
        throw new Error('Error: Invalid protocol type, expected function')
    }

    


}