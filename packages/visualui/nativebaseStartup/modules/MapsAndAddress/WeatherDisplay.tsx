import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Pressable,
  Hidden,
  Spacer,
  Divider,
  ScrollView,
  Stack,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';
type List = {
  iconName: string;
  iconText: string;
};
type Information = {
  text: string;
  unit: string;
  iconName: string;
};
type CurrentWeather = {
  time: string;
  iconName: string;
  type: string;
};
type SevenDayWeather = {
  day: string;
  minTemp: string;
  maxTemp: string;
};
const list: List[] = [
  {
    iconName: 'flash-on',
    iconText: '5 km/h',
  },
  {
    iconName: 'wb-cloudy',
    iconText: '0%',
  },
  {
    iconName: 'wb-sunny',
    iconText: '14h',
  },
];
const information: Information[] = [
  {
    text: 'Temperature',
    unit: 'Celsius',
    iconName: 'chevron-right',
  },
  {
    text: 'Wind Speed',
    unit: 'km/h',
    iconName: 'chevron-right',
  },
  {
    text: 'Source',
    unit: 'Weather.gov',
    iconName: 'chevron-right',
  },
];
const currentWeather: CurrentWeather[] = [
  {
    time: 'Now',
    iconName: 'wb-sunny',
    type: '23°',
  },
  {
    time: '02:00',
    iconName: 'wb-sunny',
    type: '26°',
  },
  {
    time: '03:00',
    iconName: 'cloud-queue',
    type: '25°',
  },
  {
    time: '04:00',
    iconName: 'wb-sunny',
    type: '21°',
  },
  {
    time: '05:00',
    iconName: 'wb-sunny',
    type: '18°',
  },
  {
    time: '04:00',
    iconName: 'wb-sunny',
    type: '26°',
  },
  {
    time: '05:00',
    iconName: 'wb-sunny',
    type: '25°',
  },
];
const sevenDayWeather: SevenDayWeather[] = [
  {
    day: 'Sunday',
    minTemp: '24°',
    maxTemp: '25°',
  },
  {
    day: 'Monday',
    minTemp: '19°',
    maxTemp: '21°',
  },
  {
    day: 'Tuesday',
    minTemp: '24°',
    maxTemp: '25°',
  },
  {
    day: 'Wednesday',
    minTemp: '28°',
    maxTemp: '29°',
  },
  {
    day: 'Thursday',
    minTemp: '28°',
    maxTemp: '29°',
  },
  {
    day: 'Friday',
    minTemp: '19°',
    maxTemp: '21°',
  },
  {
    day: 'Saturday',
    minTemp: '24°',
    maxTemp: '25°',
  },
];

const WeatherList = () => {
  return (
    <VStack space={1}>
      {list.map((item, index) => {
        return (
          <HStack space={1} key={index} alignItems="center">
            <Icon
              as={MaterialIcons}
              name={item.iconName}
              size={5}
              color="coolGray.50"
            />
            <Text color="white" fontSize="sm" fontWeight="normal">
              {item.iconText}
            </Text>
          </HStack>
        );
      })}
    </VStack>
  );
};

const WeatherCard = () => {
  return (
    <Box
      w="100%"
      px={{ base: 4, md: 0 }}
      _dark={{ bg: { base: 'coolGray.800', md: 'coolGray.700' } }}
    >
      <HStack
        h="200"
        alignSelf="stretch"
        justifyContent="space-between"
        bg={{
          linearGradient: {
            colors: ['violet.900', 'red.400'],
            start: [0, 0],
            end: [1, 1],
          },
        }}
        shadow="2"
        rounded="xl"
        p={5}
        space={{ lg: 12 }}
      >
        <Box>
          <Text fontSize="md" fontWeight="bold" color="coolGray.50">
            Dubai
          </Text>
          <Spacer />
          <WeatherList />
        </Box>
        <Icon
          as={MaterialIcons}
          name="wb-sunny"
          size={20}
          color="amber.400"
          mt={4}
        />
        <Box alignItems="flex-end">
          <Text fontSize="sm" fontWeight="medium" color="coolGray.50">
            01:30
          </Text>
          <Spacer />
          <Text fontWeight="normal" color="coolGray.50" fontSize="5xl">
            39°
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

const WeatherDegreeUnits = () => {
  return (
    <VStack
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      justifyContent={{ base: 'space-between', md: 'center' }}
      borderRadius={{ md: 'sm' }}
      py={3}
    >
      {information.map((item, index) => {
        return (
          <Pressable key={index} px={4} py={3}>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              key={index}
            >
              <Text
                fontSize="md"
                fontWeight="normal"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                {item.text}
              </Text>
              <HStack alignItems="center">
                <Text
                  fontSize="md"
                  fontWeight="normal"
                  _light={{ color: 'coolGray.500' }}
                  _dark={{ color: 'coolGray.400' }}
                >
                  {item.unit}
                </Text>
                <Icon
                  size={6}
                  as={MaterialIcons}
                  _light={{ color: 'coolGray.500' }}
                  _dark={{ color: 'coolGray.400' }}
                  name={item.iconName}
                />
              </HStack>
            </HStack>
          </Pressable>
        );
      })}
    </VStack>
  );
};

const WeatherPredictions = () => {
  return (
    <Box
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      pt={{ base: '4', md: '8' }}
      px={{ md: 8, base: 4 }}
      pb={{ base: 6, md: 7 }}
      mt={{ base: 3, md: 0 }}
      borderTopRadius={{ md: 'sm' }}
    >
      <Text
        fontSize="lg"
        fontWeight="bold"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Today
      </Text>
      <ScrollView
        horizontal
        contentContainerStyle={{ flexGrow: 1 }}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        <HStack
          space={{ base: 12, md: 10 }}
          flex={1}
          justifyContent="space-evenly"
        >
          {currentWeather.map((item, index) => {
            return (
              <VStack alignItems="center" mt={3} space={2} key={index}>
                {item.time === 'Now' ? (
                  <Text
                    _light={{ color: 'coolGray.800' }}
                    _dark={{ color: 'coolGray.50' }}
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    {item.time}
                  </Text>
                ) : (
                  <Text
                    _light={{ color: 'coolGray.800' }}
                    _dark={{ color: 'coolGray.50' }}
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    {item.time}
                  </Text>
                )}
                <Icon
                  size={6}
                  as={MaterialIcons}
                  color="coolGray.400"
                  name={item.iconName}
                />
                <Text
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                  fontSize="md"
                  fontWeight="medium"
                >
                  {item.type}
                </Text>
              </VStack>
            );
          })}
        </HStack>
      </ScrollView>
    </Box>
  );
};

const WeatherNextWeek = () => {
  return (
    <Box
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      flex={1}
      py={{ base: 1, md: 4 }}
      px={{ base: 0, md: 4 }}
      mt={{ base: 4, md: 0 }}
      borderBottomRadius={{ md: 'sm' }}
    >
      <Text
        fontSize="md"
        fontWeight="bold"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        px={4}
        py={3}
      >
        Next 7 Days
      </Text>
      <VStack>
        {sevenDayWeather.map((item, index) => {
          return (
            <HStack justifyContent="space-between" key={index} px={4} py={3}>
              <Text
                fontSize="md"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                {item.day}
              </Text>
              <Text
                fontWeight="bold"
                fontSize="sm"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
              >
                {item.minTemp}
                <Text
                  fontSize="sm"
                  fontWeight="normal"
                  _light={{ color: 'coolGray.500' }}
                  _dark={{ color: 'coolGray.400' }}
                >
                  {'/'}
                  {item.maxTemp}
                </Text>
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
};

export default function () {
  return (
    <DashboardLayout
      title="Weather"
      displaySidebar={false}
      rightPanelMobileHeader={true}
    >
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <Stack
          flex={1}
          space={{ base: 0, md: 5 }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box
            bg={{ base: 'white', md: 'transparent' }}
            alignItems="center"
            flex="2"
          >
            <VStack
              w="100%"
              pt={{ base: 5, md: 0 }}
              space={{ base: 0, md: 4 }}
              _dark={{ bg: { base: 'coolGray.800', md: 'coolGray.700' } }}
            >
              <WeatherCard />
              <WeatherDegreeUnits />
            </VStack>
          </Box>
          <Box flex={{ md: 3 }}>
            <WeatherPredictions />
            <Divider />
            <WeatherNextWeek />
          </Box>
        </Stack>
      </ScrollView>
    </DashboardLayout>
  );
}
