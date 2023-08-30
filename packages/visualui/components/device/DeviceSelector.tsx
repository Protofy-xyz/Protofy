import React, { memo, useState} from "react";
import { Menu, Pressable, Icon, Box, Input, Text, HStack, IconButton } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const DeviceSelector = ({devicesList,currentDevice, onCreateDevice, onSelectDevice}) => {
    const [newDeviceName, setNewDeviceName] = useState<string>('')
    const handleChange = (text) => setNewDeviceName(text)

    const _onCreateDevice = ()=>{
        
        onCreateDevice(newDeviceName)
        setNewDeviceName((state)=>'')
    }

    return (
      <Box position="absolute" top="40px" right="40px">
        <Menu w="190" placement="bottom right" onClose={()=> setNewDeviceName('')} trigger={triggerProps => {
          return <Pressable accessibilityLabel="More options menu" {...triggerProps} flexDir='row' alignItems='center'>
            <HStack>
              <Text fontSize="md" fontWeight='light'>Device: </Text><Text fontSize="md" fontWeight='medium'>{currentDevice}</Text>
            </HStack>
            <Icon as={MaterialCommunityIcons} ml='10px' pt="1px" name={'chevron-down'} size='md' />
          </Pressable>;
        }}>
          {
            Object.keys(devicesList).length ? Object.keys(devicesList)?.map((device, index) => {
              const isSelected = device == currentDevice // TODO: in menu item distinguish the selected one
              return <Menu.Item onPress={() => onSelectDevice(device)} key={index}>{device}</Menu.Item>
            }) : null}
          <Menu.Item >
            <Input zIndex={100} value={newDeviceName} variant="underlined" onClick={(e) => e.stopPropagation()} onChangeText={handleChange} placeholder="New device" w="75%" onSubmitEditing={() => _onCreateDevice()} />
            <IconButton p="5px" borderRadius='10px' variant='solid' _icon={{as: MaterialCommunityIcons, name: 'plus'}} isDisabled={!newDeviceName} onPress={() => _onCreateDevice()}/>
            </Menu.Item>
        </Menu>
      </Box>
    )
  };

  export default memo(DeviceSelector);