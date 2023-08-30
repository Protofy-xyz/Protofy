import React from 'react';
import { Box, VStack, Button, Image, Center, Hidden } from 'native-base';
import GuestLayout from '../../layouts/GuestLayout';

function ActionButtons() {
  return (
    <VStack space={4} mt={{ base: 10, md: 12 }}>
      <Button variant="subtle" py={4}>
        LOGIN
      </Button>
      <Button
        variant="outline"
        py={4}
        borderColor="secondary.100"
        _text={{
          color: 'coolGray.50',
        }}
        _hover={{
          bg: 'primary.600',
        }}
        _pressed={{
          bg: 'primary.700',
        }}
      >
        SIGN UP
      </Button>
    </VStack>
  );
}
function HeaderLogo() {
  return (
    <Box alignItems="center" justifyContent="center">
      <Hidden from="md">
        <Image
          source={require('./images/splash.png')}
          height="200"
          width="250"
          alt="Alternate Text"
        />
      </Hidden>
      <Hidden from="base" till="md">
        <Image
          source={require('./images/webimage.png')}
          height="66"
          width="375"
          alt="Alternate Text"
        />
      </Hidden>
    </Box>
  );
}
export default function Splash() {
  return (
    <GuestLayout>
      <Center w="100%" flex={1}>
        <Box
          maxW="500"
          w="100%"
          height={{ md: '544' }}
          px={{ base: 4, md: 8 }}
          bg={{ md: 'primary.900' }}
          justifyContent="center"
        >
          <HeaderLogo />
          <ActionButtons />
        </Box>
      </Center>
    </GuestLayout>
  );
}
