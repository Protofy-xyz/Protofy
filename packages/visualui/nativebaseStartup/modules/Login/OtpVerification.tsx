import React, { useRef, useState } from 'react';
import {
  VStack,
  Box,
  HStack,
  Icon,
  Text,
  Button,
  Image,
  IconButton,
  Center,
  FormControl,
  Hidden,
  Input,
  Pressable,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import GuestLayout from '../../layouts/GuestLayout';

function PinInput() {
  const firstInput = useRef<HTMLDivElement>(null);
  const secondInput = useRef<HTMLDivElement>(null);
  const thirdInput = useRef<HTMLDivElement>();
  const fourthInput = useRef<HTMLDivElement>();
  const fifthInput = useRef<HTMLDivElement>();
  const sixthInput = useRef<HTMLDivElement>();

  const refList = [
    firstInput,
    secondInput,
    thirdInput,
    fourthInput,
    fifthInput,
    sixthInput,
  ];
  return (
    <HStack space="2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Input
          keyboardType="numeric"
          width={{ base: '14%', md: '13%', lg: '12%' }}
          ref={refList[i - 1]}
          textAlign="center"
          variant="unstyled"
          maxLength={1}
          borderBottomWidth="2"
          onChangeText={(text) => {
            if (text.length === 1) {
              refList[i].current?.focus();
            }
          }}
          _light={{ color: 'coolGray.800', borderBottomColor: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400', borderBottomColor: 'coolGray.100' }}
          rounded={0}
        />
      ))}
      <Input
        keyboardType="numeric"
        width={{ base: '14%', md: '13%', lg: '12%' }}
        ref={sixthInput}
        textAlign="center"
        variant="unstyled"
        maxLength={1}
        borderBottomWidth="2"
        onChangeText={() => {
          console.log('move to next route12');
        }}
        _light={{ color: 'coolGray.800', borderBottomColor: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400', borderBottomColor: 'coolGray.100' }}
        rounded={0}
      />
    </HStack>
  );
}
function Header() {
  return (
    <HStack space="2" px="1" mt="4" mb="5" alignItems="center">
      <IconButton
        p={0}
        icon={
          <Icon
            alignItems="center"
            justifyContent="center"
            size="6"
            as={MaterialIcons}
            name="keyboard-backspace"
            color="coolGray.50"
          />
        }
        onPress={() => {
          // back button Logic
        }}
      />
      <Text color="coolGray.50" fontSize="lg">
        OTP Verification
      </Text>
    </HStack>
  );
}
function SideContainerWeb() {
  return (
    <Center
      flex="1"
      _light={{ bg: 'primary.900' }}
      _dark={{ bg: 'primary.700' }}
      px={{ base: '4', md: '8' }}
      borderTopLeftRadius={{ md: 'xl' }}
      borderBottomLeftRadius={{ md: 'xl' }}
    >
      <Image
        h="24"
        size="80"
        alt="NativeBase Startup+ "
        resizeMode={'contain'}
        source={require('./images/logo.png')}
      />
    </Center>
  );
}
function MainText() {
  return (
    <VStack space={{ base: '3', md: '4' }}>
      <Text
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="bold"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
      >
        Enter OTP
      </Text>
      <HStack space="2" alignItems="center">
        <Text
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.400' }}
          fontSize="sm"
        >
          We have sent the OTP code to
          <Text
            fontWeight="bold"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.400' }}
            fontSize="sm"
          >
            {''} 87******47
          </Text>
        </Text>
      </HStack>
    </VStack>
  );
}

function AccountLink() {
  return (
    <HStack
      mt="28"
      space="1"
      safeAreaBottom
      alignItems="center"
      justifyContent="center"
    >
      <Text
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.400' }}
        fontSize="sm"
        fontWeight="normal"
      >
        Already have an account?
      </Text>

      <Pressable>
        <Text
          fontWeight="bold"
          textDecoration="none"
          fontSize="sm"
          _light={{
            color: 'primary.900',
          }}
          _dark={{
            color: 'primary.500',
          }}
        >
          Sign In
        </Text>
      </Pressable>
    </HStack>
  );
}

function ResendLink() {
  return (
    <HStack>
      <Text
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.400' }}
        fontSize="sm"
      >
        Didn’t receive the OTP?{' '}
      </Text>
      <Pressable alignSelf="center">
        <Text
          _light={{ color: 'primary.900' }}
          _dark={{ color: 'primary.500' }}
          fontWeight="bold"
          textDecoration="none"
          fontSize="sm"
        >
          RESEND OTP
        </Text>
      </Pressable>
    </HStack>
  );
}
export default function OtpVerification() {
  return (
    <GuestLayout>
      <Hidden from="md">
        <Header />
      </Hidden>

      <Hidden till="md">
        <SideContainerWeb />
      </Hidden>
      <Box
        py={{ base: '8', md: '8' }}
        px={{ base: '4', md: '8' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        flex="1"
        borderTopRightRadius={{ md: 'xl' }}
        borderBottomRightRadius={{ md: 'xl' }}
      >
        <VStack justifyContent="space-between" flex="1" space="24">
          <Box>
            <MainText />
            <VStack space={{ base: '12', md: '8' }} mt="6">
              <FormControl>
                <PinInput />
                <FormControl.HelperText mt="8">
                  <ResendLink />
                </FormControl.HelperText>
              </FormControl>
              <Button variant="solid" size="lg">
                PROCEED
              </Button>
            </VStack>
          </Box>
          <AccountLink />
        </VStack>
      </Box>
    </GuestLayout>
  );
}
