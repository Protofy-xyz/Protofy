import React, { useEffect } from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Image,
  Center,
  FlatList,
  useBreakpointValue,
  Pressable,
  useColorModeValue,
} from 'native-base';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';

type VideoType = {
  imageUri: ImageSourcePropType;
  title: string;
};

type Stat = {
  talkNumber: string;
  text: string;
};

type VideoTabItemType = {
  Video: VideoType[];
  Documents: VideoType[];
  About: VideoType[];
};

const videoList: VideoTabItemType = {
  Video: [
    {
      imageUri: require('./images/TutorProfile6.png'),
      title: 'Science and Evolution',
    },
    {
      imageUri: require('./images/TutorProfile5.png'),
      title: 'Fitness',
    },
    {
      imageUri: require('./images/TutorProfile7.png'),
      title: 'Web Design',
    },
    {
      imageUri: require('./images/TutorProfile4.png'),
      title: 'Gaming',
    },
    {
      imageUri: require('./images/TutorProfile3.png'),
      title: 'Social',
    },
    {
      imageUri: require('./images/TutorProfile2.png'),
      title: 'Politics',
    },
    {
      imageUri: require('./images/TutorProfile1.png'),
      title: 'Technology',
    },
    {
      imageUri: require('./images/TutorProfile8.png'),
      title: 'Medicine',
    },
    {
      imageUri: require('./images/TutorProfile3.png'),
      title: 'Web Design',
    },
    {
      imageUri: require('./images/TutorProfile5.png'),
      title: 'Fitness',
    },
    {
      imageUri: require('./images/TutorProfile6.png'),
      title: 'Science and Evolution',
    },
    {
      imageUri: require('./images/TutorProfile1.png'),
      title: 'Technology',
    },
  ],
  Documents: [
    {
      imageUri: require('./images/TutorProfile3.png'),
      title: 'Social',
    },
    {
      imageUri: require('./images/TutorProfile2.png'),
      title: 'Politics',
    },
    {
      imageUri: require('./images/TutorProfile6.png'),
      title: 'Science and Evolution',
    },
    {
      imageUri: require('./images/TutorProfile5.png'),
      title: 'Fitness',
    },
    {
      imageUri: require('./images/TutorProfile7.png'),
      title: 'Web Design',
    },
    {
      imageUri: require('./images/TutorProfile4.png'),
      title: 'Gaming',
    },
    {
      imageUri: require('./images/TutorProfile1.png'),
      title: 'Technology',
    },
    {
      imageUri: require('./images/TutorProfile8.png'),
      title: 'Medicine',
    },
    {
      imageUri: require('./images/TutorProfile3.png'),
      title: 'Web Design',
    },
    {
      imageUri: require('./images/TutorProfile5.png'),
      title: 'Fitness',
    },
    {
      imageUri: require('./images/TutorProfile6.png'),
      title: 'Science and Evolution',
    },
    {
      imageUri: require('./images/TutorProfile1.png'),
      title: 'Technology',
    },
  ],
  About: [
    {
      imageUri: require('./images/TutorProfile4.png'),
      title: 'Gaming',
    },
    {
      imageUri: require('./images/TutorProfile3.png'),
      title: 'Social',
    },
    {
      imageUri: require('./images/TutorProfile2.png'),
      title: 'Politics',
    },
    {
      imageUri: require('./images/TutorProfile1.png'),
      title: 'Technology',
    },
    {
      imageUri: require('./images/TutorProfile8.png'),
      title: 'Medicine',
    },
    {
      imageUri: require('./images/TutorProfile3.png'),
      title: 'Web Design',
    },
    {
      imageUri: require('./images/TutorProfile5.png'),
      title: 'Fitness',
    },
    {
      imageUri: require('./images/TutorProfile6.png'),
      title: 'Science and Evolution',
    },
    {
      imageUri: require('./images/TutorProfile1.png'),
      title: 'Technology',
    },
  ],
};

const tabs = [
  {
    id: 1,
    title: 'Videos',
  },
  {
    id: 2,
    title: 'Documents',
  },
  {
    id: 3,
    title: 'About',
  },
];

const stats: Stat[] = [
  {
    talkNumber: '46',
    text: 'Talks',
  },
  {
    talkNumber: '46K',
    text: 'Followers',
  },
  {
    talkNumber: '20M',
    text: 'Watch Min',
  },
];

function Card(props: VideoType) {
  return (
    <Pressable
      rounded="lg"
      mt={4}
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: 'coolGray.700' }}
      width={{ base: '45%', lg: '30%', xl: '24%' }}
    >
      <Image
        width={{ base: '100%', md: '180' }}
        height={32}
        rounded={4}
        source={props.imageUri}
        alt="alternate text"
        key={`${props.title}-${Math.random()}`}
      />
      <VStack
        height={40}
        width="100%"
        position="absolute"
        alignItems="center"
        justifyContent="center"
      >
        <Center
          _light={{ bg: 'coolGray.50' }}
          _dark={{ bg: 'coolGray.700' }}
          p="1"
          rounded="full"
        >
          <Icon
            as={MaterialIcons}
            name="play-arrow"
            _light={{ color: 'primary.900' }}
            _dark={{ color: 'primary.500' }}
            size={7}
          />
        </Center>
      </VStack>
      <Text
        fontSize="xs"
        fontWeight="medium"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        px={3}
        py={3}
      >
        {props.title}
      </Text>
    </Pressable>
  );
}

function TabItem({
  tabName,
  currentTab,
  handleTabChange,
}: {
  tabName: string;
  currentTab: string;
  handleTabChange: (tabTitle: string) => void;
}) {
  return (
    <Pressable onPress={() => handleTabChange(tabName)} px="4" pt="2">
      <VStack>
        <Text
          fontSize="sm"
          fontWeight="medium"
          letterSpacing="0.4"
          _light={{
            color: tabName === currentTab ? 'primary.900' : 'coolGray.500',
          }}
          _dark={{
            color: tabName === currentTab ? 'primary.500' : 'coolGray.400',
          }}
          px={4}
          py={2}
        >
          {tabName}
        </Text>
        {tabName === currentTab && (
          <Box
            borderTopLeftRadius="sm"
            borderTopRightRadius="sm"
            _light={{
              bg: 'primary.900',
            }}
            _dark={{
              bg: 'primary.500',
            }}
            h="1"
          />
        )}
      </VStack>
    </Pressable>
  );
}

const UserProfile = () => {
  return (
    <>
      <Avatar size="lg" source={require('./images/TutorProfile9.png')}>
        <Avatar.Badge bg="emerald.600" />
      </Avatar>
      <Text
        mt="2"
        fontSize="md"
        fontWeight="bold"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Cristinan John
      </Text>
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.400' }}
      >
        Canada
      </Text>
      <Text
        mt={3}
        fontSize="sm"
        textAlign="center"
        // px={{ base: 6, md: 6, lg: 48 }}
        px={{ base: 6, md: 0 }}
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        maxWidth="400"
      >
        A user profile is a collection of settings and info with a user. It
        contains critical information that is used identify an individual.
      </Text>
    </>
  );
};

const StatsComponent = () => {
  return (
    <HStack
      width={{ base: '60%', md: '50%' }}
      mt={{ base: 6, md: 10 }}
      mb={6}
      justifyContent="space-between"
    >
      {stats.map((item, index) => {
        return (
          <VStack alignItems="center" key={index}>
            <Text
              fontSize="lg"
              fontWeight="medium"
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
            >
              {item.talkNumber}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="medium"
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.300' }}
            >
              {item.text}
            </Text>
          </VStack>
        );
      })}
    </HStack>
  );
};

export default function TutorProfile() {
  const [tabName, setTabName] = React.useState('Videos');
  const [videos, setVideos] = React.useState<VideoType[]>(videoList.Video);

  useEffect(() => {
    switch (tabName) {
      case 'Video':
        setVideos(videoList.Video);
        return;
      case 'Documents':
        setVideos(videoList.Documents);
        return;
      case 'About':
        setVideos(videoList.About);
        return;
    }
  }, [tabName]);

  const noColumn = useBreakpointValue({
    base: 2,
    lg: 3,
    xl: 4,
  });
  const noColumnStyle = useBreakpointValue({
    base: 'space-evenly',
    md: 'space-between',
    lg: 'space-between',
  });

  return (
    <DashboardLayout title="Tutor Profile">
      <FlatList
        ListHeaderComponent={
          <VStack
            pt={{ base: 4, md: 10 }}
            rounded={{ md: 'sm' }}
            _light={{ bg: 'white' }}
            _dark={{ bg: 'coolGray.800' }}
            alignItems="center"
            safeAreaBottom
          >
            <UserProfile />
            <StatsComponent />
            <VStack w="100%" mx={4}>
              <HStack
                _light={{
                  bg: 'coolGray.100',
                }}
                _dark={{
                  bg: 'coolGray.700',
                }}
                w="100%"
                justifyContent="space-between"
                borderRadius="sm"
              >
                {tabs.map(({ id, title }) => (
                  <TabItem
                    key={id}
                    tabName={title}
                    currentTab={tabName}
                    handleTabChange={(tab) => setTabName(tab)}
                  />
                ))}
              </HStack>
            </VStack>
          </VStack>
        }
        numColumns={noColumn}
        columnWrapperStyle={{ justifyContent: noColumnStyle }}
        data={videos}
        renderItem={({ item }) => <Card {...item} />}
        key={noColumn}
        keyExtractor={(item, index) => 'key' + index}
        _contentContainerStyle={{
          width: '100%',
          alignSelf: 'center',
          bg: useColorModeValue('white', 'coolGray.800'),
          px: { base: 0, md: 6, lg: 140 },
          pb: 7,
        }}
        bounces={false}
      />
    </DashboardLayout>
  );
}
