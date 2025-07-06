import { v4 as uuidv4 } from "uuid";
import { ChatMessageType } from "../store/store";

export function createMessage<T>(
  role: ChatMessageType["role"],
  query: T,
  type: ChatMessageType["type"]
): { role: ChatMessageType['role']; content: T; id: string; type: ChatMessageType['type'] } {
  return {
    role,
    content: query,
    id: uuidv4(),
    type,
  };
}
