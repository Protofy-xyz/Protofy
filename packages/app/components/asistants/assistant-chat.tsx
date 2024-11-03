
import { YStack } from '@my/ui';
import { Tinted } from 'protolib';
import { Bot } from '@tamagui/lucide-icons';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Plus, Menu, PanelLeft } from "lucide-react";
import ChatSubmit from "./chat/submit";
import DefaultIdeas from "protolib/components/chatbot/components/DefaultIdea/DefaultIdeas";
import ChatMessages from "./chat/messages";
import useChat, { chatsLength, useAuth } from "protolib/components/chatbot/store/store";

export default function AssistantChat(props: any) {
    const Chatbot = dynamic(() => import('protolib/components/chatbot'), { ssr: false })
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState(false);
    const isChatsVisible = useChat(chatsLength);

    return (
        <YStack position="fixed" bottom={100} right={100} {...props}>
            <Tinted>
                <YStack onClick={() => setIsOpen(!isOpen)} cursor="pointer" w={56} h={56} br={"$11"} bg="$color7" jc="center" ai="center" position="absolute">
                    <Bot color="$color" size="$2" />
                </YStack>
            </Tinted>
            <YStack br="$4" bg="$background" position="absolute" height={500} width={400} bottom={"$2"} right={"$2"} style={{ display: isOpen ? 'block' : 'none' }}>
                <YStack f={1} h="100%" px="$4">
                    <YStack style={{ display: 'flex', flex: 1 }}>
                        <ChatMessages />
                    </YStack>
                    <YStack py="$4">
                        <ChatSubmit />
                    </YStack>
                </YStack>
            </YStack>
        </YStack >
    )
}
