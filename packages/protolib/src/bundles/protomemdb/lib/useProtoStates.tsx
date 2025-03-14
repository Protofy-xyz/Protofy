import { useState, useEffect, useRef } from 'react'
import { API } from 'protobase'
import { useEventEffect } from '../../events/hooks/useEventEffect'

export const useProtoStates = (initialState) => {
  const [state, setState] = useState(initialState)
  const timer = useRef(null)
  const readState = () => {
    API.get('/api/v1/protomemdb/').then((response) => setState(response.data))
  }
  useEffect(() => {
    readState()
  }, [])

  useEventEffect((event) => {
    if(timer.current) return
    timer.current = setTimeout(() => {
      readState()
      timer.current = null
    }, 500)
  }, { path: 'states/#' })

  return state
}
