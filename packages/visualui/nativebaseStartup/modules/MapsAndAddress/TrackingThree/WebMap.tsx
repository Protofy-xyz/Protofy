import React, { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import { Box, Text, View } from 'native-base';

const GOOGLE_MAPS_API_KEY = Constants?.manifest?.extra?.GOOGLE_MAPS_API_KEY;
const MAP_SCRIPT_WITH_API_KEY = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;

function WebMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if map script is already present in DOM
    if (!document.body.dataset.mapLoaded) {
      const mapScript = document.createElement('script');
      mapScript.src = MAP_SCRIPT_WITH_API_KEY;

      mapScript.onload = () => {
        // set dataset property on body to indicate map script has been loaded.
        document.body.dataset.mapLoaded = 'true';
        setMapLoaded(true);
      };
      document.head.appendChild(mapScript);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      const map = new window.google.maps.Map(
        mapContainerRef.current as HTMLElement,
        {
          zoom: 16,
          mapTypeId: 'terrain',
          center: { lat: 12.90805437167937, lng: 77.60180353953143 },
          zoomControl: false,
          fullscreenControl: false,
        }
      );

      type Cord = {
        lat: number;
        lng: number;
      };
      const pathCoords: Cord[] = [
        {
          lat: 12.91073,
          lng: 77.6018,
        },
        {
          lat: 12.91072,
          lng: 77.60173,
        },
        {
          lat: 12.91003,
          lng: 77.60191,
        },
        {
          lat: 12.90932,
          lng: 77.60214,
        },
        {
          lat: 12.90863,
          lng: 77.60231,
        },
        {
          lat: 12.9086,
          lng: 77.60185,
        },
        {
          lat: 12.90857,
          lng: 77.60166,
        },
        {
          lat: 12.90852,
          lng: 77.60059,
        },
        {
          lat: 12.90851,
          lng: 77.60038,
        },
        {
          lat: 12.90825,
          lng: 77.60041,
        },
        {
          lat: 12.90806,
          lng: 77.60041,
        },
        {
          lat: 12.90784,
          lng: 77.60044,
        },
        {
          lat: 12.90744,
          lng: 77.60055,
        },
        {
          lat: 12.90731,
          lng: 77.60061,
        },
        {
          lat: 12.90701,
          lng: 77.60089,
        },
        {
          lat: 12.90579,
          lng: 77.60183,
        },
        {
          lat: 12.90556,
          lng: 77.60195,
        },
        {
          lat: 12.9055,
          lng: 77.60196,
        },
        {
          lat: 12.90546,
          lng: 77.60197,
        },
        {
          lat: 12.90545,
          lng: 77.60186,
        },
        {
          lat: 12.90552,
          lng: 77.60183,
        },
        {
          lat: 12.90557,
          lng: 77.60181,
        },
        {
          lat: 12.90555,
          lng: 77.60173,
        },
        {
          lat: 12.90596,
          lng: 77.60145,
        },
        {
          lat: 12.906263633852848,
          lng: 77.6012477730121,
        },
      ];

      const deliveryPath = new window.google.maps.Polyline({
        path: pathCoords,
        geodesic: true,
        strokeColor: '#4C1D95',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      deliveryPath.setMap(map);

      new window.google.maps.Marker({
        position: { lat: 12.906263633852848, lng: 77.6012477730121 },
        map: map,
        icon: {
          url: require('../images/Bike.png'),
          size: new window.google.maps.Size(32, 32),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      new window.google.maps.Marker({
        position: {
          lat: 12.910753,
          lng: 77.60181,
        },
        map: map,
        icon: {
          url: require('../images/Location.png'),
          size: new window.google.maps.Size(32, 32),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(10, 0),
        },
      });
    }
  }, [mapLoaded]);

  if (mapLoaded) return <View flex="1" minH={354} ref={mapContainerRef} />;
  else
    return (
      <Box
        bg="coolGray.200"
        flex="1"
        minH={354}
        alignItems="center"
        justifyContent="center"
        _dark={{ bg: 'coolGray.700' }}
      >
        <Text fontSize="lg">Loading...</Text>
      </Box>
    );
}

export default WebMap;
