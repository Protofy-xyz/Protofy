import { useState, createElement } from "react";
import { Button, XStack } from "@my/ui";
import { useUITheme } from "./Theme";
import { MenuOption, UIMenu } from "./UIMenu";

const BarButton = ({ icon = undefined, onPress, text = undefined, buttonProps = {}, id, item = undefined }) => {
    const [hovered, setHovered] = useState(false)
    return <XStack id={id} onPress={onPress}>
        <UIMenu
            trigger={
                <Button
                    animation={"bouncy"}
                    chromeless
                    paddingHorizontal="$3"
                    height="40px"
                    fontSize="$5"
                    borderRadius="$2"
                    icon={createElement(icon, { fillOpacity: 0 })}
                    hoverStyle={{ backgroundColor: 'transparent' }}
                    color={hovered && !buttonProps['theme'] ? useUITheme('interactiveColor') : useUITheme('textColor')}
                    onMouseEnter={e => setHovered(true)}
                    onMouseLeave={e => setHovered(false)}
                    scaleIcon={1.5}
                    textProps={{ ...buttonProps['textProps'] }}
                    {...buttonProps}
                >
                    {text}
                </Button>
            }
            onOpenChange={() => null}
            content={item.menu ? item.menu.map((opt, i) => <MenuOption key={i} icon={opt.icon} name={opt.text} onClick={opt.onPress} />) : null}
            {...item.menuProps}
        />
    </XStack>
}

export default ({ height, leftItems, rightItems, ...props }) => {
    return <XStack
        jc="space-between" ai="center"
        backgroundColor={useUITheme('nodeBackgroundColor')}
        h={height} bbc={useUITheme('separatorColor')} bbw="1px"
        paddingHorizontal="$4"
        {...props}
    >
        <XStack ai="center" gap="$4">
            {
                leftItems.map((item, index) => <BarButton key={index} item={item} id={item.id} onPress={item.onPress} icon={item.icon} text={item.text} buttonProps={item.buttonProps} />)
            }
        </XStack>
        <XStack ai="center" gap="$4">
            {
                rightItems.map((item, index) => <BarButton key={index} item={item} id={item.id} onPress={item.onPress} icon={item.icon} text={item.text} buttonProps={item.buttonProps} />)
            }
        </XStack>
    </XStack>
}