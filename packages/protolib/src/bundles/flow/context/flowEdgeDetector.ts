import { getLogger } from 'protobase'

const logger = getLogger()
const memory = {}

export async function flowEdgeDetector(
  value,
  highValue,
  lowValue,
  randomId,
  risingAction,
  fallingAction
) {
    if((value == highValue)||(value == lowValue)){
        if(!memory[randomId]){
            memory[randomId] = value;
            return;
          }
          if(value != memory[randomId]){
            //EDGE Detected
            memory[randomId] = value;
            if(value == highValue){
                if(risingAction) await risingAction(value)
            }else{
                if(fallingAction) await fallingAction(value)
            }
          }
    }
}