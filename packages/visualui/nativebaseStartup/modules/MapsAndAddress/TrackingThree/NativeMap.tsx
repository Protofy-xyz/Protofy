import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Icon, useColorMode } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants?.manifest?.extra?.GOOGLE_MAPS_API_KEY;

function NativeMap() {
  type Cord = {
    latitude: number;
    longitude: number;
  };
  const pathCoords: Cord[] = [
    {
      latitude: 12.910753,
      longitude: 77.60181,
    },
    {
      latitude: 12.91072,
      longitude: 77.60173,
    },
    {
      latitude: 12.91003,
      longitude: 77.60191,
    },
    {
      latitude: 12.90932,
      longitude: 77.60214,
    },
    {
      latitude: 12.90863,
      longitude: 77.60231,
    },
    {
      latitude: 12.9086,
      longitude: 77.60185,
    },
    {
      latitude: 12.90857,
      longitude: 77.60166,
    },
    {
      latitude: 12.90852,
      longitude: 77.60059,
    },
    {
      latitude: 12.90851,
      longitude: 77.60038,
    },
    {
      latitude: 12.90825,
      longitude: 77.60041,
    },
    {
      latitude: 12.90806,
      longitude: 77.60041,
    },
    {
      latitude: 12.90784,
      longitude: 77.60044,
    },
    {
      latitude: 12.90744,
      longitude: 77.60055,
    },
    {
      latitude: 12.90731,
      longitude: 77.60061,
    },
    {
      latitude: 12.90701,
      longitude: 77.60089,
    },
    {
      latitude: 12.90579,
      longitude: 77.60183,
    },
    {
      latitude: 12.90556,
      longitude: 77.60195,
    },
    {
      latitude: 12.9055,
      longitude: 77.60196,
    },
    {
      latitude: 12.90546,
      longitude: 77.60197,
    },
    {
      latitude: 12.90545,
      longitude: 77.60186,
    },
    {
      latitude: 12.90552,
      longitude: 77.60183,
    },
    {
      latitude: 12.90557,
      longitude: 77.60181,
    },
    {
      latitude: 12.90555,
      longitude: 77.60173,
    },
    {
      latitude: 12.90596,
      longitude: 77.60145,
    },
    {
      latitude: 12.906263633852848,
      longitude: 77.6012477730121,
    },
  ];
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
  const { colorMode } = useColorMode();

  return (
    <MapView
      style={{
        flex: 1,
        minHeight: 330,
      }}
      customMapStyle={colorMode === 'dark' ? mapDarkStyle : mapStandardStyle}
      provider={PROVIDER_GOOGLE}
      region={{
        latitudeDelta: 0.01,
        longitudeDelta: 0.0081,
        latitude: 12.90853868605361,
        longitude: 77.60184408715048,
      }}
    >
      <Marker
        coordinate={{
          latitude: 12.91075,
          longitude: 77.60183,
        }}
      >
        <Icon
          as={MaterialIcons}
          name="location-on"
          _light={{ color: 'primary.900' }}
          _dark={{ color: 'primary.500' }}
        />
      </Marker>
      <Marker
        coordinate={{
          latitude: 12.906263633852848,
          longitude: 77.6012477730121,
        }}
      >
        <Icon
          as={MaterialIcons}
          name="electric-moped"
          _light={{ color: 'primary.900' }}
          _dark={{ color: 'primary.500' }}
        />
      </Marker>
      <Polyline
        coordinates={pathCoords}
        strokeColor={colorMode === 'dark' ? '#8B5CF6' : '#4C1D95'}
        strokeWidth={2}
      />
      <MapViewDirections
        origin={{
          latitude: 12.910938686053615,
          longitude: 77.60184408715048,
        }}
        destination={{
          latitude: 12.906263633852848,
          longitude: 77.6012477730121,
        }}
        apikey={GOOGLE_MAPS_API_KEY}
        strokeWidth={3}
        strokeColor="hotpink"
        optimizeWaypoints={true}
      />
    </MapView>
  );
}

export default NativeMap;
