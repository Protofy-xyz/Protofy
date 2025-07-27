import { useState, useEffect } from 'react'
import { API } from 'protobase'
import { useEventEffect } from '@extensions/events/hooks/useEventEffect'

function setNestedValue(obj, path, value, chunk) {
  if (path.length === 0) {
    return chunk === 'states' ? value.value : value;
  }
  const [key, ...rest] = path;
  return {
    ...obj,
    [key]: setNestedValue(obj?.[key] ?? {}, rest, value, chunk)
  };
}

export const useProtoStates = (initialState, filter = 'states/#', chunk = 'states') => {
  const [state, setState] = useState(initialState);

  const readState = (chunk) => {
    API.get("/api/core/v1/protomemdb/" + chunk)
      .then((response) => setState(response.data))
      .catch((error) => console.error("Error al obtener datos:", error));
  };

  useEffect(() => {
    readState(chunk);
  }, [chunk]);

  if (filter == null) return state;

  useEventEffect(
    (payload, msg) => {
      if (msg.topic.endsWith('/update')) {
        const path = msg.parsed.path?.split('/').slice(0, -1);
        if (Array.isArray(path) && path.length > 1 && path[0] === chunk) {
          setState(prev =>
            setNestedValue(prev, path.slice(1), msg.parsed.payload, chunk)
          );
        }
      }
    },
    { path: filter }
  );

  return state;
};