import React from 'react';
import {
  Box,
  Text,
  VStack,
  FlatList,
  Image,
  Pressable,
  HStack,
} from 'native-base';
import { ImageSourcePropType, Platform } from 'react-native';

export type Course = {
  id: number;
  name?: string;
  chapter?: string;
  imageUri: ImageSourcePropType;
};

const TrendingCourses = ({ courses }: { courses: Course[] }) => {
  return (
    <VStack pb={{ base: 16 }} px={{ base: 4, md: 8 }}>
      <Text
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
        fontSize="md"
        fontWeight="bold"
      >
        Trending Courses
      </Text>
      {/* {Platform.OS === 'web' ? (
        <HStack
          space="4"
          overflowX="auto"
          pb="1.5"
          _web={{
            style: {
              '::-webkit-scrollbar': {
                display: 'none',
              },
            },
          }}
        >
          {courses.map((item, index) => (
            <Pressable key={index}>
              <Card course={item} />
            </Pressable>
          ))}
        </HStack>
      ) : ( */}
      <FlatList
        mt={4}
        data={courses}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }: { item: Course }) => {
          return (
            <Pressable>
              <Card course={item} />
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <Box w="4" />}
      />
      {/* )} */}
    </VStack>
  );
};

const Card = ({ course }: { course: Course }) => {
  return (
    <Box h="40" overflow="hidden" rounded="lg" width="56">
      <Image flex="1" source={course.imageUri} alt="Alternate Text" />
      <Text
        px="3"
        py="3"
        fontSize="md"
        fontWeight="medium"
        _light={{ color: 'coolGray.800', bg: 'coolGray.100' }}
        _dark={{ color: 'coolGray.50', bg: 'coolGray.700' }}
      >
        {course.name}
      </Text>
    </Box>
  );
};

export default TrendingCourses;
