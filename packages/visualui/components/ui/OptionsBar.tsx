import React from "react";
import DropDownMenu from './DropDownMenu';
import { optionsTranslations } from "../../utils/translations"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "native-base";

export type PaneProps = {
  frames: any
  frameSelectionMenu: string
  setFrameSelectionMenu: Function
  selectedTheme: string
  onEditTheme: Function
};

export const OptionsBar = ({ frameSelectionMenu, setFrameSelectionMenu, frames, onEditTheme, selectedTheme }: PaneProps) => {

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
      <DropDownMenu
        selectedItem={frameSelectionMenu}
        setSelectedItem={setFrameSelectionMenu}
        items={Object.keys(frames)}
        icon={"chevron-down"}
        selectionTitle={optionsTranslations[frameSelectionMenu]}
        width={210}
      />
      {onEditTheme ? <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '180px', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={() => onEditTheme()}>
        <Text color={'trueGray.200'} >{`Theme: ${optionsTranslations[selectedTheme]}`}</Text>
        <MaterialCommunityIcons
          name={'shape-outline'}
          color={'#CCCCCC'}
          size={22}
          style={{ position: 'relative', marginLeft: '5px' }}
        />
      </div> : <></>}
    </div>
  );
};
