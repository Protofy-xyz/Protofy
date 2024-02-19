import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { EditorStore, useEditorContext } from "@protocraft/core";

export function newVisualUiContext(options: any) {
  return useEditorContext(options)
}

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