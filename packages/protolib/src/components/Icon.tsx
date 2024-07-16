import {
    Component,
    Type,
    MousePointerSquare,
    LayoutGrid,
    Image,
    AlignStartVertical,
    AlignEndVertical,
    StretchVertical,
    AlignCenterVertical,
    ArrowRightFromLine,
    ArrowLeftFromLine,
    ArrowUpFromLine,
    ArrowDownFromLine,
    Bold,
    Italic,
    ArrowLeft,
    ArrowRight,
    AlignJustify,
    Wallpaper,
    Text,
} from '@tamagui/lucide-icons'

export const Icon = ({ name, color, size }) => {
    const iconProps = { color, size }
    switch (name) {
        case 'bold':
            return <Bold {...iconProps} />
        case 'italic':
            return <Italic {...iconProps} />
        case 'wallpaper':
            return <Wallpaper {...iconProps} />
        case 'row':
            return <ArrowRightFromLine {...iconProps} />
        case 'row-reverse':
            return <ArrowLeftFromLine {...iconProps} />
        case 'column-reverse':
            return <ArrowUpFromLine {...iconProps} />
        case 'column':
            return <ArrowDownFromLine {...iconProps} />
        case 'start':
            return <AlignStartVertical {...iconProps} />
        case 'end':
            return <AlignEndVertical {...iconProps} />
        case 'ArrowLeft':
        case 'left':
            return <ArrowLeft {...iconProps} />
        case 'ArrowRight':
        case 'right':
            return <ArrowRight {...iconProps} />
        case 'justify':
            return <AlignJustify {...iconProps} />
        case 'stretch':
            return <StretchVertical {...iconProps} />
        case 'center':
            return <AlignCenterVertical {...iconProps} />
        case 'text':
            return <Text {...iconProps} />
        case 'type':
            return <Type {...iconProps} />
        case 'media':
            return <Image {...iconProps} />
        case 'layout':
            return <LayoutGrid {...iconProps} />
        case 'pressable':
            return <MousePointerSquare {...iconProps} />
        default:
            return <Component {...iconProps} />
    }
};

export default Icon;