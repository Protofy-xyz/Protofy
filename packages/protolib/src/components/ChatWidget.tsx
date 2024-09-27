import { useState } from "react";
import {Sparkles, X } from '@tamagui/lucide-icons';
import { YStack, Button, Dialog, DialogTrigger, DialogContent, XStack } from 'tamagui';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <YStack>
      <Button
        position="fixed"
        bottom={20}
        right={20}
        size="$5"
        circular
        icon={<Sparkles size={"$2"} />}
        onPress={toggleChat}
        zIndex={1000}
        elevation="$5"
      >
      </Button>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Open Chat</Button>
          </DialogTrigger>
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
            <XStack justifyContent="flex-end">
              <Button size="$2" onPress={toggleChat}>Close</Button>
            </XStack>
            
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
  );
}

export default ChatWidget