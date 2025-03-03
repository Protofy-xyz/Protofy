import useChat, { priority, selectChatsHistory } from "../../store/store";
import ChatRef from "./ChatRef";

export default function ChatHistory() {
  const chatsHistory = useChat(selectChatsHistory);

  return (
    <div className="my-4 px-2 h-full text-gray-800 dark:text-[#ECECF1]">
      {Object.keys(chatsHistory).length > 0 &&
        Object.keys(chatsHistory)
          .sort((a, b) => priority.indexOf(a) - priority.indexOf(b))
          .map((month) => (
            <div key={month}>
              <h3 className="text-sm my-2 pl-2 text-gray-600 dark:text-[#8E8EA0]">
                {month}
              </h3>
              {chatsHistory[month].map((chat, i) => (
                <ChatRef key={`${chat.id}-${i}`} chat={chat} />
              ))}
            </div>
          ))}
      {Object.keys(chatsHistory).length === 0 && (
        <div className="h-full flex justify-center items-center">
          <p className="text-center text-gray-500 dark:text-gray-400">No chats yet</p>
        </div>
      )}
    </div>
  );
}
