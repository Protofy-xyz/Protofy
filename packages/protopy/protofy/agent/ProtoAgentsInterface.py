
from abc import ABC, abstractmethod 
from typing import TypeVar, Type
import json
import os


# T being any class that implements "ProtoAgentInterface"
T = TypeVar('T', bound='ProtoAgentInterface')

class ProtoAgentInterface(ABC): 
    @abstractmethod
    def configure(self: T, subsystems) -> T: 
        pass

    def configure_from_file(self, path): 
        abs_path = os.path.join(os.getcwd(), path)
        
        with open(abs_path, 'r') as file:
            subsystems = json.load(file)
        return self.configure(subsystems)

    @abstractmethod
    def connect(self, mqtt_host, mqtt_port): 
        pass

    @abstractmethod
    def pub_monitor(self, subsystem_name,  monitor_name, value): 
        pass

    @abstractmethod
    def handle(self, subsystem_name, action_name, handler): 
        pass