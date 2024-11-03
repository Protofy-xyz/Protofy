import classNames from "classnames";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import useChat, { useSettings } from "../store";
import { createMessage } from "protolib/components/chatbot/utils/createMessage";
import { Button } from '@my/ui';
import { Tinted } from "protolib/components/Tinted";

export default function ChatSubmit() {
    const [query, setQuery] = useState("");
    const formRef = useRef<null | HTMLFormElement>(null);
    const addChat = useChat((state) => state.addChat);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const selectedModal = useSettings((state) => state.settings.selectedModal);

    function handleOnKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        const target = e.target as HTMLTextAreaElement;
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (formRef.current) {
                formRef.current.requestSubmit();
                target.style.height = "30px";
            }
        }
    }

    function handleOnInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const target = e.target as HTMLTextAreaElement;
        setQuery(target.value);
        target.style.height = "0px";
        target.style.height = `${target.scrollHeight}px`;
    }

    async function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (query) {
            addChat(createMessage("user", query, "text"));
            addChat(createMessage("assistant", "", selectedModal.startsWith("dall-e") ? "image_url" : "text"));
            setQuery("");
            if (textareaRef.current) textareaRef.current.style.height = "30px";
        }
    }

    return (
        <form className="flex items-center shadow-md dark:border-white border-gray-700 border-2 rounded-md" onSubmit={handleOnSubmit} ref={formRef}>
            <div className="flex-grow p-2">
                <textarea
                    name="query"
                    ref={textareaRef}
                    className="h-6 px-2 w-full outline-none resize-none dark:bg-transparent dark:text-white placeholder:font-bold"
                    placeholder="Type a message..."
                    onKeyDown={handleOnKeyDown}
                    onChange={handleOnInputChange}
                    value={query}
                    autoFocus
                ></textarea>
            </div>
            <Tinted>
                <Button
                mr="$1.5"
                    disabled={query}
                    w={48}
                    type="submit"
                    icon={Send}
                    size="$3"
                >
                </Button>
            </Tinted>
        </form>
    );
}
