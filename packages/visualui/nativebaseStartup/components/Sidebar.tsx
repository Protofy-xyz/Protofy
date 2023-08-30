import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  ScrollView,
  HStack,
  Icon,
  Text,
  Divider,
  Button,
  IconButton,
  Image,
} from 'native-base';
import { useAppStore } from 'baseapp/context/appStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter } from '../../utils/utils';

type Icon = {
  iconName: string;
  iconText: string;
};
const list: any[] = [
  {
    iconName: 'rocket-launch',
    iconText: 'My Projects',
    path: '/'
  },
  {
    iconName: 'discord',
    iconText: 'Discord',
    url: 'https://discord.com/channels/980798274292305930/980798274292305933'
  },
  {
    iconName: 'github',
    iconText: 'GitHub',
    url: 'https://github.com/Protofy-xyz'
  }
];

export default function Sidebar() {
  const router = useRouter()
  const logout = useAppStore((state) => state.logout)
  const session = useAppStore((state) => state.session)

  const _logout = async () => {
    await logout()
    router.push('/login')
  }

  const currentUser = session.userInfo

  const getName = () => (session.loggedIn) ? capitalizeFirstLetter(currentUser.email.split('@')[0]) : 'Guest'

  const name = getName()
  const email = currentUser.email ?? 'protofito@protofy.xyz'

  useEffect(() => {
    // Prefetch the dashboard page
    list.forEach((item) => {
      if (item?.path) {
        router.prefetch(item.path)
      }
      router.prefetch('/login')
    })
  }, [])

  return (
    <Box
      w="80"
      borderRightWidth="1"
      _light={{ bg: 'white', borderRightColor: 'coolGray.200' }}
      _dark={{ bg: 'coolGray.900', borderRightColor: 'coolGray.800' }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <VStack
          pb="10"
          mt="10"
          alignItems="center"
          borderBottomWidth="1"
          _light={{
            borderBottomColor: 'coolGray.200',
          }}
          _dark={{
            borderBottomColor: 'coolGray.800',
          }}
        >
          <Image
            width={{ base: 20, md: 70 }}
            height={{ base: 20, md: 70 }}
            // source={protofitos[Object.keys(protofitos)[Math.floor(Math.random() * (Object.keys(protofitos).length - 1))]]}
            source={require('/platform/packages/frontend/app/src/plugins/visualui/assets/protofitos/protofito-color-1.png')}
            alt="Alternate Text"
            resizeMode='contain'
          />
          <HStack alignItems="center" justifyContent="center" space="2" pt={3}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              _light={{ color: 'coolGray.800' }}
            >
              {name}
            </Text>
          </HStack>
          <Text
            fontSize="sm"
            fontWeight="medium"
            textAlign="center"
            pt={1}
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            {email}
          </Text>
        </VStack>
        <VStack px="4" py="4">
          {list.map((item, idx) => {
            return (
              <Button
                key={idx}
                variant="ghost"
                justifyContent="flex-start"
                onPress={() => router.push(item.hasOwnProperty('url') ? item.url : item.path)}
                py="3"
                px="5"
                _light={{
                  _text: { color: 'coolGray.800' },
                  _icon: { color: 'coolGray.800' },
                }}
                _dark={{
                  _text: { color: 'coolGray.50' },
                  _icon: { color: 'coolGray.50' },
                }}
                _text={{
                  fontSize: 'md',
                  fontWeight: 'medium',
                }}
                _hover={{
                  _text: {
                    _light: {
                      color: 'primary.900',
                    },
                    _dark: {
                      color: 'primary.500',
                    },
                  },

                  _icon: {
                    _light: {
                      color: 'primary.900',
                    },
                    _dark: {
                      color: 'primary.500',
                    },
                  },
                  _light: {
                    bg: 'primary.100',
                  },
                  _dark: {
                    bg: 'coolGray.800',
                  },
                }}
                leftIcon={
                  <Icon
                    size="5"
                    mr="2"
                    as={MaterialCommunityIcons}
                    name={item.iconName}
                  />
                }
              >
                {item.iconText}
              </Button>
            );
          })}
        </VStack>
      </ScrollView>
      <Divider _dark={{ bgColor: 'coolGray.800' }} />
      <Box px="6" py="4">
        <Button
          onPress={_logout}
          variant="ghost"
          justifyContent="flex-start"
          p="3"
          leftIcon={
            <Icon size="5" mr="2" as={MaterialCommunityIcons} name="exit-to-app" />
          }
          _light={{
            _text: { color: 'coolGray.800' },
            _icon: { color: 'coolGray.800' },
          }}
          _dark={{
            _text: { color: 'coolGray.50' },
            _icon: { color: 'coolGray.50' },
          }}
          _text={{
            fontSize: 'md',
            fontWeight: 'medium',
          }}
          _hover={{
            _text: {
              _light: {
                color: 'primary.900',
              },
              _dark: {
                color: 'primary.500',
              },
            },

            _icon: {
              _light: {
                color: 'primary.900',
              },
              _dark: {
                color: 'primary.500',
              },
            },
            _light: {
              bg: 'primary.100',
            },
            _dark: {
              bg: 'coolGray.800',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
