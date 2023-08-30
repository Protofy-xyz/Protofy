import React, { useState } from "react";
import { useEditorStore } from "../../store/EditorStore";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import toggles from "../../utils/toggles";

const CODEISFLOW = toggles.codeIsFlow ?? false

export type Props = {
  onSave: Function
  hasChanges: boolean
};

export const ModeController = ({ onSave, hasChanges }: Props) => {
  const toggleCode = useEditorStore(state => state.toggleCode);
  const currentPage = useEditorStore(state => state.currentPage);
  const isSourceCodeVisible = useEditorStore(state => state.isSourceCodeVisible);
  const size = 25

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto', right: 0, left: 0, justifyContent: 'center', marginTop: '20px', zIndex: 100 }}>
        {!CODEISFLOW ? <>
          <div title='Click here to open code. Shortcut: "C"' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#252526', borderRadius: '14px', width: '40px', padding: '5px', marginLeft: '6px' }}>
            <MaterialCommunityIcons name="xml" onPress={() => toggleCode()} color={isSourceCodeVisible ? 'grey' : 'white'} size={size} />
          </div>
          <div title='Save. Shortcut: "Ctrl" + "S" / "Cmd" + "S"' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#252526', borderRadius: '14px', width: '40px', padding: '5px', marginLeft: '6px' }}>
            <MaterialCommunityIcons name="content-save-outline" onPress={() => onSave()} color={hasChanges ? 'white' : 'grey'} size={size} />
          </div>
        </>
          : null}
        <div title='Click here to visit page' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#252526', borderRadius: '14px', width: '40px', padding: '5px', marginLeft: '6px' }}>
          <MaterialCommunityIcons name="eye-outline" onPress={() => window.open(`/${currentPage}`, "_blank")} color={'white'} size={size} />
        </div>
      </div>
    </>

  );
};
