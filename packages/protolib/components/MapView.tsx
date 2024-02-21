import { Stack, StackProps } from "tamagui"
import { useContext, useRef } from "react"
import { DataViewContext } from "./DataView"
import Map from 'react-map-gl'
import { useThemeSetting } from '@tamagui/next-theme'


export const MapView = ({ ...props }: any & StackProps) => {
  const { resolvedTheme } = useThemeSetting()
  const containerRef = useRef(null)
  const { items, model } = useContext(DataViewContext);
  const position = { lat: 53.54992, lng: 10.00678 }

  return (
    <Stack ref={containerRef} f={1}{...props}>
      <Map
        mapboxAccessToken='YOUR API KEY'
        mapLib={import('mapbox-gl')}
        initialViewState={{
          latitude: 41.3947846,
          longitude: 2.1939663,
          zoom: 12
        }}
        style={{ }}
        //mapStyle="mapbox://styles/mapbox/streets-v9"

        mapStyle={(resolvedTheme == 'dark')?'mapbox://styles/mapbox/dark-v9':"mapbox://styles/mapbox/light-v9"}
      />
    </Stack>)
}
