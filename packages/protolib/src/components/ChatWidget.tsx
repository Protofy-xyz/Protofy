import { useState } from "react";
import { Sparkles, X, Maximize, Minimize } from '@tamagui/lucide-icons';
import { YStack, Button, XStack } from 'tamagui';

export const ChatWidget = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleChat = () => {
    if (isChatVisible) {
      setIsChatVisible(false);
      setIsExpanded(false);
    } else {
      setIsChatVisible(true);
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <YStack>
      <Button
        position="fixed"
        bottom={50}
        right={50}
        size="$5"
        circular
        icon={
          isChatVisible ? (
            <XStack>
              <X size="30px" fillOpacity={0} color="white" />
            </XStack>
          ) : (
            <Sparkles size="30px" fillOpacity={0} color="white" />
          )
        }
        onPress={toggleChat}
        zIndex={10002}
        elevation="$5"
        backgroundColor="$color7"
        hoverStyle={{ backgroundColor: "$color7" }}
      />

      {isChatVisible && (
        <Button
          position="fixed"
          bottom={50}
          right={110}
          size="$4"
          circular
          icon={
            isExpanded ? (
              <Minimize fillOpacity={0} color="white" size="$2" />
            ) : (
              <Maximize fillOpacity={0} color="white" size="$2" />
            )
          }
          onPress={toggleExpand}
          zIndex={10002}
          elevation="$5"
          backgroundColor="$color7"
          hoverStyle={{ backgroundColor: "$color7" }}
        />
      )}

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
        display={isChatVisible ? "flex" : "none"}
      >
        <iframe
          src="/workspace/dev/chatbot/"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Chat Widget"
        />
      </YStack>
    </YStack>
  );
};

export default ChatWidget;
