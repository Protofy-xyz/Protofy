import { useState } from "react";
import { Button, XStack } from "@my/ui";
import Theme from "./Theme";

const BarButton = ({ icon = undefined, onPress, text = undefined, buttonProps = {}, id }) => {
    const [hovered, setHovered] = useState(false)
    return <XStack id={id} onPress={onPress}>
        <Button
            animation={"bouncy"}
            chromeless
            paddingHorizontal="$3"
            height="40px"
            fontSize="$5"
            borderRadius="$2"
            icon={icon}
            color={hovered && !buttonProps['theme'] ? Theme.interactiveColor : "white"}
            onMouseEnter={e => setHovered(true)}
            onMouseLeave={e => setHovered(false)}
            scaleIcon={1.5}
            {...buttonProps}
        >
            {text}
        </Button>
    </XStack>
}

export default ({ height, leftItems, rightItems, ...props }) => {
    return <XStack
        jc="space-between" ai="center"
        backgroundColor={Theme.nodeBackgroundColor}
        h={height} bbc="#cccccc20" bbw="1px"
        paddingHorizontal="$4"
        {...props}
    >
        <XStack ai="center" gap="$4">
            {
                leftItems.map((item, index) => <BarButton key={index} id={item.id} onPress={item.onPress} icon={item.icon} text={item.text} buttonProps={item.buttonProps} />)
            }
        </XStack>
        <XStack ai="center" gap="$4">
            {
                rightItems.map((item, index) => <BarButton key={index} id={item.id} onPress={item.onPress} icon={item.icon} text={item.text} buttonProps={item.buttonProps} />)
            }
        </XStack>
    </XStack>
}