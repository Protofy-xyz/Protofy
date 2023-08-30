import React from 'react';
import {
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Pressable,
  Center,
  IconButton,
  Radio,
  Divider,
  Box,
} from 'native-base';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ImageSourcePropType } from 'react-native';
import Modal from '../../components/Modal';

type User = {
  id: string;
  avatar: ImageSourcePropType;
  name: string;
  email: string;
};
const users: User[] = [
  {
    id: '1',
    avatar: require('../../assets/person.png'),
    name: 'Jane Doe',
    email: 'janedoe2@mydomain.com',
  },
  {
    id: '2',
    avatar: require('../../assets/women.jpg'),
    name: 'Joey Tribbiani',
    email: 'joetribbiani@gmail.com',
  },
];

export default function DeleteAccount() {
  const [dropdownTab, setDropdownTab] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(true);

  return (
    <DashboardLayout title={'Manage Accounts'} displayScreenTitle={true}>
      <Box
        py={{ base: 5, md: 8 }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        rounded={{ md: 'sm' }}
      >
        <HStack px="5" alignItems="center" space="3">
          <Avatar
            source={require('../../assets/person.png')}
            width="10"
            height="10"
          />
          <VStack space="1">
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
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
            >
              janedoe2@mydomain.com
            </Text>
          </VStack>

          <IconButton
            p="0"
            variant="unstyled"
            icon={
              <Icon
                size="6"
                name="delete"
                as={MaterialCommunityIcons}
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
        <Divider mx="5" mt="6" mb="3" />
        <Box>
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
            px="5"
            onPress={() => {
              console.log('this onPress will add another account');
            }}
          >
            <HStack alignItems="center" space="3">
              <Icon
                as={Ionicons}
                name={'person-add'}
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
                size="6"
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
            px="5"
            onPress={() => {
              setDropdownTab(!dropdownTab);
            }}
          >
            <HStack justifyContent="space-between">
              <HStack space="4" alignItems="center">
                <Icon
                  as={MaterialCommunityIcons}
                  name={'account-box-multiple'}
                  _light={{ color: 'coolGray.500' }}
                  _dark={{ color: 'coolGray.400' }}
                  size="6"
                />
                <VStack>
                  <Text
                    _light={{ color: 'coolGray.800' }}
                    _dark={{ color: 'coolGray.50' }}
                    fontSize="md"
                    fontWeight="medium"
                  >
                    Switch Accounts
                  </Text>
                </VStack>
              </HStack>
              <Center>
                {!dropdownTab ? (
                  <Icon
                    as={MaterialCommunityIcons}
                    name={'chevron-up'}
                    size="25"
                  />
                ) : (
                  <Icon
                    as={MaterialCommunityIcons}
                    name={'chevron-down'}
                    size="25"
                  />
                )}
              </Center>
            </HStack>
          </Pressable>
          {dropdownTab ? <Dropdown /> : null}
        </Box>
      </Box>
      <Modal
        message="Are you sure you want to remove your account?"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </DashboardLayout>
  );
}

function Dropdown() {
  return (
    <Radio.Group defaultValue="1" name="MyRadioGroup" mt="5" px="5">
      <VStack divider={<Divider />} space="3" w="full">
        {users.map((user) => (
          <Radio
            _light={{
              _checked: {
                _icon: { color: 'primary.900' },
                borderColor: 'primary.900',
              },
            }}
            _dark={{
              _checked: {
                _icon: { color: 'primary.700' },
                borderColor: 'primary.700',
              },
            }}
            _stack={{
              direction: 'row-reverse',
              justifyContent: 'space-between',
            }}
            value={user.id}
          >
            <HStack
              space="3"
              alignItems="center"
              justifyContent="space-between"
            >
              <Avatar source={user.avatar} width="9" height="9" />
              <Box>
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
              </Box>
            </HStack>
          </Radio>
        ))}
      </VStack>
    </Radio.Group>
  );
}
