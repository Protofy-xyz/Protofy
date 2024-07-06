import { useSearchParams } from 'next/navigation'

export const useIsEditing = ()=> {
    const searchParams = useSearchParams()
    const edit = searchParams.get('_visualui_edit_')
    return edit
}