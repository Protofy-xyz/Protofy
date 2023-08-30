import React from 'react';
import {
  Box,
  HStack,
  Text,
  VStack,
  Center,
  Icon,
  Pressable,
  IconButton,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

import { MaterialIcons } from '@expo/vector-icons';
type List = {
  feature: string;
  prime: boolean;
  basic: boolean;
};
const list: List[] = [
  {
    feature: 'Invest in Direct Commission',
    prime: true,
    basic: true,
  },
  {
    feature: 'Get Risk free portfolio& Asset',
    prime: true,
    basic: true,
  },
  {
    feature: 'Invest in Direct Commission',
    prime: true,
    basic: true,
  },
  {
    feature: 'Get Risk free portfolio& Asset',
    prime: true,
    basic: true,
  },
  {
    feature: 'Invest in Direct Commission',
    prime: true,
    basic: true,
  },
  {
    feature: 'Get Risk free portfolio& Asset',
    prime: true,
    basic: true,
  },
  {
    feature: 'Invest in Direct Commission',
    prime: true,
    basic: true,
  },
  {
    feature: 'Get Risk free portfolio& Asset',
    prime: true,
    basic: true,
  },
  {
    feature: 'Invest in Direct Commission',
    prime: true,
    basic: true,
  },
];
function Item() {
  return (
    <>
      {list.map((item, index) => {
        return (
          <Box key={index} mt={8}>
            <HStack alignItems="center">
              <Box
                flex={1}
                _text={{
                  fontSize: 'sm',
                  _light: { color: 'coolGray.800' },
                  _dark: { color: 'coolGray.50' },
                }}
              >
                {item.feature}
              </Box>
              <Center w="20">
                {item.prime ? (
                  <Box mr={{ md: 16 }}>
                    <IconButton
                      p={0}
                      icon={
                        <Icon
                          as={MaterialIcons}
                          name="check-circle"
                          size={5}
                          _light={{ color: 'emerald.500' }}
                          _dark={{ color: 'emerald.400' }}
                        />
                      }
                      onPress={() => {
                        console.log('hello');
                      }}
                    />
                  </Box>
                ) : null}
              </Center>
              <Center w="20">
                {item.basic ? (
                  <IconButton
                    p={0}
                    icon={
                      <Icon
                        as={MaterialIcons}
                        name="check-circle"
                        size={5}
                        _light={{ color: 'emerald.500' }}
                        _dark={{ color: 'emerald.400' }}
                      />
                    }
                    onPress={() => {
                      console.log('hello');
                    }}
                  />
                ) : null}
              </Center>
            </HStack>
          </Box>
        );
      })}
    </>
  );
}

function FeaturesHeading() {
  return (
    <>
      <HStack alignItems="center" space={{ md: 10, base: 2 }} mt="6">
        <Text
          flex={1}
          ml={{ base: 1, md: 2 }}
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          fontWeight="medium"
          fontSize="md"
        >
          Features
        </Text>
        <Pressable
          onPress={() => {
            console.log('hello');
          }}
        >
          <Center
            w="74"
            px="3"
            py="1"
            rounded="xs"
            _light={{ bg: 'primary.900' }}
            _dark={{ bg: 'primary.500' }}
            _text={{
              fontSize: 'xs',
              color: 'coolGray.50',
              fontWeight: 'normal',
            }}
          >
            PRIME
          </Center>
        </Pressable>
        <Pressable
          onPress={() => {
            console.log('hello');
          }}
        >
          <Center
            w="74"
            px="3"
            py="1"
            rounded="xs"
            _light={{ bg: 'coolGray.500' }}
            _dark={{ bg: 'coolGray.400' }}
            _text={{
              fontSize: 'xs',
              color: 'coolGray.50',
            }}
          >
            BASIC
          </Center>
        </Pressable>
      </HStack>
    </>
  );
}
export default function () {
  return (
    <DashboardLayout title={'Subscription Features'} displaySidebar={false}>
      <VStack
        safeAreaBottom
        _light={{ bg: 'coolGray.50' }}
        _dark={{ bg: 'coolGray.800' }}
        rounded={{ md: 'sm' }}
        px={{ md: 8, base: 4 }}
        py={{ base: 5, md: 8 }}
        flex={1}
      >
        <FeaturesHeading />
        <Item />
      </VStack>
    </DashboardLayout>
  );
}
