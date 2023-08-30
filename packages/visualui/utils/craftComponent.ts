export function getIcon(craftComponentName: string) {
    const icons = {
        Box: 'fullscreen',
        Row: 'reorder-vertical',
        Column: 'reorder-horizontal',
        Button: 'gesture-tap-button',
        Pressable: 'gesture-tap',
        Switch: 'toggle-switch-outline',
        Checkbox: 'checkbox-marked',
        Text: 'format-text',
        Input: 'form-textbox',
        TextArea: 'card-text-outline',
        Badge: 'text-recognition',
        Slider: 'ray-vertex',
        Divider: 'slash-forward',
        Progress: 'current-dc',
        Avatar: 'account-circle',
        FlatList: 'format-list-numbered',
        Fab: 'alpha-f-circle',
        Image: 'image-area',
        Select: 'form-dropdown',
        Menu: 'menu',
        Icon: 'emoticon-outline',
        Spinner: 'circle-slice-3',
        Link: 'link-variant',
        Radio: 'radiobox-marked',
        Alert: 'alert-circle-outline',
        Dialog: 'newspaper-variant-multiple',
        Toast: 'arrow-collapse-up'
    }
    return icons[craftComponentName] ?? "puzzle"
}