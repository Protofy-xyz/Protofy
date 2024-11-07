import { useState } from "react";
import { Sparkles, X, Maximize, Minimize } from '@tamagui/lucide-icons';
import { Tinted }  from './Tinted'
import { Chat } from './Chat'
import { YStack, Button, XStack, Theme, Spinner, Paragraph} from 'tamagui';

type BubleChatProps = {
  apiUrl: string;
};

export const BubbleChat = ({ apiUrl }: BubleChatProps) => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatLoaded, setIsChatLoaded] = useState(false);

  const toggleChat = () => {
    if (isChatVisible) {
      setIsChatVisible(false);
      setIsExpanded(false);
    } else {
      if(!isChatLoaded) {
        setIsChatLoaded(true);
      }
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
        position="absolute"
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
          position="absolute"
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
          position="absolute"
          bottom={isExpanded ? 0 : 130}
          right={isExpanded ? 0 : 50}
          backgroundColor="$bgContent"
          borderRadius={isExpanded ? 0 : "$4"}
          elevation="$6"
          zIndex={10000}
          overflow="hidden"
          display={isChatVisible ? "flex" : "none"}
        >
          <YStack position="absolute" height="100%" width="100%" alignItems="center" justifyContent="center" f={1} top={0} right={0} zIndex={-2}>
            <Tinted>
              <Spinner color="$color6" size={100} mb="$6" />
            </Tinted>

            <Paragraph size="$5">Loading chat...</Paragraph>
          </YStack>
          {isChatLoaded && <Chat apiUrl={apiUrl}/>}
        </YStack>


    </YStack>
  );
};

export default BubbleChat;
