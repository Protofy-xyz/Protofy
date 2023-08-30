import React from 'react';
import {
  HStack,
  Text,
  VStack,
  ScrollView,
  Divider,
  Box,
  Link,
  useBreakpointValue,
  useColorModeValue,
  Badge,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

type MutualFund = {
  name: string;
  sip: string;
  investment: string;
  investmentValue: string;
  current: string;
  currentValue: string;
  return: string;
  returnvalue: string;
};
const mutualFundList: MutualFund[] = [
  {
    name: 'Aditya Birla Sun Life Flexi Cap- Fund',
    sip: 'SIP x 6',
    investment: 'Investment',
    investmentValue: '$450.54',
    current: 'Current Value',
    currentValue: '$106.58',
    return: 'Returns',
    returnvalue: '14%',
  },
  {
    name: 'Axis Sun Life Flexi Cap- Fund',
    sip: 'SIP x 6',
    investment: 'Investment',
    investmentValue: '$446.61',
    current: 'Current Value',
    currentValue: '$710.68',
    return: 'Returns',
    returnvalue: '12%',
  },

  {
    name: 'Aditya Birla Blue Chip- Fund',
    sip: 'SIP x 6',
    investment: 'Investment',
    investmentValue: '$490.51',
    current: 'Current Value',
    currentValue: '$739.65',
    return: 'Returns',
    returnvalue: '10%',
  },
  {
    name: 'Kotak Flexi Cap Mutual Fund',
    sip: 'SIP x 6',
    investment: 'Investment',
    investmentValue: '$630.44',
    current: 'Current Value',
    currentValue: '$928.41',
    return: 'Returns',
    returnvalue: '15%',
  },
  {
    name: 'Sun Life Flexi Cap- Fund',
    sip: 'SIP x 6',
    investment: 'Investment',
    investmentValue: '$169.43',
    current: 'Current Value',
    currentValue: '$275.43',
    return: 'Returns',
    returnvalue: '8%',
  },
  {
    name: 'Live Life Flexi Cap- Fund',
    sip: 'SIP x 6',
    investment: 'Investment',
    investmentValue: '$202.87',
    current: 'Current Value',
    currentValue: '$406.27',
    return: 'Returns',
    returnvalue: '20%',
  },
  {
    name: 'GROW Mutual Fund',
    sip: 'SIP x 6',
    investment: 'Investment',
    investmentValue: '$328.85',
    current: 'Current Value',
    currentValue: '$149.78',
    return: 'Returns',
    returnvalue: '18%',
  },
  {
    name: 'Strength Mutual Fund',
    sip: 'SIP x 6',
    investment: 'Investment',
    investmentValue: '$105.55',
    current: 'Current Value',
    currentValue: '$351.02',
    return: 'Returns',
    returnvalue: '10%',
  },
  {
    name: 'Sunflower Flexi Cap- Fund',
    sip: 'SIP x 6',
    investment: 'Investment',
    investmentValue: '$782.01',
    current: 'Current Value',
    currentValue: '$778.35',
    return: 'Returns',
    returnvalue: '12%',
  },
];

function TotalInvested() {
  return (
    <HStack space="5" mb={{ base: '5', md: '8' }}>
      <VStack
        flex={1}
        py="3"
        borderRadius="sm"
        alignItems="center"
        borderWidth={1}
        space="1"
        _light={{ borderColor: 'primary.800' }}
        _dark={{
          borderColor: 'primary.500',
        }}
      >
        <Text
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="medium"
          _dark={{ color: 'primary.500' }}
          _light={{ color: 'primary.800' }}
        >
          $15303.00
        </Text>
        <Text
          fontSize={{ base: 'xs', md: 'md' }}
          fontWeight="medium"
          _dark={{ color: 'primary.500' }}
          _light={{ color: 'primary.800' }}
        >
          Total Invested
        </Text>
      </VStack>

      <VStack
        flex={1}
        py="3"
        alignItems="center"
        space="1"
        borderWidth={1}
        borderRadius="sm"
        _light={{ borderColor: 'emerald.800' }}
        _dark={{
          borderColor: 'emerald.500',
        }}
      >
        <Text
          _dark={{ color: 'emerald.500' }}
          _light={{ color: 'emerald.800' }}
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="medium"
        >
          $45303.00
        </Text>
        <Text
          _dark={{ color: 'emerald.500' }}
          _light={{ color: 'emerald.800' }}
          fontSize={{ base: 'xs', md: 'md' }}
          fontWeight="medium"
        >
          14% Return
        </Text>
      </VStack>
    </HStack>
  );
}
function Card(props: MutualFund) {
  return (
    <Box
      p="3"
      _light={{
        bg: 'coolGray.100',
      }}
      _dark={{
        bg: 'coolGray.700',
      }}
      borderRadius="sm"
    >
      <Link
        href=""
        isUnderlined={false}
        _text={{
          fontSize: 'sm',
          fontWeight: 'bold',
          _light: { color: 'coolGray.800' },
          _dark: { color: 'coolGray.50' },
        }}
      >
        {props.name}
      </Link>
      <Badge
        width="16"
        px="2"
        py="0.5"
        mt="2"
        _light={{ bg: 'emerald.600' }}
        _dark={{ bg: 'emerald.500' }}
        _text={{
          fontSize: 'xs',
          _light: { color: 'coolGray.100' },
          _dark: { color: 'coolGray.800' },
        }}
      >
        {props.sip}
      </Badge>
      <HStack mt="3" justifyContent="space-between">
        <VStack space="1">
          <Text
            fontSize="xs"
            fontWeight="medium"
            _dark={{ color: 'coolGray.400' }}
            _light={{ color: 'coolGray.500' }}
          >
            {props.investment}
          </Text>
          <Text
            fontSize="md"
            fontWeight="medium"
            _dark={{ color: 'coolGray.50' }}
            _light={{ color: 'coolGray.800' }}
          >
            {props.investmentValue}
          </Text>
        </VStack>
        <VStack space="1">
          <Text
            fontSize="xs"
            fontWeight="medium"
            _dark={{ color: 'coolGray.400' }}
            _light={{ color: 'coolGray.500' }}
          >
            {props.current}
          </Text>
          <Text
            fontSize="md"
            fontWeight="medium"
            _dark={{ color: 'coolGray.50' }}
            _light={{ color: 'coolGray.800' }}
          >
            {props.currentValue}
          </Text>
        </VStack>
        <VStack space="1">
          <Text
            fontSize="xs"
            fontWeight="medium"
            _dark={{ color: 'coolGray.400' }}
            _light={{ color: 'coolGray.500' }}
          >
            {props.return}
          </Text>
          <Text
            fontSize="md"
            fontWeight="medium"
            _dark={{ color: 'emerald.500' }}
            _light={{ color: 'emerald.600' }}
          >
            {props.returnvalue}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}
function CardSection() {
  return (
    <>
      <Text
        fontSize="md"
        fontWeight="medium"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
      >
        Portfolio Details
      </Text>
      <VStack mt="5" space="3">
        {mutualFundList.map((item, index) => {
          return <Card key={index} {...item} />;
        })}
      </VStack>
    </>
  );
}
function ListHeaderWeb() {
  const tableHeaderTextStyle = {
    fontSize: 'sm',
    fontWeight: 'bold',
    color: useColorModeValue('coolGray.500', 'coolGray.400'),
  };

  const tableCellTextStyle = {
    fontSize: 'sm',
    fontWeight: 'medium',
    color: useColorModeValue('coolGray.800', 'coolGray.50'),
  };

  return (
    <VStack
      _light={{
        borderColor: 'coolGray.200',
      }}
      _dark={{
        borderColor: 'coolGray.700',
      }}
      borderWidth={1}
      borderRadius="sm"
      divider={<Divider />}
    >
      <HStack pt="5" pb="3" pl="6" justifyContent="space-between">
        <Text w="36%" {...tableHeaderTextStyle}>
          Company Name
        </Text>
        <Text w="14%" {...tableHeaderTextStyle}>
          Investment
        </Text>
        <Text w="14%" {...tableHeaderTextStyle}>
          Current Value
        </Text>
        <Text w="14%" {...tableHeaderTextStyle}>
          Returns
        </Text>
      </HStack>
      {mutualFundList.map((item, index) => {
        return (
          <HStack key={index} py="4" pl="6" justifyContent="space-between">
            <Link
              href=""
              isUnderlined={false}
              w="36%"
              _text={{
                ...tableCellTextStyle,
              }}
            >
              {item.name}
            </Link>

            <Text w="14%" {...tableCellTextStyle}>
              {item.investmentValue}
            </Text>
            <Text w="14%" {...tableCellTextStyle}>
              {item.currentValue}
            </Text>
            <Text
              w="14%"
              fontSize="sm"
              fontWeight="medium"
              _dark={{ color: 'emerald.500' }}
              _light={{ color: 'emerald.600' }}
            >
              {item.returnvalue}
            </Text>
          </HStack>
        );
      })}
    </VStack>
  );
}

function MainContent() {
  const tabletScreen = useBreakpointValue({
    base: false,
    md: true,
  });
  return (
    <ScrollView bounces={false}>
      <Box
        px={{ base: 4, md: 10, lg: 140 }}
        py={{ base: 5, md: 8 }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        rounded={{ md: 'sm' }}
      >
        <TotalInvested />
        {tabletScreen ? <ListHeaderWeb /> : <CardSection />}
      </Box>
    </ScrollView>
  );
}

export default function () {
  return (
    <DashboardLayout
      title="Mutual Fund Portfolio"
      displaySidebar={false}
      rightPanelMobileHeader
    >
      <MainContent />
    </DashboardLayout>
  );
}
