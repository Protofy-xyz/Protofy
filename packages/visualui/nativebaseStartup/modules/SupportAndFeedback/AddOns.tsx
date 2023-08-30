import React, { useState } from 'react';
import {
  Box,
  HStack,
  Text,
  VStack,
  Image,
  ScrollView,
  Button,
  Pressable,
  Link,
  Icon,
  useBreakpointValue,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';

type ProductType = {
  image: ImageSourcePropType;
  type: string;
  category: string;
  price: string;
  rating: number;
  numberOfRatings: number;
};

type ProductAddons = {
  showAll: boolean;
};

type CardType = {
  id: string;
  imageUri: ImageSourcePropType;
  item: string;
  details: string;
  size: string;
  amount: string;
};
const card: CardType[] = [
  {
    id: '1',
    imageUri: require('./images/Product2.png'),
    item: 'BEDLAMP',
    details: 'Automatic sensor,Multi color',
    size: 'Medium',
    amount: '₹1635.00',
  },
];
const products: ProductType[] = [
  {
    image: require('./images/Product3.png'),
    type: 'HERE&NOW',
    category: 'Mid-Rise Denim Shorts',
    price: '₹200',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    image: require('./images/Product4.png'),
    type: 'Marks & Spencer',
    category: 'Boys Pack of 3 T-shirts',
    price: '₹639',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    image: require('./images/Product5.png'),
    type: 'Vero Moda',
    category: 'Women Blue Skinny Fit',
    price: '₹1259',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    image: require('./images/Product6.png'),
    type: 'AND',
    category: 'Women Flare Dress',
    price: '₹639',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    image: require('./images/Product1.png'),
    type: 'CENWELL',
    category: 'Women Sweaters',
    price: '₹849',
    rating: 4.9,
    numberOfRatings: 120,
  },
];

function Card(props: CardType) {
  return (
    <Link
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: 'coolGray.700' }}
      alignItems="center"
      p={3}
      rounded="sm"
      href=""
      isUnderlined={false}
    >
      <Image
        source={props.imageUri}
        alt="Lamp Photo"
        height="90"
        width="74"
        borderRadius="sm"
        mr="3"
      />
      <VStack>
        <Text
          fontSize="md"
          fontWeight="bold"
          _dark={{ color: 'coolGray.50' }}
          _light={{ color: 'coolGray.800' }}
        >
          {props.item}
        </Text>

        <Text
          fontSize="sm"
          _dark={{ color: 'coolGray.400' }}
          _light={{ color: 'coolGray.500' }}
        >
          {props.details}
        </Text>
        <Text
          fontSize="sm"
          _dark={{ color: 'coolGray.400' }}
          _light={{ color: 'coolGray.500' }}
        >
          Size : {props.size}
        </Text>
        <Text
          fontWeight="medium"
          fontSize="sm"
          _dark={{ color: 'coolGray.50' }}
          _light={{ color: 'coolGray.800' }}
        >
          {props.amount}
        </Text>
      </VStack>
    </Link>
  );
}
function CardSection() {
  return (
    <VStack
      space="4"
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      py={{ base: 4, md: 0 }}
      px={{ base: 4, md: '2.5' }}
    >
      {card.map((item, index) => (
        <Card {...item} key={index} />
      ))}
    </VStack>
  );
}
function Item(props: ProductType) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  return (
    <Box
      px={{ base: '1.5', md: '2.5' }}
      width={{ base: '50%', lg: '33%', xl: '25%' }}
    >
      <Box
        p="2"
        w="full"
        _light={{ bg: 'primary.50' }}
        _dark={{ bg: 'coolGray.700' }}
        rounded="sm"
        mb={4}
      >
        <Link href="">
          <Box w="100%">
            <Image
              rounded="xs"
              height="170"
              width="100%"
              source={props.image}
              alt="Alternet Text"
            />
            <VStack mt={2}>
              <HStack alignItems="center" space={0.5}>
                <Icon
                  size={3}
                  color="amber.400"
                  as={MaterialIcons}
                  name={'star'}
                />
                <Text
                  fontSize="2xs"
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                >
                  {props.rating}
                </Text>
                <Text
                  fontSize="2xs"
                  _light={{ color: 'coolGray.500' }}
                  _dark={{ color: 'coolGray.400' }}
                >
                  ({props.numberOfRatings})
                </Text>
              </HStack>
              <Text
                mt="1"
                fontSize="sm"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                {props.type}
              </Text>
              <Text
                fontSize="2xs"
                mt="0.5"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
              >
                {props.category}
              </Text>
            </VStack>
          </Box>
        </Link>

        <HStack justifyContent="space-between" alignItems="center" mt={1}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            {props.price}
          </Text>
          <Pressable onPress={() => setIsWishlisted(!isWishlisted)}>
            <Icon
              as={MaterialIcons}
              name={isWishlisted ? 'favorite' : 'favorite-border'}
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'primary.500' }}
              size={5}
            />
          </Pressable>
        </HStack>
      </Box>
    </Box>
  );
}
function ProductAddons(props: ProductAddons) {
  const productCollection = useBreakpointValue({
    base: props.showAll ? products : products.slice(0, 2),
    lg: props.showAll ? products : products.slice(0, 3),
    xl: props.showAll ? products : products.slice(0, 4),
  });

  return (
    <>
      <HStack flexWrap="wrap" justifyContent="flex-start">
        {productCollection.map((item: ProductType, key: number) => {
          return <Item {...item} key={key} />;
        })}
      </HStack>
    </>
  );
}

function ProductsList() {
  const [seeAllAddons, setSeeAllAddons] = React.useState(false);
  function toggleSeeAllAddons() {
    setSeeAllAddons(!seeAllAddons);
  }
  return (
    <Box
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      mt={4}
      mb={{ base: 4, md: 0 }}
      px={{ base: 4, md: 0 }}
    >
      <HStack
        alignItems="center"
        justifyContent="space-between"
        py={4}
        px={{ base: '1.5', md: '2.5' }}
      >
        <Text
          fontSize="sm"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          fontWeight="medium"
        >
          Product Add-ons
        </Text>

        <Pressable onPress={toggleSeeAllAddons}>
          <Text
            fontSize="sm"
            _light={{
              color: 'primary.900',
            }}
            _dark={{
              color: 'primary.500',
            }}
          >
            See {seeAllAddons ? 'Less' : 'All'}
          </Text>
        </Pressable>
      </HStack>
      <ProductAddons showAll={seeAllAddons} />
    </Box>
  );
}

function MainContent() {
  return (
    <Box
      rounded={{ md: 'sm' }}
      _light={{
        bg: { md: 'white', base: 'primary.50' },
      }}
      _dark={{
        bg: { md: 'coolGray.800', base: 'coolGray.700' },
      }}
      px={{ md: '22', lg: '54', xl: '130' }}
      py={{ md: 8 }}
      pb={{ base: 4, md: 8 }}
      flex={1}
    >
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <CardSection />
        <ProductsList />
      </ScrollView>
      <Button
        variant="solid"
        _text={{ fontWeight: 'medium' }}
        size="lg"
        mx={{ base: 4, md: '1' }}
        mt="auto"
      >
        CHECKOUT
      </Button>
    </Box>
  );
}

export default function () {
  return (
    <DashboardLayout
      title="Add-ons"
      displayNotificationButton
      displayScreenTitle
      rightPanelMobileHeader={true}
    >
      <MainContent />
    </DashboardLayout>
  );
}
