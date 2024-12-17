import { useEffect, useState } from "react"
import Navbar from "./components/Navbar/Navbar"
import DefaultIdeas from "./components/DefaultIdea/DefaultIdeas"
import UserQuery from "./components/UserInput/UserQuery"
import { Plus, Menu, PanelLeft } from "lucide-react"
import useChat, { chatsLength, useAuth, useSettings } from "./store/store"
import classNames from "classnames"
import Chats from "./components/Chat/Chats"
import Modal from "./components/modals/Modal"
import Apikey from "./components/modals/Apikey"
import { useThemeSetting } from "@tamagui/next-theme"
import { Stack } from "tamagui"

const applyTheme = (resolvedTheme) => {
  if (resolvedTheme === "light" && document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark")
  } else if (resolvedTheme === "dark" && !document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.add("dark")
  }
}

type AppProps = {
  apiUrl: string
}

function App({ apiUrl }: AppProps) {
  const [active, setActive] = useState(false)
  const isChatsVisible = useChat(chatsLength)
  const addNewChat = useChat((state) => state.addNewChat)
  let userHasApiKey = useAuth((state) => state.apikey)
  const { resolvedTheme } = useThemeSetting()
  const menu = true //toggle to show/hide the menu

  const setApiUrl = useSettings((state) => state.setApiUrl)

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (apiUrl) {
      setApiUrl(apiUrl)
    }
  }, [apiUrl])

  return (
    <Stack backgroundColor={resolvedTheme === "light" ? "" : "#212121"} f={1} className="h-screen flex flex-col">
      <div className="App font-montserrat md:flex dark:bg-[#212121] h-full flex flex-col">
        {
          menu ? (
            <>
              <div>
                <button
                  type="button"
                  className="fixed p-2 h-8 w-8 text-sm top-4 left-4 border-2 hidden md:inline-flex dark:text-white text-gray-700 dark:border border-gray-400 rounded-md items-center justify-center shadow"
                  onClick={() => setActive(true)}
                >
                  <PanelLeft />
                </button>
              </div>
              <Navbar active={active} setActive={setActive} />
            </>) : <button
              type="button"
              className="fixed p-2 h-8 w-18 text-sm top-4 left-4 border-2 hidden md:inline-flex dark:text-white text-gray-700 dark:border border-gray-400 rounded-md items-center justify-center shadow"
              onClick={addNewChat}
            >
            <span className="mr-2 text-xl">
              <Plus />
            </span>
            <span>New chat</span>
          </button>
        }

        <div className="flex-1 flex flex-col overflow-hidden mt-12 md:mt-0">
          <div
            className={`p-3 z-10 flex items-center bg-[#f8f8f8] dark:bg-[#212121] border-b 
    border-gray-300 dark:border-gray-700 top-0 text-gray-800 dark:text-gray-300 
    md:hidden fixed w-full`}
          >
            {menu ? (
              <button
                onClick={() => setActive(true)}
                className="text-2xl flex text-gray-800 dark:text-white"
              >
                <Menu />
              </button>
            ) : (
              <div className="w-8" />
            )}
            <h2 className="text-gray-800 dark:text-white mx-auto">New chat</h2>
            <button
              className="text-2xl flex items-center text-gray-800 dark:text-white"
              onClick={addNewChat}
            >
              <Plus />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 mt-0">
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
  )
}

export default App
