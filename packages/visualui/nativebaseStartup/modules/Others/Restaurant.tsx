import React, { useEffect } from 'react';
import {
  Text,
  VStack,
  Button,
  HStack,
  Image,
  Box,
  Icon,
  Switch,
  Divider,
  Hidden,
  ScrollView,
  Pressable,
  useBreakpointValue,
} from 'native-base';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';

type DishList = {
  dishtype: string;
  dishName: string;
  dishCategory: string;
  dishAmount: string;
  buttonText: string;
  imageUri: ImageSourcePropType;
};

type TabDishList = {
  Menu: DishList[];
  About: DishList[];
  Reviews: DishList[];
  Photos: DishList[];
};

const dishlist: TabDishList = {
  Menu: [
    {
      dishtype: 'veg',
      dishName: 'Double Aloo Tikki Burger',
      dishCategory: 'In starters',
      dishAmount: '₹500',
      buttonText: 'ADD',
      imageUri: require('./images/dishes1.png'),
    },
    {
      dishtype: 'veg',
      dishName: 'Cheese Croissant',
      dishCategory: 'In starters',
      dishAmount: '₹100',
      buttonText: 'ADD',
      imageUri: require('./images/dishes2.png'),
    },
    {
      dishtype: 'veg',
      dishName: 'Corn & Pepper Lasagne',
      dishCategory: 'In starters',
      dishAmount: '₹260',
      buttonText: 'ADD',
      imageUri: require('./images/dishes3.png'),
    },
  ],
  About: [
    {
      dishtype: 'veg',
      dishName: 'Cheese Croissant',
      dishCategory: 'In starters',
      dishAmount: '₹100',
      buttonText: 'ADD',
      imageUri: require('./images/dishes2.png'),
    },
    {
      dishtype: 'veg',
      dishName: 'Corn & Pepper Lasagne',
      dishCategory: 'In starters',
      dishAmount: '₹260',
      buttonText: 'ADD',
      imageUri: require('./images/dishes3.png'),
    },
    {
      dishtype: 'veg',
      dishName: 'Double Aloo Tikki Burger',
      dishCategory: 'In starters',
      dishAmount: '₹500',
      buttonText: 'ADD',
      imageUri: require('./images/dishes1.png'),
    },
  ],
  Reviews: [
    {
      dishtype: 'veg',
      dishName: 'Double Aloo Tikki Burger',
      dishCategory: 'In starters',
      dishAmount: '₹500',
      buttonText: 'ADD',
      imageUri: require('./images/dishes1.png'),
    },
    {
      dishtype: 'veg',
      dishName: 'Cheese Croissant',
      dishCategory: 'In starters',
      dishAmount: '₹100',
      buttonText: 'ADD',
      imageUri: require('./images/dishes2.png'),
    },
    {
      dishtype: 'veg',
      dishName: 'Corn & Pepper Lasagne',
      dishCategory: 'In starters',
      dishAmount: '₹260',
      buttonText: 'ADD',
      imageUri: require('./images/dishes3.png'),
    },
  ],
  Photos: [
    {
      dishtype: 'veg',
      dishName: 'Cheese Croissant',
      dishCategory: 'In starters',
      dishAmount: '₹100',
      buttonText: 'ADD',
      imageUri: require('./images/dishes2.png'),
    },
    {
      dishtype: 'veg',
      dishName: 'Corn & Pepper Lasagne',
      dishCategory: 'In starters',
      dishAmount: '₹260',
      buttonText: 'ADD',
      imageUri: require('./images/dishes3.png'),
    },
    {
      dishtype: 'veg',
      dishName: 'Double Aloo Tikki Burger',
      dishCategory: 'In starters',
      dishAmount: '₹500',
      buttonText: 'ADD',
      imageUri: require('./images/dishes1.png'),
    },
  ],
};

const tabs = [
  {
    id: 1,
    title: 'Menu',
  },
  {
    id: 2,
    title: 'About',
  },
  {
    id: 3,
    title: 'Reviews',
  },
  {
    id: 4,
    title: 'Photos',
  },
];

function HotelName() {
  return (
    <HStack space={2} mt={{ md: 8 }} mb={6} alignItems="center">
      <Image
        rounded="sm"
        w={20}
        h={20}
        resizeMode="cover"
        source={require('./images/taj.png')}
        alt="Alternate Text "
      />

      <VStack space={2}>
        <Text
          fontWeight="bold"
          fontSize="md"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Taj Hotel
        </Text>
        <HStack space={1} alignItems="center">
          <Icon as={MaterialIcons} name="star" size="4" color="amber.400" />
          <Text
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            fontSize="sm"
            fontWeight="normal"
          >
            4.9
          </Text>
          <Text
            fontSize="sm"
            fontWeight="normal"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            (120)
          </Text>
        </HStack>
        <Text
          fontSize="sm"
          _light={{ color: 'primary.900' }}
          _dark={{ color: 'primary.500' }}
        >
          15 min{' '}
          <Text
            fontSize="sm"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            (1.3 kms)
          </Text>
        </Text>
      </VStack>

      <Box alignSelf="flex-end" ml="auto">
        <Button variant="solid" size="sm">
          DIRECTIONS
        </Button>
      </Box>
    </HStack>
  );
}

function OptionSelector() {
  return (
    <HStack
      alignItems="center"
      space={3}
      justifyContent={{ base: 'flex-end', md: 'flex-start' }}
    >
      <HStack alignItems="center">
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{ color: 'coolGray.900' }}
          _dark={{ color: 'coolGray.300' }}
        >
          Veg
        </Text>
        <Switch
          size="sm"
          _light={{
            onThumbColor: 'white',
            offThumbColor: 'white',
            offTrackColor: 'coolGray.200',
            onTrackColor: 'primary.900',
          }}
          _dark={{
            onThumbColor: 'white',
            offThumbColor: 'white',
            offTrackColor: 'coolGray.700',
            onTrackColor: 'primary.700',
          }}
        />
      </HStack>
      <HStack alignItems="center">
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{ color: 'coolGray.900' }}
          _dark={{ color: 'coolGray.300' }}
        >
          Non-Veg
        </Text>
        <Switch
          size="sm"
          _light={{
            onThumbColor: 'white',
            offThumbColor: 'white',
            offTrackColor: 'coolGray.200',
            onTrackColor: 'primary.900',
          }}
          _dark={{
            onThumbColor: 'white',
            offThumbColor: 'white',
            offTrackColor: 'coolGray.700',
            onTrackColor: 'primary.700',
          }}
        />
      </HStack>
    </HStack>
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

function Dishlist({ currentTab }: { currentTab: DishList[] }) {
  const reverseSequence = useBreakpointValue({ base: true, md: false });
  return (
    <Box w="100%">
      <Box mt={5}>
        <OptionSelector />
      </Box>
      {currentTab.map(
        (
          item: {
            dishName: string;
            dishAmount: string;
            imageUri: ImageSourcePropType;
            buttonText: string;
          },
          index: React.Key | null | undefined
        ) => {
          return (
            <Box key={index} mt={2} pt={6}>
              <HStack
                space={6}
                key={index}
                reversed={reverseSequence}
                justifyContent={{ base: 'space-between', md: 'flex-start' }}
              >
                <VStack space={3}>
                  <Pressable>
                    <Image
                      rounded="sm"
                      width="128"
                      height="114"
                      resizeMode="cover"
                      source={item.imageUri}
                      alt={'Alternate Text '}
                      key={item.dishName}
                    />
                  </Pressable>
                  <Button variant="outline" size="sm">
                    {item.buttonText}
                  </Button>
                </VStack>
                <Box mt={1}>
                  <Image
                    source={require('./images/Veg.png')}
                    height={6}
                    width={6}
                  />
                  <Pressable>
                    <Text
                      mt={3}
                      _light={{ color: 'coolGray.800' }}
                      _dark={{ color: 'coolGray.50' }}
                      fontSize="md"
                      fontWeight="medium"
                    >
                      {item.dishName}
                    </Text>
                  </Pressable>

                  <Text
                    _light={{ color: 'coolGray.800' }}
                    _dark={{ color: 'coolGray.50' }}
                    fontSize="md"
                    fontWeight="medium"
                  >
                    {item.dishAmount}
                  </Text>
                  <HStack space={1} alignItems="center" mt={1}>
                    <Icon
                      as={MaterialIcons}
                      name="star"
                      size={4}
                      color="amber.400"
                    />
                    <Text
                      _light={{ color: 'coolGray.800' }}
                      _dark={{ color: 'coolGray.50' }}
                      fontSize="sm"
                      fontWeight="normal"
                    >
                      4.9
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="normal"
                      _light={{ color: 'coolGray.500' }}
                      _dark={{ color: 'coolGray.400' }}
                    >
                      (120)
                    </Text>
                  </HStack>
                </Box>
              </HStack>
              {index === currentTab.length - 1 ? null : <Divider mt={6} />}
            </Box>
          );
        }
      )}
    </Box>
  );
}

function Details() {
  const [tabName, setTabName] = React.useState('About');
  const [videos, setVideos] = React.useState<DishList[]>(dishlist.About);

  useEffect(() => {
    switch (tabName) {
      case 'About':
        setVideos(dishlist.About);
        return;
      case 'Menu':
        setVideos(dishlist.Menu);
        return;
      case 'Photos':
        setVideos(dishlist.Photos);
        return;
      case 'Reviews':
        setVideos(dishlist.Reviews);
        return;
    }
  }, [tabName]);
  return (
    <Box>
      <HStack w="100%" justifyContent="flex-start" borderRadius="sm">
        {tabs.map(({ id, title }) => (
          <TabItem
            key={id}
            tabName={title}
            currentTab={tabName}
            handleTabChange={(tab) => setTabName(tab)}
          />
        ))}
      </HStack>
      <Dishlist currentTab={videos} />
    </Box>
  );
}

function MainContent() {
  return (
    <ScrollView bounces={false}>
      <Box
        px={{ base: 4, md: 8 }}
        py={{ base: 5, md: 8 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        flex={1}
      >
        <Hidden till="md">
          <HStack alignItems="center" space={4} flex={1}>
            <Image
              height={320}
              width={{ md: '64%', lg: 657 }}
              rounded="sm"
              source={require('./images/restaurantbanner1.png')}
              alt="Cover Image 1"
            />
            <VStack alignItems="center" space={3.5} flex={1}>
              <Image
                height={{ md: 156, lg: 153 }}
                width={{ md: '100%', lg: 308 }}
                rounded="sm"
                source={require('./images/restaurantbanner2.png')}
                alt="Cover Image 2"
              />
              <Image
                height={{ md: 156, lg: 153 }}
                width={{ md: '100%', lg: 308 }}
                rounded="sm"
                source={require('./images/restaurantbanner3.png')}
                alt="Cover Image 3"
              />
            </VStack>
          </HStack>
        </Hidden>
        <HotelName />
        <Details />
      </Box>
    </ScrollView>
  );
}

export default function Restaurants() {
  return (
    <DashboardLayout
      displaySidebar={false}
      title="Restaurant"
      rightPanelMobileHeader={true}
    >
      <MainContent />
    </DashboardLayout>
  );
}
