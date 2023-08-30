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
  Button,
  Progress,
  Hidden,
  Stack,
  Pressable,
  Badge,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';

type CategoriesProps = {
  name: string;
};

const categories: CategoriesProps[] = [
  {
    name: 'COVID-19',
  },
  {
    name: 'Food',
  },
  {
    name: 'Health',
  },
];

function CategoryCard({ name }: CategoriesProps) {
  return (
    <Badge
      p="3"
      mb="1"
      _text={{
        fontSize: 'sm',
        fontWeight: 'normal',
      }}
      _light={{
        bg: 'primary.50',
        _text: {
          color: 'coolGray.800',
        },
      }}
      _dark={{
        bg: 'coolGray.700',
        _text: {
          color: 'coolGray.50',
        },
      }}
    >
      {name}
    </Badge>
  );
}

function CategoriesSection() {
  return (
    <HStack flexWrap={'wrap'} mt="5" space="2" alignItems="center">
      {categories.map((item, index) => {
        return <CategoryCard {...item} key={index} />;
      })}
    </HStack>
  );
}

function ProgressSection() {
  return (
    <Box mt="6">
      <Progress
        w="100%"
        value={45}
        _light={{
          bg: 'emerald.100',
          _filledTrack: { bg: 'emerald.600' },
        }}
        _dark={{
          bg: 'coolGray.700',
          _filledTrack: { bg: 'emerald.500' },
        }}
      />
      <HStack mt="2" alignItems="center" justifyContent="space-between">
        <VStack space={1}>
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
            $3,80,000
          </Text>
        </VStack>
        <VStack space={1}>
          <Text
            textAlign="right"
            fontSize="xs"
            fontWeight="medium"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            Target
          </Text>
          <Text
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            fontSize="md"
            fontWeight="bold"
          >
            $5,53,000
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

function RecentDonors() {
  return (
    <Box mt={{ base: 4, md: 6 }} alignItems="flex-start">
      <Text
        fontSize="md"
        fontWeight="medium"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Recent Donors
      </Text>
      <Avatar.Group
        _avatar={{ size: '10' }}
        mt="2"
        _light={{ borderColor: 'white' }}
        _dark={{ borderColor: 'coolGray.800' }}
      >
        <Avatar source={require('./images/campaign-details-avatar-1.png')} />
        <Avatar source={require('./images/campaign-details-avatar-2.png')} />
        <Avatar source={require('./images/campaign-details-avatar-3.png')} />
      </Avatar.Group>
    </Box>
  );
}

function AboutUs() {
  return (
    <VStack mt="4" space="2" pb={{ base: 4, md: 0 }}>
      <Text
        fontSize="md"
        fontWeight="medium"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        About Us
      </Text>
      <Text
        fontSize="sm"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Recent Donors Indian Matchmaking is teaming up with Project Ekta and
        Delhi Youth Welfare Association to raise funds for organizations in
        India to help with COVID relief.
      </Text>
    </VStack>
  );
}

function DonateButton() {
  return (
    <Button
      mt={{ base: 'auto', md: 6 }}
      variant="solid"
      _text={{
        fontWeight: 'medium',
      }}
      size="lg"
    >
      DONATE
    </Button>
  );
}

function MainContent() {
  const [wishlisted, setWishlisted] = useState(false);
  return (
    <ScrollView bounces={false}>
      <Stack
        flexDirection={{ base: 'column', md: 'row' }}
        px={{ base: 4, md: 8 }}
        py={{ base: 5, md: 8 }}
        rounded={{ md: 'sm' }}
        _light={{
          bg: { base: 'white' },
        }}
        _dark={{
          bg: 'coolGray.800',
        }}
      >
        <Box
          flex={{ md: 0.6 }}
          p="2"
          _light={{
            bg: 'primary.50',
          }}
          _dark={{
            bg: 'coolGray.700',
          }}
          borderRadius="sm"
        >
          <Image
            borderRadius="sm"
            width="100%"
            height={{ base: '246', md: '652' }}
            alt="Header Image"
            source={require('./images/campaign-details-1.png')}
          />
        </Box>
        <Box pl={{ md: 4 }} flex={{ md: 0.4 }} mt={{ base: 4, md: 0 }}>
          <Box justifyContent="center">
            <HStack justifyContent="space-between" alignItems="center">
              <Text
                fontSize="lg"
                fontWeight="medium"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              >
                India COVID Relief
              </Text>
              <Pressable onPress={() => setWishlisted(!wishlisted)}>
                <Icon
                  size={6}
                  name={wishlisted ? 'favorite' : 'favorite-border'}
                  as={MaterialIcons}
                  _light={{ color: 'primary.900' }}
                  _dark={{ color: 'primary.500' }}
                />
              </Pressable>
            </HStack>
            <Text
              fontSize="sm"
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
            >
              Created by Project Ekta
            </Text>
          </Box>
          <CategoriesSection />
          <ProgressSection />
          <Hidden till="md">
            <DonateButton />
          </Hidden>
          <RecentDonors />
          <AboutUs />
          <Hidden from="md">
            <DonateButton />
          </Hidden>
        </Box>
      </Stack>
    </ScrollView>
  );
}

export default function () {
  return (
    <DashboardLayout title={'Campaign Details'} displaySidebar={false}>
      <MainContent />
    </DashboardLayout>
  );
}
