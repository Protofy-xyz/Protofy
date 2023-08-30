import React, { useState } from 'react';
import { Text, VStack, Icon, Select, Button, Switch, Modal, ScrollView, Image, HStack, AspectRatio, theme, Center, Box } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ({
  modalVisible,
  message,
  onSubmit,
  onDismiss,
  onAddEmpty,
  setSelectedTemplate,
  selectedTemplate,
  templates,
  selectedSection,
  setSelectedSection
}: {
  modalVisible: boolean;
  message: React.ReactNode;
  onSubmit: Function;
  onDismiss: Function;
  onAddEmpty: Function;
  setSelectedTemplate: Function;
  selectedTemplate: string;
  setSelectedSection: Function;
  selectedSection: string;
  templates: Object;
}) {
  const [device, setDevice] = useState('desktop');
  const onChangeDevice = () => {
    setDevice(state => state == "desktop" ? 'cellphone' : 'desktop')
  }
  return (
    <Modal isOpen={modalVisible} onClose={() => onDismiss()} contentSize={{ width: '80%', maxWidth: '750' }} >
      <Modal.Content _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
        <Modal.CloseButton
          mt={2}
          mr={1}
          _hover={{ bg: 'transparent' }}
          _pressed={{ bg: 'transparent' }}
          _icon={{ size: 'md' }}
        />
        <Modal.Body p={4}>
          <VStack justifyContent="center" alignItems="center" >
            <Text py="4" fontSize='lg' textAlign="center">
              {message}
            </Text>
            <HStack mb={5} width={'100%'} justifyContent={'space-between'}>
              <Select alignSelf={'flex-end'} selectedValue={selectedSection} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service"
                onValueChange={itemValue => setSelectedSection(itemValue)}>
                {
                  Object.keys(templates)?.map((section, index) => <Select.Item key={index} label={section} value={section} />)
                }
              </Select>
              <HStack alignItems="center" ml="4">
                <Icon
                  name={'monitor'}
                  as={MaterialCommunityIcons}
                  size={18}
                  color="#6F6F6F"
                  style={{ opacity: 1, textAlign: "center" }}
                />
                <Switch isChecked={device == 'cellphone'} size="sm" onToggle={onChangeDevice} />
                <Icon
                  name={'cellphone'}
                  as={MaterialCommunityIcons}
                  size={18}
                  color="#6F6F6F"
                  style={{ opacity: 1, textAlign: "center" }}
                />
              </HStack>
            </HStack>
            <ScrollView
              contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              height={'380'}
              width={'100%'}
            >
              {templates[selectedSection]?.map((template, index) => (
                <Image
                  alt={`template modal: template ${index}`}
                  mb={2}
                  key={index}
                  width={device == 'cellphone' ? '30%' : '100%'}
                  alignContent={'center'}
                  height={'90%'}
                  borderWidth={template == selectedTemplate ? 2 : 1}
                  onClick={() => setSelectedTemplate(template)}
                  borderColor={template == selectedTemplate ? 'black' : 'coolGray.100'}
                  borderRadius={10}
                  source={{ uri: `/public/screens/${selectedSection}/${template}${device == 'cellphone' ? '_mobile' : ''}.png` }}
                />
              )
              )}
            </ScrollView>
            <Button.Group mt="3" space="4" w="100%" justifyContent="center">
              <Button variant="solid" flex={1} size="md" isDisabled={!selectedTemplate} onPress={() => onSubmit()} >
                Use Template
              </Button>
              <Button
                flex={1}
                size="md"
                onPress={() => onAddEmpty()}
                variant="outline"
                _light={{
                  borderColor: 'secondary.400',
                  _text: {
                    color: 'secondary.400',
                  },
                  _hover: {
                    bg: 'secondary.600:alpha.10',
                    borderColor: 'secondary.400',
                  },
                  _pressed: {
                    bg: 'secondary.600:alpha.10',
                    borderColor: 'secondary.400',
                  },
                }}
                _dark={{
                  borderColor: 'secondary.400',
                  _text: {
                    color: 'secondary.400',
                  },
                  _hover: {
                    bg: 'secondary.500:alpha.10',
                    borderColor: 'secondary.400',
                  },
                  _pressed: {
                    bg: 'secondary.500:alpha.10',
                    borderColor: 'secondary.400',
                  },
                }}
              >
                Empty Screen
              </Button>
            </Button.Group>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
