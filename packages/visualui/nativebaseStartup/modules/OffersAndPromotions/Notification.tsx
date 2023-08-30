import React from 'react';
import {
  HStack,
  Text,
  VStack,
  Avatar,
  ScrollView,
  Image,
  Box,
  useColorModeValue,
} from 'native-base';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
type List = {
  imageUrl: ImageSourcePropType;
  name: string;
  reaction: string;
  time: string;
  secondImageUrl: ImageSourcePropType;
};

const list: List[] = [
  {
    imageUrl: require('./images/offer11.png'),
    name: 'John',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/Promotion13.png'),
  },
  {
    imageUrl: require('./images/offer7.png'),
    name: 'Priya',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/Promotion6.png'),
  },
  {
    imageUrl: require('./images/offer8.png'),
    name: 'Doe.J',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/Promotion11.png'),
  },
  {
    imageUrl: require('./images/offer4.png'),
    name: 'Doe.H',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/Promotion10.png'),
  },
  {
    imageUrl: require('./images/offer1.png'),
    name: 'John D',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/Promotion4.png'),
  },
  {
    imageUrl: require('./images/offer5.png'),
    name: 'John Doe',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/Promotion8.png'),
  },
  {
    imageUrl: require('./images/offer10.png'),
    name: 'lege Doe',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/Promotion11.png'),
  },
  {
    imageUrl: require('./images/offer4.png'),
    name: 'Doe.H',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/Promotion9.png'),
  },
  {
    imageUrl: require('./images/offer1.png'),
    name: 'John D',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/Promotion3.png'),
  },
  {
    imageUrl: require('./images/offer5.png'),
    name: 'John Doe',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/Promotion7.png'),
  },
  {
    imageUrl: require('./images/offer10.png'),
    name: 'lege Doe',
    reaction: 'reacted to your post.',
    time: '2w',
    secondImageUrl: require('./images/promotion12.png'),
  },
];

function ThisMonthNotification() {
  const textColor = useColorModeValue('coolGray.800', 'coolGray.50');
  return (
    <VStack space={5} mt={5}>
      {list.map((item, index) => {
        return (
          <HStack alignItems="center" key={index} space="2.5">
            <Avatar source={item.imageUrl} height={10} width={10} />
            <Text fontWeight="bold" color={textColor}>
              {item.name}
            </Text>
            <Text fontWeight="medium" color={textColor}>
              {item.reaction}
            </Text>
            <Text color={textColor} fontWeight="normal" textAlign="center">
              {item.time}
            </Text>
            <Image
              ml="auto"
              source={item.secondImageUrl}
              alt="Alternate Text"
              height={10}
              width={10}
            />
          </HStack>
        );
      })}
    </VStack>
  );
}
export default function () {
  return (
    <DashboardLayout
      title={' Notifications'}
      displaySidebar={false}
      rightPanelMobileHeader={false}
    >
      <ScrollView bounces={false}>
        <Box
          rounded={{ md: 'sm' }}
          py={{ base: 4, md: 8 }}
          px={{ base: 4, md: 8 }}
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
          flex={1}
        >
          <Text
            fontSize="md"
            fontWeight="medium"
            _dark={{ color: 'coolGray.50' }}
            _light={{ color: 'coolGray.800' }}
          >
            This month
          </Text>
          <ThisMonthNotification />
        </Box>
      </ScrollView>
    </DashboardLayout>
  );
}
