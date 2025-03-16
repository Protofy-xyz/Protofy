import { useState, useEffect, useRef } from 'react'
import { API } from 'protobase'
import { useEventEffect } from '../../events/hooks/useEventEffect'

export const useProtoStates = (initialState, filter='states/#', chunk='states') => {
  const [state, setState] = useState(initialState);
  const timer = useRef(null);

  const readState = (chunk) => {
    API.get("/api/core/v1/protomemdb/"+chunk)
      .then((response) => setState(response.data))
      .catch((error) => console.error("Error al obtener datos:", error));
  };

  // Llamada inicial a `readState`
  useEffect(() => {
    readState(chunk);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  //skip subscription if filter is null or undefined
  if(filter === null || filter === undefined) {
    return state;
  }

  useEventEffect(
    (payload, msg) => {
      if (timer.current) return;

      timer.current = setTimeout(() => {
        readState(chunk);
        timer.current = null;
      }, 500);
    },
    { path: filter }
  );

  return state;
};