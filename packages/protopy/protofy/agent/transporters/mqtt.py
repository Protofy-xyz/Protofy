from ..bifrost import gen_action_endpoint

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
