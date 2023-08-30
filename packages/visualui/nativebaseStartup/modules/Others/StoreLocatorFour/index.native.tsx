import React, { useState } from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  IconButton,
  Input,
  Pressable,
  Center,
  Hidden,
  Button,
  Image,
  Actionsheet,
  useDisclose,
} from 'native-base';
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import DashboardLayout from '../../../layouts/DashboardLayout';
import IconCar from '../components/IconCar';
import IconCycle from '../components/IconCycle';
import IconPerson from '../components/IconPerson';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants?.manifest?.extra?.GOOGLE_MAPS_API_KEY;

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

function LocationInput() {
  const [textInput, setTextInput] = useState('');
  return (
    <Input
      top={5}
      position="absolute"
      _light={{ bg: 'white' }}
      _dark={{
        borderColor: 'coolGray.700',
        bg: 'coolGray.900',
      }}
      mb={2}
      py="4"
      mx={2}
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

export default function () {
  const { onOpen, onClose } = useDisclose(true);

  return (
    <DashboardLayout displaySidebar={false} title={'Location'}>
      <VStack
        _light={{ bg: 'white', borderColor: 'coolGray.200' }}
        _dark={{ bg: 'coolGray.800', borderColor: 'coolGray.800' }}
        rounded={{ md: '8' }}
        borderWidth={{ md: '1' }}
        safeAreaBottom
        flex={1}
      >
        <Box width="100%" position="relative" flex={1}>
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            region={{
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
              latitude: 12.910938686053615,
              longitude: 77.60184408715048,
            }}
          >
            <Marker
              coordinate={{
                latitude: 12.906263633852848,
                longitude: 77.6012477730121,
              }}
            >
              <Image
                source={require('../components/IconRestaurant.png')}
                style={{ height: 35, width: 35 }}
                alt="Alternate Text"
              />
            </Marker>
            <Marker
              coordinate={{
                latitude: 12.910938686053615,
                longitude: 77.60184408715048,
              }}
            >
              <Image
                source={require('../components/IconCar.png')}
                style={{ height: 70, width: 90 }}
                alt="Alternate Text"
              />
            </Marker>

            <MapViewDirections
              origin={{
                latitude: 12.906263633852848,
                longitude: 77.6012477730121,
              }}
              destination={{
                latitude: 12.910938686053615,
                longitude: 77.60184408715048,
              }}
              apikey={GOOGLE_MAPS_API_KEY}
            />
          </MapView>
          <LocationInput />
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
    </DashboardLayout>
  );
}
