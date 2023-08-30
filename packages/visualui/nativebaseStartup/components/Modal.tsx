import React from 'react';
import { Text, VStack, Avatar, Button, Modal } from 'native-base';

export default function ({
  modalVisible,
  setModalVisible,
  message,
}: {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message: React.ReactNode;
}) {
  return (
    <Modal isOpen={modalVisible} onClose={setModalVisible} size="md">
      <Modal.Content _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }}>
        <Modal.CloseButton
          m={0}
          p={0}
          mt={2}
          mr={1}
          _hover={{ bg: 'transparent' }}
          _pressed={{ bg: 'transparent' }}
          _icon={{ size: 'md' }}
        />
        <Modal.Body p={4}>
          <VStack justifyContent="center" alignItems="center">
            <Avatar
              mt="22"
              source={require('../assets/person.png')}
              w="20"
              h="20"
            />
            <Text py="4" textAlign="center">
              {message}
            </Text>
            <Button.Group mt="3" space="4" w="100%" justifyContent="center">
              <Button variant="solid" flex={1} size="md">
                YES
              </Button>
              <Button
                flex={1}
                size="md"
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
                NO
              </Button>
            </Button.Group>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
