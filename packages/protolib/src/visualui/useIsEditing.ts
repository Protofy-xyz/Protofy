import { useSearchParams } from 'next/navigation'

export const useIsEditing = ()=> {
    const searchParams = useSearchParams()
    if(!searchParams) return false
    const edit = searchParams.get('_visualui_edit_')
    return edit
}