import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Menu, Pressable, Text } from "native-base";
import { optionsTranslations } from '../../utils/translations';

type DropDownMenuProps = {
  selectedItem: string;
  setSelectedItem: Function;
  items: any[];
  icon: any | string;
  selectionTitle?: string | any;
  width?: number;
  children?: any;
}

const DropDownMenu = ({ selectedItem, setSelectedItem, items, icon, selectionTitle, width, children }: DropDownMenuProps) => {
  return (
    <Menu w={width ?? "150"} trigger={triggerProps => {
      return (
        <Pressable {...triggerProps}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: width ? (width + 30) : '180px', justifyContent: 'flex-end' }}>
            <Text color={'trueGray.200'} >{selectionTitle}</Text>
            <MaterialCommunityIcons
              name={icon}
              color={'#CCCCCC'}
              size={22}
              style={{ position: 'relative', marginLeft: '5px' }}
            />
          </div>
        </Pressable>
      )
    }}>
      {items.map((item, index) => <Menu.Item onPress={() => setSelectedItem(item)} key={index}><Text color={item == selectedItem ? 'secondary.600' : 'primary.600'} >{optionsTranslations[item] ?? item}</Text></Menu.Item>)}
      {children}
    </Menu>
  )
}

export default DropDownMenu