import React, { useEffect, useState, useRef } from 'react';
import { Box, View, Text } from 'native-base';
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
      new window.google.maps.Map(mapContainerRef.current as HTMLElement, {
        zoom: 16.5,
        mapTypeId: 'terrain',
        center: { lat: 12.90805437167937, lng: 77.60180353953143 },
        zoomControl: false,
        fullscreenControl: false,
      });
    }
  }, [mapLoaded]);

  if (mapLoaded) return <View flex="1" ref={mapContainerRef} />;
  else
    return (
      <Box
        bg="coolGray.200"
        flex="1"
        alignItems="center"
        justifyContent="center"
        _dark={{ bg: 'coolGray.700' }}
      >
        <Text fontSize="lg"> Loading...</Text>
      </Box>
    );
}
