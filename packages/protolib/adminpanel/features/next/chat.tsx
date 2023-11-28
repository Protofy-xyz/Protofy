
import { addResponseMessage, Widget, toggleMsgLoader } from 'react-chat-widget'
import { useEffect, useRef, useState } from 'react';
import { Tinted, API, PromptAtom, PromptResponseAtom } from 'protolib';
import { useTimeout, useWindowSize, useClickAnyWhere } from 'usehooks-ts';
import { useAtom } from 'jotai';
import { Button } from '@my/ui';

const Chat = ({ tags = [], zIndex = 1, onScreen = true, mode = "default" }: any) => {
    const [first, setFirst] = useState(true)
    const [lastMessage, setLastMessage] = useAtom(PromptResponseAtom)

    const chatContainer = useRef()
    const scrollToBottom = () => {
        const chatContainer = document.querySelector('.rcw-messages-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };

    useEffect(() => {
        console.log(mode, 'LastMessage: "' + lastMessage + '"')
    }, [lastMessage])

    useClickAnyWhere((e) => {
        if (e.target.classList.contains('rcw-input')) {
            e.target.focus()
        }
    });

    // Función que se llama cuando una imagen se carga
    const onImageLoad = (img) => {
        const parent = img.parentNode.parentNode.parentNode;

        const floatingImage = document.createElement('img');
        floatingImage.src = '/images/youtube-play.svg';


        floatingImage.style.width = `${img.offsetWidth}px`;
        floatingImage.style.height = `${img.offsetHeight}px`;


        floatingImage.style.position = 'absolute';
        // floatingImage.style.opacity = '0.5';
        floatingImage.style.transformOrigin = 'center';
        floatingImage.style.transform = 'scale(0.20)';
        floatingImage.style.cursor = 'Pointer'
        floatingImage.style.pointerEvents = 'none';

        floatingImage.style.left = '15px';
        floatingImage.style.top = '15px';

        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        parent.appendChild(floatingImage);
    };

    const { width, height } = useWindowSize()

    const updateChatContainerPosition = (width, height) => {
        if (chatContainer.current) {

            const position = chatContainer.current.getBoundingClientRect();
            // console.log("height", height, "top", position.top,"width",  width, "rigth", position.right)
            const x = (height - position.top) * -1
            const y = (width - position.right) * -1
            // console.log("x:", x+ 'px', "    y: ", y + 'px')

            if (chatContainer.current.firstChild && position.bottom === position.top && position.bottom) {
                chatContainer.current.firstChild.style.bottom = x + 'px';
                chatContainer.current.firstChild.style.right = y + 'px';
            }
        }
    };

    useEffect(() => {
        // Configuración del MutationObserver
        const mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains('rcw-message') || node.classList.contains('rcw-conversation-container'))) {
                            const images = node.getElementsByClassName("rcw-message-img");
                            for (let img of images) {
                                if (img.complete) {
                                    onImageLoad(img)
                                    scrollToBottom()
                                    for (let i = 1; i < 11; i++) {
                                        setTimeout(() => scrollToBottom(), i * 100);
                                    }
                                } else {
                                    img.addEventListener('load', () => {
                                        scrollToBottom()
                                        for (let i = 1; i < 11; i++) {
                                            setTimeout(() => scrollToBottom(), i * 100);
                                        }
                                        onImageLoad(img)
                                    });
                                }
                            }
                        }
                    });
                }
                if ((mutation.target.classList.contains('is_DialogContent') || mutation.target.closest('.is_DialogContent'))
                    && !mutation.target.closest('.rcw-widget-container')) {
                    console.log("¡Cambio detectado en un hijo de is_DialogContent!");
                    updateChatContainerPosition(window.innerWidth, window.innerHeight);
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
        resources.forEach(resource => addResponseMessage(resource))
        if (!lastMessage) {
            const message = "I'm here to help you. Feel free to ask questions about the system."
            addResponseMessage(message)
            setLastMessage(message)
        }
    }

    function removeCommandFromString(originalString) {
        // This regular expression matches a command at the beginning of the string
        let regex = /^\/\S+/;
        return originalString.replace(regex, "").trim();
    }

    useEffect(() => {
        updateChatContainerPosition(window.innerWidth, window.innerHeight);
    }, [width, height])

    const [fileInputData, setFileInputData] = useState<{ content: string, filename: string }>();
    const [isChatOpen, setIsChatOpen] = useState();
    useEffect(() => {
        var fileInput = document.createElement('input'); // Crear el input de tipo file
        fileInput.type = 'file';
        fileInput.accept = 'image/*'
        fileInput.style.display = 'none'; // Ocultar el input
        // TODO: replace with react element
        const clipImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBhcGVyY2xpcCI+PHBhdGggZD0ibTIxLjQ0IDExLjA1LTkuMTkgOS4xOWE2IDYgMCAwIDEtOC40OS04LjQ5bDguNTctOC41N0E0IDQgMCAxIDEgMTggOC44NGwtOC41OSA4LjU3YTIgMiAwIDAgMS0yLjgzLTIuODNsOC40OS04LjQ4Ii8+PC9zdmc+"
        var icon = document.createElement('img');
        icon.className = "rcw-picker-icon"
        icon.src = clipImage
        icon.addEventListener('click', function () {
            fileInput.click()
        });
        fileInput.addEventListener('change', (event: any) => {
            var file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                let content;
                const filename = file.name
                reader.onload = (e) => {
                    content = e.target.result;
                    setFileInputData({ content, filename })
                };
                reader.readAsDataURL(file);
                icon.title = filename;//
            }
        });
        var oldElement = chatContainer.current.getElementsByClassName('rcw-picker-btn')[0];
        if (oldElement) {
            oldElement.parentNode.replaceChild(icon, oldElement); // Replace old element with new element
        }
    }, [chatContainer?.current?.isOpen, isChatOpen])

    for (var i = 0; i < 20; i++) {
        useTimeout(() => {
            updateChatContainerPosition(window.innerWidth, window.innerHeight);
        }, i * 50)
    }

    const [promptChain] = useAtom(PromptAtom)

    return (
        <Tinted>
            <div ref={chatContainer} onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.preventDefault()} style={{ transform: 'none', zIndex: zIndex, bottom: 0, right: 0, position: "fixed" }}>
                <div style={{ position: 'absolute' }}>
                    <Widget
                        title="Asistant"
                        subtitle="Get help, ideas and documentation"
                        handleNewUserMessage={async (message) => {
                            //generate prompts
                            console.log('Prompt chain: ', promptChain)
                            const isCommand = message.startsWith('/')
                            const isHelp = message.startsWith('/help')
                            const isVision = !!(isCommand && fileInputData?.content); // If image is selected and isCommand enable gpt-vision
                            let prompt: any = promptChain.reduce((total, current) => total + (isHelp ? current.generateCommand(message, total) : current.generate(message, total, fileInputData?.content)), '') + (
                                isHelp ? `
                                    ]

                                    End of command list.

                                    The user wants to know the list of available commands. Include all the commands in the reply, and include a small description of the command. use the field action for the description of what the command does, but summarize it. 
                                    `: isCommand ? `

                                    ------
                                    request: ${removeCommandFromString(message)}`
                                    : `
                                    reply directly to the user, acting as the assistant.

                                    The question of the user for the assistant is:
                                    "${message}".`
                            )
                            if (isVision) { // Has image
                                prompt = [{
                                    type: "image_url",
                                    image_url: fileInputData.content,
                                }, prompt]
                            }
                            console.log('prompt: ', prompt)
                            toggleMsgLoader();
                            const result = await API.post('/adminapi/v1/assistants', {
                                messages: [{ role: 'user', content: prompt }],
                                best_of: 4,
                                temperature: isHelp ? 0 : 1,
                                gptModel: isVision ? "gpt-4-vision-preview" : undefined // undefined sets default gpt model
                            })
                            toggleMsgLoader();
                            console.log('result: ', result)
                            if (result.isError) {
                                addResponseMessage("Error generating response: ", result.error)
                            } else if (result.data.error) {
                                var errorMsg = result.data.error.message
                                if (result.data.error.code == "invalid_api_key") {
                                    errorMsg = errorMsg + '\nPlease add your key on "apps/admin-api/.env": \nOPENAI_API_KEY={YOUR KEY HERE}'
                                }
                                addResponseMessage(errorMsg)
                            } else {
                                addResponseMessage(result.data.choices[0].message.content)
                                setLastMessage(result.data.choices[0].message.content)
                                setFileInputData(undefined); // clear selected image
                            }

                        }}
                        handleToggle={async (state) => {
                            if (state) {
                                if (first) {
                                    setFirst(false)
                                    toggleMsgLoader()
                                    await getInitialMessages()
                                    // setTimeout(() => scrollToBottom(), 500)
                                    toggleMsgLoader()
                                }
                            }
                            setIsChatOpen(state)
                        }}
                        handleLauncher
                    />
                </div>
            </div>
        </Tinted>
    )
}

export default Chat;

//<Connector brokerUrl={brokerUrl}>