import { Paragraph, Tooltip as TamaTooltip } from "tamagui"

export const Tooltip = ({trigger, children, ...props}) => (
    <TamaTooltip {...props}>
        <TamaTooltip.Trigger>
        {trigger}
        </TamaTooltip.Trigger>
        <TamaTooltip.Content
        enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        scale={1}
        x={0}
        y={0}
        opacity={1}
        animation={[
            'quick',
            {
            opacity: {
                overshootClamping: true,
            },
            },
        ]}
        >
        <TamaTooltip.Arrow />
        <Paragraph size="$2" lineHeight="$1">
            {children}
        </Paragraph>
        </TamaTooltip.Content>
    </TamaTooltip>
)