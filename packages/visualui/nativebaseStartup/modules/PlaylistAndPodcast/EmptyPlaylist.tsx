import React from 'react';
import { Text, Button, Image, Box } from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
export default function EmptyPlaylist() {
  return (
    <DashboardLayout displaySidebar={false} title="Playlist">
      <Box
        px={{ base: 4, md: 140 }}
        pt={{ base: 8, md: 10 }}
        pb={{ base: 4, md: 8 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'coolGray.50' }}
        _dark={{ bg: 'coolGray.800' }}
        flex={1}
        alignItems="center"
      >
        <Image
          alt="emptyplaylist"
          width={266}
          height={232}
          source={require('./images/emptyplaylist.png')}
          mt={{ base: 0, md: 16 }}
        />
        <Text
          mt={10}
          fontSize="2xl"
          textAlign="center"
          fontWeight="bold"
          _dark={{ color: 'coolGray.50' }}
          _light={{ color: 'coolGray.800' }}
        >
          No playlist found
        </Text>
        <Text
          fontSize="sm"
          my={2}
          textAlign="center"
          fontWeight="normal"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          maxW={{ md: 328 }}
        >
          We didn’t find any playlist in your music folder. Use the{' '}
          <Text
            fontSize="sm"
            fontWeight="medium"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            “Create Playlist”
          </Text>
          {'  '}
          feature to find your playlist.
        </Text>
        <Button w="100%" mt="auto" variant="solid" size="lg">
          CREATE PLAYLIST
        </Button>
      </Box>
    </DashboardLayout>
  );
}
