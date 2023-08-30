import React from "react";
import { Button as MaterialButton } from "@mui/material";
import { useEditor } from "@craftjs/core";
import styles from "./auxiliary-bar.module.css";
import stylesList from "./sidebar.module.css";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from "../../store/EditorStore";
import { Text } from "native-base";

export const AuxiliaryBar = () => {
  const setCurrentNodeId = useEditorStore(state => state.setCurrentNodeId)

  const { actions, selected } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;
    if (currentNodeId) {
      setCurrentNodeId(currentNodeId)
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable()
      };
    }
    return {
      selected
    }
  });


  return <div className={styles.auxiliaryBar}>
    {selected ? (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div  style={{ marginTop: 2, paddingLeft: '5px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '10px', paddingTop: '25px', paddingLeft: '10px' }}>
            <Text fontSize="xl" color="white" pl='6px'>{selected.name}</Text>
          </div>
          <div className={stylesList.list} style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', overflowX: 'hidden', maxHeight: window.outerHeight * 0.6, paddingTop: '20px' }}>
            {
              selected.settings && React.createElement(selected.settings)
            }
          </div>
        </div>
        {
          selected.isDeletable && selected.name != 'Background' ? (
            <MaterialButton
              variant="text"
              style={{ marginTop: '30px', textTransform: "none", alignSelf: 'center', width: '50%', zIndex: 0 }}
              endIcon={<MaterialCommunityIcons
                name="delete-outline"
                color={'#ff4040'}
                size={20}
              />}
              onClick={() => {
                actions.delete(selected.id);
              }}
            >
              <Text color="#ff4040">Delete</Text>
            </MaterialButton>
          ) : null
        }
      </div>
    ) : null}
  </div>
}
