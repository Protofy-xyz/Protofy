import Avatar from "protolib/components/chatbot/components/Avatar/Avatar";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import useChat, { ChatMessageType } from "protolib/components/chatbot/store/store";
import { Paragraph, YStack } from '@my/ui';
import { Tinted } from "protolib/components/Tinted";

type Props = {
    chat: ChatMessageType;
    chatIndex: number;
};

export default function UserMessage({ chat, chatIndex }: Props) {

    return (
        <Tinted>
            <YStack py="4px" px="2px" >
                <YStack style={{  paddingLeft: "15%", display: 'flex', justifyContent: 'flex-end' }} >
                    <YStack bg="$color7" btrr={"$2"} btlr={"$2"} bblr={"$2"} py="$2" px="$4" >
                        {/* <YStack className="mr-4  rounded-md flex items-center flex-shrink-0">
              <Avatar className=" h-11 w-11" />
              </YStack> */}
                        <Paragraph>{chat.content}</Paragraph>
                    </YStack>
                </YStack>
            </YStack>
        </Tinted>
    );
}
