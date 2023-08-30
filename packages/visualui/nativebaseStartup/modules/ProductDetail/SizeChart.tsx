import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  ScrollView,
  Pressable,
  Button,
  Radio,
  IBoxProps,
  IStackProps,
  Heading,
  Hidden,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';

type SizeType = {
  size: string;
  length: string;
};

type ShirtSizeType = SizeType & {
  chest: string;
  shoulder: string;
};

type PantSizeType = SizeType & {
  waist: string;
  hips: string;
};

const shirtSizeList: ShirtSizeType[] = [
  {
    size: 'Size',
    chest: 'Chest',
    shoulder: 'Shoulder',
    length: 'Length',
  },
  {
    size: '38',
    chest: '40.2',
    shoulder: '16.5',
    length: '29.5',
  },
  {
    size: '40',
    chest: '41.5',
    shoulder: '17.5',
    length: '30',
  },
  {
    size: '42',
    chest: '43',
    shoulder: '18.5',
    length: '30.5',
  },
  {
    size: '44',
    chest: '48.5',
    shoulder: '19.5',
    length: '30.75',
  },
  {
    size: '46',
    chest: '51',
    shoulder: '20.5',
    length: '31',
  },
  {
    size: '48',
    chest: '53.5',
    shoulder: '21.5',
    length: '21.5',
  },
  {
    size: '50',
    chest: '56',
    shoulder: '22.5',
    length: '32',
  },
];

const pantSizeList: PantSizeType[] = [
  {
    size: 'Size',
    waist: 'Waist',
    hips: 'Hips',
    length: 'Length',
  },
  {
    size: '38',
    waist: '40.2',
    hips: '16.5',
    length: '29.5',
  },
  {
    size: '40',
    waist: '41.5',
    hips: '17.5',
    length: '30',
  },
  {
    size: '42',
    waist: '43',
    hips: '18.5',
    length: '30.5',
  },
];

function ConvertValue(value: string, index: number, type: string) {
  if (type === 'cm') {
    return value;
  }

  if (index === 0) {
    return value;
  } else {
    return (Number(value) / 2.54).toFixed(2);
  }
}

function TableCell({ children, ...props }: IBoxProps) {
  return (
    <Box flex={1} {...props}>
      {children}
    </Box>
  );
}

function TableRow({ children, ...props }: IStackProps) {
  return (
    <HStack
      justifyContent="space-between"
      py="3"
      px="4"
      w="full"
      _light={{
        borderColor: 'coolGray.200',
      }}
      _dark={{
        borderColor: 'coolGray.700',
      }}
      borderLeftWidth={1}
      borderRightWidth={1}
      borderBottomWidth={1}
      {...props}
    >
      {children}
    </HStack>
  );
}

function Table({ children, ...props }: IBoxProps) {
  return (
    <Box w="full" {...props}>
      {children}
    </Box>
  );
}

function ProductCard() {
  return (
    <HStack
      py={{ base: 0, md: 4 }}
      _light={{ bg: { base: 'white', md: 'coolGray.50' } }}
      _dark={{ bg: { base: 'coolGray.800', md: 'coolGray.700' } }}
      w="100%"
      px={{ base: 0, md: 4 }}
      space={3}
      alignItems="flex-start"
      borderRadius="sm"
    >
      <Image
        width={{ md: 20, base: 74 }}
        height={{ md: 24, base: 90 }}
        rounded="lg"
        alt="Alternate Text"
        source={require('./images/babyshirt.png')}
      />

      <VStack
        flex={1}
        space={{ base: 1, md: 1 }}
        justifyContent="space-between"
      >
        <Text
          fontSize="md"
          fontWeight="bold"
          lineHeight="24"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Body Suit
        </Text>
        <Text
          fontSize="sm"
          fontWeight="normal"
          color="coolGray.400"
          lineHeight="21"
        >
          Mother care
        </Text>

        <Text
          mt={{ base: 5, md: 6 }}
          fontSize="sm"
          fontWeight="normal"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          lineHeight="21"
        >
          ₹500
        </Text>
      </VStack>
    </HStack>
  );
}

const AddToCartButton = (props: { base: string; md: string }) => {
  return (
    <HStack
      px={{ base: 4, md: 0 }}
      py={{ base: 4, md: 0 }}
      _light={{ bg: { base: 'white', md: 'transparent' } }}
      _dark={{ bg: { base: 'coolGray.800', md: 'transparent' } }}
      position={{ base: 'absolute', md: undefined }}
      bottom={{ base: 0, md: undefined }}
      mt="auto"
      w="100%"
      space="4"
      alignItems="center"
      flex={1}
      display={{
        base: props.base,
        md: props.md,
      }}
    >
      <Pressable
        p="2.5"
        _light={{ bg: 'primary.50' }}
        _dark={{ bg: 'coolGray.700' }}
        borderRadius="xs"
        onPress={() => {
          console.log('hello');
        }}
      >
        <Icon
          size="6"
          name="favorite-border"
          as={MaterialIcons}
          _dark={{ color: 'primary.500' }}
          _light={{ color: 'primary.900' }}
        />
      </Pressable>
      <Button variant="solid" flex={1} size="lg">
        ADD TO CART
      </Button>
    </HStack>
  );
};

function SizeMeasurmentTable({
  sizeOptions,
  caption,
  measurement,
  value,
  setValue,
  ...props
}: IBoxProps & {
  sizeOptions: PantSizeType[] | ShirtSizeType[];
  caption: string;
  measurement: string;
  value: string;
  setValue: (prev: string) => void;
}) {
  return (
    <Table justifyContent="flex-end" {...props}>
      <Radio.Group
        key={Math.random()}
        w="100%"
        name="myRadioGroup"
        accessibilityLabel="favorite number"
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
        }}
      >
        <HStack
          flex={1}
          py={3}
          w="full"
          justifyContent="center"
          _light={{ bg: 'coolGray.50', borderColor: 'coolGray.200' }}
          _dark={{ bg: 'coolGray.700', borderColor: 'coolGray.700' }}
          borderTopRadius="sm"
          borderWidth={1}
          borderBottomWidth={0}
        >
          <Heading
            size="sm"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            {caption}
          </Heading>
        </HStack>
        {sizeOptions.map(
          (sizeObject: ShirtSizeType | PantSizeType, index: number) => {
            return (
              <TableRow
                key={index}
                borderBottomRadius={index === sizeOptions.length - 1 ? 'sm' : 0}
              >
                <TableCell>
                  {index !== 0 && (
                    <Radio
                      w={5}
                      h={5}
                      value={index.toString()}
                      my={0}
                      accessibilityLabel={'radio' + index}
                    />
                  )}
                </TableCell>
                {Object.values(sizeObject).map((val: string, ind: number) => {
                  return (
                    <TableCell key={ind}>
                      {index === 0 ? (
                        <Heading
                          size="xs"
                          _light={{ color: 'coolGray.500' }}
                          _dark={{ color: 'coolGray.400' }}
                        >
                          {ConvertValue(val, index, measurement)}
                        </Heading>
                      ) : (
                        <Text
                          fontWeight="medium"
                          _light={{
                            color:
                              index === Number(val)
                                ? 'coolGray.800'
                                : 'coolGray.500',
                          }}
                          _dark={{
                            color:
                              index === Number(val)
                                ? 'coolGray.50'
                                : 'coolGray.400',
                          }}
                        >
                          {ConvertValue(val, index, measurement)}
                        </Text>
                      )}
                    </TableCell>
                  );
                })}

                {Object.keys(sizeObject).length <
                  Object.keys(sizeOptions[0]).length &&
                  Array.from(
                    {
                      length:
                        Object.keys(sizeOptions[0]).length -
                        Object.keys(sizeObject).length,
                    },
                    (_, k) => <TableCell key={k} />
                  )}
              </TableRow>
            );
          }
        )}
      </Radio.Group>
    </Table>
  );
}

function MeasurementUnit({
  measurement,
  setMeasurement,
}: {
  measurement: string;
  setMeasurement: (prev: string) => void;
}) {
  return (
    <>
      <HStack
        w="100%"
        space="2"
        justifyContent="flex-end"
        mt={{ base: 1, md: 5 }}
      >
        <Pressable
          py="1"
          px="3"
          borderRadius="4"
          borderWidth={1}
          onPress={() => {
            setMeasurement('cm');
          }}
          _light={{
            bg: measurement === 'cm' ? 'primary.50' : 'white',
            borderColor: measurement === 'cm' ? 'primary.50' : 'coolGray.200',
          }}
          _dark={{
            bg: measurement === 'cm' ? 'coolGray.700' : 'coolGray.800',
            borderColor: 'coolGray.700',
          }}
        >
          <Text
            fontWeight="medium"
            textAlign={'center'}
            fontSize="sm"
            lineHeight="21"
            _light={{
              color: measurement === 'cm' ? 'primary.900' : 'coolGray.400',
            }}
            _dark={{
              color: measurement === 'cm' ? 'primary.500' : 'coolGray.400',
            }}
          >
            cm
          </Text>
        </Pressable>
        <Pressable
          py="1"
          px="3"
          borderWidth={1}
          borderRadius={4}
          onPress={() => setMeasurement('inch')}
          _light={{
            bg: measurement === 'inch' ? 'primary.50' : 'white',
            borderColor: measurement === 'inch' ? 'primary.50' : 'coolGray.200',
          }}
          _dark={{
            bg: measurement === 'inch' ? 'coolGray.700' : 'coolGray.800',
            borderColor: 'coolGray.700',
          }}
        >
          <Text
            fontWeight="medium"
            textAlign="center"
            fontSize="sm"
            lineHeight="21"
            _light={{
              color: measurement === 'inch' ? 'primary.900' : 'coolGray.400',
            }}
            _dark={{
              color: measurement === 'inch' ? 'primary.500' : 'coolGray.400',
            }}
          >
            in
          </Text>
        </Pressable>
      </HStack>
    </>
  );
}

function MainContent() {
  const [measurement, setMeasurement] = React.useState('cm');
  const [shirtSize, setShirtSize] = React.useState('5');
  const [pantSize, setPantSize] = React.useState('3');
  return (
    <Box
      flex={1}
      w="100%"
      rounded={{ md: 'sm' }}
      _light={{ bg: 'white' }}
      _dark={{
        bg: 'coolGray.800',
      }}
      py={{ base: '4', md: '8' }}
      px={{ base: '4', lg: '140' }}
      alignItems="center"
      mb={16}
    >
      <ProductCard />
      <MeasurementUnit
        measurement={measurement}
        setMeasurement={setMeasurement}
      />
      <SizeMeasurmentTable
        sizeOptions={shirtSizeList}
        caption="SHIRT SIZE & FIT GUIDE"
        measurement={measurement}
        value={shirtSize}
        setValue={setShirtSize}
        mt={3}
      />
      <SizeMeasurmentTable
        sizeOptions={pantSizeList}
        caption="PANT SIZE & FIT GUIDE"
        measurement={measurement}
        value={pantSize}
        setValue={setPantSize}
        mt={8}
        mb={4}
      />
      <Hidden till="md">
        <AddToCartButton base="none" md="flex" />
      </Hidden>
    </Box>
  );
}

export default function SizeChart() {
  return (
    <>
      <DashboardLayout title="Size Chart" showIcons displaySidebar={true}>
        <ScrollView w="100%" height="100%" bounces={false}>
          <MainContent />
        </ScrollView>
        <AddToCartButton base="flex" md="none" />
      </DashboardLayout>
    </>
  );
}
