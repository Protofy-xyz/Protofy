import classNames from "classnames";
// import Avatar from "protolib/components/chatbot/components/Chat/Avatar/Avatar";
import { Check, Clipboard } from "lucide-react";
import { SyncLoader } from "react-spinners";
import useBot from "../hooks/useBot";
import { ChatMessageType } from "../store";
import Markdown from "react-markdown";
import CodeHighlight from "protolib/components/chatbot/components/CodeHighlight/CodeHighlight";
import { PromptAtom } from '../context/PromptAtom';
import { useAtom } from "jotai";

type Props = {
    index: number;
    chat: ChatMessageType;
};

export default function TextMessage({ index, chat, ...props }: Props) {
    const [promptChain] = useAtom(PromptAtom);
    // const { copy, copied } = useClipboard();

    const prompt: any = promptChain.reduce((total, current) => {
        return total + current.generate();
    }, '') + `
    reply directly to the user, acting as the assistant.
  `;
    const { result, error, isStreamCompleted, cursorRef } = useBot({
        index,
        chat,
        prompt
    });
    return (
        <div {...props}>
            <div className="flex items-start w-full" style={{ overflowX: 'none', flexWrap: 'wrap' }}>
                {/* <div className="mr-4  rounded-md flex items-center flex-shrink-0">
          <Avatar className=" h-11 w-11" src="/images/bot.webp" />
        </div> */}

                {!result && !error ? (
                    <div className=" self-center">
                        <SyncLoader color="gray" size={8} speedMultiplier={0.5} />
                    </div>
                ) : (
                    <div
                        className={classNames(
                            "  animate-preulse overflow-x-hidden whitespace-pre-wrap",
                            { "text-red-500": error, "dark:text-gray-300": !error }
                        )}
                    >
                        <Markdown
                            id="markdown-component"
                            children={result}
                            components={{
                                code(props) {
                                    const { children, className, node, ...rest } = props;
                                    const match = /language-(\w+)/.exec(className || "");
                                    return match ? (
                                        <CodeHighlight language={match[1]}>
                                            {String(children).replace(/\n$/, "")}
                                        </CodeHighlight>
                                    ) : (
                                        <code {...rest} className={className?.concat("language")}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        />

                        {!isStreamCompleted && !chat.content && (
                            <span
                                className="ml-1 blink bg-gray-500 dark:bg-gray-200 h-4 w-1 inline-block"
                                ref={cursorRef}
                            ></span>
                        )}

                        {/* <div className="mt-2 md:mt-5  text-left self-start">
                            {!copied ? (
                                <button
                                    className="edit text-gray-500 dark:text-gray-200 text-xl"
                                    onClick={() => copy(result)}
                                >
                                    <Clipboard />
                                </button>
                            ) : (
                                <span className="dark:text-gray-200 text-gray-500 text-xl">
                                    <Check />
                                </span>
                            )}
                        </div> */}
                    </div>
                )}

            </div>
        </div>
    );
}
