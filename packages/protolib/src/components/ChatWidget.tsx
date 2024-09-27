import { useState } from "react"
import { Sparkles, X } from '@tamagui/lucide-icons'
import { YStack, Button, Dialog, DialogContent } from 'tamagui'

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <YStack>
      <Button
        position="fixed"
        bottom={50}
        right={50}
        size="$4"
        circular
        icon={isOpen ? <X size={"$2"} /> : <Sparkles size={"$2"} />}
        onPress={toggleChat}
        zIndex={1000}
        elevation="$5"
      />
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent
            width="500px"
            height="600px"
            position="fixed"
            bottom={100}
            right={20}
            backgroundColor="$background"
            borderRadius="$4"
            elevation="$6"
          >
            <iframe
              src="/chatbot/"
              width="100%"
              height="100%"
              style={{ border: "none", borderRadius: "8px" }}
              title="Chat Widget"
            />
          </DialogContent>
        </Dialog>
      )}
    </YStack>
  )
}

export default ChatWidget
