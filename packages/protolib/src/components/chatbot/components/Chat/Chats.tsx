import { useEffect, useRef } from "react";
import useChat from "../../store/store";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";

export default function Chats() {
  const chats = useChat((state) => state.chats);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat, index) =>
        chat.role === "assistant" ? (
          <BotMessage index={index} key={chat.id} chat={chat} />
        ) : (
          <UserMessage chat={chat} chatIndex={index} key={chat.id} />
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
