import React, { useState } from 'react';
import {
  Text,
  VStack,
  Button,
  Box,
  HStack,
  ScrollView,
  Pressable,
  Image,
  useColorMode,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

type SeatSectionType = {
  seatSection: string;
  sectionSeats: Array<boolean>;
};

type SeatType = {
  title: string;
  seatSection: SeatSectionType[];
};

const SeatAllocation: SeatType[] = [
  {
    title: 'SILVER RS 250',
    seatSection: [
      {
        seatSection: 'A',
        sectionSeats: new Array(12),
      },
      {
        seatSection: 'B',
        sectionSeats: new Array(12),
      },
      {
        seatSection: 'C',
        sectionSeats: new Array(12),
      },
    ],
  },
  {
    title: 'GOLD RS 250',
    seatSection: [
      {
        seatSection: 'D',
        sectionSeats: new Array(12),
      },
      {
        seatSection: 'E',
        sectionSeats: new Array(12),
      },
      {
        seatSection: 'F',
        sectionSeats: new Array(12),
      },
      {
        seatSection: 'G',
        sectionSeats: new Array(12),
      },
      {
        seatSection: 'H',
        sectionSeats: new Array(12),
      },
      {
        seatSection: 'I',
        sectionSeats: new Array(12),
      },
    ],
  },
  {
    title: 'PLATINUM RS 250',
    seatSection: [
      {
        seatSection: 'J',
        sectionSeats: new Array(12),
      },
      {
        seatSection: 'K',
        sectionSeats: new Array(12),
      },
      {
        seatSection: 'L',
        sectionSeats: new Array(12),
      },
    ],
  },
];

function fillSeatsArray() {
  SeatAllocation.forEach((seat) => {
    seat.seatSection.forEach((row) => {
      row.sectionSeats.fill(false, 0, 12);
      if (row.seatSection === 'I') {
        row.sectionSeats.fill(true, 2, 7);
        row.sectionSeats[8] = true;
      }
    });
  });
}

function SeatComponent({
  isAvailable,
  seatNumber,
}: {
  isAvailable?: boolean;
  seatNumber: number;
}) {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <Pressable
      h="6"
      w="6"
      rounded="sm"
      disabled={!isAvailable}
      borderWidth={isAvailable && !isSelected ? '1' : '0'}
      _light={{
        borderColor: 'coolGray.500',
        bg: !isAvailable
          ? 'coolGray.200'
          : isSelected
          ? 'green.600'
          : 'transparent',
      }}
      _dark={{
        borderColor: 'coolGray.400',
        bg: !isAvailable
          ? 'coolGray.700'
          : isSelected
          ? 'green.400'
          : 'transparent',
      }}
      alignItems="center"
      onPress={() => setIsSelected(!isSelected)}
    >
      <Text
        _light={{
          color: isSelected && isAvailable ? 'coolGray.50' : 'coolGray.500',
        }}
        _dark={{
          color: isSelected && isAvailable ? 'coolGray.800' : 'coolGray.400',
        }}
      >
        {seatNumber}
      </Text>
    </Pressable>
  );
}

function ScreenSection() {
  const { colorMode } = useColorMode();

  return (
    <Box mt={{ base: '7', md: '20' }} alignItems="center">
      <Image
        key={colorMode === 'light' ? '1' : '2'}
        w={{ base: '288', md: '499' }}
        h={{ base: '6', md: '10' }}
        resizeMode="stretch"
        _light={{
          source: require('./images/seat-selection-light.png'),
        }}
        _dark={{
          source: require('./images/seat-selection-dark.png'),
        }}
        alt="Alternate Text"
      />
      <Text
        textAlign="center"
        fontSize={{ base: 'sm', md: 'md' }}
        fontWeight="medium"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
      >
        Screen
      </Text>
    </Box>
  );
}

function SeatRow({ data }: { data: Array<boolean> }) {
  return (
    <HStack flex={1} justifyContent="space-between" alignItems="center">
      {data?.map((item, index) => {
        return (
          <SeatComponent
            isAvailable={item}
            seatNumber={index + 1}
            key={index}
          />
        );
      })}
    </HStack>
  );
}

function SeatSection({ currentSeat }: { currentSeat: SeatType }) {
  return (
    <VStack space="3" w="100%">
      <Text
        ml="6"
        fontSize="sm"
        fontWeight="medium"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
      >
        {currentSeat.title}
      </Text>
      {currentSeat.seatSection.map((item, index) => (
        <HStack alignItems="center" key={index}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            mr="3"
            minW="3"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            lineHeight="21"
          >
            {item.seatSection}
          </Text>
          <SeatRow data={item.sectionSeats} />
        </HStack>
      ))}
    </VStack>
  );
}

function SeatCategories() {
  return (
    <HStack
      justifyContent="space-between"
      mt={{ base: '5', md: '12' }}
      mb={{ base: '4', md: '8' }}
      w="100%"
      maxW="380"
      alignSelf="center"
    >
      <HStack space={2} alignItems="center">
        <Box
          w="5"
          h="5"
          borderWidth="1"
          borderRadius="xs"
          _light={{ borderColor: 'coolGray.500' }}
          _dark={{ borderColor: 'coolGray.400' }}
        />
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        >
          Available
        </Text>
      </HStack>
      <HStack space={2} alignItems="center">
        <Box
          w="5"
          h="5"
          borderRadius="xs"
          _light={{ bg: 'coolGray.200' }}
          _dark={{ bg: 'coolGray.700' }}
        />
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        >
          Blocked
        </Text>
      </HStack>
      <HStack space={2} alignItems="center">
        <Box
          w="5"
          h="5"
          borderRadius="xs"
          _light={{ bg: 'green.600' }}
          _dark={{ bg: 'green.400' }}
        />
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        >
          Selected
        </Text>
      </HStack>
    </HStack>
  );
}

function CheckoutButton() {
  return (
    <Button
      variant="solid"
      w="100%"
      mb={{ base: '4', md: '8' }}
      mt="auto"
      _text={{
        fontSize: 'sm',
        fontWeight: 'medium',
        color: 'coolGray.50',
      }}
    >
      Checkout (RS 600)
    </Button>
  );
}

function MainContent() {
  fillSeatsArray();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
    >
      <Box
        _light={{ bg: 'coolGray.50' }}
        _dark={{ bg: 'coolGray.800' }}
        alignItems="center"
        flex="1"
        px={{ base: 4, md: 20, lg: 140 }}
        rounded={{ md: 'sm' }}
      >
        <ScreenSection />
        <VStack space="6" mt={{ base: '16', md: '12' }} w="full" maxW="536">
          {SeatAllocation.map((seat, index) => (
            <SeatSection currentSeat={seat} key={index} />
          ))}
        </VStack>
        <SeatCategories />
        <CheckoutButton />
      </Box>
    </ScrollView>
  );
}

export default function SeatSelection() {
  return (
    <DashboardLayout displaySidebar={false} title="Seat Selection">
      <MainContent />
    </DashboardLayout>
  );
}
