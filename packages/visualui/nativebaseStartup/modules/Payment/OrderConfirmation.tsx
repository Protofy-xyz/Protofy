import React from 'react';
import { Text, Button, Image, HStack, Divider, Box } from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function ConfirmationModal() {
  type Cost = {
    name1: string;
    name2: string;
  };
  const cost: Cost[] = [
    {
      name1: 'Total MRP',
      name2: '₹3561.00',
    },
    {
      name1: 'Discount on MRP',
      name2: '(₹214.00)',
    },
    {
      name1: 'Coupon Discount',
      name2: '50%NEW',
    },
    {
      name1: 'Shipping',
      name2: 'Free',
    },
  ];

  function PageImage() {
    return (
      <Box alignItems="center">
        <Image
          source={require('./images/Payment8.png')}
          alt="Alternate Text"
          height={48}
          width={32}
        />
        <Text
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          textAlign="center"
          fontWeight="bold"
          fontSize="xl"
          mt="8"
        >
          Order Placed Successfully!
        </Text>
        <Text
          textAlign="center"
          fontSize="sm"
          fontWeight="normal"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          mt="4"
          maxW={{ md: '480' }}
        >
          Congratulations! Your order has been placed. You can track your order
          number{' '}
          <Text
            fontSize="sm"
            fontWeight="medium"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            #6472883
          </Text>
        </Text>
      </Box>
    );
  }
  function CostList() {
    return (
      <Box
        px={{ base: 0, sm: 4, md: 0 }}
        pt={{ base: 4, md: 4 }}
        pb={{ base: 4, md: 4 }}
        mt={{ md: 3 }}
        mb={4}
        flex={1}
      >
        <Text
          px={{ base: 4, md: 0 }}
          fontSize="sm"
          fontWeight="bold"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          Order Summary
        </Text>
        {cost.map((item, index) => {
          return (
            <HStack
              justifyContent="space-between"
              px={{ base: 4, md: 0 }}
              mt={{ base: 4 }}
              alignItems="center"
              key={index}
            >
              <Text
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
                fontSize="xs"
                fontWeight="normal"
                lineHeight="18"
              >
                {item.name1}
              </Text>
              {item.name2 === '50%NEW' ? (
                <Text
                  _light={{ color: 'primary.900' }}
                  _dark={{ color: 'primary.500' }}
                  fontSize="xs"
                  fontWeight="normal"
                  lineHeight="18"
                >
                  {item.name2}
                </Text>
              ) : (
                <Text
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                  fontSize="xs"
                  fontWeight="normal"
                  lineHeight="18"
                >
                  {item.name2}
                </Text>
              )}
            </HStack>
          );
        })}
        <Divider mt={2} />
        <HStack
          alignItems="center"
          justifyContent="space-between"
          pt="2"
          px={{ base: 4, md: 0 }}
        >
          <Text
            fontWeight="medium"
            fontSize="sm"
            _dark={{ color: 'coolGray.50' }}
          >
            Total Amount
          </Text>
          <Text
            fontWeight="normal"
            fontSize="sm"
            lineHeight="21"
            _dark={{ color: 'coolGray.50' }}
          >
            ₹3340.00
          </Text>
        </HStack>
      </Box>
    );
  }
  return (
    <DashboardLayout title="Confirmation" rightPanelMobileHeader={true}>
      <Box
        px={{ md: 16, lg: '140' }}
        pt={{ base: 8, md: 10 }}
        pb={{ base: 4, md: 8 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'coolGray.50' }}
        _dark={{ bg: 'coolGray.800' }}
        flex={1}
      >
        <PageImage />
        <CostList />
        <Button variant="solid" mt="auto" mx={{ base: 4, md: 0 }} size="lg">
          CONTINUE SHOPPING
        </Button>
      </Box>
    </DashboardLayout>
  );
}
