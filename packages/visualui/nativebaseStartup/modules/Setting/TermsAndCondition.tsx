import React from 'react';
import { Box, Text, VStack } from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function () {
  const listItemStyle = {
    justifyContent: 'center',
    fontSize: 'sm',
    _dark: { color: 'coolGray.400' },
    _light: { color: 'coolGray.500' },
  };
  return (
    <DashboardLayout title=" Terms and Conditions">
      <VStack
        px={{ base: 4, md: 8 }}
        pt={{ base: 5, md: 8 }}
        pb={{ base: 4, md: 8 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
      >
        <VStack space="3">
          <Text
            _dark={{ color: 'coolGray.50' }}
            _light={{ color: 'coolGray.800' }}
            fontWeight="medium"
          >
            1. Terms
          </Text>
          <Text {...listItemStyle}>
            You agree, further, not to use or attempt to use any engine,
            software, tool, agent or other device or mechanism (including
            without limitation browsers, spiders, robots, avatars or intelligent
            agents) to navigate or search this Website other than the search
            engine and search agents available from us on this Website.
          </Text>
        </VStack>
        <VStack space="3" mt="4">
          <Text
            _dark={{ color: 'coolGray.50' }}
            _light={{ color: 'coolGray.800' }}
            fontWeight="medium"
          >
            2. Conditions
          </Text>
          <Text {...listItemStyle}>
            Violations of system or network security may result in civil or
            criminal liability. We will investigate such violations and
            prosecute users who are involved in such violations.
          </Text>

          <Box mr="4">
            <Text {...listItemStyle}>
              • You agree not to use any device, software or routine to
              interfere or attempt to interfere with the proper working of this
              Website or any activity being conducted on this
            </Text>
            <Text {...listItemStyle}>
              • You agree, further, not to use or attempt to use any engine,
              software, tool, agent or other device or mechanism (including
              without limitation browsers, spiders, robots, avatars or
              intelligent agents) to navigate or search this Website other than
              the search engine and search agents available from us on this
              Website.
            </Text>
          </Box>
        </VStack>
      </VStack>
    </DashboardLayout>
  );
}
