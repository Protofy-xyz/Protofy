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

function deleteNestedKey(obj: any, path: string[]): any {
  if (!obj) return obj;
  if (path.length === 0) return obj;

  const [key, ...rest] = path;

  if (rest.length === 0) {
    const { [key]: _, ...restObj } = obj;
    return restObj;
  }

  const child = obj[key];
  const next = deleteNestedKey(child, rest);
  
  if (next == null || (typeof next === 'object' && Object.keys(next).length === 0)) {
    const { [key]: _, ...restObj } = obj;
    return restObj;
  }

  return { ...obj, [key]: next };
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
      const parts = msg.parsed.path?.split('/');
      if (!Array.isArray(parts) || parts.length < 2) return;

      const basePath = parts.slice(0, -1); // sin 'update'/'delete'
      if (basePath[0] !== chunk) return;   // p.ej. 'states'

      if (msg.topic.endsWith('/update')) {
        setState(prev => setNestedValue(prev, basePath.slice(1), msg.parsed.payload, chunk));
      }

      if (msg.topic.endsWith('/delete')) {
        // p.ej. ['states','boards','<boardId>','<stateName>'] -> borramos desde 'boards'
        setState(prev => deleteNestedKey(prev, basePath.slice(1)));
      }
    },
    { path: filter }
  );

  return state;
};