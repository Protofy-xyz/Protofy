import React from 'react';
import {
  Text,
  VStack,
  Button,
  Center,
  Hidden,
  Box,
  HStack,
  Icon,
  Stack,
  ScrollView,
} from 'native-base';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import NativeMap from './NativeMap';
import WebMap from './WebMap';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';

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

const restaurentInfo: RestaurentInfo[] = [
  {
    iconName: 'storefront',
    name: 'Aami Bangali Restaurant',
    address: '47 W 13th St, New York, NY 11214',
  },
  {
    iconName: 'location-on',
    name: 'Drop Location',
    address: 'Lafayette St, New York, NY 10013',
  },
];
function InformationBox() {
  return (
    <Box
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      py={8}
      px={{ base: 4 }}
      width="100%"
      mb={{ base: 20, md: 0 }}
      mt="auto"
      alignItems="center"
    >
      <Box maxWidth="736" w="100%">
        <VStack>
          <HStack alignItems="center" justifyContent="space-between">
            <Text
              fontSize="md"
              fontWeight="medium"
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
            >
              Food Order
            </Text>
            <Text
              fontSize="sm"
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
            >
              40 min | 0.3 miles
            </Text>
          </HStack>

          <VStack space={6} mt={7}>
            {restaurentInfo.map((item, index) => {
              return (
                <HStack alignItems="center" space={3} key={index}>
                  <Center
                    _light={{ bg: 'primary.50' }}
                    _dark={{ bg: 'coolGray.700' }}
                    p={2}
                    rounded="full"
                  >
                    <Icon
                      as={MaterialIcons}
                      name={item.iconName}
                      size={5}
                      _light={{ color: 'primary.900' }}
                      _dark={{ color: 'primary.500' }}
                    />
                  </Center>
                  <VStack space="0.5">
                    <Text
                      fontSize="xs"
                      fontWeight="normal"
                      _light={{ color: 'coolGray.500' }}
                      _dark={{ color: 'coolGray.400' }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="normal"
                      _light={{ color: 'coolGray.800' }}
                      _dark={{ color: 'coolGray.50' }}
                    >
                      {item.address}
                    </Text>
                  </VStack>
                </HStack>
              );
            })}
          </VStack>
          <Stack space={3} mt={8}>
            <Button variant="solid" size="lg">
              ACCEPT
            </Button>
            <Button variant="outline" size="lg">
              REJECT
            </Button>
          </Stack>
        </VStack>
      </Box>
    </Box>
  );
}

function Tracking({ navigation }: { navigation: any }) {
  return (
    <DashboardLayout
      title="Track order"
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
        <StackNavigator.Screen name="Home" component={Tracking} />
        <StackNavigator.Screen name="Order" component={Tracking} />
        <StackNavigator.Screen name="Search" component={Tracking} />
        <StackNavigator.Screen name="Profile" component={Tracking} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
