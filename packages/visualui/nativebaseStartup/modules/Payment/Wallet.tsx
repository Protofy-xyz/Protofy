import React from 'react';
import {
  Icon,
  Text,
  HStack,
  VStack,
  Button,
  Divider,
  Input,
  Box,
  Pressable,
  Hidden,
  ScrollView,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';

type CardDetail = {
  holderName: string;
  supportText: string;
  accountNumber: string;
  balanceText: string;
  balanceAmount: string;
  spentText: string;
  spentAmount: string;
  receivedText: string;
  receivedAmount: string;
};

type Transaction = {
  iconName: string;
  color: string;
  iconText: string;
  dateAndTime: string;
  amount: string;
};
const cardDetails: CardDetail[] = [
  {
    holderName: 'Hello John',
    supportText: 'Bank of India',
    accountNumber: '2345 XXXX XXXX 2345',
    balanceText: 'Balance',
    balanceAmount: '$50,000',
    spentText: 'Spent',
    spentAmount: '$4,351.50',
    receivedText: 'Received',
    receivedAmount: '$15,143.50',
  },
];

const transactions: Transaction[] = [
  {
    iconName: 'directions-car',
    color: 'rose.300',
    iconText: 'OLA Ride',
    dateAndTime: '2:30pm / Jun 22nd',
    amount: '$140.75',
  },
  {
    iconName: 'shopping-cart',
    color: 'darkBlue.200',
    iconText: 'Grocery',
    dateAndTime: '2:30pm / Jun 22nd',
    amount: '$140.75',
  },
  {
    iconName: 'fastfood',
    color: 'green.300',
    iconText: 'Foods',
    dateAndTime: '2:30pm / Jun 22nd',
    amount: '$140.75',
  },
  {
    iconName: 'healing',
    color: 'amber.400',
    iconText: 'Health',
    dateAndTime: '2:30pm / Jun 22nd',
    amount: '$140.75',
  },
];

const tabs = [
  {
    id: 1,
    title: 'ALL',
  },
  {
    id: 2,
    title: 'SPENT',
  },
  {
    id: 3,
    title: 'RECEIVED',
  },
];

const CreditCard = ({ item }: { item: typeof cardDetails[0] }) => {
  return (
    <Box
      mt={{ base: 2, md: 0 }}
      w="100%"
      h="48"
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
      <Text fontSize="xl" color="coolGray.50" fontWeight="medium">
        {item.holderName}
      </Text>
      <VStack space="1.5" my="3">
        <Text
          fontSize="xs"
          color="coolGray.50"
          lineHeight="17.5"
          fontWeight="bold"
        >
          {item.supportText}
        </Text>
        <Text
          fontSize="sm"
          fontWeight="bold"
          color="coolGray.50"
          lineHeight="20"
        >
          {item.accountNumber}
        </Text>
      </VStack>
      <Divider _dark={{ bg: 'coolGray.200' }} />
      <HStack justifyContent="space-between" mt="2">
        <VStack space={1}>
          <Text fontSize="sm" color="coolGray.50" fontWeight="medium">
            {item.balanceText}
          </Text>
          <Text
            fontWeight="bold"
            fontSize="sm"
            color="coolGray.50"
            lineHeight="20"
          >
            {item.balanceAmount}
          </Text>
        </VStack>
        <VStack space={1}>
          <Text fontSize="sm" color="coolGray.50" fontWeight="medium">
            {item.spentText}
          </Text>
          <Text
            fontWeight="bold"
            fontSize="sm"
            color="coolGray.50"
            lineHeight="20"
          >
            {item.spentAmount}
          </Text>
        </VStack>
        <VStack space={1}>
          <Text fontSize="sm" color="coolGray.50" fontWeight="medium">
            {item.receivedText}
          </Text>
          <Text
            fontWeight="bold"
            fontSize="sm"
            color="coolGray.50"
            lineHeight="20"
          >
            {item.receivedAmount}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

function Transaction() {
  return (
    <VStack mt={{ md: 2 }} divider={<Divider _dark={{ bg: 'coolGray.700' }} />}>
      {transactions.map((item, index) => {
        return (
          <Pressable
            key={index}
            borderRadius="sm"
            py="2"
            my="2"
            px={{ md: 4, base: 2 }}
            mx={{ md: 4, base: 2 }}
            _light={{
              _hover: { bg: 'coolGray.100' },
              _pressed: { bg: 'coolGray.200' },
            }}
            _dark={{
              _hover: { bg: 'coolGray.700' },
              _pressed: { bg: 'coolGray.600' },
            }}
            alignItems="center"
            justifyContent="space-between"
            flexDirection="row"
          >
            <HStack alignItems="center" space="3">
              <Box bg={item.color} rounded="full" p="2">
                <Icon
                  as={MaterialIcons}
                  name={item.iconName}
                  _light={{ color: 'coolGray.50' }}
                  _dark={{ color: 'coolGray.800' }}
                  size="5"
                />
              </Box>
              <VStack space="0.5">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                  lineHeight="21"
                >
                  {item.iconText}
                </Text>
                <Text
                  fontSize="sm"
                  _light={{ color: 'coolGray.500' }}
                  _dark={{ color: 'coolGray.400' }}
                  lineHeight="21"
                >
                  {item.dateAndTime}
                </Text>
              </VStack>
            </HStack>

            <Text
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
              fontSize="sm"
              fontWeight="medium"
            >
              {item.amount}
            </Text>
          </Pressable>
        );
      })}
    </VStack>
  );
}

function TabItem({
  tabName,
  currentTab,
  handleTabChange,
}: {
  tabName: string;
  currentTab: string;
  handleTabChange: (tabTitle: string) => void;
}) {
  return (
    <Pressable onPress={() => handleTabChange(tabName)} px="4" pt="2">
      <VStack>
        <Text
          fontSize="sm"
          fontWeight="medium"
          letterSpacing="0.4"
          _light={{
            color: tabName === currentTab ? 'primary.900' : 'coolGray.500',
          }}
          _dark={{
            color: tabName === currentTab ? 'primary.500' : 'coolGray.400',
          }}
          px={4}
          py={2}
        >
          {tabName}
        </Text>
        {tabName === currentTab && (
          <Box
            borderTopLeftRadius="sm"
            borderTopRightRadius="sm"
            _light={{
              bg: 'primary.900',
            }}
            _dark={{
              bg: 'primary.500',
            }}
            h="1"
          />
        )}
      </VStack>
    </Pressable>
  );
}

const RecentTransactions = () => {
  const [tabName, setTabName] = React.useState('ALL');

  return (
    <VStack
      space="3"
      py={{ base: 4, md: 8 }}
      rounded="sm"
      w="100%"
      h={{ base: '50%', lg: '100%' }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
        px={{ base: '4', md: '8' }}
      >
        Recent Transaction
      </Text>
      <HStack
        w="100%"
        justifyContent="space-between"
        borderRadius="sm"
        px={{ base: '0', md: '8' }}
        py="2"
      >
        {tabs.map(({ title, id }) => (
          <TabItem
            key={id}
            tabName={title}
            currentTab={tabName}
            handleTabChange={(tab) => setTabName(tab)}
          />
        ))}
      </HStack>
      <Transaction />
    </VStack>
  );
};

const AddMoney = () => {
  return (
    <VStack
      py="4"
      space="4"
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      rounded="sm"
    >
      <Pressable
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        pl="4"
        pr="2"
      >
        <Text
          fontWeight="medium"
          fontSize="sm"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Add Money
        </Text>
        <HStack alignItems="center" space="1">
          <Text
            fontSize="sm"
            fontWeight="normal"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            T&C
          </Text>
          <Icon
            as={MaterialIcons}
            name="chevron-right"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            size="6"
          />
        </HStack>
      </Pressable>
      <HStack alignItems="center" space="3" px="4" flex={1}>
        <Input
          flex={1}
          _ios={{ py: 3 }}
          InputLeftElement={
            <Text
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
              fontSize="md"
              pl={3}
            >
              $
            </Text>
          }
        />
        <Button variant="solid" size="lg">
          Add
        </Button>
      </HStack>
    </VStack>
  );
};

const RewardPoints = () => {
  return (
    <Pressable
      pl="4"
      pr="2"
      py="3"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      rounded="sm"
    >
      <VStack space={1}>
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        >
          Reward Points
        </Text>
        <Text
          fontWeight="bold"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          fontSize="sm"
        >
          678.50
        </Text>
      </VStack>

      <HStack alignItems="center" space="1">
        <Text
          fontSize="sm"
          fontWeight="normal"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        >
          Redeem Details
        </Text>
        <Icon
          as={MaterialIcons}
          name="chevron-right"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          size="6"
        />
      </HStack>
    </Pressable>
  );
};

export default function Wallet() {
  return (
    <>
      <DashboardLayout displaySidebar={false} title="Wallet">
        <Hidden from="lg">
          <ScrollView bounces={false}>
            <Box
              position="absolute"
              height="32"
              top="0"
              left="0"
              width="100%"
              _light={{ bg: 'primary.900' }}
              _dark={{ bg: 'coolGray.900' }}
              display={{ base: 'flex', md: 'none' }}
            />
            <VStack flex={1} space="4" px={{ base: 4, md: 0 }}>
              <CreditCard item={cardDetails[0]} />
              <RewardPoints />
              <AddMoney />
              <RecentTransactions />
            </VStack>
          </ScrollView>
        </Hidden>

        {/* Desktop Layout */}
        <Hidden from="base" till="lg">
          <Box flex={1}>
            <HStack flex={1} space="5">
              <VStack flex={2} space="4" maxW="358">
                <CreditCard item={cardDetails[0]} />
                <RewardPoints />
                <AddMoney />
              </VStack>
              <Box flex={3}>
                <RecentTransactions />
              </Box>
            </HStack>
          </Box>
        </Hidden>
      </DashboardLayout>
    </>
  );
}
