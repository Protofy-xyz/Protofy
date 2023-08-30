import React from 'react';
import {
  Box,
  Icon,
  Text,
  VStack,
  Image,
  ScrollView,
  Pressable,
  IconButton,
  Hidden,
  FlatList,
  useBreakpointValue,
  Divider,
  HStack,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Carousel } from '../../components/Carousel';

type Category = {
  iconName: string;
  iconText: string;
};

type BankingPartner = {
  imageUri: ImageSourcePropType;
};

const categories: Category[] = [
  {
    iconName: 'directions-bike',
    iconText: 'Bike',
  },
  {
    iconName: 'electric-car',
    iconText: 'Car',
  },
  {
    iconName: 'person-pin',
    iconText: 'Personal ',
  },
  {
    iconName: 'healing',
    iconText: 'Health',
  },

  {
    iconName: 'more-vert',
    iconText: 'More',
  },
];

const banking_partners: BankingPartner[] = [
  {
    imageUri: require('./images/insurance1.png'),
  },
  {
    imageUri: require('./images/insurance2.png'),
  },
  {
    imageUri: require('./images/insurance6.png'),
  },
  {
    imageUri: require('./images/insurance4.png'),
  },
  {
    imageUri: require('./images/insurance5.png'),
  },
  {
    imageUri: require('./images/insurance6.png'),
  },
  {
    imageUri: require('./images/insurance7.png'),
  },
  {
    imageUri: require('./images/insurance8.png'),
  },
  {
    imageUri: require('./images/insurance9.png'),
  },
];

function CategoryIcon({ item }: { item: Category }) {
  return (
    <VStack space={2} alignItems="center">
      <IconButton
        p={2}
        rounded="full"
        _dark={{ bg: 'coolGray.700' }}
        _light={{ bg: 'primary.100' }}
        icon={
          <Icon
            size="sm"
            _dark={{ color: 'coolGray.50' }}
            _light={{ color: 'primary.900' }}
            name={item.iconName}
            as={MaterialIcons}
          />
        }
      />
      <Text
        fontSize="xs"
        textAlign="center"
        fontWeight="medium"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
      >
        {item.iconText}
      </Text>
    </VStack>
  );
}

function BankCard({ item }: { item: BankingPartner }) {
  return (
    <Image
      height={{ base: 118, md: 48 }}
      borderWidth="1"
      _light={{ borderColor: 'coolGray.200' }}
      _dark={{ borderColor: 'coolGray.700' }}
      w="100%"
      borderRadius={4}
      resizeMode="contain"
      source={item.imageUri}
      alt="Insurance Partner"
    />
  );
}

const CarouselLayout = () => {
  return (
    <Box
      py={{ base: '4', md: 0 }}
      bg={{ base: 'transparent', md: 'transparent' }}
    >
      <Carousel
        images={[
          require('./images/insurancebanner.png'),
          require('./images/insurance10.png'),
          require('./images/insurance11.png'),
          require('./images/insurance12.png'),
        ]}
        height={{ base: 40, md: 72 }}
        activeIndicatorBgColor="coolGray.500"
        inactiveIndicatorBgColor="coolGray.300"
      />
    </Box>
  );
};

function MainContent() {
  const noColumn = useBreakpointValue({
    base: 5,
    sm: 5,
    lg: 8,
    md: 6,
    xl: 10,
  });
  const noColumnBankPartner = useBreakpointValue({
    base: 3,
    lg: 4,
  });

  return (
    <Box flex="1">
      <Hidden till="md">
        <Box pb={5}>
          <CarouselLayout />
        </Box>
      </Hidden>

      <FlatList
        bounces={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Hidden from="md">
              <Box
                _light={{
                  bg: { base: 'white', md: 'primary.50' },
                }}
                _dark={{
                  bg: { base: 'coolGray.800', md: 'coolGray.700' },
                }}
              >
                <CarouselLayout />
              </Box>
            </Hidden>
            <Box
              pt={{ md: 8 }}
              _light={{ bg: 'white' }}
              _dark={{ bg: 'coolGray.800' }}
            >
              <Text
                fontSize="md"
                fontWeight="bold"
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
                mb="4"
              >
                Insurance
              </Text>

              <ScrollView horizontal={true}>
                <HStack space="8">
                  {categories.map((item, index) => (
                    <Pressable key={index + item.iconName}>
                      <CategoryIcon item={item} />
                    </Pressable>
                  ))}
                </HStack>
              </ScrollView>
              <Hidden from="base" till="md">
                <Divider mt={5} mb={{ base: 4, md: 5 }} />
              </Hidden>
            </Box>
            <Box
              pt={{ base: 5, md: 0 }}
              _light={{ bg: 'white' }}
              _dark={{ bg: 'coolGray.800' }}
            >
              <Text
                fontSize="md"
                fontWeight="bold"
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
                mb="2"
              >
                Insurance Partners
              </Text>
            </Box>
          </>
        }
        _light={{
          bg: { base: 'white' },
        }}
        _dark={{
          bg: { base: 'coolGray.800' },
        }}
        numColumns={noColumnBankPartner}
        key={noColumnBankPartner}
        data={banking_partners}
        keyExtractor={(item, index) => 'key' + index}
        px={{ base: 4, md: 8 }}
        pb={{ base: 4, md: 8 }}
        contentContainerStyle={{ justifyContent: 'space-between' }}
        renderItem={({
          item,
          index,
        }: {
          item: BankingPartner;
          index: number;
        }) => (
          <Pressable
            key={index}
            my={2}
            mr={{ base: 4 }}
            width={{ base: '30%', lg: '23%' }}
          >
            <BankCard item={item} />
          </Pressable>
        )}
      />
    </Box>
  );
}
export default function () {
  return (
    <DashboardLayout
      title="Insurance"
      displaySidebar={false}
      rightPanelMobileHeader={true}
    >
      <MainContent />
    </DashboardLayout>
  );
}
