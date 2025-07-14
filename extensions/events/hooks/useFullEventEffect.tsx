import { useEffect } from 'react'
import { useEvent } from './useEvent'
import { API } from 'protobase'
import { useSession } from 'protolib/lib/useSession'

export const useFullEventEffect = (
  onEvent: (event: any) => void,
  eventFilter?: { path?: string; from?: string; user?: string },
  initialEvent?: boolean
) => {
  const [session] = useSession()

  // ✅ Escucha en tiempo real sin perder mensajes
  useEvent(eventFilter, onEvent)

  // ✅ Recupera último evento histórico si se solicita
  useEffect(() => {
    if (!initialEvent) return

    const readEvent = async () => {
      const userUrl = eventFilter?.user ? `&filter[user]=${eventFilter.user}` : ''
      const pathUrl = eventFilter?.path ? `&filter[path]=${eventFilter.path}` : ''
      const fromUrl = eventFilter?.from ? `&filter[from]=${eventFilter.from}` : ''
      const url = `/api/core/v1/events?x=1${fromUrl}${userUrl}${pathUrl}&itemsPerPage=1&token=${session.token}&orderBy=created&orderDirection=desc`

      const result = await API.get(url)
      if (result.isError) {
        console.error(result.error)
        return
      }

      const event = result.data?.items?.[0]
      if (!event) return

      event.message = JSON.stringify({ payload: event.payload })
      onEvent(event)
    }

    readEvent()
  }, [initialEvent, eventFilter?.path, eventFilter?.from, eventFilter?.user, session.token])
}
