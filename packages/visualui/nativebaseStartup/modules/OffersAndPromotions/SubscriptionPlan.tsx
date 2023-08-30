import React from 'react';
import {
  HStack,
  Icon,
  Text,
  Center,
  Button,
  Pressable,
  Image,
  ScrollView,
  Box,
  useColorMode,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';
type OptionListType = {
  planTitle: string;
};

const planOptionsList: OptionListType[] = [
  {
    planTitle: 'Unlock over 15 courses.',
  },
  {
    planTitle: 'Save upto 1000 words',
  },
  {
    planTitle: 'Unlock over 120 learning courses.',
  },
  {
    planTitle: 'Maintain notes and access them anytime',
  },
];

function PlanDescriptionItem({ planTitle }: { planTitle: string }) {
  return (
    <HStack space="3" w={{ base: '100%', md: '50%' }} mb="5">
      <Icon
        size={6}
        as={MaterialIcons}
        name={'check-circle'}
        _light={{
          color: 'primary.900',
        }}
        _dark={{
          color: 'primary.500',
        }}
      />
      <Text
        flex={1}
        fontSize="sm"
        _light={{
          color: 'coolGray.800',
        }}
        _dark={{ color: 'coolGray.50' }}
        fontWeight="normal"
        lineHeight="21"
      >
        {planTitle}
      </Text>
    </HStack>
  );
}

function PlanOption() {
  return (
    <Box>
      <HStack alignItems="center" mt={{ base: 7, md: 8 }} mb={5} space={1.5}>
        <Text
          _light={{ color: 'primary.900' }}
          _dark={{ color: 'primary.500' }}
          fontSize="xl"
          fontWeight="bold"
        >
          50% off
        </Text>
        <Text
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          fontSize="sm"
          fontWeight="medium"
        >
          Until Sunday, June 25th
        </Text>
      </HStack>
      <HStack flexWrap="wrap">
        {planOptionsList.map((plan, index) => (
          <PlanDescriptionItem key={index} {...plan} />
        ))}
      </HStack>
    </Box>
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
  const getCurrentTabStyle = () => {
    return tabName === currentTab
      ? {
          borderRadius: 'sm',
          _light: {
            bg: 'primary.900',
            color: 'coolGray.50',
          },
          _dark: {
            bg: 'primary.500',
            color: 'coolGray.50',
          },
        }
      : {
          _light: {
            bg: 'primary.50',
            color: 'coolGray.500',
          },
          _dark: {
            bg: 'coolGray.700',
            color: 'coolGray.400',
          },
        };
  };
  return (
    <Pressable onPress={() => handleTabChange(tabName)} flex={1}>
      <Text
        textAlign="center"
        fontSize="sm"
        fontWeight="medium"
        letterSpacing="0.4"
        {...getCurrentTabStyle()}
        py={4}
      >
        {tabName}
      </Text>
    </Pressable>
  );
}

function OptionSection() {
  const [tabName, setTabName] = React.useState('Premium');

  return (
    <>
      <HStack
        mt={5}
        alignItems="center"
        width="100%"
        borderRadius="sm"
        overflow="hidden"
      >
        <TabItem
          tabName={'Free'}
          currentTab={tabName}
          handleTabChange={(tab) => setTabName(tab)}
        />
        <TabItem
          tabName={'Premium'}
          currentTab={tabName}
          handleTabChange={(tab) => setTabName(tab)}
        />
        <TabItem
          tabName={'Business'}
          currentTab={tabName}
          handleTabChange={(tab) => setTabName(tab)}
        />
      </HStack>
      {tabName === 'Free' ? (
        <Text
          fontSize="sm"
          lineHeight="lg"
          letterSpacing="0.3"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          mb={8}
          mt={{ base: 7, md: 8 }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged.
        </Text>
      ) : tabName === 'Business' ? (
        <Text
          fontSize="sm"
          lineHeight="lg"
          letterSpacing="0.3"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          mb={8}
          mt={{ base: 7, md: 8 }}
        >
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a
          search for 'lorem ipsum' will uncover many web sites still in their
          infancy.
        </Text>
      ) : (
        <PlanOption />
      )}
    </>
  );
}
function SubscriptionPlan() {
  const { colorMode } = useColorMode();
  return (
    <Box
      safeAreaBottom
      borderRadius={{ md: 8 }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      px={{ base: 4, md: 8, lg: '140' }}
      pt={8}
      pb={{ base: 4, md: 8 }}
      flex={1}
      rounded={{ md: 'sm' }}
      minH={{ md: 716 }}
    >
      <Center>
        <Image
          key={colorMode === 'light' ? '1' : '2'}
          _light={{ source: require('./images/subscription.png') }}
          _dark={{ source: require('./images/subscriptionDark.png') }}
          alt="Alternate Text"
          height="203"
          width="101"
        />
      </Center>
      <Text
        fontSize="lg"
        textAlign="center"
        fontWeight="bold"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        mt={8}
      >
        Upgrade to premium
      </Text>
      <Text
        mt={2}
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        fontSize="sm"
        textAlign="center"
        fontWeight="normal"
      >
        Unlock over 15 courses, 120 chats and so more!
      </Text>
      <OptionSection />

      <Button variant="solid" size="lg" mt="auto">
        SUBSCRIBE NOW
      </Button>
    </Box>
  );
}

function MainContent() {
  return (
    <ScrollView bounces={false}>
      <SubscriptionPlan />
    </ScrollView>
  );
}
export default function () {
  return (
    <DashboardLayout title={'Subscription Plans'} displaySidebar={false}>
      <MainContent />
    </DashboardLayout>
  );
}
