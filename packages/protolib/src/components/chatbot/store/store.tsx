import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { produce } from "immer";
import moment from "moment";
import { ImageSize } from "../services/chatService";

const modalsList = [
  "gpt-4",
  "gpt-4-0613",
  "gpt-4-1106-preview",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "dall-e-3",
] as const;

export interface ChatMessageType {
  role: "user" | "assistant" | "system";
  content: string ;
  type: "text" | "image_url";
  id: string;
}

export interface ChatData {
  id: string;
  createdAt: string;
  chats: ChatMessageType[];
  title: string;
  isTitleEdited: boolean;
}

export interface ChatHistoryType {
  [chatName: string]: string[]; 
}
export interface SystemMessageType {
  message: string;
  useForAllChats: boolean;
}
export interface ModalPermissionType {
  id: string;
  object: string;
  created: number;
  allow_create_engine: boolean;
  allow_sampling: boolean;
  allow_logprobs: boolean;
  allow_search_indices: boolean;
  allow_view: boolean;
  allow_fine_tuning: boolean;
  organization: string;
  group: null;
  is_blocking: boolean;
}
export interface ModalType {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  permission: ModalPermissionType[];
  root: string;
  parent: null;
}

export type ModalList = (typeof modalsList)[number];

export interface SettingsType {
  settings: {
    sendChatHistory: boolean;
    systemMessage: string;
    useSystemMessageForAllChats: boolean;
    selectedModal: ModalList;
    dalleImageSize: { "dall-e-3": ImageSize };
    apiUrl: string;
  };
  modalsList: readonly string[];
  isSystemMessageModalVisible: boolean;
  isModalVisible: boolean;
  setSystemMessage: (value: SystemMessageType) => void;
  setSystemMessageModalVisible: (value: boolean) => void;
  setSendChatHistory: (value: boolean) => void;
  setModalVisible: (value: boolean) => void;
  setModalsList: (value: string[]) => void;
  setModal: (value: ModalList) => void;
  setDalleImageSize: (value: ImageSize, type: "dall-e-3") => void;
  setApiUrl: (url: string) => void;
}export interface ChatType {
  chats: ChatMessageType[];
  chatHistory: ChatHistoryType;
  addChat: (chat: ChatMessageType, index?: number) => void;
  editChatMessage: (chat: string, updateIndex: number) => void;
  addNewChat: () => void;
  saveChats: () => void;
  viewSelectedChat: (chatId: string) => void;
  resetChatAt: (index: number) => void;
  handleDeleteChats: (chatId: string) => void;
  editChatsTitle: (id: string, title: string) => void;
  clearAllChats: () => void;
}

export interface UserType {
  name: string;
  email: string;
  avatar: string;
}

export interface AuthType {
  token: string;
  apikey: string;
  setToken: (token: string) => void;
  setUser: (user: { name: string; email: string; avatar: string }) => void;
  setApiKey: (apikey: string) => void;
  user: UserType;
}

const useChat = create<ChatType>((set, get) => ({
  chats: [],
  chatHistory: localStorage.getItem("chatHistory")
    ? (JSON.parse(localStorage.getItem("chatHistory") as string) as ChatHistoryType)
    : {},

  addChat: (chat, index) => {
    set(
      produce((state: ChatType) => {
        if (index !== undefined) {
          state.chats[index] = chat;
        } else {
          state.chats.push(chat);
        }
      })
    );
    if (chat.role === "assistant" && chat.content) {
      get().saveChats();
    }
  },

  editChatMessage: (content, updateIndex) => {
    set(
      produce((state: ChatType) => {
        if (state.chats[updateIndex]) {
          state.chats[updateIndex].content = content;
        }
      })
    );
  },

  addNewChat: () => {
    set(
      produce((state: ChatType) => {
        state.chats = [];
      })
    );
  },

  saveChats: () => {
    const { settings } = useSettings.getState();
    const apiUrl = settings.apiUrl;
    const chatName = apiUrl.split("/").pop() as string;

    if (!chatName) return;

    const chatId = get().chats[0]?.id;
    if (!chatId) return;

    const data: ChatData = {
      id: chatId,
      createdAt: new Date().toISOString(),
      chats: get().chats,
      title: get().chats[0]?.content || "Untitled",
      isTitleEdited: false,
    };

    localStorage.setItem(chatId, JSON.stringify(data));

    const currentChatHistory = get().chatHistory;
    const updatedChatHistory = {
      ...currentChatHistory,
      [chatName]: [...(currentChatHistory[chatName] || []), chatId],
    };

    localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));

    set(
      produce((state: ChatType) => {
        state.chatHistory = updatedChatHistory;
      })
    );
  },

  viewSelectedChat: (chatId) => {
    set(
      produce((state: ChatType) => {
        const chatData = localStorage.getItem(chatId);
        if (!chatData) return;
        state.chats = JSON.parse(chatData)?.chats || [];
      })
    );
  },

  resetChatAt: (index) => {
    set(
      produce((state: ChatType) => {
        if (state.chats[index]) {
          state.chats[index].content = "";
        }
      })
    );
  },

  handleDeleteChats: (chatId) => {
    const { settings } = useSettings.getState();
    const apiUrl = settings.apiUrl;
    const chatName = apiUrl.split("/").pop() as string;

    if (!chatName) return;

    set(
      produce((state: ChatType) => {
        const currentChatHistory = { ...state.chatHistory };
        if (currentChatHistory[chatName]) {
          currentChatHistory[chatName] = currentChatHistory[chatName].filter(
            (id) => id !== chatId
          );
          if (currentChatHistory[chatName].length === 0) {
            delete currentChatHistory[chatName];
          }
        }

        state.chatHistory = currentChatHistory;

        localStorage.removeItem(chatId);
        localStorage.setItem("chatHistory", JSON.stringify(currentChatHistory));
      })
    );
  },

  editChatsTitle: (id, title) => {
    set(
      produce((state: ChatType) => {
        const chatData = localStorage.getItem(id);
        if (chatData) {
          const parsedChat = JSON.parse(chatData) as ChatData;
          parsedChat.title = title;
          parsedChat.isTitleEdited = true;
          localStorage.setItem(id, JSON.stringify(parsedChat));
        }
      })
    );
  },

  clearAllChats: () => {
    set(
      produce((state: ChatType) => {
        const currentChatHistory = state.chatHistory;

        Object.values(currentChatHistory).forEach((chatIds) => {
          chatIds.forEach((id) => {
            localStorage.removeItem(id);
          });
        });

        state.chatHistory = {};
        state.chats = [];

        localStorage.removeItem("chatHistory");
      })
    );
  },
}));


const useAuth = create<AuthType>()(
  persist(
    (set) => ({
      token: localStorage.getItem("token") || "",
      apikey: localStorage.getItem("apikey") || "",
      user: {
        name: "Your name?",
        email: "",
        avatar: "/images/avatar.png",
      },
      setToken: (token) => {
        set(
          produce((state) => {
            state.token = token;
          })
        );
      },
      setUser: (user) => {
        set(
          produce((state) => {
            state.user = user;
          })
        );
      },
      setApiKey: (apikey) => {
        set(
          produce((state) => {
            state.apikey = apikey;
          })
        );
        localStorage.setItem("apikey", apikey);
      },
    }),
    {
      name: "auth",
    }
  )
);

const useSettings = createWithEqualityFn<SettingsType>()(
  persist(
    (set) => ({
      settings: {
        sendChatHistory: true,
        systemMessage: "",
        useSystemMessageForAllChats: false,
        selectedModal: "gpt-4-turbo",
        dalleImageSize: { "dall-e-3": "1024x1024" },
        apiUrl: "",
      },
      modalsList: modalsList,
      isSystemMessageModalVisible: false,
      isModalVisible: false,
      setSystemMessage: (value) => {
        set(
          produce((state: SettingsType) => {
            state.settings.systemMessage = value.message;
            state.settings.useSystemMessageForAllChats = value.useForAllChats;
          })
        );
      },
      setSystemMessageModalVisible: (value) => {
        set(
          produce((state: SettingsType) => {
            state.isSystemMessageModalVisible = value;
          })
        );
      },
      setSendChatHistory: (value) => {
        set(
          produce((state: SettingsType) => {
            state.settings.sendChatHistory = value;
          })
        );
      },
      setModal: (value) => {
        set(
          produce((state: SettingsType) => {
            state.settings.selectedModal = value;
          })
        );
      },
      setModalVisible: (value) => {
        set(
          produce((state: SettingsType) => {
            state.isModalVisible = value;
          })
        );
      },
      setModalsList: (value) => {
        set(
          produce((state: SettingsType) => {
            state.modalsList = value;
          })
        );
      },
      setDalleImageSize: (value, type) => {
        set(
          produce((state: SettingsType) => {
            state.settings.dalleImageSize[type] = value;
          })
        );
      },
      setApiUrl: (url) => {
        set(
          produce((state: SettingsType) => {
            state.settings.apiUrl = url;
          })
        );
      },
    }),
    {
      name: "settings",
      version: 1,
      partialize: (state: SettingsType) => ({ settings: state.settings }),
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          (persistedState as SettingsType["settings"]).dalleImageSize = {
            "dall-e-3": "1024x1024",
          };
        }

        return persistedState as SettingsType;
      },
    }
  ),
  shallow
);

export const months = [
  "Januray",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const priority = [
  "Today",
  "Previous 7 Days",
  "Previous 30 Days",
  "This month",
].concat(months);

export const selectChatsHistory = (state: ChatType) => {
  const { settings } = useSettings.getState();
  const sortedData: Record<
    string,
    { title: string; id: string; month: string; month_id: number }[]
  > = {};

  const apiUrl = settings.apiUrl || "";
  const currentAssistant = apiUrl.split("/").pop();

  if (!currentAssistant || !state.chatHistory[currentAssistant]) {
    return sortedData; 
  }

  state.chatHistory[currentAssistant].forEach((chatId) => {
    const chatData = localStorage.getItem(chatId);

    if (!chatData) return;

    const { title, id, createdAt } = JSON.parse(chatData);
    const myDate = moment(createdAt, "YYYY-MM-DD");
    const currentDate = moment();
    const month = myDate.toDate().getMonth();

    const data = {
      title,
      id,
      month: months[month],
      month_id: month,
    };

    if (myDate.isSame(currentDate, "day")) {
      if (!sortedData["Today"]) {
        sortedData["Today"] = [];
      }
      sortedData["Today"].push(data);
    } else if (currentDate.subtract(7, "days").isBefore(myDate)) {
      if (!sortedData["Previous 7 Days"]) {
        sortedData["Previous 7 Days"] = [];
      }
      sortedData["Previous 7 Days"].push(data);
    } else if (currentDate.subtract(30, "days").isBefore(myDate)) {
      if (!sortedData["Previous 30 Days"]) {
        sortedData["Previous 30 Days"] = [];
      }
      sortedData["Previous 30 Days"].push(data);
    } else {
      if (!sortedData[months[month]]) {
        sortedData[months[month]] = [];
      }
      sortedData[months[month]].push(data);
    }
  });

  return sortedData;
};

export const selectUser = (state: AuthType) => state.user;
export const chatsLength = (state: ChatType) => state.chats.length > 0;
export const isChatSelected = (id: string) => (state: ChatType) =>
  state.chats[0]?.id === id;

export default useChat;
export { useAuth, useSettings };
