import React from 'react';
import {
  Box,
  HStack,
  Input,
  Icon,
  Text,
  Avatar,
  Image,
  Pressable,
  useColorMode,
} from 'native-base';

import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';
type PodcastHeaderProps = {
  title: string;
  displaySearchbar?: boolean;
};
export default function PodcastHeader(props: PodcastHeaderProps) {
  const { colorMode } = useColorMode();

  return (
    <Box
      px={{ base: 4, md: 8 }}
      pt={{ base: 12, md: 4 }}
      pb={{ base: 5, md: 4 }}
      borderBottomWidth={{ md: '1' }}
      _dark={{ bg: 'coolGray.900', borderColor: 'coolGray.800' }}
      _light={{
        bg: { base: 'primary.900', md: 'white' },
        borderColor: 'coolGray.200',
      }}
    >
      {/* Mobile header */}
      <HStack
        space="2"
        display={{
          md: 'none',
        }}
        alignItems="center"
      >
        <Pressable
          onPress={() => {
            console.log('hello');
          }}
        >
          <Icon
            size="6"
            as={AntDesign}
            name={'arrowleft'}
            color="coolGray.50"
          />
        </Pressable>

        <Text color="coolGray.50" fontSize="lg">
          {props.title}
        </Text>

        <HStack ml="auto" space="4" alignItems="center">
          <Pressable
            onPress={() => {
              console.log('hello');
            }}
          >
            <Icon
              size="6"
              color="coolGray.50"
              as={MaterialIcons}
              name={'search'}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              console.log('hello');
            }}
          >
            <Icon
              size="6"
              color="coolGray.50"
              as={MaterialCommunityIcons}
              name={'bell-outline'}
            />
          </Pressable>
        </HStack>
      </HStack>
      {/* Desktop header */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        display={{ base: 'none', md: 'flex' }}
      >
        <HStack space="8" alignItems="center">
          <Icon
            size="6"
            name={'menu-sharp'}
            as={Ionicons}
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          />
          {colorMode === 'light' ? (
            <Image
              h="12"
              w="64"
              alt="NativeBase Startup+ "
              resizeMode={'contain'}
              source={require('../assets/header_logo_light.png')}
            />
          ) : (
            <Image
              h="12"
              w="64"
              alt="NativeBase Startup+ "
              resizeMode={'contain'}
              source={require('../assets/header_logo_dark.png')}
            />
          )}
        </HStack>

        {props.displaySearchbar && (
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

        <HStack ml="auto" space="5" alignItems="center">
          <Icon size="6" color="coolGray.400" as={FontAwesome} name={'bell'} />
          <Avatar
            source={require('../assets/women.jpg')}
            borderWidth="2"
            _dark={{
              borderColor: 'primary.700',
            }}
            w="8"
            h="8"
          />
        </HStack>
      </Box>
    </Box>
  );
}
