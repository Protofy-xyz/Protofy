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

  rulesOpened: boolean;
  toggleRules: () => void;
  setRulesOpened: (value: boolean) => void;
  
  saveJson: () => void;
}

const BoardControlsContext = createContext<Controls | null>(null);
export const useBoardControls = () => useContext(BoardControlsContext)!;

export const BoardControlsProvider: React.FC<{
  boardName: string;
  children: React.ReactNode;
}> = ({ boardName, children }) => {
  const [isJSONView, setIsJSONView] = useState(false);
  const [addOpened, setAddOpened] = useState(false);
  const [autopilot, setAutopilot] = useState(false);
  const [rulesOpened, setRulesOpened] = useState(false);

  const toggleJson = () => setIsJSONView(v => !v);
  const openAdd = () => setAddOpened(true);
  const toggleRules = () => setRulesOpened(v => !v);

  const toggleAutopilot = useCallback(async () => {
    setAutopilot(v => !v);
    await API.get(`/api/core/v1/boards/${boardName}/autopilot/${!autopilot ? 'on' : 'off'}`);
  }, [boardName, autopilot]);

  const saveJson = () => {/* llama a onEditBoard o lógica equivalente */ };

  return (
    <BoardControlsContext.Provider value={{
      isJSONView, toggleJson,
      addOpened, openAdd,
      autopilot, toggleAutopilot,
      rulesOpened, toggleRules,
      saveJson, setAddOpened, setRulesOpened
    }}>
      {children}
    </BoardControlsContext.Provider>
  );
};
