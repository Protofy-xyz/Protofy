export function getIcon(element: any) {
    var icon = 'Component'
    if (element?.craft?.custom && element?.craft?.custom.icon){
        icon = element.craft.custom.icon
    }
    return icon
}