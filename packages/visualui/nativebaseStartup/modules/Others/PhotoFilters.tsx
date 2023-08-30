import React from 'react';
import {
  Text,
  VStack,
  Image,
  useBreakpointValue,
  FlatList,
  useColorModeValue,
  Pressable,
  Box,
  Button,
  HStack,
  Stack,
  Icon,
  ScrollView,
  Hidden,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';

type List = {
  itemName: string;
  colors: string[];
};
type CardProps = {
  item: List;
  shadeIndex: number;
  currentIndex: number;
  handleChangeShade: (a: number) => void;
};

const list: List[] = [
  {
    itemName: 'Original',
    colors: ['lightBlue.300', 'violet.800'],
  },
  {
    itemName: 'Pinkfresh',
    colors: ['rose.300', 'rose.800'],
  },
  {
    itemName: 'Warm',
    colors: ['#FFE790', '#D5B5B5'],
  },
  {
    itemName: 'Cool',
    colors: ['emerald.300', 'emerald.800'],
  },
  {
    itemName: 'Film',
    colors: ['yellow.300', 'yellow.800'],
  },
  {
    itemName: 'Modern',
    colors: ['#D0A000', '#C4C4C4'],
  },
  {
    itemName: 'Vintage',
    colors: ['rose.300', 'rose.800'],
  },
  {
    itemName: 'Mist',
    colors: ['#4338CA', '#D5B5B5'],
  },

  {
    itemName: 'Fade',
    colors: ['yellow.300', 'yellow.800'],
  },
];

function Card(props: CardProps) {
  const primaryText = useColorModeValue('coolGray.800', 'coolGray.50');
  const secondoryText = useColorModeValue('coolGray.500', 'coolGray.400');
  return (
    <Pressable
      onPress={() => {
        props.handleChangeShade(props.currentIndex);
      }}
      m={{ base: 0, md: 2 }}
    >
      <VStack alignItems="center" space={2}>
        <Box
          w={{ base: 16, md: 20 }}
          h={{ base: 16, md: 24 }}
          position="relative"
        >
          <Box
            w={{ base: 16, md: 20 }}
            h={{ base: 16, md: 24 }}
            bg={{
              linearGradient: {
                colors: props.item.colors,
                start: [0, 0],
                end: [1, 0],
              },
            }}
            opacity="0.2"
            rounded="md"
            _text={{
              fontSize: 'md',
              fontWeight: 'bold',
              color: 'white',
            }}
            borderWidth={props.shadeIndex === props.currentIndex ? '1' : '0'}
            borderColor="black"
          />
          <Image
            rounded="md"
            position="absolute"
            zIndex={-1}
            w={{ base: 16, md: 20 }}
            h={{ base: 16, md: 24 }}
            source={require('./images/photofilter.png')}
            alt="Alternate Text"
            resizeMode="cover"
          />
        </Box>

        <Text
          fontSize="sm"
          fontWeight="normal"
          lineHeight="18"
          color={
            props.shadeIndex === props.currentIndex
              ? primaryText
              : secondoryText
          }
        >
          {props.item.itemName}
        </Text>
      </VStack>
    </Pressable>
  );
}

function Compare() {
  return (
    <HStack
      alignItems="center"
      space={3}
      justifyContent={{ base: 'flex-end', md: 'flex-start' }}
      mt={4}
      mb={{ md: 10 }}
    >
      <Pressable>
        <Icon
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          size="6"
          as={MaterialIcons}
          name="flip"
        />
      </Pressable>
      <Text
        fontSize="sm"
        fontWeight="medium"
        lineHeight="21"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
      >
        Compare
      </Text>
    </HStack>
  );
}

function MobileContent({
  shadeIndex,
  handleChangeShade,
}: {
  shadeIndex: number;
  handleChangeShade: (a: number) => void;
}) {
  return (
    <>
      <Compare />
      <VStack w="100%" position="absolute" bottom="0">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          mx="-8"
          bounces={false}
        >
          <HStack
            mx="8"
            space={3}
            mt={
              list[shadeIndex].itemName !== 'Original'
                ? { md: 2, base: 3 }
                : { md: 0, base: 9 }
            }
            alignItems="center"
          >
            {list.map((item, index) => {
              return (
                <Box key={index}>
                  <Card
                    item={item}
                    key={index}
                    shadeIndex={shadeIndex}
                    currentIndex={index}
                    handleChangeShade={handleChangeShade}
                  />
                </Box>
              );
            })}
          </HStack>
        </ScrollView>

        <HStack
          mt={{ base: 8, md: 20 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Icon
            size="8"
            as={MaterialIcons}
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            name={'check'}
          />
          <Icon
            size="8"
            as={MaterialIcons}
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            name={'close'}
          />
        </HStack>
      </VStack>
    </>
  );
}

function WebContent({
  shadeIndex,
  handleChangeShade,
}: {
  shadeIndex: number;
  handleChangeShade: (a: number) => void;
}) {
  const noColumn = useBreakpointValue({
    base: 2,
    md: 3,
    lg: 4,
    xl: 4,
  });

  return (
    <Box flex={1}>
      <Box mb={2} mt="-2">
        <FlatList
          numColumns={noColumn}
          data={list}
          ml="-2"
          renderItem={({ item, index }) => (
            <Card
              item={item}
              key={index}
              currentIndex={index}
              shadeIndex={shadeIndex}
              handleChangeShade={handleChangeShade}
            />
          )}
          key={noColumn}
        />
      </Box>
      <Compare />
      <HStack
        mt="auto"
        alignItems="center"
        justifyContent="space-between"
        space="2"
      >
        <Button flex={0.5} size="lg">
          Apply
        </Button>
        <Button variant="outline" size="lg" flex={0.5}>
          Cancel
        </Button>
      </HStack>
    </Box>
  );
}

function MainContent() {
  const [shadeIndex, setShadeIndex] = React.useState(0);
  const handleChangeShade = (index: number) => {
    setShadeIndex(index);
  };

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      p={{ base: 4, md: 8 }}
      rounded={{ md: 'sm' }}
      _light={{
        bg: 'white',
      }}
      _dark={{
        bg: { base: 'coolGray.800', md: 'coolGray.900' },
      }}
      flex={1}
      space={{ base: 0, md: 6 }}
    >
      <Box flex={{ md: '1' }}>
        <Image
          borderRadius="sm"
          w="full"
          height={{ base: 400, md: '100%' }}
          maxH={{ base: '400', md: '556' }}
          source={require('./images/photofilter.png')}
          alt="Alternate Text"
        />
      </Box>
      <VStack pb={{ base: 10, md: 0 }} flex={{ base: '1', md: 'undefined' }}>
        <Hidden from="md">
          <MobileContent
            shadeIndex={shadeIndex}
            handleChangeShade={handleChangeShade}
          />
        </Hidden>
        <Hidden till="md">
          <WebContent
            shadeIndex={shadeIndex}
            handleChangeShade={handleChangeShade}
          />
        </Hidden>
      </VStack>
    </Stack>
  );
}
export default function PhotoFilters() {
  return (
    <DashboardLayout displaySidebar={false} title="Photo Filters">
      <MainContent />
    </DashboardLayout>
  );
}
