import React, { useState } from 'react';
import {
  Box,
  HStack,
  Text,
  VStack,
  Button,
  Image,
  Radio,
  Divider,
  Hidden,
  Input,
  Heading,
  Stack,
  IStackProps,
  IInputProps,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const paymentTypeList: string[] = [
  'Add Debit/Credit/ATM Card',
  'Net Banking',
  'Wallet',
  'Cash on Delivery',
];

type OrderDetails = {
  key: string;
  value: string;
  props?: IStackProps;
};
const orderDetails: OrderDetails[] = [
  {
    key: 'Total MRP',
    value: '₹3561.00',
  },
  {
    key: 'Discount on MRP',
    value: '₹(214.00)',
  },
  {
    key: 'Coupon Discount',
    value: '-',
  },
  {
    key: 'Shipping',
    value: 'Free',
  },
];

function OrderDetailsItem({
  orderKey,
  orderValue,
  props,
}: {
  orderKey: string;
  orderValue: string;
  props?: IStackProps;
}) {
  return (
    <HStack py="2" justifyContent="space-between" {...props}>
      <Text
        fontSize="xs"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        {orderKey}
      </Text>
      <Text
        fontSize="xs"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        {...props?._text}
      >
        {orderValue}
      </Text>
    </HStack>
  );
}

function OrderDetailsCard() {
  return (
    <Box
      px="4"
      py="3"
      borderRadius="sm"
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: 'coolGray.700' }}
    >
      <Heading py="2" size="xs" _light={{ color: 'coolGray.800' }}>
        Order Details
      </Heading>
      {orderDetails.map((description, index) => (
        <OrderDetailsItem
          key={index}
          orderKey={description.key}
          orderValue={description.value}
          props={description.props}
        />
      ))}
      <Divider bg="coolGray.200" />
      <HStack pt="3" pb="2" justifyContent="space-between">
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Total Amount
        </Text>
        <Text
          fontSize="sm"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          3340.00
        </Text>
      </HStack>
    </Box>
  );
}

function FormInput({
  value,
  changeValue,
  label,
  placeholder,
  name,
  ..._input
}: {
  value: string;
  changeValue: (val: string) => (txt: string) => void;
  label: string;
  placeholder: string;
  name: string;
  _input?: IInputProps;
}) {
  return (
    <VStack space="3" w="full" flex={1}>
      <Text
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
        fontSize="sm"
        fontWeight="medium"
      >
        {label}
      </Text>
      <Input
        flex={1}
        placeholder={placeholder}
        value={value}
        onChange={(e) => e.stopPropagation()}
        onChangeText={changeValue(name)}
        {..._input}
      />
    </VStack>
  );
}

function PaymentForm() {
  type PaymentFormType = {
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvv: string;
  };

  const [paymentData, setPaymentData] = useState<PaymentFormType>({
    cardNumber: '6434007899834567',
    cardHolderName: 'Jane Cooper',
    expirationDate: '08/2024',
    cvv: '012',
  });

  const handleInputChange = (key: string) => (value: string) =>
    setPaymentData((prev) => ({ ...prev, [key]: value }));

  const { cardNumber, cardHolderName, expirationDate, cvv } = paymentData;

  return (
    <Box py="3" pl="44" pr={{ base: '4', md: '0' }} w="full">
      <Stack direction={{ base: 'column', md: 'row' }} space="6">
        <FormInput
          name="cardNumber"
          placeholder="Enter card number"
          changeValue={handleInputChange}
          value={cardNumber}
          label="CARD NUMBER"
          _input={{
            keyboardType: 'numeric',
            maxLength: 16,
          }}
        />
        <FormInput
          name="cardHolderName"
          placeholder="Enter cardholder name"
          changeValue={handleInputChange}
          value={cardHolderName}
          label="CARDHOLDER NAME"
        />
      </Stack>
      <HStack space="6" mt="6">
        <FormInput
          name="expirationDate"
          placeholder="Enter card expiration date"
          changeValue={handleInputChange}
          value={expirationDate}
          label="EXPIRATION DATE"
          _input={{
            isReadOnly: true,
            editable: false,
          }}
        />
        <FormInput
          name="cvv"
          placeholder="Enter CVV"
          changeValue={handleInputChange}
          value={cvv}
          label="CVV"
          _input={{
            keyboardType: 'numeric',
            maxLength: 3,
          }}
        />
      </HStack>
    </Box>
  );
}

function PaymentMethodSelector({
  value,
  label,
  paymentInputComponent,
  showInput,
}: {
  value: string;
  label: string;
  paymentInputComponent?: JSX.Element | JSX.Element[] | null;
  showInput: boolean;
}) {
  return (
    <>
      <Box py="3" px={{ base: '4', md: '0' }}>
        <Radio
          value={value}
          alignItems="center"
          size="sm"
          _text={{
            fontSize: 'sm',
            _dark: { color: 'coolGray.400' },
            _light: { color: 'coolGray.500' },
            lineHeight: '21',
          }}
        >
          {label}
        </Radio>
      </Box>
      {showInput ? paymentInputComponent : null}
    </>
  );
}

function PaymentMethod() {
  const [value, setValue] = useState('');

  const getCurrentMethodInputForm = () => {
    switch (value) {
      case '1':
        return <PaymentForm />;
      default:
        return null;
    }
  };

  return (
    <VStack pt={{ md: '2' }} mb="4">
      <Radio.Group
        name="select payment method"
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        py={{ base: '2', md: '0' }}
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
        }}
        px={{ base: '4', md: '0' }}
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          py="3"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          lineHeight="21"
        >
          Select a payment method
        </Text>
        <Box py="3">
          <Radio value="0" size="sm">
            <Text
              fontSize="sm"
              _dark={{ color: 'coolGray.400' }}
              _light={{ color: 'coolGray.500' }}
              lineHeight="21"
            >
              Phone pay UPI- Axis Bank
            </Text>
            <Image
              source={require('./images/Payment9.png')}
              alt="Alternate Text"
              height={6}
              width={6}
            />
          </Radio>
        </Box>
      </Radio.Group>

      <Radio.Group
        name="More ways to pay"
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        mt={{ base: 4, md: 0 }}
        py={{ base: 2, md: 0 }}
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
        }}
      >
        <Text
          px={{ base: '4', md: '0' }}
          pt="2"
          pb="3"
          fontSize="sm"
          fontWeight="medium"
          lineHeight="21"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          More Ways to pay
        </Text>
        {paymentTypeList.map((method, index) => (
          <PaymentMethodSelector
            key={index}
            value={`${index + 1}`}
            label={method}
            paymentInputComponent={getCurrentMethodInputForm()}
            showInput={value === (index + 1).toString()}
          />
        ))}
      </Radio.Group>
    </VStack>
  );
}

function MainContent() {
  return (
    <>
      <Hidden till="md">
        <OrderDetailsCard />
      </Hidden>
      <PaymentMethod />
    </>
  );
}

export default function () {
  return (
    <>
      <DashboardLayout title="Payments" rightPanelMobileHeader={false}>
        <KeyboardAwareScrollView
          bounces={false}
          enableOnAndroid={true}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ height: '100%', width: '100%' }}
        >
          <Box
            flex={1}
            px={{ md: 8, lg: 16, xl: 35 }}
            py={{ md: 8 }}
            rounded={{ md: 'sm' }}
            _light={{ bg: { md: 'white' } }}
            _dark={{
              bg: { md: 'coolGray.800', base: 'coolGray.700' },
            }}
          >
            <MainContent />
            <Button
              variant="solid"
              size="lg"
              mt="auto"
              mb="1"
              mx={{ base: '4', md: '0' }}
            >
              CONTINUE
            </Button>
          </Box>
        </KeyboardAwareScrollView>
      </DashboardLayout>
    </>
  );
}
