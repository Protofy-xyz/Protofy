import { assign as xAssign } from 'xstate'

// xstate functions handlers
export const assign = (x) => xAssign(x)


export const params = ["assign"]
export const paramsHandlers = [assign]
