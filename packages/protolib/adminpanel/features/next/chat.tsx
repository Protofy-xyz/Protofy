
import { addResponseMessage, Widget, toggleMsgLoader } from 'react-chat-widget'
import { useEffect, useState } from 'react';
import { Tinted, API } from 'protolib';
import { useEffectOnce } from 'usehooks-ts';

const Chat = ({tags=[]}: any) => {
    const [first, setFirst] = useState(true)

    const getResources = async () => {
        console.log('requesting: ', '/adminapi/v1/resources?search=tags:' + tags.join(','));
        const resources = await API.get('/adminapi/v1/resources?search=tags:' + tags.join(','));
    
        if (resources.isLoaded && resources.data.items && resources.data.items.length) {
            const promises = resources.data.items.map(async (resource) => {
                if (resource.type == 'text') {
                    const content = await API.get(resource.url, undefined, true);
                    console.log('conteeeeeeeeeeeent', content)
                    return content.data
                }
                return null;
            });
    
            const results = await Promise.all(promises);
            return results.filter(result => result !== null);
        }
        return [];
    };

    const getInitialMessages = async () => {
        const resources = await getResources()
        console.log('res: ', resources)
        resources.forEach(resource => addResponseMessage(resource))
    } 

    return (
        <Tinted>
            <Widget
                title="Asistant"
                subtitle="Get help, ideas and documentation"
                handleNewUserMessage={() => { }}
                handleToggle={async (state) => {
                    if(first) {
                        setFirst(false)
                        toggleMsgLoader()
                        await getInitialMessages()
                        toggleMsgLoader()
                    }
                }}
            />
        </Tinted>
    )
}

export default Chat;

//<Connector brokerUrl={brokerUrl}>