import {
    YStack, Stack, Paragraph, H2, StackProps, Text
  } from "@my/ui"
  import { AlertTriangle } from '@tamagui/lucide-icons'
  import { useState, useMemo } from "react"
  import {
    GoogleMap, Marker, Polygon, useLoadScript
  } from '@react-google-maps/api'
  import { useThemeSetting } from '@tamagui/next-theme'
  import { useTint } from "../lib/Tints"
  import Center from './Center'
  
  const containerStyle = {
    width: '100%',
    height: '100%'
  }
  
  function metersToDegrees(lat: number, dx: number, dy: number) {
    const R = 6378137
    const dLat = (dy / R) * (180 / Math.PI)
    const dLon = (dx / R) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180)
    return { dLat, dLon }
  }
  
  function createBox(lat: number, lon: number, w: number, h: number) {
    let { dLat, dLon } = metersToDegrees(lat, w / 2, h / 2)
    
    return [
      { lat: lat - dLat, lng: lon - dLon },
      { lat: lat - dLat, lng: lon + dLon },
      { lat: lat + dLat, lng: lon + dLon },
      { lat: lat + dLat, lng: lon - dLon },
      { lat: lat - dLat, lng: lon - dLon },
    ]
  }
  
  export const MapViewGoogle = ({
    items, layerToggle = true, model, ...props
  }: any & StackProps) => {
    const { resolvedTheme } = useThemeSetting()
    const { tint } = useTint()
    const [satellite, setSatellite] = useState(false)
    const center = { lat: 41.3875, lng: 2.1688 }
  
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_TOKEN || "",
      libraries: ['places']
    })
  
    const locationItems = useMemo(() =>
      items.data.items
        .map((raw: any) => ({ modelItem: model.load(raw) }))
        .map(it => ({ ...it, location: it.modelItem.getLocation() }))
        .filter(it => it.location)
    , [items.data.items])
  
    const pins = locationItems
      .filter(it => it.location.options?.mode !== 'geo')
      .map((it, i) => (
        <Marker
          key={i}
          position={{
            lat: parseFloat(it.location.lat),
            lng: parseFloat(it.location.lon)
          }}
        />
      ))
  
    const polygons = useMemo(() =>
      locationItems
        .filter(it => it.location.options?.mode === 'geo')
        .map(it => {
          const { lat, lon, options = {} } = it.location
          const width = options.width || 100
          const height = options.height || 100
          const box = createBox(parseFloat(lat), parseFloat(lon), width, height)
  
          return (
            <Polygon
              key={it.modelItem.getId()}
              paths={box}
              options={{
                fillColor: '#00aaff',
                fillOpacity: 0.5,
                strokeColor: '#0088dd',
                strokeOpacity: 1,
                strokeWeight: 1,
              }}
            />
          )
        })
    , [locationItems])
  
    if (loadError) {
      return (
        <YStack f={1} ai="center" jc="center" space="$4">
          <Center>
            <AlertTriangle size="$7" />
            <H2 mt="$6">Google Maps failed to load</H2>
            <Paragraph ta="center" mt="$6" size="$7">
              Please check your API key or internet connection.
            </Paragraph>
          </Center>
        </YStack>
      )
    }
  
    return (
      <Stack f={1} {...props}>
        {layerToggle && (
          <YStack pos="absolute" t={10} l={10} zi={10}>
            <button onClick={() => setSatellite(!satellite)}>
              {satellite ? '🗺️' : '🛰️'}
            </button>
          </YStack>
        )}
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={16}
            mapTypeId={satellite ? 'hybrid' : 'roadmap'}
            options={{ tilt: 0, heading: 0, mapTypeControl: false }}
          >
            {pins}
            {polygons}
          </GoogleMap>
        ) : (
          <YStack f={1} ai="center" jc="center" space="$4">
            <Center><Paragraph>Loading Google Maps...</Paragraph></Center>
          </YStack>
        )}
      </Stack>
    )
  }
  