import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import DefaultIdeas from "./components/DefaultIdea/DefaultIdeas";
import UserQuery from "./components/UserInput/UserQuery";
import { Plus, Menu, PanelLeft } from "lucide-react";
import useChat, { chatsLength, useAuth } from "./store/store";
import classNames from "classnames";
import Chats from "./components/Chat/Chats";
import Modal from "./components/modals/Modal";
import Apikey from "./components/modals/Apikey";
import { useThemeSetting } from "@tamagui/next-theme";
import { Stack } from "tamagui";

const applyTheme = (resolvedTheme) => {
  if (resolvedTheme === "light" && document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
  } else if (resolvedTheme === "dark" && !document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.add("dark");
  }
};

function App() {
  const [active, setActive] = useState(false);
  const isChatsVisible = useChat(chatsLength);
  const addNewChat = useChat((state) => state.addNewChat);
  let userHasApiKey = useAuth((state) => state.apikey);
  const { resolvedTheme } = useThemeSetting();

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <Stack backgroundColor={resolvedTheme === "light" ? "" : "#212121"} f={1} className="h-screen flex flex-col">
      <div className="App font-montserrat md:flex dark:bg-[#212121] h-full flex flex-col">
        <Navbar active={active} setActive={setActive} />
        <div>
          <button
            type="button"
            className="fixed p-2 h-8 w-8 text-sm top-4 left-4 border-2 hidden md:inline-flex dark:text-white text-gray-700 dark:border border-gray-400 rounded-md items-center justify-center shadow"
            onClick={() => setActive(true)}
          >
            <PanelLeft />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden mt-12 md:mt-0">
          <div className="p-3 z-10 flex items-center justify-between bg-[#171717] dark:bg-[#212121] border-b top-0 text-gray-300 md:hidden fixed w-full">
            <button onClick={() => setActive(true)} className="text-2xl flex">
              <Menu />
            </button>
            <h2>New chat</h2>
            <button className="text-2xl flex items-center" onClick={addNewChat}>
              <Plus />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 mt-4 md:mt-0">
            {isChatsVisible ? <Chats /> : <DefaultIdeas />}
          </div>

          <div className="bg-white dark:bg-[#212121] p-2 shadow-md">
            <div className="max-w-2xl md:max-w-[calc(100% - 260px)] mx-auto">
              <UserQuery />
            </div>
          </div>
        </div>

        <Modal visible={!Boolean(userHasApiKey)}>
          <Apikey />
        </Modal>
      </div>
    </Stack>
  );
}

export default App;
