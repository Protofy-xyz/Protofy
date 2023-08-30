import React from 'react';
import {
  Text,
  VStack,
  Button,
  Image,
  useColorModeValue,
  Box,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

import lightMode from './images/light.png';
import darkMode from './images/dark.png';

function ScreenText() {
  return (
    <VStack
      mt={{ base: 12, md: 8 }}
      space={3}
      pb={{ md: 8 }}
      alignItems="center"
    >
      <Text
        fontSize="2xl"
        textAlign="center"
        lineHeight="31"
        fontWeight="bold"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
      >
        Let’s pair with other devices?
      </Text>
      <Text
        fontSize="sm"
        textAlign="center"
        fontWeight="normal"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
        width="358"
      >
        Turn on your Bluetooth connection settings and get ready to connect with
        other nearby devices. It is going to take only few seconds.
      </Text>
    </VStack>
  );
}

export default function BluetoothPairing() {
  const imgSrc = useColorModeValue(lightMode, darkMode);
  return (
    <DashboardLayout displaySidebar={false} title="Bluetooth Pairing">
      <Box
        px={{ base: 4, md: 32 }}
        pt={{ base: 8, md: 20 }}
        pb={{ base: 4, md: 8 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        flex={1}
        alignItems="center"
      >
        <Image
          key={imgSrc}
          w="297"
          h="218"
          source={imgSrc}
          alt="Alternate Text"
        />
        <ScreenText />
        <Button variant="solid" mt="auto" w="100%" maxW="736">
          PAIR DEVICE
        </Button>
      </Box>
    </DashboardLayout>
  );
}
