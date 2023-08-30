import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Center,
  Divider,
  ScrollView,
  Pressable,
  IconButton,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Platform } from 'react-native';

function DividersOrCircles(props: { num: number; type: string }) {
  const items: React.ReactNode = [];
  for (let i = 0; i < props.num; i++) {
    if (props.type === 'divider') {
      items.push(
        <Divider
          mt={1}
          orientation="vertical"
          h={2}
          _light={{
            bg: 'white',
          }}
          _dark={{
            bg: 'coolGray.800',
          }}
        />
      );
    } else if (props.type === 'circle') {
      items.push(
        <Pressable
          onPress={() => {
            console.log('hello');
          }}
        >
          <Icon
            mt={5}
            size={3}
            _light={{ color: 'coolGray.400' }}
            _dark={{ color: 'coolGray.500' }}
            as={MaterialIcons}
            name={'circle'}
          />
        </Pressable>
      );
    }
  }

  return <>{items}</>;
}
function Track() {
  return (
    <VStack
      alignItems="center"
      borderRadius="20"
      w={6}
      pb={5}
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: 'coolGray.700' }}
    >
      <DividersOrCircles num={4} type="circle" />
      <VStack
        mt={5}
        alignItems="center"
        w="100%"
        borderRadius="20"
        _light={{ bg: 'primary.900' }}
        _dark={{ bg: 'primary.500' }}
      >
        <Pressable
          onPress={() => {
            console.log('hello');
          }}
        >
          <Icon
            mt={4}
            mb={-1}
            size={3}
            _light={{ color: 'white' }}
            _dark={{ color: 'coolGray.800' }}
            as={MaterialIcons}
            name={'circle'}
          />
        </Pressable>

        <DividersOrCircles num={9} type="divider" />
        <Center
          borderWidth={1}
          _light={{
            bg: 'white',
            borderColor: 'primary.900',
          }}
          _dark={{
            bg: 'coolGray.800',
            borderColor: 'primary.500',
          }}
          rounded="full"
          p="2"
        >
          <Icon
            size={5}
            _light={{ color: 'primary.900' }}
            _dark={{ color: 'primary.500' }}
            as={MaterialIcons}
            name={'train'}
          />
        </Center>
        <DividersOrCircles num={9} type="divider" />
        <Pressable
          onPress={() => {
            console.log('hello');
          }}
        >
          <Icon
            mb={5}
            size={3}
            _light={{ color: 'white' }}
            _dark={{ color: 'coolGray.800' }}
            as={MaterialIcons}
            name={'circle'}
          />
        </Pressable>
      </VStack>
      <DividersOrCircles num={6} type="circle" />
    </VStack>
  );
}
export default function TrainTracking() {
  return (
    <DashboardLayout displaySidebar={false} title="HBL to BLR">
      <ScrollView>
        <HStack
          space={7}
          px={{ base: 4, md: 8, lg: 8 }}
          pt={{ base: 4, md: 8 }}
          pb={{ base: 82, md: 8 }}
          borderRadius={{ md: '8' }}
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
        >
          <Track />
          <VStack flex={1}>
            <HStack mt={4} alignItems="center" justifyContent="space-between">
              <HStack alignItems="center">
                <Text
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                >
                  Start Majestic
                </Text>
                <Box
                  _light={{
                    _text: {
                      color: 'white',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                    },
                    bg: 'coolGray.500',
                  }}
                  _dark={{
                    _text: {
                      color: 'coolGray.50',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                    },
                    bg: 'coolGray.400',
                  }}
                  borderRadius="sm"
                  py={0.5}
                  px={2}
                  ml={2}
                >
                  PF 1
                </Box>
              </HStack>
              <Text
                _light={{ color: 'coolGray.400' }}
                _dark={{ color: 'coolGray.400' }}
                fontWeight="normal"
                fontSize="sm"
              >
                14:30
              </Text>
            </HStack>
            <Text
              mt={42}
              fontSize="xs"
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
            >
              10 Stations ( 110 Kms )
            </Text>
            <HStack mt={62} justifyContent="space-between" alignItems="center">
              <HStack alignItems="center">
                <Text
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                >
                  Tumkur
                </Text>
                <Box
                  _light={{
                    _text: {
                      color: 'white',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                    },
                    bg: 'coolGray.500',
                  }}
                  _dark={{
                    _text: {
                      color: 'coolGray.50',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                    },
                    bg: 'coolGray.400',
                  }}
                  borderRadius="sm"
                  py={0.5}
                  px={2}
                  ml={2}
                >
                  PF 1
                </Box>
              </HStack>
              <Text
                _light={{ color: 'coolGray.400' }}
                _dark={{ color: 'coolGray.400' }}
                fontWeight="normal"
                fontSize="sm"
              >
                15:00
              </Text>
            </HStack>
            <Text
              mt={0.5}
              color="emerald.600"
              fontSize={10}
              fontWeight="medium"
            >
              On Time
            </Text>
            <Text
              mt={9}
              fontSize="xs"
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
            >
              6 Stations ( 87 Kms )
            </Text>
            <HStack mt={7} justifyContent="space-between" alignItems="center">
              <HStack alignItems="center">
                <Text
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                  fontWeight="medium"
                >
                  Davangeri
                </Text>
                <Box
                  _light={{
                    _text: {
                      color: 'white',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                    },
                    bg: 'red.600',
                  }}
                  _dark={{
                    _text: {
                      color: 'coolGray.300',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                    },
                    bg: 'red.400',
                  }}
                  borderRadius="sm"
                  px={1}
                  ml={2}
                >
                  PF 2
                </Box>
              </HStack>
              <Text
                _light={{ color: 'coolGray.400' }}
                _dark={{ color: 'coolGray.400' }}
                fontWeight="normal"
                fontSize="sm"
              >
                15:00
              </Text>
            </HStack>
            <Text
              mt={1}
              _light={{ color: 'red.600' }}
              _dark={{ color: 'red.400' }}
              fontSize={10}
              fontWeight="medium"
            >
              Delayed by 10 min
            </Text>
            <HStack mt={70} justifyContent="space-between">
              <HStack mt={Platform.OS === 'ios' ? 4 : 2} alignItems="center">
                <Text fontWeight="medium">Haveri</Text>
                <Box
                  _light={{
                    _text: {
                      color: 'white',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                    },
                    bg: 'coolGray.500',
                  }}
                  _dark={{
                    _text: {
                      color: 'coolGray.50',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                    },
                    bg: 'coolGray.400',
                  }}
                  borderRadius="sm"
                  py={0.5}
                  px={2}
                  ml={2}
                >
                  PF 1
                </Box>
              </HStack>
              <VStack>
                <Text
                  _light={{ color: 'emerald.600' }}
                  _dark={{ color: 'emerald.500' }}
                  fontWeight="normal"
                  fontSize="sm"
                  textAlign="right"
                  pt={8}
                >
                  19:00
                </Text>
                <Text
                  _light={{ color: 'coolGray.400' }}
                  _dark={{ color: 'coolGray.400' }}
                  fontWeight="normal"
                  fontSize="sm"
                >
                  Expected
                </Text>
              </VStack>
            </HStack>
            <Text
              mt={74}
              fontSize="xs"
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
            >
              4 Stations ( 56 Kms )
            </Text>
            <HStack mt={79} justifyContent="space-between" alignItems="center">
              <HStack alignItems="center">
                <Text
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                  fontWeight="medium"
                >
                  Hubbali
                </Text>
                <Box
                  _light={{
                    _text: {
                      color: 'white',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                    },
                    bg: 'coolGray.500',
                  }}
                  _dark={{
                    _text: {
                      color: 'coolGray.50',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                    },
                    bg: 'coolGray.400',
                  }}
                  borderRadius="sm"
                  py={0.5}
                  px={2}
                  ml={2}
                >
                  PF 1
                </Box>
              </HStack>

              <Text
                _light={{ color: 'coolGray.400' }}
                _dark={{ color: 'coolGray.400' }}
                fontWeight="normal"
                fontSize="sm"
                textAlign="right"
              >
                21:00
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </ScrollView>
    </DashboardLayout>
  );
}
