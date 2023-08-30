import React from 'react';
import {
  HStack,
  Text,
  VStack,
  Image,
  Button,
  ScrollView,
  Box,
  Link,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ImageSourcePropType } from 'react-native';

type Order = {
  orderId: string;
  imageUri: ImageSourcePropType;
  itemName: string;
  itemType: string;
  size: string;
  amount: string;
  delivery: string;
  deliveryColor: string;
};
type CardProps = {
  item: Order;
};
const orders: Order[] = [
  {
    orderId: 'Order : #7926895435345',
    imageUri: require('./images/bedlamp.png'),
    itemName: 'BEDLAMP',
    itemType: 'Automatic sensor,Multi color',
    size: 'Size : Small',
    amount: '₹749',
    delivery: 'In-Transit',
    deliveryColor: 'amber.600',
  },
  {
    orderId: 'Order : #2226895435345',
    imageUri: require('./images/perfume.png'),
    itemName: 'PERFUME',
    itemType: 'Jasmine scent',
    size: 'Size : Large',
    amount: '₹999',
    delivery: 'Delivered',
    deliveryColor: 'emerald.600',
  },
  {
    orderId: 'Order : #4426895435345',
    imageUri: require('./images/skin-care-kit.png'),
    itemName: 'SKIN CARE KIT',
    itemType: 'Body Yogurt',
    size: 'Size : Medium',
    amount: '₹1,899',
    delivery: 'Delivered',
    deliveryColor: 'emerald.600',
  },
  {
    orderId: 'Order : #2697895435345',
    imageUri: require('./images/lamp.png'),
    itemName: 'BABY BEDLAMP',
    itemType: 'Multi color',
    size: 'Size : Small',
    amount: '₹1,635',
    delivery: 'Delivered',
    deliveryColor: 'emerald.600',
  },
];
function Card(props: CardProps) {
  return (
    <Box
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: { base: 'coolGray.800', md: 'coolGray.700' } }}
      p={{ base: 3, md: 4 }}
      borderRadius="sm"
    >
      <HStack alignItems="center" justifyContent="space-between">
        <Text
          fontSize="xs"
          _dark={{ color: 'coolGray.50' }}
          fontWeight="normal"
        >
          {props.item.orderId}
        </Text>
        <Text
          fontSize="xs"
          fontWeight="medium"
          _light={{ color: props.item.deliveryColor }}
          _dark={{ color: props.item.deliveryColor }}
        >
          {props.item.delivery}
        </Text>
      </HStack>
      <HStack alignItems="center" mt="3" space="3">
        <Link href="#">
          <Image
            source={props.item.imageUri}
            alt="Alternate Text"
            rounded="sm"
            height="90"
            width="74"
          />
        </Link>

        <Box>
          <Link href="#">
            <Text
              fontSize="md"
              fontWeight="bold"
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
            >
              {props.item.itemName}
            </Text>
          </Link>

          <Text
            fontSize="sm"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            {props.item.itemType}
          </Text>
          <Text
            fontSize="sm"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            {props.item.size}
          </Text>
          <Text
            mt={0.5}
            fontSize="sm"
            fontWeight="medium"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            {props.item.amount}
          </Text>
        </Box>
      </HStack>
      <HStack mt="5" space="3">
        <Button variant="solid" size="xs" _text={{ fontWeight: 'medium' }}>
          {props.item.delivery === 'Delivered' ? 'VIEW DETAILS' : 'TRACK ORDER'}
        </Button>
        <Button
          variant="outline"
          _light={{ borderColor: 'coolGray.400' }}
          _dark={{ borderColor: 'coolGray.400' }}
          size="xs"
          _text={{ fontWeight: 'medium', color: 'secondary.400' }}
        >
          {props.item.delivery === 'Delivered'
            ? 'RATE PRODUCT'
            : 'CANCEL ORDER'}
        </Button>
      </HStack>
    </Box>
  );
}
function MainContent() {
  return (
    <ScrollView>
      <VStack
        px={{ base: 4, md: 8, lg: '140' }}
        pt={{ base: 5, md: 8 }}
        pb={{ base: 4, md: 8 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{
          bg: { md: 'coolGray.800', base: 'coolGray.700' },
        }}
        space="4"
      >
        {orders.map((item, index) => {
          return <Card key={index} item={item} />;
        })}
      </VStack>
    </ScrollView>
  );
}
export default function MyOrders() {
  return (
    <>
      <DashboardLayout title="My Orders">
        <MainContent />
      </DashboardLayout>
    </>
  );
}
