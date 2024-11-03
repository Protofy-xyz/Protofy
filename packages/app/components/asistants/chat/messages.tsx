import { useEffect, useRef } from "react";
import useChat from "../store";
import BotMessage from "./bot-message";
import UserMessage from "./user-message";

export default function ChatMessages() {
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
    <div className="flex-1 overflow-y-auto overflow-x-hidden mx" style={{paddingTop: 30 }}>
      {chats.map((chat, index) =>
        chat.role === "assistant" ? (
          <BotMessage index={index} key={chat.id} chat={chat} />
        ) : (
          <UserMessage chatIndex={index} key={chat.id} chat={chat} />
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
