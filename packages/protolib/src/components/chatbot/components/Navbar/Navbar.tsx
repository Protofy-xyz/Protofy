import classnames from "classnames";
import ChatHistory from "./ChatHistory";
import Avatar from "../Avatar/Avatar";
import { X, Plus, MessageSquare, Settings as SettingsIcon, MoreHorizontal, PanelLeft } from "lucide-react";
import useChat, { ModalList, useAuth, useSettings } from "../../store/store";
import Settings from "../modals/Settings";
import Modal from "../modals/Modal";
import SystemMessage from "../modals/SystemMessage";

export default function Navbar({
  active,
  setActive,
}: {
  active: boolean;
  setActive: (v: boolean) => void;
}) {
  const addNewChat = useChat((state) => state.addNewChat);
  const [
    isVisible,
    setModalVisible,
    isSystemMessageModalVisible,
    setSystemMessageModalVisible,
    selectedModal,
    modalsList,
    setModal,
  ] = useSettings((state) => [
    state.isModalVisible,
    state.setModalVisible,
    state.isSystemMessageModalVisible,
    state.setSystemMessageModalVisible,
    state.settings.selectedModal,
    state.modalsList,
    state.setModal,
  ]);
  const name = useAuth((state) => state.user.name);
  const groupedModels = modalsList.reduce(
    (obj: Record<string, string[]>, modal) => {
      const prefix = modal.split("-")[0] + "-" + modal.split("-")[1];
      return {
        ...obj,
        [prefix]: [...(obj[prefix] || []), modal],
      };
    },
    {}
  );

  return (
    <>
      <div
        className={classnames(
          "navwrap fixed duration-500 top-0 left-0 bottom-0 right-0 md:right-[calc(100vw-260px)] z-30 md:bg-opacity-0",
          {
            "bg-opacity-60": active,
            "opacity-0 pointer-events-none": !active,
          }
        )}
      >
        <nav
          className={classnames(
            "absolute left-0 bottom-0 top-0 md:flex-grow-1 w-9/12 md:w-[260px] flex flex-col transition duration-500",
            "bg-[#f8f8f8] dark:bg-[#171717] text-black dark:text-white",
            {
              "translate-x-0": active,
              "-translate-x-[150%]": !active,
            }
          )}
        >
          <div className="flex mb-2 items-center justify-between gap-2 p-2">
            <button
              type="button"
              className="border border-gray-300 dark:border-gray-500 p-2 w-full md:w-auto rounded-md text-left flex-grow flex bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={addNewChat}
            >
              <span className="mr-2 text-xl">
                <Plus />
              </span>
              <span>New chat</span>
            </button>
            <button
              type="button"
              className="border h-10 w-10 border-gray-300 dark:border-gray-500 rounded-md p-2 hidden md:inline-block text-gray-800 dark:text-gray-200"
              onClick={() => setActive(false)}
            >
              <PanelLeft />
            </button>
          </div>
          <div className="history overflow-y-auto h-[calc(100%-60px)]">
            <ChatHistory />
          </div>
          <div className="account font-bold z-20 bg-[#f8f8f8] dark:bg-[#171717] border-t border-gray-300 dark:border-gray-500 shadow">
            <div className="self-stretch mr-4 w-full mb-2">
              <select
                value={selectedModal}
                onChange={(e) => setModal(e.target.value as ModalList)}
                className="border border-gray-300 dark:border-gray-500 block w-full p-2.5 text-black dark:text-white bg-white dark:bg-[#212121] focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
              >
                {Object.keys(groupedModels).map((group) => (
                  <optgroup
                    label={group.toUpperCase()}
                    key={group}
                    className="bg-white dark:bg-[#212121] text-black dark:text-white"
                  >
                    {groupedModels[group].map((modal) => (
                      <option
                        value={modal}
                        key={modal}
                        className="bg-white dark:bg-[#212121] text-black dark:text-white"
                      >
                        {modal}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

            </div>
            <div className="[&>.options]:focus-within:visible">
              <button
                type="button"
                className="px-2 relative py-2 inline-flex w-full items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition group bg-transparent text-black dark:text-white"
              >
                <Avatar className="h-11 w-11" />
                <span className="p-2">{name}</span>
                <span className="ml-auto text-gray-400 dark:text-gray-200 text-2xl">
                  <MoreHorizontal />
                </span>
              </button>
              <div className="options absolute bottom-12 rounded-md left-0 right-0 bg-gray-100 dark:bg-gray-800 font-normal invisible transition m-2 z-30 text-gray-800 dark:text-gray-300">
                {/* <button
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left flex items-center"
                  onClick={() => setSystemMessageModalVisible(true)}
                >
                  <span className="mr-2 p-1 text-xl flex items-center">
                    <MessageSquare />
                  </span>
                  <span>Custom instructions</span>
                </button> */}
                <button
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left flex items-center"
                  onClick={() => setModalVisible(true)}
                >
                  <span className="mr-2 p-1 text-xl flex items-center">
                    <SettingsIcon />
                  </span>
                  <span>Settings</span>
                </button>
                <div className="h-[1px] bg-gray-300 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActive(false)}
            className="close md:hidden absolute top-2 h-10 w-10 border-2 -right-10 p-2 flex items-center justify-center text-gray-800 dark:text-white"
          >
            <span className="text-2xl flex">
              <X />
            </span>
          </button>
        </nav>
      </div>
      <Modal visible={isVisible}>
        <Settings />
      </Modal>
      <Modal visible={isSystemMessageModalVisible}>
        <SystemMessage />
      </Modal>
    </>
  );

}  