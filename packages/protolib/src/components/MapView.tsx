import {
  YStack, Stack, XStack, Paragraph, H2, StackProps, Text
} from "@my/ui"
import { AlertTriangle } from '@tamagui/lucide-icons'
import { useRef, useState, useMemo, useEffect, useCallback } from "react"
import {
  Map as MapGL,
  Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl
} from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
import { useThemeSetting } from '@tamagui/next-theme'
import { EditableObject } from "./EditableObject"
import { getPendingResult } from "protobase"
import { Tinted } from "./Tinted"
import { useTint } from "../lib/Tints"
import Center from './Center'

function metersToDegrees(lat: number, dx: number, dy: number) {
  const R = 6378137
  const dLat = (dy / R) * (180 / Math.PI)
  const dLon = (dx / R) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180)
  return { dLat, dLon }
}

function createBox(lat: number, lon: number, w: number, h: number) {
  const { dLat, dLon } = metersToDegrees(lat, w / 2, h / 2)
  return [
    [lon - dLon, lat - dLat],
    [lon + dLon, lat - dLat],
    [lon + dLon, lat + dLat],
    [lon - dLon, lat + dLat],
    [lon - dLon, lat - dLat],
  ]
}

export const MapView = ({
  items, layerToggle = true, model, sourceUrl, extraFields,
  icons, customFields, onDelete, deleteable, extraMenuActions, ...props
}: any & StackProps) => {
  const { resolvedTheme } = useThemeSetting()
  const { tint } = useTint()
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [popupInfo, setPopupInfo] = useState<any>(null)
  const [satellite, setSatellite] = useState(false)

  // 🌍 Viewport (posición/zoom)
  const [viewport, setViewport] = useState({
    latitude: 41.3875,
    longitude: 2.1688,
    zoom: 16
  })

  const locationItems = useMemo(() =>
    items.data.items
      .map((raw: any) => ({ modelItem: model.load(raw) }))
      .map(it => ({ ...it, location: it.modelItem.getLocation() }))
      .filter(it => it.location)
  , [items.data.items])

  const pins = useMemo(() =>
    locationItems
      .filter(it => it.location.options?.mode !== 'geo')
      .map((it, i) => (
        <Marker
          key={i}
          longitude={parseFloat(it.location.lon)}
          latitude={parseFloat(it.location.lat)}
          anchor="center"
          onClick={e => {
            e.originalEvent.stopPropagation()
            setPopupInfo(it)
          }}
        >
          <div style={{
            width : 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: `var(--${tint}10)`,
            border : `2px solid var(--${tint}8)`,
            boxShadow: `0 0 4px var(--${tint}6)`,
            cursor: 'pointer',
            ...it.location.style
          }}/>
        </Marker>
      ))
  , [locationItems, tint])

  const geojson = useMemo(() => ({
    type: 'FeatureCollection',
    features: locationItems
      .filter(it => it.location.options?.mode === 'geo')
      .map(it => {
        const { lat, lon, options = {} } = it.location
        const width = options.width || 100
        const height = options.height || 100
        return {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [createBox(parseFloat(lat), parseFloat(lon), width, height)]
          },
          properties: { id: it.modelItem.getId() }
        }
      })
  }), [locationItems])

  const addGeoLayer = useCallback(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    try {
      if (map.getLayer('geo-areas-layer')) map.removeLayer('geo-areas-layer')
      if (map.getSource('geo-areas')) map.removeSource('geo-areas')
    } catch {}

    map.addSource('geo-areas', {
      type: 'geojson',
      data: geojson
    })

    const symbolLayer = map.getStyle().layers?.find(l => l.type === 'symbol')

    map.addLayer({
      id: 'geo-areas-layer',
      type: 'fill',
      source: 'geo-areas',
      paint: {
        'fill-color': '#00aaff',
        'fill-opacity': 0.5,
        'fill-outline-color': '#0088dd'
      }
    }, symbolLayer?.id)
  }, [geojson])

  return (
    <Stack f={1} {...props}>
      {layerToggle && (
        <YStack pos="absolute" t={10} l={10} zi={10}>
          <button onClick={() => setSatellite(s => !s)}>
            {satellite ? '🗺️' : '🛰️'}
          </button>
        </YStack>
      )}

      {process.env.NEXT_PUBLIC_MAPBOX_TOKEN &&
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN !== 'PUT_HERE_YOUR_API_KEY' ? (
        <MapGL
          key={`map-${satellite}-${resolvedTheme}`} // 🔁 Forzar remount
          ref={map => {
            if (map && map.getMap) {
              mapRef.current = map.getMap()
            }
          }}
          onLoad={() => addGeoLayer()}
          onMove={evt => {
            const v = evt.viewState
            setViewport({ latitude: v.latitude, longitude: v.longitude, zoom: v.zoom })
          }}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          mapLib={import('mapbox-gl')}
          initialViewState={viewport}
          mapStyle={
            satellite
              ? "mapbox://styles/mapbox/satellite-streets-v12"
              : (resolvedTheme === 'dark'
                  ? 'mapbox://styles/mapbox/dark-v11'
                  : 'mapbox://styles/mapbox/light-v11')
          }
        >
          <GeolocateControl position="top-right" />
          <FullscreenControl position="top-right" />
          <NavigationControl position="top-right" />
          <Tinted>{pins}</Tinted>

          {popupInfo && (
            <Popup
              anchor="top"
              longitude={+popupInfo.location.lon}
              latitude={+popupInfo.location.lat}
              onClose={() => setPopupInfo(null)}
              closeButton={false}
              style={{ minWidth: 320 }}
            >
              <XStack f={1} ai="center">
                <EditableObject
                  initialData={getPendingResult('loaded', popupInfo.modelItem.read())}
                  name={popupInfo.modelItem.getId()}
                  spinnerSize={15}
                  loadingText={<YStack ai="center">Loading...</YStack>}
                  objectId={popupInfo.modelItem.getId()}
                  sourceUrl={`${sourceUrl}/${popupInfo.modelItem.getId()}`}
                  mode="preview"
                  model={model}
                  extraFields={extraFields}
                  icons={icons}
                  customFields={customFields}
                  columnWidth={290}
                  onDelete={onDelete}
                  deleteable={deleteable}
                  extraMenuActions={extraMenuActions}
                  onSave={() => {}}
                />
              </XStack>
            </Popup>
          )}
        </MapGL>
      ) : (
        <YStack f={1} ai="center" jc="center" space="$4">
          <Center>
            <AlertTriangle size="$7" />
            <H2 mt="$6">
              <Text>Missing </Text>
              <Tinted><Text color="var(--color10)">API Key</Text></Tinted>
            </H2>
            <Paragraph ta="center" mt="$6" size="$7">
              Map rendering is unavailable without a Mapbox access token.
            </Paragraph>
          </Center>
        </YStack>
      )}
    </Stack>
  )
}
