import React from 'react';
import {
  HStack,
  Text,
  VStack,
  Center,
  Divider,
  Box,
  Image,
  Icon,
} from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';

type TrackProps = {
  IconColorLight?: string;
  IconColorDark?: string;
};
function Card() {
  return (
    <HStack
      space="3"
      p={{ base: 3, md: 4 }}
      borderRadius="sm"
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: 'coolGray.700' }}
    >
      <Image
        source={require('./images/sweater.png')}
        alt="Alternate Text"
        height="90"
        width="74"
        borderRadius="sm"
      />
      <VStack flex={1}>
        <Text
          fontSize="md"
          fontWeight="bold"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Sweater dress
        </Text>
        <Text
          fontSize="sm"
          fontWeight="normal"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        >
          Girls self design
        </Text>
        <Text
          fontSize="sm"
          fontWeight={{ base: 'medium', md: 'bold' }}
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          mt="auto"
        >
          ₹1,199
        </Text>
      </VStack>
    </HStack>
  );
}
function TrackingIcon(props: TrackProps) {
  return (
    <Icon
      size={5}
      as={MaterialIcons}
      name="check-circle"
      _light={{
        color: props.IconColorLight,
      }}
      _dark={{
        color: props.IconColorDark,
      }}
    />
  );
}

const data = [
  {
    title: 'Order Placed',
    description: 'We have received your order on 28-May-2021.',
    status: { type: true, time: '5:38 pm' },
  },
  {
    title: 'Order Packed',
    description:
      'Seller has processed your order on 29th. Your item has been picked up by courier partner on 30 May-2021.',
    status: { type: true, time: '5:38 pm' },
  },
  {
    title: 'Shipped',
    description: 'Your item has been picked up not yet shipped.',
    status: { type: false, time: '' },
  },
];

const StatusStepComponent = ({
  title,
  description,
  status,
  key,
}: {
  title: string;
  description: string;
  key: number;
  status: { type: boolean; time: string };
}) => {
  const arr = new Array(6).fill(0);
  return (
    <HStack justifyContent="flex-start" space="4" key={key}>
      <VStack>
        <TrackingIcon
          IconColorLight={status.type ? 'primary.900' : 'primary.300'}
          IconColorDark={status.type ? 'primary.500' : 'coolGray.400'}
        />
        {status.type ? (
          <Divider
            orientation="vertical"
            _light={{ bg: 'primary.900' }}
            _dark={{ bg: 'primary.500' }}
            size="0.5"
            ml="9.5"
            flex={1}
          />
        ) : (
          <VStack flex={1} height="8" width="0.5" space="1" ml="9.5">
            {arr.map((e, i) => {
              return (
                <Center
                  py="0.5"
                  width={0.5}
                  _light={{ bgColor: 'primary.300' }}
                  _dark={{ bgColor: 'coolGray.400' }}
                />
              );
            })}
          </VStack>
        )}
      </VStack>
      <VStack mb="6" flex={1}>
        <Text
          _light={{ color: status.type ? 'coolGray.800' : 'coolGray.400' }}
          _dark={{ color: status.type ? 'coolGray.50' : 'coolGray.500' }}
          fontWeight="medium"
          fontSize="sm"
          mb="2px"
        >
          {title}
        </Text>

        <Text
          _light={{ color: status.type ? 'coolGray.500' : 'coolGray.400' }}
          _dark={{ color: status.type ? 'coolGray.400' : 'coolGray.500' }}
          fontWeight="normal"
          fontSize="xs"
        >
          {description}
        </Text>
        {status.type && (
          <Text
            _light={{ color: 'coolGray.400' }}
            _dark={{ color: 'coolGray.500' }}
            fontWeight="normal"
            fontSize="xs"
          >
            {status.time}
          </Text>
        )}
      </VStack>
    </HStack>
  );
};

function Tracking() {
  return (
    <Box px={{ base: '2', md: '0' }}>
      {data.map((item, index) => (
        <StatusStepComponent
          title={item.title}
          description={item.description}
          status={item.status}
          key={index}
        />
      ))}
      <HStack justifyContent="flex-start" space="4">
        <TrackingIcon
          IconColorLight="primary.300"
          IconColorDark="coolGray.400"
        />
        <VStack>
          <Text
            _light={{ color: 'coolGray.400' }}
            _dark={{ color: 'coolGray.500' }}
            fontWeight="medium"
            fontSize="sm"
            mb="0.5"
          >
            Out for Delivery
          </Text>
          <Text
            _light={{ color: 'coolGray.400' }}
            _dark={{ color: 'coolGray.500' }}
            fontWeight="normal"
            fontSize="xs"
          >
            Your order is out for delivery.
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}
function MainContent() {
  return (
    <VStack
      flex={{ md: 1 }}
      px={{ base: 4, md: 8, lg: 140 }}
      pt={{ base: 5, md: 8 }}
      pb={{ base: '38', md: 8 }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      rounded={{ md: 'sm' }}
      space="8"
    >
      <Card />
      <Tracking />
    </VStack>
  );
}
export default function TrackOrders() {
  return (
    <>
      <DashboardLayout title="Track Order">
        <MainContent />
      </DashboardLayout>
    </>
  );
}
