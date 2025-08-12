import React, { createContext, useContext, useState, useCallback } from 'react';
import { API } from 'protobase'

interface Controls {
  isJSONView: boolean;
  toggleJson: () => void;

  addOpened: boolean;
  openAdd: () => void;
  setAddOpened: (value: boolean) => void;

  autopilot: boolean;
  toggleAutopilot: () => void;

  setTabVisible: (value: string) => void;
  tabVisible: string;

  viewMode: "board" | "json" | "ui";
  setViewMode: (mode: "board" | "json" | "ui") => void;

  saveJson: () => void;
}

const BoardControlsContext = createContext<Controls | null>(null);
export const useBoardControls = () => useContext(BoardControlsContext)!;

export const BoardControlsProvider: React.FC<{
  boardName: string;
  children: React.ReactNode;
  board: any;
}> = ({ boardName, children, mode='board', addMenu = 'closed', dialog = '', autopilotRunning = false, rules='closed', board }) => {
  const [isJSONView, setIsJSONView] = useState(mode === 'json');
  const [addOpened, setAddOpened] = useState(addMenu === 'open');
  const [autopilot, setAutopilot] = useState(autopilotRunning);
  const [tabVisible, setTabVisible] = useState<string>("");
  const [viewMode, setViewMode] = useState<"board" | "json" | "ui">('board');

  const toggleJson = () => setIsJSONView(v => !v);
  const openAdd = () => setAddOpened(true);

  const toggleAutopilot = useCallback(async () => {
    setAutopilot(v => !v);
    await API.get(`/api/core/v1/boards/${boardName}/autopilot/${!autopilot ? 'on' : 'off'}`);
    console.log('board:', board)
    if(board?.settings?.showBoardUIOnPlay) {
      if(!autopilot) setViewMode('ui');
      if(autopilot) setViewMode('board');
    }
  }, [boardName, autopilot]);

  const saveJson = () => {/* llama a onEditBoard o lógica equivalente */ };

  return (
    <BoardControlsContext.Provider value={{
      isJSONView, toggleJson,
      addOpened, openAdd,
      autopilot, toggleAutopilot,
      saveJson, setAddOpened,
      viewMode, setViewMode,
      setTabVisible, tabVisible
    }}>
      {children}
    </BoardControlsContext.Provider>
  );
};
