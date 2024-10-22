// Bifrost is the protocol for agents connection and communication.

// Bifrost actions:
//  - register: a new agent (agents/<agent_name>/register)

// Bifrost defaults:
//  - actions endpoint: agents/<agent_name>/subsystem/<subsystem_name>/action/<action_name>
//  - monitors endpoint: agents/<agent_name>/subsystem/<subsystem_name>/monitor/<monitor_name>

// actions
export function register(publisher, name, subsystems) {
  return publisher(`agents/${name}/register`, JSON.stringify({ subsystems: subsystems }));
}

export function pubMonitor(publisher, name, subsystemName, monitorName, value) {
  return publisher(genMonitorEndpoint(name, subsystemName, monitorName), JSON.stringify({ value: value }));
}

// endpoints
export function genActionEndpoint(name, subsystemName, actionName) {
  return `agents/${name}/subsystem/${subsystemName}/action/${actionName}`;
}

export function genMonitorEndpoint(name, subsystemName, monitorName) {
  return `agents/${name}/subsystem/${subsystemName}/monitor/${monitorName}`;
}

