/*
    this file is separated from ./bifrost.ts to allow
    import from client and serverside
*/
export const heartbeatTimeout = 30_000 // 30 seconds
export const defActionEndpoint = (agentName: string, subsystemName: string, actionName: string) => `agents/${agentName}/subsystem/${subsystemName}/action/${actionName}`
export const defMonitorEndpoint = (agentName: string, subsystemName: string, monitorName: string) => `agents/${agentName}/subsystem/${subsystemName}/monitor/${monitorName}`