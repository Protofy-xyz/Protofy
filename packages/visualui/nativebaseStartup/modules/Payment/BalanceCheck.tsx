import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  Divider,
  Pressable,
  ScrollView,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Carousel } from '../../components/Carousel';

type Upi = {
  imageUri: ImageSourcePropType;
  bankName: string;
};

const upiList: Upi[] = [
  {
    imageUri: require('./images/Payment6.png'),
    bankName: 'Axis Bank of India - 2445',
  },
  {
    imageUri: require('./images/Payment4.png'),
    bankName: 'State Bank of India - 2445',
  },

  {
    imageUri: require('./images/Payment5.png'),
    bankName: 'Bank of India - 2445',
  },
];

const CarouselLayout = () => {
  return (
    <Box
      px={{ base: '4', md: 0 }}
      py={{ base: '5', md: 0 }}
      _light={{ bg: 'transparent' }}
      _dark={{ bg: 'transparent' }}
      height={{ base: 64, md: 80 }}
    >
      <Carousel
        images={[
          require('./images/Payment7.png'),
          require('./images/Payment10.png'),
          require('./images/Payment11.png'),
          require('./images/Payment12.png'),
        ]}
        height={{ base: 64, md: 80 }}
        activeIndicatorBgColor="coolGray.500"
        inactiveIndicatorBgColor="coolGray.300"
      />
    </Box>
  );
};

function WalletPay() {
  return (
    <HStack alignItems="center" space="3">
      <Icon
        as={MaterialIcons}
        name="account-balance-wallet"
        size="6"
        _light={{ color: 'primary.900' }}
        _dark={{ color: 'primary.500' }}
      />
      <Text
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        fontSize="sm"
        fontWeight="normal"
      >
        Wallet Pay
      </Text>
      <Icon
        ml="auto"
        as={MaterialIcons}
        name="chevron-right"
        size="6"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.300' }}
      />
    </HStack>
  );
}

function BankList() {
  return (
    <VStack divider={<Divider />}>
      {upiList.map((item, index) => {
        return (
          <Pressable
            py={4}
            key={index + Math.random()}
            _light={{
              _hover: { bg: 'primary.100' },
              _pressed: { bg: 'coolGray.200' },
            }}
            _dark={{
              _hover: { bg: 'coolGray.600' },
              _pressed: { bg: 'coolGray.500' },
            }}
          >
            <HStack alignItems="center" key={index} px="4" space="3">
              <Image
                source={item.imageUri}
                alt="logo"
                height="9"
                width="9"
                borderRadius="4"
              />
              <Text
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
                fontSize="sm"
                fontWeight="medium"
              >
                {item.bankName}
              </Text>

              <Icon
                ml="auto"
                as={MaterialIcons}
                name="chevron-right"
                size="6"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
              />
            </HStack>
          </Pressable>
        );
      })}
    </VStack>
  );
}
export default function BalanceCheck() {
  return (
    <DashboardLayout
      title="Balance Check"
      displaySidebar={false}
      rightPanelMobileHeader={false}
    >
      <CarouselLayout />
      <ScrollView>
        <VStack space="4" mt={{ md: 5 }}>
          <Box
            rounded={{ md: 'sm' }}
            _light={{ bg: 'white' }}
            _dark={{ bg: 'coolGray.800' }}
            borderRadius="sm"
            mx={{ base: 4, md: 0 }}
          >
            <Text
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
              fontWeight="medium"
              fontSize="sm"
              p={4}
            >
              UPI Bank Accounts
            </Text>
            <BankList />
          </Box>
          <Box
            rounded={{ md: 'sm' }}
            _light={{ bg: 'white' }}
            _dark={{ bg: 'coolGray.800' }}
            borderRadius={4}
            mx={{ base: 4, md: 0 }}
            pb={{ base: 0, md: 1 }}
          >
            <Text
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
              fontWeight="medium"
              fontSize="sm"
              p={4}
            >
              Wallet
            </Text>
            <Pressable
              px={4}
              py={4}
              _light={{
                _hover: { bg: 'primary.100' },
                _pressed: { bg: 'coolGray.200' },
              }}
              _dark={{
                _hover: { bg: 'coolGray.600' },
                _pressed: { bg: 'coolGray.500' },
              }}
            >
              <WalletPay />
            </Pressable>
          </Box>
        </VStack>
      </ScrollView>
    </DashboardLayout>
  );
}
