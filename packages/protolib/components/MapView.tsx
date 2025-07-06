import { MapViewGoogle } from './MapViewGoogle'
import { MapViewMapBox } from './MapViewMapBox'

export const MapView = ({
  preferred = 'google',
  ...props
}: {
  preferred?: 'google' | 'mapbox'
} & React.ComponentProps<typeof MapViewGoogle>) => {
  const hasGoogle = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_TOKEN && process.env.NEXT_PUBLIC_GOOGLE_MAPS_TOKEN !== 'PUT_HERE_YOUR_API_KEY'
  const hasMapbox = !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && process.env.NEXT_PUBLIC_MAPBOX_TOKEN !== 'PUT_HERE_YOUR_API_KEY'

  const useGoogle = preferred === 'google' && hasGoogle
  const useMapbox = preferred === 'mapbox' && hasMapbox

  if (useGoogle || (hasGoogle && !hasMapbox)) {
    return <MapViewGoogle {...props} />
  }

  if (useMapbox || (hasMapbox && !hasGoogle)) {
    return <MapViewMapBox {...props} />
  }

  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Missing Map API Key</h2>
      <p>
        Please define either <code>NEXT_PUBLIC_GOOGLE_MAPS_TOKEN</code> or <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>.
      </p>
    </div>
  )
}