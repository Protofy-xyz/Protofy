import classNames from "classnames";
import { ChatMessageType } from "protolib/components/chatbot/store/store";
import { motion } from "framer-motion";
import TextMessage from "./bot-text-message";
import ImageMessage from "protolib/components/chatbot/components/Chat/ImageMessage";
import { YStack } from '@my/ui';

const variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
};

type Props = {
    index: number;
    chat: ChatMessageType;
};

export default function BotMessage({ index, chat }: Props) {
    return (
        <div
            className={classNames("py-4 px-2 md:px-0")}
        >
            <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
            >
                {chat.type && chat.type === "image_url" ? (
                    <ImageMessage index={index} chat={chat} />
                ) : (
                    <YStack py="4px" px="2px" >
                        <YStack style={{ paddingRight: "0", maxWidth: "90%", display: 'flex', justifyContent: 'flex-start' }} >
                            <YStack bg="$color6" btrr={"$2"} btlr={"$2"} bbrr={"$2"} py="$2" px="$4" >
                                {/* <YStack className="mr-4  rounded-md flex items-center flex-shrink-0">
              <Avatar className=" h-11 w-11" />
              </YStack> */}
                                <TextMessage index={index} chat={chat} />
                            </YStack>
                        </YStack>
                    </YStack>
                )}
            </motion.div>
        </div>
    );
}
