import React from 'react';
import {
  Icon,
  Text,
  HStack,
  VStack,
  Center,
  Divider,
  Box,
  Pressable,
  Hidden,
  ScrollView,
  Circle,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';

type CardDetails = {
  holderName: string;
  bankName: string;
  accountNumber: string;
  creditText: string;
  creditLimitAmount: string;
  availableText: string;
  availableLimitAmount: string;
};
type CreditCardProps = {
  item: CardDetails;
};
type Transaction = {
  dateOfTransaction: string;
  monthOfTransaction: string;
  companyName: string;
  refNumber: string;
  amount: string;
};
const cardDetails: CardDetails[] = [
  {
    holderName: 'Hello John',
    bankName: 'Bank of India',
    accountNumber: '2345 XXXX XXXX 3423',
    creditText: 'Credit Limit',
    creditLimitAmount: '$1440.75',
    availableText: 'Available Limit',
    availableLimitAmount: '$140.75',
  },
];

const transactions: Transaction[] = [
  {
    dateOfTransaction: '13',
    monthOfTransaction: 'JUN',
    companyName: 'Amazon payments India',
    refNumber: 'Last Month Due',
    amount: '$124.75',
  },
  {
    dateOfTransaction: '11',
    monthOfTransaction: 'JUN',
    companyName: 'Dianne Russell',
    refNumber: 'Last Month Due',
    amount: '$144.75',
  },
  {
    dateOfTransaction: '18',
    monthOfTransaction: 'JUN',
    companyName: 'Albert Flores',
    refNumber: 'Last Month Due',
    amount: '$411.75',
  },
  {
    dateOfTransaction: '21',
    monthOfTransaction: 'JUN',
    companyName: 'Robert Fox',
    refNumber: 'Last Month Due',
    amount: '$144.75',
  },
];

const CARD_HEIGHT = '192';
const CreditCard = ({ item }: CreditCardProps) => {
  return (
    <Box
      mt={{ base: '2', md: 0 }}
      w={'100%'}
      h={CARD_HEIGHT}
      p="5"
      rounded="lg"
      bg={{
        linearGradient: {
          start: [0, 0],
          end: [1, 1],
          colors: ['emerald.400', 'primary.900'],
        },
      }}
    >
      <VStack>
        <VStack space={3}>
          <Text fontSize="xl" fontWeight="medium" color="coolGray.50">
            {item.holderName}
          </Text>
          <VStack space="1.5">
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="coolGray.50"
              lineHeight="17.5"
            >
              {item.bankName}
            </Text>
            <Text
              fontSize="md"
              color="coolGray.50"
              fontWeight="bold"
              lineHeight="20"
            >
              {item.accountNumber}
            </Text>
          </VStack>
        </VStack>
        <Divider mt={3} _dark={{ bg: 'coolGray.200' }} />
        <HStack justifyContent="space-between" mt={2}>
          <VStack space={1}>
            <Text color="coolGray.50" fontSize="sm" fontWeight="medium">
              {item.creditText}
            </Text>
            <Text
              fontWeight="bold"
              color="coolGray.50"
              fontSize="md"
              lineHeight="20"
            >
              {item.creditLimitAmount}
            </Text>
          </VStack>
          <VStack space={1}>
            <Text color="coolGray.50" fontSize="sm" fontWeight="medium">
              {item.availableText}
            </Text>
            <Text
              fontWeight="bold"
              color="coolGray.50"
              fontSize="md"
              textAlign="right"
              lineHeight="20"
            >
              {item.availableLimitAmount}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

const RecentTransactions = () => {
  return (
    <Box
      rounded="sm"
      pt={{ base: 4, md: 8 }}
      pb={{ base: 0, md: 8 }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      flex={{ md: 1 }}
    >
      <Text
        px={{ base: 4, md: 8 }}
        fontSize="sm"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
        fontWeight="medium"
        mb={{ base: '1', md: '2' }}
      >
        Recent Transactions
      </Text>
      <VStack divider={<Divider _dark={{ bg: 'coolGray.700' }} />}>
        {transactions.map((item, index) => {
          return (
            // <VStack key={index + Math.random()}>
            //   <VStack
            //     px={{ base: 2, md: 4 }}
            //     divider={
            //       <Divider
            //         thickness={1}
            //         _light={{ bg: 'coolGray.200' }}
            //         _dark={{ bg: 'coolGray.700' }}
            //       />
            //     }
            //   >
            <Pressable
              key={index}
              borderRadius="sm"
              py={2}
              my={2}
              _light={{
                _hover: { bg: 'primary.100' },
                _pressed: { bg: 'primary.200' },
              }}
              _dark={{
                _hover: { bg: 'coolGray.700' },
                _pressed: { bg: 'coolGray.600' },
              }}
            >
              <HStack alignItems="center" px={{ base: 2, md: 4 }} space="4">
                <Center
                  _light={{ bg: 'coolGray.100' }}
                  _dark={{ bg: 'coolGray.700' }}
                  px={3}
                  py={1.5}
                  borderRadius="4"
                >
                  <Text
                    fontSize="xs"
                    _light={{ color: 'coolGray.500' }}
                    _dark={{ color: 'coolGray.400' }}
                    fontWeight="medium"
                    lineHeight="18"
                  >
                    {item.dateOfTransaction}
                  </Text>
                  <Text
                    fontSize="xs"
                    _light={{ color: 'coolGray.500' }}
                    _dark={{ color: 'coolGray.400' }}
                    fontWeight="medium"
                    lineHeight="18"
                  >
                    {item.monthOfTransaction}
                  </Text>
                </Center>
                <VStack space="1">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    _light={{ color: 'coolGray.800' }}
                    _dark={{ color: 'coolGray.50' }}
                  >
                    {item.companyName}
                  </Text>
                  <Text
                    fontSize="xs"
                    fontWeight="normal"
                    _light={{ color: 'coolGray.500' }}
                    _dark={{ color: 'coolGray.400' }}
                  >
                    {item.refNumber}
                  </Text>
                </VStack>
                <Text
                  ml="auto"
                  fontSize="sm"
                  fontWeight="medium"
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                >
                  {item.amount}
                </Text>
              </HStack>
            </Pressable>
          );
        })}
      </VStack>
    </Box>
  );
};

const CurrentStatement = () => {
  return (
    <Box _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }} rounded="sm">
      <HStack
        justifyContent="space-between"
        alignItems="center"
        py="3"
        pl="4"
        pr="2"
      >
        <Text
          fontSize="sm"
          fontWeight="normal"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Current Spends
        </Text>
        <Pressable>
          <Icon
            as={MaterialIcons}
            name="chevron-right"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            size="6"
          />
        </Pressable>
      </HStack>

      <HStack
        pt="2"
        pb="3"
        px={4}
        justifyContent="space-between"
        alignItems="center"
      >
        <VStack space="1">
          <Text
            fontSize="xs"
            fontWeight="medium"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            Total Due
          </Text>

          <Text
            fontSize="md"
            fontWeight="bold"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            $144.75
          </Text>
        </VStack>
        <VStack space="1">
          <Text
            fontSize="xs"
            fontWeight="medium"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            Last Month Due
          </Text>

          <Text
            fontSize="md"
            fontWeight="bold"
            textAlign="right"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            $4530.00
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

const UnbilledAndLastPaid = () => {
  return (
    <HStack space="3">
      <HStack
        space="3"
        flex={1}
        py={3}
        px={4}
        maxW="100%"
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        rounded="sm"
        alignItems="center"
      >
        <Circle
          _light={{ bg: 'primary.100' }}
          _dark={{ bg: 'coolGray.700' }}
          p="2"
          width="9"
          height="9"
        >
          <Icon
            as={MaterialIcons}
            name="attach-money"
            _light={{ color: 'primary.900' }}
            _dark={{ color: 'primary.500' }}
            size="5"
          />
        </Circle>
        <VStack space="1">
          <Text
            fontSize="xs"
            fontWeight="medium"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            Unbilled Spents
          </Text>

          <Text
            fontSize="md"
            fontWeight="bold"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            $144.75
          </Text>
        </VStack>
      </HStack>
      <HStack
        space="3"
        flex={1}
        py={3}
        px={4}
        _light={{ bg: 'coolGray.50' }}
        _dark={{ bg: 'coolGray.800' }}
        rounded="sm"
        alignItems="center"
      >
        <Circle
          _light={{ bg: 'primary.100' }}
          _dark={{ bg: 'coolGray.700' }}
          p="2"
          width="9"
          height="9"
        >
          <Icon
            as={MaterialIcons}
            name="account-balance"
            _light={{ color: 'primary.900' }}
            _dark={{ color: 'primary.500' }}
            size="5"
          />
        </Circle>
        <VStack space="1">
          <Text
            fontSize="xs"
            fontWeight="medium"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            Last Paid
          </Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            $154.75
          </Text>
        </VStack>
      </HStack>
    </HStack>
  );
};
function MainComponent() {
  return (
    <>
      <Hidden from="md">
        <ScrollView>
          <>
            <Box
              position="absolute"
              height="32"
              top="0"
              left="0"
              width="100%"
              _light={{ bg: 'primary.900' }}
              _dark={{ bg: 'coolGray.900' }}
            />
            <VStack flex={1} space="4" px="4">
              <CreditCard item={cardDetails[0]} />
              <UnbilledAndLastPaid />
              <CurrentStatement />
              <RecentTransactions />
            </VStack>
          </>
        </ScrollView>
      </Hidden>
      <VStack flex={1}>
        {/* Tablet Layout */}
        <Hidden only={['base', 'sm', 'lg', 'xl', '2xl']}>
          <VStack flex={1} space="4">
            <CreditCard item={cardDetails[0]} />
            <UnbilledAndLastPaid />
            <CurrentStatement />
            <RecentTransactions />
          </VStack>
        </Hidden>

        {/* Desktop Layout */}
        <Hidden from="base" till="lg">
          <Box flex={1}>
            <HStack flex={1} space="5">
              <VStack flex={2} space="4" maxW="358">
                <CreditCard item={cardDetails[0]} />
                <UnbilledAndLastPaid />
                <CurrentStatement />
              </VStack>
              <VStack flex={3}>
                <RecentTransactions />
              </VStack>
            </HStack>
          </Box>
        </Hidden>
      </VStack>
    </>
  );
}
export default function () {
  return (
    <>
      <DashboardLayout
        displayScreenTitle={true}
        displaySidebar={false}
        title="EMI Details"
      >
        <MainComponent />
      </DashboardLayout>
    </>
  );
}
