import React from 'react';
import { HStack, Icon, Text, Column, Avatar, Pressable, IconButton, Radio, Divider, Box, NativeBaseProvider } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from 'baseapp/plugins/visualui/nativebaseStartup/layouts/DashboardLayout';
import { ImageSourcePropType } from 'react-native';
import Modal from 'baseapp/plugins/visualui/nativebaseStartup/components/Modal';
import Background from "baseapp/palettes/uikit/Background";
import currentTheme from "internalapp/themes/currentTheme";

type User = {
  id: string;
  avatar: ImageSourcePropType;
  name: string;
  email: string;
};
const users: User[] = [
  {
    id: '1',
    avatar: require('/platform/packages/frontend/app/src/plugins/visualui/nativebaseStartup/assets/person.png'),
    name: 'Jane Doe',
    email: 'janedoe2@mydomain.com',
  },
  {
    id: '2',
    avatar: require('/platform/packages/frontend/app/src/plugins/visualui/nativebaseStartup/assets/women.jpg'),
    name: 'Joey Tribbiani',
    email: 'joetribbiani@gmail.com',
  },
];
function Dropdown() {
  return (
    <Column mt="3">
      <Radio.Group defaultValue="1" name="MyRadioGroup">
        <Column divider={<Divider />} space="3" w="full">
          {users.map((user) => (
            <HStack
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              <HStack space="3" alignItems="center">
                <Avatar source={user.avatar} width={9} height={9} />
                <Column space={1}>
                  <Text
                    _light={{ color: 'coolGray.800' }}
                    _dark={{ color: 'coolGray.50' }}
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    {user.name}
                  </Text>
                  <Text
                    _light={{ color: 'coolGray.500' }}
                    _dark={{ color: 'coolGray.400' }}
                    fontSize="xs"
                    fontWeight="medium"
                  >
                    {user.email}
                  </Text>
                </Column>
              </HStack>
              <Radio value={user.id} />
            </HStack>
          ))}
        </Column>
      </Radio.Group>
    </Column>
  );
}

export default function ManageAccount() {
  const [dropdownTab, setDropdownTab] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(true);

  return (
    <NativeBaseProvider theme={currentTheme}>
      <Background>
        <DashboardLayout title={'Manage Accounts'} displayScreenTitle={true}>
          <Box
            py={{ base: 5, md: 8 }}
            _light={{ bg: 'white' }}
            _dark={{ bg: 'coolGray.800' }}
            rounded={{ md: 'sm' }}
          >
            <HStack px="4" space="3">
              <Avatar source={require('/platform/packages/frontend/app/src/plugins/visualui/nativebaseStartup/assets/person.png')} size={12} />
              <Column space="1">
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                >
                  Jane Doe
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="normal"
                  _light={{ color: 'coolGray.500' }}
                  _dark={{ color: 'coolGray.400' }}
                >
                  janedoe2@mydomain.com
                </Text>
              </Column>

              <IconButton
                p="0"
                variant="unstyled"
                icon={
                  <Icon
                    size={5}
                    name="delete"
                    as={MaterialIcons}
                    _dark={{ color: 'coolGray.400' }}
                    _light={{ color: 'coolGray.500' }}
                  />
                }
                onPress={() => {
                  setModalVisible(true);
                }}
                ml="auto"
              />
            </HStack>
            <Divider mt="6" mb="3" />
            <Box px="3">
              <Pressable
                _light={{
                  _pressed: {
                    bg: 'coolGray.200',
                  },
                }}
                _dark={{
                  _pressed: {
                    bg: 'coolGray.700',
                  },
                }}
                py="3"
                px="1"
              >
                <HStack alignItems="center" space="4">
                  <Icon
                    as={MaterialIcons}
                    name={'person-add'}
                    _light={{ color: 'coolGray.500' }}
                    _dark={{ color: 'coolGray.400' }}
                    size="5"
                  />
                  <Text
                    _light={{ color: 'coolGray.800' }}
                    _dark={{ color: 'coolGray.50' }}
                    fontSize="md"
                    fontWeight="medium"
                  >
                    Add another account
                  </Text>
                </HStack>
              </Pressable>
              <Pressable
                _light={{
                  _pressed: {
                    bg: 'coolGray.200',
                  },
                }}
                _dark={{
                  _pressed: {
                    bg: 'coolGray.700',
                  },
                }}
                py="3"
                onPress={() => {
                  setDropdownTab(!dropdownTab);
                }}
                px="1"
              >
                <HStack justifyContent="space-between" space="4">
                  <HStack space="4" alignItems="center">
                    <Icon
                      as={MaterialIcons}
                      name={'switch-account'}
                      _light={{ color: 'coolGray.500' }}
                      _dark={{ color: 'coolGray.400' }}
                      size="5"
                    />
                    <Text
                      _light={{ color: 'coolGray.800' }}
                      _dark={{ color: 'coolGray.50' }}
                      fontSize="md"
                      fontWeight="medium"
                    >
                      Switch Accounts
                    </Text>
                  </HStack>
                  {!dropdownTab ? (
                    <Icon as={MaterialIcons} name={'keyboard-arrow-up'} size={4} />
                  ) : (
                    <Icon
                      as={MaterialIcons}
                      name={'keyboard-arrow-down'}
                      size={4}
                    />
                  )}
                </HStack>
              </Pressable>
              {dropdownTab ? <Dropdown /> : null}
            </Box>
          </Box>
          <Modal
            message="Are you sure that you want to logout from account? All your
       unsaved data will be lost."
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </DashboardLayout>
      </Background>
    </NativeBaseProvider>
  );
}
