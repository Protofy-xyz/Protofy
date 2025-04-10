import { useEffect, useRef, useState } from "react";
import useChat, { ChatMessageType, useSettings } from "../store/store";
import { fetchResults } from "../services/chatService";
import { useDebouncedCallback } from "use-debounce";
import { createMessage } from "../utils/createMessage";

type Props = {
  index: number;
  chat: ChatMessageType;
  prompt: string;
};


export default function useBot({ index, chat, prompt }: Props) {
  const resultRef = useRef(chat.content);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState(chat.content);
  const [error, setError] = useState("");
  const [isStreamCompleted, setIsStreamCompleted] = useState(false);
  const query = useChat((state) => state.chats[index - 1].content);
  const [chats, addChat] = useChat((state) => [state.chats, state.addChat]);
  const [sendHistory, selectedModal, systemMessage, useForAllChats] =
    useSettings((state) => [
      state.settings.sendChatHistory,
      state.settings.selectedModal,
      state.settings.systemMessage,
      state.settings.useSystemMessageForAllChats,
    ]);
  const chatsRef = useRef(chats);

  chatsRef.current = chats;

  const scrollToBottom = useDebouncedCallback(() => {
    if (!cursorRef.current) return;
    cursorRef.current.scrollIntoView(true);
  }, 50);

  useEffect(() => {
    function handleOnData(data: string) {
      resultRef.current += data;
      setResult((prev) => prev + data);
      scrollToBottom();
    }

    function handleOnError(error: Error | string) {
      const errorMessage = typeof error === "string" ? error : error.message;
      setError(errorMessage);
      resultRef.current = "Error processing the request: " + errorMessage;
      setResult(resultRef.current);
      setIsStreamCompleted(true);
      addChat(createMessage("assistant", resultRef.current, chat.type), index);
    }

    function handleOnCompletion() {
      if (resultRef.current.trim() !== "") {
        addChat(createMessage("assistant", resultRef.current, chat.type), index);
      }
      // Aseguramos marcar completo para cerrar el loading
      setIsStreamCompleted(true);
    }

    if (chat.content || isStreamCompleted) return;
    let mounted = true;
    const controller = new AbortController();
    let signal = controller.signal;

    setResult("");
    resultRef.current = "";
    setIsStreamCompleted(false);
    setError("");

    (async () => {
      try {
        let prevChats = sendHistory
          ? chatsRef.current
              .slice(0, index)
              .filter((m) => m.type === "text")
              .map((chat) => ({
                role: chat.role,
                content: chat.content,
              }))
          : [
              {
                role: chatsRef.current[index - 1].role,
                content: chatsRef.current[index - 1].content,
              },
            ];
        if (useForAllChats && systemMessage) {
          prevChats = [{ role: "system", content: systemMessage }, ...prevChats];
        }
        await fetchResults(
          prevChats,
          { context: prompt },
          selectedModal,
          signal,
          handleOnData,
          handleOnCompletion
        );
      } catch (error) {
        if (error instanceof Error || typeof error === "string") {
          if (mounted) handleOnError(error);
        }
      }
    })();

    return () => {
      controller.abort();
      mounted = false;
    };
  }, [
    query,
    addChat,
    index,
    scrollToBottom,
    chat.content,
    chat.id,
    chat.type,
    sendHistory,
    selectedModal,
    systemMessage,
    useForAllChats,
  ]);

  return { query, result, error, isStreamCompleted, cursorRef };
}
