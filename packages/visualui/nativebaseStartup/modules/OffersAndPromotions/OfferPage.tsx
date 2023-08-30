import React from 'react';
import {
  Text,
  Image,
  useBreakpointValue,
  FlatList,
  Box,
  Pressable,
} from 'native-base';
import { ImageSourcePropType, useWindowDimensions } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';

type Offer = {
  imageRes: ImageSourcePropType;
  discount: string;
  type: string;
};

const offers: Offer[] = [
  {
    imageRes: require('./images/cafe1.png'),
    discount: '30% OFF',
    type: 'Clothes Cafe',
  },
  {
    imageRes: require('./images/cafe2.png'),
    discount: '50% OFF',
    type: 'Clothes hub',
  },
  {
    imageRes: require('./images/cafe3.png'),
    discount: '40% OFF',
    type: 'Clothes fest',
  },
  {
    imageRes: require('./images/cafe4.png'),
    discount: '30% OFF',
    type: 'Clothes Cafe',
  },
  {
    imageRes: require('./images/cafe10.png'),
    discount: '50% OFF',
    type: 'Clothes hub',
  },
  {
    imageRes: require('./images/cafe5.png'),
    discount: '40% OFF',
    type: 'Clothes fest',
  },
  {
    imageRes: require('./images/cafe1.png'),
    discount: '30% OFF',
    type: 'Clothes Cafe',
  },
  {
    imageRes: require('./images/cafe4.png'),
    discount: '50% OFF',
    type: 'Clothes hub',
  },
  {
    imageRes: require('./images/cafe7.png'),
    discount: '40% OFF',
    type: 'Clothes fest',
  },
  {
    imageRes: require('./images/cafe4.png'),
    discount: '30% OFF',
    type: 'Clothes Cafe',
  },
  {
    imageRes: require('./images/cafe8.png'),
    discount: '50% OFF',
    type: 'Clothes hub',
  },
  {
    imageRes: require('./images/cafe9.png'),
    discount: '40% OFF',
    type: 'Clothes fest',
  },
];

function Card(props: { item: Offer }) {
  return (
    <Box
      rounded="lg"
      overflow="hidden"
      flex={{ sm: '1' }}
      mt={4}
      mx={{ base: 4, sm: 2 }}
      height={48}
    >
      <Image
        source={props.item.imageRes}
        alt="Alternate Text"
        position="absolute"
        resizeMode="cover"
        top={0}
        bottom={0}
        right={0}
        left={0}
        w="full"
      />

      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        bg={{
          linearGradient: {
            colors: ['transparent', 'rgba(0,0,0,0.8)'],
          },
        }}
      />

      <Box
        justifyContent="flex-end"
        pl={4}
        flex={1}
        w={{ md: 56, lg: 72 }}
        pb={4}
        zIndex={1}
      >
        <Pressable>
          <Text color="coolGray.50" fontSize="md">
            {props.item.type}
          </Text>
        </Pressable>

        <Pressable>
          <Text color="coolGray.50" fontWeight="bold" fontSize="3xl">
            {props.item.discount}
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}
export default function OfferPage() {
  const noColumn = useBreakpointValue({
    base: 1,
    sm: 2,
    lg: 3,
  });
  const { height } = useWindowDimensions();
  return (
    <DashboardLayout
      displaySidebar={false}
      title="Rewards"
      displayBackButton
      rightPanelMobileHeader={true}
    >
      <Box
        pt={{ base: 1, md: 4 }}
        pb={{ base: 5, md: 8 }}
        px={{ base: '0', md: '5' }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        bg="red.300"
        width="100%"
      >
        <FlatList
          numColumns={noColumn}
          data={offers}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <Card item={item} />}
          key={noColumn}
          keyExtractor={(item, index) => 'key' + index}
          bounces={false}
          _web={{ height: { base: height, md: '100%' }, mb: 4 }}
        />
      </Box>
    </DashboardLayout>
  );
}
