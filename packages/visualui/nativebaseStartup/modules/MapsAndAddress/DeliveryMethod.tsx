import React from 'react';
import { HStack, Text, Image, Button, Radio, Box, VStack } from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ImageSourcePropType } from 'react-native';

type ProductType = {
  name: string;
  category: string;
  size: string;
  price: string;
  imageSrc: ImageSourcePropType;
};

const reasonList: string[] = [
  'Thursday- Free delivery',
  'Tuesday- Delivery fee ₹50',
  '2 Business Days- Delivery fee ₹150',
  'Pickup',
];

const product: ProductType = {
  name: 'BEDLAMP',
  category: 'Automatice sensor, Multi color',
  size: 'Medium',
  price: '₹1635',
  imageSrc: require('./images/Maps1.png'),
};

function Card(props: ProductType) {
  return (
    <VStack
      _dark={{ bg: 'coolGray.700' }}
      _light={{ bg: 'coolGray.100' }}
      borderRadius="sm"
      p="3"
      space="3"
    >
      <HStack space="3">
        <Image
          source={props.imageSrc}
          alt="Alternate Text"
          height="90"
          width="74"
        />

        <Box>
          <Text
            fontSize="md"
            fontWeight="bold"
            _dark={{ color: 'coolGray.50' }}
            _light={{ color: 'coolGray.800' }}
          >
            {props.name}
          </Text>
          <Text
            fontSize="sm"
            _dark={{ color: 'coolGray.400' }}
            _light={{ color: 'coolGray.500' }}
          >
            {props.category}
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
            {props.price}
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
      <Card {...product} />
    </VStack>
  );
}
function DeliveryOptions() {
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
        Choose a delivery option
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
      <DeliveryOptions />

      <Button
        variant="solid"
        mx={{ base: 4, md: 0 }}
        mt="auto"
        mb={{ base: 4, md: 0 }}
      >
        CONTINUE
      </Button>
    </Box>
  );
}

export default function DeliveryMethod() {
  return (
    <>
      <DashboardLayout title="Return Order" displaySidebar>
        <MainContent />
      </DashboardLayout>
    </>
  );
}
