import React from 'react';
import {
  Box,
  Text,
  VStack,
  Avatar,
  Center,
  Button,
  Input,
  Select,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function PersonInformation() {
  return (
    <>
      <Avatar size={120} source={require('./images/Payment1.png')} />
      <VStack space={1.5} alignItems="center" mt={5}>
        <Text
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          fontSize="md"
          fontWeight="normal"
        >
          Paying to Kevin John
        </Text>
        <Text
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          fontSize="sm"
          fontWeight="bold"
        >
          Kevinjohn21@okaxis
        </Text>
      </VStack>
    </>
  );
}

function InputFields() {
  return (
    <VStack space="5" width="100%">
      <Input
        placeholder="Email"
        _light={{
          placeholderTextColor: 'coolGray.500',
          color: 'coolGray.800',
        }}
        _dark={{
          placeholderTextColor: 'coolGray.400',
          color: 'coolGray.50',
        }}
      />
      <Select
        placeholder="Select Bank"
        _light={{
          placeholderTextColor: 'coolGray.500',
          color: 'coolGray.800',
        }}
        _dark={{
          placeholderTextColor: 'coolGray.400',
          color: 'coolGray.50',
        }}
      >
        <Select.Item label="SBI" value="sbi" />
        <Select.Item label="ICICI" value="icici" />
        <Select.Item label="Axis Bank" value="axis bank" />
      </Select>
    </VStack>
  );
}

function MainContent() {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
      enableOnAndroid={true}
    >
      <Box
        px={{ base: 4, md: 32, xl: 140 }}
        py={{ base: 5, md: 8 }}
        safeAreaBottom
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        rounded={{ md: 'sm' }}
        flex={1}
        justifyContent="space-between"
      >
        <Center mb={10}>
          <VStack width="100%" alignItems="center" space={{ base: 5, md: 12 }}>
            <PersonInformation />
            <InputFields />
          </VStack>
        </Center>
        <Button variant="solid" size="lg" mt="auto">
          SEND
        </Button>
      </Box>
    </KeyboardAwareScrollView>
  );
}

export default function () {
  return (
    <DashboardLayout title="UPI Pay" displaySidebar={false}>
      <MainContent />
    </DashboardLayout>
  );
}
