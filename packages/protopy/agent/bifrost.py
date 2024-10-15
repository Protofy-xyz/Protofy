# bifrost is the protofy protocol for 
# agents connection and comunication.

# brifrost actions
#  - register: a new agent (agents/<agent_name>/register)

# bifrost defaults
#  - actions endpoint: agents/<agent_name>/subsystem/<subsystem_name>/action/<action_name>
#  - monitors endpoint: agents/<agent_name>/subsystem/<subsystem_name>/monitor/<monitor_name>

import json

# actions
def register(publisher, name, subsytems): 
    return publisher("agents/"+name+"/register", json.dumps({ "subsystems": subsytems }))

def pub_monitor(publisher, name, subsystem_name, monitor_name, value): 
    return publisher(gen_monitor_endpoint(name, subsystem_name, monitor_name), json.dumps({ "value": value }))

# endpoints
def gen_action_endpoint(name, subsystem_name, action_name): 
    return "agents/"+name+"/subsystem/"+subsystem_name+"/action/"+action_name

def gen_monitor_endpoint(name, subsystem_name, monitor_name): 
    return "agents/"+name+"/subsystem/"+subsystem_name+"/monitor/"+monitor_name