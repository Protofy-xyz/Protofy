import React, { useEffect, useState } from 'react';
import {
  Text,
  VStack,
  Image,
  Button,
  HStack,
  Pressable,
  Icon,
  Box,
  FlatList,
  Input,
  Fab,
  Hidden,
} from 'native-base';
import {
  ImageSourcePropType,
  Platform,
  useWindowDimensions,
} from 'react-native';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';
import WebMap from './WebMap';

type ImageList = {
  storyImageUrl: ImageSourcePropType;
};

type Information = {
  iconName: string;
  iconText: string;
};

type InformationList = {
  Overview: Information[];
  About: Information[];
  Reviews: Information[];
  Photos: Information[];
};

type Icon = {
  iconName: string;
};

const footerIcons: Icon[] = [
  { iconName: 'directions-car' },
  { iconName: 'directions-bike' },
  { iconName: 'directions-run' },
];

const information: InformationList = {
  Overview: [
    {
      iconName: 'location-on',
      iconText:
        '17/R, 1st floor, 18th Cross, 18th Main, Sector 3, HSR Layout, Bangalore, Karnataka 560102',
    },
    {
      iconName: 'watch-later',
      iconText: 'Open 24 hours',
    },
    {
      iconName: 'public',
      iconText: 'http://www.bookingkhazana.com',
    },
    {
      iconName: 'call',
      iconText: '080-2349854281',
    },
  ],
  About: [
    {
      iconName: 'watch-later',
      iconText: 'Open 24 hours',
    },
    {
      iconName: 'location-on',
      iconText:
        '17/R, 1st floor, 18th Cross, 18th Main, Sector 3, HSR Layout, Bangalore, Karnataka 560102',
    },
    {
      iconName: 'watch-later',
      iconText: 'Open 24 hours',
    },
    {
      iconName: 'public',
      iconText: 'http://www.bookingkhazana.com',
    },
  ],
  Reviews: [
    {
      iconName: 'watch-later',
      iconText: 'Open 24 hours',
    },
    {
      iconName: 'watch-later',
      iconText: 'Open 24 hours',
    },
    {
      iconName: 'watch-later',
      iconText: 'Open 24 hours',
    },
    {
      iconName: 'public',
      iconText: 'http://www.bookingkhazana.com',
    },
  ],
  Photos: [
    {
      iconName: 'watch-later',
      iconText: 'Open 24 hours',
    },
    {
      iconName: 'public',
      iconText: 'http://www.bookingkhazana.com',
    },
    {
      iconName: 'call',
      iconText: '080-2349854281',
    },
    {
      iconName: 'call',
      iconText: '080-2349854281',
    },
  ],
};

const imageList: ImageList[] = [
  {
    storyImageUrl: require('../images/hotel3.png'),
  },
  {
    storyImageUrl: require('../images/hotel2.png'),
  },
  {
    storyImageUrl: require('../images/hotel1.png'),
  },
  {
    storyImageUrl: require('../images/hotel1.png'),
  },
];

const tabs = [
  {
    id: 1,
    title: 'Overview',
  },
  {
    id: 2,
    title: 'About',
  },
  {
    id: 3,
    title: 'Reviews',
  },
  {
    id: 4,
    title: 'Photos',
  },
];

function HotelInformation() {
  const [selected, setSelected] = useState('directions-car');

  return (
    <>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        px={{ base: 4, lg: 8 }}
      >
        <HStack alignItems="center" space="3">
          <Image
            source={require('../images/Hotel.png')}
            alt="Alternate Text"
            height={20}
            width={20}
            borderRadius="sm"
          />
          <VStack space={2}>
            <Text
              fontSize="md"
              fontWeight="bold"
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
            >
              Taj Hotel
            </Text>
            <HStack alignItems="center" space="1">
              <Icon size="4" name="star" as={MaterialIcons} color="amber.400" />
              <Text
                fontSize="sm"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                4.9
              </Text>
              <Text
                fontSize="sm"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
              >
                (129)
              </Text>
            </HStack>
            <HStack alignItems="center" space="1">
              <Text
                fontSize="sm"
                fontWeight="medium"
                _light={{ color: 'primary.900' }}
                _dark={{ color: 'primary.500' }}
              >
                15 min
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
              >
                (1.3 Kms)
              </Text>
            </HStack>
          </VStack>
        </HStack>
        <HStack alignItems="center">
          <VStack space={5}>
            <HStack alignItems="center" space="3">
              {footerIcons.map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    _light={{
                      bg:
                        selected === item.iconName
                          ? 'primary.900'
                          : 'primary.50',
                    }}
                    _dark={{
                      bg:
                        selected === item.iconName
                          ? 'primary.700'
                          : 'coolGray.700',
                    }}
                    rounded="full"
                    p={1.5}
                    onPress={() => {
                      setSelected(item.iconName);
                    }}
                  >
                    <Icon
                      as={MaterialIcons}
                      name={item.iconName}
                      size={5}
                      _light={{
                        color:
                          selected === item.iconName
                            ? 'coolGray.50'
                            : 'primary.900',
                      }}
                      _dark={{
                        color: 'coolGray.50',
                      }}
                    />
                  </Pressable>
                );
              })}
            </HStack>
            <Button
              variant="solid"
              size="xs"
              onPress={() => {
                console.log('Navigation started...');
              }}
            >
              START
            </Button>
          </VStack>
        </HStack>
      </HStack>
    </>
  );
}

function HotelImageSlider() {
  return (
    <HStack mt={6} mb={3} px={{ base: 2.5, lg: 6.5 }}>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={imageList}
        keyExtractor={(_, index) => 'key' + index}
        renderItem={({ item }) => (
          <Image
            alt="Image"
            width="152"
            height="152"
            rounded="lg"
            source={item.storyImageUrl}
            mx={1.5}
          />
        )}
      />
    </HStack>
  );
}

function InformationTab({ currentTab }: { currentTab: Information[] }) {
  return (
    <Box py={3}>
      {currentTab.map((item, index: number) => {
        return (
          <HStack alignItems="center" py={3} px={4} space={3} key={index}>
            <Icon
              as={MaterialIcons}
              name={item.iconName}
              size={5}
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'primary.500' }}
            />
            <Text
              fontSize="xs"
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
            >
              {item.iconText}
            </Text>
          </HStack>
        );
      })}
    </Box>
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
    <Pressable onPress={() => handleTabChange(tabName)} pt="2">
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
          borderTopRadius="sm"
          _light={{
            bg: 'primary.900',
          }}
          _dark={{
            bg: 'primary.500',
          }}
          h="1"
        />
      )}
    </Pressable>
  );
}

function Overview() {
  const [tabName, setTabName] = React.useState('Overview');
  const [info, setInfo] = React.useState<Information[]>(information.Overview);
  useEffect(() => {
    switch (tabName) {
      case 'About':
        setInfo(information.About);
        return;
      case 'Overview':
        setInfo(information.Overview);
        return;
      case 'Photos':
        setInfo(information.Photos);
        return;
      case 'Reviews':
        setInfo(information.Reviews);
        return;
    }
  }, [tabName]);
  return (
    <Box _dark={{ bg: 'coolGray.800' }} px={4}>
      <HStack justifyContent="space-between" px={{ md: '4' }}>
        {tabs.map(({ id, title }) => (
          <TabItem
            key={id}
            tabName={title}
            currentTab={tabName}
            handleTabChange={(tab) => setTabName(tab)}
          />
        ))}
      </HStack>
      <InformationTab currentTab={info} />
    </Box>
  );
}

export default function StoreLocatorTwo() {
  const [textInput, setTextInput] = useState('');
  const { width: windowWidth } = useWindowDimensions();

  return (
    <DashboardLayout
      title="Location"
      displaySidebar={false}
      maxWidth={windowWidth - 64}
      displayScreenTitle={false}
      displaySearchButton={true}
    >
      <HStack flex={1}>
        <VStack
          pt={{ base: 5, md: 8 }}
          borderRadius={{ md: 'sm' }}
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
          maxW={{ md: '422', xl: '622' }}
          flex={1}
        >
          <Hidden till="md">
            <Input
              py="4"
              mx="8"
              mb="6"
              px={0}
              _dark={{
                borderColor: 'coolGray.700',
              }}
              value={textInput}
              onChangeText={setTextInput}
              InputLeftElement={
                <Icon
                  ml={3}
                  mr={2}
                  as={<MaterialIcons name="gps-fixed" />}
                  size="6"
                  color="coolGray.400"
                />
              }
              placeholder="Your location"
              fontSize="md"
              fontWeight="medium"
            />
          </Hidden>
          <HotelInformation />
          <HotelImageSlider />
          <Overview />
        </VStack>
        <Hidden till="md">
          <>
            {Platform.OS === 'web' && <WebMap />}
            <Fab
              icon={
                <Icon
                  color="white"
                  as={<MaterialIcons name="gps-fixed" />}
                  size={6}
                />
              }
              rounded="full"
              position="fixed"
              right={12}
              bottom={12}
            />
          </>
        </Hidden>
      </HStack>
    </DashboardLayout>
  );
}
