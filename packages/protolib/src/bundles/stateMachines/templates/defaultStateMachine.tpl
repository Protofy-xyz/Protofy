import { Protofy } from 'protobase'

export default Protofy("machineDefinition", {
  context: {{{machineContext}}}, 
  state: {{{machineStates}}}, 
  transitions: {{{machineTransitions}}}, 
})

