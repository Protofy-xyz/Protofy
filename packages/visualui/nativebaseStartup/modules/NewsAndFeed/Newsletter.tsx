import React from 'react';
import { Box, Text, Image, FormControl, Input, Button } from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

function MainImage() {
  return (
    <Box alignItems="center">
      <Image
        width={72}
        height={{ base: '245', md: '253' }}
        _dark={{ source: require('./images/NewsletterDark.png') }}
        _light={{ source: require('./images/NewsletterLight.png') }}
        alt="Alternate Text"
        resizeMode={'contain'}
      />
    </Box>
  );
}

function SupportText() {
  return (
    <Box justifyContent="center" alignItems="center">
      <Text
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        letterSpacing="0.6"
        mt={10}
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Subscribe to our Newsletter
      </Text>
      <Text
        fontSize="sm"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
        mt={2}
        textAlign="center"
        fontWeight="normal"
        width={{ md: '350', lg: '368' }}
      >
        Sign up for our newsletters to get latest news, updates and amazing
        offers delivered directly to your inbox. Submit your details and get a
        sweet weekly email.
      </Text>
    </Box>
  );
}
function InputField() {
  return (
    <FormControl isRequired mt={{ base: 6, md: 10 }} pb={{ base: 4, md: 8 }}>
      <Input placeholder="Enter your email address" py={3} />
    </FormControl>
  );
}
export default function NewsLetter() {
  return (
    <DashboardLayout
      displayScreenTitle
      title="Newsletter"
      displaySidebar={false}
      rightPanelMobileHeader={true}
    >
      <Box
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        px={{ base: 4, md: '140' }}
        pt={8}
        pb={{ base: 4, md: 8 }}
        flex={1}
        rounded={{ md: 'sm' }}
      >
        <MainImage />
        <SupportText />
        <InputField />
        <Button variant="solid" size="lg" mt="auto">
          SUBSCRIBE NOW
        </Button>
      </Box>
    </DashboardLayout>
  );
}
