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
  Hidden,
} from 'native-base';
import type { ImageSourcePropType } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';

type SellerType = {
  title: string;
  collection: string;
  date: string;
  rating: number;
  numberOfRatings: number;
  OtherItems: string;
};

type ReviewsType = {
  imageUrl: ImageSourcePropType;
  name: string;
  time: string;
  review: string;
};

const seller: SellerType = {
  title: 'Cool Store',
  collection: '843 Products',
  date: '24th Sep 2018',
  rating: 4.9,
  numberOfRatings: 120,
  OtherItems:
    'Other Items : Yellow bodysuit, has a round neck with envelope detail along the shoulder, short sleeves and snap button closures along the crotch. Yellow bodysuit, has a round neck with envelope detail along the shoulder, short sleeves and snap button closures along the crotch.',
};

const tabs = [
  {
    id: 1,
    title: 'Reviews',
    component: <Reviews />,
  },
  {
    id: 2,
    title: 'Other items',
    component: <OtherItems sellerOtherItems={seller.OtherItems} />,
  },
];

const reviews: ReviewsType[] = [
  {
    imageUrl: require('./images/helena.png'),
    name: 'Helena Nava',
    time: '02 Jan 2021',
    review:
      'I loved the quality of their products. Highly recommended to everyone who is looking for comfortable bodysuits for their kids.',
  },
  {
    imageUrl: require('./images/Kory.png'),
    name: 'Kory John',
    time: '02 Jan 2021',
    review:
      'I loved the quality of their products. Highly recommended to everyone who is looking for comfortable bodysuits for their kids.',
  },
];

type Feedback = {
  reviewNumber: string | number;
  reviewText: string;
};
const feedback: Feedback[] = [
  {
    reviewNumber: '97%',
    reviewText: '  Positive Feedback',
  },
  {
    reviewNumber: ' 50k',
    reviewText: ' Customers',
  },
];
function BannerImage() {
  return (
    <Box
      p={2}
      _light={{ bg: 'primary.50' }}
      _dark={{ bg: 'coolGray.700' }}
      borderRadius="sm"
      alignItems="center"
      w={{ base: '100%', md: '50%', lg: '58%' }}
      h={{ base: '200', md: '668' }}
      justifyContent="center"
      mr={{ base: 0, md: 4 }}
    >
      <Image
        w={{ base: 'full', md: 'full' }}
        h={{ base: '184', md: 'full' }}
        rounded="sm"
        alt="Alternate Text"
        source={require('../../assets/clotheshanger.png')}
      />
    </Box>
  );
}
function SellerInfo({ sellerInfo }: { sellerInfo: SellerType }) {
  return (
    <Box>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        mt={{ base: 4, md: 0 }}
      >
        <Text
          fontSize="lg"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          fontWeight="medium"
        >
          {sellerInfo.title}
        </Text>
        <HStack alignItems="center" space="1">
          <Icon size="18" name={'star'} as={MaterialIcons} color="amber.400" />
          <Text
            fontSize="sm"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            {sellerInfo.rating}
          </Text>
          <Text
            fontSize="sm"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            ({sellerInfo.numberOfRatings})
          </Text>
        </HStack>
      </HStack>
      <Text
        fontSize="md"
        fontWeight="medium"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
      >
        {sellerInfo.collection}
      </Text>
      <Text
        fontSize="xs"
        mt="1"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
      >
        {sellerInfo.date}
      </Text>
    </Box>
  );
}
function Category() {
  return (
    <HStack
      mt={{ base: 7, md: 8 }}
      mb={{ base: 5, md: 8 }}
      space={{ base: 3, md: 4 }}
      alignItems="center"
    >
      {feedback.map((item, index) => {
        return (
          <Box
            _light={{ bg: 'primary.50' }}
            _dark={{ bg: 'coolGray.700' }}
            flex={1}
            alignItems="center"
            pt={4}
            pb={3}
            rounded="sm"
            key={index}
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'primary.500' }}
            >
              {item.reviewNumber}
            </Text>
            <Text
              fontSize={{ base: 'md', md: 'sm', lg: 'md' }}
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
            >
              {item.reviewText}
            </Text>
          </Box>
        );
      })}
    </HStack>
  );
}
function OtherItems({ sellerOtherItems }: { sellerOtherItems: string }) {
  return (
    <Text
      mt={{ base: 4, md: 6 }}
      fontSize="sm"
      _light={{ color: 'coolGray.800' }}
      _dark={{ color: 'coolGray.50' }}
    >
      {sellerOtherItems}
    </Text>
  );
}
function Reviews() {
  return (
    <VStack mt={{ base: 4, md: 6 }} space={{ base: 6, md: 8 }}>
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
                >
                  {item.name}
                </Text>
                <HStack>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Icon
                      key={index}
                      as={MaterialIcons}
                      name="star"
                      size="18"
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
              >
                {item.time}
              </Text>
            </HStack>
            <Text
              alignItems="center"
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
              fontSize="sm"
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
      <VStack>
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
      </VStack>
    </Pressable>
  );
}
function Tabs() {
  const [tabName, setTabName] = React.useState('Reviews');
  const [tabChildren, setTabChildren] = useState<React.ReactNode>(<Reviews />);
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
const AddToCartButton = () => {
  return (
    <Button mt={{ base: 5, md: 0 }} mb={{ md: 8 }} size="lg" variant="solid">
      CONTINUE
    </Button>
  );
};
function MainContent() {
  return (
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
        <BannerImage />
        <Hidden from="md">
          <Box>
            <SellerInfo sellerInfo={seller} />
            <Category />
            <Tabs />
            <AddToCartButton />
          </Box>
        </Hidden>
        <Hidden till="md">
          <Box flex={1}>
            <SellerInfo sellerInfo={seller} />
            <Category />
            <AddToCartButton />
            <Tabs />
          </Box>
        </Hidden>
      </Stack>
    </ScrollView>
  );
}
export default function () {
  return (
    <DashboardLayout
      title="Cool Store"
      displaySidebar={false}
      rightPanelMobileHeader
    >
      <MainContent />
    </DashboardLayout>
  );
}
