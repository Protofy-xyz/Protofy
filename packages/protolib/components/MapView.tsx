import { Stack, StackProps, Text } from "tamagui"
import { useContext, useRef } from "react"
import { DataViewContext } from "./DataView"
import Map from 'react-map-gl'
import { useThemeSetting } from '@tamagui/next-theme'
import Center from "./Center"



export const MapView = ({ ...props }: any & StackProps) => {
  const { resolvedTheme } = useThemeSetting()
  const containerRef = useRef(null)
  const { items, model } = useContext(DataViewContext);
  const position = { lat: 53.54992, lng: 10.00678 }

  return (
    <Stack ref={containerRef} f={1}{...props}>
      {(process.env.NEXT_PUBLIC_MAPBOX_TOKEN && process.env.NEXT_PUBLIC_MAPBOX_TOKEN !== "PUT_HERE_YOUR_API_KEY") ? <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={import('mapbox-gl')}
        initialViewState={{
          latitude: 41.3947846,
          longitude: 2.1939663,
          zoom: 12
        }}
        style={{}}
        //mapStyle="mapbox://styles/mapbox/streets-v9"

        mapStyle={(resolvedTheme == 'dark') ? 'mapbox://styles/mapbox/dark-v9' : "mapbox://styles/mapbox/light-v9"}
      /> : <Text>Mapview is disabled: Missing mapbox api key</Text>}
    </Stack>)
}
