import React from 'react';
import { Box, Text, VStack, Avatar, Image, Button, Hidden } from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

function PersonInformation() {
  return (
    <Box flexDirection={{ md: 'row', base: 'column' }} alignItems="center">
      <Avatar width={50} height={50} source={require('./images/janedoe.png')} />
      <VStack
        ml={{ md: 4 }}
        mt={{ base: 1.5, md: 0 }}
        justifyContent={{ md: 'center' }}
        alignItems="center"
      >
        <Text
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          fontSize="md"
          fontWeight="medium"
        >
          Abraham Khan
        </Text>
        <Text
          fontSize="xs"
          _light={{ color: 'coolGray.400' }}
          _dark={{ color: 'coolGray.400' }}
          fontWeight="medium"
        >
          Abrahamfo@okaxis
        </Text>
      </VStack>
    </Box>
  );
}
function QrCode() {
  return (
    <>
      <Image
        mt={{ base: 4, md: 8 }}
        size="255"
        alt="Login QR Code"
        source={require('./images/QR.png')}
      />
      <Hidden till="md">
        <Text
          mt="5"
          fontSize="sm"
          fontWeight="medium"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.300' }}
        >
          Please show this at the store
        </Text>
      </Hidden>
    </>
  );
}

export default function () {
  return (
    <>
      <DashboardLayout
        displaySidebar={false}
        title="QR Code"
        displayNotificationButton={false}
        rightPanelMobileHeader={true}
      >
        <VStack
          px={{ base: 4, md: 8 }}
          pt={{ base: 5, md: 10 }}
          pb={{ base: 4, md: 10 }}
          rounded={{ md: 'sm' }}
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
          flex={1}
        >
          <Box
            alignItems="center"
            py={{ base: 12, md: 10 }}
            my={{ base: 16, md: 20 }}
            mx={{ base: 0, md: '140' }}
            _light={{ bg: 'primary.50' }}
            _dark={{ bg: 'coolGray.700' }}
            borderRadius="lg"
          >
            <PersonInformation />
            <QrCode />
          </Box>
          <Hidden from="md">
            <Button mt="auto" variant="solid" size="lg">
              OPEN CODE SCANNER
            </Button>
          </Hidden>
        </VStack>
      </DashboardLayout>
    </>
  );
}
