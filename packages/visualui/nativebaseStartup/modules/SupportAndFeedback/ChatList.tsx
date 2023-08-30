import React from 'react';
import {
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Center,
  Pressable,
  Input,
  Divider,
  Hidden,
  ScrollView,
  Menu,
  Box,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';

type ChatItemType = {
  name: string;
  imageUri: ImageSourcePropType;
  isLastMessagePhoto: boolean;
  text: string;
  isUnread: boolean;
  unread: number;
  time: string;
  isLastMessageRead?: boolean;
};
const chatItemsList: ChatItemType[] = [
  {
    name: 'John Legend',
    imageUri: require('../../assets/brandy.png'),
    isLastMessagePhoto: false,
    text: 'Good Morning',
    isUnread: true,
    unread: 2,
    time: '11:00 AM',
    isLastMessageRead: false,
  },
  {
    name: 'Marsh',
    imageUri: require('./images/Chat2.png'),
    isLastMessagePhoto: false,
    text: 'Emily: Good Morning',
    isUnread: true,
    unread: 2,
    time: '11:00 AM',
    isLastMessageRead: false,
  },
  {
    name: 'Lad',
    imageUri: require('./images/Chat3.png'),
    isLastMessagePhoto: false,
    text: 'Good Morning ❤️',
    isUnread: true,
    unread: 2,
    time: '11:00 AM',
    isLastMessageRead: false,
  },
  {
    name: 'Rita',
    imageUri: require('./images/Chat4.png'),
    isLastMessagePhoto: false,
    text: 'Good Morning every one ',
    isUnread: true,
    unread: 2,
    time: '11:00 AM',
    isLastMessageRead: false,
  },
  {
    name: 'CrazyK',
    imageUri: require('./images/Chat5.png'),
    isLastMessagePhoto: false,
    text: 'Good Morning every one ',
    isUnread: false,
    unread: 2,
    time: 'Yesterday',
    isLastMessageRead: true,
  },
  {
    name: 'Riya',
    imageUri: require('./images/Chat6.png'),
    isLastMessagePhoto: false,
    text: 'Hey Riya, let’s catch upthis weekend?',
    isUnread: false,
    unread: 2,
    time: 'Sunday',
    isLastMessageRead: true,
  },
  {
    name: 'Sunny',
    imageUri: require('./images/Chat7.png'),
    isLastMessagePhoto: false,
    text: 'Good Morning',
    isUnread: false,
    unread: 7,
    time: 'Sunday',
    isLastMessageRead: true,
  },
  {
    name: 'Sunny',
    imageUri: require('./images/Chat8.png'),
    isLastMessagePhoto: false,
    text: 'Good Morning every one 😇 ',
    isUnread: false,
    unread: 1,
    time: 'Sunday',
    isLastMessageRead: true,
  },
  {
    name: 'Sunny',
    imageUri: require('./images/Chat9.png'),
    isLastMessagePhoto: true,
    text: 'Good Morning',
    isUnread: false,
    unread: 1,
    time: 'Sunday',
    isLastMessageRead: true,
  },
];
function ChatItem({
  imageUri,
  name,
  isLastMessagePhoto,
  isUnread,
  isLastMessageRead,
  text,
  time,
  unread,
}: ChatItemType) {
  return (
    <Pressable>
      <HStack w="100%" space={2} alignItems="center">
        <Avatar source={imageUri} height={10} width={10}>
          JD
        </Avatar>
        <VStack flex={1} space={0.5}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            {name}
          </Text>
          <HStack alignItems="center" space={1}>
            {isLastMessagePhoto ? (
              <Icon
                size={4}
                _light={{ color: 'coolGray.500' }}
                as={MaterialIcons}
                name={'photo-size-select-actual'}
              />
            ) : (
              isLastMessageRead && (
                <Icon
                  size={6}
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                  as={MaterialIcons}
                  name={'done-all'}
                />
              )
            )}
            <Text
              fontSize="sm"
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
              isTruncated
            >
              {isLastMessagePhoto ? 'Photo' : text.substring(0, 40)}
            </Text>
          </HStack>
        </VStack>
        <VStack space={2} alignItems="flex-end">
          <Text
            fontSize="xs"
            fontWeight="medium"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            mb={isUnread ? 0 : 2.5}
          >
            {time}
          </Text>
          {isUnread && (
            <Center
              mt={isUnread ? 0 : 1}
              width={5}
              height={5}
              rounded="full"
              _light={{ bg: 'primary.900' }}
              _dark={{ bg: 'primary.500' }}
            >
              <Text fontSize="xs" color="white">
                {unread}
              </Text>
            </Center>
          )}
        </VStack>
      </HStack>
    </Pressable>
  );
}

export default function () {
  function SearchBarWeb() {
    return (
      <HStack justifyContent="space-between" alignItems="center" space={4}>
        <Input
          flex={1}
          py={3}
          _stack={{
            px: 3,
          }}
          _light={{
            bg: 'white',
            borderColor: 'coolGray.300',
            color: 'coolGray.400',
            placeholderTextColor: 'coolGray.400',
          }}
          _dark={{
            bg: 'coolGray.700',
            borderColor: 'coolGray.500',
            color: 'coolGray.400',
          }}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name="keyboard-backspace" />}
              size="6"
              color="coolGray.400"
            />
          }
          InputRightElement={
            <Icon
              as={<MaterialIcons name="close" />}
              size={6}
              color="coolGray.400"
            />
          }
          placeholder="Search here"
          fontWeight="medium"
          fontSize="md"
        />
        <Menu
          w="150"
          defaultIsOpen={false}
          trigger={(triggerProps) => {
            return (
              <Pressable
                accessibilityLabel="More options menu"
                p={2}
                {...triggerProps}
              >
                <Icon
                  size={6}
                  color="coolGray.400"
                  as={MaterialIcons}
                  name="more-vert"
                />
              </Pressable>
            );
          }}
          placement="bottom right"
        >
          <Menu.Item>New group</Menu.Item>
          <Menu.Item>New broadcast</Menu.Item>
          <Menu.Item>Linked device</Menu.Item>
          <Menu.Item>Starred messages</Menu.Item>
          <Menu.Item>Settings</Menu.Item>
        </Menu>
      </HStack>
    );
  }
  return (
    <DashboardLayout
      title="Chats"
      displaySidebar={false}
      rightPanelMobileHeader
      displayMenuButton
      displayNotificationButton
    >
      <ScrollView bounces={false}>
        <Box
          p={{ base: 4, md: 8 }}
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
          rounded={{ md: 'sm' }}
          flex={1}
        >
          <Hidden till="md">
            <SearchBarWeb />
          </Hidden>
          <VStack mt={{ base: 1, md: 8 }} space={3} divider={<Divider />}>
            {chatItemsList.map((item, index) => {
              return <ChatItem {...item} key={'chatItem' + index} />;
            })}
          </VStack>
        </Box>
      </ScrollView>
    </DashboardLayout>
  );
}
