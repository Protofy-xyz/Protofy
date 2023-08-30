import React, { useEffect, useRef, useState } from 'react';

import { Text, Box, View } from 'native-base';
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants?.manifest?.extra?.GOOGLE_MAPS_API_KEY;
const MAP_SCRIPT_WITH_API_KEY = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;

export default function WebMap() {
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapContainerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!document.body.dataset.mapLoaded) {
      const mapScript = document.createElement('script');
      mapScript.src = MAP_SCRIPT_WITH_API_KEY;
      mapScript.onload = () => {
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
          zoom: 15,
          mapTypeId: 'terrain',
          center: { lat: 12.91095437167937, lng: 77.60180353953143 },
          zoomControl: false,
          fullscreenControl: false,
        }
      );

      new window.google.maps.Marker({
        position: { lat: 12.906263633852848, lng: 77.6012477730121 },
        map: map,
        icon: {
          url: require('../images/Location.png'),
          size: new window.google.maps.Size(36, 50),
          scaledSize: new window.google.maps.Size(36, 50),
        },
      });

      new window.google.maps.Marker({
        position: { lat: 12.910938686053615, lng: 77.60184408715048 },
        map: map,
        icon: {
          url: require('../images/WebMarker.png'),
          size: new window.google.maps.Size(36, 50),
          scaledSize: new window.google.maps.Size(36, 50),
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
