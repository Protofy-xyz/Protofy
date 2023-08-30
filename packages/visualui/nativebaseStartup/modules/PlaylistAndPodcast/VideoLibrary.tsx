import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  IconButton,
  useBreakpointValue,
  FlatList,
  Stack,
  Hidden,
  Link,
  Pressable,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType, useWindowDimensions } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const StackNavigator = createStackNavigator();

type VideoType = {
  imageUri: ImageSourcePropType;
  videoTitle: string;
  channel: string;
  views: string;
  timestamp: string;
  isVerified?: boolean;
};

type Icon = {
  name: string;
  text: string;
};

const footerIcons: Icon[] = [
  { name: 'home', text: 'Home' },
  { name: 'play-circle-filled', text: 'Explore' },
  { name: 'folder', text: 'Local' },
  { name: 'person', text: 'Profile' },
];

const list: VideoType[] = [
  {
    imageUri: require('./images/videolibrary1.png'),
    videoTitle: 'Body Lotion Lokal untuk Kulit Eczema!| Skincare 101',
    channel: 'Marvel Studios',
    views: '10M Views',
    timestamp: '2 years ago',
    isVerified: true,
  },
  {
    imageUri: require('./images/videolibrary2.png'),
    videoTitle: "What's Inside Poppy's Bag? | Inside Her Bag",
    channel: 'Marvel Studios',
    views: '10M Views',
    timestamp: '2 years ago',
  },
  {
    imageUri: require('./images/videolibrary3.png'),
    videoTitle: 'Skincare Wajib Tahun yang Bikin Glowing! | Skincare 101',
    channel: 'Ticktok Studios',
    views: '10M Views',
    timestamp: '2 years ago',
    isVerified: true,
  },
  {
    imageUri: require('./images/videolibrary4.png'),
    videoTitle: '5 Beauty Sponge Punya! | Skincare 101 | FD Insight',
    channel: 'Marvel Studios',
    views: '10M Views',
    timestamp: '2 years ago',
  },
  {
    imageUri: require('./images/videolibrary5.png'),
    videoTitle: 'Army of the Dead John | Cristine and Mark | Marvel studios',
    channel: 'Marvel Studios',
    views: '10M Views',
    timestamp: '2 years ago',
    isVerified: true,
  },
  {
    imageUri: require('./images/videolibrary6.png'),
    videoTitle: 'Army of the Dead John | Cristine and Maddy',
    channel: 'Marvel Studios',
    views: '10M Views',
    timestamp: '2 years ago',
    isVerified: true,
  },
  {
    imageUri: require('./images/videolibrary7.png'),
    videoTitle: 'Army of the Dead John | Cristine and Maddy',
    channel: 'Ticktok Studios',
    views: '10M Views',
    timestamp: '2 years ago',
    isVerified: true,
  },
  {
    imageUri: require('./images/videolibrary8.png'),
    videoTitle: 'Bad bad batteries',
    channel: 'Marvel Studios',
    views: '10M Views',
    timestamp: '2 years ago',
  },
  {
    imageUri: require('./images/videolibrary9.png'),
    videoTitle: 'The benefits of solar',
    channel: 'Marvel Studios',
    views: '10M Views',
    timestamp: '2 years ago',
  },
  {
    imageUri: require('./images/videolibrary10.png'),
    videoTitle: 'Stop hitting the planet',
    channel: 'Marvel Studios',
    views: '10M Views',
    timestamp: '2 years ago',
  },
  {
    imageUri: require('./images/videolibrary11.png'),
    videoTitle: 'Sustainable packaging trends ',
    channel: 'Marvel Studios',
    views: '10M Views',
    timestamp: '2 years ago',
  },
  {
    imageUri: require('./images/videolibrary12.png'),
    videoTitle: 'Buy earth friendly dog food',
    channel: 'Marvel Studios',
    views: '10M Views',
    timestamp: '2 years ago',
  },
];

function VideoCard({
  imageUri,
  videoTitle,
  views,
  timestamp,
  channel,
  isVerified,
}: VideoType) {
  return (
    <Link
      mb={{ base: '4', lg: '7' }}
      px={{ md: '14' }}
      href=""
      width={{ base: '100%', sm: '100%', md: '50%', lg: '33%', xl: '25%' }}
      minH={{ md: '234' }}
    >
      <Stack
        w="full"
        flexDirection={{ base: 'row', md: 'column' }}
        alignItems="flex-start"
      >
        <Box width={{ base: '40%', md: 'full' }} justifyContent="center">
          <Image
            w="100%"
            h={{ base: '142', md: '128' }}
            rounded="sm"
            source={imageUri}
            alt="Alternate Text"
          />
          <IconButton
            justifyContent="center"
            alignItems="center"
            alignSelf="center"
            rounded="full"
            position="absolute"
            variant="unstyled"
            _light={{ bg: 'coolGray.50:alpha.60' }}
            _dark={{ bg: 'coolGray.700:alpha.60' }}
            p="2"
            icon={
              <Icon
                as={MaterialIcons}
                name="play-arrow"
                _light={{ color: 'primary.900' }}
                _dark={{ color: 'primary.500' }}
                size="xs"
              />
            }
          />
        </Box>
        <VStack
          width={{ base: '60%', md: undefined }}
          p={{ base: 3, md: 0 }}
          mt={{ sm: '4', md: '3' }}
          space="1"
        >
          <Text
            fontSize="md"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            fontWeight="medium"
            alignItems="center"
            lineHeight="23"
            numberOfLines={2}
          >
            {videoTitle}
          </Text>

          <HStack alignItems="center" space={1} mt="1">
            <Text
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
              fontSize="sm"
              fontWeight="normal"
            >
              {channel}
            </Text>
            {isVerified && (
              <Icon
                as={MaterialIcons}
                name="check-circle"
                size="4"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
              />
            )}
          </HStack>
          <Text
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            fontWeight="normal"
            fontSize="sm"
            numberOfLines={1}
          >
            {views} | {timestamp}
          </Text>
        </VStack>
      </Stack>
    </Link>
  );
}

function Videos() {
  const { height } = useWindowDimensions();
  const noColumn = useBreakpointValue({
    base: 1,
    md: 2,
    lg: 3,
    xl: 4,
  });
  return (
    <Box
      _light={{
        bg: 'white',
      }}
      _dark={{
        bg: 'coolGray.800',
      }}
      borderRadius={{ md: 'sm' }}
      mb={{ base: '82', md: '0' }}
      pt={{ base: '4', md: '8' }}
      px={{ base: '4', md: 8 }}
    >
      <FlatList
        bounces={false}
        horizontal={false}
        numColumns={noColumn}
        data={list}
        renderItem={({ item }) => <VideoCard {...item} />}
        key={noColumn}
        keyExtractor={(item, index) => 'key' + index}
        showsVerticalScrollIndicator={false}
        _web={{ height: { base: height, md: '100%' } }}
      />
    </Box>
  );
}

function BottomNavigationItem({
  name,
  text,
  index,
  navigation,
}: Icon & { index: number; navigation: any }) {
  const route = useRoute();

  return (
    <Pressable
      px="18"
      py="2.5"
      alignItems="center"
      onPress={() => navigation.navigate(text)}
      key={index}
    >
      <Icon
        as={MaterialIcons}
        name={name}
        size="5"
        _light={{
          color: route.name === text ? 'primary.900' : 'coolGray.400',
        }}
        _dark={{
          color: route.name === text ? 'primary.500' : 'coolGray.400',
        }}
      />
      <Text
        _light={{
          color: route.name === text ? 'primary.900' : 'coolGray.400',
        }}
        _dark={{
          color: route.name === text ? 'primary.500' : 'coolGray.400',
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}

function MobileFooter({ navigation }: { navigation: any }) {
  return (
    <Hidden from="md">
      <HStack
        justifyContent="space-between"
        safeAreaBottom
        h="20"
        width="100%"
        position="absolute"
        left="0"
        right="0"
        bottom="0"
        overflow="hidden"
        alignSelf="center"
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: 'coolGray.800' }}
      >
        {footerIcons.map((item, index) => {
          return (
            <BottomNavigationItem
              key={index}
              index={index}
              navigation={navigation}
              {...item}
            />
          );
        })}
      </HStack>
    </Hidden>
  );
}

function VideoLibrary({ navigation }: { navigation: any }) {
  return (
    <>
      <DashboardLayout title="Video Library">
        <Videos />
      </DashboardLayout>
      <Hidden from="md">
        <MobileFooter navigation={navigation} />
      </Hidden>
    </>
  );
}

export default function MyTabs() {
  return (
    <NavigationContainer>
      <StackNavigator.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <StackNavigator.Screen name="Home" component={VideoLibrary} />
        <StackNavigator.Screen name="Explore" component={VideoLibrary} />
        <StackNavigator.Screen name="Local" component={VideoLibrary} />
        <StackNavigator.Screen name="Profile" component={VideoLibrary} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
