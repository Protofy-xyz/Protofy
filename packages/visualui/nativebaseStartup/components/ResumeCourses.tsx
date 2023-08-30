import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  FlatList,
  Avatar,
  Image,
  Pressable,
  IconButton,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType, Platform } from 'react-native';

export type Course = {
  id: number;
  name?: string;
  chapter?: string;
  imageUri: ImageSourcePropType;
};

const ResumeCourses = ({ courses }: { courses: Course[] }) => {
  return (
    <VStack px={{ base: 4, md: 8 }} space={4}>
      <Text
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
        fontSize="md"
        fontWeight="bold"
      >
        Resume your course
      </Text>
      <FlatList
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
    </VStack>
  );
};

const Card = ({ course }: { course: Course }) => {
  return (
    <Box overflow="hidden" rounded="lg" width={{ base: '80', md: '334' }}>
      <Image height="112" source={course.imageUri} alt="Alternate Text" />
      <HStack
        _light={{ bg: 'coolGray.100' }}
        _dark={{ bg: 'coolGray.700' }}
        p="3"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <VStack>
          <Text
            fontSize="xs"
            _light={{ color: 'coolGray.900' }}
            _dark={{ color: 'coolGray.100' }}
            fontWeight="medium"
          >
            {course.chapter}
          </Text>
          <Text
            fontSize="sm"
            fontWeight="bold"
            _light={{ color: 'coolGray.900' }}
            _dark={{ color: 'coolGray.100' }}
          >
            {course.name}
          </Text>
          <HStack space="2" alignItems="center">
            <Text
              fontSize="xs"
              textAlign="center"
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.300' }}
            >
              Active Users
            </Text>
            <Avatar.Group space={-2} _avatar={{ size: 'xs' }}>
              <Avatar
                _light={{ borderColor: 'coolGray.100' }}
                _dark={{ borderColor: 'coolGray.700' }}
                source={require('../../../assets/women.jpg')}
              />
              <Avatar
                _light={{ borderColor: 'coolGray.100' }}
                _dark={{ borderColor: 'coolGray.700' }}
                source={require('../../../assets/nice-girl.jpg')}
              />
              <Avatar
                _light={{ borderColor: 'coolGray.100' }}
                _dark={{ borderColor: 'coolGray.700' }}
                source={require('../../../assets/smiling.jpg')}
              />
            </Avatar.Group>
          </HStack>
        </VStack>
        <IconButton
          _light={{
            bg: 'primary.900',
          }}
          _dark={{
            bg: 'primary.700',
          }}
          rounded="full"
          variant="unstyled"
          icon={
            <Icon
              as={MaterialIcons}
              name="play-arrow"
              color="coolGray.50"
              size={5}
            />
          }
        />
      </HStack>
    </Box>
  );
};

export default ResumeCourses;
