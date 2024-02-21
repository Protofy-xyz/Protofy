import { useState, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { EditorStore, useEditorContext } from "@protocraft/core";

// create craftjs context 
export function newVisualUiContext(options: any) {
  return useEditorContext(options)
}

// handle no contextAtom provided on UIEditor()
export function useVisualUiAtom(_atom: any) {
  const contextAtom = _atom ?? null
  return contextAtom ? useAtom(contextAtom) : [null, null]
}

// hook for visualUiState management
export function useVisualUi(atom, callb, defState) {
  const [state, setState] = useState(defState)
  const [craftContext] = useAtom<EditorStore>(atom)

  useEffect(() => {
    if (!craftContext || !craftContext['subscribe']) return

    craftContext.subscribe(
      (_) => {
        setState((prev: any) => {
          const result = callb(prev, craftContext)
          return result ?? prev
        })
      },
      () => {
        // we need to discover more about this callback
      }
    );
  }, [craftContext])

  return {
    state: state,
    visualUiData: craftContext,
    set: 'baby'
  }
}
