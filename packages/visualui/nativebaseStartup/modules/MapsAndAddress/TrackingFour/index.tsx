import React from 'react';
import {
  Text,
  VStack,
  Button,
  Center,
  Hidden,
  Box,
  HStack,
  Avatar,
  Icon,
  Divider,
  IconButton,
  ScrollView,
} from 'native-base';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { Platform } from 'react-native';
import NativeMap from './NativeMap';
import WebMap from './WebMap';

const StackNavigator = createStackNavigator();

type RestaurentInfo = {
  iconName: string;
  name: string;
  address: string;
};
type Icon = {
  iconName: string;
  iconText: string;
};
const footerIcons: Icon[] = [
  { iconName: 'home', iconText: 'Home' },
  { iconName: 'restaurant-menu', iconText: 'Order' },
  { iconName: 'search', iconText: 'Search' },
  { iconName: 'person', iconText: 'Profile' },
];

function MobileFooter({ navigation }: { navigation: any }) {
  const route = useRoute();
  return (
    <HStack
      justifyContent="space-between"
      safeAreaBottom
      h={20}
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
          <Button
            key={index}
            variant="unstyled"
            flex={1}
            colorScheme="coolGray"
            _stack={{
              flexDirection: 'column',
            }}
            startIcon={
              <Icon
                as={MaterialIcons}
                name={item.iconName}
                size="5"
                _light={{
                  color:
                    item.iconText === route.name
                      ? 'primary.900'
                      : 'coolGray.400',
                }}
                _dark={{
                  color:
                    item.iconText === route.name
                      ? 'primary.500'
                      : 'coolGray.400',
                }}
              />
            }
            _text={{
              _light: {
                color:
                  item.iconText === route.name ? 'primary.900' : 'coolGray.400',
              },
              _dark: {
                color:
                  item.iconText === route.name ? 'primary.500' : 'coolGray.400',
              },
            }}
            onPress={() => navigation.navigate(item.iconText)}
          >
            {item.iconText}
          </Button>
        );
      })}
    </HStack>
  );
}

const restaurentInfo: RestaurentInfo = {
  iconName: 'location-on',
  name: 'Drop Location',
  address: 'Lafayette St, New York, NY 10013',
};

function InformationBox() {
  return (
    <Box
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      py={8}
      width="100%"
      mb={{ base: 20, md: 0 }}
      mt="auto"
      alignItems="center"
    >
      <Box maxWidth="736" w="100%">
        <HStack alignItems="center" justifyContent="space-between" px={4}>
          <HStack alignItems="center" space={3}>
            <Avatar source={require('../images/burger.png')} />
            <VStack>
              <Text
                fontSize="md"
                fontWeight="medium"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.100' }}
              >
                Prime Burger
              </Text>
              <HStack alignItems="center" space="1" mt="1">
                <Icon
                  size="5"
                  color="yellow.400"
                  as={MaterialIcons}
                  name={'star'}
                />
                <Text
                  fontSize="sm"
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.100' }}
                >
                  4.9
                </Text>
                <Text
                  fontSize="sm"
                  _light={{ color: 'coolGray.500' }}
                  _dark={{ color: 'coolGray.400' }}
                >
                  (120)
                </Text>
              </HStack>
            </VStack>
          </HStack>
          <HStack alignItems="center" space={5}>
            <IconButton
              p={0}
              variant="unstyled"
              icon={
                <Icon
                  as={MaterialIcons}
                  name="message"
                  size={5}
                  color="coolGray.400"
                />
              }
            />
            <IconButton
              p={0}
              variant="unstyled"
              icon={
                <Icon
                  as={MaterialIcons}
                  name="call"
                  size={5}
                  color="coolGray.400"
                />
              }
            />
          </HStack>
        </HStack>
        <HStack alignItems="center" space={3} mt={6} px={4}>
          <Center
            _light={{ bg: 'primary.50' }}
            _dark={{ bg: 'coolGray.700' }}
            p={2}
            rounded="full"
          >
            <Icon
              as={MaterialIcons}
              name={restaurentInfo.iconName}
              size={5}
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'primary.500' }}
            />
          </Center>
          <VStack>
            <Text
              fontSize="xs"
              fontWeight="normal"
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
            >
              {restaurentInfo.name}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="normal"
              _light={{ color: 'coolGray.900' }}
              _dark={{ color: 'white' }}
            >
              {restaurentInfo.address}
            </Text>
          </VStack>
        </HStack>
        <VStack space={3} mt={9} px={4}>
          <Button variant="solid" size="lg">
            START PICKUP
          </Button>
          <Button variant="outline" size="lg">
            CANCEL ORDER
          </Button>
        </VStack>
      </Box>

      <Divider
        display={{ base: 'flex', md: 'none' }}
        _light={{ bg: 'coolGray.200' }}
        _dark={{ bg: 'coolGray.700' }}
      />
    </Box>
  );
}

function TrackingFour({ navigation }: { navigation: any }) {
  return (
    <DashboardLayout
      title="Track Order"
      displaySidebar={false}
      displayBackIcon={false}
    >
      <ScrollView flex="1" bounces={false} showsVerticalScrollIndicator={false}>
        {Platform.OS === 'web' ? <WebMap /> : <NativeMap />}
        <InformationBox />
      </ScrollView>
      <Hidden from="md">
        <MobileFooter navigation={navigation} />
      </Hidden>
    </DashboardLayout>
  );
}

export default function () {
  return (
    <NavigationContainer>
      <StackNavigator.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <StackNavigator.Screen name="Home" component={TrackingFour} />
        <StackNavigator.Screen name="Order" component={TrackingFour} />
        <StackNavigator.Screen name="Search" component={TrackingFour} />
        <StackNavigator.Screen name="Profile" component={TrackingFour} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
