import paho.mqtt.client as mqtt
import time
from .bifrost import gen_action_endpoint
from .ProtoAgentsInterface import ProtoAgentInterface
from .bifrost import register, pub_monitor, gen_action_endpoint


class ProtoMqttAgent(ProtoAgentInterface): 
    def __init__(self, agent_name): 
        self.name = agent_name
        self.client = mqtt.Client() 
        self.subsystems = []
        self.type = "mqtt"
        self.subsystems_handlers = {}

    def configure(self, subsystems) -> "ProtoMqttAgent": 
        self.subsystems = subsystems
        return self
         
    def connect(self, mqtt_host, mqtt_port): 
        self.client.connect(mqtt_host, mqtt_port) 
        self.client.loop_start()
        time.sleep(2)
        result = register(self.client.publish, self.name, self.subsystems)
        result.wait_for_publish()

        # consumer defined callback
        self.__consumer_callbacks_checker("on_connect")
        
    def pub_monitor(self, subsystem_name,  monitor_name, value): 
        result = pub_monitor(self.client.publish, self.name, subsystem_name, monitor_name, value) 
        result.wait_for_publish()

        # consumer defined callback
        self.__consumer_callbacks_checker("on_monitor_pub", value)

    def handle(self, subsystem_name, action_name, handler): 
        subsystem = next((s for s in self.subsystems if s["name"] == subsystem_name), None)
        if subsystem is None:
            raise ValueError(f"Subsystem '{subsystem_name}' not found.")
        
        action = next((a for a in subsystem.get("actions", []) if a["name"] == action_name), None)
        if action is None:
            raise ValueError(f"Action '{action_name}' not found in subsystem '{subsystem_name}'.")

        if subsystem_name not in self.subsystems_handlers:
            self.subsystems_handlers[subsystem_name] = {}

        self.subsystems_handlers[subsystem_name][action_name] = handler
        
        # register actions subscribers
        self.client.subscribe(gen_action_endpoint(self.name, subsystem_name, action_name))
        # register actions handlers
        self.__on_message()

        print(f"Handler assigned for action '{action_name}' in subsystem '{subsystem_name}'")


    def __on_message(self):
        self.client.on_message = on_message_factory(self.name, self.subsystems_handlers)

    def __consumer_callbacks_checker(self, name, value=None): 
        if hasattr(self, name) and callable(getattr(self, name)):
            callback = getattr(self, name) 
            if value is not None:
                callback(value)  
            else:
                callback()


def on_message_factory(agent_name, handlers): 
    def on_message(client, userdata, message): 
        payload = str(message.payload.decode("utf-8"))
        
        for subsystem_name, actions in handlers.items():
            for action_name, handler in actions.items():
                expected_topic = gen_action_endpoint(agent_name, subsystem_name, action_name)
                
                if message.topic == expected_topic:
                    handler(payload) 
                    return 

        print(f"No handler found for topic: {message.topic}")
        
        
    return on_message
