import React, { useState } from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Image,
  ScrollView,
  Pressable,
  Button,
  Stack,
  Link,
  Hidden,
  IconButton,
  useColorModeValue,
} from 'native-base';
import type { ImageSourcePropType } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';

type SizesType = {
  size: string;
};

type ProductType = {
  title: string;
  category: string;
  rate: string;
  rating: number;
  numberOfRatings: number;
  description: string;
};

type ReviewType = {
  imageUrl: ImageSourcePropType;
  name: string;
  time: string;
  review: string;
};

const product: ProductType = {
  title: 'Body Suit',
  category: 'Mother care',
  rate: '500',
  rating: 4.9,
  numberOfRatings: 120,
  description: `Yellow bodysuit, has a round neck with envelope detail along the shoulder, short sleeves and snap button closures along the crotch.Your Body suit has a round neck with detail along the shoulder,short sleeves and snap button closer along the front.`,
};

const tabs = [
  {
    id: 1,
    title: 'Description',
    component: <Description productDescription={product.description} />,
  },
  {
    id: 2,
    title: 'Review',
    component: <Review />,
  },
];

const sizeOptions: SizesType[] = [
  {
    size: 'New Born',
  },
  {
    size: 'Tiny Baby',
  },
  {
    size: '0-3 M',
  },
];

const reviews: ReviewType[] = [
  {
    imageUrl: require('../../assets/laura.png'),
    name: 'Laura Jones',
    time: '02 Jan 2021',
    review:
      "I ordered this product for my 2 M old baby but it's too small. Go for 3-6M size even if you're ordering for a 3M old. Product quality is good.",
  },
  {
    imageUrl: require('../../assets/wade.png'),
    name: 'Wade Warren',
    time: '02 Jan 2021',
    review:
      'I loved the quality of their products. Highly recommended to everyone who is looking for comfortable bodysuits for their kids.',
  },
];

const AddToCartButton = () => {
  const [favorite, setFavorite] = useState(false);
  return (
    <HStack space="4" alignItems="center">
      <IconButton
        onPress={() => setFavorite(!favorite)}
        variant={'subtle'}
        _light={{
          bg: 'primary.50',
        }}
        _dark={{
          bg: 'coolGray.700',
        }}
        icon={
          <Icon
            size="6"
            name={favorite ? 'favorite' : 'favorite-border'}
            as={MaterialIcons}
            _dark={{ color: 'primary.500' }}
            _light={{ color: 'primary.900' }}
          />
        }
      />
      <Button flex={1} size="lg" variant="solid">
        CONTINUE
      </Button>
    </HStack>
  );
};

function SizeOptions({ options }: { options: SizesType[] }) {
  return (
    <HStack space="2" alignItems="center">
      {options.map((item, index) => {
        return (
          <Button
            p={3}
            key={index + ''}
            variant="unstyled"
            _text={{
              _light: { color: 'coolGray.800' },
              _dark: { color: 'coolGray.50' },
              fontSize: 'sm',
              fontWeight: 'normal',
            }}
            _light={{
              bg: 'primary.50',
              _hover: { bg: 'primary.200' },
              _pressed: { bg: 'primary.300' },
            }}
            _dark={{
              bg: 'coolGray.700',
              _hover: { bg: 'coolGray.600' },
              _pressed: { bg: 'coolGray.500' },
            }}
          >
            {item.size}
          </Button>
        );
      })}
    </HStack>
  );
}
function SizeChart({ options }: { options: SizesType[] }) {
  return (
    <VStack space="3">
      <HStack alignItems="center">
        <Text
          fontSize="sm"
          fontWeight="normal"
          _dark={{ color: 'coolGray.50' }}
          _light={{ color: 'coolGray.800' }}
          lineHeight="21"
        >
          Select Size
        </Text>
        <Text
          fontSize="sm"
          fontWeight="normal"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          lineHeight="21"
        >
          {''} (Age Group)
        </Text>
        <Link
          ml="auto"
          _text={{ textDecoration: 'none' }}
          _light={{
            _text: {
              color: 'primary.900',
            },
          }}
          _dark={{
            _text: {
              color: 'primary.500',
            },
          }}
          lineHeight="21"
        >
          Size Chart
        </Link>
      </HStack>
      <SizeOptions options={options} />
    </VStack>
  );
}
function ProductInfo({ productInfo }: { productInfo: ProductType }) {
  const textColorA = useColorModeValue('coolGray.800', 'coolGray.50');
  const textColorB = useColorModeValue('coolGray.500', 'coolGray.400');

  return (
    <Box>
      <HStack alignItems="center" space="1" mt={{ base: 4, md: 0 }}>
        <Text fontSize="lg" color={textColorA} fontWeight="medium">
          {productInfo.title}
        </Text>
        <Icon
          size="4"
          name={'star'}
          as={MaterialIcons}
          color="amber.400"
          ml="auto"
        />
        <Text
          fontSize="sm"
          fontWeight="normal"
          color={textColorA}
          lineHeight="21"
        >
          {productInfo.rating}
        </Text>
        <Text
          fontSize="sm"
          fontWeight="normal"
          color={textColorB}
          lineHeight="21"
        >
          {productInfo.numberOfRatings}
        </Text>
      </HStack>
      <Text
        fontSize="md"
        fontWeight="normal"
        color={textColorB}
        lineHeight="24"
      >
        {productInfo.category}
      </Text>
      <Text
        fontSize="xl"
        fontWeight="medium"
        color={textColorA}
        lineHeight="30"
      >
        ₹{productInfo.rate}
      </Text>
    </Box>
  );
}
function Description({ productDescription }: { productDescription: string }) {
  return (
    <Text
      mt="4"
      fontSize="sm"
      fontWeight="normal"
      lineHeight="21"
      _light={{ color: 'coolGray.800' }}
      _dark={{ color: 'coolGray.50' }}
    >
      {productDescription}
    </Text>
  );
}
function Review() {
  return (
    <VStack mt="5" space="8">
      {reviews.map((item, idx) => {
        return (
          <VStack key={idx} space="3">
            <HStack space="2">
              <Avatar height="10" width="10" source={item.imageUrl} />
              <VStack space="1">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  _dark={{ color: 'coolGray.50' }}
                  _light={{ color: 'coolGray.800' }}
                  lineHeight="21"
                >
                  {item.name}
                </Text>
                <HStack>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Icon
                      key={index}
                      as={MaterialIcons}
                      name="star"
                      size="4"
                      color="amber.400"
                    />
                  ))}
                </HStack>
              </VStack>
              <Text
                fontSize="sm"
                ml="auto"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
                lineHeight="21"
              >
                {item.time}
              </Text>
            </HStack>
            <Text
              alignItems="center"
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
              fontSize="sm"
              lineHeight="21"
            >
              {item.review}
            </Text>
          </VStack>
        );
      })}
    </VStack>
  );
}
function TabItem({
  tabName,
  currentTab,
  handleTabChange,
}: {
  tabName: string;
  currentTab: string;
  handleTabChange: (tabTitle: string) => void;
}) {
  return (
    <Pressable onPress={() => handleTabChange(tabName)}>
      <Text
        fontSize="sm"
        fontWeight="medium"
        letterSpacing="0.4"
        _light={{
          color: tabName === currentTab ? 'primary.900' : 'coolGray.500',
        }}
        _dark={{
          color: tabName === currentTab ? 'primary.500' : 'coolGray.400',
        }}
        px={4}
        py={2}
      >
        {tabName}
      </Text>
      {tabName === currentTab && (
        <Box
          borderTopLeftRadius="sm"
          borderTopRightRadius="sm"
          _light={{
            bg: 'primary.900',
          }}
          _dark={{
            bg: 'primary.500',
          }}
          h="1"
        />
      )}
    </Pressable>
  );
}
function Tabs() {
  const [tabName, setTabName] = React.useState('Description');
  const [tabChildren, setTabChildren] = useState<React.ReactNode>(
    <Description productDescription={product.description} />
  );
  return (
    <>
      <HStack space="5" borderRadius="sm">
        {tabs.map(({ id, title, component }) => (
          <TabItem
            key={id}
            tabName={title}
            currentTab={tabName}
            handleTabChange={(tab) => {
              setTabName(tab);
              setTabChildren(component);
            }}
          />
        ))}
      </HStack>
      {tabChildren}
    </>
  );
}

export default function () {
  return (
    <DashboardLayout
      title="Body Suit"
      displaySidebar={false}
      header={{ searchbar: false }}
    >
      <ScrollView bounces={false}>
        <Stack
          px={{ base: '4', md: '8' }}
          py={{ base: '5', md: '8' }}
          flex={1}
          rounded={{ md: 'sm' }}
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box
            p={2}
            _light={{ bg: 'primary.50' }}
            _dark={{ bg: 'coolGray.700' }}
            borderRadius="md"
            alignItems="center"
            w={{ base: '100%', md: '55%' }}
            h={{ base: '262', md: '652' }}
            justifyContent="center"
            mr={{ base: 0, md: 4 }}
          >
            <Image
              w={{ base: 'full', md: 'full' }}
              h={{ base: '246', md: 'full' }}
              rounded={{ base: 'none', md: 'lg' }}
              alt="Alternate Text"
              source={require('./images/tinybaby.png')}
            />
          </Box>
          <Hidden from="md">
            <VStack space="5">
              <ProductInfo productInfo={product} />
              <SizeChart options={sizeOptions} />
              <Tabs />
              <AddToCartButton />
            </VStack>
          </Hidden>
          <Hidden till="md">
            <VStack space="5" flex={1}>
              <ProductInfo productInfo={product} />
              <SizeChart options={sizeOptions} />
              <AddToCartButton />
              <Tabs />
            </VStack>
          </Hidden>
        </Stack>
      </ScrollView>
    </DashboardLayout>
  );
}
