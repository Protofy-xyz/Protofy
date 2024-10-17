from .ProtoMqttAgent import ProtoMqttAgent

class ProtoAgent: 
    @staticmethod
    def mqtt(name: str) -> ProtoMqttAgent:
        return ProtoMqttAgent(name)

    # def http(name): 
    #    return ProtoHttpAgent(name)
     

    