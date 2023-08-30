import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  Pressable,
  Divider,
  Button,
  ScrollView,
  Radio,
  Modal,
  useDisclose,
  Hidden,
  Actionsheet,
  Link,
  IconButton,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Platform } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

type ProductProps = {
  productId: string;
  imageUri: ImageSourcePropType;
  item: string;
  size: string;
  amount: number;
  discount: string;
};

type Detail = {
  name: string;
  nameAmount: string;
};

const productList: ProductProps[] = [
  {
    productId: '1',
    imageUri: require('./images/bedlamp.png'),
    item: 'BEDLAMP',
    size: 'Size : Small',
    amount: 79,
    discount: ' (25% OFF)',
  },
  {
    productId: '2',
    imageUri: require('./images/perfume.png'),
    item: 'SAFEGUARD',
    size: 'Size : Large',
    amount: 999,
    discount: ' (45% OFF)',
  },
  {
    productId: '3',
    imageUri: require('./images/skin.png'),
    item: 'SKIN CARE KIT',
    size: 'Size : Medium',
    amount: 1899,
    discount: ' (60% OFF)',
  },
];

const orderDetails: Detail[] = [
  {
    name: 'Total MRP',
    nameAmount: '3,561.0',
  },
  {
    name: 'Discount on MRP',
    nameAmount: '-214.0',
  },
  {
    name: 'Coupon Discount',
    nameAmount: 'Apply Coupon',
  },
  {
    name: 'Shipping',
    nameAmount: 'Free',
  },
];
const reasonList = [
  {
    primaryText: 'Monday',
    secondaryText: '- Free Delivery',
  },
  {
    primaryText: 'Tuesday',
    secondaryText: '- Delivery Fee ₹50 ',
  },
  {
    primaryText: '2 Business Days ',
    secondaryText: '- Delivery Fee ₹150',
  },
  {
    primaryText: 'Pickup',
    secondaryText: '- Find a Location',
  },
];

function NumberOfOrder() {
  const [numberOfOrder, setNumberOfOrder] = React.useState(1);

  return (
    <HStack alignItems="center" space="3" ml="auto">
      <IconButton
        variant="unstyled"
        p="1.5"
        borderRadius="xs"
        _light={{ bg: 'primary.300' }}
        _dark={{ bg: 'coolGray.800' }}
        _hover={{
          _light: { bg: 'primary.200' },
          _dark: { bg: 'coolGray.600' },
        }}
        icon={
          <Icon
            name="remove"
            as={MaterialIcons}
            size="3"
            _light={{ color: 'primary.900' }}
            _dark={{ color: 'coolGray.400' }}
          />
        }
        onPress={() => {
          if (numberOfOrder === 0) {
            return numberOfOrder;
          } else {
            setNumberOfOrder(numberOfOrder - 1);
          }
        }}
      />
      <Text
        fontSize="sm"
        fontWeight="bold"
        textAlign={'center'}
        minW="5"
        _dark={{ color: 'coolGray.400' }}
        _light={{ color: 'coolGray.500' }}
      >
        {numberOfOrder}
      </Text>

      <IconButton
        variant="unstyled"
        p="1.5"
        borderRadius="xs"
        _light={{ bg: 'primary.300' }}
        _dark={{ bg: 'coolGray.800' }}
        _hover={{
          _light: { bg: 'primary.200' },
          _dark: { bg: 'coolGray.600' },
        }}
        icon={
          <Icon
            name="add"
            as={MaterialIcons}
            size="3"
            _light={{ color: 'primary.900' }}
            _dark={{ color: 'coolGray.400' }}
          />
        }
        onPress={() => {
          setNumberOfOrder(numberOfOrder + 1);
        }}
      />
    </HStack>
  );
}
function PopUp() {
  const [value, setValue] = React.useState('0');
  return (
    <>
      <VStack
        justifyContent="flex-start"
        width="100%"
        px="6"
        pt={{ base: 1, md: 6 }}
        pb="6"
        _dark={{ bg: 'coolGray.800' }}
        _light={{ bg: 'white' }}
      >
        <HStack space="3">
          <Image
            source={require('./images/delivery.png')}
            alt="Alternate Text"
            height="74"
            width="16"
            borderRadius="lg"
          />
          <VStack>
            <Text
              fontSize="md"
              fontWeight="bold"
              _dark={{ color: 'coolGray.50' }}
            >
              Body Suit
            </Text>
            <Text fontSize="sm" fontWeight="normal" color="coolGray.400">
              Mother care
            </Text>
            <Text
              mt="2"
              fontSize="sm"
              fontWeight="normal"
              _dark={{ color: 'coolGray.50' }}
            >
              ₹500
            </Text>
          </VStack>
        </HStack>
        <Text
          fontSize="lg"
          _dark={{ color: 'coolGray.50' }}
          fontWeight="bold"
          mt="6"
          letterSpacing="0.2"
        >
          Choose a delivery option:
        </Text>
        <Radio.Group
          name="myRadioGroup"
          mt="2"
          value={value}
          onChange={(nextValue) => {
            setValue(nextValue);
          }}
        >
          {reasonList.map((item, index) => {
            return (
              <Box key={index} py="2">
                <Radio
                  _light={{
                    value: index.toString(),
                    borderColor: 'coolGray.300',
                  }}
                  _dark={{
                    value: index.toString(),
                    borderColor: 'coolGray.500',
                  }}
                  key={index}
                  value={index.toString()}
                >
                  <Text
                    fontWeight="medium"
                    fontSize="md"
                    _dark={{ color: 'primary.500' }}
                    _light={{ color: 'primary.900' }}
                    ml="2"
                  >
                    {item.primaryText}
                  </Text>
                  <Text
                    fontWeight="medium"
                    fontSize="md"
                    _dark={{ color: 'coolGray.50' }}
                    letterSpacing="0.2"
                  >
                    {item.secondaryText}
                  </Text>
                </Radio>
              </Box>
            );
          })}
        </Radio.Group>

        <Button
          _text={{ fontSize: 'sm', fontWeight: 'medium', letterSpacing: '1' }}
          variant="solid"
          size="lg"
          mt="5"
        >
          CONTINUE
        </Button>
      </VStack>
    </>
  );
}
function Card({ imageUri, amount, discount, item, size }: ProductProps) {
  const convertCommaSepratedNumbers = (value: number) => {
    let stringValue: any = value.toString();
    let valueAfterDecimalPoint = '';

    if (stringValue.indexOf('.') > 0)
      valueAfterDecimalPoint = stringValue.substring(
        stringValue.indexOf('.'),
        stringValue.length
      );

    stringValue = Math.floor(stringValue);
    stringValue = stringValue.toString();
    let lastThree = stringValue.substring(stringValue.length - 3);
    const otherNumbers = stringValue.substring(0, stringValue.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    const finalResult =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
      lastThree +
      valueAfterDecimalPoint;

    return finalResult;
  };

  return (
    <HStack
      alignItems="center"
      borderRadius="sm"
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: 'coolGray.700' }}
      py={{ base: '3', md: '4' }}
      px={{ base: '3', md: '4' }}
    >
      <Pressable>
        <Image
          w={{ base: 20, md: '60', lg: 20 }}
          h={{ base: 20, md: '60', lg: 20 }}
          rounded="sm"
          alt="Product Image"
          source={imageUri}
        />
      </Pressable>

      <VStack ml={3}>
        <Link
          href="https://nativebase.io"
          isUnderlined={false}
          _text={{
            fontSize: 'md',
            fontWeight: 'bold',
            _dark: { color: 'coolGray.50' },
          }}
          _hover={{
            _text: {
              _dark: { color: 'coolGray.300' },
              _light: { color: 'coolGray.600' },
            },
          }}
        >
          {item}
        </Link>

        <Text
          fontWeight="normal"
          fontSize="xs"
          _dark={{ color: 'coolGray.400' }}
          _light={{ color: 'coolGray.500' }}
        >
          {size}
        </Text>

        <HStack alignItems="center">
          <Text
            fontSize="sm"
            fontWeight="medium"
            _dark={{ color: 'coolGray.50' }}
          >
            {'\u20B9'}
            {convertCommaSepratedNumbers(amount)}
          </Text>
          <Text ml="1" fontSize="2xs" color="emerald.600" fontWeight="normal">
            {discount}
          </Text>
        </HStack>
      </VStack>
      <NumberOfOrder />
    </HStack>
  );
}
function CardSection() {
  return (
    <VStack
      px={{ base: 4, sm: 4, md: 8, lg: 24, xl: '140' }}
      pt={{ base: 5, md: 8 }}
      pb={{ base: 4, md: 0 }}
      mb={{ base: 4, md: 0 }}
      borderTopRadius={{ md: '8' }}
      _light={{
        bg: 'white',
      }}
      _dark={{
        bg: 'coolGray.800',
      }}
      space={{ base: '4', md: '2' }}
    >
      {productList.map((item, index) => {
        return <Card key={index} {...item} />;
      })}
    </VStack>
  );
}
function OrderDetails() {
  return (
    <Box
      px={{ base: 4, sm: 4, md: 8, lg: 24, xl: '140' }}
      pt={{ base: 4, md: 4 }}
      pb={{ base: 4, md: 4 }}
      mt={{ md: 3 }}
      mb="4"
      borderBottomRadius={{ md: '8' }}
      _light={{
        bg: { base: 'white' },
      }}
      _dark={{
        bg: 'coolGray.800',
      }}
    >
      <Text
        _dark={{ color: 'coolGray.50' }}
        fontWeight="medium"
        fontSize="sm"
        pb="2"
      >
        Order Details ( 3 items )
      </Text>

      {orderDetails.map((item, index) => {
        return (
          <HStack
            py="2"
            key={index}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text
              _dark={{ color: 'coolGray.50' }}
              fontWeight="normal"
              fontSize="xs"
            >
              {item.name}
            </Text>
            {item.nameAmount === 'Apply Coupon' ? (
              <Link
                href="https://nativebase.io"
                isUnderlined={false}
                _text={{
                  fontSize: 'xs',
                  fontWeight: 'normal',
                  _dark: { color: 'primary.500' },
                  _light: { color: 'primary.900' },
                }}
                _hover={{
                  _text: {
                    _dark: { color: 'primary.300' },
                    _light: { color: 'primary.500' },
                  },
                }}
              >
                {item.nameAmount}
              </Link>
            ) : (
              <Text
                fontSize="xs"
                fontWeight="normal"
                _dark={{ color: 'coolGray.50' }}
              >
                {item.nameAmount}
              </Text>
            )}
          </HStack>
        );
      })}
      <Divider mt="0.5" />
      <HStack alignItems="center" justifyContent="space-between" pt="2">
        <Text
          fontWeight="medium"
          fontSize="sm"
          _dark={{ color: 'coolGray.50' }}
        >
          Total Amount
        </Text>
        <Text
          fontWeight="normal"
          fontSize="sm"
          _dark={{ color: 'coolGray.50' }}
        >
          3340.00
        </Text>
      </HStack>
    </Box>
  );
}
function DeliveryAddress() {
  return (
    <HStack mb={{ base: 3, md: '26' }} justifyContent="space-between">
      <VStack flex={{ base: 0.6, md: 1 }}>
        <Text
          mb="14"
          fontSize="sm"
          fontWeight="medium"
          _dark={{ color: 'coolGray.50' }}
        >
          Select Delivery Address
        </Text>
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          fontWeight="bold"
          _dark={{ color: 'coolGray.400' }}
          _light={{ color: 'coolGray.500' }}
          lineHeight={{ md: '21' }}
        >
          Meagan Stith
        </Text>
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          _dark={{ color: 'coolGray.400' }}
          _light={{ color: 'coolGray.500' }}
          lineHeight={{ md: '21' }}
        >
          606-3727 Ullamcorper. Street Roseville NH 11523…
        </Text>
      </VStack>
      <Pressable>
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          fontWeight="normal"
          _dark={{ color: 'primary.500' }}
          _light={{ color: 'primary.900' }}
        >
          Change
        </Text>
      </Pressable>
    </HStack>
  );
}
function MainContent() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclose(false);
  return (
    <>
      <Box
        _light={{
          bg: { base: 'violet.50', md: 'white' },
        }}
        _dark={{
          bg: { base: 'customBlueGray', md: 'coolGray.800' },
        }}
      >
        <CardSection />
        <OrderDetails />
      </Box>
      <VStack
        mt={{ md: 4 }}
        px={{ base: 4, sm: 4, md: 8, lg: 24, xl: '140' }}
        py={{ base: 4, md: 8 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
      >
        <DeliveryAddress />
        <Button
          variant="solid"
          onPress={
            Platform.OS === 'ios'
              ? onOpen
              : () => {
                  setModalVisible(!modalVisible);
                }
          }
          _text={{
            fontSize: 'sm',
            fontWeight: 'medium',
          }}
        >
          PLACE ORDER
        </Button>
        <Hidden from="md">
          <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content
              _light={{ bg: 'white' }}
              _dark={{ bg: 'coolGray.800' }}
              p="0"
            >
              <PopUp />
            </Actionsheet.Content>
          </Actionsheet>
        </Hidden>

        <Hidden from="base" till="md">
          <Modal
            isOpen={modalVisible}
            onClose={setModalVisible}
            size="lg"
            marginX="auto"
          >
            <Modal.Content
              _dark={{ bg: 'coolGray.800' }}
              _light={{ bg: 'coolGray.50' }}
              maxWidth="390"
            >
              <PopUp />
            </Modal.Content>
          </Modal>
        </Hidden>
      </VStack>
    </>
  );
}
export default function Cart() {
  return (
    <>
      <DashboardLayout title="My Cart">
        <ScrollView>
          <MainContent />
        </ScrollView>
      </DashboardLayout>
    </>
  );
}
