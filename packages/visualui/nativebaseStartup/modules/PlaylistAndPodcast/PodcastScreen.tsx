import React from 'react';
import {
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  IconButton,
  Pressable,
  ScrollView,
  Divider,
  Hidden,
  Badge,
  Box,
  FlatList,
  IIconProps,
} from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const StackNavigator = createStackNavigator();

type Album = {
  imageUri: ImageSourcePropType;
};

const album: Album[] = [
  {
    imageUri: require('./images/featured1.png'),
  },
  {
    imageUri: require('./images/featured2.png'),
  },
  {
    imageUri: require('./images/featured3.png'),
  },
  {
    imageUri: require('./images/featured2.png'),
  },
];

type Category = {
  name: string;
  iconName: string;
  iconLibrary: IIconProps;
};

const categoriesIconsList: Category[] = [
  {
    name: 'Meditation',
    iconName: 'meditation',
    iconLibrary: MaterialCommunityIcons,
  },
  {
    name: 'Virus',
    iconName: 'coronavirus',
    iconLibrary: MaterialIcons,
  },
  {
    name: 'Innovations',
    iconName: 'lightbulb-outline',
    iconLibrary: MaterialIcons,
  },
  {
    name: 'Comedy',
    iconName: 'theater-comedy',
    iconLibrary: MaterialIcons,
  },
  {
    name: 'Health',
    iconName: 'medical-services',
    iconLibrary: MaterialIcons,
  },
  {
    name: 'Fitness',
    iconName: 'fitness-center',
    iconLibrary: MaterialIcons,
  },
  {
    name: 'Sports',
    iconName: 'sports-volleyball',
    iconLibrary: MaterialIcons,
  },
  {
    name: 'More',
    iconName: 'more-vert',
    iconLibrary: MaterialIcons,
  },
];

type CarousalTye = {
  imageUri: ImageSourcePropType;
  name: string;
};

const trending: CarousalTye[] = [
  {
    imageUri: require('./images/trending1.png'),
    name: 'Story Seeds',
  },
  {
    imageUri: require('./images/trending2.png'),
    name: 'Dare to lead',
  },
  {
    imageUri: require('./images/trending3.png'),
    name: 'Artificial Intelligence',
  },
  {
    imageUri: require('./images/trending4.png'),
    name: 'Angular',
  },
  {
    imageUri: require('./images/trending5.png'),
    name: 'AR/VR',
  },
];

const speakers: CarousalTye[] = [
  {
    imageUri: require('./images/speaker1.png'),
    name: 'John ',
  },
  {
    imageUri: require('./images/speaker2.png'),
    name: 'Tim Luca',
  },
  {
    imageUri: require('./images/speaker3.png'),
    name: 'Frank Underwood',
  },
  {
    imageUri: require('./images/speaker4.png'),
    name: 'Thomus ',
  },
  {
    imageUri: require('./images/speaker5.png'),
    name: 'Titus Kitamura ',
  },
];

type Icon = {
  name: string;
  text: string;
};

const footerIcons: Icon[] = [
  { name: 'home', text: 'Home' },
  { name: 'wifi-tethering', text: 'Podcast' },
  { name: 'search', text: 'Search' },
  { name: 'queue-music', text: 'MyLibrary' },
];
function FeaturedShows() {
  const Separator = () => <Box flex="1" w="4" />;
  return (
    <VStack space={2}>
      <Box px={{ base: 4, md: 8 }}>
        <Badge
          variant="solid"
          _dark={{ bg: 'primary.500' }}
          _light={{ bg: 'primary.900' }}
          alignSelf="flex-start"
          _text={{
            color: 'coolGray.100',
            fontWeight: 'bold',
            fontSize: '2xs',
          }}
        >
          FEATURED SHOWS
        </Badge>
        <Text
          fontWeight="bold"
          mt={1}
          _dark={{ color: 'coolGray.50' }}
          _light={{ color: 'coolGray.800' }}
          fontSize="sm"
        >
          How to Become Better leader
        </Text>
      </Box>
      <FlatList
        px={{ base: 4, md: 8 }}
        data={album}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        keyExtractor={(_, index) => `${index}`}
        ItemSeparatorComponent={Separator}
        mr={{ base: 4, md: 0 }}
        renderItem={({ item }) => (
          <Pressable borderRadius={4}>
            <Image
              width={327}
              height={145}
              rounded="sm"
              alt="Banner Image"
              source={item.imageUri}
            />
          </Pressable>
        )}
      />
    </VStack>
  );
}

function Categories() {
  return (
    <VStack mt={5} space={4}>
      <Text
        fontWeight="bold"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
        fontSize="md"
        px={{ base: 4, md: 8 }}
      >
        Categories
      </Text>
      <FlatList
        px={{ base: 4, md: 8 }}
        data={categoriesIconsList}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `category-${index}`}
        renderItem={({ item }) => (
          <VStack mr={8} space={2} alignItems="center" justifyContent="center">
            <IconButton
              rounded="full"
              p={2}
              justifyContent="center"
              alignItems="center"
              _dark={{ bg: 'coolGray.700' }}
              _light={{ bg: 'primary.100' }}
              _icon={{
                size: 6,
                _dark: { color: 'primary.500' },
                _light: { color: 'primary.900' },
              }}
              icon={<Icon name={item.iconName} as={item.iconLibrary} />}
            />
            <Text
              _dark={{ color: 'coolGray.50' }}
              _light={{ color: 'coolGray.800' }}
              fontWeight="normal"
              fontSize="xs"
            >
              {item.name}
            </Text>
          </VStack>
        )}
      />
    </VStack>
  );
}

function Carousal({
  itemList,
  heading,
}: {
  itemList: CarousalTye[];
  heading: string;
}) {
  const Separator = () => <Box w="4" flex="1" />;
  return (
    <VStack space={4} mt={5}>
      <HStack justifyContent="space-between" px={{ base: 4, md: 8 }}>
        <Text
          fontSize="md"
          fontWeight="bold"
          _dark={{ color: 'coolGray.50' }}
          _light={{ color: 'coolGray.800' }}
        >
          {heading}
        </Text>
        <Pressable>
          <Text
            _dark={{ color: 'primary.500' }}
            _light={{ color: 'primary.900' }}
            fontSize="sm"
            fontWeight="medium"
          >
            See All
          </Text>
        </Pressable>
      </HStack>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        px={{ base: 4, md: 8 }}
        mr={{ base: 4, md: 0 }}
        data={itemList}
        keyExtractor={(_, index) => `trending-${index}`}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <Pressable borderRadius="sm">
            <Image
              borderTopRadius="sm"
              source={item.imageUri}
              alt={item.name}
              w={{ base: 192, md: 224 }}
              h={112}
            />
            <Box
              borderRadius="sm"
              p={3}
              _light={{ bg: 'coolGray.100' }}
              _dark={{ bg: 'coolGray.700' }}
            >
              <Text
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
                fontSize="md"
                fontWeight="medium"
              >
                {item.name}
              </Text>
            </Box>
          </Pressable>
        )}
      />
    </VStack>
  );
}

function BottomNavigationItem({
  name,
  text,
  index,
  navigation,
}: Icon & { index: number; navigation: any }) {
  const route = useRoute();

  return (
    <Pressable
      px="18"
      py="2.5"
      alignItems="center"
      onPress={() => navigation.navigate(text)}
      key={index}
    >
      <Icon
        as={MaterialIcons}
        name={name}
        size="5"
        _light={{
          color: route.name === text ? 'primary.900' : 'coolGray.400',
        }}
        _dark={{
          color: route.name === text ? 'primary.500' : 'coolGray.400',
        }}
      />
      <Text
        _light={{
          color: route.name === text ? 'primary.900' : 'coolGray.400',
        }}
        _dark={{
          color: route.name === text ? 'primary.500' : 'coolGray.400',
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}

function MobileFooter({ navigation }: { navigation: any }) {
  return (
    <Hidden from="md">
      <HStack
        justifyContent="space-between"
        safeAreaBottom
        h="20"
        width="100%"
        position="absolute"
        left="0"
        right="0"
        bottom="0"
        overflow="hidden"
        alignSelf="center"
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: 'coolGray.800' }}
      >
        {footerIcons.map((item, index) => {
          return (
            <BottomNavigationItem
              key={index}
              index={index}
              navigation={navigation}
              {...item}
            />
          );
        })}
      </HStack>
    </Hidden>
  );
}

function PodcastScreen({ navigation }: { navigation: any }) {
  return (
    <DashboardLayout
      title={'Podcasts'}
      displayScreenTitle={true}
      displayMenuButton
    >
      <ScrollView bounces={false}>
        <Box
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
          borderRadius={{ md: 'sm' }}
          mb={{ base: 16, md: 0 }}
          pt={{ base: 5, md: 8 }}
          pb={8}
        >
          <FeaturedShows />
          <Hidden till="md">
            <Divider mt="5" />
          </Hidden>
          <Categories />
          <Hidden till="md">
            <Divider mt={5} />
          </Hidden>
          <Carousal itemList={trending} heading={'Trending Courses'} />
          <Hidden till="md">
            <Divider mt={5} />
          </Hidden>
          <Carousal itemList={speakers} heading={'Speakers'} />
        </Box>
      </ScrollView>
      <MobileFooter navigation={navigation} />
    </DashboardLayout>
  );
}

export default function () {
  return (
    <NavigationContainer>
      <StackNavigator.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <StackNavigator.Screen name="Home" component={PodcastScreen} />
        <StackNavigator.Screen name="Podcast" component={PodcastScreen} />
        <StackNavigator.Screen name="Search" component={PodcastScreen} />
        <StackNavigator.Screen name="MyLibrary" component={PodcastScreen} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
