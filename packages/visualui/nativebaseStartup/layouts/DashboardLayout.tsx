import React, { forwardRef } from 'react';
import {
  Box,
  VStack,
  ScrollView,
  StatusBar,
  HStack,
  Pressable,
  Icon,
  Image,
  Text,
  Hidden,
  useColorMode,
  IconButton,
  Divider,
  Menu,
  Input,
  MoonIcon,
  useColorModeValue,
  SunIcon,
  Button,
} from 'native-base';

import { AntDesign, FontAwesome } from '@expo/vector-icons';

import Sidebar from '../components/Sidebar';

import SidebarHomeAndMenu from '../components/SidebarHomeAndMenu';
import SidebarPodcastScreen from '../components/SidebarPodcastScreen';
import SidebarTopPerformingStocks from '../components/SidebarTopPerformingStocks';
import { useAppStore } from 'baseapp/context/appStore';

type DashboardLayoutProps = {
  user?: any,
  scrollable?: boolean;
  displayScreenTitle?: boolean;
  displaySidebar?: boolean;
  displayBackButton?: boolean;
  showIcons?: boolean;
  displaySearchButton?: boolean;
  displayNotificationButton?: boolean;
  displayMenuButton?: boolean;
  displayAlternateMobileHeader?: boolean;
  maxWidth?: number;
  header?: {
    searchbar: boolean;
  };
  mobileHeader?: {
    backButton: boolean;
  };
  sideBar?: any;
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  showGroupInfoHeader?: boolean;
  displayBackIcon?: boolean;
  rightPanelMobileHeader?: boolean;
};

type MainContentProps = DashboardLayoutProps;

type MobileHeaderProps = {
  title: string;
  subTitle?: string;
  backButton: boolean;
  rightPanel?: boolean;
};

type HeaderProps = {
  title: string;
  subTitle?: string;
  toggleSidebar: () => void;
  menuButton: boolean;
  searchbar: boolean;
};

export function Header(props: HeaderProps) {
  const logout = useAppStore((state) => state.logout)
  const { toggleColorMode } = useColorMode();
  return (
    <Box
      px="6"
      pt="3"
      pb="5"
      borderBottomWidth="1"
      _dark={{ bg: 'coolGray.900', borderColor: 'coolGray.800' }}
      _light={{
        bg: { base: 'primary.900', md: 'white' },
        borderColor: 'coolGray.200',
      }}
    >
      <VStack alignSelf="center" width="100%">
        <HStack alignItems="center" justifyContent="space-between">
          <HStack space="3" alignItems="center">
            <Pressable
              onPress={() => {
                console.log('hello');
              }}
            >
              {useColorModeValue(
                <Image
                  h="3"
                  w="18"
                  alt="Menu"
                  resizeMode="contain"
                  source={{ "uri": "https://cloud.protofy.xyz/public/nativebaseStartup/menu_light.png" }}
                />
                ,
                <Image
                  h="3"
                  w="18"
                  alt="Menu"
                  resizeMode="contain"
                  source={{ "uri": "https://cloud.protofy.xyz/public/nativebaseStartup/menu_dark.png" }}
                />
              )}

            </Pressable>
            <Image
              h="10"
              w="56"
              alt="NativeBase Startup+"
              resizeMode="contain"
              source={{ "uri": "https://cloud.protofy.xyz/public/nativebaseStartup/logo_light.png" }}

            />
          </HStack>
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

          <HStack space="3" alignItems="center">
            <Pressable onPress={toggleColorMode}>
              {useColorModeValue(<MoonIcon size="6" />, <SunIcon size="6" />)}
            </Pressable>

            <Menu
              closeOnSelect={false}
              w="200"
              placement="bottom right"
              onOpen={() => console.log('opened')}
              onClose={() => console.log('closed')}
              trigger={(triggerProps) => {
                return (
                  <Button variant="unstyled" p="0" {...triggerProps}>
                    <Image
                      w="8"
                      h="8"
                      source={{ "uri": "https://cloud.protofy.xyz/public/nativebaseStartup/pannel.png" }}
                      alt="Alternate Text"
                      size="xs"
                    />
                  </Button>
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
      </VStack>
    </Box>
  );
}

function MainContent(props: MainContentProps) {
  return (
    <VStack maxW={props.maxWidth} flex={1} width="100%">
      {props.displayScreenTitle && (
        <Hidden till="md">
          <HStack mb="4" space={4}>
            <Pressable
              onPress={() => {
                console.log('hello');
              }}
            >
              <Icon
                size="6"
                pt="0.5"
                as={AntDesign}
                name={'arrowleft'}
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              />
            </Pressable>
            <VStack>
              <Text
                fontSize="lg"
                fontWeight="medium"
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
              >
                {props.title}
              </Text>
              <Text
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
                fontSize="sm"
                fontWeight="normal"
              >
                {props.subTitle}
              </Text>
            </VStack>
          </HStack>
        </Hidden>
      )}
      {props.children}
    </VStack>
  );
}

function getSidebar(title: string) {
  switch (title) {
    case 'cloud':
    case 'Class 12th':
      return <SidebarHomeAndMenu />;
    case 'Podcasts':
      return <SidebarPodcastScreen />;
    case 'Video Library':
      return <SidebarPodcastScreen />;
    case 'Playlist':
      return <SidebarPodcastScreen />;
    case 'Dashboard':
      return <SidebarTopPerformingStocks />;

    default:
      return <Sidebar />;
  }
}

export default forwardRef(({
  user = {
    email: ''
  },
  sideBar = false,
  displayScreenTitle = true,
  displaySidebar = true,
  header = {
    searchbar: false,
  },
  maxWidth = 1016,
  mobileHeader = {
    backButton: true,
  },
  ...props
}: DashboardLayoutProps, ref) => {
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(false);
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
        <Header
          toggleSidebar={toggleSidebar}
          title={props.title}
          subTitle={props.subTitle}
          menuButton={displaySidebar}
          searchbar={header.searchbar}
        />
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
            <Hidden till="md">{sideBar ? sideBar : getSidebar(props.title)}</Hidden>
          )}

          <Hidden till="md">
            <ScrollView
              flex={1}
              p={{ md: 8 }}
              contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <MainContent
                {...props}
                displayScreenTitle={displayScreenTitle}
                maxWidth={maxWidth}
              />
            </ScrollView>
          </Hidden>

          <Hidden from="md">
            <MainContent {...props} displayScreenTitle={displayScreenTitle} />
          </Hidden>
        </Box>
      </VStack>
    </Box>
  );
})
