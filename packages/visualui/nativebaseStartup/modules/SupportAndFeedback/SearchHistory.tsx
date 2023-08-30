import React from 'react';
import {
  HStack,
  Icon,
  Text,
  VStack,
  IconButton,
  Input,
  Pressable,
  Hidden,
  Box,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Place = {
  keyword: string;
  address: string;
};
const place: Place[] = [
  {
    keyword: 'Rashtreeya Vidyalaya Road',
    address: 'Agra, Uttar Pradesh',
  },
  {
    keyword: 'Rajajinagar',
    address: 'Bengaluru, Karnataka',
  },
  {
    keyword: 'Ram Hospital',
    address: 'Bengaluru, Karnataka',
  },
  {
    keyword: 'Ramanagar',
    address: 'Karnataka',
  },
  {
    keyword: 'Rasta Cafe',
    address: 'State Highway 17, Karnataka',
  },
  {
    keyword: 'Ramoji Film City',
    address: 'Ramoji Film City Main Road, Hyderabad',
  },
];

function RecentSearchItem({ index, data }: { index: number; data: Place }) {
  return (
    <Pressable
      rounded={{ md: 'md' }}
      px={{ md: 6, base: 4 }}
      py={{ md: 2, base: 2 }}
      _light={{
        _hover: { bg: 'primary.200' },
        _pressed: { bg: 'primary.300' },
      }}
      _dark={{
        _hover: { bg: 'coolGray.900' },
        _pressed: { bg: 'coolGray.600' },
      }}
    >
      <HStack
        maxW="full"
        alignItems="center"
        space={4}
        key={index + Math.random()}
      >
        <IconButton
          _light={{ bg: 'primary.100' }}
          _dark={{ bg: 'coolGray.700' }}
          p={2.5}
          rounded="full"
          icon={
            <Icon
              as={MaterialIcons}
              name="access-time"
              size={5}
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'coolGray.400' }}
            />
          }
        />
        <VStack space={1}>
          <Text
            fontSize="md"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            fontWeight="medium"
          >
            {data.keyword}
          </Text>
          <Text
            fontSize="sm"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            isTruncated
          >
            {data.address}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}

function MainContent() {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      bounces={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Box
        flex={1}
        safeAreaBottom
        pb={{ base: 0, md: 8 }}
        px={{ base: 0, md: 2 }}
        pt={{ base: 4, md: 8 }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        rounded={{ md: 'sm' }}
      >
        <VStack px={{ base: 4, md: 8 }} space={5}>
          <Input
            px={0}
            py={3}
            _dark={{ bg: 'coolGray.700', borderColor: 'coolGray.500' }}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="keyboard-backspace" />}
                size={6}
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
                ml={3}
                mr={2}
              />
            }
            InputRightElement={
              <Icon
                as={<MaterialIcons name="close" />}
                size={6}
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
                mr={3}
              />
            }
            placeholder="Search here"
            fontWeight="medium"
            fontSize="md"
          />
          <Text
            fontWeight="bold"
            fontSize={{ base: 'sm', md: 'md' }}
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            Recent
          </Text>
        </VStack>
        <VStack space={3} mt={4}>
          {place.map((item, index) => {
            return (
              <RecentSearchItem
                index={index}
                data={item}
                key={index + Math.random()}
              />
            );
          })}
        </VStack>
        <Hidden from="md">
          <Pressable mt="auto" mb="8">
            <Text
              textAlign="center"
              fontWeight="medium"
              fontSize="sm"
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'primary.500' }}
            >
              More from recent history
            </Text>
          </Pressable>
        </Hidden>
      </Box>
    </KeyboardAwareScrollView>
  );
}

export default function () {
  return (
    <DashboardLayout
      title={'Explore'}
      displaySidebar={false}
      rightPanelMobileHeader={true}
    >
      <MainContent />
    </DashboardLayout>
  );
}
