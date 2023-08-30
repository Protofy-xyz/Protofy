import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  Avatar,
  Image,
  useColorMode,
  IconButton,
  Divider,
  Hidden,
  MoonIcon,
  Menu,
} from 'native-base';

import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

type HeaderProps = {
  title: string;
  showIcons: boolean;
  toggleSidebar: () => void;
};

export default function Header({ ...props }: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      px={{ base: '4', md: '8' }}
      pt={{ base: '4', md: '4' }}
      pb={{ base: '4', md: '4' }}
      borderBottomWidth={{ md: '1' }}
      _dark={{ bg: 'coolGray.900', borderColor: 'coolGray.800' }}
      _light={{
        bg: { base: 'primary.900', md: 'white' },
        borderColor: 'coolGray.200',
      }}
    >
      {/* Mobile header */}
      <Hidden from="md">
        <HStack space="2" justifyContent="space-between">
          <HStack
            flex="1"
            space="2"
            justifyContent="space-between"
            alignItems="center"
          >
            <>
              <HStack alignItems="center" space="1">
                <IconButton
                  variant="ghost"
                  colorScheme="light"
                  icon={
                    <Icon
                      size="6"
                      as={AntDesign}
                      name="arrowleft"
                      color="coolGray.50"
                    />
                  }
                />
                <Text color="coolGray.50" fontSize="lg">
                  {props.title}
                </Text>
              </HStack>
              <IconButton
                variant="ghost"
                colorScheme="light"
                alignSelf="flex-end"
                icon={
                  <Icon
                    size="6"
                    as={MaterialCommunityIcons}
                    name="dots-vertical"
                    color="coolGray.50"
                  />
                }
              />
            </>
          </HStack>
        </HStack>
      </Hidden>
      {/* Desktop header */}
      <Hidden till="md">
        <HStack alignItems="center" justifyContent="space-between">
          <HStack space="4" alignItems="center">
            <IconButton
              variant="ghost"
              colorScheme="light"
              onPress={props.toggleSidebar}
              icon={
                <Icon
                  size="6"
                  name="menu-sharp"
                  as={Ionicons}
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                />
              }
            />
            {colorMode === 'light' ? (
              <Image
                h="10"
                w="56"
                alt="NativeBase Startup+"
                resizeMode="contain"
                source={require('../assets/header_logo_light.png')}
              />
            ) : (
              <Image
                h="10"
                w="56"
                alt="NativeBase Startup+"
                resizeMode="contain"
                source={require('../assets/header_logo_dark.png')}
              />
            )}
          </HStack>

          <HStack space="2" alignItems="center">
            {props.showIcons && (
              <>
                <IconButton
                  variant="ghost"
                  colorScheme="light"
                  icon={
                    <Icon
                      size="6"
                      name="search1"
                      as={AntDesign}
                      _dark={{
                        color: 'coolGray.200',
                      }}
                      _light={{
                        color: 'coolGray.400',
                      }}
                    />
                  }
                />
                <IconButton
                  variant="ghost"
                  colorScheme="light"
                  icon={
                    <Icon
                      size="6"
                      name="bell"
                      as={FontAwesome}
                      _dark={{
                        color: 'coolGray.200',
                      }}
                      _light={{
                        color: 'coolGray.400',
                      }}
                    />
                  }
                />
                <IconButton
                  icon={
                    <Icon
                      size="6"
                      name={'heart'}
                      as={FontAwesome}
                      _dark={{
                        color: 'coolGray.200',
                      }}
                      _light={{
                        color: 'coolGray.400',
                      }}
                    />
                  }
                />
                <IconButton
                  icon={
                    <Icon
                      size="6"
                      _dark={{
                        color: 'coolGray.200',
                      }}
                      _light={{
                        color: 'coolGray.400',
                      }}
                      as={Feather}
                      name={'shopping-cart'}
                    />
                  }
                />
              </>
            )}

            <MoonIcon onPress={() => toggleColorMode()} />

            <Menu
              closeOnSelect={false}
              w="190"
              onOpen={() => console.log('opened')}
              onClose={() => console.log('closed')}
              trigger={(triggerProps) => {
                return (
                  <IconButton
                    {...triggerProps}
                    variant="ghost"
                    colorScheme="light"
                    icon={
                      <Avatar
                        w="8"
                        h="8"
                        _dark={{ borderColor: 'coolGray.800' }}
                        source={require('../assets/SidepannelImage.png')}
                      />
                    }
                  />
                );
              }}
              //@ts-ignore
              _dark={{ bg: 'coolGray.800', borderColor: 'coolGray.700' }}
            >
              <Menu.Group title="Profile">
                <Menu.Item>Account</Menu.Item>
                <Menu.Item>Billing</Menu.Item>
                <Menu.Item>Security</Menu.Item>
              </Menu.Group>
              <Divider mt="3" w="100%" _dark={{ bg: 'coolGray.700' }} />
              <Menu.Group title="Shortcuts">
                <Menu.Item>Settings</Menu.Item>
                <Menu.Item>Logout</Menu.Item>
              </Menu.Group>
            </Menu>
          </HStack>
        </HStack>
      </Hidden>
    </Box>
  );
}
