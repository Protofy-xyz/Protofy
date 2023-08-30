import React from 'react';
import {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {
  Box,
  HStack,
  Icon,
  VStack,
  Text,
  Center,
  Divider,
  ScrollView,
  StatusBar,
  Hidden,
  Image,
} from 'native-base';
import { Pressable } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import IconHeart from './components/IconHeart';

export default function Dashboard() {
  return (
    <>
      <DashboardLayout displaySidebar={false} title="Dashboard">
        <VStack
          px={{ base: 0, md: 0 }}
          py={{ base: 0, md: 4 }}
          borderRadius={{ md: '8' }}
          _light={{
            borderColor: 'coolGray.200',
            bg: { base: 'white', md: 'white' },
          }}
          _dark={{
            borderColor: 'coolGray.800',
            bg: { md: 'coolGray.800', base: 'coolGray.900' },
          }}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <Box _dark={{ bg: 'coolGray.800' }} _light={{ bg: 'primary.900' }} />
          <VStack
            _light={{ bg: { base: '#F3F4F6', md: 'white' } }}
            _dark={{ bg: 'coolGray.800' }}
          >
            <Tabs
              isFitted={{ base: false, md: true }}
              flex={1}
              size="md"
              _light={{ colorScheme: 'white' }}
              _dark={{ colorScheme: 'customGray' }}
            >
              <Tabs.Bar
                _light={{ bg: { base: 'white', md: 'white' } }}
                _dark={{
                  bg: 'coolGray.800',
                  borderBottomWidth: '0.5',
                  borderBottomColor: 'coolGray.700',
                }}
                pl={{ base: '13px', md: 0 }}
              >
                <Tabs.Tab mr={{ base: '4', md: '150px' }}>
                  <Hidden from="md">
                    <Text
                      fontSize="sm"
                      _light={{
                        color: { base: 'coolGray.800', md: 'coolGray.800' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                      _dark={{
                        color: { base: 'white', md: 'coolGray.50' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                    >
                      Today
                    </Text>
                  </Hidden>
                  <Hidden from="base" till="md">
                    <Text
                      fontSize="sm"
                      _light={{
                        color: { base: 'coolGray.800', md: 'coolGray.800' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                      _dark={{
                        color: { base: 'white', md: 'coolGray.50' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                    >
                      Today
                    </Text>
                  </Hidden>
                </Tabs.Tab>
                <Tabs.Tab mr={{ base: '1', md: '150px' }}>
                  <Hidden from="md">
                    <Text
                      fontSize="sm"
                      _light={{
                        color: { base: 'coolGray.400', md: 'coolGray.500' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                      _dark={{
                        color: { base: 'coolGray.400', md: 'coolGray.400' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                    >
                      Week
                    </Text>
                  </Hidden>
                  <Hidden from="base" till="md">
                    <Text
                      fontSize="sm"
                      _light={{
                        color: { base: 'coolGray.400', md: 'coolGray.500' },
                        letterSpacing: 0.5,
                        fontWeight: 'normal',
                      }}
                      _dark={{
                        color: { base: 'coolGray.400', md: 'coolGray.400' },
                        letterSpacing: 0.5,
                        fontWeight: 'normal',
                      }}
                    >
                      Last Week
                    </Text>
                  </Hidden>
                </Tabs.Tab>
                <Tabs.Tab mr={{ base: '1', md: '150px' }}>
                  <Hidden from="md">
                    <Text
                      fontSize="sm"
                      _light={{
                        color: { base: 'coolGray.400', md: 'coolGray.500' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                      _dark={{
                        color: { base: 'coolGray.400', md: 'coolGray.400' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                    >
                      Month
                    </Text>
                  </Hidden>
                  <Hidden from="base" till="md">
                    <Text
                      fontSize="sm"
                      _light={{
                        color: { base: 'coolGray.400', md: 'coolGray.500' },
                        letterSpacing: 0.5,
                        fontWeight: 'normal',
                      }}
                      _dark={{
                        color: { base: 'coolGray.400', md: 'coolGray.400' },
                        letterSpacing: 0.5,
                        fontWeight: 'normal',
                      }}
                    >
                      Last Month
                    </Text>
                  </Hidden>
                </Tabs.Tab>
                <Tabs.Tab mr={{ base: '1', md: '0' }}>
                  <Hidden from="md">
                    <Text
                      fontSize="sm"
                      _light={{
                        color: { base: 'coolGray.400', md: 'coolGray.500' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                      _dark={{
                        color: { base: 'coolGray.400', md: 'coolGray.400' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                    >
                      Year
                    </Text>
                  </Hidden>
                  <Hidden from="base" till="md">
                    <Text
                      fontSize="sm"
                      _light={{
                        color: { base: 'coolGray.400', md: 'coolGray.500' },
                        letterSpacing: 0.5,
                        fontWeight: 'normal',
                      }}
                      _dark={{
                        color: { base: 'coolGray.400', md: 'coolGray.400' },
                        letterSpacing: 0.5,
                        fontWeight: 'normal',
                      }}
                    >
                      Last Year
                    </Text>
                  </Hidden>
                </Tabs.Tab>

                <Tabs.Tab mr="1" size={{ md: '0px' }}>
                  <Hidden from="md">
                    <Text
                      fontSize="sm"
                      _light={{
                        color: { base: 'coolGray.400', md: 'coolGray.500' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                      _dark={{
                        color: { base: 'coolGray.400', md: 'coolGray.400' },
                        letterSpacing: 0.5,
                        fontWeight: 'medium',
                      }}
                    >
                      Specific Date
                    </Text>
                  </Hidden>
                </Tabs.Tab>
              </Tabs.Bar>
              <Tabs.Views>
                <Tabs.View>
                  <ScrollView
                    pl="2"
                    pb="4"
                    showsVerticalScrollIndicator={false}
                    _light={{ bg: { base: '#F3F4F6', md: 'white' } }}
                    _dark={{ bg: { base: 'coolGray.800', md: 'coolGray.800' } }}
                  >
                    <Hidden from="md">
                      <HStack flexWrap="wrap" justifyContent="space-between">
                        <Box
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height={40}
                          width={{ base: '47%', sm: '32%', md: '32%' }}
                          borderRadius={16}
                          mt={4}
                        >
                          <VStack flex="1">
                            <HStack justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="sm"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Steps
                              </Text>
                              <Box
                                height={6}
                                width={6}
                                alignItems="center"
                                justifyContent="center"
                                borderRadius={16}
                                _light={{ bg: 'rose.500' }}
                                _dark={{ bg: '#F87171' }}
                                mt={4}
                                mr={4}
                              >
                                <HStack>
                                  <Icon
                                    as={MaterialCommunityIcons}
                                    name="shoe-print"
                                    size={5}
                                    color="white"
                                  />
                                </HStack>
                              </Box>
                            </HStack>

                            <Center
                              flex="1"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Image
                                height="100px"
                                width="100px"
                                _light={{
                                  source: require('./components/ImageSteps.png'),
                                }}
                                _dark={{
                                  source: require('./components/ImageStepsDark.png'),
                                }}
                                alt="Alternate Text"
                              />
                            </Center>
                          </VStack>
                        </Box>
                        <Box
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height={40}
                          borderRadius={16}
                          mt={4}
                          width={{ base: '47%', sm: '32%', md: '32%' }}
                        >
                          <VStack flex={1}>
                            <HStack flex={1} justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="sm"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Heart
                              </Text>
                              <Box
                                height={6}
                                width={6}
                                alignItems="center"
                                justifyContent="center"
                                borderRadius={16}
                                bg="emerald.300"
                                mt={4}
                                mr={4}
                              >
                                <Icon
                                  as={AntDesign}
                                  name={'heart'}
                                  size={3}
                                  color="white"
                                  alignSelf="center"
                                />
                              </Box>
                            </HStack>
                            <Center mb={6}>
                              <IconHeart />
                            </Center>
                          </VStack>
                        </Box>
                        <Box
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height={56}
                          width={{ base: '47%', sm: '32%', md: '32%' }}
                          borderRadius={16}
                          mt={4}
                        >
                          <VStack flex={1}>
                            <HStack justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="sm"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Statistics
                              </Text>
                              <Box
                                height={6}
                                width={6}
                                alignItems="center"
                                justifyContent="center"
                                borderRadius={16}
                                _light={{ bg: 'primary.500' }}
                                _dark={{ bg: '#8B5CF6' }}
                                mt={4}
                                mr={4}
                              >
                                <HStack justifyContent="center">
                                  <Icon
                                    as={Ionicons}
                                    name={'stats-chart-sharp'}
                                    size={4}
                                    color="white"
                                    alignSelf="center"
                                  />
                                </HStack>
                              </Box>
                            </HStack>

                            <Center
                              mt="20px"
                              flex="1"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Image
                                height="130px"
                                width="130px"
                                _light={{
                                  source: require('./components/ImageStatsLightMobile.png'),
                                }}
                                _dark={{
                                  source: require('./components/ImageStatsDarkMobile.png'),
                                }}
                                alt="Alternate Text"
                              />
                            </Center>
                          </VStack>
                        </Box>
                        <Box
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height={32}
                          borderRadius={16}
                          mt={4}
                          width={{ base: '47%', sm: '32%', md: '32%' }}
                        >
                          <VStack flex={1}>
                            <HStack flex={1} justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="sm"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Sleep
                              </Text>
                              <Box
                                height={6}
                                width={6}
                                alignItems="center"
                                justifyContent="center"
                                borderRadius={16}
                                _light={{ bg: 'amber.400' }}
                                _dark={{ bg: '#FBBF24' }}
                                mt={4}
                                mr={4}
                              >
                                <Icon
                                  as={Ionicons}
                                  name={'moon'}
                                  size={3}
                                  color="white"
                                  alignSelf="center"
                                />
                              </Box>
                            </HStack>

                            <Text
                              mb={4}
                              ml={4}
                              mr={4}
                              fontSize="md"
                              fontWeight="bold"
                              _light={{ color: 'coolGray.800' }}
                              _dark={{ color: 'coolGray.100' }}
                            >
                              9{' '}
                              <Text
                                _light={{ color: 'coolGray.600' }}
                                _dark={{ color: 'coolGray.300' }}
                                fontSize="xs"
                                letterSpacing={0.5}
                              >
                                hrs/day
                              </Text>
                            </Text>
                          </VStack>
                        </Box>

                        <Box
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height={32}
                          width={{ base: '47%', sm: '32%', md: '32%' }}
                          borderRadius={16}
                          mt={4}
                        >
                          <VStack flex={1}>
                            <HStack flex={1} justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="sm"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Cycling
                              </Text>
                              <Box
                                height={6}
                                width={6}
                                alignItems="center"
                                justifyContent="center"
                                borderRadius={16}
                                _light={{ bg: 'blue.600' }}
                                _dark={{ bg: '#2563EB' }}
                                mt={4}
                                mr={4}
                              >
                                <Icon
                                  as={Ionicons}
                                  name={'bicycle'}
                                  size={4}
                                  color="white"
                                  alignSelf="center"
                                />
                              </Box>
                            </HStack>
                            <HStack justifyContent="space-between">
                              <Text
                                mb={4}
                                ml={4}
                                mr={4}
                                fontSize="md"
                                fontWeight="bold"
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                              >
                                25{' '}
                                <Text
                                  _light={{ color: 'coolGray.600' }}
                                  _dark={{ color: 'coolGray.300' }}
                                  fontSize="xs"
                                  letterSpacing={0.5}
                                >
                                  Kms
                                </Text>
                              </Text>
                              <VStack>
                                <Pressable
                                  onPress={() => console.log('Pressed stats')}
                                >
                                  <Text
                                    textDecoration="none"
                                    px={1}
                                    color="blue.600"
                                    fontSize="xs"
                                    mr={4}
                                  >
                                    View Stats
                                  </Text>
                                </Pressable>
                                <Divider
                                  orientation="horizontal"
                                  bg="#2563EB"
                                  size={0.5}
                                  h=".8"
                                  mr={4}
                                  width="70%"
                                  alignSelf="center"
                                />
                              </VStack>
                            </HStack>
                          </VStack>
                        </Box>
                        <Box
                          mt={{ base: '-80px', sm: '4', md: 4 }}
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height={48}
                          width={{ base: '47%', sm: '32%', md: '32%' }}
                          borderRadius={16}
                        >
                          <VStack flex={1}>
                            <HStack justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="sm"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Calories
                              </Text>
                              <Box
                                height={6}
                                width={6}
                                alignItems="center"
                                justifyContent="center"
                                borderRadius={16}
                                _light={{ bg: 'rose.500' }}
                                _dark={{ bg: '#EF4444' }}
                                mt={4}
                                mr={4}
                              >
                                <Center>
                                  <Icon
                                    as={MaterialCommunityIcons}
                                    name={'run'}
                                    size={5}
                                    color="white"
                                    alignSelf="center"
                                  />
                                </Center>
                              </Box>
                            </HStack>
                            <Center
                              flex="1"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Image
                                height="110px"
                                width="110px"
                                _light={{
                                  source: require('./components/ImageCalories.png'),
                                }}
                                _dark={{
                                  source: require('./components/ImageCaloriesDarkMobile.png'),
                                }}
                                alt="Alternate Text"
                              />
                            </Center>
                          </VStack>
                        </Box>
                        <Box
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height={24}
                          width={{ base: '47%', sm: '32%', md: '32%' }}
                          borderRadius={16}
                          mt={4}
                        >
                          <VStack flex={1}>
                            <HStack flex={1} justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="sm"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Training
                              </Text>
                              <Box
                                height={6}
                                width={6}
                                alignItems="center"
                                justifyContent="center"
                                borderRadius={16}
                                _light={{ bg: 'red.700' }}
                                _dark={{ bg: 'pink.500' }}
                                mt={4}
                                mr={4}
                              >
                                <Icon
                                  as={AntDesign}
                                  name={'clockcircleo'}
                                  size={3}
                                  color="white"
                                  alignSelf="center"
                                />
                              </Box>
                            </HStack>
                            <HStack justifyContent="space-between" pr="4">
                              <Text
                                mb={4}
                                ml={4}
                                fontSize="xs"
                                fontWeight="medium"
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                              >
                                Upperbody
                              </Text>
                              <VStack>
                                <Text
                                  _light={{ color: 'coolGray.500' }}
                                  _dark={{ color: 'coolGray.400' }}
                                  fontSize="xs"
                                  letterSpacing={0.5}
                                >
                                  45 min
                                </Text>
                              </VStack>
                            </HStack>
                          </VStack>
                        </Box>
                        <Box
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height="108px"
                          width={{ base: '47%', sm: '32%', md: '32%' }}
                          borderRadius={16}
                          mt={{ base: '-16px', sm: '4', md: '4' }}
                          mr={{ base: 1.5, md: 1.5 }}
                        >
                          <VStack flex={1}>
                            <HStack flex={1} justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="sm"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Progress
                              </Text>
                              <Box
                                height={6}
                                width={6}
                                alignItems="center"
                                justifyContent="center"
                                borderRadius={16}
                                _light={{ bg: 'emerald.700' }}
                                _dark={{ bg: '#047857' }}
                                mt={4}
                                mr={4}
                              >
                                <Icon
                                  as={FontAwesome5}
                                  name={'weight'}
                                  size={3}
                                  color="white"
                                  alignSelf="center"
                                />
                              </Box>
                            </HStack>
                            <HStack alignItems="center" pb="4">
                              <Text
                                ml={4}
                                mr={1}
                                fontSize="md"
                                fontWeight="bold"
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                              >
                                75{' '}
                                <Text
                                  _light={{ color: 'coolGray.500' }}
                                  _dark={{ color: 'coolGray.400' }}
                                  fontSize="xs"
                                  letterSpacing={0.5}
                                >
                                  Kgs
                                </Text>
                              </Text>
                              <Icon
                                as={AntDesign}
                                name={'arrowdown'}
                                size={4}
                                color="emerald.700"
                                mr={2}
                              />
                            </HStack>
                          </VStack>
                        </Box>
                      </HStack>
                    </Hidden>

                    <Hidden from="base" till="md">
                      <HStack flexWrap="wrap" justifyContent="space-between">
                        <Box
                          shadow="4"
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height={56}
                          width={{ base: '47%', sm: '32%', md: '28%' }}
                          borderRadius={16}
                          mt={4}
                        >
                          <VStack flex="1">
                            <HStack justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="xl"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Steps
                              </Text>
                              <Box
                                height={7}
                                width={7}
                                borderRadius={16}
                                _light={{ bg: 'rose.500' }}
                                _dark={{ bg: '#F87171' }}
                                mt={4}
                                mr={4}
                              >
                                <HStack>
                                  <Icon
                                    as={MaterialCommunityIcons}
                                    name="shoe-print"
                                    size={5}
                                    color="white"
                                    ml={1}
                                    mt={1}
                                  />
                                </HStack>
                              </Box>
                            </HStack>
                            <Center
                              flex="1"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Image
                                height="140px"
                                width="140px"
                                _light={{
                                  source: require('./components/ImageSteps.png'),
                                }}
                                _dark={{
                                  source: require('./components/ImageStepsDarkWeb.png'),
                                }}
                                alt="Alternate Text"
                              />
                            </Center>
                          </VStack>
                        </Box>
                        <Box
                          shadow="4"
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height={56}
                          width={{ base: '47%', sm: '32%', md: '38.5%' }}
                          borderRadius={16}
                          mt={4}
                        >
                          <VStack flex={1}>
                            <HStack justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="xl"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Statistics
                              </Text>
                              <Box
                                height={7}
                                width={7}
                                borderRadius={16}
                                _light={{ bg: 'primary.500' }}
                                _dark={{ bg: '#8B5CF6' }}
                                mt={4}
                                mr={4}
                              >
                                <HStack
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <Icon
                                    as={Ionicons}
                                    name={'stats-chart-sharp'}
                                    size={4}
                                    mt={2}
                                    color="white"
                                    alignSelf="center"
                                  />
                                </HStack>
                              </Box>
                            </HStack>
                            <HStack
                              mt="28px"
                              flex="1"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Center
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Image
                                  height="130px"
                                  width="130px"
                                  _light={{
                                    source: require('./components/ImageStatsLightMobile.png'),
                                  }}
                                  _dark={{
                                    source: require('./components/ImageStatsDarkMobile.png'),
                                  }}
                                  alt="Alternate Text"
                                />
                              </Center>
                              <Center
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Image
                                  height="130px"
                                  width="130px"
                                  _light={{
                                    source: require('./components/ImageStatsLightMobile.png'),
                                  }}
                                  _dark={{
                                    source: require('./components/ImageStatsDarkMobile.png'),
                                  }}
                                  alt="Alternate Text"
                                />
                              </Center>
                            </HStack>
                          </VStack>
                        </Box>
                        <Box
                          shadow="4"
                          mt={{ base: '-80px', md: 4 }}
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height={56}
                          width={{ base: '47%', sm: '32%', md: '28%' }}
                          borderRadius={16}
                        >
                          <VStack flex={1}>
                            <HStack justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="xl"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Calories
                              </Text>
                              <Box
                                height={7}
                                width={7}
                                borderRadius={16}
                                _light={{ bg: 'rose.500' }}
                                _dark={{ bg: '#F87171' }}
                                mt={4}
                                mr={4}
                              >
                                <Center>
                                  <Icon
                                    as={MaterialCommunityIcons}
                                    name={'run'}
                                    size={5}
                                    mt={1}
                                    color="white"
                                    alignSelf="center"
                                  />
                                </Center>
                              </Box>
                            </HStack>

                            <Center
                              flex="1"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Image
                                height="155px"
                                width="155px"
                                _light={{
                                  source: require('./components/ImageCalories.png'),
                                }}
                                _dark={{
                                  source: require('./components/ImageCaloriesDark.png'),
                                }}
                                alt="Alternate Text"
                              />
                            </Center>
                          </VStack>
                        </Box>
                        <Box
                          shadow="4"
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height="170px"
                          width={{ base: '47%', sm: '32%', md: '28%' }}
                          borderRadius={16}
                          mt={4}
                        >
                          <VStack flex={1}>
                            <HStack flex={1} justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="xl"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Cycling
                              </Text>
                              <Box
                                height={7}
                                width={7}
                                borderRadius={16}
                                bg="blue.600"
                                mt={4}
                                mr={4}
                              >
                                <Icon
                                  as={Ionicons}
                                  name={'bicycle'}
                                  size={4}
                                  mt={1.5}
                                  color="white"
                                  alignSelf="center"
                                />
                              </Box>
                            </HStack>
                            <HStack justifyContent="space-between">
                              <Text
                                mb={4}
                                ml={4}
                                mr={4}
                                fontSize="md"
                                fontWeight="bold"
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                              >
                                25{' '}
                                <Text
                                  _light={{ color: 'coolGray.600' }}
                                  _dark={{ color: 'coolGray.300' }}
                                  fontSize="xs"
                                  letterSpacing={0.5}
                                >
                                  Kms
                                </Text>
                              </Text>
                              <VStack>
                                <Pressable
                                  onPress={() => console.log('Pressed stats')}
                                >
                                  <Text
                                    textDecoration="none"
                                    px={1}
                                    color="blue.600"
                                    fontSize="xs"
                                    mt={1}
                                    mr={4}
                                  >
                                    View Stats
                                  </Text>
                                </Pressable>
                                <Divider
                                  orientation="horizontal"
                                  bg="#2563EB"
                                  size={0.5}
                                  h=".8"
                                  mr={4}
                                  width="70%"
                                  alignSelf="center"
                                />
                              </VStack>
                            </HStack>
                          </VStack>
                        </Box>
                        <Box
                          shadow="4"
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height="170px"
                          borderRadius={16}
                          mt={4}
                          width={{ base: '47%', sm: '32%', md: '68.5%' }}
                        >
                          <VStack flex={1}>
                            <HStack flex={1} justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="xl"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Heart
                              </Text>
                              <Box
                                height={7}
                                width={7}
                                borderRadius={16}
                                _light={{ bg: 'emerald.300' }}
                                _dark={{ bg: '#6EE7B7' }}
                                mt={4}
                                mr={4}
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Icon
                                  as={AntDesign}
                                  name={'heart'}
                                  size={4}
                                  ml={0.5}
                                  mt={0.5}
                                  color="white"
                                  alignSelf="center"
                                />
                              </Box>
                            </HStack>
                            <HStack
                              alignItems="center"
                              mb={6}
                              mx="4"
                              space="0.5"
                            >
                              <IconHeart />
                              <IconHeart />
                              <IconHeart />
                              <IconHeart />
                            </HStack>
                          </VStack>
                        </Box>

                        <Box
                          shadow="4"
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height="147px"
                          borderRadius={16}
                          mt={4}
                          width={{ base: '47%', sm: '32%', md: '28%' }}
                        >
                          <VStack flex={1}>
                            <HStack flex={1} justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="xl"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Sleep
                              </Text>
                              <Box
                                height={7}
                                width={7}
                                borderRadius={16}
                                _light={{ bg: 'amber.400' }}
                                _dark={{ bg: '#FBBF24' }}
                                mt={4}
                                mr={4}
                              >
                                <Icon
                                  as={Ionicons}
                                  name={'moon'}
                                  size={3}
                                  mt={2}
                                  color="white"
                                  alignSelf="center"
                                />
                              </Box>
                            </HStack>

                            <Text
                              mb={4}
                              ml={4}
                              mr={4}
                              fontSize="md"
                              fontWeight="bold"
                              _light={{ color: 'coolGray.800' }}
                              _dark={{ color: 'coolGray.100' }}
                            >
                              9{' '}
                              <Text
                                _light={{ color: 'coolGray.600' }}
                                _dark={{ color: 'coolGray.300' }}
                                fontSize="xs"
                                letterSpacing={0.5}
                              >
                                hrs/day
                              </Text>
                            </Text>
                          </VStack>
                        </Box>
                        <Box
                          shadow="4"
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height="147px"
                          width={{ base: '47%', sm: '32%', md: '33.5%' }}
                          borderRadius={16}
                          mt={4}
                        >
                          <VStack flex={1}>
                            <HStack flex={1} justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="xl"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Training
                              </Text>
                              <Box
                                height={7}
                                width={7}
                                borderRadius={16}
                                _light={{ bg: 'red.700' }}
                                _dark={{ bg: '#BE185D' }}
                                mt={4}
                                mr={4}
                              >
                                <Icon
                                  as={AntDesign}
                                  name={'clockcircleo'}
                                  size={4}
                                  mt={1.5}
                                  color="white"
                                  alignSelf="center"
                                />
                              </Box>
                            </HStack>
                            <HStack justifyContent="space-between">
                              <Text
                                mb={4}
                                ml={4}
                                mr={4}
                                fontSize="xs"
                                fontWeight="semibold"
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                              >
                                Upperbody
                              </Text>
                              <VStack>
                                <Text
                                  mr="4"
                                  _light={{ color: 'coolGray.500' }}
                                  _dark={{ color: 'coolGray.400' }}
                                  fontSize="xs"
                                  letterSpacing={0.5}
                                >
                                  45 min
                                </Text>
                              </VStack>
                            </HStack>
                          </VStack>
                        </Box>

                        <Box
                          shadow="4"
                          _light={{
                            bg: 'white',
                          }}
                          _dark={{
                            bg: 'coolGray.700',
                          }}
                          height="147px"
                          width={{ base: '47%', sm: '32%', md: '33.5%' }}
                          borderRadius={16}
                          mt={{ base: '-16px', md: '4' }}
                          mr={{ base: 1.5, md: 1.5 }}
                        >
                          <VStack flex={1}>
                            <HStack flex={1} justifyContent="space-between">
                              <Text
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontSize="xl"
                                fontWeight="bold"
                                mt={4}
                                ml={4}
                              >
                                Progress
                              </Text>
                              <Box
                                height={7}
                                width={7}
                                borderRadius={16}
                                _light={{ bg: 'emerald.700' }}
                                _dark={{ bg: '#047857' }}
                                mt={4}
                                mr={4}
                              >
                                <Icon
                                  as={FontAwesome5}
                                  name={'weight'}
                                  size={3}
                                  mt={2}
                                  color="white"
                                  alignSelf="center"
                                />
                              </Box>
                            </HStack>
                            <HStack alignItems="center" pb="4">
                              <Text
                                ml={4}
                                mr={1}
                                fontSize="md"
                                fontWeight="bold"
                                _light={{ color: 'coolGray.800' }}
                                _dark={{ color: 'coolGray.100' }}
                              >
                                75{' '}
                                <Text
                                  _light={{ color: 'coolGray.500' }}
                                  _dark={{ color: 'coolGray.400' }}
                                  fontSize="xs"
                                  letterSpacing={0.5}
                                >
                                  Kgs
                                </Text>
                              </Text>
                              <Icon
                                as={AntDesign}
                                name={'arrowdown'}
                                size={4}
                                color="emerald.700"
                                mr={2}
                              />
                            </HStack>
                          </VStack>
                        </Box>
                      </HStack>
                    </Hidden>
                  </ScrollView>
                </Tabs.View>
                <Tabs.View>tsdfsdf</Tabs.View>
                <Tabs.View>tsdfsdf</Tabs.View>
              </Tabs.Views>
            </Tabs>
          </VStack>
        </VStack>
      </DashboardLayout>
    </>
  );
}
