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
  ScrollView,
  Icon,
  Checkbox,
  Link,
} from 'native-base';

import DashboardLayout from '../../layouts/DashboardLayout';
import { ImageSourcePropType } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
  productList: ProductProps[];
};

const order: Order = {
  id: '#9726895435345',
  productList: [
    {
      id: '1',
      imageUri: require('./images/reebok.png'),
      item: 'Reebok',
      details: 'CL LEGACY',
      size: '8',
      amount: '₹6,599.00',
    },
    {
      id: '2',
      imageUri: require('./images/addidas.png'),
      item: 'Addidas',
      details: 'FLOATRIDE ENERGY',
      size: '8',
      amount: '₹8,999.00',
    },
  ],
};

const reasonList = [
  'I want to change my phone number',
  'I have changed my mind',
  'I have purchased the product elsewhere',
  'Expected delivery time is very long',
  'I want to change address for the order',
  'I want to cancel due to product quality issues',
];

function Card(props: ProductProps) {
  return (
    <HStack alignItems="center" space="2">
      <Checkbox
        value={props.id}
        defaultIsChecked={props.id === '2' ? true : false}
        size="md"
        accessibilityLabel="Product"
      />
      <HStack
        _dark={{ bg: 'coolGray.700' }}
        _light={{ bg: 'coolGray.100' }}
        borderRadius="sm"
        px="3"
        pt="3"
        pb="14"
        flex={1}
        space="3"
        alignItems="center"
      >
        <Link borderRadius="sm" href="#">
          <Image
            source={props.imageUri}
            alt="Alternate Text"
            height="90"
            width="74"
          />
        </Link>
        <Box>
          <Link
            href="#"
            isUnderlined={false}
            _text={{
              fontSize: 'md',
              fontWeight: 'bold',
              _dark: { color: 'coolGray.50' },
              _light: { color: 'coolGray.800' },
            }}
          >
            {props.item}
          </Link>
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
            fontSize="sm"
            _dark={{ color: 'coolGray.50', fontWeight: 'bold' }}
            _light={{ color: 'coolGray.800', fontWeight: 'medium' }}
            mt="0.5"
          >
            {props.amount}
          </Text>
        </Box>
      </HStack>
    </HStack>
  );
}
function CardSection() {
  return (
    <Box
      _dark={{ bg: 'coolGray.800' }}
      _light={{ bg: 'white' }}
      px={{ base: 4, md: 0 }}
      pt={{ base: 5, md: 0 }}
      pb={{ base: 4, md: 0 }}
      mx={{ md: 4 }}
    >
      <Text
        fontSize="md"
        mb="4"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
      >
        Order :{order.id}
      </Text>
      <VStack space="4">
        {order.productList.map((item, index) => {
          return <Card key={index} {...item} />;
        })}
      </VStack>
    </Box>
  );
}
function ReasonForCancellation() {
  return (
    <Box
      px={{ base: 4, md: 0 }}
      py={{ base: 2, md: 0 }}
      mt={{ base: 4, md: 3 }}
      _dark={{ bg: 'coolGray.800' }}
      _light={{ bg: 'white' }}
      mb={{ md: '8' }}
      mx={{ md: 4 }}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
        my="3"
      >
        Reason for Cancellation
      </Text>
      <Radio.Group name="myRadioGroup">
        {reasonList.map((item, index) => {
          return (
            <Box key={index} my={3}>
              <Radio
                _light={{
                  _text: { color: 'coolGray.500' },
                }}
                _dark={{
                  _text: { color: 'coolGray.400' },
                  _checked: {
                    _icon: {
                      color: 'primary.500',
                    },
                    borderColor: 'primary.500',
                  },
                }}
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
        mx="4"
        mt={{ base: '3', md: 'auto' }}
        mb={{ base: 4, md: 0 }}
      >
        SUBMIT
      </Button>
    </Box>
  );
}

export default function () {
  return (
    <DashboardLayout title="Request Cancellation" displaySidebar>
      <MainContent />
    </DashboardLayout>
  );
}
