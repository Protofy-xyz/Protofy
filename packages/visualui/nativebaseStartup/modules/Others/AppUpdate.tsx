import React from 'react';
import {
  Text,
  VStack,
  Button,
  Image,
  Box,
  useColorModeValue,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
import lightModeImg from './images/appupdate.png';
import darkModeImg from './images/appupdatedark.png';

function ScreenButtons() {
  return (
    <VStack mt="auto" width="100%" space={3}>
      <Button variant="solid" size="lg">
        UPDATE
      </Button>
      <Button variant="outline" size="lg">
        NOT NOW
      </Button>
    </VStack>
  );
}

function PageText() {
  return (
    <VStack mt={{ base: 12, md: 8 }} space={3} pb={{ md: 8 }}>
      <Text
        fontSize="2xl"
        textAlign="center"
        fontWeight="bold"
        letterSpacing={0.4}
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'white' }}
      >
        New update available
      </Text>
      <Text
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
        fontSize="sm"
        fontWeight="normal"
        textAlign="center"
        maxW={358}
      >
        The current version of the app is out of date and will stop working
        soon. To keep using, please install the latest update
      </Text>
    </VStack>
  );
}
export default function AppUpdate() {
  const imgSrc = useColorModeValue(lightModeImg, darkModeImg);
  return (
    <DashboardLayout displaySidebar={false} title="App updates">
      <Box
        flex={1}
        px={{ base: 4, md: 140 }}
        pt={8}
        pb={{ base: 4, md: 8 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        alignItems="center"
      >
        <Image size={64} key={imgSrc} source={imgSrc} alt="Alternet Text" />;
        <PageText />
        <ScreenButtons />
      </Box>
    </DashboardLayout>
  );
}
