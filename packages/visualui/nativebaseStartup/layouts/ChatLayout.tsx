import React, {forwardRef} from 'react';
import {
  Box,
  VStack,
  StatusBar,
  HStack,
  Icon,
  Image,
  Text,
  Hidden,
  useColorMode,
  IconButton,
  Divider,
  Menu,
  Avatar,
  MoonIcon,
  Input,
  Pressable,
  useColorModeValue,
} from 'native-base';
type ChatLayoutProps = {
  scrollable?: boolean;
  displayScreenTitle?: boolean;
  displaySidebar?: boolean;
  header?: {
    menuButton: boolean;
    searchbar: boolean;
  };
  mobileHeader?: {
    backButton: boolean;
  };
  title: string;
  subTitle: string;
  children: React.ReactNode;
};
type HeaderProps = {
  toggleSidebar?: () => void;
  title: string;
  menuButton?: boolean;
  searchbar?: boolean;
};
type MobileHeaderProps = {
  title: string;
  subTitle: string;
  backButton?: boolean;
};

type MainContentProps = {
  displayScreenTitle?: boolean;
  children: React.ReactNode;
};

import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

import Sidebar from '../components/Sidebar';
import logo_light from '../assets/header_light.png';
import logo_dark from '../assets/header_dark.png';
import menu_light from '../assets/menu_light.png';
import menu_dark from '../assets/menu_dark.png';

export function Header(props: HeaderProps) {
  const { toggleColorMode } = useColorMode();
  return (
    <Box
      px="6"
      py="3"
      borderBottomWidth="1"
      _dark={{ bg: 'coolGray.900', borderColor: 'coolGray.800' }}
      _light={{
        bg: { base: 'primary.900', md: 'white' },
        borderColor: 'coolGray.200',
      }}
    >
      <HStack alignItems="center" space="3">
        <Pressable>
          <Image
            key={useColorModeValue(1, 2)}
            h="3"
            w="18"
            alt="Menu"
            resizeMode="contain"
            source={useColorModeValue(menu_light, menu_dark)}
          />
        </Pressable>

        <Image
          key={useColorModeValue(1, 2)}
          h="10"
          w="56"
          alt="NativeBase Startup+"
          resizeMode="contain"
          source={useColorModeValue(logo_light, logo_dark)}
        />
        {props.searchbar && (
          <Input
            px="4"
            w="30%"
            size="sm"
            placeholder="Search"
            InputLeftElement={
              <Icon
                px="2"
                size="4"
                name={'search'}
                as={FontAwesome}
                _light={{
                  color: 'coolGray.400',
                }}
                _dark={{
                  color: 'coolGray.100',
                }}
              />
            }
          />
        )}

        <HStack space="2" alignItems="center" ml="auto">
          <IconButton
            p="0"
            variant="unstyled"
            colorScheme="light"
            onPress={toggleColorMode}
            icon={<MoonIcon />}
          />

          <Menu
            closeOnSelect={false}
            w="200"
            placement="bottom right"
            trigger={(triggerProps) => {
              return (
                <IconButton
                  {...triggerProps}
                  variant="ghost"
                  colorScheme="light"
                  p={0}
                  icon={
                    <Image
                      w="8"
                      h="8"
                      source={require('../assets/pannel.png')}
                      alt="Alternate Text"
                      size="xs"
                    />
                  }
                />
              );
            }}
            _dark={{ bg: 'coolGray.800', borderColor: 'coolGray.700' }}
          >
            <Menu.Group title="Profile">
              <Menu.Item>Account</Menu.Item>
            </Menu.Group>
            <Divider mt="3" w="100%" _dark={{ bg: 'coolGray.700' }} />
            <Menu.Group title="Shortcuts">
              <Menu.Item>Settings</Menu.Item>
              <Menu.Item>Logout</Menu.Item>
            </Menu.Group>
          </Menu>
        </HStack>
      </HStack>
    </Box>
  );
}

function MainContent(props: MainContentProps) {
  return (
    <VStack maxW="1016px" flex={1} width="100%">
      {props.children}
    </VStack>
  );
}

export function MobileHeader(props: MobileHeaderProps) {
  return (
    <Box
      px="3"
      py="2"
      _dark={{ bg: 'coolGray.900' }}
      _light={{
        bg: { base: 'primary.900', md: 'white' },
      }}
    >
      <HStack space="3" alignItems="center">
        <IconButton
          colorScheme="light"
          variant="ghost"
          p="0"
          icon={
            <Icon
              size="6"
              as={AntDesign}
              name={'arrowleft'}
              color="coolGray.50"
            />
          }
        />
        <Avatar
          source={require('../modules/SupportAndFeedback/images/ProfileImage.png')}
          _dark={{
            borderColor: 'primary.700',
          }}
          size="8"
        />
        <VStack>
          {props.subTitle ? (
            <>
              <Text color="coolGray.50" fontSize="lg">
                {props.title}
              </Text>
              <Text
                _light={{ color: 'primary.300' }}
                _dark={{ color: 'coolGray.400' }}
                fontSize="sm"
              >
                {props.subTitle}
              </Text>
            </>
          ) : (
            <Text color="coolGray.50" fontSize="lg">
              {props.title}
            </Text>
          )}
        </VStack>
        <HStack ml="auto" space="3" alignItems="center">
          <IconButton
            variant="ghost"
            colorScheme="light"
            p="0"
            icon={
              <Icon
                size="6"
                color="coolGray.50"
                as={MaterialIcons}
                name={'search'}
              />
            }
          />
          <Menu
            p="0"
            trigger={(triggerProps) => {
              return (
                <IconButton
                  variant="ghost"
                  p="0"
                  colorScheme="light"
                  accessibilityLabel="More options menu"
                  {...triggerProps}
                  icon={
                    <Icon
                      size="6"
                      color="coolGray.50"
                      name={'dots-vertical'}
                      as={MaterialCommunityIcons}
                    />
                  }
                />
              );
            }}
            placement="bottom right"
          >
            <Menu.Item _dark={{ bg: 'coolGray.900' }}>New group</Menu.Item>
            <Menu.Item _dark={{ bg: 'coolGray.900' }}>New broadcast</Menu.Item>
            <Menu.Item _dark={{ bg: 'coolGray.900' }}>Settings</Menu.Item>
          </Menu>
        </HStack>
      </HStack>
    </Box>
  );
}

export default forwardRef(({
  displaySidebar = true,
  header = {
    menuButton: true,
    searchbar: false,
  },
  mobileHeader = {
    backButton: true,
  },
  ...props
}: ChatLayoutProps, ref )=> {
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);
  function toggleSidebar() {
    setIsSidebarVisible(!isSidebarVisible);
  }

  return (
    <Box ref={ref}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box
        safeAreaTop
        _light={{ bg: 'primary.900' }}
        _dark={{ bg: 'coolGray.900' }}
      />
      <VStack
        flex={1}
        _light={{ bg: 'warmGrey.50' }}
        _dark={{ bg: 'customGray' }}
      >
        <Hidden from="md">
          <MobileHeader
            title={props.title}
            subTitle={props.subTitle}
            backButton={mobileHeader.backButton}
          />
        </Hidden>
        <Hidden till="md">
          <Header
            toggleSidebar={toggleSidebar}
            title={props.title}
            menuButton={displaySidebar}
            searchbar={header.searchbar}
          />
        </Hidden>
        <Box
          flex={1}
          safeAreaBottom
          flexDirection={{ base: 'column', md: 'row' }}
          _light={{
            borderTopColor: 'coolGray.200',
          }}
          _dark={{
            bg: 'coolGray.700',
            borderTopColor: 'coolGray.700',
          }}
        >
          {isSidebarVisible && displaySidebar && (
            <Hidden till="md">
              <Sidebar />
            </Hidden>
          )}

          <VStack alignItems="center" flex={1} p={{ md: 8 }}>
            <MainContent displayScreenTitle={true} {...props} />
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
})
