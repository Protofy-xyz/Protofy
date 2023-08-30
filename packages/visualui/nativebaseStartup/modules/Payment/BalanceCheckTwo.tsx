import React from 'react';
import { Text, VStack, Image } from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

function AccountInfo() {
  return (
    <VStack alignItems="center" space={2} mt={{ base: 12, md: 10 }}>
      <Text
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
        lineHeight="21"
        fontSize="sm"
        fontWeight="medium"
      >
        Saving Account
      </Text>
      <Text
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        fontSize="md"
        fontWeight="bold"
        lineHeight="21"
      >
        Axis Bank of India - 2445
      </Text>
    </VStack>
  );
}

function AccountBalance() {
  return (
    <VStack alignItems="center" space={2} mt={{ base: 6, md: 10 }}>
      <Text
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
        fontSize="sm"
        fontWeight="medium"
        lineHeight="21"
      >
        Account Balance
      </Text>
      <Text
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        fontSize="md"
        fontWeight="bold"
        lineHeight="21"
      >
        Rs. 10,000.00
      </Text>
    </VStack>
  );
}
export default function BalanceCheckTwo() {
  return (
    <DashboardLayout title="Account balance" displaySidebar={false}>
      <VStack
        flex={1}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'coolGray.50' }}
        _dark={{ bg: 'coolGray.800' }}
      >
        <VStack mt={{ base: 20, md: '120' }} alignItems="center">
          <Image
            source={require('./images/Payment3.png')}
            height={40}
            width={40}
            alt="Alternate Text"
          />
          <AccountInfo />
          <AccountBalance />
        </VStack>
      </VStack>
    </DashboardLayout>
  );
}
