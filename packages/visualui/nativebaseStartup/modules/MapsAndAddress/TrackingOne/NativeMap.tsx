import { MaterialIcons } from '@expo/vector-icons';
import { Center, Icon, useColorMode, VStack } from 'native-base';
import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

function NativeMap() {
  const { colorMode } = useColorMode();
  const mapStandardStyle = [
    {
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
  ];
  const mapDarkStyle = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#212121',
        },
      ],
    },
    {
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#212121',
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [
        {
          color: '#757575',
        },
      ],
    },
    {
      featureType: 'administrative.country',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#bdbdbd',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#181818',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#1b1b1b',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#2c2c2c',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#8a8a8a',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          color: '#373737',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#3c3c3c',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [
        {
          color: '#4e4e4e',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#000000',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#3d3d3d',
        },
      ],
    },
  ];
  return (
    <MapView
      style={{ flex: 1, minHeight: 518 }}
      provider={PROVIDER_GOOGLE}
      customMapStyle={colorMode === 'dark' ? mapDarkStyle : mapStandardStyle}
      region={{
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
        latitude: 12.910538686053615,
        longitude: 77.60184408715048,
      }}
    >
      <Marker
        draggable
        coordinate={{
          latitude: 12.909538686053615,
          longitude: 77.60184408715048,
        }}
      >
        <VStack padding="2">
          <Icon
            as={MaterialIcons}
            _light={{ color: 'primary.900' }}
            _dark={{ color: 'primary.500' }}
            name="place"
            size={5}
            position="absolute"
            top="1"
            right="6"
          />
          <Center
            rounded="full"
            h="20"
            w="20"
            _light={{ bg: 'primary.900:alpha.20' }}
            _dark={{ bg: 'primary.500:alpha.20' }}
          >
            <Icon
              as={MaterialIcons}
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'primary.500' }}
              name="trip-origin"
              size={6}
            />
          </Center>
        </VStack>
      </Marker>
    </MapView>
  );
}

export default NativeMap;
