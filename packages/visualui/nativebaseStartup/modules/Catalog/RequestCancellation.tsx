import React from 'react';
import {
  Box,
  HStack,
  Text,
  VStack,
  Image,
  Button,
  Radio,
  Modal,
  Icon,
  Link,
  ScrollView,
} from 'native-base';

import DashboardLayout from '../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

type ProductProps = {
  id: string;
  imageUri: ImageSourcePropType;
  item: string;
  details: string;
  size: string;
  amount: string;
};

type Order = {
  id: string;
  delivery: string;
  productList: ProductProps[];
};

const order: Order = {
  id: '#9726895435345',
  delivery: 'Delivered',
  productList: [
    {
      id: '1',
      imageUri: require('./images/lamp.png'),
      item: 'BEDLAMP',
      details: 'Automatic sensor,Multi color',
      size: 'Medium',
      amount: '₹1635.00',
    },
  ],
};
const reasonList: string[] = [
  'I want to change my phone number',
  'I have changed my mind',
  'I have purchased the product elsewhere',
  'Expected delivery time is very long',
  'I want to change address for the order',
  'I want to cancel due to product quality issues',
];

function Card({
  product,
  orderID,
  delivery,
}: {
  product: ProductProps;
  orderID: string;
  delivery: string;
}) {
  return (
    <VStack
      _dark={{ bg: 'coolGray.700' }}
      _light={{ bg: 'coolGray.100' }}
      borderRadius="sm"
      p="4"
      space="3"
    >
      <HStack justifyContent="space-between">
        <Text
          fontSize="xs"
          _dark={{ color: 'coolGray.50' }}
          _light={{ color: 'coolGray.800' }}
        >
          Order : {orderID}
        </Text>
        <Text fontSize="xs" color="emerald.600">
          {delivery}
        </Text>
      </HStack>
      <HStack space="3">
        <Link borderRadius="sm" overflow="hidden" href="">
          <Image
            source={product.imageUri}
            alt="Alternate Text"
            height="90"
            width="74"
          />
        </Link>

        <Link href="" isUnderlined={false}>
          <Box>
            <Text
              fontSize="md"
              fontWeight="bold"
              _dark={{ color: 'coolGray.50' }}
              _light={{ color: 'coolGray.800' }}
            >
              {product.item}
            </Text>

            <Text
              fontSize="sm"
              _dark={{ color: 'coolGray.400' }}
              _light={{ color: 'coolGray.500' }}
            >
              {product.details}
            </Text>
            <Text
              fontSize="sm"
              _dark={{ color: 'coolGray.400' }}
              _light={{ color: 'coolGray.500' }}
            >
              Size : {product.size}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="medium"
              _dark={{ color: 'coolGray.50' }}
              _light={{ color: 'coolGray.800' }}
              mt="0.5"
            >
              {product.amount}
            </Text>
          </Box>
        </Link>
      </HStack>
    </VStack>
  );
}
function CardSection() {
  return (
    <Box
      _dark={{ bg: 'coolGray.800' }}
      _light={{ bg: 'white' }}
      px={{ base: 4, md: 0 }}
      pt={{ base: 5, md: 0 }}
      pb={{ base: 4, md: 3 }}
      mx={{ md: 4 }}
    >
      {order.productList.map((item, index) => {
        return (
          <Card
            key={index}
            product={item}
            orderID={order.id}
            delivery={order.delivery}
          />
        );
      })}
    </Box>
  );
}
function ReasonForCancellation() {
  return (
    <Box
      px={{ base: 4, md: 0 }}
      py={{ base: 2, md: 0 }}
      mt={{ base: 4, md: 0 }}
      mx={{ md: 4 }}
      _dark={{ bg: 'coolGray.800' }}
      _light={{ bg: 'white' }}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
        my="3"
      >
        Reason for cancellation
      </Text>
      <Radio.Group name="myRadioGroup" defaultValue="1">
        {reasonList.map((item, index) => {
          return (
            <Box key={index} my="3">
              <Radio
                _light={{
                  borderColor: 'coolGray.300',
                  _text: { color: 'coolGray.500' },
                }}
                _dark={{
                  borderColor: 'coolGray.500',
                  _text: { color: 'coolGray.400' },
                  _checked: {
                    _icon: { color: 'primary.500' },
                    borderColor: 'primary.500',
                  },
                }}
                key={index}
                _text={{ fontSize: 'sm' }}
                value={item}
              >
                {item}
              </Radio>
            </Box>
          );
        })}
      </Radio.Group>
    </Box>
  );
}
function MainContent() {
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <Box
      flex={1}
      px={{ base: 0, md: 4, lg: 12, xl: '124' }}
      py={{ base: 0, md: 8 }}
      rounded={{ md: 'sm' }}
      _light={{
        bg: { md: 'white', base: 'primary.50' },
      }}
      _dark={{
        bg: { md: 'coolGray.800', base: 'coolGray.700' },
      }}
    >
      <ScrollView>
        <CardSection />
        <ReasonForCancellation />
        <Modal
          isOpen={modalVisible}
          onClose={setModalVisible}
          size="lg"
          _light={{ bg: '#111827:alpha.70' }}
          width="100%"
        >
          <Modal.Content
            _dark={{ bg: 'coolGray.800' }}
            _light={{ bg: 'coolGray.50' }}
            p="6"
            width={{ base: '342', md: '400' }}
            borderRadius="lg"
          >
            <Box alignItems="center">
              <Icon
                as={MaterialIcons}
                name="check-circle"
                size="56u"
                _light={{ color: 'emerald.500' }}
                _dark={{ color: 'emerald.400' }}
              />
              <Text
                fontSize="md"
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
                textAlign="center"
                mt="5"
              >
                Your order has been cancelled. Please retain cancellation
                information for records.
              </Text>
              <Button
                variant="solid"
                mt="6"
                width="100%"
                onPress={() => setModalVisible(false)}
              >
                VIEW ALL ORDERS
              </Button>
            </Box>
          </Modal.Content>
        </Modal>
      </ScrollView>
      <Button
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
        variant="solid"
        mx={{ base: 4, md: 4 }}
        mt={{ base: '3', md: 'auto' }}
        mb={{ base: 4, md: 0 }}
      >
        SUBMIT
      </Button>
    </Box>
  );
}

export default function RequestCancellation() {
  return (
    <DashboardLayout title="Request Cancellation" displaySidebar>
      <MainContent />
    </DashboardLayout>
  );
}
