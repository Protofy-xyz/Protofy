import React from 'react';
import {
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Pressable,
  useDisclose,
  useColorModeValue,
  Center,
  Actionsheet,
  Modal,
  Button,
  useBreakpointValue,
  Image,
  IconButton,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import FloatingLabelInput from '../../components/FloatingLabelInput';

import DashboardLayout from '../../layouts/DashboardLayout';
type ConfirmationType = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
type ConfirmationActionType = {
  isOpen: boolean;
  onClose: () => void;
};

function Confirmation(props: ConfirmationType) {
  return (
    <Modal
      isOpen={props.modalVisible}
      onClose={props.setModalVisible}
      size="md"
      marginX="auto"
    >
      <Modal.Content
        _dark={{ bg: 'coolGray.700' }}
        _light={{ bg: 'white' }}
        px="12"
        pt="6"
        py="10"
      >
        <Text
          fontSize="xl"
          fontWeight="medium"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Profile Picture
        </Text>
        <HStack
          space={{ base: 4, md: 12 }}
          justifyContent="space-between"
          mt="5"
        >
          <Pressable
            onPress={() => {
              console.log('hello');
            }}
          >
            <VStack space="1" alignItems="center">
              <Image
                h="10"
                w="10"
                alt="NativeBase Startup+ "
                resizeMode={'contain'}
                source={require('./images/photos.png')}
              />
              <Text
                fontSize="sm"
                fontWeight="medium"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                Photos
              </Text>
            </VStack>
          </Pressable>
          <Pressable
            onPress={() => {
              console.log('hello');
            }}
          >
            <VStack space="1" alignItems="center">
              <Image
                h="10"
                w="10"
                alt="NativeBase Startup+ "
                resizeMode={'contain'}
                source={require('./images/camera.png')}
              />
              <Text
                fontSize="sm"
                fontWeight="medium"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                Camera
              </Text>
            </VStack>
          </Pressable>
          <Pressable
            onPress={() => {
              console.log('hello');
            }}
          >
            <VStack space="1" alignItems="center">
              <Center rounded="full" w="10" h="10" bg="#D75746">
                <Image
                  h="5"
                  w="5"
                  alt="NativeBase Startup+ "
                  resizeMode={'contain'}
                  source={require('./images/delete.png')}
                />
              </Center>
              <Text
                fontSize="sm"
                fontWeight="medium"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                Remove photo
              </Text>
            </VStack>
          </Pressable>
        </HStack>
      </Modal.Content>
    </Modal>
  );
}
function ConfirmationAction(props: ConfirmationActionType) {
  return (
    <Actionsheet
      hideDragIndicator
      isOpen={props.isOpen}
      onClose={props.onClose}
      display={{ base: 'flex', md: 'none' }}
    >
      <Actionsheet.Content
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.700' }}
        borderTopRightRadius={20}
        borderTopLeftRadius={20}
        px={6}
        pt={6}
        pb={10}
        alignItems="flex-start"
      >
        <Text
          fontSize="xl"
          fontWeight="medium"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Profile Picture
        </Text>
        <HStack space="12" alignItems="center" pb="1" mt="5">
          <Pressable
            onPress={() => {
              console.log('hello');
            }}
          >
            <VStack space="1" alignItems="center">
              <Image
                h="10"
                w="10"
                alt="NativeBase Startup+ "
                resizeMode={'contain'}
                source={require('./images/photos.png')}
              />
              <Text
                fontSize="sm"
                fontWeight="medium"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                Photos
              </Text>
            </VStack>
          </Pressable>
          <Pressable
            onPress={() => {
              console.log('hello');
            }}
          >
            <VStack space="1" alignItems="center">
              <Image
                h="10"
                w="10"
                alt="NativeBase Startup+ "
                resizeMode={'contain'}
                source={require('./images/camera.png')}
              />
              <Text
                fontSize="sm"
                fontWeight="medium"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                Camera
              </Text>
            </VStack>
          </Pressable>
          <Pressable
            onPress={() => {
              console.log('hello');
            }}
          >
            <VStack space="1" alignItems="center">
              <Center rounded="full" w="10" h="10" bg="#D75746">
                <Image
                  h="5"
                  w="5"
                  alt="NativeBase Startup+ "
                  resizeMode={'contain'}
                  source={require('./images/delete.png')}
                />
              </Center>
              <Text
                fontSize="sm"
                fontWeight="medium"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                Remove photo
              </Text>
            </VStack>
          </Pressable>
        </HStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
export default function () {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [modalVisible, setModalVisible] = React.useState(false);
  const bgColor = useBreakpointValue({
    base: '#1f2937',
    lg: '#1f2937',
    md: '#1f2937',
    xl: '#1f2937',
  });
  return (
    <>
      <DashboardLayout title="Edit Details">
        <VStack
          px={{ base: 4, md: 8, lg: 32 }}
          py={{ base: 5, md: 8 }}
          rounded={{ md: 'sm' }}
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
          space="4"
          flex={1}
        >
          <HStack
            mb="3"
            alignItems="center"
            justifyContent={{ md: 'space-between', base: 'space-around' }}
          >
            {/* <Avatar source={require('../../assets/jandoe.png')} w="24" h="24">
              <Avatar.Badge
                _light={{ bg: 'coolGray.50' }}
                _dark={{ bg: 'coolGray.700', borderColor: 'coolGray.700' }}
                p={3}
                alignItems="center"
                justifyContent="center"
              >
                <Pressable
                  onPress={
                    Platform.OS === 'ios'
                      ? onOpen
                      : () => {
                          setModalVisible(!modalVisible);
                        }
                  }
                >
                  <Center>
                    <Icon
                      size="5"
                      as={MaterialIcons}
                      name={'photo-camera'}
                      color="coolGray.400"
                    />
                  </Center>
                </Pressable>
              </Avatar.Badge>
            </Avatar> */}
            <Avatar source={require('../../assets/jandoe.png')} w="24" h="24">
              <Avatar.Badge
                position="absolute"
                left={10}
                bottom={-8}
                _light={{ bg: 'coolGray.50' }}
                _dark={{ bg: 'coolGray.700', borderColor: 'coolGray.700' }}
                p={2}
                alignItems="center"
                justifyContent="center"
              >
                <Center>
                  <IconButton
                    onPress={
                      Platform.OS === 'ios'
                        ? onOpen
                        : () => {
                            setModalVisible(!modalVisible);
                          }
                    }
                    mb={{ base: 3, md: 0 }}
                    variant="unstyled"
                    _icon={{
                      color: 'coolGray.400',
                      size: { base: '3', md: 4 },
                      as: MaterialIcons,
                      name: 'photo-camera',
                    }}
                  />
                </Center>
              </Avatar.Badge>
            </Avatar>
          </HStack>
          <FloatingLabelInput
            isRequired
            label="Full Name"
            defaultValue={'John Legend'}
            labelColor={useColorModeValue('#9CA3AF', '#9CA3AF')}
            labelBGColor={useColorModeValue('#fff', bgColor)}
          />

          <FloatingLabelInput
            isRequired
            label="Email"
            labelColor={useColorModeValue('#9CA3AF', '#9CA3AF')}
            labelBGColor={useColorModeValue('#fff', bgColor)}
            defaultValue={'jondoe@example.com'}
          />
          <FloatingLabelInput
            isRequired
            label="Contact Number"
            labelColor={useColorModeValue('#9CA3AF', '#9CA3AF')}
            labelBGColor={useColorModeValue('#fff', bgColor)}
            defaultValue={'+91-8239635900'}
          />
          <FloatingLabelInput
            isRequired
            label="Address"
            labelColor={useColorModeValue('#9CA3AF', '#9CA3AF')}
            labelBGColor={useColorModeValue('#fff', bgColor)}
            defaultValue={'301, Bakers Street'}
          />
          <HStack
            alignItems="center"
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
          >
            <FloatingLabelInput
              mb={{ base: 4, md: 0 }}
              w="100%"
              containerWidth={{ base: '100%', md: '48%' }}
              isRequired
              label="City"
              labelColor={useColorModeValue('#9CA3AF', '#9CA3AF')}
              labelBGColor={useColorModeValue('#fff', bgColor)}
              defaultValue={'Rochester'}
            />
            <FloatingLabelInput
              w="100%"
              containerWidth={{ base: '100%', md: '48%' }}
              isRequired
              label="State"
              labelColor={useColorModeValue('#9CA3AF', '#9CA3AF')}
              labelBGColor={useColorModeValue('#fff', bgColor)}
              defaultValue={'New York'}
            />
          </HStack>
          <HStack
            alignItems="center"
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
          >
            <FloatingLabelInput
              mb={{ base: 4, md: 0 }}
              w="100%"
              containerWidth={{ base: '100%', md: '48%' }}
              isRequired
              label="Zip code"
              labelColor={useColorModeValue('#9CA3AF', '#9CA3AF')}
              labelBGColor={useColorModeValue('#fff', bgColor)}
              defaultValue={'11357'}
            />
            <FloatingLabelInput
              mb={{ base: 4, md: 0 }}
              w="100%"
              containerWidth={{ base: '100%', md: '48%' }}
              isRequired
              label="Country"
              labelColor={useColorModeValue('#9CA3AF', '#9CA3AF')}
              labelBGColor={useColorModeValue('#fff', bgColor)}
              defaultValue={'USA'}
            />
          </HStack>
          <Button mt={{ base: 'auto' }} variant="solid">
            SAVE
          </Button>
        </VStack>
        <ConfirmationAction isOpen={isOpen} onClose={onClose} />
        <Confirmation
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </DashboardLayout>
    </>
  );
}
