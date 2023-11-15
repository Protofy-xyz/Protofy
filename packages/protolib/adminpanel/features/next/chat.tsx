
import { addResponseMessage, Widget, toggleMsgLoader } from 'react-chat-widget'
import { useEffect, useState } from 'react';
import { Tinted, API } from 'protolib';
import { useEffectOnce } from 'usehooks-ts';

const Chat = ({ tags = [] }: any) => {
    const [first, setFirst] = useState(true)

    const scrollToBottom = () => {
        const chatContainer = document.querySelector('.rcw-messages-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };

    useEffect(() => {
        // Función que se llama cuando una imagen se carga
        const onImageLoad = () => {
          scrollToBottom()
          for(let i=1;i<11;i++) {
            setTimeout(() => scrollToBottom(), i*100);
          }
        };
    
        // Configuración del MutationObserver
        const mutationObserver = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('rcw-message')) {
                    console.log('image detecteeeeeeeeeeeeeeeeeed', node)
                    const images = node.getElementsByClassName("rcw-message-img");
                    for (let img of images) {
                        img.addEventListener('load', onImageLoad);
                    }
                }
              });
            }
          });
        });
    
        const chatContainer = document.querySelector('body');
        if (chatContainer) {
          mutationObserver.observe(chatContainer, { childList: true, subtree: true });
        }
    
        return () => {
          mutationObserver.disconnect();
        };
      }, []);

    const getResources = async () => {
        console.log('requesting: ', '/adminapi/v1/resources?search=tags:' + tags.join(','));
        const resources = await API.get('/adminapi/v1/resources?search=tags:' + tags.join(','));

        if (resources.isLoaded && resources.data.items && resources.data.items.length) {
            const promises = resources.data.items.map(async (resource) => {
                if (resource.type == 'text') {
                    const content = await API.get(resource.url, undefined, true);
                    return content.data
                } else if (resource.type == 'youtube') {
                    const parts = resource.url.split('=')
                    if (parts.length < 2) return null
                    const yId = parts[1]

                    return '[![video](https://img.youtube.com/vi/' + yId + '/0.jpg)](' + resource.url + ' "Video Title")' + "\n" + resource.description
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
                    if (first) {
                        setFirst(false)
                        toggleMsgLoader()
                        await getInitialMessages()
                        // setTimeout(() => scrollToBottom(), 500)
                        toggleMsgLoader()
                    }
                }}
            />
        </Tinted>
    )
}

export default Chat;

//<Connector brokerUrl={brokerUrl}>