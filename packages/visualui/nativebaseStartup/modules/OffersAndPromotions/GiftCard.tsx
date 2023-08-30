import React from 'react';
import {
  Text,
  VStack,
  Button,
  Image,
  Box,
  Radio,
  HStack,
  useColorModeValue,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

function GiftCard() {
  return (
    <HStack
      space={3}
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: 'coolGray.700' }}
      rounded="sm"
      p={3}
    >
      <Image
        source={require('./images/gift.png')}
        alt="Alternate Text"
        width="74"
        height="90"
        rounded="sm"
      />
      <Box>
        <Text
          fontSize="md"
          fontWeight="bold"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Amazon
        </Text>
        <Text
          fontSize="sm"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        >
          Non- returnable/non-replaceable
        </Text>
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          mt="auto"
        >
          Voucher worth ₹5000
        </Text>
      </Box>
    </HStack>
  );
}

function GiftCardDescription() {
  const textStyle = {
    fontSize: 'sm',
    color: useColorModeValue('coolGray.800', 'coolGray.50'),
  };
  return (
    <VStack space={8} mt={8}>
      <Box>
        <Text fontWeight="medium" {...textStyle}>
          About
        </Text>
        <Text
          fontWeight="normal"
          fontSize="sm"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          mt={2}
        >
          Online shopping from the biggest e-com company.Biggest collection of
          magazines, books ,electronics and fashions appeals
        </Text>
      </Box>
      <Box>
        <Text fontWeight="medium" {...textStyle}>
          Details
        </Text>
        <Text
          fontSize="sm"
          fontWeight="normal"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          mt={2}
        >
          The Voucher of worth of RS 5000
        </Text>
      </Box>
      <Box>
        <Text fontWeight="medium" {...textStyle}>
          Delievery Options
        </Text>
        <Radio.Group mt={4} name="myRadioGroup" flexDirection="row">
          <Radio
            value="one"
            _text={{
              fontWeight: 'normal',
              ...textStyle,
            }}
          >
            Buy for Self
          </Radio>
          <Radio
            ml={6}
            value="two"
            _text={{
              fontWeight: 'normal',
              ...textStyle,
            }}
          >
            Send a Gift
          </Radio>
        </Radio.Group>
      </Box>
    </VStack>
  );
}

function MainContent() {
  return (
    <Box
      flex={1}
      rounded={{ md: 'sm' }}
      _light={{ bg: { md: 'white' } }}
      _dark={{ bg: { base: 'coolGray.700', md: 'coolGray.800' } }}
      px={{ md: 4, lg: '140' }}
      pb={{ md: 8 }}
      mb={4}
    >
      <Box
        px={{ base: 4, md: 0 }}
        py={{ base: 3, md: 8 }}
        _light={{ bg: { base: 'white' } }}
        _dark={{ bg: { base: 'coolGray.800' } }}
      >
        <GiftCard />
        <GiftCardDescription />
      </Box>
      <Button variant="solid" mt="auto" mx={{ base: 4, md: 0 }}>
        BUY FOR 5000
      </Button>
    </Box>
  );
}

export default function () {
  return (
    <DashboardLayout title="Gift Cards">
      <MainContent />
    </DashboardLayout>
  );
}
