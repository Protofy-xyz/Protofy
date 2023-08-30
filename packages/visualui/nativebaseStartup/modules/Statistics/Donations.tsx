import React from 'react';
import {
  Box,
  Icon,
  Text,
  HStack,
  VStack,
  ScrollView,
  Pressable,
  Image,
  Progress,
  IconButton,
  Divider,
  Hidden,
  useBreakpointValue,
  FlatList,
  Circle,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';

type Content = {
  imageUri: ImageSourcePropType;
  itemName: string;
  itemCompany: string;
  discountedPrice: string;
  actualPrice: string;
  discountPercentage: number;
};

type MobileIcon = {
  iconName: string;
  iconText: string;
};
const trendingContentList: Content[] = [
  {
    imageUri: require('./images/trendingfundraise1.png'),
    itemName: 'Covid Warriors',
    itemCompany: 'BABY GROW',
    discountedPrice: '$5,53,000',
    actualPrice: '5,000',
    discountPercentage: 60,
  },
  {
    imageUri: require('./images/trendingfundraise2.png'),
    itemName: 'HELP',
    itemCompany: 'YK',
    discountedPrice: '$5,53,000',
    actualPrice: '5,000',
    discountPercentage: 60,
  },
  {
    imageUri: require('./images/trendingfundraise2.png'),
    itemName: 'HELP',
    itemCompany: 'YK',
    discountedPrice: '$5,53,000',
    actualPrice: '5,000',
    discountPercentage: 60,
  },
  {
    imageUri: require('./images/trendingfundraise2.png'),
    itemName: 'HELP',
    itemCompany: 'YK',
    discountedPrice: '$5,53,000',
    actualPrice: '5,000',
    discountPercentage: 60,
  },
];
const contentList: Content[] = [
  {
    imageUri: require('./images/fundraise1.png'),
    itemName: 'Covid Warriors',
    itemCompany: 'BABY GROW',
    discountedPrice: '$5,53,000',
    actualPrice: '5,000',
    discountPercentage: 60,
  },
  {
    imageUri: require('./images/fundraise2.png'),
    itemName: 'Fly NGO',
    itemCompany: 'YK',
    discountedPrice: '$5,53,000',
    actualPrice: '5,000',
    discountPercentage: 60,
  },
  {
    imageUri: require('./images/fundraise3.png'),
    itemName: 'Covid Warriors',
    itemCompany: 'Mother care',
    discountedPrice: '$5,53,000',
    actualPrice: '5,000',
    discountPercentage: 60,
  },
  {
    imageUri: require('./images/fundraise4.png'),
    itemName: 'Fly NGO',
    itemCompany: 'YK',
    discountedPrice: '$5,53,000',
    actualPrice: '5,000',
    discountPercentage: 60,
  },
  {
    imageUri: require('./images/fundraise5.png'),
    itemName: 'Fly NGO',
    itemCompany: 'YK',
    discountedPrice: '$5,53,000',
    actualPrice: '5,000',
    discountPercentage: 60,
  },
  {
    imageUri: require('./images/fundraise6.png'),
    itemName: 'Fly NGO',
    itemCompany: 'YK',
    discountedPrice: '$5,53,000',
    actualPrice: '5,000',
    discountPercentage: 60,
  },
];
const mobileIconsList: MobileIcon[] = [
  {
    iconName: 'menu-book',
    iconText: 'Education',
  },
  {
    iconName: 'lightbulb-outline',
    iconText: 'Creative',
  },
  {
    iconName: 'directions-transit',
    iconText: 'Railway',
  },
  {
    iconName: 'healing',
    iconText: 'Health',
  },
  {
    iconName: 'more-vert',
    iconText: 'More',
  },
];

function TrendingFundraisersCard(props: { item: Content }) {
  return (
    <Pressable
      borderRadius="lg"
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: 'coolGray.700' }}
    >
      <Box
        _light={{ bg: 'coolGray.100' }}
        _dark={{ bg: { base: 'coolGray.700', md: 'coolGray.700' } }}
        borderRadius="lg"
      >
        <Image
          w="224"
          h="167"
          borderTopRadius="lg"
          source={props.item.imageUri}
          alt="Alternate Text"
          resizeMode="cover"
        />
        <VStack p={3} space={2}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            {props.item.itemName}
          </Text>

          <Progress
            value={40}
            _light={{ bg: 'emerald.100' }}
            _dark={{ bg: 'coolGray.500' }}
            _filledTrack={{ bg: 'emerald.600' }}
          />

          <HStack alignItems="center" justifyContent="space-between">
            <Text
              fontSize="xs"
              fontWeight="medium"
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
            >
              Total Raised
            </Text>
            <Text
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
              fontSize="md"
              fontWeight="bold"
            >
              {props.item.discountedPrice}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
}

function CardFundraisers(props: { item: Content; key: number }) {
  return (
    <Pressable
      onPress={() => {
        console.log('go to the particular fundraiser');
      }}
      width={{ base: '33.33%', md: '25%', lg: '25%' }}
      px={2}
      pt={4}
    >
      <Image
        height={{ base: '118', md: '200' }}
        borderRadius="sm"
        source={props.item.imageUri}
        alt="Alternate Text"
        resizeMode="cover"
      />
    </Pressable>
  );
}

function CategoriesIcon(props: { item: MobileIcon }) {
  return (
    <VStack space={2} alignItems="center">
      <Circle
        _light={{ bg: 'primary.100' }}
        _dark={{ bg: 'coolGray.700' }}
        p={{ base: '0', md: '2' }}
      >
        <IconButton
          variant="unstyled"
          icon={
            <Icon
              as={MaterialIcons}
              name={props.item.iconName}
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'coolGray.50' }}
              size="6"
            />
          }
        />
      </Circle>
      <Text
        fontSize={{ base: 'xs', md: 'sm' }}
        fontWeight={{ md: 'medium' }}
        _light={{ color: { base: 'coolGray.800', md: 'coolGray.500' } }}
        _dark={{ color: { base: 'coolGray.50', md: 'coolGray.400' } }}
      >
        {props.item.iconText}
      </Text>
    </VStack>
  );
}

function MainContent() {
  return (
    <>
      {/* <Box px={{ md: 6 }}> */}
      <Text
        px={{ md: 2 }}
        fontSize="md"
        fontWeight="bold"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
      >
        Trending Fundraisers
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        mx="-4"
        bounces={false}
      >
        <HStack
          mx="4"
          px={{ md: 2 }}
          space={4}
          mt="3"
          alignItems="center"
          _light={{ bg: 'coolGray.50' }}
          _dark={{ bg: 'coolGray.800' }}
        >
          {trendingContentList.map((item, index) => {
            return <TrendingFundraisersCard key={index} item={item} />;
          })}
        </HStack>
      </ScrollView>
      <Hidden from="base" till="md">
        <Divider my="5" w="110%" mx="-6" />
      </Hidden>
      {/* </Box> */}

      {/* <Box px={{ md: 6 }}> */}
      <Text
        mt={{ base: 5, md: 0 }}
        px={{ md: 2 }}
        fontWeight="bold"
        fontSize="md"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
      >
        Categories
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        <HStack
          space={8}
          px={{ base: 0, md: 2 }}
          mt="4"
          alignItems="center"
          _light={{ bg: 'coolGray.50' }}
          _dark={{ bg: 'coolGray.800' }}
        >
          {mobileIconsList.map((item, index) => {
            return <CategoriesIcon key={index} item={item} />;
          })}
        </HStack>
      </ScrollView>
      <Hidden from="base" till="md">
        <Divider my="5" w="110%" mx="-6" />
      </Hidden>
      {/* </Box> */}
      <Text
        mt={{ base: 5, md: 0 }}
        px={{ md: 2 }}
        fontWeight="bold"
        fontSize="md"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Fundraisers
      </Text>
    </>
  );
}

export default function () {
  const noColumnFundraisers = useBreakpointValue({
    base: 3,

    md: 4,
  });
  return (
    <DashboardLayout displaySidebar={false} title={'Donation'}>
      <FlatList
        ListHeaderComponent={
          <Box
            px={{ base: '2', md: '0' }}
            rounded={{ md: 'sm' }}
            _light={{ bg: 'coolGray.50' }}
            _dark={{ bg: 'coolGray.800' }}
          >
            <MainContent />
          </Box>
        }
        py={{ base: '5', md: '8' }}
        px={{ base: 2, md: 6 }}
        mb={1}
        _light={{ bg: 'coolGray.50' }}
        _dark={{ bg: 'coolGray.800' }}
        bounces={false}
        numColumns={noColumnFundraisers}
        data={contentList}
        keyExtractor={(item, index) => 'key' + index}
        renderItem={({ item, index }: { item: Content; index: number }) => (
          <CardFundraisers item={item} key={index} />
        )}
        key={noColumnFundraisers}
        showsVerticalScrollIndicator={false}
      />
    </DashboardLayout>
  );
}
