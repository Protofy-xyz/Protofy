import React from 'react';
import {
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  Pressable,
  Divider,
  ScrollView,
  Box,
  Link,
  useColorModeValue,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import LightImage from './images/Refer.png';
import DarkImage from './images/ReferDark.png';

type FaqItemList = {
  title: string;
  text: string;
};

type IconType = {
  imageName: ImageSourcePropType;
};

const Icons: IconType[] = [
  {
    imageName: require('./images/facebook.png'),
  },
  {
    imageName: require('./images/Whatsapp.png'),
  },
  {
    imageName: require('./images/Twitter.png'),
  },
];

const faqItemList: FaqItemList[] = [
  {
    title: 'How it works ?',
    text: 'Works are the legal agreements between a service provider and a person who wants to use that service. The person must agree to abide by the terms of service in order to use the offered service. Terms of service can also be merely a disclaimer, especially regarding the use of websites.',
  },
  {
    title: 'How much do i get ?',
    text: 'Works are the legal agreements between a service provider and a person who wants to use that service. The person must agree to abide by the terms of service in order to use the offered service. Terms of service can also be merely a disclaimer, especially regarding the use of websites.',
  },
  {
    title: 'Terms and conditions for referral?',
    text: 'Works are the legal agreements between a service provider and a person who wants to use that service. The person must agree to abide by the terms of service in order to use the offered service. Terms of service can also be merely a disclaimer, especially regarding the use of websites.',
  },
];

function PromoCode() {
  return (
    <HStack
      mt={10}
      alignItems="center"
      borderRadius={4}
      justifyContent="space-around"
      borderStyle="dashed"
      borderWidth="2"
      _light={{
        borderColor: 'coolGray.300',
      }}
      _dark={{
        borderColor: 'coolGray.500',
      }}
    >
      <VStack alignItems="center" py={4} px={8} space={1}>
        <Text
          fontSize="xs"
          fontWeight="normal"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Your referral Code
        </Text>
        <Text
          fontSize="md"
          fontWeight="bold"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Native50
        </Text>
      </VStack>
      <Divider
        orientation="vertical"
        _light={{ bg: 'coolGray.200' }}
        _dark={{ bg: 'coolGray.500' }}
        h="50%"
      />
      <Pressable py={4} px={6}>
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{ color: 'primary.800' }}
          _dark={{ color: 'primary.500' }}
        >
          Copy Code
        </Text>
      </Pressable>
    </HStack>
  );
}

function SocialIcon() {
  return (
    <>
      <Text
        mt={{ base: 7, md: 6 }}
        fontSize="md"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Share your referral code
      </Text>

      <HStack mt={5} alignItems="center" space={5}>
        {Icons.map((item, index) => {
          return (
            <Link href="" key={index}>
              <Image
                source={item.imageName}
                alt="Alternate Text"
                height={8}
                width={8}
              />
            </Link>
          );
        })}
      </HStack>
    </>
  );
}

function Collapsable({
  index,
  currentIndex,
  isOpen,
  toggleCollapsable,
  title,
  description,
}: {
  index: number;
  currentIndex: number;
  isOpen: boolean;
  toggleCollapsable: (ind: number) => void;
  title: string;
  description: string;
}) {
  return (
    <Box
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: 'coolGray.700' }}
      borderRadius="sm"
      w="full"
    >
      <Pressable onPress={() => toggleCollapsable(index)}>
        <HStack alignItems="center" p={2}>
          <Icon
            mr={2.5}
            size={2}
            as={MaterialIcons}
            name={'circle'}
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          />
          <Text
            fontSize="sm"
            fontWeight="normal"
            maxW="90%"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            {title}
          </Text>

          <Icon
            ml="auto"
            size={6}
            as={MaterialIcons}
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            name={
              !(currentIndex === index && isOpen)
                ? 'keyboard-arrow-down'
                : 'keyboard-arrow-up'
            }
          />
        </HStack>
      </Pressable>
      {currentIndex === index && isOpen ? (
        <Text
          px={4}
          pb={4}
          fontSize="sm"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          {description}
        </Text>
      ) : null}
    </Box>
  );
}

function FAQModal() {
  const [currentItemNumber, setCurrentItemNumber] = React.useState<number>(0);
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const toggleCollapsable = (index: number) => {
    if (currentItemNumber === index) {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(true);
      setCurrentItemNumber(index);
    }
  };

  return (
    <VStack
      width="100%"
      space={{ base: 3, md: 4 }}
      mt={{ base: 9, md: 12 }}
      pb={{ md: 4 }}
    >
      <Text
        fontSize="md"
        fontWeight="medium"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Frequently Asked Questions
      </Text>
      {faqItemList.map((item, index) => {
        return (
          <Collapsable
            key={index}
            index={index}
            currentIndex={currentItemNumber}
            isOpen={isOpen}
            toggleCollapsable={toggleCollapsable}
            title={item.title}
            description={item.text}
          />
        );
      })}
    </VStack>
  );
}

function MainContent() {
  const imageSource = useColorModeValue(LightImage, DarkImage);
  return (
    <ScrollView bounces={false}>
      <Box
        py={{ base: 4, md: 8 }}
        px={{ base: 4, sm: 4, md: 8, lg: 35, xl: 35 }}
        alignItems="center"
        rounded={{ md: 'sm' }}
        _light={{ bg: 'coolGray.50' }}
        _dark={{ bg: 'coolGray.800' }}
        flex={1}
      >
        <Image
          key={imageSource}
          source={imageSource}
          alt="Banner Image"
          width={{ base: '275', md: ' 386' }}
          height={{ base: '207', md: '290' }}
        />
        <PromoCode />
        <SocialIcon />
        <FAQModal />
      </Box>
    </ScrollView>
  );
}

export default function () {
  return (
    <DashboardLayout title={'Refer And Earn'} displaySidebar={false}>
      <MainContent />
    </DashboardLayout>
  );
}
