import React from 'react';
import {
  HStack,
  Icon,
  Text,
  Image,
  useBreakpointValue,
  FlatList,
  IconButton,
  Link,
  Box,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType, Platform } from 'react-native';
import { useWindowDimensions } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';

type ProductProps = {
  imageUri: ImageSourcePropType;
  itemName: string;
  itemDescription: string;
  price: string;
  rating: number;
  numberOfRatings: number;
};

const itemList: ProductProps[] = [
  {
    imageUri: require('./images/wishlist-1.png'),
    itemName: 'HERE&NOW',
    itemDescription: 'Mid-Rise Denim Shorts',
    price: '200',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-2.png'),
    itemName: 'Marks & Spencer',
    itemDescription: 'Boys Pack of 3 T-shirts',
    price: '639',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-3.png'),
    itemName: 'CENWELL',
    itemDescription: 'Kids Cotton Cloth Mask',
    price: '399',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-4.png'),
    itemName: 'U.S. Polo Assn. Kids',
    itemDescription: 'Pure Cotton Sleepsuits',
    price: '849',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-5.png'),
    itemName: 'Cherry Crumble',
    itemDescription: 'Flare Dress',
    price: '899',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-6.png'),
    itemName: 'BonOrganik',
    itemDescription: 'Round-Neck T-shirt',
    price: '259',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-7.png'),
    itemName: 'U.S. Polo Assn. Kids',
    itemDescription: 'Black Self Design Sweater',
    price: '599',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-8.png'),
    itemName: 'Black Self Design Sweater',
    itemDescription: 'Flare low jeans',
    price: '865',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-9.png'),
    itemName: 'Lil Tomatoes',
    itemDescription: 'Red Cotton Regular Top',
    price: '250',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-10.png'),
    itemName: 'Cutiekins',
    itemDescription: 'Multicoloured Printed Top',
    price: '399',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-11.png'),
    itemName: 'BonOrganik',
    itemDescription: 'Round-Neck T-shirt',
    price: '259',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-12.png'),
    itemName: 'U.S. Polo Assn. Kids',
    itemDescription: 'Black Self Design Sweater',
    price: '599',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-13.png'),
    itemName: 'Peaches',
    itemDescription: 'Flare low jeans',
    price: '865',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-14.png'),
    itemName: 'Lil Tomatoes',
    itemDescription: 'Red Cotton Regular Top',
    price: '250',
    rating: 4.9,
    numberOfRatings: 120,
  },
  {
    imageUri: require('./images/wishlist-15.png'),
    itemName: 'Cutiekins',
    itemDescription: 'Multicoloured Printed Top',
    price: '399',
    rating: 4.9,
    numberOfRatings: 120,
  },
];
function Card(props: ProductProps) {
  const { width: windowWidth } = useWindowDimensions();
  return (
    <Box
      _light={{ bg: 'violet.50' }}
      _dark={{ bg: 'coolGray.700' }}
      width={{
        base: windowWidth / 2 - 22,
        sm: windowWidth / 3 - 22,
        md: windowWidth / 3 - 56,
        lg: windowWidth / 5 - 56,
        xl: '173',
      }}
      px="2"
      pt="2"
      pb="2.5"
      borderRadius="sm"
      m={{ base: '1.5', md: '2.5' }}
    >
      <Link href="" borderRadius="sm" overflow="hidden">
        <Image
          w="100%"
          h="170"
          source={props.imageUri}
          alt="Alternate Text"
          resizeMode="cover"
        />
      </Link>
      <HStack alignItems="center" space="0.5" mt="2">
        <Icon size="3" color="amber.400" as={Ionicons} name={'ios-star'} />
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
          {`(${props.numberOfRatings})`}
        </Text>
      </HStack>
      <Link
        mt="1"
        href=""
        _text={{
          fontSize: 'sm',
          _light: { color: 'coolGray.800' },
          _dark: { color: 'coolGray.50' },
        }}
        isUnderlined={false}
      >
        {props.itemName.length > 15
          ? `${props.itemName.substring(0, 15)}...`
          : props.itemName}
      </Link>
      <Text
        mt="0.5"
        fontSize="2xs"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
      >
        {props.itemDescription}
      </Text>
      <HStack mt="1" w="100%" justifyContent="space-between">
        <Text
          fontSize="sm"
          fontWeight="bold"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          {'\u20B9'}
          {props.price}
        </Text>
        <IconButton
          p={0}
          variant="unstyled"
          icon={
            <Icon
              size="5"
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'primary.500' }}
              as={MaterialIcons}
              name="favorite"
            />
          }
        />
      </HStack>
    </Box>
  );
}

function MainContent() {
  const noColumn = useBreakpointValue({
    base: 2,
    sm: 3,
    md: 3,
    lg: 5,
    xl: 5,
  });
  return (
    <Box
      px={{ base: 2.5, md: '22' }}
      py={{ base: '14', md: '22' }}
      rounded={{ md: 'sm' }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      alignItems="center"
    >
      {Platform.OS === 'web' ? (
        <HStack flexWrap="wrap">
          {itemList.map((item, index) => (
            <Card {...item} />
          ))}
        </HStack>
      ) : (
        <FlatList
          numColumns={noColumn}
          data={itemList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <Card {...item} />}
          key={noColumn}
          keyExtractor={(item, index) => 'key' + index}
        />
      )}
    </Box>
  );
}

export default function Wishlist() {
  return (
    <DashboardLayout
      title="Wishlist"
      subTitle="128 Items"
      displaySidebar={false}
      displayBackButton
    >
      <MainContent />
    </DashboardLayout>
  );
}
