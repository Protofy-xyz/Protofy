import { useState } from "react"
import { Sparkles, X, Maximize, Minimize } from '@tamagui/lucide-icons'
import { YStack, Button, XStack } from 'tamagui'

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleChat = () => {
    console.log('toggleChat: clicked', isOpen)
    setIsOpen(!isOpen)
    setIsExpanded(false)
  }

  const toggleExpand = () => {
    console.log('toggleExpand: clicked', isExpanded)
    setIsExpanded(!isExpanded)
  }

  return (
    <YStack>
      <Button
        position="fixed"
        bottom={50}
        right={50}
        size="$5"
        circular
        icon={isOpen ?
          <XStack>
            <X size={"30px"} fillOpacity={0} color='white'></X>
          </XStack>
          : <Sparkles size={"30px"} fillOpacity={0} color='white'></Sparkles>}
        onPress={toggleChat}
        zIndex={10002}
        elevation="$5"
        backgroundColor="$color7"
        hoverStyle={{ backgroundColor: "$color7" }}
      />

      {isOpen && (
        <Button
          position="fixed"
          bottom={50}
          right={110}
          size="$4"
          circular
          icon={isExpanded ? <Minimize fillOpacity={0} color='white' size={"$2"} /> : <Maximize fillOpacity={0} color='white' size={"$2"} />}
          onPress={toggleExpand}
          zIndex={10002}
          elevation="$5"
          backgroundColor="$color7"
          hoverStyle={{ backgroundColor: "$color7" }}
        />
      )}

      {isOpen && (
        <YStack
          width={isExpanded ? "100vw" : 500}
          height={isExpanded ? "95vh" : 800}
          position="fixed"
          bottom={isExpanded ? 0 : 130}
          right={isExpanded ? 0 : 50}
          backgroundColor="$background"
          borderRadius={isExpanded ? 0 : "$4"}
          elevation="$6"
          zIndex={10000}
          overflow="hidden"
        >
          <iframe
            src="/chatbot/"
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="Chat Widget"
          />
        </YStack>
      )}
    </YStack>
  )
}

export default ChatWidget