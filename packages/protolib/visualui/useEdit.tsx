import { H2 } from 'tamagui'
import { useSearchParams } from 'next/navigation'

export const useEdit = (fn) => {
    const searchParams = useSearchParams()
    const edit = searchParams.get('_visualui_edit_')
    if (edit) {
      return <H2>Edit mode</H2>
    } else {
      return fn()
    }
  }