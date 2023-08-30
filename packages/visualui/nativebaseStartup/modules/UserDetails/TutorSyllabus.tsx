import React from 'react';
import {
  HStack,
  Icon,
  Text,
  VStack,
  Pressable,
  Hidden,
  Divider,
  ScrollView,
  Box,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';

const Stack = createStackNavigator();

type Icon = {
  iconName: string;
  iconText: string;
};
const footerIcons: Icon[] = [
  { iconName: 'home', iconText: 'Home' },
  { iconName: 'menu-book', iconText: 'Syllabus' },
  { iconName: 'speed', iconText: 'Test' },
  { iconName: 'subscriptions', iconText: 'Subscribe' },
];
type Course = {
  name: string;
  number: string;
  iconName: string;
};
const course: Course[] = [
  {
    name: 'PSIR Optional',
    number: '35 Courses',
    iconName: 'chevron-right',
  },
  {
    name: 'Public Administration Optional ',
    number: '35 Courses',
    iconName: 'chevron-right',
  },
  {
    name: 'Sociology Optional',
    number: '35 Courses',
    iconName: 'chevron-right',
  },
  {
    name: 'History Optional',
    number: '35 Courses',
    iconName: 'chevron-right',
  },
  {
    name: 'Geological Optional',
    number: '35 Courses',
    iconName: 'chevron-right',
  },
  {
    name: 'Political Optional',
    number: '35 Courses',
    iconName: 'chevron-right',
  },
  {
    name: 'PSIR Optional',
    number: '35 Courses',
    iconName: 'chevron-right',
  },

  {
    name: 'Political Optional',
    number: '35 Courses',
    iconName: 'chevron-right',
  },
  {
    name: 'PSIR Optional',
    number: '35 Courses',
    iconName: 'chevron-right',
  },
];

function BottomNavigationItem({
  iconName,
  iconText,
  index,
  navigation,
}: Icon & { index: number; navigation: any }) {
  const route = useRoute();
  return (
    <Pressable
      px="18"
      py="2.5"
      alignItems="center"
      onPress={() => navigation.navigate(iconText)}
      key={index}
    >
      <Icon
        as={MaterialIcons}
        name={iconName}
        size="5"
        _light={{
          color: route.name === iconText ? 'primary.900' : 'coolGray.400',
        }}
        _dark={{
          color: route.name === iconText ? 'primary.500' : 'coolGray.400',
        }}
      />
      <Text
        _light={{
          color: route.name === iconText ? 'primary.900' : 'coolGray.400',
        }}
        _dark={{
          color: route.name === iconText ? 'primary.500' : 'coolGray.400',
        }}
      >
        {iconText}
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
        minH="20"
        width="100%"
        position="absolute"
        left="0"
        right="0"
        bottom="0"
        overflow="hidden"
        alignSelf="center"
        borderTopLeftRadius="24"
        borderTopRightRadius="24"
        _light={{ backgroundColor: 'primary.50' }}
        _dark={{ backgroundColor: 'coolGray.700' }}
        px="3"
        py="2"
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

function SyllabusCard({ name, number, iconName }: Course) {
  return (
    <Pressable
      rounded={{ md: 'md' }}
      px="4"
      py="2"
      _light={{
        _hover: { bg: 'primary.100' },
        _pressed: { bg: 'primary.200' },
      }}
      _dark={{
        _hover: { bg: 'coolGray.700' },
        _pressed: { bg: 'coolGray.600' },
      }}
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
    >
      <Box>
        <Text
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          fontWeight="medium"
          fontSize="md"
        >
          {name}
        </Text>
        <Text
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          fontWeight="medium"
          fontSize="xs"
        >
          {number}
        </Text>
      </Box>
      <Icon as={MaterialIcons} size={6} name={iconName} color="coolGray.400" />
    </Pressable>
  );
}

function SyllabusList() {
  return (
    <Box mt={{ base: 3, md: 4 }} pb={{ base: 16, md: 0 }}>
      {course.map((item, index) => {
        return <SyllabusCard key={index} {...item} />;
      })}
    </Box>
  );
}

function CourseType() {
  return (
    <VStack space={0.5} px="4" mb={{ base: 5, md: 6 }}>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
        fontWeight="normal"
        letterSpacing={0.2}
      >
        Subscribe and access
      </Text>
      <Text
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="normal"
        letterSpacing={0.2}
      >
        Complete UPSC CSE - Optional
      </Text>
      <Text
        fontSize={{ base: 'md', md: 'lg' }}
        letterSpacing={0.2}
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Syllabus with{''} Structured Course
      </Text>
    </VStack>
  );
}

function TutorSyllabus({ navigation }: { navigation: any }) {
  return (
    <DashboardLayout
      displaySidebar={false}
      title=" Syllabus"
      rightPanelMobileHeader={true}
    >
      <Box
        py={{ base: 5, md: 8 }}
        px={{ md: 4 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        flex={1}
      >
        <ScrollView bounces={false}>
          <CourseType />
          <Divider />
          <SyllabusList />
        </ScrollView>
      </Box>
      <MobileFooter navigation={navigation} />
    </DashboardLayout>
  );
}

export default function MyTabs() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={TutorSyllabus} />
        <Stack.Screen name="Syllabus" component={TutorSyllabus} />
        <Stack.Screen name="Test" component={TutorSyllabus} />
        <Stack.Screen name="Subscribe" component={TutorSyllabus} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
