import React, { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import { Box, Text, View } from 'native-base';

const GOOGLE_MAPS_API_KEY = Constants?.manifest?.extra?.GOOGLE_MAPS_API_KEY;
const MAP_SCRIPT_WITH_API_KEY = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;

function WebMap() {
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
          fullscreenControl: false,
          zoomControl: false,
        }
      );

      new window.google.maps.Marker({
        position: { lat: 12.910938686053615, lng: 77.60184408715048 },
        map: map,
        icon: {
          url: require('../images/WebMarker.png'),
          size: new window.google.maps.Size(80, 84),
          scaledSize: new window.google.maps.Size(80, 84),
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
