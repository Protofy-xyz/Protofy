import React, { useEffect, useState, useRef } from 'react';
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
  Button,
  HStack,
  VStack,
  Text,
  Icon,
  Input,
  Box,
  Center,
  Hidden,
  IconButton,
  Pressable,
  ScrollView,
  Divider,
  Image,
  View,
  Actionsheet,
  useDisclose,
} from 'native-base';
import IconCar from '../components/IconCar';
import IconClock from '../components/IconClock';
import IconCycle from '../components/IconCycle';
import IconEarth from '../components/IconEarth';
import IconMapmarker from '../components/IconMapmarker';
import IconPerson from '../components/IconPerson';
import IconPhone from '../components/IconPhone';
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants?.manifest?.extra?.GOOGLE_MAPS_API_KEY;
const MAP_SCRIPT_WITH_API_KEY = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;

type ImageList = {
  storyImageUrl: object;
};
type Information = {
  svg: object;
  iconText: string;
};
function HotelInformation() {
  return (
    <>
      <HStack
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        space={4}
      >
        <HStack alignItems="center" space={{ base: 3, md: 3 }}>
          <Image
            source={{
              uri: 'https://wallpaperaccess.com/full/317501.jpg',
            }}
            alt="Alternate Text"
            height={24}
            width={20}
            borderRadius="md"
          />
          <VStack space={2}>
            <Text
              fontSize="md"
              fontWeight="bold"
              _light={{ color: 'coolGray.900' }}
              _dark={{ color: 'coolGray.50' }}
            >
              Taj Hotel
            </Text>
            <HStack alignItems="center" space="1">
              <Icon size="4" name={'star'} as={AntDesign} color="amber.400" />
              <Text
                fontSize="md"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                4.6
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
              >
                (10,120)
              </Text>
            </HStack>
            <HStack alignItems="center" space="1">
              <Text
                fontSize="sm"
                fontWeight="medium"
                _light={{ color: '#AC1F1F' }}
                _dark={{ color: '#AC1F1F' }}
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
        <HStack alignItems="center" space={2}>
          <VStack space={{ base: 3, md: 3 }}>
            <HStack alignItems="center" space={{ base: 3 }}>
              <Pressable
                _light={{ bg: 'primary.900' }}
                _dark={{ bg: 'primary.700' }}
                rounded="full"
                p={2}
                onPress={() => {
                  console.log('hello');
                }}
              >
                <Center w={5} h={5}>
                  <IconCar />
                </Center>
              </Pressable>
              <Pressable
                _light={{ bg: 'coolGray.200' }}
                _dark={{ bg: 'coolGray.400' }}
                rounded="full"
                p={2}
                onPress={() => {
                  console.log('hello');
                }}
              >
                <Center w={5} h={5}>
                  <IconCycle />
                </Center>
              </Pressable>
              <Pressable
                _light={{ bg: 'coolGray.200' }}
                _dark={{ bg: 'coolGray.400' }}
                rounded="full"
                p={2}
                onPress={() => {
                  console.log('hello');
                }}
              >
                <Center w={5} h={5}>
                  <IconPerson />
                </Center>
              </Pressable>
            </HStack>
            <Button
              variant="unstyled"
              _light={{ bg: 'primary.900', _pressed: { bg: 'primary.700' } }}
              _dark={{ bg: 'primary.800', _pressed: { bg: 'primary.700' } }}
              onPress={() => {
                console.log('hello');
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
const imageList: ImageList[] = [
  {
    storyImageUrl: require('../../../assets/chair.jpeg'),
  },
  {
    storyImageUrl: require('../../../assets/lamp.jpeg'),
  },
  {
    storyImageUrl: require('../../../assets/table.jpg'),
  },
  {
    storyImageUrl: require('../../../assets/furniture.jpg'),
  },
];
function HotelImageSlider() {
  return (
    <ScrollView
      w="100%"
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      mt={{ base: 5, md: 0 }}
    >
      <HStack space={{ base: 2, md: 2 }}>
        {imageList.map((item, index) => {
          return (
            <Image
              key={index}
              source={item.storyImageUrl}
              alt="Alternate Text"
              height={40}
              width={40}
              borderRadius="md"
            />
          );
        })}
      </HStack>
    </ScrollView>
  );
}
const information: Information[] = [
  {
    svg: <IconMapmarker size="12" />,
    iconText:
      '17/R, 1st floor, 18th Cross, 18th Main, Sector 3, HSR Layout, Bangalore, Karnataka 560102',
  },
  {
    svg: <IconClock />,
    iconText: 'Open 24 hours',
  },
  {
    svg: <IconEarth />,
    iconText: 'http://www.bookingkhazana.com',
  },
  {
    svg: <IconPhone />,
    iconText: '080-2349854281',
  },
];
function InformationTab() {
  const [tabName, setTabName] = React.useState('Overview');

  return (
    <Box width={{ md: '100%', base: '100%' }}>
      <HStack mt="4" width="100%" justifyContent="space-between">
        <Pressable
          px="2"
          onPress={() => {
            setTabName('Overview');
          }}
          maxW="25%"
        >
          <Text
            fontSize="md"
            fontWeight="medium"
            _light={{
              color: tabName === 'Overview' ? 'primary.900' : 'coolGray.400',
            }}
            _dark={{
              color: tabName === 'Overview' ? 'coolGray.100' : 'coolGray.400',
            }}
          >
            Overview
          </Text>
        </Pressable>
        <Pressable
          px="2"
          onPress={() => {
            setTabName('About');
          }}
          maxW="25%"
        >
          <Text
            fontSize="md"
            fontWeight="medium"
            _light={{
              color: tabName === 'About' ? 'primary.900' : 'coolGray.400',
            }}
            _dark={{
              color: tabName === 'About' ? 'coolGray.100' : 'coolGray.400',
            }}
          >
            About
          </Text>
        </Pressable>
        <Pressable
          px="2"
          onPress={() => {
            setTabName('Reviews');
          }}
          maxW="25%"
        >
          <Text
            fontSize="md"
            fontWeight="medium"
            _light={{
              color: tabName === 'Reviews' ? 'primary.900' : 'coolGray.400',
            }}
            _dark={{
              color: tabName === 'Reviews' ? 'coolGray.100' : 'coolGray.400',
            }}
          >
            Reviews
          </Text>
        </Pressable>
        <Pressable
          px="2"
          onPress={() => {
            setTabName('Photos');
          }}
          maxW="25%"
        >
          <Text
            fontSize="md"
            fontWeight="medium"
            _light={{
              color: tabName === 'Photos' ? 'primary.900' : 'coolGray.400',
            }}
            _dark={{
              color: tabName === 'Photos' ? 'coolGray.100' : 'coolGray.400',
            }}
          >
            Photos
          </Text>
        </Pressable>
        <Pressable
          px="2"
          onPress={() => {
            setTabName('Updates');
          }}
          maxW="25%"
        >
          <Text
            fontSize="md"
            fontWeight="medium"
            _light={{
              color: tabName === 'Updates' ? 'primary.900' : 'coolGray.400',
            }}
            _dark={{
              color: tabName === 'Updates' ? 'coolGray.100' : 'coolGray.400',
            }}
          >
            Updates
          </Text>
        </Pressable>
      </HStack>
      <Divider />
      {tabName === 'Overview' ? (
        <VStack w="100%" mt={4} space={3}>
          {information.map((item, index) => {
            return (
              <HStack alignItems="center" space={2} mb={2} key={index}>
                <Center w={15}>{item.svg}</Center>
                <Text fontSize="xs">{item.iconText}</Text>
              </HStack>
            );
          })}
        </VStack>
      ) : null}
    </Box>
  );
}
function LocationInputMobile() {
  const [textInput, setTextInput] = useState('');
  return (
    <Input
      w="96%"
      top={5}
      position="absolute"
      _light={{ bg: 'white' }}
      _dark={{
        borderColor: 'coolGray.700',
        bg: 'coolGray.900',
      }}
      mb={2}
      py="4"
      mx="2%"
      size="md"
      value={textInput}
      onChangeText={setTextInput}
      InputLeftElement={
        <>
          <Hidden from="base">
            <Icon
              ml="4"
              as={<Ionicons name="search" />}
              size="6"
              _light={{ color: 'coolGray.400' }}
              _dark={{ color: 'coolGray.200' }}
            />
          </Hidden>
          <IconButton
            p="0"
            ml="4"
            variant="unstyled"
            icon={
              <Icon
                as={<MaterialIcons name="my-location" />}
                size="6"
                _light={{ color: 'coolGray.400' }}
                _dark={{ color: 'coolGray.400' }}
              />
            }
          />
        </>
      }
      InputRightElement={
        <Hidden from="md" till="md">
          <IconButton
            p="0"
            mr="4"
            variant="unstyled"
            icon={
              <Icon
                as={<Feather name="more-vertical" />}
                size="6"
                _light={{ color: 'coolGray.400' }}
                _dark={{ color: 'coolGray.400' }}
              />
            }
          />
        </Hidden>
      }
      placeholder="Your Location"
    />
  );
}
function LocationInput() {
  const [textInput, setTextInput] = useState('');

  return (
    <Input
      w="100%"
      mb={2}
      py="2"
      size="md"
      _dark={{
        borderColor: 'coolGray.700',
      }}
      value={textInput}
      onChangeText={setTextInput}
      InputLeftElement={
        <>
          <Hidden from="base">
            <Icon
              ml="4"
              as={<Ionicons name="search" />}
              size="6"
              _light={{ color: 'coolGray.400' }}
              _dark={{ color: 'coolGray.200' }}
            />
          </Hidden>
          <IconButton
            p="0"
            ml="4"
            variant="unstyled"
            icon={
              <Icon
                as={<MaterialIcons name="my-location" />}
                size="6"
                _light={{ color: 'coolGray.400' }}
                _dark={{ color: 'coolGray.400' }}
              />
            }
          />
        </>
      }
      InputRightElement={
        <Hidden from="md" till="md">
          <IconButton
            p="0"
            mr="4"
            variant="unstyled"
            icon={
              <Icon
                as={<Feather name="more-vertical" />}
                size="6"
                _light={{ color: 'coolGray.400' }}
                _dark={{ color: 'coolGray.400' }}
              />
            }
          />
        </Hidden>
      }
      placeholder="Your Location"
    />
  );
}

export default function Map() {
  const { onOpen, onClose } = useDisclose(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if map script is already present in DOM
    if (!document.body.dataset.mapLoaded) {
      const mapScript = document.createElement('script');
      mapScript.src = MAP_SCRIPT_WITH_API_KEY;

      mapScript.onload = () => {
        // set dataset property on body to indicate map script has been loaded.
        document.body.dataset.mapLoaded = 'true';
        setMapLoaded(true);
      };
      document.head.appendChild(mapScript);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      const map = new window.google.maps.Map(
        mapContainerRef.current as HTMLElement,
        {
          zoom: 15,
          mapTypeId: 'terrain',
          center: { lat: 12.91095437167937, lng: 77.60180353953143 },
        }
      );
      type Cord = {
        lat: number;
        lng: number;
      };
      const pathCoords: Cord[] = [
        {
          lat: 12.91072,
          lng: 77.60173,
        },
        {
          lat: 12.91003,
          lng: 77.60191,
        },
        {
          lat: 12.90932,
          lng: 77.60214,
        },
        {
          lat: 12.90863,
          lng: 77.60231,
        },
        {
          lat: 12.9086,
          lng: 77.60185,
        },
        {
          lat: 12.90857,
          lng: 77.60166,
        },
        {
          lat: 12.90852,
          lng: 77.60059,
        },
        {
          lat: 12.90851,
          lng: 77.60038,
        },
        {
          lat: 12.90825,
          lng: 77.60041,
        },
        {
          lat: 12.90806,
          lng: 77.60041,
        },
        {
          lat: 12.90784,
          lng: 77.60044,
        },
        {
          lat: 12.90744,
          lng: 77.60055,
        },
        {
          lat: 12.90731,
          lng: 77.60061,
        },
        {
          lat: 12.90701,
          lng: 77.60089,
        },
        {
          lat: 12.90579,
          lng: 77.60183,
        },
        {
          lat: 12.90556,
          lng: 77.60195,
        },
        {
          lat: 12.9055,
          lng: 77.60196,
        },
        {
          lat: 12.90546,
          lng: 77.60197,
        },
        {
          lat: 12.90545,
          lng: 77.60186,
        },
        {
          lat: 12.90552,
          lng: 77.60183,
        },
        {
          lat: 12.90557,
          lng: 77.60181,
        },
        {
          lat: 12.90555,
          lng: 77.60173,
        },
        {
          lat: 12.90596,
          lng: 77.60145,
        },
      ];

      const deliveryPath = new window.google.maps.Polyline({
        path: pathCoords,
        geodesic: true,
        strokeColor: '#000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      deliveryPath.setMap(map);

      new window.google.maps.Marker({
        position: { lat: 12.906263633852848, lng: 77.6012477730121 },
        map: map,
        icon: {
          url: require('../components/IconRestaurant.png'),

          size: new window.google.maps.Size(36, 50),

          scaledSize: new window.google.maps.Size(36, 50),
        },
      });

      new window.google.maps.Marker({
        position: { lat: 12.910938686053615, lng: 77.60184408715048 },
        map: map,
        icon: {
          url: require('../components/IconCar.png'),

          size: new window.google.maps.Size(56, 90),

          scaledSize: new window.google.maps.Size(56, 90),

          anchor: new window.google.maps.Point(25, 40),
        },
      });
    }
  }, [mapLoaded]);

  return (
    <>
      {mapLoaded ? (
        <DashboardLayout displaySidebar={false} title={'Location'}>
          <Hidden from="md">
            <VStack
              _light={{ bg: 'white', borderColor: 'coolGray.200' }}
              _dark={{ bg: 'coolGray.800', borderColor: 'coolGray.800' }}
              rounded={{ md: '8' }}
              borderWidth={{ md: '1' }}
              safeAreaBottom
              flex={1}
              position="relative"
            >
              <Box width="100%" position="relative" flex={1}>
                <View flex="1" ref={mapContainerRef} />
                <LocationInputMobile />
                <Pressable
                  position="absolute"
                  bottom={40}
                  right={5}
                  _light={{ bg: 'primary.900' }}
                  _dark={{ bg: 'primary.700' }}
                  rounded="full"
                  p={2}
                  onPress={onOpen}
                >
                  <Center w={8} h={8}>
                    <Icon
                      as={<MaterialIcons name="my-location" />}
                      size="6"
                      _light={{ color: 'coolGray.50' }}
                    />
                  </Center>
                </Pressable>
              </Box>
              <Actionsheet isOpen={true} onClose={onClose}>
                <Actionsheet.Content _dark={{ bg: 'coolGray.800' }}>
                  <HotelInformation />
                </Actionsheet.Content>
              </Actionsheet>
            </VStack>
          </Hidden>
          <Hidden till="md">
            <VStack
              px={{ base: '4', md: '4' }}
              _light={{ bg: 'white', borderColor: 'coolGray.200' }}
              _dark={{ bg: 'coolGray.800', borderColor: 'coolGray.800' }}
              rounded={{ md: '8' }}
              borderWidth={{ md: '1' }}
              flexGrow={1}
              // height="full"
            >
              <HStack flexGrow={1} space="4">
                <VStack
                  alignItems="center"
                  width={{ md: '50%', lg: '40%' }}
                  py={{ base: '4', md: '4' }}
                >
                  <VStack space={4} alignItems="center" w="100%">
                    <LocationInput />
                    <HotelInformation />
                    <HotelImageSlider />
                    <InformationTab />
                  </VStack>
                </VStack>
                <Box width={{ md: '50%', lg: '60%' }} position="relative">
                  <View flex="1" ref={mapContainerRef} />

                  <Pressable
                    position="absolute"
                    bottom={5}
                    right={5}
                    _light={{ bg: 'primary.900' }}
                    _dark={{ bg: 'primary.700' }}
                    rounded="full"
                    p={2}
                    onPress={() => {
                      console.log('hello');
                    }}
                  >
                    <Center w={8} h={8}>
                      <Icon
                        as={<MaterialIcons name="my-location" />}
                        size="6"
                        _light={{ color: 'coolGray.50' }}
                      />
                    </Center>
                  </Pressable>
                </Box>
              </HStack>
            </VStack>
          </Hidden>
        </DashboardLayout>
      ) : (
        'Loading ...'
      )}
    </>
  );
}
