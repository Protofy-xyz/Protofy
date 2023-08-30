import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Image,
  ScrollView,
  Switch,
  Pressable,
  Center,
  Badge,
  Divider,
  Hidden,
  IIconProps,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import Modal from '../../components/Modal';

type User = {
  image: ImageSourcePropType;
  name: string;
  status: string;
  role: string;
};

const userList: User[] = [
  {
    image: require('./images/member2.png'),
    name: 'Varsha',
    status: 'Happy Days',
    role: 'Admin',
  },
  {
    image: require('./images/member3.png'),
    name: 'Apritha',
    status: 'DND',
    role: 'Admin',
  },
  {
    image: require('./images/member1.png'),
    name: 'Suresh',
    status: 'Typing..',
    role: 'Admin',
  },
];

const UserCard = ({
  user,
  handleRemoveUser,
}: {
  user: User;
  handleRemoveUser: (name: string) => void;
}) => {
  return (
    <Pressable w="100%" px={4} key={user.name}>
      <HStack alignItems="center" space={2}>
        <Avatar source={user.image} size="10" />
        <VStack space={1}>
          <Text
            fontWeight="medium"
            fontSize="sm"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            lineHeight="21"
          >
            {user.name}
          </Text>
          <Text
            fontSize="sm"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            lineHeight="21"
          >
            {user.status}
          </Text>
        </VStack>
        <Pressable onPress={() => handleRemoveUser(user.name)} ml="auto">
          <Text _light={{ color: 'red.700' }} _dark={{ color: 'red.500' }}>
            Remove User
          </Text>
        </Pressable>
        {user.role && (
          <Badge
            variant="outline"
            px={2}
            py={0.5}
            borderRadius="4"
            _text={{
              fontSize: 'xs',
              lineHeight: '18',
            }}
            _light={{
              _text: {
                color: 'primary.900',
              },
              borderColor: 'primary.900',
            }}
            _dark={{
              _text: {
                color: 'primary.500',
                fontSize: 'xs',
              },
              borderColor: 'primary.500',
              bg: 'coolGray.800',
            }}
          >
            {user.role}
          </Badge>
        )}
      </HStack>
    </Pressable>
  );
};

function GroupHeader() {
  return (
    <Box>
      <Hidden from="md">
        <Image
          w="100%"
          h="196"
          source={require('./images/group-mobile.png')}
          alt="group-mobile-banner"
        />
      </Hidden>
      <Hidden till="md">
        <Image
          w="100%"
          h="196"
          source={require('./images/group.png')}
          alt="group-web-banner"
        />
      </Hidden>
      <HStack
        py="3"
        px="6"
        justifyContent="space-between"
        alignItems="center"
        _dark={{
          bg: 'coolGray.600',
        }}
        _light={{
          bg: 'primary.900',
        }}
      >
        <Box>
          <Text
            color="coolGray.50"
            fontWeight="medium"
            fontSize="sm"
            lineHeight="21"
            mb="1"
          >
            Party Time
          </Text>
          <Text
            fontSize="xs"
            color="coolGray.50"
            fontWeight="medium"
            lineHeight="18"
          >
            Created by Sunny
          </Text>
        </Box>
        <Pressable>
          <Icon as={MaterialIcons} name="create" color="coolGray.50" size={6} />
        </Pressable>
      </HStack>
    </Box>
  );
}

function GroupActionItem({
  actionTitle,
  as,
  iconName,
}: {
  actionTitle: string;
  as: IIconProps;
  iconName: string;
}) {
  return (
    <Pressable px="4">
      <HStack alignItems="center" space={4}>
        <Box
          rounded="full"
          p={2}
          _light={{ bg: 'primary.900' }}
          _dark={{ bg: 'primary.500' }}
        >
          <Icon as={as} name={iconName} color="coolGray.50" size={4} />
        </Box>
        <Text
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          fontSize="md"
          lineHeight="24"
        >
          {actionTitle}
        </Text>
      </HStack>
    </Pressable>
  );
}

function GroupActionList() {
  return (
    <>
      <VStack
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        space="3"
        mt="2"
        py="3"
        divider={<Divider />}
      >
        <HStack px="4" justifyContent="space-between" alignItems="center">
          <Text
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            fontSize="md"
            lineHeight="24"
          >
            Mute Notifications
          </Text>

          <Switch
            offTrackColor="coolGray.200"
            onTrackColor="primary.500"
            onThumbColor="white"
            offThumbColor="white"
          />
        </HStack>
        <GroupActionItem
          actionTitle="Add Participants"
          as={MaterialIcons}
          iconName="person-add-alt"
        />
        <GroupActionItem
          actionTitle="Invite via link"
          as={MaterialIcons}
          iconName="insert-link"
        />
      </VStack>
      <Divider />
    </>
  );
}

function GroupMembers() {
  const [modalVisible, setModalVisible] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState(userList[0].name);
  const handleRemoveUser = (username: string) => {
    setSelectedUser(username);
    setModalVisible(true);
  };
  const groupSettingsData = [
    {
      name: 'Exit Group',
      icon: { name: 'exit-to-app', type: MaterialIcons },
    },
    {
      name: 'Report Group',
      icon: { name: 'thumb-down', type: MaterialIcons },
    },
  ];

  return (
    <Box>
      <Text
        _light={{ color: 'primary.900' }}
        _dark={{ color: 'primary.500' }}
        py="3"
        px="4"
        fontSize="sm"
        fontWeight="medium"
        lineHeight="21"
      >
        {userList.length} Participants
      </Text>
      <VStack space={4} pb="4" divider={<Divider />}>
        {userList.map((data, index) => (
          <UserCard
            key={index}
            user={data}
            handleRemoveUser={handleRemoveUser}
          />
        ))}

        {groupSettingsData.map((item, index) => (
          <Pressable px={4} key={item.name + index}>
            <HStack alignItems="center" space={4}>
              <Center
                _light={{ bg: 'red.700' }}
                _dark={{ bg: 'red.500' }}
                p={2}
                rounded="full"
              >
                <Icon
                  as={item.icon.type}
                  name={item.icon.name}
                  color="coolGray.50"
                  size={4}
                />
              </Center>

              <Text
                fontSize="md"
                _light={{ color: 'red.700' }}
                _dark={{ color: 'red.500' }}
              >
                {item.name}
              </Text>
            </HStack>
          </Pressable>
        ))}
      </VStack>
      <Divider />
      <Modal
        message={`Are you sure want to remove ${selectedUser}  from the “Lè Famalia” group?`}
        modalVisible={modalVisible}
        setModalVisible={() => setModalVisible(!modalVisible)}
      />
    </Box>
  );
}
function MainContent() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <Box rounded={{ md: 'sm' }} flex={1} pb="8">
        <GroupHeader />
        <GroupActionList />
        <GroupMembers />
      </Box>
    </ScrollView>
  );
}
export default function GroupChatEdit() {
  return (
    <DashboardLayout title={'Group'} showGroupInfoHeader displaySidebar={false}>
      <MainContent />
    </DashboardLayout>
  );
}
