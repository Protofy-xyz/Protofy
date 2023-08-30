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
} from 'native-base';

import DashboardLayout from '../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

type ProductProps = {
  id: string;
  orderId: string;
  imageUri: ImageSourcePropType;
  item: string;
  details: string;
  size: string;
  delivery: string;
  amount: string;
};
const productList: ProductProps[] = [
  {
    id: '1',
    orderId: '#9726895435345',
    imageUri: require('./images/lamp.png'),
    item: 'BEDLAMP',
    details: 'Automatic sensor,Multi color',
    size: 'Medium',
    delivery: 'Delivered',
    amount: '₹1635.00',
  },
];
const reasonList: string[] = [
  'Quality of product not as expected',
  'Received damaged product',
  'Received wrong item',
  'Don’t want product anymore',
  'Other',
];

function Card(props: ProductProps) {
  return (
    <VStack
      _dark={{ bg: 'coolGray.700' }}
      _light={{ bg: 'coolGray.100' }}
      borderRadius="sm"
      p="3"
      space="3"
    >
      <HStack justifyContent="space-between">
        <Text
          fontSize="xs"
          _dark={{ color: 'coolGray.50' }}
          _light={{ color: 'coolGray.800' }}
        >
          Order : {props.orderId}
        </Text>
        <Text fontSize="xs" color="emerald.600">
          {props.delivery}
        </Text>
      </HStack>
      <HStack space="3">
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
            _hover={{
              _text: {
                _dark: { color: 'coolGray.200' },
                _light: { color: 'coolGray.600' },
              },
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
            fontWeight="medium"
            _dark={{ color: 'coolGray.50' }}
            _light={{ color: 'coolGray.800' }}
            mt="0.5"
          >
            {props.amount}
          </Text>
        </Box>
      </HStack>
    </VStack>
  );
}
function CardSection() {
  return (
    <VStack
      space="4"
      _dark={{ bg: 'coolGray.800' }}
      _light={{ bg: 'white' }}
      px={{ base: 4, md: 0 }}
      pt={{ base: 5, md: 0 }}
      pb={{ base: 4, md: 0 }}
    >
      {productList.map((item, index) => {
        return <Card key={index} {...item} />;
      })}
    </VStack>
  );
}
function ReasonForReturn() {
  return (
    <Box
      px={{ base: 4, md: 0 }}
      py={{ base: 2, md: 0 }}
      mt={{ base: 4, md: 3 }}
      mb="8"
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
        Reason for return
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
      px={{ base: 0, md: 8, lg: 16, xl: '140' }}
      py={{ base: 0, md: 8 }}
      rounded={{ md: 'sm' }}
      _light={{
        bg: { md: 'white', base: 'primary.50' },
      }}
      _dark={{
        bg: { md: 'coolGray.800', base: 'coolGray.700' },
      }}
    >
      <CardSection />
      <ReasonForReturn />
      <Modal
        isOpen={modalVisible}
        onClose={setModalVisible}
        size="lg"
        _light={{ bg: 'rgba(31,41,55,0.6)' }}
        width="100%"
      >
        <Modal.Content
          _dark={{ bg: 'coolGray.800' }}
          p="6"
          width={{ base: '342', md: '400' }}
          borderRadius={8}
        >
          <Box borderRadius="xl" alignItems="center">
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
              Your return has been Accepted. Please retain return information
              for records.
            </Text>
            <Button variant="solid" width="100%" mt="6">
              VIEW ALL ORDERS
            </Button>
          </Box>
        </Modal.Content>
      </Modal>
      <Button
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
        variant="solid"
        mx={{ base: 4, md: 0 }}
        mt="auto"
        mb={{ base: 4, md: 0 }}
      >
        RETURN
      </Button>
    </Box>
  );
}

export default function ReturnOrder() {
  return (
    <>
      <DashboardLayout title="Return Order" displaySidebar>
        <MainContent />
      </DashboardLayout>
    </>
  );
}
