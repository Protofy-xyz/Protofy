//@card/react
//board is the board object
//state is the state of the board

function Widget({ board, state, ...props }) {
    const messagesEndRef = React.useRef(null)
    const [text, setText] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [chatMessages, setChatMessages] = React.useState([])

    const filteredMessages = chatMessages.filter(cm => cm.message)

    const addMessage = (from, message) => {
        setChatMessages([...chatMessages, {
            from: from,
            message: message
        }])

        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
    }

    const onSendMessage = () => {
        addMessage("user", text)
        execute_action("Send message", { message: text })
        setText("")
        setLoading(true)
    }

    React.useEffect(() => {
        addMessage("chat", state["Message response"])
        setLoading(false)
    }, [state["Message response"]])


    return <YStack h={"calc(100vh - 60px)"} ai="center" f={1} pb="10px">
        <YStack gap="$3" f={1} w="100%" maw="770px" h="100%">
            <YStack f={1} gap="$3" width="100%" overflow="scroll" overflowX="hidden">
                {
                    filteredMessages?.map((cm, i) => {
                        const isUser = cm.from == "user"
                        return <YStack
                            als={isUser ? "flex-end" : "flex-start"}
                            bc={isUser ? "$bgPanel" : "transparent"}
                            p="$2"
                            px="$3"
                            br="$8"
                        >
                            <Text key={i} fontSize="$5">{cm["message"]}</Text>
                        </YStack>
                    })
                }
                <YStack ref={messagesEndRef}>
                    {loading && <YStack ai="flex-start" p="$2">
                        <Spinner size={20} color="$color10" />
                    </YStack>}
                </YStack>
            </YStack>
            <XStack gap="$5" width="100%">
                <XStack f={1} gap="$2">
                    <Input
                        placeholder="Message ChatGPT..."
                        width="200px"
                        f={1}
                        bc="$bgPanel"
                        value={text}
                        br="$20"
                        onChangeText={t => {
                            setText(t)
                        }}
                        onSubmitEditing={e => {
                            onSendMessage()
                        }}
                    />
                </XStack>
            </XStack>
        </YStack>
    </YStack>
}


