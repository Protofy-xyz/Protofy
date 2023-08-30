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
  Progress,
  Divider,
} from 'native-base';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import NativeMap from './NativeMap';
import WebMap from './WebMap';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';

const StackNavigator = createStackNavigator();

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
    <>
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
        _light={{ backgroundColor: 'white', borderTopColor: 'coolGray.200' }}
        _dark={{
          backgroundColor: 'coolGray.800',
          borderTopColor: 'coolGray.700',
        }}
        borderTopWidth={1}
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
                    item.iconText === route.name
                      ? 'primary.900'
                      : 'coolGray.400',
                },
                _dark: {
                  color:
                    item.iconText === route.name
                      ? 'primary.500'
                      : 'coolGray.400',
                },
              }}
              onPress={() => navigation.navigate(item.iconText)}
            >
              {item.iconText}
            </Button>
          );
        })}
      </HStack>
    </>
  );
}

function InformationBox() {
  return (
    <Box
      pb={20}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      width="100%"
      // mb={8}
      justifyContent={'center'}
      alignItems="center"
      flex={1}
    >
      <Icon as={MaterialIcons} name="search" size="8" color="coolGray.400" />
      <Text
        fontSize="md"
        mt="3"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
      >
        Searching For Orders...
      </Text>
    </Box>
  );
}

function TrackingOne({ navigation }: { navigation: any }) {
  return (
    <DashboardLayout
      title="Track order"
      displaySidebar={false}
      displayBackIcon={false}
    >
      <ScrollView
        style={{ height: '100%' }}
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {Platform.OS === 'web' ? <WebMap /> : <NativeMap />}
        <Progress
          value={45}
          height="1.5"
          rounded="none"
          _light={{
            bg: 'primary.300',
            _filledTrack: { bg: 'primary.900' },
          }}
          _dark={{
            bg: 'coolGray.700',
            _filledTrack: { bg: 'primary.500' },
          }}
        />

        <InformationBox />
      </ScrollView>

      <Hidden from="md">
        <>
          <MobileFooter navigation={navigation} />
        </>
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
        <StackNavigator.Screen name="Home" component={TrackingOne} />
        <StackNavigator.Screen name="Order" component={TrackingOne} />
        <StackNavigator.Screen name="Search" component={TrackingOne} />
        <StackNavigator.Screen name="Profile" component={TrackingOne} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
