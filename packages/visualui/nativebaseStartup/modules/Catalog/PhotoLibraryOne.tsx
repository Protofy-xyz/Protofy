import React from 'react';
import {
  Image,
  useBreakpointValue,
  FlatList,
  Box,
  Link,
  HStack,
} from 'native-base';
import {
  ImageSourcePropType,
  Platform,
  useWindowDimensions,
} from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';

type PhotoCardProp = {
  imageUri: ImageSourcePropType;
};

const photoLibrary: PhotoCardProp[] = [
  {
    imageUri: require('./images/photo-library-1.png'),
  },
  {
    imageUri: require('./images/photo-library-2.png'),
  },
  {
    imageUri: require('./images/photo-library-3.png'),
  },
  {
    imageUri: require('./images/photo-library-4.png'),
  },
  {
    imageUri: require('./images/photo-library-5.png'),
  },
  {
    imageUri: require('./images/photo-library-6.png'),
  },
  {
    imageUri: require('./images/photo-library-7.png'),
  },
  {
    imageUri: require('./images/photo-library-8.png'),
  },
  {
    imageUri: require('./images/photo-library-9.png'),
  },
  {
    imageUri: require('./images/photo-library-10.png'),
  },
  {
    imageUri: require('./images/photo-library-11.png'),
  },
  {
    imageUri: require('./images/photo-library-12.png'),
  },
  {
    imageUri: require('./images/photo-library-13.png'),
  },
  {
    imageUri: require('./images/photo-library-14.png'),
  },
  {
    imageUri: require('./images/photo-library-15.png'),
  },
  {
    imageUri: require('./images/photo-library-16.png'),
  },
  {
    imageUri: require('./images/photo-library-17.png'),
  },
  {
    imageUri: require('./images/photo-library-18.png'),
  },
  {
    imageUri: require('./images/photo-library-19.png'),
  },
  {
    imageUri: require('./images/photo-library-20.png'),
  },
];

function Card(props: PhotoCardProp) {
  return (
    <Link
      mb={{ base: '8', lg: '4' }}
      href=""
      width={{ base: '33%', md: '25%', lg: '20%' }}
      px="2"
    >
      <Image
        w="full"
        h={{ base: '165', md: '216' }}
        rounded="sm"
        source={props.imageUri}
        alt="Alternate Text"
      />
    </Link>
  );
}
function MainContent() {
  const noColumn = useBreakpointValue({
    base: 3,
    md: 5,
    lg: 5,
    xl: 5,
  });
  const { height } = useWindowDimensions();
  return (
    <Box
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      pt={{ base: '5', md: '8' }}
      pb={{ md: 4 }}
      px={{ base: '2', md: '6' }}
      rounded={{ md: 'sm' }}
    >
      {Platform.OS === 'web' ? (
        <HStack
          flexWrap="wrap"
          justifyContent="flex-start"
          height={{ base: height, md: '100%' }}
          overflowY="auto"
        >
          {photoLibrary.map((item) => (
            <Card {...item} />
          ))}
        </HStack>
      ) : (
        <FlatList
          numColumns={noColumn}
          data={photoLibrary}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <Card {...item} />}
          key={noColumn}
          keyExtractor={(item, index) => 'key' + index}
          bounces={false}
        />
      )}
    </Box>
  );
}
export default function () {
  return (
    <DashboardLayout
      displayScreenTitle={true}
      displaySidebar={false}
      title="All"
    >
      <MainContent />
    </DashboardLayout>
  );
}
